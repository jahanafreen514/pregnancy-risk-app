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
  FaUserPlus,
  FaRobot,
  FaHeart,
  FaBell,
  FaUsers,
  FaBaby,
  FaStethoscope,
  FaChartLine,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      setPasswordErrors({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isPasswordValid = Object.values(passwordErrors).every(Boolean);
    if (formData.password && !isPasswordValid) {
      setError("Please meet all password requirements");
      return;
    }

    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === formData.email.toLowerCase() &&
        u.password === formData.password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } else {
      setError("Invalid email or password");
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
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* Floating Blobs */}
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
  <div className="grid lg:grid-cols-2 gap-8 items-center h-full">
          {/* LEFT PANEL - Context */}
          <div className="hidden lg:flex flex-col justify-center space-y-4 pr-4">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center shadow-xl">
                <FaHeartbeat className="text-white text-2xl animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-sky-400 bg-clip-text text-transparent">
                  GlowCare
                </h1>
                <p className="text-sm text-gray-500">Maternal Health Platform</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed">
              Predict pregnancy risks, track symptoms, manage medications,
              monitor fetal wellbeing and assist mothers throughout pregnancy
              with our intelligent ML-powered platform.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-pink-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center mx-auto mb-2">
                  <FaRobot className="text-pink-500 text-xl" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800">Risk Prediction</h4>
                <p className="text-xs text-gray-500 mt-1">ML-powered analysis</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-pink-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center mx-auto mb-2">
                  <FaHeart className="text-sky-500 text-xl" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800">Health Monitoring</h4>
                <p className="text-xs text-gray-500 mt-1">Real-time tracking</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-pink-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mx-auto mb-2">
                  <FaBell className="text-red-500 text-xl" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800">Emergency Alerts</h4>
                <p className="text-xs text-gray-500 mt-1">Instant notifications</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 text-xs text-gray-400 bg-white/50 backdrop-blur-sm rounded-2xl py-3 px-6 border border-pink-100/50">
              <span className="flex items-center gap-1.5">
                <FaShieldAlt className="text-pink-400" />
                HIPAA Compliant
              </span>
              <span className="w-px h-5 bg-gray-200"></span>
              <span className="flex items-center gap-1.5">
                <FaCheckCircle className="text-green-400" />
                Encrypted Data
              </span>
              <span className="w-px h-5 bg-gray-200"></span>
              <span className="flex items-center gap-1.5">
                <FaUsers className="text-pink-400" />
                Trusted Platform
              </span>
            </div>

            {/* Explanation Cards */}
            <div className="space-y-3">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-pink-100/50 hover:shadow-md hover:translate-x-1 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaBaby className="text-pink-500 text-sm" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">Track Baby's Growth</h4>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                      Monitor fetal development and track important milestones throughout your pregnancy journey.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 border-pink-100/50 hover:shadow-md hover:translate-x-1 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaStethoscope className="text-sky-500 text-sm" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">Symptom Tracking</h4>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                      Log and monitor pregnancy symptoms to identify patterns and share with your healthcare provider.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-pink-100/50 hover:shadow-md hover:translate-x-1 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaChartLine className="text-purple-500 text-sm" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">ML-Powered Insights</h4>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                      Get intelligent predictions and personalized recommendations based on your health data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Login Card */}
          <div className="flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-md">
              {/* Animated Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-300 via-pink-200 to-sky-300 blur-2xl opacity-70 animate-pulse"></div>

              {/* Glass Card */}
<div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/70 shadow-2xl p-6 hover:shadow-pink-300/20 transition-all duration-500">                
                {/* Logo */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-pink-300 blur-2xl opacity-60 animate-pulse"></div>
                    <div className="relative w-16 h-16  rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-sky-400 flex items-center justify-center shadow-2xl animate-float">
                      <FaHeartbeat className="text-white text-2xl animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Heading */}
                <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-center text-gray-500 text-sm mt-2 mb-6">
                  Sign in to continue your maternal health journey
                </p>

                {/* Error/Success Messages */}
                {error && (
                  <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600">
                    <FaTimesCircle className="text-lg flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3.5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-600">
                    <FaCheckCircle className="text-lg flex-shrink-0" />
                    <span className="text-sm font-medium">Login successful! Redirecting...</span>
                  </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative group">
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-pink-100 bg-white/90 pl-12 pr-4 py-3.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 hover:shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Password */}
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

                    {/* Password Requirements */}
                    {formData.password && (
                      <div className="mt-2.5 space-y-1 bg-white/50 backdrop-blur-sm rounded-xl p-3">
                        <p className="text-xs font-medium text-gray-600 mb-1.5">Password must contain:</p>
                        <Requirement met={passwordErrors.length} text="8+ characters" />
                        <Requirement met={passwordErrors.uppercase} text="Uppercase letter" />
                        <Requirement met={passwordErrors.lowercase} text="Lowercase letter" />
                        <Requirement met={passwordErrors.number} text="Number" />
                        <Requirement met={passwordErrors.special} text="Special character" />
                      </div>
                    )}
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 rounded border-pink-300 text-pink-500 focus:ring-pink-400" />
                      <span className="text-xs text-gray-500">Remember me</span>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-pink-500 hover:text-pink-600 font-medium transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
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
                        Sign In
                        <FaArrowRight />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                  <span className="px-4 text-gray-400 font-medium text-xs">Secure Login</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                {/* Register Link */}
                <p className="text-center text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-pink-500 hover:text-pink-600 transition duration-300 inline-flex items-center gap-1 group"
                  >
                    Create Account
                    <FaUserPlus className="text-xs group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>

                {/* Security Badge */}
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <FaShieldAlt className="text-pink-400" />
                  <span>Your data is encrypted and secure</span>
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

// Password Requirement Component
const Requirement = ({ met, text }) => (
  <div className="flex items-center gap-2 text-xs">
    {met ? (
      <FaCheckCircle className="text-green-500 text-sm" />
    ) : (
      <FaTimesCircle className="text-gray-300 text-sm" />
    )}
    <span className={met ? "text-green-600" : "text-gray-400"}>
      {text}
    </span>
  </div>
);

export default Login;