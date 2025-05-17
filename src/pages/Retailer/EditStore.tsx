import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../../components/navigation";
import Loader from "../../components/loading";
import useAuthenticate from "../../hooks/authenticationt";
import baseUrl from "../../hooks/baseurl";
import CategorySelector from "./CategorySelector";
import { toast } from "react-toastify";
import { FaStore } from "react-icons/fa";

export default function EditStore() {
  const { id } = useParams<{ id: string }>();
  const { user, userRole, loading } = useAuthenticate();
  const [store, setStore] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
          setLocation(data.location || "");
          setLatitude(data.latitude || "");
          setLongitude(data.longitude || "");
          setSelectedCategories(
            (data.categories || []).map((cat: any) => cat.id)
          );
          setLogoPreview(data.logoUrl || null);
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
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      toast.info("Only JPG or PNG files are allowed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!name || !description || !location) {
      toast.info("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    // Prepare store data
    const storeData: any = {
      name,
      description,
      location,
      latitude: latitude || null,
      longitude: longitude || null,
      categoryIds: selectedCategories,
    };

    // If logo is updated, handle file upload (assuming backend supports base64 or multipart)
    if (logo) {
      // Example: convert to base64 (adjust as per backend requirement)
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      storeData.logo = await toBase64(logo);
    }

    try {
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
      <main className="pt-20 pb-10 bg-yellow-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-8">
            <div
              className="w-full h-30 sm:h-60 bg-cover bg-center rounded-xl flex items-center justify-center shadow-inner"
              style={{
                backgroundImage: `url('/createStore.png')`,
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

          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl mx-auto p-10 transition-all duration-300 hover:shadow-yellow-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <CategorySelector
                selected={selectedCategories}
                onChange={setSelectedCategories}
              />

              {/* Store Name */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter store name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all group-hover:shadow-md hover:scale-105"
                  required
                />
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="What's this store about?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all group-hover:shadow-md hover:scale-105"
                  required
                />
              </div>

              {/* Location */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Area, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all group-hover:shadow-md hover:scale-105"
                  required
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Store Logo (JPG or PNG)
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700 transition hover:scale-105"
                />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="mt-2 h-16 rounded shadow object-cover"
                  />
                )}
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="e.g., 28.61"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all hover:scale-105"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="e.g., 77.23"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all hover:scale-105"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="relative inline-flex items-center justify-center w-full px-6 py-3 overflow-hidden text-white font-semibold transition bg-yellow-600 rounded-lg hover:bg-yellow-700 hover:scale-[1.02] disabled:opacity-60"
              >
                <span className="absolute inset-0 bg-yellow-300 opacity-10 rounded-xl blur-xl group-hover:opacity-20 transition-opacity duration-300"></span>
                <FaStore className="text-lg m-3" />
                <span className="z-10">
                  {submitting ? "Saving..." : "Save Changes"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
