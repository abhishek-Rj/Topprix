import { Routes, Route, BrowserRouter } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PricingPlans from "./pages/Admin/PricingPlans";
import Subscriptions from "./pages/Retailer/Subscriptions";
import UserDashboard from "./pages/Dashboard";
import Deals from "./pages/Deals";
import Profile from "./pages/Profile";
import RetailerStores from "./pages/Retailer/RetailerStore";
import CreateNewStore from "./pages/Retailer/createNewStore";
import NotFound from "./pages/NotFound";
import EditStore from "./pages/Retailer/EditStore";
import StoreDetailPage from "./pages/Common/Store";
import CouponPage from "./pages/Coupon";
import FlyerPage from "./pages/Flyer";
import WishlistPage from "./pages/Wishlist";
import RetailerDashboard from "./pages/Retailer/RetailerDashboard";
import ShoppingList from "./pages/ShoppingList";
import PDFViewer from "./pages/PDFViewer";
import FlyerDetail from "./pages/FlyerDetail";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/stores" element={<RetailerStores />} />
          <Route path="/stores/create-new-store" element={<CreateNewStore />} />
          <Route path="/stores/edit-store/:id" element={<EditStore />} />
          <Route path="/stores/store/:id" element={<StoreDetailPage />} />
          <Route path="/explore/coupons" element={<CouponPage />} />
          <Route path="/explore/flyers" element={<FlyerPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/shopping-lists" element={<ShoppingList />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/pricing-plans" element={<PricingPlans />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/retailer-dashboard" element={<RetailerDashboard />} />
          <Route path="/pdf-viewer/:flyerId" element={<PDFViewer />} />
          <Route path="/flyers/:flyerId" element={<FlyerDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
