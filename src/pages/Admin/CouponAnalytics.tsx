import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiTag,
  FiUser,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiStar,
  FiEye,
  FiHeart,
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
  FiPercent,
  FiTrendingUp as FiTrendingUpIcon,
  FiShoppingCart,
  FiGift,
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
import AdminFloatingSidebar from "../../components/AdminFloatingSidebar";
import {
  AdminSidebarProvider,
  useAdminSidebar,
} from "../../contexts/AdminSidebarContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthenticate from "../../hooks/authenticationt";
import baseUrl from "../../hooks/baseurl";

// Types for coupon analytics data
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

interface CouponMetrics {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  upcomingCoupons: number;
  couponTypes: {
    online: number;
    inStore: number;
    premium: number;
  };
}

interface RedemptionAnalytics {
  totalSaves: number;
  averageSavesPerCoupon: number;
  estimatedRedemptionRate: number;
}

interface DiscountAnalytics {
  averageDiscountPercentage: number;
  highestDiscount: number;
  lowestDiscount: number;
  discountRange: string;
}

interface SeasonalPatterns {
  couponsLast3Months: number;
  monthlyAverageCoupons: number;
  trendDirection: string;
}

interface CategoryDistribution {
  category: string;
  count: number;
}

interface PerformanceScore {
  couponActivity: number;
  customerEngagement: number;
  discountCompetitiveness: number;
  overall: number;
}

interface CouponAnalytics {
  storeInfo: StoreInfo;
  couponMetrics: CouponMetrics;
  redemptionAnalytics: RedemptionAnalytics;
  discountAnalytics: DiscountAnalytics;
  seasonalPatterns: SeasonalPatterns;
  categoryDistribution: CategoryDistribution[];
  performanceScore: PerformanceScore;
}

interface CouponAnalyticsResponse {
  message: string;
  totalFound: number;
  criteria: string;
  analytics: CouponAnalytics[];
  summary: {
    totalCouponsAnalyzed: number;
    averageCouponsPerStore: number;
    averageDiscountAcrossStores: number;
    topPerformingStore: string;
  };
}

