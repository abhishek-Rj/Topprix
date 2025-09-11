import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiTrendingUp,
  FiCalendar,
  FiActivity,
  FiBarChart,
  FiPieChart,
  FiClock,
  FiHeart,
  FiBookmark,
  FiDollarSign,
  FiCreditCard,
  FiRefreshCw,
  FiTrendingDown,
  FiStar,
  FiTarget,
  FiShoppingBag,
  FiFileText,
  FiTag,
  FiAward,
} from "react-icons/fi";
import baseUrl from "../../hooks/baseurl";
import useAuthenticate from "../../hooks/authenticationt";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
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
import { Link } from "react-router-dom";

// Types for analytics data
interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  newUsersThisWeek: number;
  usersByRole: {
    admin: number;
    retailer: number;
    user: number;
  };
  userEngagementMetrics: {
    highEngagement: number;
    mediumEngagement: number;
    lowEngagement: number;
    noEngagement: number;
  };
  registrationTrend: Array<{
    period: string;
    count: number;
    roleBreakdown: {
      admin: number;
      retailer: number;
      user: number;
    };
  }>;
  userActivityAnalysis: {
    totalLoginsThisMonth: number;
    averageSessionsPerUser: number;
    usersWithPreferences: number;
    usersWithSavedContent: number;
  };
}

interface SubscriptionAnalytics {
  totalSubscribedRetailers: number;
  activeSubscriptions: number;
  trialingSubscriptions: number;
  canceledSubscriptions: number;
  expiredSubscriptions: number;
  subscriptionRenewalRate: number;
  churnRate: number;
  subscriptionBreakdown: {
    premium: number;
    basic: number;
    enterprise: number;
    trial: number;
  };
  revenueMetrics: {
    totalMRR: number;
    averageARPU: number;
    lifetimeValue: number;
  };
  subscriptionTrends: {
    newSubscriptionsThisMonth: number;
    renewalsThisMonth: number;
    cancellationsThisMonth: number;
    upgrades: number;
    downgrades: number;
  };
  subscriptionDurationAnalysis: Array<{
    period: string;
    newSubscriptions: number;
    renewals: number;
    cancellations: number;
    netGrowth: number;
  }>;
  upcomingRenewals: {
    nextWeek: number;
    nextMonth: number;
    next3Months: number;
  };
}

interface QuickStats {
  storeOverview: {
    totalStores: number;
    storesWithOwners: number;
    storesWithoutOwners: number;
    activeStores: number;
    inactiveStores: number;
    dualManagementPercentage: number;
  };
  contentOverview: {
    totalPromotionalContent: number;
    totalCoupons: number;
    totalFlyers: number;
    averageCouponsPerStore: number;
    averageFlyersPerStore: number;
  };
  topPerformers: {
    mostCoupons: {
      storeName: string;
      ownerName: string;
      ownerRole: string;
      couponCount: number;
    };
    mostFlyers: {
      storeName: string;
      ownerName: string;
      ownerRole: string;
      flyerCount: number;
    };
  };
  recentActivity: {
    newCouponsLast30Days: number;
    newFlyersLast30Days: number;
    totalNewContentLast30Days: number;
    averageDailyActivity: number;
  };
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

interface QuickStatsResponse {
  message: string;
  timestamp: string;
  quickStats: QuickStats;
  recommendations: string[];
}

interface UserAnalyticsResponse {
  success: boolean;
  message: string;
  data: UserAnalytics;
  metadata: {
    period: number;
    startDate: string;
    endDate: string;
    generatedAt: string;
  };
}

interface SubscriptionAnalyticsResponse {
  success: boolean;
  message: string;
  data: SubscriptionAnalytics;
  metadata: {
    period: number;
    startDate: string;
    endDate: string;
    generatedAt: string;
  };
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthenticate();
  const [userAnalyticsData, setUserAnalyticsData] =
    useState<UserAnalytics | null>(null);
  const [subscriptionAnalyticsData, setSubscriptionAnalyticsData] =
    useState<SubscriptionAnalytics | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryTrendsData, setCategoryTrendsData] = useState<
    CategoryTrendsAnalytics[]
  >([]);
  const [categorySummary, setCategorySummary] = useState<
    CategoryTrendsResponse["summary"] | null
  >(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);

