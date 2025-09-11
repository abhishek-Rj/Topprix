import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiShoppingBag,
  FiEye,
  FiTag,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import baseUrl from "../../hooks/baseurl";
import useAuthenticate from "../../hooks/authenticationt";
import Navigation from "../../components/navigation";
import Footer from "../../components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface DashboardData {
  totalStores: number;
  totalFlyers: number;
  totalCoupons: number;
  loading: boolean;
}

interface Flyer {
  id: string;
  title: string;
  description: string;
  isPremium: boolean;
  endDate: string;
}

interface Coupon {
  id: string;
  title: string;
  description: string;
  isOnline: boolean;
  endDate: string;
}

interface CategoryTrendsAnalytics {
  categoryInfo: {
    id: string;
    name: string;
    description: string;
  };
  performanceScore: {
    orderScore: number;
    rank: number;
    performanceLevel: string;
  };
}

interface CategoryTrendsResponse {
  analytics: CategoryTrendsAnalytics[];
  summary: {
    analysisTimeframe: string;
    totalCategoriesAnalyzed: number;
    topCategoriesShown: number;
    aggregateOrderMetrics: {
      totalOrdersAcrossCategories: number;
      totalCompletedOrders: number;
      totalEngagementScore: number;
      totalUniqueCustomers: number;
      averageOrderCompletionRate: number;
    };
    topPerformers: {
      mostOrders: string;
      highestEngagement: string;
      bestCompletion: string;
    };
  };
}

