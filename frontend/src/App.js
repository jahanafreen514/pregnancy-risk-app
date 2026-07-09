import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import bg from "./assets/images/bg.png";

// Layout
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// Pages
import Splash from "./pages/publicPages/Splash";
import Home from "./pages/publicPages/Home";
import About from "./pages/publicPages/About";
import Contact from "./pages/publicPages/Contact";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/auth/AdminLogin";
// import AdminLayout from "./Layouts/AdminLayout";
// User
import Dashboard from "./pages/user/Dashboard";
import Monitor from "./pages/user/Monitor";
import PregnancyToolkit from "./pages/user/PregnancyToolkit";
import Alerts from "./pages/user/Alerts";
import Symptoms from "./pages/user/Symptoms";
import Suggestions from "./pages/user/Suggestions";
import Prediction from "./pages/user/Prediction";
import Profile from "./pages/user/Profile";
import EditProfile from "./pages/user/EditProfile";

// Extra
import Appointment from "./pages/extra/Appointment";
import Doctors from "./pages/extra/Doctors";
import Starting from "./pages/extra/Starting";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";
import TotalUsers from "./pages/admin/TotalUsers";

import "./index.css";

function AppLayout({ darkMode, setDarkMode }) {
  const location = useLocation();

  const showNavbarPages = [
  "/home",
  "/about",
  "/contact",
];

const showNavbar = showNavbarPages.includes(location.pathname);

  return (
    <>
      {/* NAVBAR */}
      {showNavbar && (
  <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
)}
      {/* MAIN APP AREA */}
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-all">

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            {/* Splash */}
            <Route path="/" element={<Splash />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public Pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Dashboard Pages (NO SIDEBAR — handled inside Dashboard.jsx) */}
            <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/toolkit"element={<PregnancyToolkit />}/>
            <Route path="/monitor" element={<Monitor />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/symptoms" element={<Symptoms />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/prediction" element={<Prediction />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
<Route path="/starting" element={<Starting />} />

<Route
   path="/admin-login"
   element={<AdminLogin />}
/>
<Route
  path="/admin-dashboard"
  element={
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  }
/>
{/* <Route path="/doctor-login" element={<DoctorLogin />} />
<Route path="/doctor-dashboard" element={<DoctorDashboard />} /> */}
<Route path="/users" element={<TotalUsers />} />

{/* <Route 
  path="/admin/pregnancy-records" 
  element={<PregnancyRecords />} 
/>

<Route 
  path="/health-monitoring" 
  element={<HealthMonitoringPage />} 
/>

<Route 
  path="/risk-prediction" 
  element={<RiskPrediction />} 
/>

<Route 
  path="/appointments" 
  element={<AdminAppointments />} 
/>

<Route 
  path="/sos-alerts" 
  element={<SOSAlertsPage />} 
/>

<Route 
  path="/reports" 
  element={<Reports />} 
/>

<Route 
  path="/settings" 
  element={<Settings />} 
/> */}

            {/* Extra */}
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/doctors" element={<Doctors />} />


          </Routes>
        </AnimatePresence>

      </div>
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <AppLayout darkMode={darkMode} setDarkMode={setDarkMode} />
    </BrowserRouter>
  );
}

export default App;