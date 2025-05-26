import { useState, useEffect } from "react";
import {
  HiNewspaper,
  HiSearch,
  HiFilter,
  HiSortAscending,
  HiUser,
  HiHeart,
  HiShoppingCart,
} from "react-icons/hi";
import { FaStore } from "react-icons/fa";
import { motion } from "framer-motion";
import Navigation from "../components/navigation";
import Footer from "../components/Footer";
import CartSidebar from "../components/CartSidebar";

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
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemsPerPage = 9;

  // Mock data for flyers
  const mockFlyers: Flyer[] = [
    {
      id: 1,
      title: "Mega Sale Event",
      store: "Shopping Mall",
      description:
        "Huge discounts on all items. Up to 70% off on selected items.",
      category: "Fashion",
      validUntil: "2024-08-31",
      image:
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      featured: true,
    },
    {
      id: 2,
      title: "Tech Expo 2024",
      store: "Tech Store",
      description:
        "Latest gadgets and deals. Special launch prices on new products.",
      category: "Electronics",
      validUntil: "2024-07-15",
      image:
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      featured: true,
    },
    {
      id: 3,
      title: "Food Festival",
      store: "Food Court",
      description:
        "Taste the world. Special discounts on international cuisines.",
      category: "Food",
      validUntil: "2024-06-30",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      featured: true,
    },
    {
      id: 4,
      title: "Back to School Sale",
      store: "Book Store",
      description: "Everything you need for the new academic year.",
      category: "Education",
      validUntil: "2024-09-15",
      image:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      featured: false,
    },
    {
      id: 5,
      title: "Gaming Convention",
      store: "Game Stop",
      description: "Exclusive deals on gaming consoles and accessories.",
      category: "Gaming",
      validUntil: "2024-07-31",
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      featured: false,
    },
    {
      id: 6,
      title: "Home Decor Sale",
      store: "Home Goods",
      description: "Transform your living space with our exclusive collection.",
      category: "Home",
      validUntil: "2024-08-15",
      image:
        "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      featured: false,
    },
    {
      id: 7,
      title: "Fitness Gear Sale",
      store: "Sports World",
      description:
        "Get fit with our premium sports equipment at special prices.",
      category: "Sports",
      validUntil: "2024-07-31",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      featured: false,
    },
    {
      id: 8,
      title: "Beauty Box Launch",
      store: "Cosmetics Store",
      description: "New beauty products with amazing introductory offers.",
      category: "Beauty",
      validUntil: "2024-08-31",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      featured: false,
    },
    {
      id: 9,
      title: "Tech Bundle Sale",
      store: "Tech Store",
      description: "Bundle deals on the latest technology products.",
      category: "Electronics",
      validUntil: "2024-07-15",
      image:
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      featured: false,
    },
    {
      id: 10,
      title: "Pet Care Event",
      store: "Pet Shop",
      description: "Special offers on pet food and accessories.",
      category: "Pets",
      validUntil: "2024-08-31",
      image:
        "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      featured: false,
    },
    {
      id: 11,
      title: "Movie Night Special",
      store: "Cinema",
      description: "Special screening events with exclusive deals.",
      category: "Entertainment",
      validUntil: "2024-07-31",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      featured: false,
    },
    {
      id: 12,
      title: "Coffee Festival",
      store: "Coffee Shop",
      description: "Taste different coffee varieties with special discounts.",
      category: "Food",
      validUntil: "2024-08-15",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      featured: false,
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
    setFlyers(mockFlyers);
  }, []);

  const filteredFlyers = flyers.filter((flyer) => {
    const matchesSearch =
      flyer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flyer.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flyer.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || flyer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedFlyers = [...filteredFlyers].sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.validUntil).getTime() - new Date(a.validUntil).getTime()
      );
    }
    if (sortBy === "oldest") {
      return (
        new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime()
      );
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedFlyers.length / itemsPerPage);
  const currentFlyers = sortedFlyers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white pt-16">
        {/* Add Floating Action Button */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section - Only show on first page */}
          {currentPage === 1 && (
            <div className="relative pt-24 pb-16">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-3xl -z-10" />
              <div className="text-center max-w-4xl mx-auto">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
                >
                  Latest
                  <span className="text-yellow-600"> Flyers</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl text-gray-600 mb-8"
                >
                  Discover the latest deals and promotions from your favorite
                  stores. Stay updated with our collection of current flyers.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap justify-center gap-4 mb-8"
                >
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <HiNewspaper className="text-yellow-600" />
                    <span className="text-gray-700">500+ Active Flyers</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <FaStore className="text-yellow-600" />
                    <span className="text-gray-700">200+ Partner Stores</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <HiUser className="text-yellow-600" />
                    <span className="text-gray-700">50K+ Monthly Views</span>
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

          {/* Filters and Search */}
          {currentPage === 1 ? (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search flyers..."
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
                    Showing {currentFlyers.length} of {filteredFlyers.length}{" "}
                    flyers
                  </span>
                </div>
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
                      placeholder="Search flyers..."
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
                      Showing {currentFlyers.length} of {filteredFlyers.length}{" "}
                      flyers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Flyer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentFlyers.map((flyer) => (
              <motion.div
                key={flyer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={flyer.image}
                    alt={flyer.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {flyer.title}
                      </h3>
                      <p className="text-gray-600">{flyer.store}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                      {flyer.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{flyer.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    Valid until:{" "}
                    {new Date(flyer.validUntil).toLocaleDateString()}
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
