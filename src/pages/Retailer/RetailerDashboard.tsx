import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiShoppingBag,
  FiEye,
  FiTag,
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

      </div>

      <Footer />
    </div>
  );
}
