import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiEye,
  FiHeart,
  FiShare2,
  FiCalendar,
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
const salesData = [
  { month: "Jan", sales: 12000, views: 4500, conversions: 320 },
  { month: "Feb", sales: 15000, views: 5200, conversions: 410 },
  { month: "Mar", sales: 18000, views: 6100, conversions: 520 },
  { month: "Apr", sales: 22000, views: 7300, conversions: 680 },
  { month: "May", sales: 25000, views: 8900, conversions: 750 },
  { month: "Jun", sales: 28000, views: 10200, conversions: 890 },
];

const categoryData = [
  { name: "Electronics", value: 35, color: "#3B82F6" },
  { name: "Fashion", value: 25, color: "#EF4444" },
  { name: "Home & Garden", value: 20, color: "#10B981" },
  { name: "Sports", value: 15, color: "#F59E0B" },
  { name: "Books", value: 5, color: "#8B5CF6" },
];

const storePerformance = [
  { store: "Main Store", revenue: 45000, customers: 1200, rating: 4.8 },
  { store: "Downtown", revenue: 32000, customers: 890, rating: 4.6 },
  { store: "Mall Location", revenue: 28000, customers: 750, rating: 4.4 },
];

const recentActivity = [
  {
    type: "New Coupon",
    title: "Summer Sale 20% Off",
    time: "2 hours ago",
    status: "active",
  },
  {
    type: "Flyer Update",
    title: "Weekly Deals Updated",
    time: "4 hours ago",
    status: "active",
  },
  {
    type: "Customer Review",
    title: "5-star review received",
    time: "6 hours ago",
    status: "positive",
  },
  {
    type: "Sales Milestone",
    title: "Monthly target achieved",
    time: "1 day ago",
    status: "success",
  },
];

export default function RetailerDashboard() {
  const { t } = useTranslation();
  const { user, userRole } = useAuthenticate();
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
      if (!user?.email || userRole !== "RETAILER") return;

      try {
        // First get the user ID from the backend
        const userResponse = await fetch(`${baseUrl}user/${user.email}`);
        if (!userResponse.ok) return;

        const userData = await userResponse.json();
        const userId = userData?.id;

        if (!userId) return;

        // Then fetch all stores and filter by ownerId
        const storesResponse = await fetch(`${baseUrl}stores`, {
          headers: {
            "Content-Type": "application/json",
            "user-email": user.email,
          },
        });

        if (storesResponse.ok) {
          const storesData = await storesResponse.json();
          const retailerStores =
            storesData.stores?.filter(
              (store: any) => store?.ownerId === userId
            ) || [];

          const totalStores = retailerStores.length;

          // Fetch flyers from retailer's stores
          let totalFlyers = 0;
          let totalCoupons = 0;
          let activeFlyers = 0;

          for (const store of retailerStores) {
            // Fetch flyers for this store
            const flyersResponse = await fetch(
              `${baseUrl}flyers?storeId=${store.id}&limit=1000`
            );
            if (flyersResponse.ok) {
              const flyersData = await flyersResponse.json();
              totalFlyers += flyersData.flyers?.length || 0;

              // Count active flyers
              const storeActiveFlyers =
                flyersData.flyers?.filter((flyer: any) => flyer.active === true)
                  .length || 0;
              activeFlyers += storeActiveFlyers;
            }

            // Fetch coupons for this store
            const couponsResponse = await fetch(
              `${baseUrl}coupons?storeId=${store.id}&limit=1000`
            );
            if (couponsResponse.ok) {
              const couponsData = await couponsResponse.json();
              const storeCoupons = couponsData.coupons?.length || 0;
              totalCoupons += storeCoupons;
            }
          }

          setDashboardData({
            totalStores,
            totalFlyers,
            totalCoupons,
            activeFlyers,
            loading: false,
          });

          // Set all stores for the Store Performance section
          setAllStores(retailerStores);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [user?.email, userRole]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
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
            <div className="p-8 rounded-3xl bg-gradient-to-r from-yellow-100/80 to-orange-100/80">
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

            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("dashboard.totalStores")}
                </CardTitle>
                <FiShoppingBag className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData.loading
                    ? "..."
                    : dashboardData.totalStores.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FiTrendingUp className="w-3 h-3 mr-1" />
                  Your Stores
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-red-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("dashboard.totalFlyers")}
                </CardTitle>
                <FiEye className="h-4 w-4 text-red-600" />
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

            <Card className="bg-white/80 backdrop-blur-sm border-yellow-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("dashboard.totalCoupons")}
                </CardTitle>
                <FiTag className="h-4 w-4 text-yellow-600" />
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
            {/* Sales Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t("dashboard.platformStats")}</CardTitle>
                  <CardDescription>
                    Monthly sales performance and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#F59E0B"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#EF4444"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t("dashboard.userDistribution")}</CardTitle>
                  <CardDescription>
                    Product category performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
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
                        {categoryData.map((entry, index) => (
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

          {/* Store Performance and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Store Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t("dashboard.allStores")}</CardTitle>
                  <CardDescription>All your stores</CardDescription>
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
                              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-yellow-600 font-semibold">
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
                    Latest store activities and updates
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
                                : activity.status === "active"
                                ? "bg-blue-100"
                                : activity.status === "positive"
                                ? "bg-yellow-100"
                                : "bg-gray-100"
                            }`}
                          >
                            {activity.status === "success" && (
                              <FiTrendingUp className="w-4 h-4 text-green-600" />
                            )}
                            {activity.status === "active" && (
                              <FiEye className="w-4 h-4 text-blue-600" />
                            )}
                            {activity.status === "positive" && (
                              <FiStar className="w-4 h-4 text-yellow-600" />
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
