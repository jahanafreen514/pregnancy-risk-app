// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   useLocation,
// } from "react-router-dom";
// import { AnimatePresence } from "framer-motion";
// import bg from "./assets/images/bg.png";

// // Layout
// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";

// // Pages
// import Splash from "./pages/publicPages/Splash";
// import Home from "./pages/publicPages/Home";
// import About from "./pages/publicPages/About";
// import Contact from "./pages/publicPages/Contact";

// // Auth
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import AdminLogin from "./pages/auth/AdminLogin";
// import DoctorRegister from "./pages/auth/DoctorRegister";

// // import AdminLayout from "./Layouts/AdminLayout";
// // User
// import Dashboard from "./pages/user/Dashboard";
// import PregnancyToolkit from "./pages/user/PregnancyToolkit";
// import Alerts from "./pages/user/Alerts";
// import Symptoms from "./pages/user/Symptoms";
// import Suggestions from "./pages/user/Suggestions";
// import Prediction from "./pages/user/Prediction";
// import Profile from "./pages/user/Profile";
// import EditProfile from "./pages/user/EditProfile";
// import Reports from "./pages/user/Reports";

// // Extra
// import Appointment from "./pages/extra/Appointment";
// import Doctors from "./pages/extra/Doctors";
// import Starting from "./pages/extra/Starting";

// // Admin
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";
// import AdminUsers from "./pages/admin/AdminUsers";
// import AdminAlerts from "./pages/admin/AdminAlerts";
// import AdminFeedback from "./pages/admin/AdminFeedback";
// // import PregnancyRecords from "./pages/admin/PregnancyRecords";
// import AdminReports from "./pages/admin/AdminReports";
// import AdminSettings from "./pages/admin/AdminSettings";
// import DoctorLogin from "./pages/auth/DoctorLogin";
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
// import DoctorPatients from "./pages/Doctor/DoctorPatients";
// import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
// import DoctorReports from "./pages/Doctor/DoctorReports";
// import DoctorProfile from "./pages/Doctor/DoctorProfile"; // Add this import statement
// import DoctorSettings from "./pages/Doctor/DoctorSettings"; // Add this import statement
// import DoctorPrescriptions from "./pages/Doctor/DoctorPrescriptions"; // Add this import statement
// import DoctorNotifications from "./pages/Doctor/DoctorNotifications";
// import AdminDoctors from "./pages/admin/AdminDoctors"; // Add this import statement
// import AdminSystemStatus from "./pages/admin/AdminSystemStatus"; // Add this import statement

// // Add this route


// import "./index.css";

// function AppLayout({ darkMode, setDarkMode }) {
//   const location = useLocation();

//   const showNavbarPages = [
//   "/home",
//   "/about",
//   "/contact",
// ];

// const showNavbar = showNavbarPages.includes(location.pathname);

//   return (
//     <>
//       {/* NAVBAR */}
//       {showNavbar && (
//   <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
// )}
//       {/* MAIN APP AREA */}
//       <div className="min-h-screen bg-white dark:bg-gray-900 transition-all">

//         <AnimatePresence mode="wait">
//           <Routes location={location} key={location.pathname}>

//             {/* Splash */}
//             <Route path="/" element={<Splash />} />

//             {/* Auth */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />

//             {/* Public Pages */}
//             <Route path="/home" element={<Home />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />

//             <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/toolkit"element={<PregnancyToolkit />}/>
//             <Route path="/alerts" element={<Alerts />} />
//             <Route path="/symptoms" element={<Symptoms />} />
//             <Route path="/suggestions" element={<Suggestions />} />
//             <Route path="/prediction" element={<Prediction />} />
//             <Route path="/reports" element={<Reports />} />

//             <Route path="/profile" element={<Profile />} />
//             <Route path="/profile/edit" element={<EditProfile />} />
// <Route path="/starting" element={<Starting />} />

// <Route path="/doctor-register" element={<DoctorRegister />} />
// <Route path="/doctor-login" element={<DoctorLogin />} />
// <Route path="/forgot-password" element={<ForgotPassword />} />

// <Route
//    path="/admin-login"
//    element={<AdminLogin />}
// />
// <Route
//   path="/admin-dashboard"
//   element={
//     <AdminProtectedRoute>
//       <AdminDashboard />
//     </AdminProtectedRoute>
//   }
// />
// {/* <Route path="/doctor-login" element={<DoctorLogin />} />
// <Route path="/doctor-dashboard" element={<DoctorDashboard />} /> */}
// <Route path="/admin-users" element={<AdminUsers />} />