function CouponAnalyticsContent() {
  const { t } = useTranslation();
  const { user } = useAuthenticate();
  const { isOpen } = useAdminSidebar();
  const [analyticsData, setAnalyticsData] =
    useState<CouponAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCouponAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${baseUrl}api/analytics/stores/most-coupons`,
          {
            headers: {
              "user-email": user?.email || "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch coupon analytics");
        }

        const data: CouponAnalyticsResponse = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchCouponAnalytics();
    }
  }, [user?.email, baseUrl]);

  // Prepare chart data
  const storeCouponData = analyticsData
    ? analyticsData.analytics.map((store) => ({
        name:
          store.storeInfo.name.length > 15
            ? store.storeInfo.name.substring(0, 15) + "..."
            : store.storeInfo.name,
        totalCoupons: store.couponMetrics.totalCoupons,
        activeCoupons: store.couponMetrics.activeCoupons,
        expiredCoupons: store.couponMetrics.expiredCoupons,
        performanceScore: store.performanceScore.overall,
      }))
    : [];

  const couponTypeData = analyticsData
    ? analyticsData.analytics.reduce(
        (acc, store) => {
          acc.online += store.couponMetrics.couponTypes.online;
          acc.inStore += store.couponMetrics.couponTypes.inStore;
          acc.premium += store.couponMetrics.couponTypes.premium;
          return acc;
        },
        { online: 0, inStore: 0, premium: 0 }
      )
    : { online: 0, inStore: 0, premium: 0 };

  const couponTypeChartData = [
    {
      name: t("couponAnalytics.couponTypes.online"),
      value: couponTypeData.online,
      color: "#3B82F6",
    },
    {
      name: t("couponAnalytics.couponTypes.inStore"),
      value: couponTypeData.inStore,
      color: "#10B981",
    },
    {
      name: t("couponAnalytics.couponTypes.premium"),
      value: couponTypeData.premium,
      color: "#F59E0B",
    },
  ];

  const discountData = analyticsData
    ? analyticsData.analytics.map((store) => ({
        name:
          store.storeInfo.name.length > 12
            ? store.storeInfo.name.substring(0, 12) + "..."
            : store.storeInfo.name,
        averageDiscount: store.discountAnalytics.averageDiscountPercentage,
        highestDiscount: store.discountAnalytics.highestDiscount,
        lowestDiscount: store.discountAnalytics.lowestDiscount,
        performanceScore: store.performanceScore.overall,
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
                <p className="text-gray-600">{t("couponAnalytics.loading")}</p>
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
                  {t("couponAnalytics.error")}
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
            className="mb-8"
          >
            <div className="p-6 bg-white border border-blue-500 shadow-sm rounded-none">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t("couponAnalytics.title")}
              </h1>
              <p className="text-gray-600">{t("couponAnalytics.subtitle")}</p>
              <div className="mt-4 text-sm text-gray-500">
                {t("couponAnalytics.lastUpdated")}:{" "}
                {new Date().toLocaleString()}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiShoppingBag className="h-4 w-4 text-blue-500" />
                    {t("couponAnalytics.summary.totalStores")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData?.totalFound || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("couponAnalytics.summary.storesAnalyzed")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiTag className="h-4 w-4 text-green-500" />
                    {t("couponAnalytics.summary.totalCoupons")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData?.summary.totalCouponsAnalyzed || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("couponAnalytics.summary.couponsAnalyzed")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-purple-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiTrendingUpIcon className="h-4 w-4 text-purple-500" />
                    {t("couponAnalytics.summary.avgCoupons")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData?.summary.averageCouponsPerStore.toFixed(1) ||
                      0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("couponAnalytics.summary.perStore")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-orange-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiPercent className="h-4 w-4 text-orange-500" />
                    {t("couponAnalytics.summary.avgDiscount")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData?.summary.averageDiscountAcrossStores.toFixed(
                      1
                    ) || 0}
                    %
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("couponAnalytics.summary.averageDiscount")}
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
              {/* Store Coupon Performance Chart */}
              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiBarChart className="h-5 w-5 text-blue-600" />
                    {t("couponAnalytics.charts.couponPerformance")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={storeCouponData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="totalCoupons"
                        fill="#3B82F6"
                        name={t("couponAnalytics.charts.totalCoupons")}
                      />
                      <Bar
                        dataKey="activeCoupons"
                        fill="#10B981"
                        name={t("couponAnalytics.charts.activeCoupons")}
                      />
                      <Bar
                        dataKey="expiredCoupons"
                        fill="#EF4444"
                        name={t("couponAnalytics.charts.expiredCoupons")}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Coupon Type Distribution Chart */}
              <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiPieChart className="h-5 w-5 text-green-600" />
                    {t("couponAnalytics.charts.couponTypeDistribution")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={couponTypeChartData.filter(
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
                        {couponTypeChartData
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

          {/* Discount Analysis Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-white border border-purple-500 shadow-sm rounded-none">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiPercent className="h-5 w-5 text-purple-600" />
                  {t("couponAnalytics.charts.discountAnalysis")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={discountData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="averageDiscount"
                      fill="#3B82F6"
                      name={t("couponAnalytics.charts.averageDiscount")}
                    />
                    <Bar
                      dataKey="highestDiscount"
                      fill="#10B981"
                      name={t("couponAnalytics.charts.highestDiscount")}
                    />
                    <Bar
                      dataKey="lowestDiscount"
                      fill="#F59E0B"
                      name={t("couponAnalytics.charts.lowestDiscount")}
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
                  <FiTag className="h-5 w-5 text-orange-600" />
                  {t("couponAnalytics.detailedView.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("couponAnalytics.detailedView.storeName")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("couponAnalytics.detailedView.owner")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("couponAnalytics.detailedView.totalCoupons")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("couponAnalytics.detailedView.activeCoupons")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("couponAnalytics.detailedView.avgDiscount")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("couponAnalytics.detailedView.redemptionRate")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          {t("couponAnalytics.detailedView.performanceScore")}
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
                              <FiTag className="h-4 w-4 text-blue-500" />
                              <span className="text-gray-700">
                                {store.couponMetrics.totalCoupons}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FiZap className="h-4 w-4 text-green-500" />
                              <span className="text-gray-700">
                                {store.couponMetrics.activeCoupons}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FiPercent className="h-4 w-4 text-purple-500" />
                              <span className="text-gray-700">
                                {store.discountAnalytics.averageDiscountPercentage.toFixed(
                                  1
                                )}
                                %
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FiHeart className="h-4 w-4 text-red-500" />
                              <span className="text-gray-700">
                                {store.redemptionAnalytics.estimatedRedemptionRate.toFixed(
                                  1
                                )}
                                %
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FiTarget className="h-4 w-4 text-orange-500" />
                              <span
                                className={`font-medium ${
                                  store.performanceScore.overall >= 30
                                    ? "text-green-600"
                                    : store.performanceScore.overall >= 15
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {store.performanceScore.overall}/100
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

export default function CouponAnalytics() {
  return <CouponAnalyticsContent />;
}
