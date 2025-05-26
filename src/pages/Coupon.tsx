import { useState, useEffect } from "react";
import {
  HiTag,
  HiSearch,
  HiFilter,
  HiSortAscending,
  HiUser,
  HiHeart,
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

interface Coupon {
  id: number;
  title: string;
  store: string;
  discount: string;
  code: string;
  category: string;
  expiryDate: string;
  image: string;
}

export default function CouponPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [userData, setUserData] = useState<any>({
    name: "",
    role: "",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemsPerPage = 9;

  // Mock data for coupons
  const mockCoupons: Coupon[] = [
    {
      id: 1,
      title: "Summer Sale",
      store: "Fashion Store",
      discount: "50% OFF",
      code: "SUMMER50",
      category: "Fashion",
      expiryDate: "2024-08-31",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 2,
      title: "Weekend Special",
      store: "Electronics Hub",
      discount: "$100 OFF",
      code: "WEEKEND100",
      category: "Electronics",
      expiryDate: "2024-07-15",
      image:
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 3,
      title: "Food Festival",
      store: "Food Court",
      discount: "30% OFF",
      code: "FOOD30",
      category: "Food",
      expiryDate: "2024-06-30",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 4,
      title: "Back to School",
      store: "Book Store",
      discount: "25% OFF",
      code: "SCHOOL25",
      category: "Education",
      expiryDate: "2024-09-15",
      image:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 5,
      title: "Gaming Bundle",
      store: "Game Stop",
      discount: "40% OFF",
      code: "GAME40",
      category: "Gaming",
      expiryDate: "2024-07-31",
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 6,
      title: "Home Decor",
      store: "Home Goods",
      discount: "20% OFF",
      code: "HOME20",
      category: "Home",
      expiryDate: "2024-08-15",
      image:
        "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 7,
      title: "Fitness Gear",
      store: "Sports World",
      discount: "35% OFF",
      code: "FIT35",
      category: "Sports",
      expiryDate: "2024-07-31",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 8,
      title: "Beauty Box",
      store: "Cosmetics Store",
      discount: "45% OFF",
      code: "BEAUTY45",
      category: "Beauty",
      expiryDate: "2024-08-31",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 9,
      title: "Tech Bundle",
      store: "Tech Store",
      discount: "60% OFF",
      code: "TECH60",
      category: "Electronics",
      expiryDate: "2024-07-15",
      image:
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 10,
      title: "Pet Supplies",
      store: "Pet Shop",
      discount: "25% OFF",
      code: "PET25",
      category: "Pets",
      expiryDate: "2024-08-31",
      image:
        "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 11,
      title: "Movie Night",
      store: "Cinema",
      discount: "2 for 1",
      code: "MOVIE2X1",
      category: "Entertainment",
      expiryDate: "2024-07-31",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 12,
      title: "Coffee Break",
      store: "Coffee Shop",
      discount: "Buy 1 Get 1",
      code: "COFFEEBOGO",
      category: "Food",
      expiryDate: "2024-08-15",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
  ];

  const categories = [
    "all",
    "Fashion",
    "Electronics",
    "Food",
    "Education",
    "Gaming",
    "Home",
    "Sports",
    "Beauty",
    "Pets",
    "Entertainment",
  ];

  useEffect(() => {
    // In a real app, this would be an API call
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
        }
      } else {
        toast.info("User not Signed in");
      }
    });

    setCoupons(mockCoupons);
    return () => unsubscribe();
  }, []);

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.store.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || coupon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
      );
    }
    if (sortBy === "oldest") {
      return (
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      );
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedCoupons.length / itemsPerPage);
  const currentCoupons = sortedCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // You might want to add a toast notification here
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white pt-16">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section - Only show on first page */}
          {currentPage === 1 ? (
            <div className="relative pt-24 pb-16">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-3xl -z-10" />
              <div className="text-center max-w-4xl mx-auto">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
                >
                  Unlock Amazing
                  <span className="text-yellow-600"> Savings</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl text-gray-600 mb-8"
                >
                  Discover exclusive deals and discounts from your favorite
                  stores. Save more on every purchase with our curated
                  collection of coupons.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap justify-center gap-4 mb-8"
                >
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <HiTag className="text-yellow-600" />
                    <span className="text-gray-700">
                      12,000+ Active Coupons
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="relative max-w-2xl mx-auto"
                >
                  <div className="relative">
                    <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="text"
                      placeholder="Search for stores, categories, or deals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white rounded-full shadow-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-lg"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition">
                      Search
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="pt-8">
              {/* Filters and Search */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
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
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      {categories.map((category) => (
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
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-600">
                      Showing {currentCoupons.length} of{" "}
                      {filteredCoupons.length} coupons
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Popular Categories - Only show on first page */}
          {currentPage === 1 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Popular Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`p-4 rounded-xl text-center transition ${
                        selectedCategory === category
                          ? "bg-yellow-500 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-yellow-50 shadow-sm"
                      }`}
                    >
                      {category}
                    </motion.button>
                  ))}
              </div>
            </div>
          )}

          {/* Coupon Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCoupons.map((coupon) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={coupon.image}
                    alt={coupon.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {coupon.title}
                      </h3>
                      <p className="text-gray-600">{coupon.store}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                      {coupon.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-yellow-600">
                      {coupon.discount}
                    </span>
                    <button
                      onClick={() => copyToClipboard(coupon.code)}
                      className="text-sm text-gray-500 hover:text-yellow-600"
                    >
                      Code: {coupon.code}
                    </button>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        /* Add to favorites logic */
                      }}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <HiHeart className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => {
                        /* Add to cart logic */
                      }}
                      className="p-2 text-gray-500 hover:text-yellow-600 transition-colors"
                    >
                      <HiShoppingCart className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-yellow-50 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === index + 1
                      ? "bg-yellow-500 text-white"
                      : "border border-gray-300 hover:bg-yellow-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-yellow-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
