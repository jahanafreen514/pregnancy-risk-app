import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTint,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaCheckCircle,
  FaSpinner,
  FaUserCircle,
  FaBaby,
  FaHeartbeat,
  FaVenusMars,
  FaClipboardList,
  FaChartLine,
  FaBell,
  FaStethoscope,
  FaEdit,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const EditProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    dueDate: "",
    address: "",
    weight: "",
    height: "",
  });

  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load user data from localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        bloodGroup: currentUser.bloodGroup || "O+",
        dueDate: currentUser.dueDate || "",
        address: currentUser.address || "",
        weight: currentUser.weight || "",
        height: currentUser.height || "",
      });
      setOriginalData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        bloodGroup: currentUser.bloodGroup || "O+",
        dueDate: currentUser.dueDate || "",
        address: currentUser.address || "",
        weight: currentUser.weight || "",
        height: currentUser.height || "",
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s+()-]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Invalid phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update user in localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const updatedUser = {
      ...currentUser,
      ...formData,
    };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Update users array if exists
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.email === currentUser.email);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...formData };
      localStorage.setItem("users", JSON.stringify(users));
    }

    setIsLoading(false);
    setIsSaved(true);

    // Redirect to profile after showing success
    setTimeout(() => {
      navigate("/profile");
    }, 1500);
  };

  const handleCancel = () => {
    if (JSON.stringify(formData) !== JSON.stringify(originalData)) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate("/profile");
      }
    } else {
      navigate("/profile");
    }
  };

  const getInitials = () => {
    if (!formData.name) return "U";
    return formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center flex"
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

      {/* Success Notification */}
      {isSaved && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
        >
          <FaCheckCircle className="text-2xl" />
          <span className="font-semibold">Profile Updated Successfully! 🎉</span>
        </motion.div>
      )}

      {/* MAIN CONTENT - No Sidebar */}
      <div className="relative z-10 flex-1 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl"
        >
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-3">
                <FaEdit className="text-pink-500" />
                Edit Profile
              </h1>
              <p className="text-gray-500 mt-1">Update your maternal health information</p>
            </div>
            <Link
              to="/profile"
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-xl shadow-sm border border-pink-100 hover:shadow-md transition-all duration-300 text-gray-700 hover:text-pink-500"
            >
              <FaArrowLeft />
              Back to Profile
            </Link>
          </div>

          {/* Main Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 border border-white/70"
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left - Avatar & Info */}
              <div className="md:w-64 flex-shrink-0">
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: 3 }}
                    className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-pink-100 to-sky-100 flex items-center justify-center border-4 border-pink-200 shadow-lg"
                  >
                    <span className="text-5xl font-bold text-pink-500">
                      {getInitials()}
                    </span>
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mt-4">{formData.name || "Your Name"}</h3>
                  <p className="text-gray-500 text-sm">Expecting Mother</p>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-sky-50 rounded-2xl border border-pink-100/50">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <FaHeartbeat className="text-pink-500" />
                      <span>Keep your information up to date</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Form */}
              <div className="flex-1">
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <FaUser className="inline mr-2 text-pink-400" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`w-full rounded-xl border ${errors.name ? 'border-red-400 ring-2 ring-red-100' : 'border-pink-100'} bg-white/90 px-4 py-3 outline-none transition-all duration-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 hover:shadow-md`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <FaEnvelope className="inline mr-2 text-pink-400" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className={`w-full rounded-xl border ${errors.email ? 'border-red-400 ring-2 ring-red-100' : 'border-pink-100'} bg-white/90 px-4 py-3 outline-none transition-all duration-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 hover:shadow-md`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <FaPhone className="inline mr-2 text-pink-400" />
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className={`w-full rounded-xl border ${errors.phone ? 'border-red-400 ring-2 ring-red-100' : 'border-pink-100'} bg-white/90 px-4 py-3 outline-none transition-all duration-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 hover:shadow-md`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Blood Group */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <FaTint className="inline mr-2 text-pink-400" />
                        Blood Group
                      </label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-pink-100 bg-white/90 px-4 py-3 outline-none transition-all duration-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 hover:shadow-md"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <FaBaby className="inline mr-2 text-pink-400" />
                        Expected Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-pink-100 bg-white/90 px-4 py-3 outline-none transition-all duration-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 hover:shadow-md"
                      />
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <FaHeartbeat className="inline mr-2 text-pink-400" />
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="Enter your weight"
                        className="w-full rounded-xl border border-pink-100 bg-white/90 px-4 py-3 outline-none transition-all duration-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 hover:shadow-md"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <FaMapMarkerAlt className="inline mr-2 text-pink-400" />
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      rows="3"
                      className="w-full rounded-xl border border-pink-100 bg-white/90 px-4 py-3 outline-none transition-all duration-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 hover:shadow-md resize-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-pink-100/50">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 min-w-[140px] bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          Save Changes
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-white/80 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 hover:shadow-md transition-all duration-300 border border-pink-100 flex items-center gap-2"
                    >
                      <FaTimes />
                      Cancel
                    </button>
                  </div>

                  {/* Info Text */}
                  <p className="text-xs text-gray-400 text-center mt-4">
                    * Required fields. Your information is kept secure and private.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;