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
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentCancel from "./pages/PaymentCancel.jsx";

import "./App.css";
import ImportJobDetails from "./pages/ImportJobDetails.jsx";
import JobLab from "./pages/JobLab.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";

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
        <Route path="/super-admin" element={<SuperAdminDashboard />} />


        <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />


        {/* Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
