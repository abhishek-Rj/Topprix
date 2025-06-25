import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiShield,
  FiUsers,
  FiSettings,
  FiBarChart,
  FiDatabase,
  FiActivity,
  FiDollarSign,
} from "react-icons/fi";
import Navigation from "../../components/navigation";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-30"
              />
              <div className="relative bg-white rounded-full p-6 shadow-2xl">
                <FiShield className="w-16 h-16 text-blue-600" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Admin
              <span className="text-blue-600"> Dashboard</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We're building a powerful admin dashboard to help you manage the
              entire platform. Get ready for comprehensive analytics, user
              management, and system controls!
            </p>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {/* User Management */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                User Management
              </h3>
              <p className="text-gray-600 text-sm">
                Manage all users, retailers, and admins with comprehensive
                control and oversight.
              </p>
            </motion.div>

            {/* Pricing Plans */}
            <Link to="/admin/pricing-plans">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100 cursor-pointer"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                  <FiDollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pricing Plans
                </h3>
                <p className="text-gray-600 text-sm">
                  Create and manage subscription plans and pricing tiers for retailers.
                </p>
              </motion.div>
            </Link>

            {/* Analytics & Reports */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
                <FiBarChart className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analytics & Reports
              </h3>
              <p className="text-gray-600 text-sm">
                Advanced analytics, performance metrics, and detailed reports
                for platform insights.
              </p>
            </motion.div>

            {/* System Settings */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
                <FiSettings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                System Settings
              </h3>
              <p className="text-gray-600 text-sm">
                Configure platform settings, manage categories, and control
                system-wide parameters.
              </p>
            </motion.div>

            {/* Content Moderation */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                <FiActivity className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Content Moderation
              </h3>
              <p className="text-gray-600 text-sm">
                Review and moderate flyers, coupons, and store content to
                maintain quality standards.
              </p>
            </motion.div>

            {/* Database Management */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl mb-4">
                <FiDatabase className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Database Management
              </h3>
              <p className="text-gray-600 text-sm">
                Manage data, backups, and system maintenance with advanced
                database tools.
              </p>
            </motion.div>

            {/* Security & Monitoring */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4">
                <FiShield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Security & Monitoring
              </h3>
              <p className="text-gray-600 text-sm">
                Monitor system security, track user activities, and manage
                access controls.
              </p>
            </motion.div>
          </motion.div>

          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100"
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FiActivity className="w-5 h-5 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Development Status
                </h2>
              </div>
              <p className="text-gray-600">
                Our development team is working tirelessly to deliver a
                world-class admin experience
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 1.5, delay: 0.6 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <h4 className="font-semibold text-gray-900">Planning</h4>
                <p className="text-sm text-gray-600">Completed</p>
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl">
                <div className="w-8 h-8 bg-indigo-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <h4 className="font-semibold text-gray-900">Design</h4>
                <p className="text-sm text-gray-600">Completed</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
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
              Stay updated on the admin dashboard development progress
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Get Updates
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
