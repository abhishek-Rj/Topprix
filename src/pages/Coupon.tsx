import { useState, useEffect } from "react";
import {
  HiTag,
  HiSearch,
  HiFilter,
  HiSortAscending,
  HiUser,
  HiShoppingCart,
} from "react-icons/hi";
import Footer from "../components/Footer";
import { FaStore } from "react-icons/fa";
import { motion } from "framer-motion";
import Navigation from "../components/navigation";
import CartSidebar from "../components/CartSidebar";
import { auth, db } from "../context/firebaseProvider";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import baseUrl from "../hooks/baseurl";
import CouponList from "../components/CouponCard";

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
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<any>(["all"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("all");
  const [userData, setUserData] = useState<any>({
    name: "",
    role: "",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const itemsPerPage = 12;

  useEffect(() => {
    localStorage.setItem("sortBy", "all");
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseUrl}categories`);
        if (response.ok) {
          const data = await response.json();
          data.categories.map((category: any) => {
            setCategories((prev: any) => [...prev, category.name]);
          });
        } else {
          toast.error("Failed to fetch categories");
        }
      } catch (error) {
        toast.error("Error loading categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const element = document.getElementById("goto");
    element?.scrollIntoView({ behavior: "smooth" });
    const sortBy = localStorage.getItem("sortBy") || "all";
    const storedCategories = localStorage.getItem("selectedCategories");
    const selectedCategory = localStorage.getItem("categories") || "all";

    if (storedCategories) {
      setSelectedCategories(JSON.parse(storedCategories));
    }

    let url = `${baseUrl}coupons?page=${currentPage}&limit=${itemsPerPage}`;

    if (sortBy === "inactive") {
      url += "&active=false";
    } else if (sortBy === "active") {
      url += "&active=true";
    }

    if (selectedCategory !== "all") {
      url += `&category=${selectedCategory}`;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserData({
            name: userData.name,
            role: userData.role || "USER",
          });
        } else {
          toast.info("You are not Signed in");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = () => {
    // Placeholder for edit functionality
    toast.info("Edit functionality coming soon!");
  };

  const handleDelete = () => {
    // Placeholder for delete functionality
    toast.info("Delete functionality coming soon!");
  };

  const handleCategorySelect = (category: string) => {
    if (category === "all") {
      setSelectedCategories([]);
      setSelectedCategory("all");
      localStorage.setItem("categories", "all");
      localStorage.setItem("selectedCategories", JSON.stringify([]));
      return;
    }

    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newSelectedCategories);
    setSelectedCategory(category);
    localStorage.setItem("categories", category);
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(newSelectedCategories)
    );
  };

  const filteredCoupons = (coupons || []).filter((coupon) => {
    if (!coupon) return false;
    const matchesSearch =
      (coupon.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (coupon.store?.name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );
    const matchesCategories =
      selectedCategories.length === 0 ||
      coupon.categories.some((cat) => selectedCategories.includes(cat.name));
    return matchesSearch && matchesCategories;
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

      {userData.name && (
        <>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(true)}
            className="fixed bottom-8 right-8 z-50 bg-yellow-500 text-white p-4 rounded-full shadow-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center justify-center"
          >
            <HiShoppingCart className="w-6 h-6" />
          </motion.button>
          <CartSidebar
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </>
      )}

      <main className="pt-20 pb-10 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4">
          {currentPage === 1 ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12 bg-yellow-100 rounded-xl p-4"
              >
                <h1 className="text-4xl pt-6 sm:text-5xl font-bold text-gray-900 mb-4">
                  Find the Best Coupons
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover amazing deals and discounts from your favorite
                  stores. Save more with our exclusive coupons!
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4 mb-8"
              >
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <HiTag className="text-yellow-600" />
                  <span className="text-gray-700">
                    {pagination?.totalItems || 0}+ Active Coupons
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <FaStore className="text-yellow-600" />
                  <span className="text-gray-700">500+ Partner Stores</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <HiUser className="text-yellow-600" />
                  <span className="text-gray-700">1M+ Happy Users</span>
                </div>
              </motion.div>
            </>
          ) : (
            <></>
          )}

          <div className="pt-8">
            {/* Filters and Search */}
            <div id="goto" className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search coupons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div className="relative">
                  <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      setSelectedCategory(newCategory);
                      localStorage.setItem("categories", newCategory);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    {categories.map((category: any) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <HiSortAscending className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      const newSortBy = e.target.value;
                      setSortBy(newSortBy);
                      localStorage.setItem("sortBy", newSortBy);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="all">All Coupons</option>
                    <option value="active">Active Coupons</option>
                    <option value="inactive">Inactive Coupons</option>
                  </select>
                </div>
                <div className="text-right">
                  <span className="text-gray-600">
                    Showing {filteredCoupons.length} of {pagination?.total || 0}{" "}
                    coupons
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Popular Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <motion.button
                key="all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategorySelect("all")}
                className={`p-2 rounded-xl text-center border transition ${
                  selectedCategories.length === 0
                    ? "bg-yellow-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-yellow-100 shadow-sm"
                }`}
              >
                All Categories
              </motion.button>
              {categories
                .slice(0, 6)
                .filter((cat: any) => cat !== "all")
                .map((category: any) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategorySelect(category)}
                    className={`p-2 rounded-xl text-center border transition ${
                      selectedCategories.includes(category)
                        ? "bg-yellow-500 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-yellow-100 shadow-sm"
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
            </div>
          </div>

          {/* Coupon Grid */}
          {coupons.length > 0 ? (
            <CouponList
              coupons={sortedCoupons}
              pagination={pagination}
              onPageChange={setCurrentPage}
              showLogo={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No coupons found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
