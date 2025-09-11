import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiShoppingBag,
  FiUser,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiStar,
  FiEye,
  FiHeart,
  FiTag,
  FiMapPin,
  FiClock,
  FiBarChart,
  FiPieChart,
  FiTarget,
  FiAward,
  FiActivity,
  FiDollarSign,
  FiUsers,
  FiFileText,
  FiZap,
  FiRefreshCw,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import Navigation from "../../components/navigation";
import Footer from "../../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthenticate from "../../hooks/authenticationt";
import baseUrl from "../../hooks/baseurl";

// Types for store analytics data
interface StoreInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  registrationDate: string;
  daysSinceRegistration: number;
}

interface OwnerInfo {
  hasOwner: boolean;
  ownerName: string;
  ownerRole: string;
  hasActiveSubscription: boolean;
}

interface Metrics {
  totalCoupons: number;
  totalFlyers: number;
  activeCoupons: number;
  activeFlyers: number;
  premiumCoupons: number;
  premiumFlyers: number;
  sponsoredFlyers: number;
  customerFavorites: number;
  categoryCount: number;
}

interface PerformanceScore {
  contentVolume: number;
  engagement: number;
  premiumContent: number;
  overall: number;
}

interface StoreAnalytics {
  storeInfo: StoreInfo;
  ownerInfo: OwnerInfo;
  metrics: Metrics;
  performanceScore: PerformanceScore;
}

interface StoreAnalyticsResponse {
  message: string;
  totalFound: number;
  analytics: StoreAnalytics[];
  summary: {
    totalStoresAnalyzed: number;
    averageMetrics: {
      couponsPerStore: number;
      flyersPerStore: number;
      favoritesPerStore: number;
    };
  };
}

