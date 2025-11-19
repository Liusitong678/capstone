import { Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import About from "./pages/About";
// import SavedJobs from "./pages/SavedJobs";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Upgrade from "./pages/Upgrade.jsx";

import "./App.css";

function App() {
    return (
        <>
            <AppNavbar />

            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/upgrade" element={<Upgrade />} />

                {/* Auth */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
}

export default App;
