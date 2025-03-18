import { Routes, Route, BrowserRouter } from "react-router-dom";
import Signup from "./pages/Signup";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Signup />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
