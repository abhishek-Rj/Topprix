import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "../../components/navigation";
import PredefinedCategorySelector from "@/components/PredefinedCategorySelector";
import useAuthenticate from "../../hooks/authenticationt";
import Loader from "../../components/loading";
import baseUrl from "../../hooks/baseurl";
import { toast } from "react-toastify";
import {
  FiHome,
  FiMapPin,
  FiEdit,
  FiImage,
  FiGlobe,
  FiHash,
  FiCamera,
} from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "../../context/firebaseProvider";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

export default function CreateNewStore() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  ); // Keep for backward compatibility, but not actively used
  const [subcategoryToCategoryMap, setSubcategoryToCategoryMap] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const { user, userRole, loading } = useAuthenticate();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultDescription = searchParams.get("description") || "";

  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  if (userRole === "USER") {
    navigate("/not-found");
  }

  useState(() => {
    if (defaultDescription) setDescription(defaultDescription);
  });

  // Build subcategory -> category mapping for deriving categoryId
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${baseUrl}categories/with-subcategories`);
        if (!res.ok) return;
        const data = await res.json();
        const source = data.categories || data || [];
        const map: Record<string, string> = {};
        if (Array.isArray(source)) {
          source.forEach((cat: any) => {
            (cat.subcategories || []).forEach((sub: any) => {
              if (sub?.id && cat?.id) map[sub.id] = cat.id;
            });
          });
        }
        setSubcategoryToCategoryMap(map);
      } catch (e) {
        // ignore mapping failures
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["image/jpeg", "image/png"].includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Only JPG or PNG files are allowed.");
    }
  };

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: Crop
  ): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set a consistent output size for the cropped image
    const outputSize = 400; // 400x400 pixels for the final logo
    canvas.width = outputSize;
    canvas.height = outputSize;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      outputSize,
      outputSize
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("Canvas is empty");
          }
          resolve(blob);
        },
        "image/jpeg",
        0.95
      ); // High quality JPEG
    });
  };

  const handleCropComplete = async () => {
    if (imageRef.current && crop) {
      try {
        const croppedImage = await getCroppedImg(imageRef.current, crop);
        const file = new File([croppedImage], "cropped-logo.jpg", {
          type: "image/jpeg",
        });
        setLogo(file);
        setShowCropModal(false);
        setImageSrc(null);
      } catch (error) {
        toast.error("Error cropping image");
      }
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageSrc(null);
    // Reset the file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleCropSkip = async () => {
    if (imageSrc) {
      try {
        // Convert the original image to a file without cropping
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], "original-logo.jpg", {
          type: "image/jpeg",
        });
        setLogo(file);
        setShowCropModal(false);
        setImageSrc(null);
      } catch (error) {
        toast.error("Error processing image");
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </>
    );
  }

  const getCoordinates = async (zip: string, countryCode: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/zip?zip=${zip},${countryCode}&appid=663dbc9ffe2e08f3f82073649c5a6373`
      );
      const data = await response.json();
      if (data.cod === "404") {
        throw new Error("Location not found");
      }
      return {
        lat: data.lat,
        lon: data.lon,
      };
    } catch (error) {
      throw new Error("Error getting coordinates");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !name ||
      !address ||
      !country ||
      !zipCode ||
      selectedCategories.length === 0
    ) {
      toast.error("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const coordinates = await getCoordinates(zipCode, country);

      let logoUrl = "";
      if (logo) {
        const fileRef = ref(
          storage,
          `store-logos/${user?.email + "_" + Date.now()}`
        );
        await uploadBytes(fileRef, logo);
        logoUrl = await getDownloadURL(fileRef);
      }

      // Derive a parent categoryId from selected subcategoryIds
      const parentCategoryIds = Array.from(
        new Set(
          selectedCategories
            .map((subId) => subcategoryToCategoryMap[subId])
            .filter((v): v is string => Boolean(v))
        )
      );

      if (parentCategoryIds.length === 0) {
        toast.error(
          "Please select at least one subcategory to infer category."
        );
        setIsLoading(false);
        return;
      }

      const storeData = {
        name,
        description,
        address: address + ", " + zipCode + ", " + country,
        logo: logoUrl,
        categoryIds: parentCategoryIds,
        latitude: coordinates.lat,
        longitude: coordinates.lon,
      };

      const createStore = await fetch(`${baseUrl}store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
        body: JSON.stringify(storeData),
      });

      const data = await createStore.json();
      if (!data.store) {
        throw new Error("Store creation failed");
      }
      toast.success("Store created successfully");
      navigate("/stores");
    } catch (error: any) {
      toast.error("Could not create store. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"
      }`}
    >
      <Navigation />
      <main className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl max-w-5xl mx-auto p-4 sm:p-6 md:p-10 transition-all duration-300 ${
              userRole === "ADMIN"
                ? "hover:shadow-blue-200"
                : "hover:shadow-yellow-200"
            }`}
          >
            {/* Header */}
            <div
              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 ${
                userRole === "ADMIN"
                  ? "bg-blue-100 border-blue-100"
                  : "bg-yellow-100 border-yellow-100"
              } border rounded-xl px-4 py-3 shadow-inner`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    userRole === "ADMIN" ? "bg-blue-500" : "bg-yellow-500"
                  } text-white`}
                >
                  <FaStore className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {t("stores.createNewStore")}
                  </h1>
                  <p className="text-sm text-gray-700">
                    Fill in the details to launch your store presence
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo and Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logo Upload */}
                <div
                  className={`flex flex-col items-center ${
                    userRole === "ADMIN"
                      ? "bg-blue-50/50 border-blue-100"
                      : "bg-yellow-50/50 border-yellow-100"
                  } p-4 rounded-xl border`}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t("store.storeLogo")}
                  </label>
                  <div className="relative group">
                    <div
                      className={`w-28 h-28 rounded-full overflow-hidden border-2 ${
                        userRole === "ADMIN"
                          ? "border-blue-500"
                          : "border-yellow-500"
                      } bg-gray-100 flex items-center justify-center`}
                    >
                      {logo ? (
                        <img
                          src={URL.createObjectURL(logo)}
                          alt="Store Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiImage className="w-10 h-10 text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <FiCamera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {t("store.clickToUpload")}
                  </p>
                </div>

                {/* Store Name and Description */}
                <div className="md:col-span-2 space-y-4">
                  <div className="group relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      {t("store.storeName")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FiHome />
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("store.storeName")}
                        className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 ${
                          userRole === "ADMIN"
                            ? "focus:ring-blue-500 focus:border-blue-500"
                            : "focus:ring-yellow-500 focus:border-yellow-500"
                        } transition-all group-hover:shadow-md`}
                        required
                      />
                    </div>
                  </div>

                  <div className="group relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      {t("store.description")}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-4 text-gray-400">
                        <FiEdit />
                      </span>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder={t("store.describeYourStore")}
                        className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 ${
                          userRole === "ADMIN"
                            ? "focus:ring-blue-500 focus:border-blue-500"
                            : "focus:ring-yellow-500 focus:border-yellow-500"
                        } transition-all group-hover:shadow-md`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t("store.address")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FiMapPin />
                    </span>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street Address"
                      className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 ${
                        userRole === "ADMIN"
                          ? "focus:ring-blue-500 focus:border-blue-500"
                          : "focus:ring-yellow-500 focus:border-yellow-500"
                      } transition-all group-hover:shadow-md`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      {t("store.zipCode")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FiHash />
                      </span>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder={t("store.zipCode")}
                        className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 ${
                          userRole === "ADMIN"
                            ? "focus:ring-blue-500 focus:border-blue-500"
                            : "focus:ring-yellow-500 focus:border-yellow-500"
                        } transition-all group-hover:shadow-md`}
                        required
                      />
                    </div>
                  </div>

                  <div className="group relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      {t("store.country")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FiGlobe />
                      </span>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 ${
                          userRole === "ADMIN"
                            ? "focus:ring-blue-500 focus:border-blue-500"
                            : "focus:ring-yellow-500 focus:border-yellow-500"
                        } transition-all group-hover:shadow-md appearance-none`}
                        required
                      >
                        <option value="">{t("store.selectCountry")}</option>
                        <optgroup label="Indian Ocean">
                          <option value="MU">🇲🇺 Mauritius</option>
                          <option value="RE">🇷🇪 Réunion</option>
                          <option value="MG">🇲🇬 Madagascar</option>
                          <option value="SC">🇸🇨 Seychelles</option>
                          <option value="KM">🇰🇲 Comoros</option>
                          <option value="YT">🇾🇹 Mayotte</option>
                        </optgroup>
                        <optgroup label="Africa">
                          <option value="ZA">🇿🇦 South Africa</option>
                          <option value="NG">🇳🇬 Nigeria</option>
                          <option value="EG">🇪🇬 Egypt</option>
                          <option value="KE">🇰🇪 Kenya</option>
                          <option value="GH">🇬🇭 Ghana</option>
                          <option value="MA">🇲🇦 Morocco</option>
                          <option value="TN">🇹🇳 Tunisia</option>
                          <option value="DZ">🇩🇿 Algeria</option>
                          <option value="ET">🇪🇹 Ethiopia</option>
                          <option value="UG">🇺🇬 Uganda</option>
                          <option value="TZ">🇹🇿 Tanzania</option>
                          <option value="ZW">🇿🇼 Zimbabwe</option>
                          <option value="BW">🇧🇼 Botswana</option>
                          <option value="NA">🇳🇦 Namibia</option>
                          <option value="ZM">🇿🇲 Zambia</option>
                          <option value="MW">🇲🇼 Malawi</option>
                          <option value="MZ">🇲🇿 Mozambique</option>
                          <option value="AO">🇦🇴 Angola</option>
                          <option value="CM">🇨🇲 Cameroon</option>
                          <option value="CI">🇨🇮 Côte d'Ivoire</option>
                          <option value="SN">🇸🇳 Senegal</option>
                          <option value="ML">🇲🇱 Mali</option>
                          <option value="BF">🇧🇫 Burkina Faso</option>
                          <option value="NE">🇳🇪 Niger</option>
                          <option value="TD">🇹🇩 Chad</option>
                          <option value="SD">🇸🇩 Sudan</option>
                          <option value="LY">🇱🇾 Libya</option>
                          <option value="RW">🇷🇼 Rwanda</option>
                          <option value="BI">🇧🇮 Burundi</option>
                          <option value="DJ">🇩🇯 Djibouti</option>
                          <option value="SO">🇸🇴 Somalia</option>
                          <option value="ER">🇪🇷 Eritrea</option>
                          <option value="SS">🇸🇸 South Sudan</option>
                          <option value="CF">🇨🇫 Central African Republic</option>
                          <option value="GQ">🇬🇶 Equatorial Guinea</option>
                          <option value="GA">🇬🇦 Gabon</option>
                          <option value="CG">🇨🇬 Republic of the Congo</option>
                          <option value="CD">🇨🇩 Democratic Republic of the Congo</option>
                          <option value="ST">🇸🇹 São Tomé and Príncipe</option>
                          <option value="CV">🇨🇻 Cape Verde</option>
                          <option value="GM">🇬🇲 Gambia</option>
                          <option value="GN">🇬🇳 Guinea</option>
                          <option value="GW">🇬🇼 Guinea-Bissau</option>
                          <option value="SL">🇸🇱 Sierra Leone</option>
                          <option value="LR">🇱🇷 Liberia</option>
                          <option value="TG">🇹🇬 Togo</option>
                          <option value="BJ">🇧🇯 Benin</option>
                          <option value="MR">🇲🇷 Mauritania</option>
                        </optgroup>
                        <optgroup label="Europe">
                          <option value="FR">🇫🇷 France</option>
                          <option value="GB">🇬🇧 United Kingdom</option>
                          <option value="DE">🇩🇪 Germany</option>
                          <option value="IT">🇮🇹 Italy</option>
                          <option value="ES">🇪🇸 Spain</option>
                          <option value="PT">🇵🇹 Portugal</option>
                          <option value="NL">🇳🇱 Netherlands</option>
                          <option value="BE">🇧🇪 Belgium</option>
                          <option value="SE">🇸🇪 Sweden</option>
                          <option value="NO">🇳🇴 Norway</option>
                          <option value="DK">🇩🇰 Denmark</option>
                          <option value="IE">🇮🇪 Ireland</option>
                          <option value="PL">🇵🇱 Poland</option>
                          <option value="RO">🇷🇴 Romania</option>
                          <option value="BG">🇧🇬 Bulgaria</option>
                          <option value="GR">🇬🇷 Greece</option>
                          <option value="CZ">🇨🇿 Czech Republic</option>
                          <option value="SK">🇸🇰 Slovakia</option>
                          <option value="HU">🇭🇺 Hungary</option>
                          <option value="RU">🇷🇺 Russia</option>
                          <option value="TR">🇹🇷 Turkey</option>
                          <option value="AT">🇦🇹 Austria</option>
                          <option value="CH">🇨🇭 Switzerland</option>
                          <option value="LU">🇱🇺 Luxembourg</option>
                          <option value="LI">🇱🇮 Liechtenstein</option>
                          <option value="MC">🇲🇨 Monaco</option>
                          <option value="SM">🇸🇲 San Marino</option>
                          <option value="VA">🇻🇦 Vatican City</option>
                          <option value="AD">🇦🇩 Andorra</option>
                          <option value="FI">🇫🇮 Finland</option>
                          <option value="IS">🇮🇸 Iceland</option>
                          <option value="EE">🇪🇪 Estonia</option>
                          <option value="LV">🇱🇻 Latvia</option>
                          <option value="LT">🇱🇹 Lithuania</option>
                          <option value="BY">🇧🇾 Belarus</option>
                          <option value="UA">🇺🇦 Ukraine</option>
                          <option value="MD">🇲🇩 Moldova</option>
                          <option value="RS">🇷🇸 Serbia</option>
                          <option value="ME">🇲🇪 Montenegro</option>
                          <option value="BA">🇧🇦 Bosnia and Herzegovina</option>
                          <option value="HR">🇭🇷 Croatia</option>
                          <option value="SI">🇸🇮 Slovenia</option>
                          <option value="MK">🇲🇰 North Macedonia</option>
                          <option value="AL">🇦🇱 Albania</option>
                          <option value="XK">🇽🇰 Kosovo</option>
                          <option value="MT">🇲🇹 Malta</option>
                          <option value="CY">🇨🇾 Cyprus</option>
                        </optgroup>
                        <optgroup label="Asia">
                          <option value="IN">🇮🇳 India</option>
                          <option value="CN">🇨🇳 China</option>
                          <option value="JP">🇯🇵 Japan</option>
                          <option value="KR">🇰🇷 South Korea</option>
                          <option value="TH">🇹🇭 Thailand</option>
                          <option value="VN">🇻🇳 Vietnam</option>
                          <option value="PH">🇵🇭 Philippines</option>
                          <option value="ID">🇮🇩 Indonesia</option>
                          <option value="MY">🇲🇾 Malaysia</option>
                          <option value="SG">🇸🇬 Singapore</option>
                          <option value="BD">🇧🇩 Bangladesh</option>
                          <option value="PK">🇵🇰 Pakistan</option>
                          <option value="LK">🇱🇰 Sri Lanka</option>
                          <option value="NP">🇳🇵 Nepal</option>
                          <option value="BT">🇧🇹 Bhutan</option>
                          <option value="MV">🇲🇻 Maldives</option>
                          <option value="MM">🇲🇲 Myanmar</option>
                          <option value="LA">🇱🇦 Laos</option>
                          <option value="KH">🇰🇭 Cambodia</option>
                          <option value="BN">🇧🇳 Brunei</option>
                          <option value="TL">🇹🇱 East Timor</option>
                          <option value="MN">🇲🇳 Mongolia</option>
                          <option value="KZ">🇰🇿 Kazakhstan</option>
                          <option value="UZ">🇺🇿 Uzbekistan</option>
                          <option value="TM">🇹🇲 Turkmenistan</option>
                          <option value="TJ">🇹🇯 Tajikistan</option>
                          <option value="KG">🇰🇬 Kyrgyzstan</option>
                          <option value="AF">🇦🇫 Afghanistan</option>
                          <option value="IR">🇮🇷 Iran</option>
                          <option value="IQ">🇮🇶 Iraq</option>
                          <option value="SY">🇸🇾 Syria</option>
                          <option value="LB">🇱🇧 Lebanon</option>
                          <option value="JO">🇯🇴 Jordan</option>
                          <option value="IL">🇮🇱 Israel</option>
                          <option value="PS">🇵🇸 Palestine</option>
                        </optgroup>
                        <optgroup label="Middle East">
                          <option value="SA">🇸🇦 Saudi Arabia</option>
                          <option value="AE">🇦🇪 United Arab Emirates</option>
                          <option value="QA">🇶🇦 Qatar</option>
                          <option value="KW">🇰🇼 Kuwait</option>
                          <option value="OM">🇴🇲 Oman</option>
                          <option value="BH">🇧🇭 Bahrain</option>
                          <option value="YE">🇾🇪 Yemen</option>
                        </optgroup>
                        <optgroup label="North America">
                          <option value="US">🇺🇸 United States</option>
                          <option value="CA">🇨🇦 Canada</option>
                          <option value="MX">🇲🇽 Mexico</option>
                          <option value="GT">🇬🇹 Guatemala</option>
                          <option value="BZ">🇧🇿 Belize</option>
                          <option value="SV">🇸🇻 El Salvador</option>
                          <option value="HN">🇭🇳 Honduras</option>
                          <option value="NI">🇳🇮 Nicaragua</option>
                          <option value="CR">🇨🇷 Costa Rica</option>
                          <option value="PA">🇵🇦 Panama</option>
                          <option value="CU">🇨🇺 Cuba</option>
                          <option value="JM">🇯🇲 Jamaica</option>
                          <option value="HT">🇭🇹 Haiti</option>
                          <option value="DO">🇩🇴 Dominican Republic</option>
                          <option value="PR">🇵🇷 Puerto Rico</option>
                          <option value="TT">🇹🇹 Trinidad and Tobago</option>
                          <option value="BB">🇧🇧 Barbados</option>
                          <option value="GD">🇬🇩 Grenada</option>
                          <option value="LC">🇱🇨 Saint Lucia</option>
                          <option value="VC">🇻🇨 Saint Vincent and the Grenadines</option>
                          <option value="AG">🇦🇬 Antigua and Barbuda</option>
                          <option value="KN">🇰🇳 Saint Kitts and Nevis</option>
                          <option value="DM">🇩🇲 Dominica</option>
                        </optgroup>
                        <optgroup label="South America">
                          <option value="BR">🇧🇷 Brazil</option>
                          <option value="AR">🇦🇷 Argentina</option>
                          <option value="CL">🇨🇱 Chile</option>
                          <option value="CO">🇨🇴 Colombia</option>
                          <option value="PE">🇵🇪 Peru</option>
                          <option value="VE">🇻🇪 Venezuela</option>
                          <option value="EC">🇪🇨 Ecuador</option>
                          <option value="BO">🇧🇴 Bolivia</option>
                          <option value="PY">🇵🇾 Paraguay</option>
                          <option value="UY">🇺🇾 Uruguay</option>
                          <option value="GY">🇬🇾 Guyana</option>
                          <option value="SR">🇸🇷 Suriname</option>
                          <option value="FK">🇫🇰 Falkland Islands</option>
                        </optgroup>
                        <optgroup label="Oceania">
                          <option value="AU">🇦🇺 Australia</option>
                          <option value="NZ">🇳🇿 New Zealand</option>
                          <option value="FJ">🇫🇯 Fiji</option>
                          <option value="PG">🇵🇬 Papua New Guinea</option>
                          <option value="SB">🇸🇧 Solomon Islands</option>
                          <option value="VU">🇻🇺 Vanuatu</option>
                          <option value="NC">🇳🇨 New Caledonia</option>
                          <option value="PF">🇵🇫 French Polynesia</option>
                          <option value="WS">🇼🇸 Samoa</option>
                          <option value="TO">🇹🇴 Tonga</option>
                          <option value="KI">🇰🇮 Kiribati</option>
                          <option value="TV">🇹🇻 Tuvalu</option>
                          <option value="NR">🇳🇷 Nauru</option>
                          <option value="PW">🇵🇼 Palau</option>
                          <option value="FM">🇫🇲 Micronesia</option>
                          <option value="MH">🇲🇭 Marshall Islands</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t("store.categories")}
                </label>
                <PredefinedCategorySelector
                  selectedCategories={selectedCategories}
                  selectedSubcategories={selectedSubcategories}
                  onCategoryChange={setSelectedCategories}
                  onSubcategoryChange={setSelectedSubcategories}
                  allowMultiple={true}
                />
              </div>

              {/* Crop Modal */}
              {showCropModal && imageSrc && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
                  <div
                    className={`bg-white rounded-xl sm:rounded-2xl shadow-2xl border-2 max-w-5xl w-full mx-2 sm:mx-4 max-h-[95vh] flex flex-col ${
                      userRole === "ADMIN"
                        ? "border-blue-200"
                        : "border-yellow-200"
                    }`}
                  >
                    {/* Header */}
                    <div
                      className={`px-4 sm:px-6 py-4 border-b ${
                        userRole === "ADMIN"
                          ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
                          : "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200"
                      } rounded-t-xl sm:rounded-t-2xl`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              userRole === "ADMIN"
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                            } text-white`}
                          >
                            <FiImage className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                              {t("store.cropYourLogo")}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {t("store.adjustCropArea")}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleCropCancel}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Crop Area */}
                    <div className="flex-1 overflow-hidden flex items-center justify-center p-4 sm:p-6 bg-gray-50">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div
                          className="crop-container relative"
                          style={{
                            width: "min(600px, 90vw)",
                            height: "min(400px, 60vh)",
                            maxWidth: "100%",
                            maxHeight: "100%",
                          }}
                        >
                          <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            aspect={1}
                            circularCrop
                            className="max-w-full max-h-full"
                          >
                            <img
                              ref={imageRef}
                              src={imageSrc}
                              alt="Crop preview"
                              className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                              style={{
                                width: "min(600px, 90vw)",
                                height: "min(400px, 60vh)",
                                objectFit: "contain",
                              }}
                              onLoad={() => {
                                // Reset crop to center when image loads
                                setCrop({
                                  unit: "%",
                                  width: 80,
                                  height: 80,
                                  x: 10,
                                  y: 10,
                                });
                              }}
                            />
                          </ReactCrop>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            userRole === "ADMIN"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        <span>{t("store.dragToAdjustCrop")}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-4 sm:px-6 py-4 bg-white border-t border-gray-200 rounded-b-xl sm:rounded-b-2xl">
                      <div className="flex flex-col sm:flex-row justify-between gap-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setCrop({
                                unit: "%",
                                width: 90,
                                height: 90,
                                x: 5,
                                y: 5,
                              });
                            }}
                            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                              userRole === "ADMIN"
                                ? "border-blue-200 text-blue-600 hover:bg-blue-50"
                                : "border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                            }`}
                          >
                            {t("store.resetCrop")}
                          </button>
                          <button
                            type="button"
                            onClick={handleCropSkip}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {t("store.skipCrop")}
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            type="button"
                            onClick={handleCropCancel}
                            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            {t("store.cancel")}
                          </button>
                          <button
                            type="button"
                            onClick={handleCropComplete}
                            className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-all hover:scale-105 shadow-md hover:shadow-lg ${
                              userRole === "ADMIN"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <FiCamera className="w-4 h-4" />
                              {t("store.applyCrop")}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Policy Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 mt-1">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-900 mb-2">
                      Protection de vos données
                    </h3>
                    <p className="text-xs text-blue-800 mb-3">
                      En créant un magasin, vos données sont traitées
                      conformément à notre{" "}
                      <a
                        href="/privacy"
                        className="text-blue-600 hover:underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Politique de Confidentialité
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>

              {/* General Conditions Notice */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="text-green-600 mt-1">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-green-900 mb-2">
                      Conditions Générales de Vente
                    </h3>
                    <p className="text-xs text-green-800 mb-3">
                      En créant un magasin, vous acceptez nos{" "}
                      <a
                        href="/general-conditions"
                        className="text-green-600 hover:underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Conditions Générales de Vente
                      </a>{" "}
                      et confirmez que le contenu respecte la législation en
                      vigueur.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/stores")}
                  className="px-6 py-2 rounded-md hover:scale-105 transition bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 ${
                    userRole === "ADMIN"
                      ? "bg-gradient-to-r from-blue-500 to-blue-700"
                      : "bg-gradient-to-r from-yellow-500 to-yellow-700"
                  } text-white font-semibold rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <>
                      <span
                        className={`absolute inset-0 ${
                          userRole === "ADMIN" ? "bg-blue-500" : "bg-yellow-500"
                        } opacity-10 rounded-md blur-xl group-hover:opacity-20 transition-opacity duration-300`}
                      ></span>
                      <span className="z-10">Launching...</span>
                    </>
                  ) : (
                    <>
                      <span
                        className={`absolute inset-0 ${
                          userRole === "ADMIN" ? "bg-blue-300" : "bg-yellow-300"
                        } opacity-10 rounded-md blur-xl group-hover:opacity-20 transition-opacity duration-300`}
                      ></span>
                      <FaStore className="text-lg" />
                      <span className="z-10">Launch Store</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
