import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiFileText,
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
  FiShoppingBag,
  FiZap,
  FiRefreshCw,
  FiLayers,
  FiPercent,
  FiTrendingUp as FiTrendingUpIcon,
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

// Types for flyer analytics data
interface StoreOwner {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface StoreInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  owner: StoreOwner;
}

interface FlyerMetrics {
  totalFlyers: number;
  activeFlyers: number;
  expiredFlyers: number;
  upcomingFlyers: number;
  sponsoredFlyers: number;
  sponsoredPercentage: number;
}

interface EngagementMetrics {
  totalSaves: number;
  averageSavesPerFlyer: number;
  engagementRate: number;
  mostSavedFlyer: string;
}

interface EffectivenessMetrics {
  totalItems: number;
  averageItemsPerFlyer: number;
  averageFlyerDuration: number;
  flyerFrequency: string;
}

interface DesignContentQuality {
  designQualityScore: number;
  contentQualityScore: number;
  overallQualityScore: number;
  itemsWithDescriptions: number;
  itemDescriptionRate: number;
}

interface SeasonalPatterns {
  flyersLast3Months: number;
  monthlyAverageFlyers: number;
  trendDirection: string;
  peakActivity: string;
}

interface CategoryDistribution {
  category: string;
  count: number;
  percentage: number;
}

interface MarketingScore {
  flyerVolume: number;
  engagementLevel: number;
  contentQuality: number;
  consistency: number;
  overall: number;
}

interface FlyerAnalytics {
  storeInfo: StoreInfo;
  flyerMetrics: FlyerMetrics;
  engagementMetrics: EngagementMetrics;
  effectivenessMetrics: EffectivenessMetrics;
  designContentQuality: DesignContentQuality;
  seasonalPatterns: SeasonalPatterns;
  categoryDistribution: CategoryDistribution[];
  marketingScore: MarketingScore;
}

interface FlyerAnalyticsResponse {
  message: string;
  totalFound: number;
  criteria: string;
  analytics: FlyerAnalytics[];
  summary: {
    totalFlyersAnalyzed: number;
    averageFlyersPerStore: number;
    averageEngagementRate: number;
    topMarketingStore: string;
    averageQualityScore: number;
  };
}

