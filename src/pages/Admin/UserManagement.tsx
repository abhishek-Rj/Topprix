import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiCalendar,
  FiUser,
  FiUserCheck,
  FiShoppingBag,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiEye,
  FiX,
  FiTrendingUp,
  FiClock,
  FiActivity,
} from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "../../components/navigation";
import Footer from "../../components/Footer";
import AdminFloatingSidebar from "../../components/AdminFloatingSidebar";
import { useAdminSidebar } from "../../contexts/AdminSidebarContext";
import baseUrl from "../../hooks/baseurl";
import { toast } from "react-toastify";

// Types for user management data
interface OwnedStore {
  id: string;
  name: string;
  address: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "RETAILER" | "USER";
  createdAt: string;
  updatedAt: string;
  ownedStores: OwnedStore[];
  preferredStores: any[];
  preferredCategories: any[];
  activityStatus: "active" | "inactive" | "recent";
  daysSinceLastActivity: number;
  daysSinceJoined: number;
  joinedRecently: boolean;
  _count?: {
    ownedStores: number;
    savedCoupons: number;
    savedFlyers: number;
    shoppingLists: number;
    wishlist: number;
  };
}

interface UserManagementResponse {
  message: string;
  data: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  statistics: {
    roleBreakdown: {
      users: number;
      retailers: number;
      admins: number;
      total: number;
    };
    activityStats: {
      activeLastWeek: number;
      activeLastMonth: number;
      newUsersThisWeek: number;
    };
    filteredResults: {
      totalFilteredUsers: number;
      averageAccountAge: number;
      activeUsersInResults: number;
    };
  };
  filters: {
    role: string;
    search: string | null;
    sortBy: string;
    sortOrder: string;
    isActive: boolean | null;
    dateFrom: string | null;
    dateTo: string | null;
    includeStats: boolean;
  };
}

