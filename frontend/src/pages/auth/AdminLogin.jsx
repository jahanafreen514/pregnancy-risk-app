import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeartbeat,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUserMd,
  FaUserCog,
  FaUsers,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 800));

    // Admin credentials (hardcoded for demo)
    const adminEmail = "admin@glowcare.com";
    const adminPassword = "Admin@123";

    if (
      formData.email.toLowerCase() === adminEmail.toLowerCase() &&
      formData.password === adminPassword
    ) {
      const adminUser = {
        name: "Admin",
        email: formData.email,
        role: "admin",
      };
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      setSuccess(true);
       setTimeout(() => {
    navigate("/admin-dashboard", { replace: true });
  }, 800);

    } else {
      setError("Invalid admin credentials. Please try again.");
      setIsLoading(false);
    }
  };

  return (
   <div
 className="relative h-screen overflow-hidden bg-cover bg-center flex items-center justify-center px-4 sm:px-6"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-pink-300 blur-[140px] opacity-20 animate-pulse"></div>
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-pink-200 blur-[120px] opacity-10 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
  <div className="grid lg:grid-cols-2 gap-8 items-center min-h-screen py-6">
          {/* LEFT PANEL */}
          <div className="hidden lg:flex flex-col justify-center space-y-5 pr-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center shadow-xl">
                <FaHeartbeat className="text-white text-3xl animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-sky-400 bg-clip-text text-transparent">
                  Admin Portal
                </h1>
                <p className="text-sm text-gray-500">GlowCare Management</p>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-pink-100/50 shadow-lg">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <FaShieldAlt className="text-pink-500" />
                Admin Access
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaUsers className="text-pink-500 text-xs" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">User Management</span>
                    <p className="text-xs text-gray-500">Manage all users and patients</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaUserCog className="text-sky-500 text-xs" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Platform Control</span>
                    <p className="text-xs text-gray-500">Full administrative controls</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaShieldAlt className="text-purple-500 text-xs" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Security Oversight</span>
                    <p className="text-xs text-gray-500">Monitor platform security</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-gray-400 bg-white/50 backdrop-blur-sm rounded-2xl py-3 px-6 border border-pink-100/50">
              <span className="flex items-center gap-1.5">
                <FaShieldAlt className="text-pink-400" />
                Admin Only
              </span>
              <span className="w-px h-5 bg-gray-200"></span>
              <span className="flex items-center gap-1.5">
                <FaCheckCircle className="text-green-400" />
                Secure Access
              </span>
            </div>
          </div>

          {/* RIGHT PANEL - Admin Login Card */}
          <div className="flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-300 via-pink-200 to-sky-300 blur-2xl opacity-70 animate-pulse"></div>
<div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/70 shadow-2xl p-6 sm:p-7 hover:shadow-pink-300/20 transition-all duration-500">
                
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-pink-300 blur-2xl opacity-60 animate-pulse"></div>
                    <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-sky-400 flex items-center justify-center shadow-2xl animate-float">
                      <FaUserMd className="text-white text-2xl animate-pulse" />
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
                  Admin Login
                </h2>
                <p className="text-center text-gray-500 text-sm mt-1 mb-6">
                  Sign in to access admin dashboard
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-600">
                    <FaTimesCircle className="text-base flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2.5 text-green-600">
                    <FaCheckCircle className="text-base flex-shrink-0" />
                    <span className="text-sm font-medium">Login successful! Redirecting...</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Admin Email
                    </label>
                    <div className="relative group">
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        placeholder="admin@glowcare.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-pink-100 bg-white/90 pl-12 pr-4 py-3.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 hover:shadow-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative group">
                      <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-pink-100 bg-white/90 pl-12 pr-12 py-3.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 hover:shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Demo: admin@glowcare.com / Admin@123
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 py-3.5 text-base font-bold text-white shadow-lg hover:shadow-pink-300/50 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        Admin Sign In
                        <FaArrowRight />
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center my-5">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                  <span className="px-3 text-gray-400 font-medium text-[10px]">Secure Admin Access</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                <p className="text-center text-gray-600 text-sm">
                  <Link
                    to="/login"
                    className="font-bold text-pink-500 hover:text-pink-600 transition duration-300 inline-flex items-center gap-1 group"
                  >
                    User Login
                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <FaShieldAlt className="text-pink-400" />
                  <span>Restricted to authorized admins only</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;