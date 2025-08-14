import { useState, useEffect } from "react";
import { HiChevronDown, HiChevronRight, HiStar } from "react-icons/hi";
import useAuthenticate from "@/hooks/authenticationt";
import baseUrl from "@/hooks/baseurl";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Props {
  selectedCategories: string[];
  selectedSubcategories?: string[]; // Keep for backward compatibility but not used
  onCategoryChange: (categoryIds: string[]) => void;
  onSubcategoryChange?: (subcategoryIds: string[]) => void; // Keep for backward compatibility but not used
  allowMultiple?: boolean;
}

export default function PredefinedCategorySelector({
  selectedCategories,
  onCategoryChange,
  allowMultiple = true,
}: Props) {
  const { userRole } = useAuthenticate();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseUrl}categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || data || []); // Handle different response formats
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

  const toggleCategoryExpansion = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((id) => id !== categoryName)
        : [...prev, categoryName]
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
          Select Categories <span className="text-red-600">*</span>
        </label>
        <span className="text-xs text-gray-500">
          {selectedCategories.length} categories selected
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="mb-2">📁</div>
            <p className="font-medium">No categories available</p>
            <p className="text-sm">
              Please check your database connection or contact support.
            </p>
          </div>
        ) : (
          Object.entries(groupedCategories)
            .sort(([a], [b]) => {
              const aMeta =
                categoryMetadata[a as keyof typeof categoryMetadata];
              const bMeta =
                categoryMetadata[b as keyof typeof categoryMetadata];
              return (aMeta?.priority || 999) - (bMeta?.priority || 999);
            })
            .map(([mainCategory, subcategories]) => {
              const metadata =
                categoryMetadata[mainCategory as keyof typeof categoryMetadata];

              // If no metadata found, create a default one for unknown categories
              const displayMetadata = metadata || {
                icon: "📁",
                priority: 999,
                isTop: false,
              };

              return (
                <div
                  key={mainCategory}
                  className="border border-gray-200 rounded-lg"
                >
                  {/* Category Header */}
                  <button
                    type="button"
                    onClick={() => toggleCategoryExpansion(mainCategory)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                      expandedCategories.includes(mainCategory)
                        ? `${colors.bgLight} ${colors.text} font-medium`
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{displayMetadata.icon}</span>
                      <span className="font-medium">{mainCategory}</span>
                      {displayMetadata.isTop && (
                        <HiStar className="text-yellow-500" size={16} />
                      )}
                    </div>
                    {expandedCategories.includes(mainCategory) ? (
                      <HiChevronDown size={20} className="text-gray-400" />
                    ) : (
                      <HiChevronRight size={20} className="text-gray-400" />
                    )}
                  </button>

                  {/* Subcategories */}
                  {expandedCategories.includes(mainCategory) && (
                    <div className="border-t border-gray-200 bg-gray-50 p-3 space-y-2">
                      {subcategories.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className="flex items-center gap-3"
                        >
                          <input
                            type="checkbox"
                            id={subcategory.id}
                            checked={isSubcategorySelected(subcategory.id)}
                            onChange={() =>
                              handleSubcategoryToggle(subcategory.id)
                            }
                            className={`rounded ${colors.ring} ${colors.text} focus:ring-2 focus:ring-offset-2`}
                          />
                          <label
                            htmlFor={subcategory.id}
                            className="flex-1 text-sm cursor-pointer hover:text-gray-700"
                          >
                            <div className="font-medium">
                              {subcategory.name}
                            </div>
                          </label>
                        </div>
                      ))}
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
          className={`p-3 rounded-lg ${colors.bgLight} border ${colors.border}`}
        >
          <h4 className="font-medium text-sm mb-2">Selected Categories:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((catId) => {
              const category = categories.find((c) => c.id === catId);
              return (
                <span
                  key={catId}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} text-white`}
                >
                  {category?.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Note about predefined categories */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <strong>Note:</strong> These are predefined categories and
        subcategories. The system automatically organizes content based on these
        selections for better user experience.
      </div>
    </div>
  );
}
