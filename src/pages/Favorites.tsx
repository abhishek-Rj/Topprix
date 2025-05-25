import { useState } from "react";
import { HiTrash } from "react-icons/hi";
import { motion } from "framer-motion";
import Navigation from "../components/navigation";
import Footer from "../components/Footer";

interface FavoriteItem {
  id: number;
  title: string;
  store: string;
  category: string;
  image: string;
  type: "coupon" | "flyer";
  discount?: string;
  code?: string;
  description?: string;
  expiryDate?: string;
  validUntil?: string;
}

export default function FavoritesPage() {
  // Mock data for favorites
  const [favorites] = useState<FavoriteItem[]>([
    {
      id: 1,
      title: "Summer Sale",
      store: "Fashion Store",
      category: "Fashion",
      type: "coupon",
      discount: "50% OFF",
      code: "SUMMER50",
      expiryDate: "2024-08-31",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 2,
      title: "Tech Expo 2024",
      store: "Tech Store",
      category: "Electronics",
      type: "flyer",
      description:
        "Latest gadgets and deals. Special launch prices on new products.",
      validUntil: "2024-07-15",
      image:
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
  ]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="relative pt-24 pb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-3xl -z-10" />
            <div className="text-center max-w-4xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
              >
                Your
                <span className="text-yellow-600"> Favorites</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-gray-600 mb-8"
              >
                Keep track of your favorite deals and promotions in one place.
              </motion.p>
            </div>
          </div>

          {/* Favorites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {favorites.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.store}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  {item.type === "coupon" ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-yellow-600">
                          {item.discount}
                        </span>
                        <span className="text-sm text-gray-500">
                          Code: {item.code}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        Expires:{" "}
                        {new Date(item.expiryDate!).toLocaleDateString()}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <div className="text-sm text-gray-500 mb-4">
                        Valid until:{" "}
                        {new Date(item.validUntil!).toLocaleDateString()}
                      </div>
                    </>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        /* Remove from favorites logic */
                      }}
                      className="p-2 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <HiTrash className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
