import { useNavigate } from "react-router-dom";
import {
  HiNewspaper,
  HiTag,
  HiUser,
  HiMenu,
  HiX,
  HiShoppingBag,
  HiStar,
  HiTrendingUp,
  HiCheckCircle,
} from "react-icons/hi";
import { FaStore, FaRegSmile, FaRegMoneyBillAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import useAuthenticate from "@/hooks/authenticationt";
import { CouponCard } from "@/components/CouponCard";
import { FlyerCard } from "@/components/FlyerCard";
import baseUrl from "@/hooks/baseurl";
import { useTranslation } from "react-i18next";
import i18n from "../lib/i18n";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [flyers, setFlyers] = useState<any[]>([]);
  const { user, userRole } = useAuthenticate();

  useEffect(() => {
    try {
      (async () => {
        const fetchCoupons = await fetch(`${baseUrl}coupons?limit=3`);
        if (!fetchCoupons.ok) {
          toast.error(t("error.generic"));
          throw new Error(t("error.fetchCoupons"));
        }
        setCoupons((await fetchCoupons.json()).coupons);
      })();
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error(t("error.fetchCoupons"));
    }
  }, []);

  useEffect(() => {
    try {
      (async () => {
        const fetchFlyers = await fetch(`${baseUrl}flyers?limit=3`);
        if (!fetchFlyers.ok) {
          toast.error(t("error.generic"));
          throw new Error(t("error.fetchFlyers"));
        }
        setFlyers((await fetchFlyers.json()).flyers);
      })();
    } catch (error) {
      console.error("Error fetching flyers:", error);
      toast.error(t("error.fetchFlyers"));
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Get user name for display
  const userName = user?.displayName || user?.email?.split("@")[0] || null;
  const loginButtonClassName = user
    ? "text-yellow-800 font-bold bg-yellow-200"
    : "";

  return (
    <div
      className={`min-h-screen ${
        userRole === "ADMIN"
          ? "bg-gradient-to-br from-blue-50 via-white to-indigo-50"
          : "bg-gradient-to-br from-yellow-50 via-white to-orange-50"
      }`}
    >
      {/* Navbar */}
      <nav
        className={`fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-lg border-b ${
          userRole === "ADMIN" ? "border-blue-100" : "border-yellow-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="flex items-center hover:opacity-80 transition-opacity duration-200"
              >
                <img
                  src={"/topprix.mu.png"}
                  alt="Logo Topprix.mu"
                  className={`w-10 h-10 mr-2 rounded-lg p-1 ${
                  userRole === "ADMIN" ? "bg-blue-200" : "bg-yellow-200"
                }`}
                />
                <h1
                  className={`text-2xl font-bold ${
                    userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"
                  }`}
                >
                  Topprix.mu
                </h1>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate("/explore/coupons")}
                className={`flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors duration-200 ${
                  userRole === "ADMIN"
                    ? "hover:text-blue-600"
                    : "hover:text-yellow-600"
                }`}
              >
                <HiTag />
                {i18n.language === "fr"
                  ? "Explorer les Prospectus"
                  : "Explore Flyers"}
              </button>
              <button
                onClick={() => navigate("/explore/flyers")}
                className={`flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors duration-200 ${
                  userRole === "ADMIN"
                    ? "hover:text-blue-600"
                    : "hover:text-yellow-600"
                }`}
              >
                <HiNewspaper />
                {i18n.language === "fr"
                  ? "Explorer les Coupons"
                  : "Explore Coupons"}
              </button>
              <button
                onClick={() => {
                  if (user) {
                    navigate("/profile");
                  } else {
                    navigate("/login");
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 ${loginButtonClassName} rounded-full transition-all duration-200 shadow-md hover:shadow-lg ${
                  userRole === "ADMIN"
                    ? "hover:bg-blue-300"
                    : "hover:bg-yellow-300"
                }`}
              >
                {user ? (
                  <>{userName?.charAt(0).toUpperCase()}</>
                ) : (
                  <>
                    <HiUser />
                    {i18n.language === "fr" ? "Connexion" : "Login"}
                  </>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 text-gray-700 transition-colors duration-200 ${
                userRole === "ADMIN"
                  ? "hover:text-blue-600"
                  : "hover:text-yellow-600"
              }`}
            >
              {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`md:hidden bg-white border-t ${
                userRole === "ADMIN" ? "border-blue-100" : "border-yellow-100"
              }`}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => {
                    navigate("/explore/flyers");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-gray-700 rounded-md transition-colors duration-200 ${
                    userRole === "ADMIN"
                      ? "hover:text-blue-600 hover:bg-blue-50"
                      : "hover:text-yellow-600 hover:bg-yellow-50"
                  }`}
                >
                  <HiTag />
                  {i18n.language === "fr"
                    ? "Explorer les Prospectus"
                    : "Explore Flyers"}
                </button>
                <button
                  onClick={() => {
                    navigate("/explore/coupons");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-gray-700 rounded-md transition-colors duration-200 ${
                    userRole === "ADMIN"
                      ? "hover:text-blue-600 hover:bg-blue-50"
                      : "hover:text-yellow-600 hover:bg-yellow-50"
                  }`}
                >
                  <HiNewspaper />
                  {i18n.language === "fr"
                    ? "Explorer les Coupons"
                    : "Explore Coupons"}
                </button>
                <button
                  onClick={() => {
                    if (user) {
                      navigate("/profile");
                    } else {
                      navigate("/login");
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 ${loginButtonClassName} rounded-full transition-all duration-200 ${
                    userRole === "ADMIN"
                      ? "hover:bg-blue-300"
                      : "hover:bg-yellow-300"
                  }`}
                >
                  {user ? (
                    <>{userName?.split(" ")[0]}</>
                  ) : (
                    <>
                      <HiUser />
                      {i18n.language === "fr" ? "Connexion" : "Login"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div
          className={`absolute inset-0 ${
            userRole === "ADMIN"
              ? "bg-gradient-to-r from-blue-100/50 to-indigo-100/50"
              : "bg-gradient-to-r from-yellow-100/50 to-orange-100/50"
          }`}
        ></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                  userRole === "ADMIN"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                <HiTrendingUp className="w-4 h-4" />
                {i18n.language === "fr"
                  ? "Économisez jusqu'à 70% sur vos marques préférées"
                  : "Save up to 70% on your favorite brands"}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`mb-6 p-8 rounded-3xl ${
                userRole === "ADMIN"
                  ? "bg-gradient-to-r from-blue-100/80 to-indigo-100/80"
                  : "bg-gradient-to-r from-yellow-100/80 to-orange-100/80"
              }`}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                {i18n.language === "fr" ? "Découvrez des" : "Discover"}
                <span
                  className={`${
                    userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"
                  } block`}
                >
                  {i18n.language === "fr"
                    ? "Offres Incroyables"
                    : "Amazing Offers"}
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              {i18n.language === "fr"
                ? "Trouvez les meilleurs coupons et prospectus de vos magasins préférés."
                : "Find the best coupons and flyers from your favorite stores."}
              <span
                className={`${
                  userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"
                } font-semibold`}
              >
                {" "}
                {i18n.language === "fr"
                  ? "Économisez plus, achetez plus intelligemment."
                  : "Save more, shop smarter."}
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button
                onClick={() => navigate("/explore/flyers")}
                className={`flex items-center gap-3 px-8 py-4 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg ${
                  userRole === "ADMIN"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                }`}
              >
                <HiTag className="w-5 h-5" />
                {i18n.language === "fr"
                  ? "Parcourir les Prospectus"
                  : "Browse Flyers"}
              </button>
              <button
                onClick={() => navigate("/explore/coupons")}
                className={`flex items-center gap-3 px-8 py-4 bg-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 font-semibold text-lg ${
                  userRole === "ADMIN"
                    ? "text-blue-600 hover:bg-blue-50 border-blue-500"
                    : "text-yellow-600 hover:bg-yellow-50 border-yellow-500"
                }`}
              >
                <HiNewspaper className="w-5 h-5" />
                {i18n.language === "fr" ? "Voir les Coupons" : "View Coupons"}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Flyers Section */}
      <section
        className={`py-20 px-4 ${
          userRole === "ADMIN"
            ? "bg-gradient-to-br from-blue-50 to-indigo-50"
            : "bg-gradient-to-br from-yellow-50 to-orange-50"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {i18n.language === "fr"
                  ? "Prospectus Populaires"
                  : "Popular Flyers"}
              </h2>
              <p className="text-gray-600">
                {i18n.language === "fr"
                  ? "Découvrez les dernières offres des meilleurs magasins"
                  : "Discover the latest offers from the best stores"}
              </p>
            </div>
            <button
              onClick={() => navigate("/explore/flyers")}
              className={`font-medium flex items-center gap-2 group px-4 py-2 rounded-lg ${
                userRole === "ADMIN"
                  ? "text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100"
                  : "text-yellow-600 hover:text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
              }`}
            >
              Voir Tout
              <HiTrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {flyers.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {flyers.map((flyer, index) => (
                <motion.div
                  key={flyer.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FlyerCard flyer={flyer} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-16"
            >
              <div className="text-8xl mb-6">😔</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Aucun prospectus disponible aujourd'hui !
              </h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Revenez plus tard pour des offres incroyables et des promotions
                exclusives de vos magasins préférés.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Anti-Waste Promo Section (third last section) */}
      <section
        className={`py-16 px-4 ${
          userRole === "ADMIN"
            ? "bg-gradient-to-br from-green-50 to-blue-50"
            : "bg-gradient-to-br from-green-50 to-yellow-50"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 sm:p-12 bg-white/70 backdrop-blur shadow-xl border border-green-100"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                  {t("home.antiWastePromo.title")}
                </h2>
                <p className="text-gray-700 text-lg mb-6">
                  {t("home.antiWastePromo.subtitle")}
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{t("home.antiWastePromo.point1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{t("home.antiWastePromo.point2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{t("home.antiWastePromo.point3")}</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-start lg:items-end gap-4">
                <button
                  onClick={() => navigate("/explore/anti-waste")}
                  className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition-colors"
                >
                  {t("home.antiWastePromo.cta")}
                </button>
                <span className="text-sm text-gray-500">
                  {t("home.antiWastePromo.note")}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Coupon List */}
      <section
        className={`py-20 px-4 ${
          userRole === "ADMIN"
            ? "bg-gradient-to-br from-indigo-50 to-blue-50"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {i18n.language === "fr"
                  ? "Coupons Populaires"
                  : "Popular Coupons"}
              </h2>
              <p className="text-gray-600">
                {i18n.language === "fr"
                  ? "Économisez gros avec ces codes de réduction exclusifs"
                  : "Save big with these exclusive discount codes"}
              </p>
            </div>
            <button
              onClick={() => navigate("/explore/coupons")}
              className={`font-medium flex items-center gap-2 group px-4 py-2 rounded-lg ${
                userRole === "ADMIN"
                  ? "text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100"
                  : "text-yellow-600 hover:text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
              }`}
            >
              Voir Tout
              <HiTrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {coupons.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {coupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CouponCard coupon={coupon} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-16"
            >
              <div className="text-8xl mb-6">🎫</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Aucun coupon disponible aujourd'hui !
              </h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Revenez bientôt pour des codes de réduction incroyables et des
                offres exclusives.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className={`py-20 px-4 ${
          userRole === "ADMIN"
            ? "bg-gradient-to-br from-blue-50 to-indigo-50"
            : "bg-gradient-to-br from-yellow-50 to-orange-50"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {i18n.language === "fr" ? "Ce que disent nos" : "What Our"}{" "}
              <span
                className={`${
                  userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"
                }`}
              >
                {i18n.language === "fr" ? "Clients" : "Customers"}
              </span>
              {i18n.language === "fr" ? "" : " Say"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {i18n.language === "fr"
                ? "Rejoignez des milliers de clients satisfaits qui économisent de l'argent chaque jour"
                : "Join thousands of satisfied customers who save money every day"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div
                  className={`flex ${
                    userRole === "ADMIN" ? "text-blue-400" : "text-yellow-400"
                  }`}
                >
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                {i18n.language === "fr"
                  ? "\"Topprix m'a fait économiser des centaines d'euros ! Les offres sont incroyables et l'application est si facile à utiliser.\""
                  : '"Topprix has saved me hundreds of euros! The offers are incredible and the app is so easy to use."'}
              </p>
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                    userRole === "ADMIN" ? "bg-blue-500" : "bg-yellow-500"
                  }`}
                >
                  S
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Sarah Johnson
                  </div>
                  <div className="text-gray-500 text-sm">
                    {i18n.language === "fr"
                      ? "Cliente Régulière"
                      : "Regular Customer"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div
                  className={`flex ${
                    userRole === "ADMIN" ? "text-blue-400" : "text-yellow-400"
                  }`}
                >
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                {i18n.language === "fr"
                  ? '"J\'adore comment je peux trouver toutes les meilleures offres en un seul endroit. La section prospectus est ma préférée !"'
                  : '"I love how I can find all the best offers in one place. The flyers section is my favorite!"'}
              </p>
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                    userRole === "ADMIN" ? "bg-blue-500" : "bg-yellow-500"
                  }`}
                >
                  M
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Mike Chen</div>
                  <div className="text-gray-500 text-sm">
                    {i18n.language === "fr"
                      ? "Acheteur Intelligent"
                      : "Smart Shopper"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div
                  className={`flex ${
                    userRole === "ADMIN" ? "text-blue-400" : "text-yellow-400"
                  }`}
                >
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                {i18n.language === "fr"
                  ? '"Les coupons sont toujours valides et les économies sont réelles. Je recommande vivement Topprix !"'
                  : '"The coupons are always valid and the savings are real. I highly recommend Topprix!"'}
              </p>
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                    userRole === "ADMIN" ? "bg-blue-500" : "bg-yellow-500"
                  }`}
                >
                  E
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Emma Davis</div>
                  <div className="text-gray-500 text-sm">
                    {i18n.language === "fr"
                      ? "Chasseuse de Bonnes Affaires"
                      : "Deal Hunter"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {i18n.language === "fr" ? "Pourquoi choisir" : "Why Choose"}{" "}
              <span
                className={`${
                  userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"
                }`}
              >
                Topprix.mu
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {i18n.language === "fr"
                ? "Nous rendons l'économie d'argent facile et amusante. Découvrez des"
                : "We make saving money easy and fun. Discover"}
              {i18n.language === "fr"
                ? "offres incroyables de vos magasins préférés."
                : "amazing offers from your favorite stores."}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={itemVariants} className="text-center group">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 ${
                  userRole === "ADMIN"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500"
                }`}
              >
                <FaRegMoneyBillAlt className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {i18n.language === "fr"
                  ? "Économisez de l'Argent"
                  : "Save Money"}
              </h3>
              <p className="text-gray-600">
                {i18n.language === "fr"
                  ? "Obtenez des réductions exclusives et économisez sur chaque achat"
                  : "Get exclusive discounts and save on every purchase"}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center group">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 ${
                  userRole === "ADMIN"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500"
                }`}
              >
                <HiShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Achats Faciles
              </h3>
              <p className="text-gray-600">
                Parcourez les offres de centaines de magasins en un seul endroit
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center group">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 ${
                  userRole === "ADMIN"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500"
                }`}
              >
                <FaRegSmile className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Clients Satisfaits
              </h3>
              <p className="text-gray-600">
                Rejoignez des milliers d'acheteurs satisfaits dans le monde
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center group">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 ${
                  userRole === "ADMIN"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500"
                }`}
              >
                <HiCheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {i18n.language === "fr"
                  ? "Offres Vérifiées"
                  : "Verified Offers"}
              </h3>
              <p className="text-gray-600">
                {i18n.language === "fr"
                  ? "Toutes les offres sont vérifiées et mises à jour régulièrement"
                  : "All offers are verified and updated regularly"}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Create Store Section */}
      <section
        className={`py-20 px-4 ${
          userRole === "ADMIN"
            ? "bg-gradient-to-r from-blue-500 to-indigo-500"
            : "bg-gradient-to-r from-yellow-500 to-orange-500"
        }`}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div
              className={`p-8 rounded-3xl ${
                userRole === "ADMIN"
                  ? "bg-gradient-to-r from-blue-100/80 to-indigo-100/80"
                  : "bg-gradient-to-r from-yellow-100/80 to-orange-100/80"
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {i18n.language === "fr"
                  ? "Vous avez un Magasin ?"
                  : "Have a Store?"}
              </h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-700">
                {i18n.language === "fr"
                  ? "Créez votre profil de magasin et commencez à partager vos coupons et prospectus avec des milliers de clients potentiels. Rejoignez notre communauté grandissante de détaillants !"
                  : "Create your store profile and start sharing your coupons and flyers with thousands of potential customers. Join our growing community of retailers!"}
              </p>
              <button
                onClick={() => {
                  if (userRole === "ADMIN" || userRole === "RETAILER") {
                    navigate("stores/create-new-store");
                  } else if (userRole === "USER") {
                    navigate("/signup");
                    toast.info(t("auth.mustLoginAsRetailer"));
                  } else {
                    navigate("/signup");
                    toast.info(t("auth.mustLoginAsRetailer"));
                  }
                }}
                className={`flex items-center gap-3 px-8 py-4 bg-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg mx-auto ${
                  userRole === "ADMIN"
                    ? "text-blue-600 hover:bg-blue-50"
                    : "text-yellow-600 hover:bg-yellow-50"
                }`}
              >
                <FaStore className="w-5 h-5" />
                {i18n.language === "fr"
                  ? "Créer Votre Magasin"
                  : "Create Your Store"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
