import { useState, useEffect } from "react";
import { HiTag, HiUser } from "react-icons/hi";
import Footer from "../components/Footer";
import { FaStore } from "react-icons/fa";
import { motion } from "framer-motion";
import Navigation from "../components/navigation";

import { toast } from "react-toastify";
import baseUrl from "../hooks/baseurl";
import { CouponList } from "../components/CouponCard";
import { useSearchParams } from "react-router-dom";
import useAuthenticate from "@/hooks/authenticationt";
import { useTranslation } from "react-i18next";
import FloatingSidebar from "@/components/FloatingSidebar";

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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [sortBy, setSortBy] = useState("all");

  const [pagination, setPagination] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Will be set based on screen size
  const itemsPerPage = 12;
  const { userRole } = useAuthenticate();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem("sortBy", "all");
  }, []);

  useEffect(() => {
    const category = searchParams.get("category") || "all";
    const subcategory = searchParams.get("subcategory") || "all";
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
  }, [searchParams]);

  // Set sidebar state based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const isDesktop = window.innerWidth >= 768; // md breakpoint
      setIsSidebarOpen(isDesktop);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fetch categories for name mapping
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseUrl}categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Helper functions to get names from IDs
  const getCategoryName = (categoryId: string) => {
    if (categoryId === "all") return t("coupons.allCategories");
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const getSubcategoryName = (subcategoryId: string) => {
    if (subcategoryId === "all") return "";
    const subcategory = categories.find((cat) => cat.id === subcategoryId);
    return subcategory?.name || subcategoryId;
  };

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

  const handleEdit = () => {
    // Placeholder for edit functionality
    toast.info("Edit functionality coming soon!");
  };

  const handleDelete = () => {
    // Placeholder for delete functionality
    toast.info("Delete functionality coming soon!");
  };

  const filteredCoupons = (coupons || []).filter((coupon) => {
    if (!coupon) return false;
    const matchesCategories =
      selectedCategory === "all" ||
      coupon.categories.some((cat) => selectedCategory === cat.id);
    return matchesCategories;
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

      {/* Floating Sidebar */}
      <FloatingSidebar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSubcategory={selectedSubcategory}
        onSubcategoryChange={setSelectedSubcategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        userRole={userRole || "USER"}
      />
      <main
        id="goto"
        className={`pt-20 pb-10 transition-all duration-300 ${
          isSidebarOpen ? "md:pl-80" : ""
        } ${userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"}`}
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

          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <span className="text-sm text-gray-600">
                  {t("coupons.showing")} {filteredCoupons.length}{" "}
                  {t("coupons.of")} {pagination?.total || 0}{" "}
                  {t("coupons.coupons")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {t("coupons.category")}: {getCategoryName(selectedCategory)}
                </span>
                {selectedSubcategory !== "all" && (
                  <span className="text-sm text-gray-600">
                    | {t("coupons.subcategory")}:{" "}
                    {getSubcategoryName(selectedSubcategory)}
                  </span>
                )}
                <span className="text-sm text-gray-600">
                  | {t("coupons.sortBy")}:{" "}
                  {sortBy === "all"
                    ? t("coupons.all")
                    : sortBy === "active"
                    ? t("coupons.active")
                    : t("coupons.inactive")}
                </span>
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
      <Footer sidebarOpen={isSidebarOpen} />
    </>
  );
}
