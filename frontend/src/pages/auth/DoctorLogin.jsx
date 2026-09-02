import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveToken } from "../../services/authService";
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
  FaStethoscope,
  FaHospital,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";
import { apiUrl } from "../../config/runtime";

const DoctorLogin = () => {
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

  try {
    const response = await fetch(
      apiUrl("/auth/doctor-login"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: formData.email,
          password: formData.password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Invalid credentials");
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        ...data.user,
        role: "doctor",
        token: data.access_token,
      })
    );
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    saveToken(
  data.access_token,
  data.refresh_token
);

    setSuccess(true);

    setTimeout(() => {
      navigate("/doctor-dashboard");
    }, 800);

  } catch (err) {
    setError(err.message);
  } finally {
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
        <div className="grid lg:grid-cols-2 gap-8 items-stretch min-h-[80vh]">
          {/* LEFT PANEL */}
          <div className="hidden lg:flex flex-col justify-between space-y-4 h-full">
            <div className="flex items-center gap-4 flexa-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center shadow-xl">
                <FaHeartbeat className="text-white text-3xl animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-sky-400 bg-clip-text text-transparent">
                  Doctor Portal
                </h1>
                <p className="text-sm text-gray-500">GlowCare Management</p>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-pink-100/50 shadow-lg flex-1 flex flex-col justify-center">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <FaStethoscope className="text-pink-500" />
                Doctor Access
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaUsers className="text-pink-500 text-sm" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Patient Management</span>
                    <p className="text-xs text-gray-500 mt-0.5">View and manage all patient records</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaCalendarAlt className="text-sky-500 text-sm" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Appointment Management</span>
                    <p className="text-xs text-gray-500 mt-0.5">Schedule and manage patient appointments</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaChartLine className="text-purple-500 text-sm" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Health Monitoring</span>
                    <p className="text-xs text-gray-500 mt-0.5">Track patient health and pregnancy progress</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaHospital className="text-green-500 text-sm" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Medical Reports</span>
                    <p className="text-xs text-gray-500 mt-0.5">View AI-powered pregnancy risk reports</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-gray-400 bg-white/50 backdrop-blur-sm rounded-2xl py-3 px-6 border border-pink-100/50 flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <FaShieldAlt className="text-pink-400" />
                Doctor Only
              </span>
              <span className="w-px h-5 bg-gray-200"></span>
              <span className="flex items-center gap-1.5">
                <FaCheckCircle className="text-green-400" />
                Secure Access
              </span>
              <span className="w-px h-5 bg-gray-200"></span>
              <span className="flex items-center gap-1.5">
                <FaUserMd className="text-purple-400" />
                Medical Professional
              </span>
            </div>
          </div>

          {/* RIGHT PANEL - Doctor Login Card */}
          <div className="flex justify-center lg:justify-end items-stretch">
            <div className="relative w-full max-w-md flex items-center">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-300 via-pink-200 to-sky-300 blur-2xl opacity-70 animate-pulse"></div>
              <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/70 shadow-2xl p-8 hover:shadow-pink-300/20 transition-all duration-500 w-full">
                
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-pink-300 blur-2xl opacity-60 animate-pulse"></div>
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-sky-400 flex items-center justify-center shadow-2xl animate-float">
                      <FaUserMd className="text-white text-2xl animate-pulse" />
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
                  Doctor Login
                </h2>
                <p className="text-center text-gray-500 text-sm mt-1 mb-5">
                  Sign in to access doctor dashboard
                </p>

                {error && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-600">
                    <FaTimesCircle className="text-base flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2.5 text-green-600">
                    <FaCheckCircle className="text-base flex-shrink-0" />
                    <span className="text-sm font-medium">Login successful! Redirecting...</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Doctor Email
                    </label>
                    <div className="relative group">
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        placeholder="doctor@glowcare.com"
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
                    <div className="text-right mt-1">
                      <Link
                        to="/forgot-password"
                        className="text-sm text-pink-500 hover:text-pink-600 font-medium transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Demo: doctor@glowcare.com / Doctor@123
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
                        Doctor Sign In
                        <FaArrowRight />
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                  <span className="px-3 text-gray-400 font-medium text-[10px]">Secure Doctor Access</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-center text-gray-600 text-sm">
                    <Link
                      to="/login"
                      className="font-bold text-pink-500 hover:text-pink-600 transition duration-300 inline-flex items-center gap-1 group"
                    >
                      User Login
                      <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <span className="mx-2 text-gray-300">|</span>
                    <Link
                      to="/admin-login"
                      className="font-bold text-sky-500 hover:text-sky-600 transition duration-300 inline-flex items-center gap-1 group"
                    >
                      Admin Login
                      <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </p>
                  <p className="text-xs text-gray-400">
                    Don't have a doctor account?{" "}
                    <Link
                      to="/doctor-register"
                      className="font-medium text-pink-500 hover:text-pink-600 transition-colors"
                    >
                      Register as Doctor
                    </Link>
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <FaShieldAlt className="text-pink-400" />
                  <span>Restricted to authorized doctors only</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
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

export default DoctorLogin;
