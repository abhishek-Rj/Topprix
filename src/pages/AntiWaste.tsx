import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiSearch, HiFilter, HiHeart, HiShoppingCart } from "react-icons/hi";
import { AntiWasteList } from "@/components/AntiWasteCard";
import { motion } from "framer-motion";
import Navigation from "../components/navigation";
import Footer from "../components/Footer";
import Loader from "../components/loading";
import useAuthenticate from "@/hooks/authenticationt";
import { toast } from "react-toastify";
import baseUrl from "@/hooks/baseurl";
import { useTranslation } from "react-i18next";

interface AntiWasteItem {
  id: string;
  storeId: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  quantity: number;
  expiryDate: string;
  imageUrl: string;
  category: string;
  condition: string;
  isAvailable: boolean;
  store: {
    id: string;
    name: string;
    logo: string;
    address: string;
  };
}

interface PaginationData {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  items: AntiWasteItem[];
}

export default function AntiWaste() {
  const { t } = useTranslation();
  const { user, userRole, loading } = useAuthenticate();
  const [items, setItems] = useState<any[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    items: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [minDiscount, setMinDiscount] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [nearMe, setNearMe] = useState(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const conditions = [
    { value: "NEAR_EXPIRY", label: "Near Expiry" },
    { value: "SURPLUS_STOCK", label: "Surplus Stock" },
    { value: "SEASONAL", label: "Seasonal" },
    { value: "SLIGHTLY_DAMAGED", label: "Slightly Damaged" },
    { value: "SHORT_DATED", label: "Short Dated" },
  ];

  const categories = [
    "Bakery",
    "Dairy",
    "Fruits",
    "Vegetables",
    "Meat",
    "Fish",
    "Pantry",
    "Beverages",
    "Snacks",
    "Frozen",
    "Other",
  ];

  const buildQueryString = () => {
    const params = new URLSearchParams();

    if (searchTerm) params.append("search", searchTerm);
    if (selectedStore) params.append("storeId", selectedStore);
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedCondition) params.append("condition", selectedCondition);
    if (minDiscount) params.append("minDiscount", minDiscount);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (isAvailable !== undefined)
      params.append("isAvailable", isAvailable.toString());
    if (limit) params.append("limit", limit.toString());
    if (currentPage) params.append("page", currentPage.toString());
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (nearMe) params.append("nearMe", nearMe.toString());

    return params.toString();
  };

  const fetchAntiWasteItems = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const queryString = buildQueryString();
      const url = `${baseUrl}api/anti-waste-items${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem("userEmail") || "",
        },
      });

      const data = await response.json();

      if (data.data) {
        setItems(data.data);
        setPaginationData({
          totalCount: data.pagination?.totalItems || 0,
          currentPage: data.pagination?.currentPage || 1,
          totalPages: data.pagination?.totalPages || 1,
          items: data.data,
        });
      } else {
        throw new Error("No anti-waste items found");
      }
    } catch (error) {
      toast.error(t("antiWaste.failedToFetchItems"));
      console.error("Error fetching anti-waste items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAntiWasteItems(currentPage);
  }, [
    currentPage,
    searchTerm,
    selectedStore,
    selectedCategory,
    selectedCondition,
    minDiscount,
    maxPrice,
    isAvailable,
    limit,
    sortBy,
    sortOrder,
    nearMe,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAntiWasteItems(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStore("");
    setSelectedCategory("");
    setSelectedCondition("");
    setMinDiscount("");
    setMaxPrice("");
    setIsAvailable(true);
    setLimit(20);
    setCurrentPage(1);
    setSortBy("");
    setSortOrder("desc");
    setNearMe(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "NEAR_EXPIRY":
        return "bg-red-100 text-red-800";
      case "SURPLUS_STOCK":
        return "bg-blue-100 text-blue-800";
      case "SEASONAL":
        return "bg-orange-100 text-orange-800";
      case "SLIGHTLY_DAMAGED":
        return "bg-yellow-100 text-yellow-800";
      case "SHORT_DATED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionLabel = (condition: string) => {
    const found = conditions.find((c) => c.value === condition);
    return found ? found.label : condition;
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>

      <main className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 sm:p-8 mb-8 text-white">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {t("antiWaste.title")}
              </h1>
              <p className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto">
                {t("antiWaste.subtitle")}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("antiWaste.browseItems")}
                </h2>
                <p className="text-gray-600 mt-1">
                  {t("antiWaste.description")}
                </p>
              </div>
              {(userRole === "RETAILER" || userRole === "ADMIN") && (
                <button
                  onClick={() => navigate("/stores")}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  {t("antiWaste.manageItems")}
                </button>
              )}
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-2"
              >
                <div className="relative flex-1">
                  <HiSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t("antiWaste.searchPlaceholder")}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    {t("antiWaste.search")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2.5 border border-gray-300 rounded-lg flex items-center gap-2 ${
                      showFilters
                        ? "bg-green-100 border-green-300"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <HiFilter size={18} />
                    <span className="hidden sm:inline">
                      {t("antiWaste.filters")}
                    </span>
                  </button>
                </div>
              </form>

              {/* Filters Panel */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 rounded-lg p-4 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("antiWaste.category")}
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">{t("antiWaste.allCategories")}</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("antiWaste.condition")}
                      </label>
                      <select
                        value={selectedCondition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">{t("antiWaste.allConditions")}</option>
                        {conditions.map((condition) => (
                          <option key={condition.value} value={condition.value}>
                            {condition.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("antiWaste.minDiscount")} (%)
                      </label>
                      <input
                        type="number"
                        value={minDiscount}
                        onChange={(e) => setMinDiscount(e.target.value)}
                        placeholder="20"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("antiWaste.maxPrice")} ($)
                      </label>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="50"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("antiWaste.sortBy")}
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">{t("antiWaste.noSort")}</option>
                        <option value="price">
                          {t("antiWaste.sortByPrice")}
                        </option>
                        <option value="discount">
                          {t("antiWaste.sortByDiscount")}
                        </option>
                        <option value="expiryDate">
                          {t("antiWaste.sortByExpiry")}
                        </option>
                        <option value="createdAt">
                          {t("antiWaste.sortByCreated")}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("antiWaste.sortOrder")}
                      </label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      >
                        <option value="desc">
                          {t("antiWaste.descending")}
                        </option>
                        <option value="asc">{t("antiWaste.ascending")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("antiWaste.itemsPerPage")}
                      </label>
                      <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={nearMe}
                          onChange={(e) => setNearMe(e.target.checked)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {t("antiWaste.nearMe")}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {t("antiWaste.availableOnly")}
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                    >
                      {t("antiWaste.clearFilters")}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Items Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t("antiWaste.noItemsFound")}
                </h3>
                <p className="text-gray-500">
                  {t("antiWaste.noItemsDescription")}
                </p>
              </div>
            ) : (
              <AntiWasteList
                items={items}
                pagination={paginationData}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
