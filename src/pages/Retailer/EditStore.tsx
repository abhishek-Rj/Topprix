import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../../components/navigation";
import Loader from "../../components/loading";
import useAuthenticate from "../../hooks/authenticationt";
import baseUrl from "../../hooks/baseurl";
import CategorySelector from "./CategorySelector";
import { toast } from "react-toastify";
import { FaStore } from "react-icons/fa";
import {
  FiHome,
  FiMapPin,
  FiEdit,
  FiImage,
  FiGlobe,
  FiHash,
  FiCamera,
} from "react-icons/fi";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function EditStore() {
  const { id } = useParams<{ id: string }>();
  const { user, userRole, loading } = useAuthenticate();
  const [store, setStore] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const navigate = useNavigate();

  if (userRole === "USER") {
    navigate("/not-found");
  }

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch(`${baseUrl}store/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.id) {
          setStore(data);
          setName(data.name || "");
          setDescription(data.description || "");

          // Parse address components
          const addressParts = (data.address || "").split(", ");
          setAddress(addressParts.slice(0, -2).join(", ") || "");
          setZipCode(addressParts[addressParts.length - 2] || "");
          setCountry(addressParts[addressParts.length - 1] || "");

          setSelectedCategories(
            (data.categories || []).map((cat: any) => cat.id)
          );
          setLogoPreview(data.logo || null);
        } else {
          toast.error("Store not found");
          navigate("/retailer-stores");
        }
      } catch (error) {
        toast.error("Error fetching store details");
        navigate("/retailer-stores");
      }
    };
    if (id && user) fetchStore();
  }, [id, user, navigate]);

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
        setLogoPreview(URL.createObjectURL(file));
        setShowCropModal(false);
        setImageSrc(null);
      } catch (error) {
        toast.error("Error cropping image");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (
      !name ||
      !address ||
      !country ||
      !zipCode ||
      selectedCategories.length === 0
    ) {
      toast.error("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      const storeData: {
        name: string;
        description: string;
        address: string;
        categoryIds: string[];
        logo?: string;
      } = {
        name,
        description,
        address: `${address}, ${zipCode}, ${country}`,
        categoryIds: selectedCategories,
      };

      if (logo) {
        const toBase64 = (file: File) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
          });
        storeData.logo = await toBase64(logo);
      }

      const response = await fetch(`${baseUrl}store/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
        body: JSON.stringify(storeData),
      });

      const data = await response.json();
      if (data.store) {
        toast.success("Store updated successfully");
        navigate("/retailer-stores");
      } else {
        throw new Error("Failed to update store");
      }
    } catch (error) {
      toast.error("Error updating store");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !store) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50">
      <Navigation />
      <main className="pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-8">
            <div
              className="w-full h-30 sm:h-60 bg-cover bg-center rounded-xl flex items-center justify-center shadow-inner"
              style={{
                backgroundImage: `url('/editStore.png')`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              <div className="text-center bg-white/60 backdrop-blur-sm px-6 py-4 rounded-md shadow">
                <h2 className="text-3xl font-extrabold text-yellow-700 mb-1">
                  Edit Store Details
                </h2>
                <p className="text-sm text-gray-700">
                  Update your store information below
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl mx-auto p-10 transition-all duration-300 hover:shadow-yellow-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <CategorySelector
                selected={selectedCategories}
                onChange={setSelectedCategories}
              />

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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all group-hover:shadow-md hover:scale-105"
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
                    rows={4}
                    placeholder="Describe your store"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all group-hover:shadow-md hover:scale-105"
                  />
                </div>
              </div>

              <div className="space-y-4">
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all group-hover:shadow-md hover:scale-105"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="group relative flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      ZIP/Postal Code <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FiHash />
                      </span>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="ZIP/Postal Code"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all group-hover:shadow-md hover:scale-105"
                        required
                      />
                    </div>
                  </div>

                  <div className="group relative flex-1">
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all group-hover:shadow-md hover:scale-105 appearance-none"
                        required
                      >
                        <option value="">Select a country</option>
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

              <div className="flex flex-col items-center">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Store Logo
                </label>
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-yellow-500 bg-gray-100 flex items-center justify-center">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Store Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiImage className="w-12 h-12 text-gray-400" />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <FiCamera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
              </div>

              {/* Crop Modal */}
              {showCropModal && imageSrc && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-6 max-w-2xl w-full mx-4 shadow-2xl border border-yellow-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
                          className="max-h-[60vh] object-contain"
                        />
                      </ReactCrop>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCropModal(false);
                          setImageSrc(null);
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleCropComplete}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                      >
                        Apply Crop
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader />
                ) : (
                  <>
                    <span className="absolute inset-0 bg-yellow-300 opacity-10 rounded-xl blur-xl group-hover:opacity-20 transition-opacity duration-300"></span>
                    <FaStore className="text-lg" />
                    <span className="z-10">Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
