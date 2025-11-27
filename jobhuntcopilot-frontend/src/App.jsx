import { Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";

// Pages
import Dashboard from "./pages/Dashboard";
import JobDetails from "./pages/JobDetails";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact"; // correct

import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Upgrade from "./pages/Upgrade.jsx";
import ImportJobs from "./pages/ImportJobs.jsx";
import ImportJobDetails from "./pages/ImportJobDetails.jsx";
import JobLab from "./pages/JobLab.jsx";

import "./App.css";

function App() {
  return (
    <>
      <AppNavbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/job-import" element={<ImportJobs />} />
        <Route path="/job-import/imported-job-details" element={<ImportJobDetails />} />
        <Route path="/joblab" element={<JobLab />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/upgrade" element={<Upgrade />} />

        {/* Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
