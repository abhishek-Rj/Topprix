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
  FiTrendingUp,
  FiEye,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiStar
} from "react-icons/fi";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import Navigation from "../../components/navigation";
import Footer from "../../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for charts
const platformStats = [
  { month: "Jan", users: 1200, stores: 45, revenue: 25000, campaigns: 180 },
  { month: "Feb", users: 1450, stores: 52, revenue: 32000, campaigns: 220 },
  { month: "Mar", users: 1680, stores: 58, revenue: 38000, campaigns: 260 },
  { month: "Apr", users: 1920, stores: 65, revenue: 45000, campaigns: 310 },
  { month: "May", users: 2180, stores: 72, revenue: 52000, campaigns: 360 },
  { month: "Jun", users: 2450, stores: 78, revenue: 58000, campaigns: 410 },
];

const userDistribution = [
  { name: "Retailers", value: 45, color: "#3B82F6" },
  { name: "Customers", value: 35, color: "#10B981" },
  { name: "Admins", value: 10, color: "#F59E0B" },
  { name: "Moderators", value: 10, color: "#EF4444" },
];

const topStores = [
  { name: "TechMart Electronics", revenue: 85000, users: 2400, rating: 4.9, status: "active" },
  { name: "Fashion Forward", revenue: 72000, users: 2100, rating: 4.7, status: "active" },
  { name: "Home & Garden Plus", revenue: 68000, users: 1900, rating: 4.6, status: "active" },
  { name: "Sports Central", revenue: 55000, users: 1600, rating: 4.5, status: "pending" },
];

const systemAlerts = [
  { type: "warning", title: "High server load detected", time: "5 minutes ago", priority: "medium" },
  { type: "info", title: "New retailer registration", time: "15 minutes ago", priority: "low" },
  { type: "success", title: "Backup completed successfully", time: "1 hour ago", priority: "low" },
  { type: "error", title: "Payment processing delay", time: "2 hours ago", priority: "high" },
];

const recentActivity = [
  { action: "New Store Created", user: "TechMart Electronics", time: "2 hours ago", status: "success" },
  { action: "Campaign Approved", user: "Fashion Forward", time: "4 hours ago", status: "success" },
  { action: "User Report Filed", user: "Sports Central", time: "6 hours ago", status: "warning" },
  { action: "Payment Processed", user: "Home & Garden Plus", time: "8 hours ago", status: "success" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-100/80 to-indigo-100/80">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Monitor platform performance and manage system operations
              </p>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <FiUsers className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">2,450</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FiTrendingUp className="w-3 h-3 mr-1" />
                  +12.3% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-indigo-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
                <FiMapPin className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">78</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FiTrendingUp className="w-3 h-3 mr-1" />
                  +8.7% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <FiDollarSign className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">$58,420</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FiTrendingUp className="w-3 h-3 mr-1" />
                  +15.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <FiActivity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">410</div>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <FiEye className="w-3 h-3 mr-1" />
                  23 pending approval
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {/* Platform Growth Chart */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiTrendingUp className="h-5 w-5 text-blue-600" />
                  Platform Growth
                </CardTitle>
                <CardDescription>Monthly platform metrics and growth trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={platformStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stores" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Stores"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      name="Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Distribution */}
            <Card className="bg-white/80 backdrop-blur-sm border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiUsers className="h-5 w-5 text-indigo-600" />
                  User Distribution
                </CardTitle>
                <CardDescription>Platform user types and percentages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Stores & System Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {/* Top Performing Stores */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiStar className="h-5 w-5 text-purple-600" />
                  Top Performing Stores
                </CardTitle>
                <CardDescription>Highest revenue generating stores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topStores.map((store, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{store.name}</h4>
                          <Badge 
                            variant={store.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {store.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{store.users} users</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${store.revenue.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          <FiStar className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">{store.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiAlertCircle className="h-5 w-5 text-green-600" />
                  System Alerts
                </CardTitle>
                <CardDescription>Recent system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === 'warning' ? 'bg-yellow-500' :
                        alert.type === 'error' ? 'bg-red-500' :
                        alert.type === 'success' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                          <Badge 
                            variant={alert.priority === 'high' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {alert.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiClock className="h-5 w-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest platform activities and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{activity.action}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {activity.user}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiSettings className="h-5 w-5 text-indigo-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Link to="/admin/pricing-plans">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-lg transition-all hover:scale-105">
                      Manage Pricing Plans
                    </button>
                  </Link>
                  <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold py-3 px-4 rounded-lg transition-all hover:scale-105">
                    Review Pending Stores
                  </button>
                  <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-lg transition-all hover:scale-105">
                    System Analytics
                  </button>
                  <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg transition-all hover:scale-105">
                    Security Dashboard
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Health Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiCheckCircle className="h-5 w-5" />
                  System Status
                </CardTitle>
                <CardDescription className="text-green-100">
                  All systems operational
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-sm text-green-100">Uptime this month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiDatabase className="h-5 w-5" />
                  Database Health
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Excellent</div>
                <p className="text-sm text-blue-100">Response time: 45ms</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiShield className="h-5 w-5" />
                  Security Status
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Threat monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Secure</div>
                <p className="text-sm text-purple-100">No threats detected</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
