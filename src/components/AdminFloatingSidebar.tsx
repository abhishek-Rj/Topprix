import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiShoppingBag,
  FiFileText,
  FiTag,
  FiChevronLeft,
  FiChevronRight,
  FiActivity,
  FiUsers,
  FiFile,
  FiGift,
} from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminSidebar } from "../contexts/AdminSidebarContext";

export default function AdminFloatingSidebar() {
  const { isOpen, setIsOpen } = useAdminSidebar();
  const [showIcons, setShowIcons] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  // Check if current route matches sidebar items
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const sidebarItems = [
    {
      path: "/admin/store-analytics",
      icon: FiShoppingBag,
      title: t("adminSidebar.storeAnalytics"),
      color: "indigo",
    },
    {
      path: "/admin/flyer-analytics",
      icon: FiFileText,
      title: t("adminSidebar.flyerAnalytics"),
      color: "green",
    },
    {
      path: "/admin/coupon-analytics",
      icon: FiTag,
      title: t("adminSidebar.couponAnalytics"),
      color: "purple",
    },
    {
      path: "/admin/user-management",
      icon: FiUsers,
      title: t("adminSidebar.userManagement"),
      color: "blue",
    },
    {
      path: "/admin/store-management",
      icon: FiShoppingBag,
      title: t("adminSidebar.storeManagement"),
      color: "orange",
    },
    {
      path: "/admin/flyer-management",
      icon: FiFile,
      title: t("adminSidebar.flyerManagement"),
      color: "teal",
    },
    {
      path: "/admin/coupon-management",
      icon: FiGift,
      title: t("adminSidebar.couponManagement"),
      color: "pink",
    },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      indigo: {
        border: isActive ? "border-indigo-600" : "border-indigo-500",
        bg: isActive ? "bg-indigo-50" : "bg-white",
        icon: isActive ? "text-indigo-600" : "text-indigo-500",
        text: isActive ? "text-indigo-900 font-semibold" : "text-gray-900",
      },
      green: {
        border: isActive ? "border-green-600" : "border-green-500",
        bg: isActive ? "bg-green-50" : "bg-white",
        icon: isActive ? "text-green-600" : "text-green-500",
        text: isActive ? "text-green-900 font-semibold" : "text-gray-900",
      },
      purple: {
        border: isActive ? "border-purple-600" : "border-purple-500",
        bg: isActive ? "bg-purple-50" : "bg-white",
        icon: isActive ? "text-purple-600" : "text-purple-500",
        text: isActive ? "text-purple-900 font-semibold" : "text-gray-900",
      },
      blue: {
        border: isActive ? "border-blue-600" : "border-blue-500",
        bg: isActive ? "bg-blue-50" : "bg-white",
        icon: isActive ? "text-blue-600" : "text-blue-500",
        text: isActive ? "text-blue-900 font-semibold" : "text-gray-900",
      },
      orange: {
        border: isActive ? "border-orange-600" : "border-orange-500",
        bg: isActive ? "bg-orange-50" : "bg-white",
        icon: isActive ? "text-orange-600" : "text-orange-500",
        text: isActive ? "text-orange-900 font-semibold" : "text-gray-900",
      },
      teal: {
        border: isActive ? "border-teal-600" : "border-teal-500",
        bg: isActive ? "bg-teal-50" : "bg-white",
        icon: isActive ? "text-teal-600" : "text-teal-500",
        text: isActive ? "text-teal-900 font-semibold" : "text-gray-900",
      },
      pink: {
        border: isActive ? "border-pink-600" : "border-pink-500",
        bg: isActive ? "bg-pink-50" : "bg-white",
        icon: isActive ? "text-pink-600" : "text-pink-500",
        text: isActive ? "text-pink-900 font-semibold" : "text-gray-900",
      },
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <>
      {/* Floating Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-80 bg-white border-r border-gray-200 shadow-lg"
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiActivity className="h-5 w-5 text-blue-600" />
              {isOpen && <span>{t("adminSidebar.quickAccess")}</span>}
            </h2>
          </div>

          <div className="space-y-3">
            {sidebarItems.map((item) => {
              const isActive = isActiveRoute(item.path);
              const colors = getColorClasses(item.color, isActive);
              const IconComponent = item.icon;

              return (
                <Link key={item.path} to={item.path}>
                  <Card
                    className={`${colors.bg} ${colors.border} shadow-sm rounded-none hover:shadow-md transition-all duration-200 cursor-pointer`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-4 w-4 ${colors.icon}`} />
                        {isOpen && (
                          <span
                            className={`text-sm font-medium ${colors.text}`}
                          >
                            {item.title}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Icon-only sidebar when closed */}
      <motion.div
        initial={false}
        animate={{
          x: showIcons && !isOpen ? 0 : -60,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-16 bg-white border-r border-gray-200 shadow-lg"
        onMouseEnter={() => setShowIcons(true)}
        onMouseLeave={() => setShowIcons(false)}
      >
        <div className="p-2 h-full flex flex-col items-center space-y-3 pt-4">
          {sidebarItems.map((item) => {
            const isActive = isActiveRoute(item.path);
            const colors = getColorClasses(item.color, isActive);
            const IconComponent = item.icon;

            return (
              <Link key={item.path} to={item.path} title={item.title}>
                <div
                  className={`p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? `${colors.bg} ${colors.border} border shadow-sm`
                      : "hover:bg-gray-50"
                  }`}
                >
                  <IconComponent className={`h-5 w-5 ${colors.icon}`} />
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-24 z-50 p-2 bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <FiChevronLeft className="h-4 w-4 text-gray-600" />
          ) : (
            <FiChevronRight className="h-4 w-4 text-gray-600" />
          )}
        </motion.div>
      </motion.button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
