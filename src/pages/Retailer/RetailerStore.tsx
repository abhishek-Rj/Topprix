import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/navigation";
import Loader from "../../components/loading";
import useAuthenticate from "../../hooks/authenticationt";
import baseUrl from "../../hooks/baseurl";
import { toast } from "react-toastify";
//@ts-ignore
import { HiDotsVertical, HiPencil, HiTrash } from "react-icons/hi";
//@ts-ignore
import { MdCancel } from "react-icons/md";

import useClickOutside from "@/hooks/useClickOutside";
import Footer from "@/components/Footer";

export default function RetailerStores() {
  const { user, userRole, loading } = useAuthenticate();
  const [stores, setStores] = useState<any[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmStoreName, setConfirmStoreName] = useState("");
  const [storeToDelete, setStoreToDelete] = useState<any>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const threeDotRef = useRef(null);

  useClickOutside(threeDotRef, () => setMenuOpenId(null));

  const navigate = useNavigate();

  if (userRole === "USER") {
    navigate("/not-found");
  }

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(`${baseUrl}stores`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "user-email": user?.email || "",
          },
        });
        const data = await response.json();
        if (data.stores) {
          setStores(data.stores);
        } else {
          throw new Error("No stores found");
        }
      } catch (error) {
        toast.error("No stores found");
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  const handleDeletePrompt = (store: any) => {
    setStoreToDelete(store);
    setConfirmDeleteId(store.id);
    setConfirmStoreName("");
  };

  const confirmDelete = async () => {
    if (confirmStoreName !== storeToDelete.name) {
      toast.info("Store name does not match. Please try again.");
      setConfirmDeleteId(null);
      setStoreToDelete(null);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}store/${storeToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
      });

      if (response.ok) {
        toast.success("Store deleted successfully");
        window.location.reload();
      } else {
        toast.error("Failed to delete store");
        setConfirmDeleteId(null);
        setStoreToDelete(null);
        setMenuOpenId(null);
        throw new Error("Failed to delete store");
      }
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  const handleEdit = (storeId: string) => {
    navigate(`/stores/edit-store/${storeId}`);
  };

  return loading ? (
    <>
      <Navigation />
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    </>
  ) : (
    <div className="min-h-screen bg-yellow-50">
      <Navigation />
      <div className="bg-yellow-50 rounded-2xl shadow-xl p-6 sm:p-8 border border-yellow-100">
        <main className="pt-10">
          <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-yellow-200 p-6 sm:p-8 border border-yellow-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 bg-yellow-100 border border-yellow-100 rounded-xl px-4 py-3 shadow-inner">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {userRole === "USER" || userRole === null
                    ? "All Stores"
                    : "Your Stores"}
                </h1>
                {(userRole === "RETAILER" || userRole === "ADMIN") && (
                  <button
                    onClick={() => navigate("/stores/create-new-store")}
                    className="w-full sm:w-auto px-5 py-2 bg-yellow-500 hover:scale-105 text-white rounded-md hover:bg-yellow-700 transition"
                  >
                    + Create New Store
                  </button>
                )}
              </div>

              {stores.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      className="relative aspect-square bg-white rounded-xl sm:rounded-2xl shadow-lg group overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:ring-2 hover:ring-yellow-400"
                    >
                      {/* Dropdown Menu */}
                      {(userRole === "RETAILER" || userRole === "ADMIN") && (
                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20">
                          <button
                            className="text-gray-500 hover:text-gray-700 bg-white/80 p-1 rounded-full backdrop-blur-sm"
                            onClick={() => {
                              setMenuOpenId(
                                menuOpenId === store.id ? null : store.id
                              );
                            }}
                          >
                            {menuOpenId === store.id ? (
                              <MdCancel className="text-red-600" size={20} />
                            ) : (
                              <HiDotsVertical size={20} />
                            )}
                          </button>

                          {menuOpenId === store.id && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
                              <button
                                onClick={() => handleEdit(store.id)}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <HiPencil className="text-yellow-600" />
                                Edit Details
                              </button>
                              {userRole === "ADMIN" && (
                                <button
                                  onClick={() => handleDeletePrompt(store)}
                                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                                >
                                  <HiTrash className="text-red-500" />
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card Content */}
                      <div
                        className="cursor-pointer h-full flex flex-col"
                        onClick={() => navigate(`/stores/store/${store.id}`)}
                      >
                        {/* Logo/Image Section */}
                        <div
                          className="h-1/2 relative bg-gradient-to-br from-yellow-100 to-yellow-200"
                          style={{
                            backgroundImage: store.logo
                              ? `url(${store.logo})`
                              : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          {!store.logo && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-3xl sm:text-4xl text-yellow-600/50">
                                {store.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between bg-yellow-50">
                          <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-1">
                              {store.name}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                              {store.description || "No description available."}
                            </p>
                          </div>

                          {/* Category Tags */}
                          <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {(store.categories || []).map(
                              (cat: any, idx: number) => (
                                <span
                                  key={cat.id || idx}
                                  className="bg-yellow-100 text-yellow-800 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium"
                                >
                                  #{cat.name}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-600 text-base sm:text-lg">
                  You haven't created any stores yet.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && storeToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              Confirm Delete
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              Type <span className="font-bold">{storeToDelete.name}</span> to
              confirm deletion.
            </p>
            <input
              type="text"
              value={confirmStoreName}
              onChange={(e) => setConfirmStoreName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter store name"
            />
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setConfirmDeleteId(null);
                  setStoreToDelete(null);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
