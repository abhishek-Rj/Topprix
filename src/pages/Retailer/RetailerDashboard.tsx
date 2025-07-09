import { motion } from "framer-motion";
import { 
  FiTrendingUp, 
  FiUsers, 
  FiShoppingBag, 
  FiDollarSign,
  FiEye,
  FiHeart,
  FiShare2,
  FiCalendar,
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
const salesData = [
  { month: "Jan", sales: 12000, views: 4500, conversions: 320 },
  { month: "Feb", sales: 15000, views: 5200, conversions: 410 },
  { month: "Mar", sales: 18000, views: 6100, conversions: 520 },
  { month: "Apr", sales: 22000, views: 7300, conversions: 680 },
  { month: "May", sales: 25000, views: 8900, conversions: 750 },
  { month: "Jun", sales: 28000, views: 10200, conversions: 890 },
];

const categoryData = [
  { name: "Electronics", value: 35, color: "#3B82F6" },
  { name: "Fashion", value: 25, color: "#EF4444" },
  { name: "Home & Garden", value: 20, color: "#10B981" },
  { name: "Sports", value: 15, color: "#F59E0B" },
  { name: "Books", value: 5, color: "#8B5CF6" },
];

const storePerformance = [
  { store: "Main Store", revenue: 45000, customers: 1200, rating: 4.8 },
  { store: "Downtown", revenue: 32000, customers: 890, rating: 4.6 },
  { store: "Mall Location", revenue: 28000, customers: 750, rating: 4.4 },
];

const recentActivity = [
  { type: "New Coupon", title: "Summer Sale 20% Off", time: "2 hours ago", status: "active" },
  { type: "Flyer Update", title: "Weekly Deals Updated", time: "4 hours ago", status: "active" },
  { type: "Customer Review", title: "5-star review received", time: "6 hours ago", status: "positive" },
  { type: "Sales Milestone", title: "Monthly target achieved", time: "1 day ago", status: "success" },
];

export default function RetailerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
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
            <div className="p-8 rounded-3xl bg-gradient-to-r from-yellow-100/80 to-orange-100/80">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Retailer Dashboard
              </h1>
              <p className="text-gray-600">
                Track your store performance and manage your business effectively
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
            <Card className="bg-white/80 backdrop-blur-sm border-yellow-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <FiDollarSign className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">$142,350</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FiTrendingUp className="w-3 h-3 mr-1" />
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <FiUsers className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">2,847</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FiTrendingUp className="w-3 h-3 mr-1" />
                  +8.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-red-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <FiShoppingBag className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <FiEye className="w-3 h-3 mr-1" />
                  3 expiring soon
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                <FiStar className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">4.7</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FiHeart className="w-3 h-3 mr-1" />
                  +0.2 from last month
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
            {/* Sales Trend Chart */}
            <Card className="bg-white/80 backdrop-blur-sm border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiTrendingUp className="h-5 w-5 text-yellow-600" />
                  Sales Performance
                </CardTitle>
                <CardDescription>Monthly sales and conversion trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stackId="1" 
                      stroke="#F59E0B" 
                      fill="#FEF3C7" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stackId="1" 
                      stroke="#EF4444" 
                      fill="#FEE2E2" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiShoppingBag className="h-5 w-5 text-orange-600" />
                  Category Distribution
                </CardTitle>
                <CardDescription>Sales by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                                             label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Store Performance & Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {/* Store Performance */}
            <Card className="bg-white/80 backdrop-blur-sm border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiMapPin className="h-5 w-5 text-red-600" />
                  Store Performance
                </CardTitle>
                <CardDescription>Revenue and customer metrics by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {storePerformance.map((store, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900">{store.store}</h4>
                        <p className="text-sm text-gray-600">{store.customers} customers</p>
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

            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiCalendar className="h-5 w-5 text-green-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'active' ? 'bg-blue-500' :
                        activity.status === 'positive' ? 'bg-green-500' :
                        'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiShoppingBag className="h-5 w-5" />
                  Create Campaign
                </CardTitle>
                <CardDescription className="text-yellow-100">
                  Launch a new flyer or coupon campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  Get Started
                </button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiTrendingUp className="h-5 w-5" />
                  View Analytics
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Detailed performance insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  Explore Data
                </button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiUsers className="h-5 w-5" />
                  Manage Stores
                </CardTitle>
                <CardDescription className="text-green-100">
                  Update store information and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  Manage Now
                </button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