//  {/* <Route 
//   path="/pregnancy-records" 
//   element={<PregnancyRecords />} 
// /> */}

// <Route 
//   path="/admin-alerts" 
//   element={<AdminAlerts />} 
// />
// <Route 
//   path="/feedback" 
//  element={<AdminFeedback/>}
//  />


// <Route 
//   path="/admin-reports" 
//   element={<AdminReports />} 
// />

// <Route 
//   path="/admin-settings" 
//   element={<AdminSettings />} 
// /> 
// <Route path="/admin-doctors" element={<AdminDoctors />} />
// <Route path="/admin-system-status" element={<AdminSystemStatus />} />

//             {/* Extra */}
//             <Route path="/appointment" element={<Appointment />} />
//             <Route path="/doctors" element={<Doctors />} />
//             <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            

// <Route
//  path="/doctor-patients"
//  element={<DoctorPatients />}
// />


// <Route
//  path="/doctor-appointments"
//  element={<DoctorAppointments />}
// />


// <Route
//  path="/doctor-reports"
//  element={<DoctorReports />}
// />


// <Route
//  path="/doctor-profile"
//  element={<DoctorProfile />}
// />
// <Route
//   path="/doctor-settings"
//   element={<DoctorSettings />}
//   />
//   <Route
//   path="/doctor-prescriptions"
//   element={<DoctorPrescriptions />}
//   />
//   <Route
//   path="/doctor-notifications"
//   element={<DoctorNotifications />}
//   />


//           </Routes>
//         </AnimatePresence>

//       </div>
//     </>
//   );
// }

// function App() {
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [darkMode]);

//   return (
//     <BrowserRouter>
//       <AppLayout darkMode={darkMode} setDarkMode={setDarkMode} />
//     </BrowserRouter>
//   );
// }

// export default App;

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
import DoctorRegister from "./pages/auth/DoctorRegister";

// User
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
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAlerts from "./pages/admin/AdminAlerts";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminSystemStatus from "./pages/admin/AdminSystemStatus";
// import AdminOverview from "./pages/admin/AdminOverview";
// import AdminAppointments from "./pages/admin/AdminAppointments";
// import AdminNotifications from "./pages/admin/AdminNotifications";

// Doctor
import DoctorLogin from "./pages/auth/DoctorLogin";
import ForgotPassword from "./pages/auth/ForgotPassword";
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

  const showNavbar = showNavbarPages.includes(location.pathname);
  
  // Check if we're in admin section
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {showNavbar && !isAdminRoute && (
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      )}

      <div className="min-h-screen bg-white dark:bg-gray-900 transition-all">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Splash */}
            <Route path="/" element={<Splash />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/doctor-register" element={<DoctorRegister />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Public Pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* User Pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/toolkit" element={<PregnancyToolkit />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/symptoms" element={<Symptoms />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/starting" element={<Starting />} />

            {/* Extra */}
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/doctors" element={<Doctors />} />

            {/* Doctor Routes */}
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-patients" element={<DoctorPatients />} />
            <Route path="/doctor-appointments" element={<DoctorAppointments />} />
            <Route path="/doctor-reports" element={<DoctorReports />} />
            <Route path="/doctor-profile" element={<DoctorProfile />} />
            <Route path="/doctor-settings" element={<DoctorSettings />} />
            <Route path="/doctor-prescriptions" element={<DoctorPrescriptions />} />
            <Route path="/doctor-notifications" element={<DoctorNotifications />} />

            {/* ADMIN ROUTES - Nested route with * */}
            <Route 
              path="/admin-dashboard/*" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            {/* <Route path="/admin-overview" element={<AdminOverview />} /> */}

            {/* Fallback admin routes (for backward compatibility) */}
            <Route 
              path="/admin-users" 
              element={
                <AdminProtectedRoute>
                  <AdminUsers />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin-doctors" 
              element={
                <AdminProtectedRoute>
                  <AdminDoctors />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin-reports" 
              element={
                <AdminProtectedRoute>
                  <AdminReports />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/feedback" 
              element={
                <AdminProtectedRoute>
                  <AdminFeedback />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin-systemstatus" 
              element={
                <AdminProtectedRoute>
                  <AdminSystemStatus />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin-settings" 
              element={
                <AdminProtectedRoute>
                  <AdminSettings />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin-alerts" 
              element={
                <AdminProtectedRoute>
                  <AdminAlerts />
                </AdminProtectedRoute>
              } 
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