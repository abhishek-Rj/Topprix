import { useState, useEffect } from "react";
import {
  HiTag,
  HiSearch,
  HiFilter,
  HiSortAscending,
  HiUser,
  HiShoppingCart,
} from "react-icons/hi";
import Footer from "../components/Footer";
import { FaStore } from "react-icons/fa";
import { motion } from "framer-motion";
import Navigation from "../components/navigation";
import { auth, db } from "../context/firebaseProvider";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import baseUrl from "../hooks/baseurl";
import { CouponList } from "../components/CouponCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthenticate from "@/hooks/authenticationt";
import { useTranslation } from "react-i18next";

interface Coupon {
  id: string;
  title: string;
  store: {
    name: string;
    logo: string;
  };
  discount: string;
  code: string;
  categories: Array<{
    id: string;
    name: string;
  }>;
  startDate: string;
  endDate: string;
  barcodeUrl?: string;
  qrCodeUrl?: string;
  isOnline: boolean;
  isInStore: boolean;
  isPremium: boolean;
  description?: string;
}

export default function CouponPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("all");
  const [userData, setUserData] = useState<any>({
    name: "",
    role: "",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const itemsPerPage = 12;
  const { userRole } = useAuthenticate();

  useEffect(() => {
    localStorage.setItem("sortBy", "all");
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseUrl}categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        } else {
          toast.error("Failed to fetch categories");
        }
      } catch (error) {
        toast.error("Error loading categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category") || "all";
    setSelectedCategory(category);
  }, [searchParams]);

  useEffect(() => {
    if (currentPage !== 1) {
      setTimeout(() => {
        const element = document.getElementById("goto");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    const sortBy = localStorage.getItem("sortBy") || "all";

    let url = `${baseUrl}coupons?page=${currentPage}&limit=${itemsPerPage}`;

    if (sortBy === "inactive") {
      url += "&active=false";
    } else if (sortBy === "active") {
      url += "&active=true";
    }

    if (selectedCategory !== "all") {
      url += `&categoryId=${selectedCategory}`;
    }

    const fetchCoupons = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setCoupons(data.coupons);
          setPagination(data.pagination);
        } else {
          toast.error("Failed to fetch coupons");
        }
      } catch (error) {
        toast.error("Error loading coupons");
      }
    };
    fetchCoupons();
  }, [currentPage, sortBy, selectedCategory]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserData({
            name: userData.name,
            role: userData.role || "USER",
          });
        } else {
          toast.info("You are not Signed in");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = () => {
    // Placeholder for edit functionality
    toast.info("Edit functionality coming soon!");
  };

  const handleDelete = () => {
    // Placeholder for delete functionality
    toast.info("Delete functionality coming soon!");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchParams({ category });
  };

  const filteredCoupons = (coupons || []).filter((coupon) => {
    if (!coupon) return false;
    const matchesSearch =
      (coupon.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (coupon.store?.name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );
    const matchesCategories =
      selectedCategory === "all" ||
      coupon.categories.some((cat) => selectedCategory === cat.id);
    return matchesSearch && matchesCategories;
  });

  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
    if (sortBy === "active") {
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    }
    if (sortBy === "inactive") {
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    }
    return 0;
  });

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      <main
        id="goto"
        className={`pt-20 pb-10 ${
          userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          {currentPage === 1 ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`text-center mb-12 rounded-xl p-4 ${
                  userRole === "ADMIN" ? "bg-blue-100" : "bg-yellow-100"
                }`}
              >
                <h1 className="text-4xl pt-6 sm:text-5xl font-bold text-gray-900 mb-4">
                  {t("coupons.title")}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t("coupons.description")}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4 mb-8"
              >
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <HiTag
                    className={
                      userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"
                    }
                  />
                  <span className="text-gray-700">
                    {pagination?.totalItems || 0}+ {t("coupons.activeCoupons")}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <FaStore
                    className={
                      userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"
                    }
                  />
                  <span className="text-gray-700">
                    500+ {t("coupons.partnerStores")}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <HiUser
                    className={
                      userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"
                    }
                  />
                  <span className="text-gray-700">
                    1M+ {t("coupons.happyUsers")}
                  </span>
                </div>
              </motion.div>
            </>
          ) : (
            <></>
          )}

          <div className="pt-8">
            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base hidden sm:block" />
                  <input
                    type="text"
                    placeholder={t("coupons.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-3 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border text-sm sm:text-base ${
                      userRole === "ADMIN"
                        ? "focus:ring-blue-500 focus:border-blue-500"
                        : "focus:ring-yellow-500 focus:border-yellow-500"
                    }`}
                  />
                </div>
                <div className="relative">
                  <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base hidden sm:block" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className={`w-full pl-3 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border text-sm sm:text-base ${
                      userRole === "ADMIN"
                        ? "focus:ring-blue-500 focus:border-blue-500"
                        : "focus:ring-yellow-500 focus:border-yellow-500"
                    }`}
                  >
                    <option value="all">{t("coupons.allCategories")}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <HiSortAscending className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base hidden sm:block" />
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      const newSortBy = e.target.value;
                      setSortBy(newSortBy);
                      localStorage.setItem("sortBy", newSortBy);
                    }}
                    className={`w-full pl-3 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border text-sm sm:text-base ${
                      userRole === "ADMIN"
                        ? "focus:ring-blue-500 focus:border-blue-500"
                        : "focus:ring-yellow-500 focus:border-yellow-500"
                    }`}
                  >
                    <option value="all">{t("coupons.all")}</option>
                    <option value="active">{t("coupons.active")}</option>
                    <option value="inactive">{t("coupons.inactive")}</option>
                  </select>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-xs sm:text-sm text-gray-600">
                    {t("coupons.showing")} {filteredCoupons.length}{" "}
                    {t("coupons.of")} {pagination?.total || 0}{" "}
                    {t("coupons.coupons")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Coupon Grid */}
          <div
            className={`min-h-[200px] sm:min-h-[300px] rounded-xl p-4 sm:p-5 shadow-inner ${
              userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"
            }`}
          >
            {coupons.length > 0 ? (
              <CouponList
                coupons={sortedCoupons}
                pagination={pagination}
                onPageChange={setCurrentPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">{t("coupons.noCouponsFound")}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
