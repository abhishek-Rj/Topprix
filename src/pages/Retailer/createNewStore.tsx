import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "../../components/navigation";
import CategorySelector from "./CategorySelector";
import useAuthenticate from "../../hooks/authenticationt";
import Loader from "../../components/loading";
import baseUrl from "../../hooks/baseurl";
import { toast } from "react-toastify";
import { FiHome, FiMapPin, FiEdit, FiImage } from "react-icons/fi";
import { FaStore } from "react-icons/fa";

export default function CreateNewStore() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { user, userRole, loading } = useAuthenticate();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultDescription = searchParams.get("description") || "";

  if (userRole === "USER") {
    navigate("/not-found");
  }
  useState(() => {
    if (defaultDescription) setDescription(defaultDescription);
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["image/jpeg", "image/png"].includes(file.type)) {
      setLogo(file);
    } else {
      alert("Only JPG or PNG files are allowed.");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !location) {
      alert("Please fill in all required fields.");
      return;
    }

    const storeData = {
      name,
      description,
      location,
      logo,
      categoryIds: selectedCategories,
    };

    try {
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
      navigate("/retailer-stores");
    } catch (error) {
      throw new Error("Error creating store");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <Navigation />
      <main className="pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl mx-auto p-10 transition-all duration-300 hover:shadow-yellow-200">
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
                    Create a New Store
                  </h2>
                  <p className="text-sm text-gray-700">
                    Fill in the details to launch your store presence
                  </p>
                </div>
              </div>
            </div>

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
                  Description <span className="text-red-500">*</span>
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
                    required
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiMapPin />
                  </span>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all group-hover:shadow-md hover:scale-105"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Store Logo (JPG or PNG)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <FiImage />
                  </span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="pl-10 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700 transition hover:scale-105"
                  />
                </div>
                {logo && (
                  <p className="mt-2 text-sm text-green-700">
                    Selected: {logo.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-yellow-300 opacity-10 rounded-xl blur-xl group-hover:opacity-20 transition-opacity duration-300"></span>
                <FaStore className="text-lg" />
                <span className="z-10">Launch Store</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