export default function RetailerDashboard() {
  const { t } = useTranslation();
  const { userRole } = useAuthenticate();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalStores: 0,
    totalFlyers: 0,
    totalCoupons: 0,
    loading: true,
  });

  const [recentFlyers, setRecentFlyers] = useState<Flyer[]>([]);
  const [recentCoupons, setRecentCoupons] = useState<Coupon[]>([]);
  const [categoryTrendsData, setCategoryTrendsData] = useState<
    CategoryTrendsAnalytics[]
  >([]);
  const [categorySummary, setCategorySummary] = useState<
    CategoryTrendsResponse["summary"] | null
  >(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail || userRole !== "RETAILER") return;

      try {
        setDashboardData((prev) => ({ ...prev, loading: true }));

        // First get the user ID from the backend
        const userResponse = await fetch(`${baseUrl}user/${userEmail}`);
        if (!userResponse.ok) return;

        const userData = await userResponse.json();
        const userId = userData?.user.id;

        if (!userId) return;

        // Fetch stores with ownerId
        const storesResponse = await fetch(
          `${baseUrl}stores?ownerId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "user-email": userEmail,
            },
          }
        );

        let totalStores = 0;
        if (storesResponse.ok) {
          const storesData = await storesResponse.json();
          totalStores = storesData.pagination?.totalItems || 0;
        }

        // Fetch flyers with ownerId for total count
        const flyersTotalResponse = await fetch(
          `${baseUrl}flyers?ownerId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "user-email": userEmail,
            },
          }
        );

        let totalFlyers = 0;
        if (flyersTotalResponse.ok) {
          const flyersTotalData = await flyersTotalResponse.json();
          totalFlyers = flyersTotalData.pagination?.totalCount || 0;
        }

        // Fetch flyers with ownerId for recent items
        const flyersResponse = await fetch(
          `${baseUrl}flyers?ownerId=${userId}&limit=3`,
          {
            headers: {
              "Content-Type": "application/json",
              "user-email": userEmail,
            },
          }
        );

        let recentFlyersData: Flyer[] = [];
        if (flyersResponse.ok) {
          const flyersData = await flyersResponse.json();
          recentFlyersData = flyersData.flyers?.slice(0, 3) || [];
        }

        // Fetch coupons with ownerId for total count
        const couponsTotalResponse = await fetch(
          `${baseUrl}coupons?ownerId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "user-email": userEmail,
            },
          }
        );

        let totalCoupons = 0;
        if (couponsTotalResponse.ok) {
          const couponsTotalData = await couponsTotalResponse.json();
          totalCoupons = couponsTotalData.pagination?.totalCount || 0;
        }

        // Fetch coupons with ownerId for recent items
        const couponsResponse = await fetch(
          `${baseUrl}coupons?ownerId=${userId}&limit=3`,
          {
            headers: {
              "Content-Type": "application/json",
              "user-email": userEmail,
            },
          }
        );

        let recentCouponsData: Coupon[] = [];
        if (couponsResponse.ok) {
          const couponsData = await couponsResponse.json();
          recentCouponsData = couponsData.coupons?.slice(0, 3) || [];
        }

        setDashboardData({
          totalStores,
          totalFlyers,
          totalCoupons,
          loading: false,
        });

        setRecentFlyers(recentFlyersData);
        setRecentCoupons(recentCouponsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [userRole]);

  // Fetch category trends data
  useEffect(() => {
    const fetchCategoryTrends = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) return;

      try {
        setCategoryLoading(true);
        const response = await fetch(`${baseUrl}analytics/categories/trends`, {
          headers: {
            "Content-Type": "application/json",
            "user-email": userEmail,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CategoryTrendsResponse = await response.json();
        setCategoryTrendsData(data.analytics);
        setCategorySummary(data.summary);
        setCategoryError(null);
      } catch (error) {
        console.error("Error fetching category trends:", error);
        setCategoryError(
          error instanceof Error
            ? error.message
            : "Failed to fetch category trends data"
        );
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategoryTrends();
  }, []);

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-gray-500">{t("dashboard.loading")}</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-2 sm:px-4 pt-20 sm:pt-24 lg:pt-20 pb-6 sm:pb-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-4 sm:p-6 bg-white border border-yellow-500 shadow-sm rounded-none">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {t("dashboard.title")}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {t("dashboard.subtitle")}
            </p>
            <div className="text-xs sm:text-sm text-gray-500 mt-2">
              {t("dashboard.lastUpdated")}: {new Date().toLocaleString()}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <a href="/explore/flyers" className="block">
              <Card className="bg-white border border-green-500 shadow-sm rounded-none hover:shadow-md transition-shadow h-full">
                <CardHeader className="pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiEye className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                    {t("dashboard.quickActions.viewFlyers")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {t("dashboard.quickActions.createAndManageFlyers")}
                  </p>
                </CardContent>
              </Card>
            </a>

            <a href="/explore/coupons" className="block">
              <Card className="bg-white border border-blue-500 shadow-sm rounded-none hover:shadow-md transition-shadow h-full">
                <CardHeader className="pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiTag className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                    {t("dashboard.quickActions.viewCoupons")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {t("dashboard.quickActions.createAndManageCoupons")}
                  </p>
                </CardContent>
              </Card>
            </a>

            <a href="/stores" className="block">
              <Card className="bg-white border border-orange-500 shadow-sm rounded-none hover:shadow-md transition-shadow h-full">
                <CardHeader className="pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                    {t("dashboard.quickActions.viewStores")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {t("dashboard.quickActions.createAndManageStores")}
                  </p>
                </CardContent>
              </Card>
            </a>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {/* Total Stores */}
            <Card className="bg-white border border-green-500 shadow-sm rounded-none">
              <CardHeader className="pb-2 p-3 sm:p-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <FiShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  {t("dashboard.totalStores")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {dashboardData.totalStores}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("dashboard.storesDescription")}
                </p>
              </CardContent>
            </Card>

            {/* Total Flyers */}
            <Card className="bg-white border border-orange-500 shadow-sm rounded-none">
              <CardHeader className="pb-2 p-3 sm:p-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <FiEye className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                  {t("dashboard.totalFlyers")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {dashboardData.totalFlyers}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("dashboard.flyersDescription")}
                </p>
              </CardContent>
            </Card>

            {/* Total Coupons */}
            <Card className="bg-white border border-red-500 shadow-sm rounded-none">
              <CardHeader className="pb-2 p-3 sm:p-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <FiTag className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                  {t("dashboard.totalCoupons")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {dashboardData.totalCoupons}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("dashboard.couponsDescription")}
                </p>
              </CardContent>
            </Card>

            {/* Total Content */}
            <Card className="bg-white border border-yellow-500 shadow-sm rounded-none">
              <CardHeader className="pb-2 p-3 sm:p-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <FiTrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                  {t("dashboard.totalContent")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {dashboardData.totalFlyers + dashboardData.totalCoupons}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("dashboard.contentDescription")}
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Recent Flyers and Coupons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Recent Flyers */}
            <Card className="bg-white border border-purple-500 shadow-sm rounded-none">
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <FiEye className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                  {t("dashboard.recentFlyers")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                {recentFlyers.length > 0 ? (
                  <div className="space-y-3">
                    {recentFlyers.map((flyer) => (
                      <div
                        key={flyer.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-none border"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {flyer.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-1 rounded-none ${
                                flyer.isPremium
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {flyer.isPremium
                                ? t("dashboard.isPremium")
                                : t("dashboard.inactive")}
                            </span>
                            <span className="text-xs text-gray-500">
                              {t("dashboard.expires")}:{" "}
                              {new Date(flyer.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiEye className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>{t("dashboard.noFlyers")}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Coupons */}
            <Card className="bg-white border border-indigo-500 shadow-sm rounded-none">
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <FiTag className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
                  {t("dashboard.recentCoupons")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                {recentCoupons.length > 0 ? (
                  <div className="space-y-3">
                    {recentCoupons.map((coupon) => (
                      <div
                        key={coupon.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-none border"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {coupon.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-1 rounded-none ${
                                coupon.isOnline
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {coupon.isOnline
                                ? t("dashboard.isOnline")
                                : t("dashboard.inactive")}
                            </span>
                            <span className="text-xs text-gray-500">
                              {t("dashboard.expires")}:{" "}
                              {new Date(coupon.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiTag className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>{t("dashboard.noCoupons")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Category Analytics Section */}
        {categoryLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white border border-gray-300 shadow-sm rounded-none">
              <CardContent className="p-4 sm:p-8">
                <div className="text-center">
                  <div className="text-gray-500">{t("dashboard.loading")}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : categoryError ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white border border-red-500 shadow-sm rounded-none">
              <CardContent className="p-4 sm:p-8">
                <div className="text-center">
                  <div className="text-red-500 mb-2">⚠️</div>
                  <div className="text-gray-900 font-semibold mb-2">
                    {t("dashboard.error")}
                  </div>
                  <div className="text-gray-600">{categoryError}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : categoryTrendsData.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
              {/* Category Performance Metrics */}
              <Card className="bg-white border border-emerald-500 shadow-sm rounded-none">
                <CardHeader className="pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiTrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                    {t("dashboard.categoryAnalytics.topPerformers")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">
                        {t("dashboard.categoryAnalytics.mostOrders")}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {categorySummary?.topPerformers.mostOrders || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">
                        {t("dashboard.categoryAnalytics.highestEngagement")}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {categorySummary?.topPerformers.highestEngagement ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">
                        {t("dashboard.categoryAnalytics.bestCompletion")}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {categorySummary?.topPerformers.bestCompletion || "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Overall Metrics */}
              <Card className="bg-white border border-cyan-500 shadow-sm rounded-none">
                <CardHeader className="pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiUsers className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-500" />
                    {t("dashboard.categoryAnalytics.overallMetrics")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">
                        {t("dashboard.categoryAnalytics.totalOrders")}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {categorySummary?.aggregateOrderMetrics
                          .totalOrdersAcrossCategories || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">
                        {t("dashboard.categoryAnalytics.totalCustomers")}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {categorySummary?.aggregateOrderMetrics
                          .totalUniqueCustomers || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">
                        {t("dashboard.categoryAnalytics.completionRate")}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {categorySummary?.aggregateOrderMetrics.averageOrderCompletionRate.toFixed(
                          1
                        ) || 0}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Period */}
              <Card className="bg-white border border-violet-500 shadow-sm rounded-none">
                <CardHeader className="pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiCalendar className="h-3 w-3 sm:h-4 sm:w-4 text-violet-500" />
                    {t("dashboard.categoryAnalytics.analysisPeriod")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">
                        {t("dashboard.categoryAnalytics.timeframe")}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {categorySummary?.analysisTimeframe || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">
                        {t("dashboard.categoryAnalytics.categoriesAnalyzed")}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {categorySummary?.totalCategoriesAnalyzed || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">
                        {t("dashboard.categoryAnalytics.topCategoriesShown")}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {categorySummary?.topCategoriesShown || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Performance Chart */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="bg-white border border-rose-500 shadow-sm rounded-none">
                  <CardHeader>
                    <CardTitle>
                      {t("dashboard.categoryAnalytics.categoryPerformance")}
                    </CardTitle>
                    <CardDescription>
                      {t(
                        "dashboard.categoryAnalytics.categoryPerformanceDescription"
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categoryTrendsData.slice(0, 5).map((category) => (
                        <div
                          key={category.categoryInfo.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-none border"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {category.categoryInfo.name}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">
                              {category.categoryInfo.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-xs px-2 py-1 rounded-none ${
                                  category.performanceScore.performanceLevel ===
                                  "high"
                                    ? "bg-green-100 text-green-800"
                                    : category.performanceScore
                                        .performanceLevel === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                Rank #{category.performanceScore.rank}
                              </span>
                              <span className="text-xs text-gray-500">
                                Score: {category.performanceScore.orderScore}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
              >
                <Card className="bg-white border border-lime-500 shadow-sm rounded-none">
                  <CardHeader>
                    <CardTitle>
                      {t("dashboard.categoryAnalytics.engagementDistribution")}
                    </CardTitle>
                    <CardDescription>
                      {t(
                        "dashboard.categoryAnalytics.engagementDistributionDescription"
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categoryTrendsData.map((category) => (
                        <div
                          key={category.categoryInfo.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-none border"
                        >
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {category.categoryInfo.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-xs px-2 py-1 rounded-none ${
                                  category.performanceScore.performanceLevel ===
                                  "high"
                                    ? "bg-green-100 text-green-800"
                                    : category.performanceScore
                                        .performanceLevel === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {category.performanceScore.performanceLevel}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="bg-white border border-gray-300 shadow-sm rounded-none">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="text-gray-500 mb-2">📊</div>
                  <div className="text-gray-900 font-semibold mb-2">
                    {t("dashboard.categoryAnalytics.noData")}
                  </div>
                  <div className="text-gray-600">
                    {t("dashboard.categoryAnalytics.noDataDescription")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