function UserManagementContent() {
  const { t } = useTranslation();
  const { isOpen } = useAdminSidebar();
  const [users, setUsers] = useState<User[]>([]);
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
  const [statistics, setStatistics] = useState({
    roleBreakdown: { users: 0, retailers: 0, admins: 0, total: 0 },
    activityStats: {
      activeLastWeek: 0,
      activeLastMonth: 0,
      newUsersThisWeek: 0,
    },
    filteredResults: {
      totalFilteredUsers: 0,
      averageAccountAge: 0,
      activeUsersInResults: 0,
    },
  });

  // Filter states
  const [filters, setFilters] = useState({
    role: "ALL",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    isActive: null as boolean | null,
    dateFrom: "",
    dateTo: "",
    includeStats: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showStatsDialog, setShowStatsDialog] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filters.role !== "ALL") queryParams.append("role", filters.role);
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
      if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
      if (filters.isActive !== null)
        queryParams.append("isActive", filters.isActive.toString());
      if (filters.dateFrom) queryParams.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) queryParams.append("dateTo", filters.dateTo);
      if (filters.includeStats) queryParams.append("includeStats", "true");
      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", limit.toString());

      const response = await fetch(`${baseUrl}admin/users?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem("userEmail") || "",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UserManagementResponse = await response.json();
      setUsers(data.data);
      setPagination(data.pagination);
      setStatistics(data.statistics);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        err instanceof Error ? err.message : t("userManagement.fetchError")
      );
      toast.error(t("userManagement.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userName: string, userEmail: string) => {
    if (!window.confirm(t("userManagement.deleteConfirmation", { userName }))) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}user/delete/${userEmail}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem("userEmail") || "",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(t("userManagement.deleteSuccess", { userName }));
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(t("userManagement.deleteError"));
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewStats = (user: User) => {
    setSelectedUser(user);
    setShowStatsDialog(true);
  };

  const closeStatsDialog = () => {
    setShowStatsDialog(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, [
    currentPage,
    filters.role,
    filters.sortBy,
    filters.sortOrder,
    filters.isActive,
    filters.dateFrom,
    filters.dateTo,
  ]);

  if (loading && users.length === 0) {
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
                  {t("userManagement.loading")}
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
                  {t("userManagement.error")}
                </div>
                <div className="text-gray-600">{error}</div>
                <button
                  onClick={fetchUsers}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  {t("userManagement.tryAgain")}
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
        className={`pt-16 sm:pt-20 md:pt-24 lg:pt-20 pb-4 sm:pb-6 md:pb-8 lg:pb-10 px-2 sm:px-4 md:px-6 lg:px-8 bg-gray-50 min-h-screen transition-all duration-300 ease-in-out ${
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
            <div className="p-3 sm:p-4 md:p-6 bg-white border border-blue-500 shadow-sm rounded-none">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                {t("userManagement.title")}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">
                {t("userManagement.subtitle")}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader className="pb-1 sm:pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-1 sm:gap-2">
                    <FiUsers className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                    {t("userManagement.statistics.totalUsers")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-1 sm:pt-2">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {statistics.roleBreakdown.total}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                <CardHeader className="pb-1 sm:pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-1 sm:gap-2">
                    <FiUserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                    {t("userManagement.statistics.activeUsers")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-1 sm:pt-2">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {statistics.filteredResults.activeUsersInResults}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-purple-500 shadow-sm rounded-none">
                <CardHeader className="pb-1 sm:pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-1 sm:gap-2">
                    <FiUser className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                    {t("userManagement.statistics.retailers")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-1 sm:pt-2">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {statistics.roleBreakdown.retailers}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-orange-500 shadow-sm rounded-none">
                <CardHeader className="pb-1 sm:pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-1 sm:gap-2">
                    <FiCalendar className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                    {t("userManagement.statistics.newThisWeek")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-1 sm:pt-2">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {statistics.activityStats.newUsersThisWeek}
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
            className="mb-4 sm:mb-6 md:mb-8"
          >
            <Card className="bg-white border border-gray-300 shadow-sm rounded-none">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <FiFilter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  {t("userManagement.filters.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      {t("userManagement.filters.role")}
                    </label>
                    <select
                      value={filters.role}
                      onChange={(e) =>
                        handleFilterChange("role", e.target.value)
                      }
                      className="w-full p-2 text-xs sm:text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ALL">
                        {t("userManagement.filters.allRoles")}
                      </option>
                      <option value="USER">
                        {t("userManagement.filters.users")}
                      </option>
                      <option value="RETAILER">
                        {t("userManagement.filters.retailers")}
                      </option>
                      <option value="ADMIN">
                        {t("userManagement.filters.admins")}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      {t("userManagement.filters.search")}
                    </label>
                    <div className="flex gap-1 sm:gap-2">
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange("search", e.target.value)
                        }
                        placeholder={t(
                          "userManagement.filters.searchPlaceholder"
                        )}
                        className="flex-1 p-2 text-xs sm:text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={handleSearch}
                        className="px-2 sm:px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <FiSearch className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("userManagement.filters.sortBy")}
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange("sortBy", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="createdAt">
                        {t("userManagement.filters.createdDate")}
                      </option>
                      <option value="name">
                        {t("userManagement.filters.name")}
                      </option>
                      <option value="email">
                        {t("userManagement.filters.email")}
                      </option>
                      <option value="role">
                        {t("userManagement.filters.role")}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("userManagement.filters.order")}
                    </label>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) =>
                        handleFilterChange("sortOrder", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="desc">
                        {t("userManagement.filters.descending")}
                      </option>
                      <option value="asc">
                        {t("userManagement.filters.ascending")}
                      </option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white border border-gray-300 shadow-sm rounded-none">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FiUsers className="h-5 w-5 text-gray-600" />
                    {t("userManagement.table.title")} ({pagination.totalItems})
                  </span>
                  <button
                    onClick={fetchUsers}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title={t("userManagement.table.refresh")}
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
                          {t("userManagement.table.name")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("userManagement.table.email")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("userManagement.table.role")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("userManagement.table.status")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("userManagement.table.stores")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("userManagement.table.joined")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("userManagement.table.lastActivity")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          {t("userManagement.table.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">
                              {user.name}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {user.email}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                user.role === "ADMIN"
                                  ? "bg-red-100 text-red-800"
                                  : user.role === "RETAILER"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                user.activityStatus === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.activityStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <FiShoppingBag className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {user.ownedStores.length}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {user.daysSinceLastActivity}{" "}
                            {t("userManagement.table.daysAgo")}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewStats(user)}
                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                title={t("userManagement.table.viewUserStats")}
                              >
                                <FiEye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  deleteUser(user.name, user.email)
                                }
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title={t("userManagement.table.deleteUser")}
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
                      {t("userManagement.table.showing")}{" "}
                      {(pagination.currentPage - 1) * pagination.itemsPerPage +
                        1}{" "}
                      {t("userManagement.table.to")}{" "}
                      {Math.min(
                        pagination.currentPage * pagination.itemsPerPage,
                        pagination.totalItems
                      )}{" "}
                      {t("userManagement.table.of")} {pagination.totalItems}{" "}
                      {t("userManagement.table.results")}
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
                        {t("userManagement.table.page")}{" "}
                        {pagination.currentPage} {t("userManagement.table.of")}{" "}
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

      {/* User Stats Dialog */}
      {showStatsDialog && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-2 sm:p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto mt-12 sm:mt-16 md:mt-20"
          >
            <div className="p-3 sm:p-4 md:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                      {selectedUser.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeStatsDialog}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <FiUserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {t("userManagement.dialog.role")}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedUser.role === "ADMIN"
                        ? "bg-red-100 text-red-800"
                        : selectedUser.role === "RETAILER"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedUser.role}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiActivity className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {t("userManagement.dialog.activityStatus")}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedUser.activityStatus === "active" ||
                      selectedUser.activityStatus === "recent"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedUser.activityStatus === "recent"
                      ? t("userManagement.dialog.recent")
                      : selectedUser.activityStatus}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiCalendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {t("userManagement.dialog.joined")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedUser.daysSinceJoined}{" "}
                    {t("userManagement.dialog.days")} ago
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiClock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {t("userManagement.dialog.lastActivity")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {selectedUser.daysSinceLastActivity}{" "}
                    {t("userManagement.dialog.days")} ago
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedUser.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* User Statistics */}
              {selectedUser._count && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                    <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    {t("userManagement.dialog.userStatistics")}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                    <div className="bg-blue-50 p-2 sm:p-3 md:p-4 rounded-lg text-center">
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                        {selectedUser._count.ownedStores}
                      </div>
                      <div className="text-xs sm:text-sm text-blue-800">
                        {t("userManagement.dialog.ownedStores")}
                      </div>
                    </div>
                    <div className="bg-green-50 p-2 sm:p-3 md:p-4 rounded-lg text-center">
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                        {selectedUser._count.savedCoupons}
                      </div>
                      <div className="text-xs sm:text-sm text-green-800">
                        {t("userManagement.dialog.savedCoupons")}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-2 sm:p-3 md:p-4 rounded-lg text-center">
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
                        {selectedUser._count.savedFlyers}
                      </div>
                      <div className="text-xs sm:text-sm text-purple-800">
                        {t("userManagement.dialog.savedFlyers")}
                      </div>
                    </div>
                    <div className="bg-orange-50 p-2 sm:p-3 md:p-4 rounded-lg text-center">
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-orange-600">
                        {selectedUser._count.shoppingLists}
                      </div>
                      <div className="text-xs sm:text-sm text-orange-800">
                        {t("userManagement.dialog.shoppingLists")}
                      </div>
                    </div>
                    <div className="bg-pink-50 p-2 sm:p-3 md:p-4 rounded-lg text-center">
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-pink-600">
                        {selectedUser._count.wishlist}
                      </div>
                      <div className="text-xs sm:text-sm text-pink-800">
                        {t("userManagement.dialog.wishlistItems")}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Owned Stores */}
              {selectedUser.ownedStores &&
                selectedUser.ownedStores.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiShoppingBag className="w-5 h-5 text-blue-600" />
                      {t("userManagement.dialog.ownedStoresTitle")} (
                      {selectedUser.ownedStores.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedUser.ownedStores.map((store) => (
                        <div
                          key={store.id}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {store.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {store.address}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {t("userManagement.dialog.created")}{" "}
                                {new Date(store.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Overall Statistics */}
              <div className="border-t pt-4 sm:pt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                  <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  {t("userManagement.dialog.platformStatistics")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                      {t("userManagement.dialog.roleBreakdown")}
                    </h4>
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("userManagement.dialog.totalUsers")}
                        </span>
                        <span className="font-medium">
                          {statistics.roleBreakdown.total}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("userManagement.dialog.admins")}
                        </span>
                        <span className="font-medium">
                          {statistics.roleBreakdown.admins}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("userManagement.dialog.retailers")}
                        </span>
                        <span className="font-medium">
                          {statistics.roleBreakdown.retailers}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("userManagement.dialog.regularUsers")}
                        </span>
                        <span className="font-medium">
                          {statistics.roleBreakdown.users}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                      {t("userManagement.dialog.activityStats")}
                    </h4>
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("userManagement.dialog.activeLastWeek")}
                        </span>
                        <span className="font-medium">
                          {statistics.activityStats.activeLastWeek}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("userManagement.dialog.activeLastMonth")}
                        </span>
                        <span className="font-medium">
                          {statistics.activityStats.activeLastMonth}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("userManagement.dialog.newThisWeek")}
                        </span>
                        <span className="font-medium">
                          {statistics.activityStats.newUsersThisWeek}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("userManagement.dialog.avgAccountAge")}
                        </span>
                        <span className="font-medium">
                          {statistics.filteredResults.averageAccountAge}{" "}
                          {t("userManagement.dialog.days")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
                <button
                  onClick={closeStatsDialog}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {t("userManagement.dialog.close")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default function UserManagement() {
  return <UserManagementContent />;
}
