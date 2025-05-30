import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "../../components/navigation";
import CategorySelector from "../Common/CategorySelector";
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

export default function CreateNewStore() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error("Canvas is empty");
        }
        resolve(blob);
      }, "image/jpeg");
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
        `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},${countryCode}&appid=663dbc9ffe2e08f3f82073649c5a6373`
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

      const storeData = {
        name,
        description,
        address: address + ", " + zipCode + ", " + country,
        logo: logoUrl,
        categoryIds: selectedCategories,
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
      toast.error(error.message || "Error creating store");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <Navigation />
      <main className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl max-w-5xl mx-auto p-4 sm:p-6 md:p-10 transition-all duration-300 hover:shadow-yellow-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 bg-yellow-100 border border-yellow-100 rounded-xl px-4 py-3 shadow-inner">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Create New Store
              </h1>
              <p className="text-sm text-gray-700">
                Fill in the details to launch your store presence
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo and Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logo Upload */}
                <div className="flex flex-col items-center bg-yellow-50/50 p-4 rounded-xl border border-yellow-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Store Logo
                  </label>
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-yellow-500 bg-gray-100 flex items-center justify-center">
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
                  <p className="mt-2 text-xs text-gray-500">Click to upload</p>
                </div>

                {/* Store Name and Description */}
                <div className="md:col-span-2 space-y-4">
                  <div className="group relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Store Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FiHome />
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Store Name"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all group-hover:shadow-md"
                        required
                      />
                    </div>
                  </div>

                  <div className="group relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Description
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-4 text-gray-400">
                        <FiEdit />
                      </span>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Describe your store"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all group-hover:shadow-md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
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
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all group-hover:shadow-md"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FiHash />
                      </span>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="ZIP Code"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all group-hover:shadow-md"
                        required
                      />
                    </div>
                  </div>

                  <div className="group relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FiGlobe />
                      </span>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all group-hover:shadow-md appearance-none"
                        required
                      >
                        <option value="">Select country</option>
                        <optgroup label="North America">
                          <option value="US">🇺🇸 United States</option>
                          <option value="CA">🇨🇦 Canada</option>
                        </optgroup>
                        <optgroup label="Europe">
                          <option value="GB">🇬🇧 United Kingdom</option>
                          <option value="FR">🇫🇷 France</option>
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
                        </optgroup>
                        <optgroup label="Middle East">
                          <option value="SA">🇸🇦 Saudi Arabia</option>
                          <option value="AE">🇦🇪 United Arab Emirates</option>
                          <option value="QA">🇶🇦 Qatar</option>
                          <option value="KW">🇰🇼 Kuwait</option>
                          <option value="OM">🇴🇲 Oman</option>
                          <option value="BH">🇧🇭 Bahrain</option>
                        </optgroup>
                        <optgroup label="Asia Pacific">
                          <option value="IN">🇮🇳 India</option>
                          <option value="AU">🇦🇺 Australia</option>
                          <option value="NZ">🇳🇿 New Zealand</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Store Categories <span className="text-red-500">*</span>
                </label>
                <CategorySelector
                  selected={selectedCategories}
                  onChange={setSelectedCategories}
                />
              </div>

              {/* Crop Modal */}
              {showCropModal && imageSrc && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-4 sm:p-6 max-w-2xl w-full mx-4 shadow-2xl border border-yellow-100">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                      Crop Your Logo
                    </h3>
                    <div className="mb-4">
                      <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        aspect={1}
                        circularCrop
                      >
                        <img
                          ref={imageRef}
                          src={imageSrc}
                          alt="Crop preview"
                          className="max-h-[50vh] sm:max-h-[60vh] object-contain"
                        />
                      </ReactCrop>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCropModal(false);
                          setImageSrc(null);
                        }}
                        className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleCropComplete}
                        className="w-full sm:w-auto px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                      >
                        Apply Crop
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
                  className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="absolute inset-0 bg-yellow-500 opacity-10 rounded-md blur-xl group-hover:opacity-20 transition-opacity duration-300"></span>
                      <span className="z-10">Launching...</span>
                    </>
                  ) : (
                    <>
                      <span className="absolute inset-0 bg-yellow-300 opacity-10 rounded-md blur-xl group-hover:opacity-20 transition-opacity duration-300"></span>
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
    </div>
  );
}
