import { Routes, Route, BrowserRouter } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Deals from "./pages/Deals";
import Profile from "./pages/Profile";
import RetailerStores from "./pages/Retailer/RetailerStore";
import CreateNewStore from "./pages/Retailer/createNewStore";
import NotFound from "./pages/NotFound";
import Store from "./pages/Retailer/Store";
import EditStore from "./pages/Retailer/EditStore";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/retailer-stores" element={<RetailerStores />} />
          <Route
            path="retailer-stores/create-new-store"
            element={<CreateNewStore />}
          />
          <Route
            path="/retailer-stores/edit-store/:id"
            element={<EditStore />}
          />
          <Route path="/retailer-stores/store/:id" element={<Store />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
