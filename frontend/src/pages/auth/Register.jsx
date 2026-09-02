import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeartbeat,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUserPlus,
  FaBaby,
  FaStethoscope,
  FaChartLine,
  FaUsers,
  FaRobot,
  FaHeart,
  FaBell,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";
import CountryCodeSelector from "../../components/CountryCodeSelector";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    password: "",
    confirmPassword: "",
    selectedDoctor:""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  setIsLoading(true);
  setError("");

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "user",
          countryCode: formData.countryCode,
          phone: formData.phone,
          selectedDoctor: formData.selectedDoctor
        }),
      }
    );


    const data = await response.json();


    if (!response.ok) {
      throw new Error(
        typeof data.detail === "string"
          ? data.detail
          : JSON.stringify(data.detail)
      );
    }


    console.log("REGISTER RESPONSE:", data);


    // Keep token keys consistent with the authenticated API interceptor.
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);


    localStorage.setItem(
      "currentUser",
      JSON.stringify(data.user)
    );


    setSuccess(true);


    setTimeout(() => {
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    }, 1000);


  } catch(error) {

    console.error(error);
    setError(error.message);

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
          {/* LEFT PANEL - EXACTLY LIKE LOGIN PAGE */}
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
          

          {/* RIGHT PANEL - Register Card (Same structure as Login) */}
          <div className="flex justify-center lg:justify-end items-stretch">
            <div className="relative w-full max-w-md flex items-center">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-300 via-pink-200 to-sky-300 blur-xl opacity-60 animate-pulse"></div>
              <div className="relative bg-white/80 backdrop-blur-2xl rounded-2xl border border-white/70 shadow-2xl p-6 hover:shadow-pink-300/20 transition-all duration-500 w-full">
                
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-pink-300 blur-2xl opacity-60 animate-pulse"></div>
                    <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-sky-400 flex items-center justify-center shadow-2xl animate-float">
                      <FaHeartbeat className="text-white text-xl animate-pulse" />
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
                  Create Account
                </h2>
                <p className="text-center text-gray-500 text-xs mt-1 mb-4">
                  Join us to start your health journey
                </p>

                {error && (
                  <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
                    <FaTimesCircle className="text-sm flex-shrink-0" />
                    <span className="text-xs font-medium">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-3 p-2.5 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-600">
                    <FaCheckCircle className="text-sm flex-shrink-0" />
                    <span className="text-xs font-medium">Registration successful! Redirecting...</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative group">
                      <FaUser className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors text-sm" />
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-pink-100 bg-white/90 pl-10 pr-3.5 py-2.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 hover:shadow-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative group">
                      <FaEnvelope className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors text-sm" />
                      <input
                        type="email"
                        name="email"
                        placeholder="gayatri@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-pink-100 bg-white/90 pl-10 pr-3.5 py-2.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 hover:shadow-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="flex gap-1.5">
                      <div className="w-28 flex-shrink-0">
                        <CountryCodeSelector
                          value={formData.countryCode}
                          onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        />
                      </div>
                      <div className="flex-1 relative group">
                        <FaPhone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors text-sm" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-pink-100 bg-white/90 pl-10 pr-3.5 py-2.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 hover:shadow-md"
                        />
                      </div>
                    </div>
                  </div>
                  <select

name="selectedDoctor"

value={formData.selectedDoctor}

onChange={handleChange}

className="w-full border rounded-xl p-3"

>

<option value="">
Select Checkup Doctor
</option>


<option value="doctor@gmail.com">
Dr. John - Gynecologist
</option>


<option value="doctor2@gmail.com">
Dr. Priya - Pregnancy Specialist
</option>


</select>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <div className="relative group">
                        <FaLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors text-sm" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Create password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-pink-100 bg-white/90 pl-10 pr-10 py-2.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 hover:shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                        >
                          {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Confirm *
                      </label>
                      <div className="relative group">
                        <FaLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors text-sm" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-pink-100 bg-white/90 pl-10 pr-10 py-2.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 hover:shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                        >
                          {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  {formData.password && (
                    <div className="mt-1 space-y-0.5 bg-white/50 backdrop-blur-sm rounded-xl p-2.5">
                      <p className="text-[10px] font-medium text-gray-600">Password must contain:</p>
                      <div className="grid grid-cols-2 gap-0.5">
                        <Requirement met={passwordErrors.length} text="8+ characters" />
                        <Requirement met={passwordErrors.uppercase} text="Uppercase" />
                        <Requirement met={passwordErrors.lowercase} text="Lowercase" />
                        <Requirement met={passwordErrors.number} text="Number" />
                        <Requirement met={passwordErrors.special} text="Special" />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-pink-300/50 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin text-sm">⏳</span>
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Account
                        <FaUserPlus className="text-sm" />
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center my-3.5">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                  <span className="px-2.5 text-gray-400 font-medium text-[10px]">Secure</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                <p className="text-center text-gray-600 text-xs">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-pink-500 hover:text-pink-600 transition duration-300 inline-flex items-center gap-1 group"
                  >
                    Sign In
                    <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>

                <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                  <FaShieldAlt className="text-pink-400 text-xs" />
                  <span>Your data is encrypted and secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
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
  <div className="flex items-center gap-1.5 text-[10px]">
    {met ? (
      <FaCheckCircle className="text-green-500 text-[10px]" />
    ) : (
      <FaTimesCircle className="text-gray-300 text-[10px]" />
    )}
    <span className={met ? "text-green-600" : "text-gray-400"}>
      {text}
    </span>
  </div>
);

export default Register;
