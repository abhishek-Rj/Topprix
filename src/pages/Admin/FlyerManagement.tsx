import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiFile,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiShoppingBag,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiClock,
} from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "../../components/navigation";
import Footer from "../../components/Footer";
import AdminFloatingSidebar from "../../components/AdminFloatingSidebar";
import { useAdminSidebar } from "../../contexts/AdminSidebarContext";
import baseUrl from "../../hooks/baseurl";
import { toast } from "react-toastify";

// Types for flyer management data
interface Flyer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  storeId: string;
  storeName?: string;
  ownerId: string;
  ownerName?: string;
}

function FlyerManagementContent() {
  const { t } = useTranslation();
  const { isOpen } = useAdminSidebar();
  const [flyers, setFlyers] = useState<Flyer[]>([]);
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
    isActive: null as boolean | null,
    sortBy: "created_at",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Maximum 20 flyers per page as required

  const fetchFlyers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the exact same API call format as admin in Flyer.tsx
      let url = `${baseUrl}flyers?page=${currentPage}&limit=${itemsPerPage}`;

      // Add active/inactive filter
      if (filters.isActive !== null) {
        url += `&isActive=${filters.isActive}`;
      }

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

      // Handle the response format from the flyer pages
      setFlyers(data.flyers || []);

      // Normalize pagination data to match the expected format
      const apiPagination = data.pagination || {};
      setPagination({
        currentPage: apiPagination.currentPage || currentPage,
        totalPages: apiPagination.totalPages || 1,
        totalItems: apiPagination.totalItems || 0,
        itemsPerPage: apiPagination.itemsPerPage || itemsPerPage,
        hasNextPage: apiPagination.hasNextPage || false,
        hasPreviousPage: apiPagination.hasPreviousPage || false,
      });
    } catch (err) {
      console.error("Error fetching flyers:", err);
      setError(
        err instanceof Error ? err.message : t("flyerManagement.fetchError")
      );
      toast.error(t("flyerManagement.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const deleteFlyer = async (flyerId: string, flyerTitle: string) => {
    if (
      !window.confirm(t("flyerManagement.deleteConfirmation", { flyerTitle }))
    ) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}flyers/${flyerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem("userEmail") || "",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(t("flyerManagement.deleteSuccess", { flyerTitle }));
      fetchFlyers(); // Refresh the list
    } catch (err) {
      console.error("Error deleting flyer:", err);
      toast.error(t("flyerManagement.deleteError"));
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchFlyers();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isActive = (startDate: string, endDate: string) => {
    const now = new Date();
    return new Date(startDate) <= now && new Date(endDate) >= now;
  };

  useEffect(() => {
    fetchFlyers();
  }, [currentPage, filters.sortBy, filters.isActive]);

  if (loading && flyers.length === 0) {
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
                  {t("flyerManagement.loading")}
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
                  {t("flyerManagement.error")}
                </div>
                <div className="text-gray-600">{error}</div>
                <button
                  onClick={fetchFlyers}
                  className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                >
                  {t("flyerManagement.tryAgain")}
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
            <div className="p-4 sm:p-6 bg-white border border-teal-500 shadow-sm rounded-none">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {t("flyerManagement.title")}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {t("flyerManagement.subtitle")}
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
              <Card className="bg-white border border-teal-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiFile className="h-4 w-4 text-teal-500" />
                    {t("flyerManagement.statistics.totalFlyers")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {pagination.totalItems}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiClock className="h-4 w-4 text-green-500" />
                    {t("flyerManagement.statistics.activeFlyers")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {
                      flyers.filter((flyer) =>
                        isActive(flyer.startDate, flyer.endDate)
                      ).length
                    }
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-red-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 text-red-500" />
                    {t("flyerManagement.statistics.expiredFlyers")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {flyers.filter((flyer) => isExpired(flyer.endDate)).length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiShoppingBag className="h-4 w-4 text-blue-500" />
                    {t("flyerManagement.statistics.uniqueStores")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {new Set(flyers.map((flyer) => flyer.storeId)).size}
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
                  {t("flyerManagement.filters.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("flyerManagement.filters.search")}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange("search", e.target.value)
                        }
                        placeholder={t(
                          "flyerManagement.filters.searchPlaceholder"
                        )}
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                      <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                      >
                        <FiSearch className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("flyerManagement.filters.status")}
                    </label>
                    <select
                      value={
                        filters.isActive === null
                          ? "ALL"
                          : filters.isActive.toString()
                      }
                      onChange={(e) => {
                        const value =
                          e.target.value === "ALL"
                            ? null
                            : e.target.value === "true";
                        handleFilterChange("isActive", value);
                      }}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="ALL">
                        {t("flyerManagement.filters.allStatus")}
                      </option>
                      <option value="true">
                        {t("flyerManagement.filters.active")}
                      </option>
                      <option value="false">
                        {t("flyerManagement.filters.inactive")}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("flyerManagement.filters.sortBy")}
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange("sortBy", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="created_at">
                        {t("flyerManagement.filters.createdDate")}
                      </option>
                      <option value="title">
                        {t("flyerManagement.filters.title")}
                      </option>
                      <option value="start_date">
                        {t("flyerManagement.filters.startDate")}
                      </option>
                      <option value="end_date">
                        {t("flyerManagement.filters.endDate")}
                      </option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Flyers Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white border border-gray-300 shadow-sm rounded-none">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FiFile className="h-5 w-5 text-gray-600" />
                    {t("flyerManagement.table.title")} ({pagination.totalItems})
                  </span>
                  <button
                    onClick={fetchFlyers}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title={t("flyerManagement.table.refresh")}
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
                          {t("flyerManagement.table.flyer")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("flyerManagement.table.store")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("flyerManagement.table.status")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("flyerManagement.table.duration")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("flyerManagement.table.created")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("flyerManagement.table.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {flyers.map((flyer) => (
                        <tr
                          key={flyer.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {flyer.imageUrl ? (
                                <img
                                  src={flyer.imageUrl}
                                  alt={flyer.title}
                                  className="w-12 h-12 rounded object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                  <FiFileText className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">
                                  {flyer.title}
                                </div>
                                {flyer.description && (
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {flyer.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <FiShoppingBag className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {flyer.storeName ||
                                  t("flyerManagement.table.unknownStore")}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                isExpired(flyer.endDate)
                                  ? "bg-red-100 text-red-800"
                                  : isActive(flyer.startDate, flyer.endDate)
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {isExpired(flyer.endDate)
                                ? t("flyerManagement.table.expired")
                                : isActive(flyer.startDate, flyer.endDate)
                                ? t("flyerManagement.table.active")
                                : t("flyerManagement.table.upcoming")}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600">
                              <div>
                                {new Date(flyer.startDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {t("flyerManagement.table.to")}
                              </div>
                              <div>
                                {new Date(flyer.endDate).toLocaleDateString()}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(flyer.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  window.open(`/flyers/${flyer.id}`, "_blank")
                                }
                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                title={t("flyerManagement.table.viewFlyer")}
                              >
                                <FiEye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  deleteFlyer(flyer.id, flyer.title)
                                }
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title={t("flyerManagement.table.deleteFlyer")}
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
                      {t("flyerManagement.table.showing")}{" "}
                      {(pagination.currentPage - 1) * pagination.itemsPerPage +
                        1}{" "}
                      {t("flyerManagement.table.to")}{" "}
                      {Math.min(
                        pagination.currentPage * pagination.itemsPerPage,
                        pagination.totalItems
                      )}{" "}
                      {t("flyerManagement.table.of")} {pagination.totalItems}{" "}
                      {t("flyerManagement.table.results")}
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
                        {t("flyerManagement.table.page")}{" "}
                        {pagination.currentPage} {t("flyerManagement.table.of")}{" "}
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

export default function FlyerManagement() {
  return <FlyerManagementContent />;
}
