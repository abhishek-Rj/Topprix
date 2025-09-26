import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiGift,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiShoppingBag,
  FiTag,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiClock,
  FiPercent,
} from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "../../components/navigation";
import Footer from "../../components/Footer";
import AdminFloatingSidebar from "../../components/AdminFloatingSidebar";
import { useAdminSidebar } from "../../contexts/AdminSidebarContext";
import baseUrl from "../../hooks/baseurl";
import { toast } from "react-toastify";

// Types for coupon management data
interface Coupon {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  storeId: string;
  storeName?: string;
  ownerId: string;
  ownerName?: string;
  usageLimit?: number;
  usedCount?: number;
}

function CouponManagementContent() {
  const { t } = useTranslation();
  const { isOpen } = useAdminSidebar();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
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
  const itemsPerPage = 20; // Maximum 20 coupons per page as required

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the exact same API call format as admin in Coupon.tsx
      let url = `${baseUrl}coupons?page=${currentPage}&limit=${itemsPerPage}`;

      // Add active/inactive filter
      if (filters.isActive !== null) {
        url += `&active=${filters.isActive}`;
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

      // Handle the response format from the coupon pages
      setCoupons(data.coupons || []);

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
      console.error("Error fetching coupons:", err);
      setError(
        err instanceof Error ? err.message : t("couponManagement.fetchError")
      );
      toast.error(t("couponManagement.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (couponId: string, couponTitle: string) => {
    if (
      !window.confirm(t("couponManagement.deleteConfirmation", { couponTitle }))
    ) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}coupons/${couponId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem("userEmail") || "",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(t("couponManagement.deleteSuccess", { couponTitle }));
      fetchCoupons(); // Refresh the list
    } catch (err) {
      console.error("Error deleting coupon:", err);
      toast.error(t("couponManagement.deleteError"));
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCoupons();
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

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === "PERCENTAGE") {
      return `${coupon.discountValue}%`;
    } else {
      return `$${coupon.discountValue}`;
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [currentPage, filters.sortBy, filters.isActive]);

  if (loading && coupons.length === 0) {
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
                  {t("couponManagement.loading")}
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
                  {t("couponManagement.error")}
                </div>
                <div className="text-gray-600">{error}</div>
                <button
                  onClick={fetchCoupons}
                  className="mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
                >
                  {t("couponManagement.tryAgain")}
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
            <div className="p-4 sm:p-6 bg-white border border-pink-500 shadow-sm rounded-none">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {t("couponManagement.title")}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {t("couponManagement.subtitle")}
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
              <Card className="bg-white border border-pink-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiGift className="h-4 w-4 text-pink-500" />
                    {t("couponManagement.statistics.totalCoupons")}
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
                    {t("couponManagement.statistics.activeCoupons")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {
                      coupons.filter((coupon) =>
                        isActive(coupon.startDate, coupon.endDate)
                      ).length
                    }
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-red-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 text-red-500" />
                    {t("couponManagement.statistics.expiredCoupons")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {
                      coupons.filter((coupon) => isExpired(coupon.endDate))
                        .length
                    }
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiShoppingBag className="h-4 w-4 text-blue-500" />
                    {t("couponManagement.statistics.uniqueStores")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {new Set(coupons.map((coupon) => coupon.storeId)).size}
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
                  {t("couponManagement.filters.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("couponManagement.filters.search")}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange("search", e.target.value)
                        }
                        placeholder={t(
                          "couponManagement.filters.searchPlaceholder"
                        )}
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                      <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
                      >
                        <FiSearch className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("couponManagement.filters.status")}
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
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="ALL">
                        {t("couponManagement.filters.allStatus")}
                      </option>
                      <option value="true">
                        {t("couponManagement.filters.active")}
                      </option>
                      <option value="false">
                        {t("couponManagement.filters.inactive")}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("couponManagement.filters.sortBy")}
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange("sortBy", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="created_at">
                        {t("couponManagement.filters.createdDate")}
                      </option>
                      <option value="title">
                        {t("couponManagement.filters.title")}
                      </option>
                      <option value="start_date">
                        {t("couponManagement.filters.startDate")}
                      </option>
                      <option value="end_date">
                        {t("couponManagement.filters.endDate")}
                      </option>
                      <option value="discount_value">
                        {t("couponManagement.filters.discountValue")}
                      </option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Coupons Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white border border-gray-300 shadow-sm rounded-none">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FiGift className="h-5 w-5 text-gray-600" />
                    {t("couponManagement.table.title")} ({pagination.totalItems}
                    )
                  </span>
                  <button
                    onClick={fetchCoupons}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title={t("couponManagement.table.refresh")}
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
                          {t("couponManagement.table.coupon")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("couponManagement.table.store")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("couponManagement.table.discount")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("couponManagement.table.status")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("couponManagement.table.usage")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("couponManagement.table.duration")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("couponManagement.table.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((coupon) => (
                        <tr
                          key={coupon.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {coupon.imageUrl ? (
                                <img
                                  src={coupon.imageUrl}
                                  alt={coupon.title}
                                  className="w-12 h-12 rounded object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                  <FiTag className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">
                                  {coupon.title}
                                </div>
                                {coupon.description && (
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {coupon.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <FiShoppingBag className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {coupon.storeName ||
                                  t("couponManagement.table.unknownStore")}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <FiPercent className="h-4 w-4 text-green-500" />
                              <span className="font-medium text-green-600">
                                {formatDiscount(coupon)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                isExpired(coupon.endDate)
                                  ? "bg-red-100 text-red-800"
                                  : isActive(coupon.startDate, coupon.endDate)
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {isExpired(coupon.endDate)
                                ? t("couponManagement.table.expired")
                                : isActive(coupon.startDate, coupon.endDate)
                                ? t("couponManagement.table.active")
                                : t("couponManagement.table.upcoming")}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600">
                              {coupon.usedCount || 0}
                              {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600">
                              <div>
                                {new Date(
                                  coupon.startDate
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {t("couponManagement.table.to")}
                              </div>
                              <div>
                                {new Date(coupon.endDate).toLocaleDateString()}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  window.open(`/explore/coupons`, "_blank")
                                }
                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                title={t("couponManagement.table.viewCoupon")}
                              >
                                <FiEye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  deleteCoupon(coupon.id, coupon.title)
                                }
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title={t("couponManagement.table.deleteCoupon")}
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
                      {t("couponManagement.table.showing")}{" "}
                      {(pagination.currentPage - 1) * pagination.itemsPerPage +
                        1}{" "}
                      {t("couponManagement.table.to")}{" "}
                      {Math.min(
                        pagination.currentPage * pagination.itemsPerPage,
                        pagination.totalItems
                      )}{" "}
                      {t("couponManagement.table.of")} {pagination.totalItems}{" "}
                      {t("couponManagement.table.results")}
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
                        {t("couponManagement.table.page")}{" "}
                        {pagination.currentPage}{" "}
                        {t("couponManagement.table.of")} {pagination.totalPages}
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

export default function CouponManagement() {
  return <CouponManagementContent />;
}
