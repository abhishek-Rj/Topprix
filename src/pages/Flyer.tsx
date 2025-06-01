import { useState, useEffect } from "react";
import {
  HiNewspaper,
  HiSearch,
  HiFilter,
  HiSortAscending,
  HiUser,
  HiShoppingCart,
} from "react-icons/hi";
import { FaStore } from "react-icons/fa";
import { motion } from "framer-motion";
import Navigation from "../components/navigation";
import Footer from "../components/Footer";
import CartSidebar from "../components/CartSidebar";
import baseUrl from "@/hooks/baseurl";
import { toast } from "react-toastify";
import FlyerList from "@/components/FlyerCard";
import Loader from "@/components/loading";
import useAuthenticate from "@/hooks/authenticationt";

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
  const [flyers, setFlyers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthenticate();

  useEffect(() => {
    const fetchFlyers = async () => {
      try {
        setLoading(true);
        let url = `${baseUrl}flyers?limit=12`;

        // Add category filter if selected
        if (selectedCategory) {
          url += `&categoryId=${selectedCategory}`;
        }

        // Add active/inactive filter
        if (sortBy === "active") {
          url += "&active=true";
        } else if (sortBy === "inactive") {
          url += "&active=false";
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch flyers");
        }
        const data = await response.json();
        setFlyers(data.flyers);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching flyers:", error);
        toast.error("Failed to load flyers");
      } finally {
        setLoading(false);
      }
    };

    fetchFlyers();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}categories`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      let url = `${baseUrl}flyers?page=${page}&limit=12`;

      if (selectedCategory) {
        url += `&categoryId=${selectedCategory}`;
      }

      if (sortBy === "active") {
        url += "&active=true";
      } else if (sortBy === "inactive") {
        url += "&active=false";
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch flyers");
      }
      const data = await response.json();
      setFlyers(data.flyers);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching flyers:", error);
      toast.error("Failed to load flyers");
    } finally {
      setLoading(false);
    }
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

  const filteredFlyers = flyers.filter((flyer) =>
    flyer.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white pt-16">
        {/* Add Floating Action Button */}
        {user != null ? (
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
        ) : (
          <></>
        )}
        <CartSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section - Only show on first page */}
          {pagination && pagination.currentPage === 1 && (
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
          {pagination && pagination.currentPage === 1 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Popular Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {/* Add category buttons here */}
              </div>
            </div>
          )}

          {/* Filters and Search */}
          {pagination && pagination.currentPage === 1 ? (
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
                    {/* Add category options here */}
                  </select>
                </div>
                <div className="relative">
                  <HiSortAscending className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="all">All Flyers</option>
                    <option value="active">Active Flyers</option>
                    <option value="inactive">Inactive Flyers</option>
                  </select>
                </div>
                <div className="text-right">
                  <span className="text-gray-600">
                    Showing {flyers.length} of {filteredFlyers.length} flyers
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
                      {categories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
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
                      <option value="all">All Flyers</option>
                      <option value="active">Active Flyers</option>
                      <option value="inactive">Inactive Flyers</option>
                    </select>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-600">
                      Showing {flyers.length} of {filteredFlyers.length} flyers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Flyer Grid */}
          <div className="min-h-[200px] sm:min-h-[300px] bg-yellow-50 rounded-xl p-4 sm:p-5 shadow-inner">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader />
              </div>
            ) : filteredFlyers.length > 0 ? (
              <FlyerList
                showLogo={true}
                flyers={filteredFlyers}
                pagination={pagination}
                onPageChange={handlePageChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="text-center text-gray-700">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2 mb-4">
                  <HiNewspaper className="text-yellow-600" />
                  No Flyers Found
                </h2>
                <p className="text-sm sm:text-base">
                  {searchQuery
                    ? "No flyers match your search criteria."
                    : "No flyers available at the moment."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