        // Fetch user analytics
        const userResponse = await fetch(
          `${baseUrl}api/analytics/users/counts`,
          {
            headers: {
              "Content-Type": "application/json",
              "user-email": user.email,
            },
          }
        );

        // Fetch subscription analytics
        const subscriptionResponse = await fetch(
          `${baseUrl}api/analytics/subscriptions/retailers/counts`,
          {
            headers: {
              "Content-Type": "application/json",
              "user-email": user.email,
            },
          }
        );

        // Fetch quick stats
        const quickStatsResponse = await fetch(
          `${baseUrl}api/analytics/stores/quick-stats`,
          {
            headers: {
              "Content-Type": "application/json",
              "user-email": user.email,
            },
          }
        );

        if (
          !userResponse.ok ||
          !subscriptionResponse.ok ||
          !quickStatsResponse.ok
        ) {
          throw new Error(
            `HTTP error! status: ${
              userResponse.status ||
              subscriptionResponse.status ||
              quickStatsResponse.status
            }`
          );
        }

        const userData: UserAnalyticsResponse = await userResponse.json();
        const subscriptionData: SubscriptionAnalyticsResponse =
          await subscriptionResponse.json();
        const quickStatsData: QuickStatsResponse =
          await quickStatsResponse.json();

        if (userData.success && subscriptionData.success) {
          setUserAnalyticsData(userData.data);
          setSubscriptionAnalyticsData(subscriptionData.data);
          setQuickStats(quickStatsData.quickStats);
          setError(null);
        } else {
          throw new Error(
            userData.message ||
              subscriptionData.message ||
              "Failed to fetch analytics data"
          );
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch analytics data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user?.email]);

  // Fetch category trends data
  useEffect(() => {
    const fetchCategoryTrends = async () => {
      if (!user?.email) return;

      try {
        setCategoryLoading(true);
        const response = await fetch(`${baseUrl}analytics/categories/trends`, {
          headers: {
            "Content-Type": "application/json",
            "user-email": user.email,
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
  }, [user?.email]);

  // Prepare chart data
  const userRoleData = userAnalyticsData
    ? [
        {
          name: t("adminDashboard.roles.admins"),
          value: userAnalyticsData.usersByRole.admin,
          color: "#F59E0B",
        },
        {
          name: t("adminDashboard.roles.retailers"),
          value: userAnalyticsData.usersByRole.retailer,
          color: "#3B82F6",
        },
        {
          name: t("adminDashboard.roles.users"),
          value: userAnalyticsData.usersByRole.user,
          color: "#10B981",
        },
      ]
    : [];

  const engagementData = userAnalyticsData
    ? [
        {
          name: t("adminDashboard.engagement.high"),
          value: userAnalyticsData.userEngagementMetrics.highEngagement,
          color: "#10B981",
        },
        {
          name: t("adminDashboard.engagement.medium"),
          value: userAnalyticsData.userEngagementMetrics.mediumEngagement,
          color: "#F59E0B",
        },
        {
          name: t("adminDashboard.engagement.low"),
          value: userAnalyticsData.userEngagementMetrics.lowEngagement,
          color: "#EF4444",
        },
        {
          name: t("adminDashboard.engagement.none"),
          value: userAnalyticsData.userEngagementMetrics.noEngagement,
          color: "#6B7280",
        },
      ]
    : [];

  const registrationTrendData = userAnalyticsData
    ? userAnalyticsData.registrationTrend
        .map((item) => ({
          period: new Date(item.period).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          total: item.count,
          admin: item.roleBreakdown.admin,
          retailer: item.roleBreakdown.retailer,
          user: item.roleBreakdown.user,
        }))
        .reverse()
    : [];

  const subscriptionBreakdownData = subscriptionAnalyticsData
    ? [
        {
          name: t("adminDashboard.subscriptionPlans.premium"),
          value: subscriptionAnalyticsData.subscriptionBreakdown.premium,
          color: "#8B5CF6",
        },
        {
          name: t("adminDashboard.subscriptionPlans.basic"),
          value: subscriptionAnalyticsData.subscriptionBreakdown.basic,
          color: "#3B82F6",
        },
        {
          name: t("adminDashboard.subscriptionPlans.enterprise"),
          value: subscriptionAnalyticsData.subscriptionBreakdown.enterprise,
          color: "#F59E0B",
        },
        {
          name: t("adminDashboard.subscriptionPlans.trial"),
          value: subscriptionAnalyticsData.subscriptionBreakdown.trial,
          color: "#10B981",
        },
      ]
    : [];

  const subscriptionTrendData = subscriptionAnalyticsData
    ? subscriptionAnalyticsData.subscriptionDurationAnalysis
        .map((item) => ({
          period: new Date(item.period).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          newSubscriptions: item.newSubscriptions,
          renewals: item.renewals,
          cancellations: item.cancellations,
          netGrowth: item.netGrowth,
        }))
        .reverse()
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation />
        <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{t("adminDashboard.loading")}</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation />
        <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {t("adminDashboard.error")}
                </h2>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-20 sm:pt-24 lg:pt-20 pb-6 sm:pb-10 px-2 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-4 sm:p-6 bg-white border border-blue-500 shadow-sm rounded-none">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {t("adminDashboard.title")}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {t("adminDashboard.subtitle")}
              </p>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
                {t("adminDashboard.lastUpdated")}: {new Date().toLocaleString()}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              <Link to="/admin/store-analytics">
                <Card className="bg-white border border-indigo-500 shadow-sm rounded-none hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2 p-3 sm:p-4">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                      <FiShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-500" />
                      {t("adminDashboard.quickActions.storeAnalytics")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0">
                    <div className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                      {t("adminDashboard.quickActions.viewStoreData")}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {t(
                        "adminDashboard.quickActions.comprehensiveStoreInsights"
                      )}
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/flyer-analytics">
                <Card className="bg-white border border-green-500 shadow-sm rounded-none hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2 p-3 sm:p-4">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                      <FiFileText className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      {t("adminDashboard.quickActions.flyerAnalytics")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0">
                    <div className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                      {t("adminDashboard.quickActions.viewFlyerData")}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {t(
                        "adminDashboard.quickActions.comprehensiveFlyerInsights"
                      )}
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/coupon-analytics">
                <Card className="bg-white border border-purple-500 shadow-sm rounded-none hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2 p-3 sm:p-4">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                      <FiTag className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                      {t("adminDashboard.quickActions.couponAnalytics")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0">
                    <div className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                      {t("adminDashboard.quickActions.viewCouponData")}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {t(
                        "adminDashboard.quickActions.comprehensiveCouponInsights"
                      )}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </motion.div>

          {/* QUICK STATS SECTION */}
          {quickStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <div className="p-4 sm:p-6 bg-white border border-indigo-500 shadow-sm rounded-none">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiActivity className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                  {t("adminDashboard.quickStats.title")}
                </h2>

                {/* Store Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                    <CardHeader className="pb-2 p-3 sm:p-4">
                      <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                        <FiShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                        {t(
                          "adminDashboard.quickStats.storeOverview.totalStores"
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        {quickStats.storeOverview.totalStores}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {quickStats.storeOverview.activeStores}{" "}
                        {t("adminDashboard.quickStats.storeOverview.active")},{" "}
                        {quickStats.storeOverview.inactiveStores}{" "}
                        {t("adminDashboard.quickStats.storeOverview.inactive")}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                    <CardHeader className="pb-2 p-3 sm:p-4">
                      <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                        <FiUsers className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                        {t(
                          "adminDashboard.quickStats.storeOverview.storesWithOwners"
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        {quickStats.storeOverview.storesWithOwners}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {quickStats.storeOverview.dualManagementPercentage}%{" "}
                        {t(
                          "adminDashboard.quickStats.storeOverview.managementCoverage"
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-purple-500 shadow-sm rounded-none">
                    <CardHeader className="pb-2 p-3 sm:p-4">
                      <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                        <FiTag className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                        {t(
                          "adminDashboard.quickStats.contentOverview.totalContent"
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        {quickStats.contentOverview.totalPromotionalContent}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {quickStats.contentOverview.totalCoupons}{" "}
                        {t("adminDashboard.quickStats.contentOverview.coupons")}
                        , {quickStats.contentOverview.totalFlyers}{" "}
                        {t("adminDashboard.quickStats.contentOverview.flyers")}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Performers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <Card className="bg-white border border-orange-500 shadow-sm rounded-none">
                    <CardHeader className="pb-2 p-3 sm:p-4">
                      <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                        <FiAward className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                        {t(
                          "adminDashboard.quickStats.topPerformers.mostCoupons"
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0">
                      <div className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                        {quickStats.topPerformers.mostCoupons.storeName}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">
                        {t("adminDashboard.quickStats.topPerformers.owner")}:{" "}
                        {quickStats.topPerformers.mostCoupons.ownerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {quickStats.topPerformers.mostCoupons.couponCount}{" "}
                        {t("adminDashboard.quickStats.topPerformers.coupons")}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-teal-500 shadow-sm rounded-none">
                    <CardHeader className="pb-2 p-3 sm:p-4">
                      <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                        <FiFileText className="h-3 w-3 sm:h-4 sm:w-4 text-teal-500" />
                        {t(
                          "adminDashboard.quickStats.topPerformers.mostFlyers"
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0">
                      <div className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                        {quickStats.topPerformers.mostFlyers.storeName}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">
                        {t("adminDashboard.quickStats.topPerformers.owner")}:{" "}
                        {quickStats.topPerformers.mostFlyers.ownerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {quickStats.topPerformers.mostFlyers.flyerCount}{" "}
                        {t("adminDashboard.quickStats.topPerformers.flyers")}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-white border border-pink-500 shadow-sm rounded-none">
                  <CardHeader className="pb-2 p-3 sm:p-4">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                      <FiTrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500" />
                      {t("adminDashboard.quickStats.recentActivity.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-gray-900">
                          {quickStats.recentActivity.newCouponsLast30Days}
                        </div>
                        <p className="text-xs text-gray-500">
                          {t(
                            "adminDashboard.quickStats.recentActivity.newCoupons"
                          )}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-gray-900">
                          {quickStats.recentActivity.newFlyersLast30Days}
                        </div>
                        <p className="text-xs text-gray-500">
                          {t(
                            "adminDashboard.quickStats.recentActivity.newFlyers"
                          )}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-gray-900">
                          {quickStats.recentActivity.averageDailyActivity.toFixed(
                            1
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {t(
                            "adminDashboard.quickStats.recentActivity.dailyActivity"
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* USER ANALYTICS SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FiUsers className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                {t("adminDashboard.userAnalytics.title")}
              </h2>
              <div className="h-1 w-16 sm:w-20 bg-blue-500"></div>
            </div>

            {/* User Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader className="pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiUsers className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                    {t("adminDashboard.userAnalytics.totalUsers")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {userAnalyticsData?.totalUsers.toLocaleString() || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                <CardHeader className="pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiUserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                    {t("adminDashboard.userAnalytics.activeUsers")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {userAnalyticsData?.activeUsers.toLocaleString() || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-purple-500 shadow-sm rounded-none">
                <CardHeader className="pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiTrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                    {t("adminDashboard.userAnalytics.newThisMonth")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {userAnalyticsData?.newUsersThisMonth.toLocaleString() || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-orange-500 shadow-sm rounded-none">
                <CardHeader className="pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiCalendar className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                    {t("adminDashboard.userAnalytics.newThisWeek")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {userAnalyticsData?.newUsersThisWeek.toLocaleString() || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <FiPieChart className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    {t("adminDashboard.userAnalytics.userRoleDistribution")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={userRoleData.filter((item) => item.value > 0)}
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
                        {userRoleData
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

              <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <FiBarChart className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    {t("adminDashboard.userAnalytics.userEngagementLevels")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8">
                        {engagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* User Activity Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white border border-gray-400 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiClock className="h-4 w-4 text-gray-500" />
                    {t("adminDashboard.userAnalytics.monthlyLogins")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {userAnalyticsData?.userActivityAnalysis.totalLoginsThisMonth.toLocaleString() ||
                      0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-400 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiActivity className="h-4 w-4 text-gray-500" />
                    {t("adminDashboard.userAnalytics.avgSessionsPerUser")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {userAnalyticsData?.userActivityAnalysis.averageSessionsPerUser.toFixed(
                      2
                    ) || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-400 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiHeart className="h-4 w-4 text-gray-500" />
                    {t("adminDashboard.userAnalytics.withPreferences")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {userAnalyticsData?.userActivityAnalysis.usersWithPreferences.toLocaleString() ||
                      0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-400 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiBookmark className="h-4 w-4 text-gray-500" />
                    {t("adminDashboard.userAnalytics.savedContent")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {userAnalyticsData?.userActivityAnalysis.usersWithSavedContent.toLocaleString() ||
                      0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Trend */}
            <Card className="bg-white border border-purple-500 shadow-sm rounded-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiActivity className="h-5 w-5 text-purple-600" />
                  {t("adminDashboard.userAnalytics.registrationTrend")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={registrationTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="admin"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="retailer"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="user"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* RETAILER ANALYTICS SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FiCreditCard className="h-6 w-6 text-green-600" />
                {t("adminDashboard.retailerAnalytics.title")}
              </h2>
              <div className="h-1 w-20 bg-green-500"></div>
            </div>

            {/* Subscription Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiUsers className="h-4 w-4 text-green-500" />
                    {t("adminDashboard.retailerAnalytics.subscribedRetailers")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {subscriptionAnalyticsData?.totalSubscribedRetailers.toLocaleString() ||
                      0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiUserCheck className="h-4 w-4 text-blue-500" />
                    {t("adminDashboard.retailerAnalytics.activeSubscriptions")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {subscriptionAnalyticsData?.activeSubscriptions.toLocaleString() ||
                      0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-purple-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiRefreshCw className="h-4 w-4 text-purple-500" />
                    {t("adminDashboard.retailerAnalytics.renewalRate")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {subscriptionAnalyticsData?.subscriptionRenewalRate.toFixed(
                      0
                    ) || 0}
                    %
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-red-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiTrendingDown className="h-4 w-4 text-red-500" />
                    {t("adminDashboard.retailerAnalytics.churnRate")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {subscriptionAnalyticsData?.churnRate.toFixed(0) || 0}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiDollarSign className="h-4 w-4 text-green-500" />
                    {t("adminDashboard.retailerAnalytics.totalMRR")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    $
                    {subscriptionAnalyticsData?.revenueMetrics.totalMRR.toLocaleString() ||
                      0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiTarget className="h-4 w-4 text-blue-500" />
                    {t("adminDashboard.retailerAnalytics.averageARPU")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    $
                    {subscriptionAnalyticsData?.revenueMetrics.averageARPU.toFixed(
                      2
                    ) || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-purple-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiStar className="h-4 w-4 text-purple-500" />
                    {t("adminDashboard.retailerAnalytics.lifetimeValue")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    $
                    {subscriptionAnalyticsData?.revenueMetrics.lifetimeValue.toFixed(
                      2
                    ) || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subscription Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white border border-green-500 shadow-sm rounded-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiPieChart className="h-5 w-5 text-green-600" />
                    {t(
                      "adminDashboard.retailerAnalytics.subscriptionBreakdown"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subscriptionBreakdownData.filter(
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
                        {subscriptionBreakdownData
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

              <Card className="bg-white border border-blue-500 shadow-sm rounded-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiBarChart className="h-5 w-5 text-blue-600" />
                    {t("adminDashboard.retailerAnalytics.subscriptionTrends")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subscriptionTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="newSubscriptions"
                        fill="#10B981"
                        name={t("adminDashboard.subscriptionActivity.new")}
                      />
                      <Bar
                        dataKey="renewals"
                        fill="#3B82F6"
                        name={t("adminDashboard.subscriptionActivity.renewals")}
                      />
                      <Bar
                        dataKey="cancellations"
                        fill="#EF4444"
                        name={t(
                          "adminDashboard.subscriptionActivity.cancellations"
                        )}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Renewals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white border border-yellow-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 text-yellow-500" />
                    {t("adminDashboard.retailerAnalytics.nextWeek")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {subscriptionAnalyticsData?.upcomingRenewals.nextWeek.toLocaleString() ||
                      0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-orange-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 text-orange-500" />
                    {t("adminDashboard.retailerAnalytics.nextMonth")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {subscriptionAnalyticsData?.upcomingRenewals.nextMonth.toLocaleString() ||
                      0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-red-500 shadow-sm rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 text-red-500" />
                    {t("adminDashboard.retailerAnalytics.next3Months")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {subscriptionAnalyticsData?.upcomingRenewals.next3Months.toLocaleString() ||
                      0}
                  </div>
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
              className="mb-8"
            >
              <Card className="bg-white border border-gray-300 shadow-sm rounded-none">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-gray-500">
                      {t("adminDashboard.loading")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : categoryError ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <Card className="bg-white border border-red-500 shadow-sm rounded-none">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-red-500 mb-2">⚠️</div>
                    <div className="text-gray-900 font-semibold mb-2">
                      {t("adminDashboard.error")}
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
              className="mb-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Category Performance Metrics */}
                <Card className="bg-white border border-emerald-500 shadow-sm rounded-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <FiTrendingUp className="h-4 w-4 text-emerald-500" />
                      {t("adminDashboard.categoryAnalytics.topPerformers")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {t("adminDashboard.categoryAnalytics.mostOrders")}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {categorySummary?.topPerformers.mostOrders || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {t(
                            "adminDashboard.categoryAnalytics.highestEngagement"
                          )}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {categorySummary?.topPerformers.highestEngagement ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {t("adminDashboard.categoryAnalytics.bestCompletion")}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {categorySummary?.topPerformers.bestCompletion ||
                            "N/A"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Overall Metrics */}
                <Card className="bg-white border border-cyan-500 shadow-sm rounded-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <FiUsers className="h-4 w-4 text-cyan-500" />
                      {t("adminDashboard.categoryAnalytics.overallMetrics")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {t("adminDashboard.categoryAnalytics.totalOrders")}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {categorySummary?.aggregateOrderMetrics
                            .totalOrdersAcrossCategories || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {t("adminDashboard.categoryAnalytics.totalCustomers")}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {categorySummary?.aggregateOrderMetrics
                            .totalUniqueCustomers || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {t("adminDashboard.categoryAnalytics.completionRate")}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
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
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <FiCalendar className="h-4 w-4 text-violet-500" />
                      {t("adminDashboard.categoryAnalytics.analysisPeriod")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {t("adminDashboard.categoryAnalytics.timeframe")}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {categorySummary?.analysisTimeframe || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {t(
                            "adminDashboard.categoryAnalytics.categoriesAnalyzed"
                          )}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {categorySummary?.totalCategoriesAnalyzed || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {t(
                            "adminDashboard.categoryAnalytics.topCategoriesShown"
                          )}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {categorySummary?.topCategoriesShown || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Category Performance Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card className="bg-white border border-rose-500 shadow-sm rounded-none">
                    <CardHeader>
                      <CardTitle>
                        {t(
                          "adminDashboard.categoryAnalytics.categoryPerformance"
                        )}
                      </CardTitle>
                      <CardDescription>
                        {t(
                          "adminDashboard.categoryAnalytics.categoryPerformanceDescription"
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
                                    category.performanceScore
                                      .performanceLevel === "high"
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
                        {t(
                          "adminDashboard.categoryAnalytics.engagementDistribution"
                        )}
                      </CardTitle>
                      <CardDescription>
                        {t(
                          "adminDashboard.categoryAnalytics.engagementDistributionDescription"
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
                                    category.performanceScore
                                      .performanceLevel === "high"
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
                      {t("adminDashboard.categoryAnalytics.noData")}
                    </div>
                    <div className="text-gray-600">
                      {t("adminDashboard.categoryAnalytics.noDataDescription")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