export default function FlyerAnalytics() {
  const { t } = useTranslation();
  const { user } = useAuthenticate();
  const [analyticsData, setAnalyticsData] =
    useState<FlyerAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlyerAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${baseUrl}api/analytics/stores/most-flyers`,
          {
            headers: {
              "user-email": user?.email || "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch flyer analytics");
        }

        const data: FlyerAnalyticsResponse = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchFlyerAnalytics();
    }
  }, [user?.email, baseUrl]);

  // Prepare chart data
  const storeFlyerData = analyticsData
    ? analyticsData.analytics.map((store) => ({
        name:
          store.storeInfo.name.length > 15
            ? store.storeInfo.name.substring(0, 15) + "..."
            : store.storeInfo.name,
        totalFlyers: store.flyerMetrics.totalFlyers,
        activeFlyers: store.flyerMetrics.activeFlyers,
        sponsoredFlyers: store.flyerMetrics.sponsoredFlyers,
        marketingScore: store.marketingScore.overall,
      }))
    : [];

  const categoryDistributionData = analyticsData
    ? analyticsData.analytics
        .flatMap((store) => store.categoryDistribution)
        .reduce((acc, category) => {
          const existing = acc.find((item) => item.name === category.category);
          if (existing) {
            existing.value += category.count;
          } else {
            acc.push({
              name: category.category,
              value: category.count,
              color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            });
          }
          return acc;
        }, [] as { name: string; value: number; color: string }[])
    : [];

  const marketingScoreData = analyticsData
    ? analyticsData.analytics.map((store) => ({
        name:
          store.storeInfo.name.length > 12
            ? store.storeInfo.name.substring(0, 12) + "..."
            : store.storeInfo.name,
        flyerVolume: store.marketingScore.flyerVolume,
        engagementLevel: store.marketingScore.engagementLevel,
        contentQuality: store.marketingScore.contentQuality,
        consistency: store.marketingScore.consistency,
        overall: store.marketingScore.overall,
      }))
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
                <p className="text-gray-600">{t("flyerAnalytics.loading")}</p>
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
                  {t("flyerAnalytics.error")}
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
                {t("flyerAnalytics.title")}
              </h1>
              <p className="text-gray-600">{t("flyerAnalytics.subtitle")}</p>
              <div className="mt-4 text-sm text-gray-500">
                {t("flyerAnalytics.lastUpdated")}: {new Date().toLocaleString()}
              </div>
              <div className="mt-2 text-sm text-blue-600 font-medium">
                {analyticsData?.criteria}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiFileText className="h-4 w-4 text-blue-500" />
                    {t("flyerAnalytics.summary.totalStores")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData?.totalFound || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("flyerAnalytics.summary.storesAnalyzed")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiLayers className="h-4 w-4 text-green-500" />
                    {t("flyerAnalytics.summary.totalFlyers")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData?.summary.totalFlyersAnalyzed || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("flyerAnalytics.summary.flyersAnalyzed")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-purple-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiTrendingUpIcon className="h-4 w-4 text-purple-500" />
                    {t("flyerAnalytics.summary.avgFlyers")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData?.summary.averageFlyersPerStore.toFixed(1) ||
                      0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("flyerAnalytics.summary.perStore")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-orange-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiHeart className="h-4 w-4 text-orange-500" />
                    {t("flyerAnalytics.summary.avgEngagement")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData?.summary.averageEngagementRate.toFixed(1) ||
                      0}
                    %
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("flyerAnalytics.summary.engagementRate")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-red-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiAward className="h-4 w-4 text-red-500" />
                    {t("flyerAnalytics.summary.topStore")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-gray-900 truncate">
                    {analyticsData?.summary.topMarketingStore || "N/A"}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("flyerAnalytics.summary.marketingLeader")}
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
              {/* Store Flyer Performance Chart */}
              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiBarChart className="h-5 w-5 text-blue-600" />
                    {t("flyerAnalytics.charts.flyerPerformance")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={storeFlyerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="totalFlyers"
                        fill="#3B82F6"
                        name={t("flyerAnalytics.charts.totalFlyers")}
                      />
                      <Bar
                        dataKey="activeFlyers"
                        fill="#10B981"
                        name={t("flyerAnalytics.charts.activeFlyers")}
                      />
                      <Bar
                        dataKey="sponsoredFlyers"
                        fill="#F59E0B"
                        name={t("flyerAnalytics.charts.sponsoredFlyers")}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution Chart */}
              <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiPieChart className="h-5 w-5 text-green-600" />
                    {t("flyerAnalytics.charts.categoryDistribution")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryDistributionData.filter(
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
                        {categoryDistributionData
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

          {/* Marketing Score Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-white border border-purple-500 shadow-sm rounded-none">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiTarget className="h-5 w-5 text-purple-600" />
                  {t("flyerAnalytics.charts.marketingScores")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marketingScoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="flyerVolume"
                      fill="#3B82F6"
                      name={t("flyerAnalytics.charts.flyerVolume")}
                    />
                    <Bar
                      dataKey="engagementLevel"
                      fill="#10B981"
                      name={t("flyerAnalytics.charts.engagementLevel")}
                    />
                    <Bar
                      dataKey="contentQuality"
                      fill="#F59E0B"
                      name={t("flyerAnalytics.charts.contentQuality")}
                    />
                    <Bar
                      dataKey="consistency"
                      fill="#8B5CF6"
                      name={t("flyerAnalytics.charts.consistency")}
                    />
                    <Bar
                      dataKey="overall"
                      fill="#EF4444"
                      name={t("flyerAnalytics.charts.overallScore")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Store Details Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="bg-white border border-orange-500 shadow-sm rounded-none">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiFileText className="h-5 w-5 text-orange-600" />
                  {t("flyerAnalytics.detailedView.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("flyerAnalytics.detailedView.storeName")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("flyerAnalytics.detailedView.owner")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("flyerAnalytics.detailedView.totalFlyers")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("flyerAnalytics.detailedView.activeFlyers")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("flyerAnalytics.detailedView.sponsored")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("flyerAnalytics.detailedView.engagement")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("flyerAnalytics.detailedView.marketingScore")}
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
                                {store.storeInfo.owner.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FiFileText className="h-4 w-4 text-blue-500" />
                              <span className="text-gray-700">
                                {store.flyerMetrics.totalFlyers}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FiZap className="h-4 w-4 text-green-500" />
                              <span className="text-gray-700">
                                {store.flyerMetrics.activeFlyers}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FiStar className="h-4 w-4 text-yellow-500" />
                              <span className="text-gray-700">
                                {store.flyerMetrics.sponsoredPercentage}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FiHeart className="h-4 w-4 text-red-500" />
                              <span className="text-gray-700">
                                {store.engagementMetrics.engagementRate}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FiTarget className="h-4 w-4 text-purple-500" />
                              <span
                                className={`font-medium ${
                                  store.marketingScore.overall >= 20
                                    ? "text-green-600"
                                    : store.marketingScore.overall >= 10
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {store.marketingScore.overall}/100
                              </span>
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
