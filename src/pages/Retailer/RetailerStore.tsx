import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/navigation";
import Loader from "../../components/loading";
import useAuthenticate from "../../hooks/authenticationt";
import baseUrl from "../../hooks/baseurl";
import { toast } from "react-toastify";
//@ts-ignore
import { HiDotsVertical, HiPencil, HiTrash, HiSearch, HiFilter } from "react-icons/hi";
//@ts-ignore
import { MdCancel, MdLocalHospital } from "react-icons/md";

import useClickOutside from "@/hooks/useClickOutside";
import Footer from "@/components/Footer";

interface Store {
  id: string;
  name: string;
  description: string;
  logo?: string;
  categories: Array<{ id: string; name: string }>;
}

interface PaginationData {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  stores: Store[];
}

export default function RetailerStores() {
  const userRole = localStorage.getItem("userRole");
  const { user, loading } = useAuthenticate();
  const [stores, setStores] = useState<Store[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    stores: []
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmStoreName, setConfirmStoreName] = useState("");
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  
  const threeDotRef = useRef(null);

  useClickOutside(threeDotRef, () => setMenuOpenId(null));

  const navigate = useNavigate();

  if (userRole === "USER") {
    navigate("/not-found");
  }

  const buildQueryString = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.append("search", searchTerm);
    if (selectedCategories.length > 0) params.append("categoryIds", selectedCategories.join(","));
    if (limit) params.append("limit", limit.toString());
    if (currentPage) params.append("page", currentPage.toString());
    
    return params.toString();
  };

  const fetchStores = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const queryString = buildQueryString();
      const url = `${baseUrl}stores${queryString ? `?${queryString}` : ""}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
      });
      
      const data = await response.json();
      
      if (data.stores) {
        setStores(data.stores);
        setPaginationData({
          totalCount: data.totalCount || 0,
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          stores: data.stores
        });
      } else {
        throw new Error("No stores found");
      }
    } catch (error) {
      toast.error("Failed to fetch stores");
      console.error("Error fetching stores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores(currentPage);
  }, [currentPage, searchTerm, selectedCategories, limit]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStores(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setLimit(20);
    setCurrentPage(1);
  };

  const handleDeletePrompt = (store: Store) => {
    setStoreToDelete(store);
    setConfirmDeleteId(store.id);
    setConfirmStoreName("");
  };

  const confirmDelete = async () => {
    if (confirmStoreName !== storeToDelete?.name) {
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
    <div className={`min-h-screen flex flex-col ${userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"}`}>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      
      <main className={`flex-1 pt-20 pb-10 ${userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"}`}>
        <div className={`${userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"} rounded-2xl p-6 sm:p-8 border ${userRole === "ADMIN" ? "border-blue-100" : "border-yellow-100"} min-h-full`}>
          <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
            <div className={`bg-white rounded-2xl shadow-xl hover:shadow-${userRole === "ADMIN" ? "blue" : "yellow"}-200 p-6 sm:p-8 border ${userRole === "ADMIN" ? "border-blue-100" : "border-yellow-100"}`}>
              <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 ${userRole === "ADMIN" ? "bg-blue-100 border-blue-100" : "bg-yellow-100 border-yellow-100"} border rounded-xl px-4 py-3 shadow-inner`}>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {userRole === "ADMIN"
                    ? "All Stores"
                    : "Your Stores"}
                </h1>
                {(userRole === "RETAILER" || userRole === "ADMIN") && (
                  <button
                    onClick={() => navigate("/stores/create-new-store")}
                    className={`w-full sm:w-auto px-5 py-2 ${userRole === "ADMIN" ? "bg-blue-500 hover:bg-blue-700" : "bg-yellow-500 hover:bg-yellow-700"} hover:scale-105 text-white rounded-md transition`}
                  >
                    + Create New Store
                  </button>
                )}
              </div>

              {/* Search and Filters Section */}
              <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search stores..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className={`px-4 py-2 ${userRole === "ADMIN" ? "bg-blue-500 hover:bg-blue-700" : "bg-yellow-500 hover:bg-yellow-700"} text-white rounded-lg transition`}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 ${showFilters ? (userRole === "ADMIN" ? "bg-blue-100 border-blue-300" : "bg-yellow-100 border-yellow-300") : "bg-white hover:bg-gray-50"}`}
                  >
                    <HiFilter size={18} />
                    Filters
                  </button>
                </form>

                {/* Filters Panel */}
                {showFilters && (
                  <div className={`p-4 border rounded-lg ${userRole === "ADMIN" ? "bg-blue-50 border-blue-200" : "bg-yellow-50 border-yellow-200"}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Results per page */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Results per page
                        </label>
                        <select
                          value={limit}
                          onChange={(e) => setLimit(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>
                    </div>
                    {/* Clear filters button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Summary */}
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {stores.length} of {paginationData.totalCount} stores
                </p>
                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    Loading...
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {Array.from({ length: limit }, (_, i) => (
                    <div
                      key={i}
                      className="relative aspect-square bg-white rounded-xl sm:rounded-2xl shadow-lg animate-pulse"
                    >
                      <div className="h-1/2 bg-gray-200 rounded-t-xl sm:rounded-t-2xl"></div>
                      <div className="h-1/2 p-3 sm:p-4 space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="flex gap-1">
                          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : stores.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      className={`relative aspect-square bg-white rounded-xl sm:rounded-2xl shadow-lg group overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:ring-2 ${userRole === "ADMIN" ? "hover:ring-blue-400" : "hover:ring-yellow-400"}`}
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
                                className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                              >
                                <HiPencil className={userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"} />
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
                          className={`h-1/2 relative ${userRole === "ADMIN" ? "bg-gradient-to-br from-blue-100 to-blue-200" : "bg-gradient-to-br from-yellow-100 to-yellow-200"}`}
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
                              <span className={`text-3xl sm:text-4xl ${userRole === "ADMIN" ? "text-blue-600/50" : "text-yellow-600/50"}`}>
                                {store.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Content Section */}
                        <div className={`flex-1 p-3 sm:p-4 flex flex-col justify-between ${userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"}`}>
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
                                  className={`${userRole === "ADMIN" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"} px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium`}
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
                <div className="text-center text-gray-600 text-base sm:text-lg py-16">
                  {searchTerm || selectedCategories.length > 0 ? (
                    <div>
                      <p>No stores found matching your criteria.</p>
                      <button
                        onClick={clearFilters}
                        className="mt-2 px-4 py-2 text-blue-600 hover:text-blue-800 underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    "You haven't created any stores yet."
                  )}
                </div>
              )}

              {/* Pagination Controls */}
              {paginationData.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    {/* Previous Page */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-md border ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : `${userRole === "ADMIN" ? "bg-blue-500 hover:bg-blue-700" : "bg-yellow-500 hover:bg-yellow-700"} text-white hover:scale-105 transition`
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, paginationData.totalPages) }, (_, i) => {
                        let pageNum;
                        if (paginationData.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= paginationData.totalPages - 2) {
                          pageNum = paginationData.totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 rounded-md border ${
                              currentPage === pageNum
                                ? `${userRole === "ADMIN" ? "bg-blue-500 text-white" : "bg-yellow-500 text-white"}`
                                : "bg-white text-gray-700 hover:bg-gray-50"
                            } transition`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    {/*    */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === paginationData.totalPages}
                      className={`px-3 py-2 rounded-md border ${
                        currentPage === paginationData.totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : `${userRole === "ADMIN" ? "bg-blue-500 hover:bg-blue-700" : "bg-yellow-500 hover:bg-yellow-700"} text-white hover:scale-105 transition`
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

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
              className={`w-full border border-gray-300 px-3 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 ${userRole === "ADMIN" ? "focus:ring-blue-500" : "focus:ring-yellow-500"}`}
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