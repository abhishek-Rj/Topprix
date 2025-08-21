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
  const [categories, setCategories] = useState<any[]>([]);
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

  // Fetch user's stores if they are a retailer
  useEffect(() => {
    const fetchUserStores = async () => {
      if (userRole !== "RETAILER" || !user?.email) return;

      try {
        // First get the user ID
        const userResponse = await fetch(`${baseUrl}user/${user.email}`);
        if (!userResponse.ok) return;

        const userData = await userResponse.json();
        const userId = userData?.id;

        if (!userId) return;

        // Then fetch all stores and filter by ownerId
        const storesResponse = await fetch(`${baseUrl}stores`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "user-email": user.email,
          },
        });

        if (storesResponse.ok) {
          const storesData = await storesResponse.json();
          const retailerStores =
            storesData.stores?.filter(
              (store: any) => store?.ownerId === userId
            ) || [];
          setUserStores(retailerStores);
        }
      } catch (error) {
        console.error("Error fetching user stores:", error);
      }
    };

    fetchUserStores();
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

    // Check if this is a main category name
    if (
      [
        "Shops & Offers",
        "Services & Professionals",
        "Leisure & Tourism",
        "Auto / Moto / Mobility",
        "Real Estate",
        "Announcements",
      ].includes(categoryId)
    ) {
      return categoryId;
    }

    // This is a category ID, find the name
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

    const fetchCoupons = async () => {
      try {
        // For retailers, if they have no stores, show empty result
        if (userRole === "RETAILER" && userStores.length === 0) {
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

        // If a main category is selected, fetch coupons from all its subcategories
        if (
          selectedCategory !== "all" &&
          !categories.find((cat) => cat.id === selectedCategory)
        ) {
          // This is a main category name, fetch from all subcategories
          const mainCategorySubcategories = categories.filter(
            (cat) => cat.description === selectedCategory
          );

          if (mainCategorySubcategories.length > 0) {
            let allCoupons: any[] = [];

            // For retailers, fetch coupons from their stores only
            if (userRole === "RETAILER") {
              for (const store of userStores) {
                for (const subcategory of mainCategorySubcategories) {
                  let url = `${baseUrl}coupons?page=1&limit=100&categoryId=${subcategory.id}&storeId=${store.id}`;

                  // Add active/inactive filter
                  if (sortBy === "inactive") {
                    url += "&active=false";
                  } else if (sortBy === "active") {
                    url += "&active=true";
                  }

                  try {
                    const response = await fetch(url);
                    if (response.ok) {
                      const data = await response.json();
                      allCoupons = [...allCoupons, ...(data.coupons || [])];
                    }
                  } catch (error) {
                    console.error(
                      `Error fetching coupons for subcategory ${subcategory.id} and store ${store.id}:`,
                      error
                    );
                  }
                }
              }
            } else {
              // For non-retailers, fetch from all stores
              for (const subcategory of mainCategorySubcategories) {
                let url = `${baseUrl}coupons?page=1&limit=100&categoryId=${subcategory.id}`;

                // Add active/inactive filter
                if (sortBy === "inactive") {
                  url += "&active=false";
                } else if (sortBy === "active") {
                  url += "&active=true";
                }

                try {
                  const response = await fetch(url);
                  if (response.ok) {
                    const data = await response.json();
                    allCoupons = [...allCoupons, ...(data.coupons || [])];
                  }
                } catch (error) {
                  console.error(
                    `Error fetching coupons for subcategory ${subcategory.id}:`,
                    error
                  );
                }
              }
            }

            // Apply pagination to the combined results
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedCoupons = allCoupons.slice(startIndex, endIndex);

            setCoupons(paginatedCoupons);

            // Create pagination info
            const transformedPagination = {
              total: allCoupons.length,
              page: currentPage,
              limit: itemsPerPage,
              totalPages: Math.ceil(allCoupons.length / itemsPerPage),
              hasNextPage: endIndex < allCoupons.length,
              hasPreviousPage: currentPage > 1,
              currentPage: currentPage,
              itemsPerPage: itemsPerPage,
            };

            setPagination(transformedPagination);
            return;
          }
        }

        // Regular single category or subcategory filtering
        let url = `${baseUrl}coupons?page=${currentPage}&limit=${itemsPerPage}`;

        // Add store filter for retailers
        if (userRole === "RETAILER" && userStores.length > 0) {
          // If retailer has multiple stores, we need to fetch from each store
          if (userStores.length === 1) {
            url += `&storeId=${userStores[0].id}`;
          } else {
            // For multiple stores, we'll need to make multiple calls
            let allCoupons: any[] = [];

            for (const store of userStores) {
              let storeUrl = `${baseUrl}coupons?page=1&limit=100&storeId=${store.id}`;

              // Add active/inactive filter
              if (sortBy === "inactive") {
                storeUrl += "&active=false";
              } else if (sortBy === "active") {
                storeUrl += "&active=true";
              }

              // Add category filter if selected
              if (selectedCategory !== "all") {
                storeUrl += `&categoryId=${selectedCategory}`;
              }

              // Add subcategory filter if selected
              if (selectedSubcategory !== "all") {
                storeUrl += `&categoryId=${selectedSubcategory}`;
              }

              try {
                const response = await fetch(storeUrl);
                if (response.ok) {
                  const data = await response.json();
                  allCoupons = [...allCoupons, ...(data.coupons || [])];
                }
              } catch (error) {
                console.error(
                  `Error fetching coupons for store ${store.id}:`,
                  error
                );
              }
            }

            // Apply pagination to the combined results
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedCoupons = allCoupons.slice(startIndex, endIndex);

            setCoupons(paginatedCoupons);

            // Create pagination info
            const transformedPagination = {
              total: allCoupons.length,
              page: currentPage,
              limit: itemsPerPage,
              totalPages: Math.ceil(allCoupons.length / itemsPerPage),
              hasNextPage: endIndex < allCoupons.length,
              hasPreviousPage: currentPage > 1,
              currentPage: currentPage,
              itemsPerPage: itemsPerPage,
            };

            setPagination(transformedPagination);
            return;
          }
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
          url += `&categoryId=${selectedSubcategory}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setCoupons(data.coupons || []);

          // Transform pagination to ensure consistent format
          const transformedPagination = {
            ...data.pagination,
            currentPage: currentPage,
            itemsPerPage: itemsPerPage,
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
    userStores,
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
