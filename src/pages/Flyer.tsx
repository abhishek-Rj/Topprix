import { useState, useEffect } from "react";
import { HiNewspaper, HiUser } from "react-icons/hi";
import { FaStore } from "react-icons/fa";
import { motion } from "framer-motion";
import Navigation from "../components/navigation";
import Footer from "../components/Footer";
import baseUrl from "@/hooks/baseurl";
import { toast } from "react-toastify";
import FlyerList from "@/components/FlyerCard";
import Loader from "@/components/loading";
import useAuthenticate from "@/hooks/authenticationt";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FloatingSidebar from "@/components/FloatingSidebar";

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
  const [searchParams] = useSearchParams();
  const [flyers, setFlyers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [sortBy, setSortBy] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Maximum 20 flyers per page as required

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Will be set based on screen size
  const { user, userRole } = useAuthenticate();
  const [categoriesFull, setCategoriesFull] = useState<any[]>([]);
  const [subcategoriesFlat, setSubcategoriesFlat] = useState<any[]>([]);
  const [userStores, setUserStores] = useState<any[]>([]);

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
        console.error("Failed to fetch retailer stores for flyers:", e);
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
    if (categoryId === "all") return t("flyers.allCategories");
    const category = categoriesFull.find((cat: any) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const getSubcategoryName = (subcategoryId: string) => {
    if (subcategoryId === "all") return "";
    const sub = subcategoriesFlat.find((s: any) => s.id === subcategoryId);
    return sub?.name || subcategoryId;
  };

  // Offset helper no longer used (switched to page/limit)

  // Deprecated helpers (pagination now fully driven by backend). Keeping none to avoid unused warnings.

  useEffect(() => {
    const fetchFlyers = async () => {
      try {
        setLoading(true);

        // Category filtering is handled directly via categoryId param.

        // If retailer has multiple stores, fetch each store separately and combine
        if (userRole === "RETAILER") {
          if (!userStores || userStores.length === 0) {
            setFlyers([]);
            setPagination({
              total: 0,
              limit: itemsPerPage,
              offset: 0,
              currentPage: currentPage,
              totalPages: 1,
              hasNextPage: false,
              hasPreviousPage: false,
              itemsPerPage: itemsPerPage,
            });
            return;
          }

          if (userStores.length > 1) {
            let allFlyers: any[] = [];
            for (const store of userStores) {
              let storeUrl = `${baseUrl}flyers?limit=1000&offset=0&storeId=${encodeURIComponent(
                store.id
              )}`;
              if (selectedCategory !== "all") {
                storeUrl += `&categoryId=${selectedCategory}`;
              }
              if (sortBy === "active") {
                storeUrl += "&isActive=true";
              } else if (sortBy === "inactive") {
                storeUrl += "&isActive=false";
              }
              try {
                const resp = await fetch(storeUrl, {
                  headers: { "user-email": user?.email || "" },
                });
                if (resp.ok) {
                  const sData = await resp.json();
                  allFlyers = [...allFlyers, ...(sData.flyers || [])];
                }
              } catch (e) {
                console.error("Error fetching flyers for store", store.id, e);
              }
            }

            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            setFlyers(allFlyers.slice(start, end));
            const total = allFlyers.length;
            setPagination({
              total,
              limit: itemsPerPage,
              offset: start,
              currentPage,
              totalPages: Math.ceil(total / itemsPerPage) || 1,
              hasNextPage: end < total,
              hasPreviousPage: currentPage > 1,
              itemsPerPage,
            });
            return;
          }
        }

        // Regular single category or subcategory filtering (use page & limit)
        let url = `${baseUrl}flyers?page=${currentPage}&limit=${itemsPerPage}`;

        // If retailer has exactly one store, scope by storeId
        if (userRole === "RETAILER" && userStores.length === 1) {
          url += `&storeId=${encodeURIComponent(userStores[0].id)}`;
        }

        // Add category filter if selected
        if (selectedCategory !== "all") {
          url += `&categoryId=${selectedCategory}`;
        }

        // Add subcategory filter if selected (this will override the main category)
        if (selectedSubcategory !== "all") {
          // temporarily ignore subcategory for now per request
        }

        // Add active/inactive filter
        if (sortBy === "active") {
          url += "&isActive=true";
        } else if (sortBy === "inactive") {
          url += "&isActive=false";
        }

        const response = await fetch(url, {
          headers: {
            "user-email": user?.email || "",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch flyers");
        }
        const data = await response.json();
        setFlyers(data.flyers || []);

        // Normalize pagination coming from API to avoid NaN and naming mismatches
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
      } catch (error) {
        console.error("Error fetching flyers:", error);
        toast.error("Failed to load flyers");
      } finally {
        setLoading(false);
      }
    };

    fetchFlyers();
  }, [selectedCategory, selectedSubcategory, sortBy, currentPage, userRole]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  // No need for frontend filtering since we're filtering on the backend
  const displayFlyers = flyers;

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
      <div
        className={`min-h-screen pt-16 transition-all duration-300 ${
          isSidebarOpen ? "md:pl-80" : ""
        } ${
          userRole === "ADMIN"
            ? "bg-gradient-to-b from-blue-50 to-white"
            : "bg-gradient-to-b from-yellow-50 to-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section - Only show on first page */}
          {currentPage === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`text-center mb-12 rounded-xl p-4 ${
                userRole === "ADMIN" ? "bg-blue-100" : "bg-yellow-100"
              }`}
            >
              <h1 className="text-4xl pt-6 sm:text-5xl font-bold text-gray-900 mb-4">
                {t("flyers.title")}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t("flyers.description")}
              </p>
            </motion.div>
          )}

          {currentPage === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <HiNewspaper
                  className={
                    userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"
                  }
                />
                <span className="text-gray-700">
                  {pagination?.total || 0}+ {t("flyers.activeFlyers")}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <FaStore
                  className={
                    userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"
                  }
                />
                <span className="text-gray-700">
                  200+ {t("flyers.partnerStores")}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <HiUser
                  className={
                    userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"
                  }
                />
                <span className="text-gray-700">
                  50K+ {t("flyers.monthlyViews")}
                </span>
              </div>
            </motion.div>
          )}

          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <span className="text-sm text-gray-600">
                  {t("flyers.showing")} {displayFlyers.length} {t("flyers.of")}{" "}
                  {pagination?.total || 0} {t("flyers.flyers")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {t("flyers.category")}: {getCategoryName(selectedCategory)}
                </span>
                {selectedSubcategory !== "all" && (
                  <span className="text-sm text-gray-600">
                    | {t("flyers.subcategory")}:{" "}
                    {getSubcategoryName(selectedSubcategory)}
                  </span>
                )}
                <span className="text-sm text-gray-600">
                  | {t("flyers.sortBy")}:{" "}
                  {sortBy === "all"
                    ? t("flyers.allFlyers")
                    : sortBy === "active"
                    ? t("flyers.activeFlyers")
                    : t("flyers.inactiveFlyers")}
                </span>
              </div>
            </div>
          </div>

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
            ) : displayFlyers.length > 0 ? (
              <FlyerList
                flyers={displayFlyers}
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
                  {t("flyers.noFlyersAvailable")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer sidebarOpen={isSidebarOpen} />
    </>
  );
}
