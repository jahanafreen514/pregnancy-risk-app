import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";


// Public Pages
import Splash from "./pages/publicPages/Splash";
import Home from "./pages/publicPages/Home";
import About from "./pages/publicPages/About";
import Contact from "./pages/publicPages/Contact";


// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/auth/AdminLogin";
import DoctorLogin from "./pages/auth/DoctorLogin";
import DoctorRegister from "./pages/auth/DoctorRegister";
import ForgotPassword from "./pages/auth/ForgotPassword";


// User Pages
import Dashboard from "./pages/user/Dashboard";
import PregnancyToolkit from "./pages/user/PregnancyToolkit";
import Alerts from "./pages/user/Alerts";
import Symptoms from "./pages/user/Symptoms";
import Suggestions from "./pages/user/Suggestions";
import Prediction from "./pages/user/Prediction";
import Profile from "./pages/user/Profile";
import EditProfile from "./pages/user/EditProfile";
import Reports from "./pages/user/Reports";


// Extra
import Appointment from "./pages/extra/Appointment";
import Doctors from "./pages/extra/Doctors";
import Starting from "./pages/extra/Starting";


// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAlerts from "./pages/admin/AdminAlerts";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminSystemStatus from "./pages/admin/AdminSystemStatus";
import DoctorVerification from "./pages/admin/DoctorVerification";


// Doctor
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorPatients from "./pages/Doctor/DoctorPatients";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorReports from "./pages/Doctor/DoctorReports";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorSettings from "./pages/Doctor/DoctorSettings";
import DoctorPrescriptions from "./pages/Doctor/DoctorPrescriptions";
import DoctorNotifications from "./pages/Doctor/DoctorNotifications";


import "./index.css";
function AppLayout({ darkMode, setDarkMode }) {

  const location = useLocation();


  const showNavbarPages = [
    "/home",
    "/about",
    "/contact",
  ];


  const showNavbar = showNavbarPages.includes(
    location.pathname
  );


  return (
    <>

      {
        showNavbar && (
          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        )
      }


      <div className="min-h-screen bg-white dark:bg-gray-900 transition-all">


        <AnimatePresence
          mode="wait"
        >


          <Routes
            location={location}
            key={location.pathname}
          >



            {/* ================= SPLASH ================= */}

            <Route
              path="/"
              element={<Splash />}
            />



            {/* ================= AUTH ================= */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route
              path="/doctor-login"
              element={<DoctorLogin />}
            />

            <Route
              path="/doctor-register"
              element={<DoctorRegister />}
            />


            <Route
              path="/admin-login"
              element={<AdminLogin />}
            />


            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />





            {/* ================= PUBLIC ================= */}


            <Route
              path="/home"
              element={<Home />}
            />


            <Route
              path="/about"
              element={<About />}
            />


            <Route
              path="/contact"
              element={<Contact />}
            />





            {/* ================= USER ================= */}



            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            <Route
              path="/toolkit"
              element={<PregnancyToolkit />}
            />


            <Route
              path="/alerts"
              element={<Alerts />}
            />


            <Route
              path="/symptoms"
              element={<Symptoms />}
            />


            <Route
              path="/suggestions"
              element={<Suggestions />}
            />


            <Route
              path="/prediction"
              element={<Prediction />}
            />


            <Route
              path="/reports"
              element={<Reports />}
            />


            <Route
              path="/profile"
              element={<Profile />}
            />


            <Route
              path="/profile/edit"
              element={<EditProfile />}
            />


            <Route
              path="/starting"
              element={<Starting />}
            />





            {/* ================= EXTRA ================= */}


            <Route
              path="/appointment"
              element={<Appointment />}
            />


            <Route
              path="/doctors"
              element={<Doctors />}
            />





            {/* ================= DOCTOR ================= */}



            <Route
              path="/doctor-dashboard"
              element={<DoctorDashboard />}
            />


            <Route
              path="/doctor-patients"
              element={<DoctorPatients />}
            />


            <Route
              path="/doctor-appointments"
              element={<DoctorAppointments />}
            />


            <Route
              path="/doctor-reports"
              element={<DoctorReports />}
            />


            <Route
              path="/doctor-profile"
              element={<DoctorProfile />}
            />


            <Route
              path="/doctor-settings"
              element={<DoctorSettings />}
            />


            <Route
              path="/doctor-prescriptions"
              element={<DoctorPrescriptions />}
            />


            <Route
              path="/doctor-notifications"
              element={<DoctorNotifications />}
            />





            {/* ================= ADMIN ================= */}



            <Route
              path="/admin-dashboard"
              element={<AdminDashboard />}
            />


            <Route
              path="/admin-users"
              element={<AdminUsers />}
            />


            <Route
              path="/admin-doctors"
              element={<AdminDoctors />}
            />


            <Route
              path="/admin/doctor-verification"
              element={<DoctorVerification />}
            />


            <Route
              path="/admin-alerts"
              element={<AdminAlerts />}
            />


            <Route
              path="/feedback"
              element={<AdminFeedback />}
            />


            <Route
              path="/admin-reports"
              element={<AdminReports />}
            />


            <Route
              path="/admin-settings"
              element={<AdminSettings />}
            />


            <Route
              path="/admin-systemstatus"
              element={<AdminSystemStatus />}
            />



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

      document.documentElement.classList.add(
        "dark"
      );

    } else {

      document.documentElement.classList.remove(
        "dark"
      );

    }

  }, [darkMode]);



  return (

    <BrowserRouter>

      <AppLayout
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

    </BrowserRouter>

  );

}



export default App;