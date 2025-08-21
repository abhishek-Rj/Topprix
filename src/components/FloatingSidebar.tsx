import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiFilter,
  HiX,
  HiChevronRight,
  HiChevronDown,
  HiStar,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";
import baseUrl from "@/hooks/baseurl";

interface FloatingSidebarProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  selectedSubcategory: string;
  onSubcategoryChange: (subcategoryId: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  userRole?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function FloatingSidebar({
  selectedCategory,
  onCategoryChange,
  selectedSubcategory,
  onSubcategoryChange,
  sortBy,
  onSortChange,
  isOpen,
  onToggle,
  userRole = "USER",
}: FloatingSidebarProps) {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpenOnMobile, setIsOpenOnMobile] = useState(false);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseUrl}categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Group categories by main category (description)
  const groupedCategories = categories.reduce((acc, category) => {
    const mainCategory = category.description;
    if (!acc[mainCategory]) {
      acc[mainCategory] = [];
    }
    acc[mainCategory].push(category);
    return acc;
  }, {} as Record<string, Category[]>);

  // Define category icons and priorities
  const categoryMetadata = {
    "Shops & Offers": { icon: "⭐", priority: 1, isTop: true },
    "Services & Professionals": { icon: "🛠", priority: 2, isTop: false },
    "Leisure & Tourism": { icon: "🎉", priority: 3, isTop: false },
    "Auto / Moto / Mobility": { icon: "🚗", priority: 4, isTop: false },
    "Real Estate": { icon: "🏡", priority: 5, isTop: false },
    Announcements: { icon: "📢", priority: 6, isTop: false },
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sortOptions = [
    { value: "all", label: t("flyers.allFlyers") || "All Flyers" },
    { value: "active", label: t("flyers.activeFlyers") || "Active Flyers" },
    {
      value: "inactive",
      label: t("flyers.inactiveFlyers") || "Inactive Flyers",
    },
  ];

  const accentColor = userRole === "ADMIN" ? "blue" : "yellow";
  const accentColorClasses = {
    blue: {
      bg: "bg-blue-500",
      hover: "hover:bg-blue-600",
      text: "text-blue-600",
      border: "border-blue-200",
      ring: "ring-blue-500",
      bgLight: "bg-blue-50",
      bgHover: "hover:bg-blue-100",
    },
    yellow: {
      bg: "bg-yellow-500",
      hover: "hover:bg-yellow-600",
      text: "text-yellow-600",
      border: "border-yellow-200",
      ring: "ring-yellow-500",
      bgLight: "bg-yellow-50",
      bgHover: "hover:bg-yellow-100",
    },
  };

  const colors =
    accentColorClasses[accentColor as keyof typeof accentColorClasses];

  const toggleCategoryExpansion = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((id) => id !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleCategorySelect = (categoryId: string) => {
    // If it's a main category name (not an ID), pass it directly
    if (groupedCategories[categoryId]) {
      // This is a main category, select it directly
      onCategoryChange(categoryId);
      // Reset subcategory selection
      onSubcategoryChange("all");
    } else {
      // This is a direct category ID
      onCategoryChange(categoryId);
      // Reset subcategory when category changes
      onSubcategoryChange("all");
    }
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    onSubcategoryChange(subcategoryId);
  };

  const clearAllFilters = () => {
    onCategoryChange("all");
    onSubcategoryChange("all");
    onSortChange("all");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedSubcategory !== "all") count++;
    if (sortBy !== "all") count++;
    return count;
  };

  if (loading) {
    return (
      <div className="fixed top-24 left-4 z-40 p-3 rounded-full shadow-lg bg-gray-500 text-white">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed top-20 left-4 z-30 md:hidden p-3 rounded-full shadow-lg transition-all duration-300 ${
          colors.bg
        } text-white hover:scale-110 ${isOpen ? "rotate-180" : ""}`}
      >
        <HiFilter size={20} />
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 bg-white shadow-2xl border-r ${
              colors.border
            } w-80 transform transition-transform duration-300 ease-in-out ${
              isMobile ? "" : "md:translate-x-0"
            }`}
          >
            {/* Header */}
            <div className={`p-6 ${colors.bgLight} border-b ${colors.border}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {t("flyers.filters") || "Filters"}
                </h2>
                <button
                  onClick={onToggle}
                  className={`p-2 rounded-full ${colors.bgHover} transition-colors`}
                >
                  <HiX size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]">
              {/* Categories Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("flyers.categories") || "Categories"}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategorySelect("all")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                      selectedCategory === "all"
                        ? `${colors.bgLight} ${colors.text} font-medium`
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{t("flyers.allCategories") || "All Categories"}</span>
                    {selectedCategory === "all" && (
                      <HiChevronRight size={16} className={colors.text} />
                    )}
                  </button>

                  {Object.entries(groupedCategories)
                    .sort(([a], [b]) => {
                      const aMeta =
                        categoryMetadata[a as keyof typeof categoryMetadata];
                      const bMeta =
                        categoryMetadata[b as keyof typeof categoryMetadata];
                      return (
                        (aMeta?.priority || 999) - (bMeta?.priority || 999)
                      );
                    })
                    .map(([mainCategory, subcategories]) => {
                      const metadata =
                        categoryMetadata[
                          mainCategory as keyof typeof categoryMetadata
                        ];
                      if (!metadata) return null;

                      return (
                        <div
                          key={mainCategory}
                          className="border border-gray-200 rounded-lg"
                        >
                          <button
                            onClick={() => {
                              // If main category is already selected, expand it
                              if (selectedCategory === mainCategory) {
                                toggleCategoryExpansion(mainCategory);
                              } else {
                                // Select the main category and expand it
                                handleCategorySelect(mainCategory);
                                if (
                                  !expandedCategories.includes(mainCategory)
                                ) {
                                  toggleCategoryExpansion(mainCategory);
                                }
                              }
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                              selectedCategory === mainCategory
                                ? `${colors.bgLight} ${colors.text} font-medium`
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{metadata.icon}</span>
                              <span>{mainCategory}</span>
                              {metadata.isTop && (
                                <HiStar className="text-yellow-500" size={16} />
                              )}
                            </div>
                            {expandedCategories.includes(mainCategory) ? (
                              <HiChevronDown
                                size={16}
                                className="text-gray-400"
                              />
                            ) : (
                              <HiChevronRight
                                size={16}
                                className="text-gray-400"
                              />
                            )}
                          </button>

                          {/* Subcategories */}
                          {expandedCategories.includes(mainCategory) && (
                            <div className="border-t border-gray-200 bg-gray-50 p-3 space-y-2">
                              {subcategories.map((subcategory) => (
                                <button
                                  key={subcategory.id}
                                  onClick={() =>
                                    handleSubcategorySelect(subcategory.id)
                                  }
                                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between ${
                                    selectedSubcategory === subcategory.id
                                      ? `${colors.bgLight} ${colors.text} font-medium`
                                      : "text-gray-600 hover:bg-gray-100"
                                  }`}
                                >
                                  <span className="text-sm">
                                    {subcategory.name}
                                  </span>
                                  {selectedSubcategory === subcategory.id && (
                                    <HiChevronRight
                                      size={14}
                                      className={colors.text}
                                    />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Sort Options Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("flyers.sortBy") || "Sort By"}
                </h3>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onSortChange(option.value)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                        sortBy === option.value
                          ? `${colors.bgLight} ${colors.text} font-medium`
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        <HiChevronRight size={16} className={colors.text} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("flyers.quickActions") || "Quick Actions"}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={clearAllFilters}
                    className={`w-full px-4 py-3 rounded-lg border ${colors.border} text-gray-700 hover:${colors.bgHover} transition-colors duration-200`}
                  >
                    {t("flyers.clearFilters") || "Clear All Filters"}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`absolute bottom-0 left-0 right-0 p-4 ${colors.bgLight} border-t ${colors.border}`}
            >
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {t("flyers.activeFilters") || "Active Filters"}:{" "}
                  {getActiveFiltersCount()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed top-20 z-30 hidden md:block p-3 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? "left-[21rem] rotate-180" : "left-4"
        } ${colors.bg} text-white hover:scale-110`}
        title={isOpen ? "Hide Filters" : "Show Filters"}
      >
        <HiFilter size={20} />
      </button>
    </>
  );
}
