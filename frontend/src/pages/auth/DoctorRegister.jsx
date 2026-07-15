import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeartbeat,
  FaUserMd,
  FaStethoscope,
  FaHospital,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaShieldAlt,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaBriefcaseMedical,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";
import CountryCodeSelector from "../../components/CountryCodeSelector";

const DoctorRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    hospital: "",
    specialization: "",
    experience: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Hospital list for dropdown
  const hospitals = [
    "Apollo Hospitals",
    "Fortis Healthcare",
    "Max Healthcare",
    "Medanta - The Medicity",
    "AIIMS",
    "Sir Ganga Ram Hospital",
    "Kokilaben Dhirubhai Ambani Hospital",
    "Narayana Health",
    "Manipal Hospitals",
    "Columbia Asia Hospital",
    "KIMS Hospital",
    "Yashoda Hospitals",
    "Gleneagles Global Hospitals",
    "Artemis Hospital",
    "BLK Super Speciality Hospital",
    "Cloudnine Hospital",
    "Fernandez Hospital",
    "Motherhood Hospital",
    "Sahyadri Hospitals",
    "Apollo Cradle",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];

    const exists = doctors.find(
      (doctor) => doctor.email.toLowerCase() === formData.email.toLowerCase()
    );

    if (exists) {
      setError("Doctor account already exists");
      return;
    }

    const newDoctor = {
      id: Date.now(),
      fullName: formData.fullName,
      email: formData.email,
      countryCode: formData.countryCode,
      phone: formData.phone,
      hospital: formData.hospital,
      specialization: formData.specialization,
      experience: formData.experience,
      password: formData.password,
      role: "doctor",
      verified: false,
      createdAt: new Date().toISOString(),
    };

    doctors.push(newDoctor);
    localStorage.setItem("doctors", JSON.stringify(doctors));

    setSuccess(true);
    setTimeout(() => {
      navigate("/doctor-login");
    }, 1000);
  };

  return (
    <div
      className="relative h-screen overflow-hidden bg-cover bg-center flex items-center justify-center px-4 sm:px-6"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* Glow Background */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-pink-300 blur-[140px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20 animate-pulse"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch min-h-[80vh]">
          {/* LEFT PANEL */}
          <div className="hidden lg:flex flex-col justify-between space-y-4 h-full">
            <div className="flex items-center gap-4 flex-shrink-0">
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
                Doctor Registration
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                    <FaUsers className="text-pink-500 text-sm" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Patient Management</span>
                    <p className="text-xs text-gray-500">Manage maternal patient records</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                    <FaCalendarAlt className="text-sky-500 text-sm" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Appointment Management</span>
                    <p className="text-xs text-gray-500">Schedule doctor appointments</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <FaChartLine className="text-purple-500 text-sm" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">AI Health Monitoring</span>
                    <p className="text-xs text-gray-500">Monitor pregnancy health insights</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <FaHospital className="text-green-500 text-sm" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Medical Reports</span>
                    <p className="text-xs text-gray-500">Access AI pregnancy reports</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-gray-400 bg-white/50 backdrop-blur-sm rounded-2xl py-3 px-6 border border-pink-100/50">
              <span className="flex items-center gap-1.5">
                <FaShieldAlt className="text-pink-400" />
                Secure
              </span>
              <span className="w-px h-5 bg-gray-200"></span>
              <span className="flex items-center gap-1.5">
                <FaCheckCircle className="text-green-400" />
                Verified
              </span>
              <span className="w-px h-5 bg-gray-200"></span>
              <span className="flex items-center gap-1.5">
                <FaUserMd className="text-purple-400" />
                Doctor
              </span>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex justify-center lg:justify-end items-stretch">
            <div className="relative w-full max-w-md flex items-center">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-300 via-pink-200 to-sky-300 blur-2xl opacity-70"></div>
              <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/70 shadow-2xl p-8 w-full">
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-sky-400 flex items-center justify-center shadow-xl">
                    <FaUserMd className="text-white text-2xl" />
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
                  Doctor Registration
                </h2>
                <p className="text-center text-gray-500 text-sm mt-1 mb-5">
                  Create your doctor account
                </p>

                {error && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-2xl text-green-600 text-sm font-medium">
                    Registration successful! Redirecting...
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Row 1 - Full Name & Email */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Full Name *</label>
                      <div className="relative mt-1">
                        <FaUser className="absolute left-3 top-3 text-gray-400 text-sm" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Dr. John Doe"
                          required
                          className="w-full rounded-xl border border-pink-100 bg-white/90 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-pink-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Email *</label>
                      <div className="relative mt-1">
                        <FaEnvelope className="absolute left-3 top-3 text-gray-400 text-sm" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="doctor@email.com"
                          required
                          className="w-full rounded-xl border border-pink-100 bg-white/90 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-sky-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2 - Country Code & Phone */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Phone *</label>
                      <div className="flex gap-2 mt-1">
                        <div className="w-28 flex-shrink-0">
                          <CountryCodeSelector
                            value={formData.countryCode}
                            onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                          />
                        </div>
                        <div className="flex-1 relative">
                          <FaPhone className="absolute left-3 top-3 text-gray-400 text-sm" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone number"
                            required
                            className="w-full rounded-xl border border-pink-100 bg-white/90 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-pink-100"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Hospital *</label>
                      <div className="relative mt-1">
                        <FaHospital className="absolute left-3 top-3 text-gray-400 text-sm" />
                        <select
                          name="hospital"
                          value={formData.hospital}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-pink-100 bg-white/90 pl-9 pr-2 py-2.5 text-sm outline-none focus:ring-4 focus:ring-sky-100"
                        >
                          <option value="">Select Hospital</option>
                          {hospitals.map((hospital, index) => (
                            <option key={index} value={hospital}>
                              {hospital}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row 3 - Specialization & Experience */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Specialization *</label>
                      <div className="relative mt-1">
                        <FaBriefcaseMedical className="absolute left-3 top-3 text-gray-400 text-sm" />
                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-pink-100 bg-white/90 pl-9 pr-2 py-2.5 text-sm outline-none focus:ring-4 focus:ring-sky-100"
                        >
                          <option value="">Select Specialization</option>
                          <option value="Gynecologist">Gynecologist</option>
                          <option value="Obstetrician">Obstetrician</option>
                          <option value="Maternal-Fetal Medicine">Maternal-Fetal Medicine</option>
                          <option value="Reproductive Endocrinology">Reproductive Endocrinology</option>
                          <option value="Family Medicine">Family Medicine</option>
                          <option value="General Practitioner">General Practitioner</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Experience (Years) *</label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Years"
                        required
                        className="w-full mt-1 rounded-xl border border-pink-100 bg-white/90 px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-sky-100"
                      />
                    </div>
                  </div>

                  {/* Row 4 - Password & Confirm Password */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Password *</label>
                      <div className="relative mt-1">
                        <FaLock className="absolute left-3 top-3 text-gray-400 text-sm" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Password"
                          required
                          className="w-full rounded-xl border border-pink-100 bg-white/90 pl-9 pr-9 py-2.5 text-sm outline-none focus:ring-4 focus:ring-pink-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Confirm Password *</label>
                      <div className="relative mt-1">
                        <FaLock className="absolute left-3 top-3 text-gray-400 text-sm" />
                        <input
                          type={showConfirm ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm"
                          required
                          className="w-full rounded-xl border border-pink-100 bg-white/90 pl-9 pr-9 py-2.5 text-sm outline-none focus:ring-4 focus:ring-sky-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-3 text-gray-400"
                        >
                          {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 py-3 text-base font-bold text-white shadow-lg hover:shadow-pink-300/50 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 mt-3"
                  >
                    Create Doctor Account
                    <FaArrowRight />
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                  <span className="px-3 text-gray-400 font-medium text-[10px]">Secure Doctor Registration</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                {/* Links */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Already have a doctor account?{" "}
                    <Link
                      to="/doctor-login"
                      className="font-bold text-pink-500 hover:text-pink-600 transition-colors inline-flex items-center gap-1"
                    >
                      Login
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </p>
                  <p className="text-xs text-gray-400">
                    Need another account?{" "}
                    <Link to="/register" className="font-medium text-sky-500 hover:text-sky-600">
                      User Register
                    </Link>
                  </p>
                </div>

                {/* Security */}
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <FaShieldAlt className="text-pink-400" />
                  <span>Authorized medical professionals only</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DoctorRegister;