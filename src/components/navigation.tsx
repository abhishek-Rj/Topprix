import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX, FiSearch, FiUser } from "react-icons/fi";
import SkeletonNav from "./ui/navbarSkeleton";
import userLogout from "@/hooks/userLogout";
import useAuthenticate from "@/hooks/authenticationt";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
      { name: t("navigation.stores"), path: "/stores" },
      { name: t("navigation.wishlist"), path: "/wishlist" },
      { name: "Shopping Lists", path: "/shopping-lists" },
      { name: t("navigation.profile"), path: "/profile" },
    ];
  }

  if (userRole === "RETAILER") {
    navLinks = [
      { name: t("navigation.dashboard"), path: "/retailer-dashboard" },
      { name: "Subscriptions", path: "/subscriptions" },
      { name: t("navigation.yourStores"), path: "/stores" },
      { name: t("navigation.yourFlyers"), path: "/explore/flyers" },
      { name: t("navigation.yourCoupons"), path: "/explore/coupons" },
      { name: t("navigation.profile"), path: "/profile" },
    ];
  }

  if (userRole === "ADMIN") {
    navLinks = [
      { name: t("navigation.dashboard"), path: "/admin-dashboard" },
      { name: "Pricing Plans", path: "/admin/pricing-plans" },
      { name: t("navigation.yourStores"), path: "/stores" },
      { name: t("navigation.yourFlyers"), path: "/explore/flyers" },
      { name: t("navigation.yourCoupons"), path: "/explore/coupons" },
      { name: t("navigation.profile"), path: "/profile" },
    ];
  }

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white shadow-md py-2" 
            : userRole === "ADMIN" 
              ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-4" 
              : "bg-yellow-50 py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logowb.png"
                alt="Topprix"
                className="h-10 w-10 rounded-lg"
              />
              <span
                className={`text-2xl font-bold ${
                  isScrolled 
                    ? "text-yellow-600" 
                    : userRole === "ADMIN"
                      ? "text-white"
                      : "text-yellow-600"
                }`}
              >
                Topprix
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
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

            <div className="hidden md:flex items-center space-x-6">
              {/* Language Selector */}
              <div className="relative group">
                <button className={`font-medium text-sm ${
                  isScrolled 
                    ? "text-gray-600 hover:text-yellow-600" 
                    : userRole === "ADMIN"
                      ? "text-blue-100 hover:text-white"
                      : "text-gray-600 hover:text-yellow-600"
                }`}>
                  {i18n.language === "en" ? "EN" : i18n.language.toUpperCase()}
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
                    Française
                  </button>
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 w-full text-left ${
                      i18n.language === "en"
                        ? "font-semibold text-yellow-600"
                        : ""
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {user ? (
                <div className="relative group">
                  <button className={`flex items-center space-x-1 ${
                    isScrolled 
                      ? "text-gray-600 hover:text-yellow-600" 
                      : userRole === "ADMIN"
                        ? "text-blue-100 hover:text-white"
                        : "text-gray-600 hover:text-yellow-600"
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      userRole === "ADMIN"
                        ? "bg-white text-blue-600"
                        : "bg-yellow-200 text-yellow-800"
                    }`}>
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
                    {userRole !== "USER" ? (
                      <>
                        <Link
                          to="/stores"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50"
                        >
                          {t("navigation.yourStores")}
                        </Link>
                      </>
                    ) : (
                      <></>
                    )}
                    <button
                      onClick={async () => {
                        try {
                          await userLogout();
                          navigate('/login');
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
                  className={`flex items-center text-sm font-medium ${
                    isScrolled 
                      ? "text-gray-600 hover:text-yellow-600" 
                      : userRole === "ADMIN"
                        ? "text-blue-100 hover:text-white"
                        : "text-gray-600 hover:text-yellow-600"
                  }`}>
                  <FiUser className="mr-1" />
                  {t("signIn")}
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
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
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navigation;
