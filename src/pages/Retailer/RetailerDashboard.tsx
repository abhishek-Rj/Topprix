import { motion } from "framer-motion";
import { FiTool, FiClock, FiBell, FiStar } from "react-icons/fi";
import Navigation from "../../components/navigation";

export default function RetailerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <Navigation />
      <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="relative inline-block mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-30"
              />
              <div className="relative bg-white rounded-full p-6 shadow-2xl">
                <FiTool className="w-16 h-16 text-yellow-600" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Dashboard
              <span className="text-yellow-600"> Coming Soon</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We're crafting an amazing dashboard experience for our retailers.
              Get ready to manage your stores, track performance, and grow your
              business like never before!
            </p>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {/* Analytics Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-100"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-4">
                <FiStar className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analytics & Insights
              </h3>
              <p className="text-gray-600 text-sm">
                Track your store performance, customer engagement, and sales
                metrics in real-time.
              </p>
            </motion.div>

            {/* Store Management */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-100"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                <FiTool className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Store Management
              </h3>
              <p className="text-gray-600 text-sm">
                Manage multiple stores, update information, and control your
                business presence.
              </p>
            </motion.div>

            {/* Campaign Tools */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-100"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4">
                <FiBell className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Campaign Tools
              </h3>
              <p className="text-gray-600 text-sm">
                Create and manage flyers, coupons, and promotional campaigns
                with ease.
              </p>
            </motion.div>
          </motion.div>

          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-yellow-100"
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FiClock className="w-5 h-5 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Development Progress
                </h2>
              </div>
              <p className="text-gray-600">
                We're working hard to bring you the best dashboard experience
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1.5, delay: 0.6 }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-yellow-50 rounded-xl">
                <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <h4 className="font-semibold text-gray-900">Design</h4>
                <p className="text-sm text-gray-600">Completed</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-xl">
                <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⚡</span>
                </div>
                <h4 className="font-semibold text-gray-900">Development</h4>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🚀</span>
                </div>
                <h4 className="font-semibold text-gray-900">Launch</h4>
                <p className="text-sm text-gray-600">Coming Soon</p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-6">
              Want to be notified when the dashboard is ready?
            </p>
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Get Notified
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
