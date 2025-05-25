import { useNavigate } from "react-router-dom";
import { HiNewspaper, HiTag, HiUser, HiSearch } from "react-icons/hi";
import { FaStore } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  const featuredCoupons = [
    {
      id: 1,
      title: "Summer Sale",
      store: "Fashion Store",
      discount: "50% OFF",
      code: "SUMMER50",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 2,
      title: "Weekend Special",
      store: "Electronics Hub",
      discount: "$100 OFF",
      code: "WEEKEND100",
      image:
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 3,
      title: "Food Festival",
      store: "Food Court",
      discount: "30% OFF",
      code: "FOOD30",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
  ];

  const featuredFlyers = [
    {
      id: 1,
      title: "Mega Sale",
      store: "Shopping Mall",
      description: "Huge discounts on all items",
      image:
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 2,
      title: "Tech Expo",
      store: "Tech Store",
      description: "Latest gadgets and deals",
      image:
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 3,
      title: "Food Festival",
      store: "Food Court",
      description: "Taste the world",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-yellow-600">Topprix</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/explore/coupons")}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-yellow-600 transition"
              >
                <HiTag />
                Explore Coupons
              </button>
              <button
                onClick={() => navigate("/explore/flyers")}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-yellow-600 transition"
              >
                <HiNewspaper />
                Explore Flyers
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
              >
                <HiUser />
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Discover Amazing Deals
              <span className="text-yellow-600"> Everywhere</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Find the best coupons and flyers from your favorite stores. Save
              more, shop smarter.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => navigate("/explore/coupons")}
                className="flex items-center gap-2 px-8 py-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition shadow-lg hover:shadow-xl"
              >
                <HiTag />
                Browse Coupons
              </button>
              <button
                onClick={() => navigate("/explore/flyers")}
                className="flex items-center gap-2 px-8 py-3 bg-white text-yellow-600 rounded-full hover:bg-yellow-50 transition shadow-lg hover:shadow-xl border-2 border-yellow-500"
              >
                <HiNewspaper />
                View Flyers
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Coupons Section */}
      <section className="py-16 px-4 bg-yellow-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Coupons
            </h2>
            <button
              onClick={() => navigate("/explore/coupons")}
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCoupons.map((coupon) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {coupon.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{coupon.store}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-yellow-600">
                      {coupon.discount}
                    </span>
                    <span className="text-sm text-gray-500">
                      Code: {coupon.code}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Flyers Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Flyers
            </h2>
            <button
              onClick={() => navigate("/explore/flyers")}
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFlyers.map((flyer) => (
              <motion.div
                key={flyer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {flyer.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{flyer.store}</p>
                  <p className="text-gray-500">{flyer.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Create Store Section */}
      <section className="py-16 px-4 bg-yellow-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Have a Store?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Create your store profile and start sharing your coupons and flyers
            with thousands of potential customers.
          </p>
          <button
            onClick={() => navigate("/create-store")}
            className="flex items-center gap-2 px-8 py-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition shadow-lg hover:shadow-xl mx-auto"
          >
            <FaStore />
            Create Your Store
          </button>
        </div>
      </section>
    </div>
  );
}
