import { useState, useEffect } from "react";
import { HiChevronDown, HiChevronRight, HiStar } from "react-icons/hi";
import useAuthenticate from "@/hooks/authenticationt";
import baseUrl from "@/hooks/baseurl";
import { useTranslation } from "react-i18next";

interface Subcategory {
  id: string;
  name: string;
  description?: string | null;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  subcategories?: Subcategory[];
}

interface Props {
  selectedCategories: string[];
  selectedSubcategories?: string[]; // Keep for backward compatibility but not used
  onCategoryChange: (categoryIds: string[]) => void;
  onSubcategoryChange?: (subcategoryIds: string[]) => void; // Keep for backward compatibility but not used
  allowMultiple?: boolean;
  categoryNames?: { [key: string]: string }; // Map of category IDs to names for display
}

export default function PredefinedCategorySelector({
  selectedCategories,
  onCategoryChange,
  allowMultiple = true,
  categoryNames = {},
}: Props) {
  const { userRole } = useAuthenticate();
  const { t } = useTranslation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories with nested subcategories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseUrl}categories/with-subcategories`);
        if (response.ok) {
          const data = await response.json();
          const source = data.categories || data || [];
          setCategories(Array.isArray(source) ? source : []);
        } else {
          console.error("Failed to fetch categories. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Define category icons and priorities - Updated to match French API responses
  const categoryMetadata = {
    "Magasins & Offres": { icon: "⭐", priority: 1, isTop: true },
    "Services & Professionnels": { icon: "🛠", priority: 2, isTop: false },
    "Loisirs & Tourisme": { icon: "🎉", priority: 3, isTop: false },
    "Auto / Moto / Mobilité": { icon: "🚗", priority: 4, isTop: false },
    Immobilier: { icon: "🏡", priority: 5, isTop: false },
    Annonces: { icon: "📢", priority: 6, isTop: false },
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubcategoryToggle = (subcategoryId: string) => {
    if (allowMultiple) {
      const newSelected = selectedCategories.includes(subcategoryId)
        ? selectedCategories.filter((id) => id !== subcategoryId)
        : [...selectedCategories, subcategoryId];
      onCategoryChange(newSelected);
    } else {
      onCategoryChange([subcategoryId]);
    }
  };

  const isSubcategorySelected = (subcategoryId: string) =>
    selectedCategories.includes(subcategoryId);

  const findSubcategoryName = (subId: string): string | undefined => {
    for (const cat of categories) {
      for (const sub of cat.subcategories || []) {
        if (sub.id === subId) return sub.name;
      }
    }
    return undefined;
  };

  const accentColor = userRole === "ADMIN" ? "blue" : "yellow";
  const accentColorClasses = {
    blue: {
      bg: "bg-blue-600",
      hover: "hover:bg-blue-700",
      text: "text-blue-600",
      border: "border-blue-200",
      ring: "ring-blue-500",
      bgLight: "bg-blue-50",
      bgHover: "hover:bg-blue-100",
    },
    yellow: {
      bg: "bg-yellow-600",
      hover: "hover:bg-yellow-700",
      text: "text-yellow-600",
      border: "border-yellow-200",
      ring: "ring-yellow-500",
      bgLight: "bg-yellow-50",
      bgHover: "hover:bg-yellow-100",
    },
  };

  const colors =
    accentColorClasses[accentColor as keyof typeof accentColorClasses];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-gray-700">
            Select Categories <span className="text-red-600">*</span>
          </label>
        </div>
        <div className="animate-pulse space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-gray-700">
          {t("selectCategories")} <span className="text-red-600">*</span>
        </label>
        <span className="text-xs text-gray-500">
          {selectedCategories.length} {t("categoriesSelected")}
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50/50">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="mb-2">📁</div>
            <p className="font-medium">{t("noCategoriesAvailable")}</p>
            <p className="text-sm">{t("checkDatabaseConnection")}</p>
          </div>
        ) : (
          categories
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((category) => {
              const metadata =
                categoryMetadata[
                  category.name as keyof typeof categoryMetadata
                ];
              const displayMetadata = metadata || {
                icon: "📁",
                priority: 999,
                isTop: false,
              };

              return (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-lg"
                >
                  {/* Category Header */}
                  <button
                    type="button"
                    onClick={() => toggleCategoryExpansion(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                      expandedCategories.includes(category.id)
                        ? `${colors.bgLight} ${colors.text} font-medium shadow-sm`
                        : "hover:bg-gray-50 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{displayMetadata.icon}</span>
                      <span className="font-medium">{category.name}</span>
                      {displayMetadata.isTop && (
                        <HiStar className="text-yellow-500" size={16} />
                      )}
                    </div>
                    {expandedCategories.includes(category.id) ? (
                      <HiChevronDown size={20} className="text-gray-400" />
                    ) : (
                      <HiChevronRight size={20} className="text-gray-400" />
                    )}
                  </button>

                  {/* Subcategories */}
                  {expandedCategories.includes(category.id) && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
                      {(category.subcategories || []).length === 0 ? (
                        <div className="text-sm text-gray-500">
                          {t("noCategoriesAvailable")}
                        </div>
                      ) : (
                        (category.subcategories || []).map((subcategory) => (
                          <div
                            key={subcategory.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
                          >
                            <input
                              type="checkbox"
                              id={subcategory.id}
                              checked={isSubcategorySelected(subcategory.id)}
                              onChange={() =>
                                handleSubcategoryToggle(subcategory.id)
                              }
                              className={`w-4 h-4 rounded ${colors.ring} ${colors.text} focus:ring-2 focus:ring-offset-2 transition-all`}
                            />
                            <label
                              htmlFor={subcategory.id}
                              className="flex-1 text-sm cursor-pointer hover:text-gray-700 transition-colors"
                            >
                              <div className="font-medium">
                                {subcategory.name}
                              </div>
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>

      {/* Selection Summary */}
      {selectedCategories.length > 0 && (
        <div
          className={`p-4 rounded-lg ${colors.bgLight} border ${colors.border} shadow-sm`}
        >
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${colors.bg}`}></span>
            {t("selectedCategories")}: {selectedCategories.length}
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((subId) => {
              // First try to find in provided categoryNames, then in subcategories, then fallback to ID
              const name =
                categoryNames[subId] || findSubcategoryName(subId) || subId;
              return (
                <span
                  key={subId}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${colors.bg} text-white shadow-sm hover:scale-105 transition-transform`}
                >
                  {name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Note about predefined categories */}
      <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">ℹ️</span>
          <div>
            <strong className="text-gray-700">{t("note")}:</strong>{" "}
            {t("predefinedCategoriesNote")}
          </div>
        </div>
      </div>
    </div>
  );
}
