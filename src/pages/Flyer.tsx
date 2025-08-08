import { useState, useEffect } from "react";
import {
  HiNewspaper,
  HiSearch,
  HiFilter,
  HiSortAscending,
  HiUser,
  HiShoppingCart,
} from "react-icons/hi";
import { FaStore } from "react-icons/fa";
import { motion } from "framer-motion";
import Navigation from "../components/navigation";
import Footer from "../components/Footer";
import baseUrl from "@/hooks/baseurl";
import { toast } from "react-toastify";
import FlyerList from "@/components/FlyerCard";
import Loader from "@/components/loading";
import useAuthenticate from "@/hooks/authenticationt";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

//@ts-ignore
interface Flyer {
  id: number;
  title: string;
  store: string;
  description: string;
  category: string;
  validUntil: string;
  image: string;
  featured: boolean;
}

export default function FlyerPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [flyers, setFlyers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<string>("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userRole } = useAuthenticate();

  useEffect(() => {
    const category = searchParams.get("category") || "all";
    setSelectedCategory(category);
  }, [searchParams]);

  useEffect(() => {
    const fetchFlyers = async () => {
      try {
        setLoading(true);
        let url = `${baseUrl}flyers?limit=12`;

        // Add category filter if selected
        if (selectedCategory !== "all") {
          url += `&categoryId=${selectedCategory}`;
        }

        // Add active/inactive filter
        if (sortBy === "active") {
          url += "&active=true";
        } else if (sortBy === "inactive") {
          url += "&active=false";
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch flyers");
        }
        const data = await response.json();
        setFlyers(data.flyers);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching flyers:", error);
        toast.error("Failed to load flyers");
      } finally {
        setLoading(false);
      }
    };

    fetchFlyers();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}categories`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchParams({ category });
  };

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      let url = `${baseUrl}flyers?page=${page}&limit=12`;

      if (selectedCategory !== "all") {
        url += `&categoryId=${selectedCategory}`;
      }

      if (sortBy === "active") {
        url += "&active=true";
      } else if (sortBy === "inactive") {
        url += "&active=false";
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch flyers");
      }
      const data = await response.json();
      setFlyers(data.flyers);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching flyers:", error);
      toast.error("Failed to load flyers");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (flyer: any) => {
    // Implement edit functionality if needed
    console.log("Edit flyer:", flyer);
  };

  const handleDelete = async (flyerId: string) => {
    try {
      const response = await fetch(`${baseUrl}flyers/${flyerId}`, {
        method: "DELETE",
        headers: {
          "user-email": user?.email || "",
        },
      });

      if (response.ok) {
        toast.success("Flyer deleted successfully");
        // Refresh the flyers list
        const updatedFlyers = flyers.filter((flyer) => flyer.id !== flyerId);
        setFlyers(updatedFlyers);
      } else {
        throw new Error("Failed to delete flyer");
      }
    } catch (error) {
      console.error("Error deleting flyer:", error);
      toast.error("Failed to delete flyer");
    }
  };

  const filteredFlyers = flyers.filter((flyer) =>
    flyer.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      <div
        className={`min-h-screen pt-16 ${
          userRole === "ADMIN"
            ? "bg-gradient-to-b from-blue-50 to-white"
            : "bg-gradient-to-b from-yellow-50 to-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section - Only show on first page */}
          {pagination && pagination.currentPage === 1 && (
            <div className="relative pt-24 pb-16">
              <div
                className={`absolute inset-0 rounded-3xl -z-10 ${
                  userRole === "ADMIN"
                    ? "bg-gradient-to-r from-blue-400/20 to-blue-600/20"
                    : "bg-gradient-to-r from-yellow-400/20 to-yellow-600/20"
                }`}
              />
              <div className="text-center max-w-4xl mx-auto">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
                >
                  {t("flyers.title")}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl text-gray-600 mb-8"
                >
                  {t("flyers.description")}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap justify-center gap-4 mb-8"
                >
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <HiNewspaper
                      className={
                        userRole === "ADMIN"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }
                    />
                    <span className="text-gray-700">
                      500+ {t("flyers.activeFlyers")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <FaStore
                      className={
                        userRole === "ADMIN"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }
                    />
                    <span className="text-gray-700">
                      200+ {t("flyers.partnerStores")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <HiUser
                      className={
                        userRole === "ADMIN"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }
                    />
                    <span className="text-gray-700">
                      50K+ {t("flyers.monthlyViews")}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Search and Filters Section */}
          {pagination && pagination.currentPage === 1 ? (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base hidden sm:block" />
                  <input
                    type="text"
                    placeholder={t("flyers.searchPlaceholder")}
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
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full pl-3 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border text-sm sm:text-base ${
                      userRole === "ADMIN"
                        ? "focus:ring-blue-500 focus:border-blue-500"
                        : "focus:ring-yellow-500 focus:border-yellow-500"
                    }`}
                  >
                    {/* Add category options here */}
                  </select>
                </div>
                <div className="relative">
                  <HiSortAscending className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base hidden sm:block" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full pl-3 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border text-sm sm:text-base ${
                      userRole === "ADMIN"
                        ? "focus:ring-blue-500 focus:border-blue-500"
                        : "focus:ring-yellow-500 focus:border-yellow-500"
                    }`}
                  >
                    <option value="all">{t("flyers.allFlyers")}</option>
                    <option value="active">{t("flyers.activeFlyers")}</option>
                    <option value="inactive">
                      {t("flyers.inactiveFlyers")}
                    </option>
                  </select>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-xs sm:text-sm text-gray-600">
                    {t("flyers.showing")} {flyers.length} {t("flyers.of")}{" "}
                    {filteredFlyers.length} {t("flyers.flyers")}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-8">
              {/* Filters and Search */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base hidden sm:block" />
                    <input
                      type="text"
                      placeholder={t("flyers.searchPlaceholder")}
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
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`w-full pl-3 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border text-sm sm:text-base ${
                        userRole === "ADMIN"
                          ? "focus:ring-blue-500 focus:border-blue-500"
                          : "focus:ring-yellow-500 focus:border-yellow-500"
                      }`}
                    >
                      {categories.map((category: any) => (
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
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`w-full pl-3 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border text-sm sm:text-base ${
                        userRole === "ADMIN"
                          ? "focus:ring-blue-500 focus:border-blue-500"
                          : "focus:ring-yellow-500 focus:border-yellow-500"
                      }`}
                    >
                      <option value="all">{t("flyers.allFlyers")}</option>
                      <option value="active">{t("flyers.activeFlyers")}</option>
                      <option value="inactive">
                        {t("flyers.inactiveFlyers")}
                      </option>
                    </select>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-xs sm:text-sm text-gray-600">
                      {t("flyers.showing")} {flyers.length} {t("flyers.of")}{" "}
                      {filteredFlyers.length} {t("flyers.flyers")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Flyer Grid */}
          <div
            className={`min-h-[200px] sm:min-h-[300px] rounded-xl p-4 sm:p-5 shadow-inner ${
              userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader />
              </div>
            ) : filteredFlyers.length > 0 ? (
              <FlyerList
                flyers={filteredFlyers}
                pagination={pagination}
                onPageChange={handlePageChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="text-center text-gray-700">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2 mb-4">
                  <HiNewspaper
                    className={
                      userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"
                    }
                  />
                  {t("flyers.noFlyersFound")}
                </h2>
                <p className="text-sm sm:text-base">
                  {searchQuery
                    ? t("flyers.noFlyersMatch")
                    : t("flyers.noFlyersAvailable")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
