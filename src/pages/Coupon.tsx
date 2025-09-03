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
  const [searchParams] = useSearchParams();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [sortBy, setSortBy] = useState("all");

  const [pagination, setPagination] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Will be set based on screen size
  const itemsPerPage = 20; // Maximum 20 coupons per page as required
  const { user, userRole } = useAuthenticate();
  const [categoriesFull, setCategoriesFull] = useState<any[]>([]);
  const [subcategoriesFlat, setSubcategoriesFlat] = useState<any[]>([]);
  const [userStores, setUserStores] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem("sortBy", "all");
  }, []);

  useEffect(() => {
    const category = searchParams.get("category") || "all";
    const subcategory = searchParams.get("subcategory") || "all";
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
  }, [searchParams]);

  // Fetch retailer stores using store API with ownerId
  useEffect(() => {
    const fetchRetailerStores = async () => {
      if (userRole !== "RETAILER") return;
      try {
        const userEmail = user?.email || localStorage.getItem("userEmail");
        if (!userEmail) return;
        const userResp = await fetch(`${baseUrl}user/${userEmail}`, {
          headers: { "user-email": userEmail },
        });
        if (!userResp.ok) return;
        const userData = await userResp.json();
        const userId = userData?.user?.id || userData?.id;
        if (!userId) return;

        const storesResp = await fetch(
          `${baseUrl}stores?ownerId=${encodeURIComponent(userId)}&limit=1000`,
          {
            headers: { "user-email": userEmail },
          }
        );
        if (!storesResp.ok) return;
        const storesData = await storesResp.json();
        setUserStores(
          Array.isArray(storesData.stores) ? storesData.stores : []
        );
      } catch (e) {
        console.error("Failed to fetch retailer stores for coupons:", e);
      }
    };
    fetchRetailerStores();
  }, [userRole, user?.email]);

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
        const response = await fetch(`${baseUrl}categories/with-subcategories`);
        if (response.ok) {
          const data = await response.json();
          const source = data.categories || data || [];
          setCategoriesFull(Array.isArray(source) ? source : []);
          const flattened = Array.isArray(source)
            ? source.flatMap((cat: any) =>
                (cat.subcategories || []).map((sub: any) => ({
                  id: sub.id,
                  name: sub.name,
                  categoryId: cat.id,
                  categoryName: cat.name,
                }))
              )
            : [];
          setSubcategoriesFlat(flattened);
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
    const category = categoriesFull.find((cat: any) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const getSubcategoryName = (subcategoryId: string) => {
    if (subcategoryId === "all") return "";
    const sub = subcategoriesFlat.find((s: any) => s.id === subcategoryId);
    return sub?.name || subcategoryId;
  };

  useEffect(() => {
    if (currentPage !== 1) {
      setTimeout(() => {
        const element = document.getElementById("goto");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    const fetchCoupons = async () => {
      try {
        // Category filtering is handled directly via categoryId param.

        // If retailer has multiple stores, fetch each store separately and combine
        if (userRole === "RETAILER") {
          if (!userStores || userStores.length === 0) {
            setCoupons([]);
            setPagination({
              total: 0,
              page: currentPage,
              limit: itemsPerPage,
              totalPages: 1,
              hasNextPage: false,
              hasPreviousPage: false,
              currentPage: currentPage,
              itemsPerPage: itemsPerPage,
            });
            return;
          }

          if (userStores.length > 1) {
            let allCoupons: any[] = [];
            for (const store of userStores) {
              let storeUrl = `${baseUrl}coupons?page=1&limit=1000&storeId=${encodeURIComponent(
                store.id
              )}`;
              if (sortBy === "inactive") {
                storeUrl += "&active=false";
              } else if (sortBy === "active") {
                storeUrl += "&active=true";
              }
              if (selectedCategory !== "all") {
                storeUrl += `&categoryId=${selectedCategory}`;
              }
              try {
                const resp = await fetch(storeUrl, {
                  headers: { "user-email": user?.email || "" },
                });
                if (resp.ok) {
                  const sData = await resp.json();
                  allCoupons = [...allCoupons, ...(sData.coupons || [])];
                }
              } catch (e) {
                console.error("Error fetching coupons for store", store.id, e);
              }
            }

            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            setCoupons(allCoupons.slice(start, end));
            const total = allCoupons.length;
            setPagination({
              total,
              page: currentPage,
              limit: itemsPerPage,
              totalPages: Math.ceil(total / itemsPerPage) || 1,
              hasNextPage: end < total,
              hasPreviousPage: currentPage > 1,
              currentPage,
              itemsPerPage,
            });
            return;
          }
        }

        // Regular single category or subcategory filtering
        let url = `${baseUrl}coupons?page=${currentPage}&limit=${itemsPerPage}`;

        // If retailer has exactly one store, scope by storeId
        if (userRole === "RETAILER" && userStores.length === 1) {
          url += `&storeId=${encodeURIComponent(userStores[0].id)}`;
        }

        // Add active/inactive filter
        if (sortBy === "inactive") {
          url += "&active=false";
        } else if (sortBy === "active") {
          url += "&active=true";
        }

        // Add category filter if selected
        if (selectedCategory !== "all") {
          url += `&categoryId=${selectedCategory}`;
        }

        // Add subcategory filter if selected (this will override the main category)
        if (selectedSubcategory !== "all") {
          // temporarily ignore subcategory for now per request
        }

        const response = await fetch(url, {
          headers: {
            "user-email": user?.email || "",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCoupons(data.coupons || []);

          // Normalize pagination to avoid NaN and naming mismatches
          const apiPagination = data.pagination || {};
          const totalFromApi =
            apiPagination.total ??
            apiPagination.totalCount ??
            apiPagination.totalItems ??
            apiPagination.count ??
            0;
          const limitFromApi =
            apiPagination.limit ?? apiPagination.itemsPerPage ?? itemsPerPage;
          const currentFromApi =
            apiPagination.currentPage ?? apiPagination.page ?? currentPage;
          const totalPagesFromApi =
            apiPagination.totalPages ??
            (limitFromApi
              ? Math.ceil(Number(totalFromApi) / Number(limitFromApi))
              : 1);
          const hasPrevFromApi =
            apiPagination.hasPreviousPage ?? Number(currentFromApi) > 1;
          const hasNextFromApi =
            apiPagination.hasNextPage ??
            Number(currentFromApi) < Number(totalPagesFromApi);

          const transformedPagination = {
            total: Number(totalFromApi),
            limit: Number(limitFromApi),
            currentPage: Number(currentFromApi),
            totalPages: Number(totalPagesFromApi),
            hasNextPage: Boolean(hasNextFromApi),
            hasPreviousPage: Boolean(hasPrevFromApi),
            itemsPerPage: Number(limitFromApi),
          };

          setPagination(transformedPagination);
        } else {
          toast.error("Failed to fetch coupons");
        }
      } catch (error) {
        toast.error("Error loading coupons");
      }
    };
    fetchCoupons();
  }, [
    currentPage,
    sortBy,
    selectedCategory,
    selectedSubcategory,
    userRole,
    userStores.length,
  ]);

  const handleEdit = () => {
    // Placeholder for edit functionality
    toast.info("Edit functionality coming soon!");
  };

  const handleDelete = () => {
    // Placeholder for delete functionality
    toast.info("Delete functionality coming soon!");
  };

  // No need for frontend filtering since we're filtering on the backend
  const displayCoupons = coupons;

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
                    {pagination?.total || 0}+ {t("coupons.activeCoupons")}
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
                  {t("coupons.showing")} {displayCoupons.length}{" "}
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
            {displayCoupons.length > 0 ? (
              <CouponList
                coupons={displayCoupons}
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
