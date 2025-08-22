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
  const [categories, setCategories] = useState<any[]>([]);
  const [userStores, setUserStores] = useState<any[]>([]);

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
    if (categoryId === "all") return t("flyers.allCategories");

    // Check if this is a main category name (French descriptions from API)
    if (
      [
        "Magasins & Offres",
        "Services & Professionnels",
        "Loisirs & Tourisme",
        "Auto / Moto / Mobilité",
        "Immobilier",
        "Annonces",
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

  // Calculate offset for pagination
  const getOffset = (page: number) => {
    return (page - 1) * itemsPerPage;
  };

  // Check if there are more pages available
  const hasNextPage = () => {
    if (!pagination) return false;
    return pagination.total > pagination.offset + itemsPerPage;
  };

  // Check if there are previous pages
  const hasPreviousPage = () => {
    return currentPage > 1;
  };

  // Get total pages
  const getTotalPages = () => {
    if (!pagination) return 1;
    return Math.ceil(pagination.total / itemsPerPage);
  };

  useEffect(() => {
    const fetchFlyers = async () => {
      try {
        setLoading(true);

        // For retailers, if they have no stores, show empty result
        if (userRole === "RETAILER" && userStores.length === 0) {
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

        // If a main category is selected, fetch flyers from all its subcategories
        if (
          selectedCategory !== "all" &&
          !categories.find((cat) => cat.id === selectedCategory)
        ) {
          // This is a main category name, fetch from all subcategories
          const mainCategorySubcategories = categories.filter(
            (cat) => cat.description === selectedCategory
          );

          if (mainCategorySubcategories.length > 0) {
            let allFlyers: any[] = [];
            let totalCount = 0;

            // For retailers, fetch flyers from their stores only
            if (userRole === "RETAILER") {
              for (const store of userStores) {
                for (const subcategory of mainCategorySubcategories) {
                  let url = `${baseUrl}flyers?limit=100&offset=0&categoryId=${subcategory.id}&storeId=${store.id}`;

                  // Add active/inactive filter
                  if (sortBy === "active") {
                    url += "&isActive=true";
                  } else if (sortBy === "inactive") {
                    url += "&isActive=false";
                  }

                  try {
                    const response = await fetch(url);
                    if (response.ok) {
                      const data = await response.json();
                      allFlyers = [...allFlyers, ...(data.flyers || [])];
                      totalCount += data.pagination?.total || 0;
                    }
                  } catch (error) {
                    console.error(
                      `Error fetching flyers for subcategory ${subcategory.id} and store ${store.id}:`,
                      error
                    );
                  }
                }
              }
            } else {
              // For non-retailers, fetch from all stores
              for (const subcategory of mainCategorySubcategories) {
                let url = `${baseUrl}flyers?limit=100&offset=0&categoryId=${subcategory.id}`;

                // Add active/inactive filter
                if (sortBy === "active") {
                  url += "&isActive=true";
                } else if (sortBy === "inactive") {
                  url += "&isActive=false";
                }

                try {
                  const response = await fetch(url);
                  if (response.ok) {
                    const data = await response.json();
                    allFlyers = [...allFlyers, ...(data.flyers || [])];
                    totalCount += data.pagination?.total || 0;
                  }
                } catch (error) {
                  console.error(
                    `Error fetching flyers for subcategory ${subcategory.id}:`,
                    error
                  );
                }
              }
            }

            // Apply pagination to the combined results
            const startIndex = getOffset(currentPage);
            const endIndex = startIndex + itemsPerPage;
            const paginatedFlyers = allFlyers.slice(startIndex, endIndex);

            setFlyers(paginatedFlyers);

            // Create pagination info
            const transformedPagination = {
              total: allFlyers.length,
              limit: itemsPerPage,
              offset: startIndex,
              currentPage: currentPage,
              totalPages: Math.ceil(allFlyers.length / itemsPerPage),
              hasNextPage: endIndex < allFlyers.length,
              hasPreviousPage: currentPage > 1,
              itemsPerPage: itemsPerPage,
            };

            setPagination(transformedPagination);
            return;
          }
        }

        // Regular single category or subcategory filtering
        let url = `${baseUrl}flyers?limit=${itemsPerPage}&offset=${getOffset(
          currentPage
        )}`;

        // Add store filter for retailers
        if (userRole === "RETAILER" && userStores.length > 0) {
          // If retailer has multiple stores, we need to fetch from each store
          if (userStores.length === 1) {
            url += `&storeId=${userStores[0].id}`;
          } else {
            // For multiple stores, we'll need to make multiple calls
            let allFlyers: any[] = [];

            for (const store of userStores) {
              let storeUrl = `${baseUrl}flyers?limit=100&offset=0&storeId=${store.id}`;

              // Add category filter if selected
              if (selectedCategory !== "all") {
                storeUrl += `&categoryId=${selectedCategory}`;
              }

              // Add subcategory filter if selected
              if (selectedSubcategory !== "all") {
                storeUrl += `&categoryId=${selectedSubcategory}`;
              }

              // Add active/inactive filter
              if (sortBy === "active") {
                storeUrl += "&isActive=true";
              } else if (sortBy === "inactive") {
                storeUrl += "&isActive=false";
              }

              try {
                const response = await fetch(storeUrl);
                if (response.ok) {
                  const data = await response.json();
                  allFlyers = [...allFlyers, ...(data.flyers || [])];
                }
              } catch (error) {
                console.error(
                  `Error fetching flyers for store ${store.id}:`,
                  error
                );
              }
            }

            // Apply pagination to the combined results
            const startIndex = getOffset(currentPage);
            const endIndex = startIndex + itemsPerPage;
            const paginatedFlyers = allFlyers.slice(startIndex, endIndex);

            setFlyers(paginatedFlyers);

            // Create pagination info
            const transformedPagination = {
              total: allFlyers.length,
              limit: itemsPerPage,
              offset: startIndex,
              currentPage: currentPage,
              totalPages: Math.ceil(allFlyers.length / itemsPerPage),
              hasNextPage: endIndex < allFlyers.length,
              hasPreviousPage: currentPage > 1,
              itemsPerPage: itemsPerPage,
            };

            setPagination(transformedPagination);
            return;
          }
        }

        // Add category filter if selected
        if (selectedCategory !== "all") {
          url += `&categoryId=${selectedCategory}`;
        }

        // Add subcategory filter if selected (this will override the main category)
        if (selectedSubcategory !== "all") {
          url += `&categoryId=${selectedSubcategory}`;
        }

        // Add active/inactive filter
        if (sortBy === "active") {
          url += "&isActive=true";
        } else if (sortBy === "inactive") {
          url += "&isActive=false";
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch flyers");
        }
        const data = await response.json();
        setFlyers(data.flyers || []);

        // Transform the pagination data to match our expected format
        const transformedPagination = {
          ...data.pagination,
          currentPage: currentPage,
          totalPages: getTotalPages(),
          hasNextPage: hasNextPage(),
          hasPreviousPage: hasPreviousPage(),
          itemsPerPage: itemsPerPage,
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
  }, [
    selectedCategory,
    selectedSubcategory,
    sortBy,
    currentPage,
    userRole,
    userStores,
  ]);

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