export default function StoreAnalytics() {
  const { t } = useTranslation();
  const { user } = useAuthenticate();
  const [analyticsData, setAnalyticsData] =
    useState<StoreAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${baseUrl}api/analytics/stores/comprehensive`,
          {
            headers: {
              "user-email": user?.email || "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch store analytics");
        }

        const data: StoreAnalyticsResponse = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchStoreAnalytics();
    }
  }, [user?.email, baseUrl]);

  // Prepare chart data
  const storePerformanceData = analyticsData
    ? analyticsData.analytics.map((store) => ({
        name:
          store.storeInfo.name.length > 15
            ? store.storeInfo.name.substring(0, 15) + "..."
            : store.storeInfo.name,
        overall: store.performanceScore.overall,
        contentVolume: store.performanceScore.contentVolume,
        engagement: store.performanceScore.engagement,
        premiumContent: store.performanceScore.premiumContent,
        totalCoupons: store.metrics.totalCoupons,
        totalFlyers: store.metrics.totalFlyers,
      }))
    : [];

  const contentDistributionData = analyticsData
    ? [
        {
          name: t("storeAnalytics.contentTypes.coupons"),
          value:
            analyticsData.summary.averageMetrics.couponsPerStore *
            analyticsData.summary.totalStoresAnalyzed,
          color: "#3B82F6",
        },
        {
          name: t("storeAnalytics.contentTypes.flyers"),
          value:
            analyticsData.summary.averageMetrics.flyersPerStore *
            analyticsData.summary.totalStoresAnalyzed,
          color: "#10B981",
        },
        {
          name: t("storeAnalytics.contentTypes.favorites"),
          value:
            analyticsData.summary.averageMetrics.favoritesPerStore *
            analyticsData.summary.totalStoresAnalyzed,
          color: "#F59E0B",
        },
      ]
    : [];

  const registrationTrendData = analyticsData
    ? analyticsData.analytics
        .map((store) => ({
          date: new Date(store.storeInfo.registrationDate).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
            }
          ),
          stores: 1,
          daysSinceRegistration: store.storeInfo.daysSinceRegistration,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{t("storeAnalytics.loading")}</p>
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
        <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {t("storeAnalytics.error")}
                </h2>
                <p className="text-gray-600">{error}</p>
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
      <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="p-6 bg-white border border-blue-500 shadow-sm rounded-none">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t("storeAnalytics.title")}
              </h1>
              <p className="text-gray-600">{t("storeAnalytics.subtitle")}</p>
              <div className="mt-4 text-sm text-gray-500">
                {t("storeAnalytics.lastUpdated")}: {new Date().toLocaleString()}
              </div>
            </div>
          </motion.div>

          {/* Summary Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiShoppingBag className="h-4 w-4 text-blue-500" />
                    {t("storeAnalytics.summary.totalStores")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData?.summary.totalStoresAnalyzed || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("storeAnalytics.summary.storesAnalyzed")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiTag className="h-4 w-4 text-green-500" />
                    {t("storeAnalytics.summary.avgCoupons")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData?.summary.averageMetrics.couponsPerStore.toFixed(
                      1
                    ) || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("storeAnalytics.summary.perStore")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-purple-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiFileText className="h-4 w-4 text-purple-500" />
                    {t("storeAnalytics.summary.avgFlyers")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData?.summary.averageMetrics.flyersPerStore.toFixed(
                      1
                    ) || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("storeAnalytics.summary.perStore")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-orange-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiHeart className="h-4 w-4 text-orange-500" />
                    {t("storeAnalytics.summary.avgFavorites")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData?.summary.averageMetrics.favoritesPerStore.toFixed(
                      1
                    ) || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("storeAnalytics.summary.perStore")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Store Performance Chart */}
              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiBarChart className="h-5 w-5 text-blue-600" />
                    {t("storeAnalytics.charts.storePerformance")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={storePerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="overall"
                        fill="#3B82F6"
                        name={t("storeAnalytics.charts.overallScore")}
                      />
                      <Bar
                        dataKey="contentVolume"
                        fill="#10B981"
                        name={t("storeAnalytics.charts.contentVolume")}
                      />
                      <Bar
                        dataKey="premiumContent"
                        fill="#F59E0B"
                        name={t("storeAnalytics.charts.premiumContent")}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Content Distribution Chart */}
              <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiPieChart className="h-5 w-5 text-green-600" />
                    {t("storeAnalytics.charts.contentDistribution")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={contentDistributionData.filter(
                          (item) => item.value > 0
                        )}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) =>
                          value && value > 0 ? `${name}: ${value}` : ""
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {contentDistributionData
                          .filter((item) => item.value > 0)
                          .map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Store Details Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-white border border-purple-500 shadow-sm rounded-none">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiShoppingBag className="h-5 w-5 text-purple-600" />
                  {t("storeAnalytics.detailedView.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("storeAnalytics.detailedView.storeName")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("storeAnalytics.detailedView.owner")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("storeAnalytics.detailedView.daysActive")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("storeAnalytics.detailedView.coupons")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("storeAnalytics.detailedView.flyers")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("storeAnalytics.detailedView.performance")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("storeAnalytics.detailedView.subscription")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData?.analytics.map((store, index) => (
                        <tr
                          key={store.storeInfo.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">
                              {store.storeInfo.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-32">
                              {store.storeInfo.address}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FiUser className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">
                                {store.ownerInfo.ownerName}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FiCalendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">
                                {store.storeInfo.daysSinceRegistration}{" "}
                                {t("storeAnalytics.detailedView.days")}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FiTag className="h-4 w-4 text-blue-500" />
                              <span className="text-gray-700">
                                {store.metrics.totalCoupons}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FiFileText className="h-4 w-4 text-green-500" />
                              <span className="text-gray-700">
                                {store.metrics.totalFlyers}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FiTarget className="h-4 w-4 text-purple-500" />
                              <span
                                className={`font-medium ${
                                  store.performanceScore.overall >= 4
                                    ? "text-green-600"
                                    : store.performanceScore.overall >= 2
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {store.performanceScore.overall}/5
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {store.ownerInfo.hasActiveSubscription ? (
                                <>
                                  <FiZap className="h-4 w-4 text-green-500" />
                                  <span className="text-green-600 font-medium">
                                    {t("storeAnalytics.detailedView.active")}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <FiRefreshCw className="h-4 w-4 text-red-500" />
                                  <span className="text-red-600 font-medium">
                                    {t("storeAnalytics.detailedView.inactive")}
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
