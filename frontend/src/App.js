import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import DoctorSidebar from "./components/DoctorSidebar";


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
import VerifyEmail from "./pages/auth/VerifyEmail";


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
import Reminders from "./pages/user/Reminders";
import Prescriptions from "./pages/user/Prescriptions";
import UserSettings from "./pages/user/UserSettings";


// Extra
import Appointment from "./pages/extra/Appointment";
import Doctors from "./pages/extra/Doctors";
import Starting from "./pages/extra/Starting";
import OnlineCall from "./pages/extra/OnlineCall";
import Feedback from "./pages/shared/Feedback";


// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAlerts from "./pages/admin/AdminAlerts";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminSystemStatus from "./pages/admin/AdminSystemStatus";


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

function RoleRoute({ roles, children }) {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (!user || !localStorage.getItem("token")) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    const destination = user.role === "admin" ? "/admin-dashboard" : user.role === "doctor" ? "/doctor-dashboard" : "/dashboard";
    return <Navigate to={destination} replace />;
  }
  return children;
}

function AppLayout({ darkMode, setDarkMode }) {

  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const showDoctorMobileNav = currentUser?.role === "doctor" && location.pathname.startsWith("/doctor-");


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

      {showDoctorMobileNav && <DoctorSidebar />}


      <div className={`min-h-screen bg-white dark:bg-gray-900 transition-all ${showDoctorMobileNav ? "doctor-shell" : ""}`}>


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
            <Route path="/verify-email" element={<VerifyEmail />} />





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
              element={<RoleRoute roles={["user", "patient"]}><Dashboard /></RoleRoute>}
            />


            <Route
              path="/toolkit"
              element={<RoleRoute roles={["user", "patient"]}><PregnancyToolkit /></RoleRoute>}
            />


            <Route
              path="/alerts"
              element={<RoleRoute roles={["user", "patient"]}><Alerts /></RoleRoute>}
            />


            <Route
              path="/symptoms"
              element={<RoleRoute roles={["user", "patient"]}><Symptoms /></RoleRoute>}
            />


            <Route
              path="/suggestions"
              element={<RoleRoute roles={["user", "patient"]}><Suggestions /></RoleRoute>}
            />


            <Route
              path="/prediction"
              element={<RoleRoute roles={["user", "patient"]}><Prediction /></RoleRoute>}
            />


            <Route
              path="/reports"
              element={<RoleRoute roles={["user", "patient"]}><Reports /></RoleRoute>}
            />
            <Route path="/reminders" element={<RoleRoute roles={["user", "patient"]}><Reminders /></RoleRoute>} />
            <Route path="/prescriptions" element={<RoleRoute roles={["user", "patient"]}><Prescriptions /></RoleRoute>} />
            <Route path="/settings" element={<RoleRoute roles={["user", "patient"]}><UserSettings /></RoleRoute>} />


            <Route
              path="/profile"
              element={<RoleRoute roles={["user", "patient", "doctor", "admin"]}><Profile /></RoleRoute>}
            />


            <Route
              path="/profile/edit"
              element={<RoleRoute roles={["user", "patient"]}><EditProfile /></RoleRoute>}
            />


            <Route
              path="/starting"
              element={<Starting />}
            />





            {/* ================= EXTRA ================= */}


            <Route
              path="/appointment"
              element={<RoleRoute roles={["user", "patient"]}><Appointment /></RoleRoute>}
            />


            <Route
              path="/doctors"
              element={<Doctors />}
            />
            <Route path="/call/:appointmentId" element={<RoleRoute roles={["user", "patient", "doctor"]}><OnlineCall /></RoleRoute>} />
            <Route path="/share-feedback" element={<RoleRoute roles={["user", "patient", "doctor"]}><Feedback /></RoleRoute>} />





            {/* ================= DOCTOR ================= */}



            <Route
              path="/doctor-dashboard"
              element={<RoleRoute roles={["doctor"]}><DoctorDashboard /></RoleRoute>}
            />


            <Route
              path="/doctor-patients"
              element={<RoleRoute roles={["doctor"]}><DoctorPatients /></RoleRoute>}
            />


            <Route
              path="/doctor-appointments"
              element={<RoleRoute roles={["doctor"]}><DoctorAppointments /></RoleRoute>}
            />


            <Route
              path="/doctor-reports"
              element={<RoleRoute roles={["doctor"]}><DoctorReports /></RoleRoute>}
            />


            <Route
              path="/doctor-profile"
              element={<RoleRoute roles={["doctor"]}><DoctorProfile /></RoleRoute>}
            />


            <Route
              path="/doctor-settings"
              element={<RoleRoute roles={["doctor"]}><DoctorSettings /></RoleRoute>}
            />


            <Route
              path="/doctor-prescriptions"
              element={<RoleRoute roles={["doctor"]}><DoctorPrescriptions /></RoleRoute>}
            />


            <Route
              path="/doctor-notifications"
              element={<RoleRoute roles={["doctor"]}><DoctorNotifications /></RoleRoute>}
            />





            {/* ================= ADMIN ================= */}



            <Route
              path="/admin-dashboard"
              element={<RoleRoute roles={["admin"]}><AdminDashboard /></RoleRoute>}
            />


            <Route
              path="/admin-users"
              element={<RoleRoute roles={["admin"]}><AdminUsers /></RoleRoute>}
            />


            <Route
              path="/admin-doctors"
              element={<RoleRoute roles={["admin"]}><AdminDoctors /></RoleRoute>}
            />


            <Route
              path="/admin/doctor-verification"
              element={<RoleRoute roles={["admin"]}><Navigate to="/admin-doctors" replace /></RoleRoute>}
            />


            <Route
              path="/admin-alerts"
              element={<RoleRoute roles={["admin"]}><AdminAlerts /></RoleRoute>}
            />


            <Route
              path="/feedback"
              element={<RoleRoute roles={["admin"]}><AdminFeedback /></RoleRoute>}
            />


            <Route
              path="/admin-reports"
              element={<RoleRoute roles={["admin"]}><AdminReports /></RoleRoute>}
            />


            <Route
              path="/admin-settings"
              element={<RoleRoute roles={["admin"]}><AdminSettings /></RoleRoute>}
            />


            <Route
              path="/admin-systemstatus"
              element={<RoleRoute roles={["admin"]}><AdminSystemStatus /></RoleRoute>}
            />



          </Routes>


        </AnimatePresence>


      </div>


    </>
  );
}
function App() {

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );



  useEffect(() => {

    if (darkMode) {

      document.documentElement.classList.add(
        "dark"
      );
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");

    } else {

      document.documentElement.classList.remove(
        "dark"
      );
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");

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
