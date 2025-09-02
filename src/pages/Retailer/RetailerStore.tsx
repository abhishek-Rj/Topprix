import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HiSearch, HiFilter, HiPencil, HiTrash, HiPlus } from "react-icons/hi";
import { motion } from "framer-motion";
import Navigation from "../../components/navigation";
import Footer from "../../components/Footer";
import Loader from "../../components/loading";
import useAuthenticate from "@/hooks/authenticationt";
import { toast } from "react-toastify";
import baseUrl from "@/hooks/baseurl";
import useClickOutside from "@/hooks/useClickOutside";
import { useTranslation } from "react-i18next";

interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  categories: Array<{
    id: string;
    name: string;
  }>;
  address: string;
  phone: string;
  email: string;
  website: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  stores: Store[];
}

export default function RetailerStores() {
  const { t } = useTranslation();
  const userRole = localStorage.getItem("userRole");
  const { user, loading } = useAuthenticate();
  const [stores, setStores] = useState<Store[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    stores: [],
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
  const [isNearbyMode, setIsNearbyMode] = useState<boolean>(false);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useClickOutside([buttonRef, menuRef], () => setMenuOpenId(null));

  const navigate = useNavigate();

  // Only redirect ADMIN users away from stores page
  if (userRole === "ADMIN") {
    navigate("/not-found");
  }

  const buildQueryString = () => {
    const params = new URLSearchParams();

    if (searchTerm) params.append("search", searchTerm);
    if (selectedCategories.length > 0)
      params.append("categoryIds", selectedCategories.join(","));
    if (limit) params.append("limit", limit.toString());
    if (currentPage) params.append("page", currentPage.toString());

    return params.toString();
  };

  const buildNearbyQueryString = () => {
    const params = new URLSearchParams();

    if (searchTerm) params.append("search", searchTerm);
    if (selectedCategories.length > 0)
      params.append("categoryIds", selectedCategories.join(","));
    if (limit) params.append("limit", limit.toString());
    if (currentPage) params.append("page", currentPage.toString());
    params.append("radius", "25"); // Default radius of 25km

    return params.toString();
  };

  const fetchStores = async (page: number = 1) => {
    setIsLoading(true);
    try {
      let url: string;
      let queryString: string;

      // Check if user has location data (for USER role and non-logged in users)
      const userLatitude = localStorage.getItem("userLatitude");
      const userLongitude = localStorage.getItem("userLongitude");
      const hasLocation =
        userLatitude &&
        userLongitude &&
        userLatitude !== "" &&
        userLongitude !== "";

      if (userRole === "USER" && hasLocation) {
        // Use nearby stores API for logged-in users with location
        queryString = buildNearbyQueryString();
        url = `${baseUrl}location/nearby-stores?latitude=${userLatitude}&longitude=${userLongitude}&${queryString}`;
        setIsNearbyMode(true);
      } else if (!user && hasLocation) {
        // Use nearby stores API for non-logged in users with location
        queryString = buildNearbyQueryString();
        url = `${baseUrl}location/nearby-stores?latitude=${userLatitude}&longitude=${userLongitude}&${queryString}`;
        setIsNearbyMode(true);
      } else {
        // Use regular stores API for all other cases
        queryString = buildQueryString();
        url = `${baseUrl}stores${queryString ? `?${queryString}` : ""}`;
        setIsNearbyMode(false);
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
      });

      const data = await response.json();

      // For RETAILER role, filter to show only their stores
      if (userRole === "RETAILER") {
        try {
          const fetchUser = await fetch(
            `${baseUrl}user/${localStorage.getItem("userEmail")}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "user-email": user?.email || "",
              },
            }
          );

          if (fetchUser.ok) {
            const userData = await fetchUser.json();
            const userId = userData.user.id;

            // Filter stores to show only those owned by the current retailer
            data.stores = data.stores.filter(
              (store: any) => store?.ownerId === userId
            );

            // Update pagination data for filtered results
            data.totalCount = data.stores.length;
            data.totalPages = Math.ceil(data.stores.length / (limit || 20));
          } else {
            console.error("Failed to fetch user data for retailer filtering");
            data.stores = [];
            data.totalCount = 0;
            data.totalPages = 1;
          }
        } catch (error) {
          console.error(
            "Error fetching user data for retailer filtering:",
            error
          );
          data.stores = [];
          data.totalCount = 0;
          data.totalPages = 1;
        }
      }

      if (data.stores) {
        setStores(data.stores);
        setPaginationData({
          totalCount: data.totalCount || 0,
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          stores: data.stores,
        });
      } else {
        throw new Error("No stores found");
      }
    } catch (error) {
      toast.error(t("stores.failedToFetchStores"));
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
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
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
        toast.success(t("stores.storeDeletedSuccessfully"));
        window.location.reload();
      } else {
        toast.error(t("stores.failedToDeleteStore"));
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
    <div
      className={`min-h-screen flex flex-col ${
        userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"
      }`}
    >
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>

      <main
        className={`flex-1 pt-20 pb-10 ${
          userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"
        }`}
      >
        <div
          className={`${
            userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"
          } rounded-2xl p-6 sm:p-8 border ${
            userRole === "ADMIN" ? "border-blue-100" : "border-yellow-100"
          } min-h-full`}
        >
          <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
            <div
              className={`bg-white rounded-2xl shadow-xl hover:shadow-${
                userRole === "ADMIN" ? "blue" : "yellow"
              }-200 p-6 sm:p-8 border ${
                userRole === "ADMIN" ? "border-blue-100" : "border-yellow-100"
              }`}
            >
              <div
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 ${
                  userRole === "ADMIN"
                    ? "bg-blue-100 border-blue-100"
                    : "bg-yellow-100 border-yellow-100"
                } border rounded-xl px-4 py-3 shadow-inner`}
              >
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 text-center sm:text-left w-full sm:w-auto">
                  {userRole === "ADMIN"
                    ? t("stores.allStores")
                    : userRole === "RETAILER"
                    ? t("stores.yourStores")
                    : t("stores.browseStores")}
                </h1>
                {(userRole === "RETAILER" || userRole === "ADMIN") && (
                  <button
                    onClick={() => navigate("/stores/create-new-store")}
                    className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-2 text-sm sm:text-base ${
                      userRole === "ADMIN"
                        ? "bg-blue-500 hover:bg-blue-700"
                        : "bg-yellow-500 hover:bg-yellow-700"
                    } hover:scale-105 text-white rounded-md transition`}
                  >
                    + {t("stores.createNewStore")}
                  </button>
                )}
              </div>

              {/* Nearby Stores Indicator */}
              {isNearbyMode && (userRole === "USER" || !user) && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-800 font-medium">
                      {t("stores.showingNearbyStores")}
                    </span>
                  </div>
                </div>
              )}

              {/* Search and Filters Section */}
              <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <div className="relative flex-1">
                    <HiSearch
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t("stores.searchPlaceholder")}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className={`flex-1 sm:flex-none px-4 py-2.5 sm:py-2 text-sm sm:text-base ${
                        userRole === "ADMIN"
                          ? "bg-blue-500 hover:bg-blue-700"
                          : "bg-yellow-500 hover:bg-yellow-700"
                      } text-white rounded-lg transition`}
                    >
                      {t("stores.search")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg flex items-center gap-2 text-sm sm:text-base ${
                        showFilters
                          ? userRole === "ADMIN"
                            ? "bg-blue-100 border-blue-300"
                            : "bg-yellow-100 border-yellow-300"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <HiFilter size={18} />
                      <span className="hidden sm:inline">
                        {t("stores.filters")}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Filters Panel */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 rounded-lg p-4 space-y-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={clearFilters}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                      >
                        {t("stores.clearFilters")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Stores Grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader />
                </div>
              ) : stores.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {stores.map((store) => (
                    <motion.div
                      key={store.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${
                        userRole === "ADMIN"
                          ? "border-blue-100"
                          : "border-yellow-100"
                      } overflow-hidden group relative`}
                    >
                      {/* Action Menu */}
                      {(userRole === "ADMIN" || userRole === "RETAILER") && (
                        <div className="absolute top-2 right-2 z-10">
                          <button
                            ref={buttonRef}
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenId(
                                menuOpenId === store.id ? null : store.id
                              );
                            }}
                            className="p-1 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
                          >
                            <HiPencil
                              className={
                                userRole === "ADMIN"
                                  ? "text-blue-600"
                                  : "text-yellow-600"
                              }
                              size={16}
                            />
                          </button>

                          {menuOpenId === store.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(store.id);
                                }}
                                className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                              >
                                <HiPencil
                                  className={
                                    userRole === "ADMIN"
                                      ? "text-blue-600"
                                      : "text-yellow-600"
                                  }
                                />
                                {t("stores.editDetails")}
                              </button>
                              {userRole === "ADMIN" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePrompt(store);
                                  }}
                                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                                >
                                  <HiTrash className="text-red-500" />
                                  {t("stores.delete")}
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
                          className={`h-32 sm:h-40 relative overflow-hidden ${
                            userRole === "ADMIN"
                              ? "bg-gradient-to-br from-blue-100 to-blue-200"
                              : "bg-gradient-to-br from-yellow-100 to-yellow-200"
                          }`}
                        >
                          {store.logo && store.logo.trim() !== "" ? (
                            <img
                              src={store.logo}
                              alt={`${store.name} logo`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to showing the first letter if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const fallback =
                                  target.parentElement?.querySelector(
                                    ".logo-fallback"
                                  ) as HTMLElement;
                                if (fallback) {
                                  fallback.style.display = "flex";
                                }
                              }}
                            />
                          ) : null}

                          {/* Fallback for when no logo or image fails to load */}
                          <div
                            className={`logo-fallback absolute inset-0 flex items-center justify-center ${
                              store.logo && store.logo.trim() !== ""
                                ? "hidden"
                                : "flex"
                            }`}
                          >
                            <span
                              className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                                userRole === "ADMIN"
                                  ? "text-blue-600/50"
                                  : "text-yellow-600/50"
                              }`}
                            >
                              {store.name.charAt(0).toUpperCase()}
                            </span>
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Content Section */}
                        <div
                          className={`flex-1 p-3 sm:p-3 lg:p-4 flex flex-col justify-between ${
                            userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"
                          }`}
                        >
                          <div>
                            <h2 className="text-base sm:text-base lg:text-lg xl:text-xl font-bold text-gray-900 mb-2 sm:mb-2 line-clamp-1">
                              {store.name}
                            </h2>
                            <p className="text-sm sm:text-sm text-gray-600 mb-2 sm:mb-2 lg:mb-3 line-clamp-3 sm:line-clamp-2">
                              {store.description ||
                                t("stores.noDescriptionAvailable")}
                            </p>
                          </div>

                          {/* Category Tags */}
                          <div className="flex flex-wrap gap-1.5 sm:gap-1.5">
                            {(store.categories || []).map(
                              (cat: any, idx: number) => (
                                <span
                                  key={cat.id || idx}
                                  className={`${
                                    userRole === "ADMIN"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  } px-2 sm:px-1.5 lg:px-2 py-1 sm:py-0.5 rounded-full text-xs font-medium`}
                                >
                                  #{cat.name}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-600 text-sm sm:text-base lg:text-lg py-12 sm:py-16">
                  {searchTerm || selectedCategories.length > 0 ? (
                    <div>
                      <p>{t("stores.noStoresFound")}</p>
                      <button
                        onClick={clearFilters}
                        className="mt-2 px-4 py-2 text-blue-600 hover:text-blue-800 underline text-sm sm:text-base"
                      >
                        {t("stores.clearFilters")}
                      </button>
                    </div>
                  ) : (
                    t("stores.noStoresYet")
                  )}
                </div>
              )}

              {/* Pagination Controls */}
              {paginationData.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : userRole === "ADMIN"
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                  >
                    {t("stores.previous")}
                  </button>
                  <span className="text-sm text-gray-600">
                    {t("stores.page")} {currentPage} {t("stores.of")}{" "}
                    {paginationData.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === paginationData.totalPages}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      currentPage === paginationData.totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : userRole === "ADMIN"
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                  >
                    {t("stores.next")}
                  </button>
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
              {t("stores.confirmDelete")}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              {t("stores.confirmDeleteText")}{" "}
              <span className="font-bold">{storeToDelete.name}</span>{" "}
              {t("stores.toConfirmDeletion")}
            </p>
            <input
              type="text"
              value={confirmStoreName}
              onChange={(e) => setConfirmStoreName(e.target.value)}
              className={`w-full border border-gray-300 px-3 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 ${
                userRole === "ADMIN"
                  ? "focus:ring-blue-500"
                  : "focus:ring-yellow-500"
              }`}
              placeholder={t("stores.enterStoreName")}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setConfirmDeleteId(null);
                  setStoreToDelete(null);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {t("stores.cancel")}
              </button>
              <button
                onClick={confirmDelete}
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                {t("stores.deleteStore")}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
