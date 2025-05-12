import { Routes, Route, BrowserRouter } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Deals from "./pages/Deals";
import Profile from "./pages/Profile";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route
                        path="/admin-dashboard"
                        element={<AdminDashboard />}
                    />
                    <Route path="/deals" element={<Deals />} />

                    <Route path="/user-dashboard" element={<UserDashboard />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
