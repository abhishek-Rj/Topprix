import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX, FiMapPin } from "react-icons/fi";
import SkeletonNav from "./ui/navbarSkeleton";
import userLogout from "@/hooks/userLogout";
import useAuthenticate from "@/hooks/authenticationt";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, userRole, loading } = useAuthenticate();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  let navLinks: any = [];

  if (loading) {
    return <SkeletonNav />;
  }

  if (userRole === "USER" || userRole === null) {
    navLinks = [
      { name: t("navigation.flyer"), path: "/explore/flyers" },
      { name: t("navigation.coupon"), path: "/explore/coupons" },
      { name: t("navigation.antiWaste"), path: "/explore/anti-waste" },
      { name: t("navigation.stores"), path: "/stores" },
      { name: t("navigation.wishlist"), path: "/wishlist" },
      { name: t("navigation.shoppingLists"), path: "/shopping-lists" },
      { name: t("navigation.profile"), path: "/profile" },
    ];
  }

  if (userRole === "RETAILER") {
    navLinks = [
      { name: t("navigation.dashboard"), path: "/retailer-dashboard" },
      { name: t("navigation.subscriptions"), path: "/subscriptions" },
      { name: t("navigation.yourStores"), path: "/stores" },
      { name: t("navigation.yourFlyers"), path: "/explore/flyers" },
      { name: t("navigation.yourCoupons"), path: "/explore/coupons" },
      { name: t("navigation.antiWaste"), path: "/explore/anti-waste" },
      { name: t("navigation.profile"), path: "/profile" },
    ];
  }

  if (userRole === "ADMIN") {
    navLinks = [
      { name: t("navigation.dashboard"), path: "/admin-dashboard" },
      { name: t("navigation.pricingPlans"), path: "/admin/pricing-plans" },
      { name: t("navigation.stores"), path: "/stores" },
      { name: t("navigation.flyer"), path: "/explore/flyers" },
      { name: t("navigation.coupon"), path: "/explore/coupons" },
      { name: t("navigation.antiWaste"), path: "/explore/anti-waste" },
      { name: t("navigation.profile"), path: "/profile" },
    ];
  }

  return (
    <>
      <header
        className={`fixed w-full z-[60] transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-md py-2"
            : userRole === "ADMIN"
            ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3 sm:py-4"
            : "bg-yellow-50 py-3 sm:py-4"
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/topprix.mu.png"
                alt="Topprix.mu"
                className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg p-1 ${
                  userRole === "ADMIN" ? "bg-blue-100" : "bg-yellow-100"
                }`}
              />
              <span
                className={`text-xl sm:text-2xl font-bold ${
                  isScrolled
                    ? "text-yellow-600"
                    : userRole === "ADMIN"
                    ? "text-white"
                    : "text-yellow-600"
                }`}
              >
                Topprix.mu
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {navLinks.map((link: any) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm hover:scale-105 transition-transform font-medium ${
                    location.pathname === link.path
                      ? userRole === "ADMIN"
                        ? "text-white border-b-2 border-white pb-1"
                        : "text-yellow-600 border-b-2 border-yellow-600 pb-1"
                      : isScrolled
                      ? "text-gray-800 hover:text-yellow-600"
                      : userRole === "ADMIN"
                      ? "text-blue-100 hover:text-white"
                      : "text-gray-800 hover:text-yellow-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Tablet Navigation - Show fewer items */}
            <nav className="hidden md:flex lg:hidden items-center space-x-3">
              {navLinks.slice(0, 4).map((link: any) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs hover:scale-105 transition-transform font-medium ${
                    location.pathname === link.path
                      ? userRole === "ADMIN"
                        ? "text-white border-b-2 border-white pb-1"
                        : "text-yellow-600 border-b-2 border-yellow-600 pb-1"
                      : isScrolled
                      ? "text-gray-800 hover:text-yellow-600"
                      : userRole === "ADMIN"
                      ? "text-blue-100 hover:text-white"
                      : "text-gray-800 hover:text-yellow-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-3 lg:space-x-6">
              {/* Language Selector */}
              <div className="relative group">
                <button
                  className={`font-medium text-xs lg:text-sm ${
                    isScrolled
                      ? "text-gray-600 hover:text-yellow-600"
                      : userRole === "ADMIN"
                      ? "text-blue-100 hover:text-white"
                      : "text-gray-600 hover:text-yellow-600"
                  }`}
                >
                  {i18n.language === "en" ? t("language.en") : t("language.fr")}
                </button>
                <div className="absolute right-0 mt-2 w-28 bg-white rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={() => changeLanguage("fr")}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 w-full text-left ${
                      i18n.language === "fr"
                        ? "font-semibold text-yellow-600"
                        : ""
                    }`}
                  >
                    {t("language.french")}
                  </button>
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 w-full text-left ${
                      i18n.language === "en"
                        ? "font-semibold text-yellow-600"
                        : ""
                    }`}
                  >
                    {t("language.english")}
                  </button>
                </div>
              </div>

              {user ? (
                <div className="relative group">
                  <button
                    className={`flex items-center space-x-1 ${
                      isScrolled
                        ? "text-gray-600 hover:text-yellow-600"
                        : userRole === "ADMIN"
                        ? "text-blue-100 hover:text-white"
                        : "text-gray-600 hover:text-yellow-600"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center font-semibold text-xs lg:text-sm ${
                        userRole === "ADMIN"
                          ? "bg-white text-blue-600"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {user.displayName
                        ? user.displayName.charAt(0).toUpperCase()
                        : user.email.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50"
                    >
                      {t("navigation.settings")}
                    </Link>
                    {userRole === "RETAILER" && (
                      <>
                        <Link
                          to="/stores"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50"
                        >
                          {t("navigation.yourStores")}
                        </Link>
                        <Link
                          to="/stores/create-new-store"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 border-t border-gray-100"
                        >
                          <span className="flex items-center">
                            <span className="mr-2">🏪</span>
                            {t("navigation.createStore")}
                          </span>
                        </Link>
                      </>
                    )}
                    <button
                      onClick={async () => {
                        try {
                          await userLogout();
                          navigate("/login");
                        } catch (error) {
                          console.error("Error signing out:", error);
                        }
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 border-t border-gray-100"
                    >
                      {t("signOut")}
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md transition-colors whitespace-nowrap"
                >
                  <FiMapPin className="mr-1 sm:mr-1.5 w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">
                    {t("location.loginForDeals")}
                  </span>
                  <span className="xs:hidden">Deals</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? (
                <FiX className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <FiMenu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link: any) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium py-2 px-4 rounded-md ${
                      location.pathname === link.path
                        ? "bg-yellow-100 text-yellow-700"
                        : "text-gray-700 hover:bg-yellow-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Additional mobile-only actions for retailers */}
                {userRole === "RETAILER" && (
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <Link
                      to="/stores/create-new-store"
                      className="flex items-center text-sm font-medium py-2 px-4 rounded-md bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
                    >
                      <span className="mr-2">🏪</span>
                      {t("navigation.createStore")}
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navigation;
