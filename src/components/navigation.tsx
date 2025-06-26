import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX, FiSearch, FiUser } from "react-icons/fi";
import { auth, db } from "../context/firebaseProvider";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import SkeletonNav from "./ui/navbarSkeleton";
import userLogout from "@/hooks/userLogout";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role);
        } else {
          setUserRole("USER");
        }
      }
    });
    return () => unsubscribe();
  }, []);

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  let navLinks: any = [];

  if (user && userRole === null) {
    return <SkeletonNav />;
  }

  if (userRole === "USER" || userRole === null) {
    navLinks = [
      { name: t("navigation.flyer"), path: "/explore/flyers" },
      { name: t("navigation.coupon"), path: "/explore/coupons" },
      { name: t("navigation.stores"), path: "/stores" },
      { name: t("navigation.favourite"), path: "/favourite" },
      { name: t("navigation.wishlist"), path: "/wishlist" },
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
                  }`}
                >
                  <FiUser className="mr-1" size={18} />
                  {t("signIn")}
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden focus:outline-none ${
                isScrolled 
                  ? "text-gray-600 hover:text-yellow-600" 
                  : userRole === "ADMIN"
                    ? "text-blue-100 hover:text-white"
                    : "text-gray-600 hover:text-yellow-600"
              }`}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[72px] bg-white border-t border-gray-100 shadow-lg z-50">
          <div className="px-4 py-3 space-y-3 max-h-[calc(100vh-72px)] overflow-y-auto">
            {navLinks.map((link: any) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block text-sm font-medium ${
                  location.pathname === link.path
                    ? "text-yellow-600"
                    : "text-gray-800 hover:text-yellow-600"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-gray-100 pt-3">
              {/* Search */}
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("navigation.search")}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <FiSearch
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              <div className="flex space-x-2 mb-3">
                <button
                  onClick={() => changeLanguage("fr")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    i18n.language === "fr"
                      ? "bg-yellow-100 text-yellow-800 font-medium"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Française
                </button>
                <button
                  onClick={() => changeLanguage("en")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    i18n.language === "en"
                      ? "bg-yellow-100 text-yellow-800 font-medium"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  English
                </button>
              </div>

              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-800 font-semibold">
                      {user.displayName
                        ? user.displayName.charAt(0)
                        : user.email.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">
                      {user.displayName || user.email}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/profile"
                      className="text-center px-3 py-2 text-sm bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
                    >
                      {t("navigation.profile")}
                    </Link>
                    {userRole !== "USER" ? (
                      <>
                        <Link
                          to="/stores"
                          className="text-center px-3 py-2 text-sm bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
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
                      className="w-full px-3 py-2 text-sm bg-yellow-100 rounded-md text-yellow-800 hover:bg-yellow-200"
                    >
                      {t("signOut")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="text-center px-3 py-2 text-sm bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
                  >
                    {t("signIn")}
                  </Link>
                  <Link
                    to="/signup"
                    className="text-center px-3 py-2 text-sm bg-yellow-500 rounded-md text-white hover:bg-yellow-600"
                  >
                    {t("signUp")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
