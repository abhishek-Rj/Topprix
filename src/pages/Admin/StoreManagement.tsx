import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiShoppingBag,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiEye,
  FiUser,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiFileText,
  FiTag,
} from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "../../components/navigation";
import Footer from "../../components/Footer";
import AdminFloatingSidebar from "../../components/AdminFloatingSidebar";
import { useAdminSidebar } from "../../contexts/AdminSidebarContext";
import baseUrl from "../../hooks/baseurl";
import { toast } from "react-toastify";

// Types for store management data
interface Store {
  id: string;
  name: string;
  logo: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  categories: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  subcategories: any[];
  owner: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  _count: {
    flyers: number;
    coupons: number;
    antiWasteItems: number;
  };
  stats: {
    flyersCount: number;
    couponsCount: number;
    antiWasteItemsCount: number;
  };
}

function StoreManagementContent() {
  const { t } = useTranslation();
  const { isOpen } = useAdminSidebar();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "created_at",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the new API endpoint format
      const url = `${baseUrl}stores?page=${currentPage}&limit=20`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem("userEmail") || "",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle the new response format
      setStores(data.stores || []);

      // Use pagination data directly from the response
      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 20,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );
    } catch (err) {
      console.error("Error fetching stores:", err);
      setError(
        err instanceof Error ? err.message : t("storeManagement.fetchError")
      );
      toast.error(t("storeManagement.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const deleteStore = async (storeId: string, storeName: string) => {
    if (
      !window.confirm(t("storeManagement.deleteConfirmation", { storeName }))
    ) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}store/${storeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem("userEmail") || "",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(t("storeManagement.deleteSuccess", { storeName }));
      fetchStores(); // Refresh the list
    } catch (err) {
      console.error("Error deleting store:", err);
      toast.error(t("storeManagement.deleteError"));
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchStores();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchStores();
  }, [currentPage, filters.sortBy]);

  if (loading && stores.length === 0) {
    return (
      <>
        <Navigation />
        <AdminFloatingSidebar />
        <main
          className={`pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen transition-all duration-300 ease-in-out ${
            isOpen ? "lg:ml-80" : "lg:ml-0"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-gray-500">
                  {t("storeManagement.loading")}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <AdminFloatingSidebar />
        <main
          className={`pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen transition-all duration-300 ease-in-out ${
            isOpen ? "lg:ml-80" : "lg:ml-0"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-500 mb-2">⚠️</div>
                <div className="text-gray-900 font-semibold mb-2">
                  {t("storeManagement.error")}
                </div>
                <div className="text-gray-600">{error}</div>
                <button
                  onClick={fetchStores}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  {t("storeManagement.tryAgain")}
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <AdminFloatingSidebar />
      <main
        className={`pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen transition-all duration-300 ease-in-out ${
          isOpen ? "lg:ml-80" : "lg:ml-0"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-4 sm:p-6 bg-white border border-orange-500 shadow-sm rounded-none">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {t("storeManagement.title")}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {t("storeManagement.subtitle")}
              </p>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white border border-orange-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiShoppingBag className="h-4 w-4 text-orange-500" />
                    {t("storeManagement.statistics.totalStores")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {pagination.totalItems}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiUser className="h-4 w-4 text-blue-500" />
                    {t("storeManagement.statistics.activeStores")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {
                      stores.filter(
                        (store) =>
                          store.stats.flyersCount > 0 ||
                          store.stats.couponsCount > 0
                      ).length
                    }
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiFileText className="h-4 w-4 text-green-500" />
                    {t("storeManagement.statistics.withFlyers")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {
                      stores.filter((store) => store.stats.flyersCount > 0)
                        .length
                    }
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-purple-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiTag className="h-4 w-4 text-purple-500" />
                    {t("storeManagement.statistics.withCoupons")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {
                      stores.filter((store) => store.stats.couponsCount > 0)
                        .length
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <Card className="bg-white border border-gray-300 shadow-sm rounded-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiFilter className="h-5 w-5 text-gray-600" />
                  {t("storeManagement.filters.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("storeManagement.filters.search")}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange("search", e.target.value)
                        }
                        placeholder={t(
                          "storeManagement.filters.searchPlaceholder"
                        )}
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                      >
                        <FiSearch className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("storeManagement.filters.sortBy")}
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange("sortBy", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="created_at">
                        {t("storeManagement.filters.createdDate")}
                      </option>
                      <option value="name">
                        {t("storeManagement.filters.name")}
                      </option>
                      <option value="updated_at">
                        {t("storeManagement.filters.updatedDate")}
                      </option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stores Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white border border-gray-300 shadow-sm rounded-none">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FiShoppingBag className="h-5 w-5 text-gray-600" />
                    {t("storeManagement.table.title")} ({pagination.totalItems})
                  </span>
                  <button
                    onClick={fetchStores}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title={t("storeManagement.table.refresh")}
                  >
                    <FiRefreshCw className="h-4 w-4" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("storeManagement.table.store")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("storeManagement.table.address")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("storeManagement.table.categories")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("storeManagement.table.content")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("storeManagement.table.created")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("storeManagement.table.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stores.map((store) => (
                        <tr
                          key={store.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {store.logo ? (
                                <img
                                  src={store.logo}
                                  alt={store.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <FiShoppingBag className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">
                                  {store.name}
                                </div>
                                {store.description && (
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {store.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <FiMapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600 truncate max-w-xs">
                                {store.address}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {store.categories.slice(0, 2).map((category) => (
                                <span
                                  key={category.id}
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                >
                                  {category.name}
                                </span>
                              ))}
                              {store.categories.length > 2 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  +{store.categories.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <FiFileText className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-gray-600">
                                  {store.stats.flyersCount}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FiTag className="h-4 w-4 text-purple-500" />
                                <span className="text-sm text-gray-600">
                                  {store.stats.couponsCount}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(store.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  window.open(
                                    `/stores/store/${store.id}`,
                                    "_blank"
                                  )
                                }
                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                title={t("storeManagement.table.viewStore")}
                              >
                                <FiEye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  deleteStore(store.id, store.name)
                                }
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title={t("storeManagement.table.deleteStore")}
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      {t("storeManagement.table.showing")}{" "}
                      {(pagination.currentPage - 1) * pagination.itemsPerPage +
                        1}{" "}
                      {t("storeManagement.table.to")}{" "}
                      {Math.min(
                        pagination.currentPage * pagination.itemsPerPage,
                        pagination.totalItems
                      )}{" "}
                      {t("storeManagement.table.of")} {pagination.totalItems}{" "}
                      {t("storeManagement.table.results")}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={!pagination.hasPreviousPage}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-600">
                        {t("storeManagement.table.page")}{" "}
                        {pagination.currentPage} {t("storeManagement.table.of")}{" "}
                        {pagination.totalPages}
                      </span>
                      <button
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={!pagination.hasNextPage}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function StoreManagement() {
  return <StoreManagementContent />;
}
