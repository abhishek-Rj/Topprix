import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiShield,
  FiUsers,
  FiSettings,
  FiBarChart,
  FiDatabase,
  FiActivity,
  FiDollarSign,
  FiTrendingUp,
  FiEye,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiStar,
  FiTag,
} from "react-icons/fi";
import baseUrl from "../../hooks/baseurl";
import useAuthenticate from "../../hooks/authenticationt";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import Navigation from "../../components/navigation";
import Footer from "../../components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

// Mock data for charts
const platformStats = [
  { month: "Jan", users: 1200, stores: 45, revenue: 25000, campaigns: 180 },
  { month: "Feb", users: 1450, stores: 52, revenue: 32000, campaigns: 220 },
  { month: "Mar", users: 1680, stores: 58, revenue: 38000, campaigns: 260 },
  { month: "Apr", users: 1920, stores: 65, revenue: 45000, campaigns: 310 },
  { month: "May", users: 2180, stores: 72, revenue: 52000, campaigns: 360 },
  { month: "Jun", users: 2450, stores: 78, revenue: 58000, campaigns: 410 },
];

const userDistribution = [
  { name: "Retailers", value: 45, color: "#3B82F6" },
  { name: "Customers", value: 35, color: "#10B981" },
  { name: "Admins", value: 10, color: "#F59E0B" },
  { name: "Moderators", value: 10, color: "#EF4444" },
];

const topStores = [
  {
    name: "TechMart Electronics",
    revenue: 85000,
    users: 2400,
    rating: 4.9,
    status: "active",
  },
  {
    name: "Fashion Forward",
    revenue: 72000,
    users: 2100,
    rating: 4.7,
    status: "active",
  },
  {
    name: "Home & Garden Plus",
    revenue: 68000,
    users: 1900,
    rating: 4.6,
    status: "active",
  },
  {
    name: "Sports Central",
    revenue: 55000,
    users: 1600,
    rating: 4.5,
    status: "pending",
  },
];

const recentActivity = [
  {
    type: "New Store",
    title: "TechMart Electronics joined",
    time: "2 hours ago",
    status: "success",
  },
  {
    type: "User Registration",
    title: "500+ new users this week",
    time: "4 hours ago",
    status: "info",
  },
  {
    type: "Revenue Milestone",
    title: "Monthly target achieved",
    time: "6 hours ago",
    status: "success",
  },
  {
    type: "System Update",
    title: "Platform maintenance completed",
    time: "1 day ago",
    status: "warning",
  },
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthenticate();
  const [dashboardData, setDashboardData] = useState({
    totalStores: 0,
    totalFlyers: 0,
    totalCoupons: 0,
    activeFlyers: 0,
    loading: true,
  });
  const [allStores, setAllStores] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.email) return;

      try {
        // Fetch stores count
        const storesResponse = await fetch(`${baseUrl}stores`, {
          headers: {
            "Content-Type": "application/json",
            "user-email": user.email,
          },
        });
        const storesData = await storesResponse.json();
        const totalStores = storesData.stores?.length || 0;

        // Fetch flyers count
        const flyersResponse = await fetch(`${baseUrl}flyers?limit=1000`, {
          headers: {
            "Content-Type": "application/json",
            "user-email": user.email,
          },
        });
        const flyersData = await flyersResponse.json();
        const totalFlyers = flyersData.flyers?.length || 0;

        // Fetch coupons count
        const couponsResponse = await fetch(`${baseUrl}coupons?limit=1000`, {
          headers: {
            "Content-Type": "application/json",
            "user-email": user.email,
          },
        });
        const couponsData = await couponsResponse.json();
        const totalCoupons = couponsData.coupons?.length || 0;

        // Calculate active flyers (assuming flyers with active status)
        const activeFlyers =
          flyersData.flyers?.filter((flyer: any) => flyer.active === true)
            .length || 0;

        setDashboardData({
          totalStores,
          totalFlyers,
          totalCoupons,
          activeFlyers,
          loading: false,
        });

        // Set all stores for the Store Performance section
        setAllStores(storesData.stores || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [user?.email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-100/80 to-indigo-100/80">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {t("dashboard.title")}
              </h1>
              <p className="text-gray-600">{t("dashboard.welcome")}</p>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("dashboard.activeFlyers")}
                </CardTitle>
                <FiEye className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData.loading
                    ? "..."
                    : dashboardData.activeFlyers.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FiTrendingUp className="w-3 h-3 mr-1" />
                  Active Now
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-indigo-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("dashboard.totalStores")}
                </CardTitle>
                <FiDatabase className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData.loading
                    ? "..."
                    : dashboardData.totalStores.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FiTrendingUp className="w-3 h-3 mr-1" />
                  Total Stores
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("dashboard.totalFlyers")}
                </CardTitle>
                <FiEye className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData.loading
                    ? "..."
                    : dashboardData.totalFlyers.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FiTrendingUp className="w-3 h-3 mr-1" />
                  Total Flyers
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("dashboard.totalCoupons")}
                </CardTitle>
                <FiTag className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData.loading
                    ? "..."
                    : dashboardData.totalCoupons.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FiTrendingUp className="w-3 h-3 mr-1" />
                  Total Coupons
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Platform Stats Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t("dashboard.platformStats")}</CardTitle>
                  <CardDescription>
                    Monthly platform performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={platformStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="stores"
                        stackId="1"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* User Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t("dashboard.userDistribution")}</CardTitle>
                  <CardDescription>
                    User type distribution across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${((percent || 0) * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Top Stores and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Stores */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t("dashboard.allStores")}</CardTitle>
                  <CardDescription>All stores on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.loading ? (
                      <div className="text-center py-8 text-gray-500">
                        {t("dashboard.loading")}
                      </div>
                    ) : allStores.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {t("dashboard.noStores")}
                      </div>
                    ) : (
                      allStores.map((store, index) => (
                        <div
                          key={store.id || store.name || index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">
                                  {index + 1}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {store.name ||
                                  store.storeName ||
                                  "Unnamed Store"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {store.address ||
                                  store.location ||
                                  "Location not specified"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                store.status === "active" || store.isActive
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {store.status === "active" || store.isActive
                                ? t("dashboard.active")
                                : t("dashboard.inactive")}
                            </Badge>
                            <div className="flex items-center">
                              <FiMapPin className="w-4 h-4 text-gray-400" />
                              <span className="ml-1 text-sm text-gray-600">
                                {store.city || store.region || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
                  <CardDescription>
                    Latest platform activities and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              activity.status === "success"
                                ? "bg-green-100"
                                : activity.status === "warning"
                                ? "bg-yellow-100"
                                : activity.status === "info"
                                ? "bg-blue-100"
                                : "bg-gray-100"
                            }`}
                          >
                            {activity.status === "success" && (
                              <FiCheckCircle className="w-4 h-4 text-green-600" />
                            )}
                            {activity.status === "warning" && (
                              <FiAlertCircle className="w-4 h-4 text-yellow-600" />
                            )}
                            {activity.status === "info" && (
                              <FiActivity className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
