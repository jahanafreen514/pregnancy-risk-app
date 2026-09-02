import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeartbeat,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaWhatsapp,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaArrowRight,
  FaSpinner,
  FaHeadset,
  FaMailBulk,
  FaGlobe,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";
import { apiUrl } from "../../config/runtime";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";
    if (formData.message.length < 10) errors.message = "Message must be at least 10 characters";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(apiUrl("/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Unable to send your message.");
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (requestError) {
      setError(requestError.message || "Unable to send your message. Please try again.");
    } finally {
      setIsLoading(false);
    }

    // Auto-hide success after 5 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: "Email Us",
      info: "support@glowcare.com",
      subInfo: "We'll respond within 24 hours",
    },
    {
      icon: <FaPhone />,
      title: "Call Us",
      info: "+91 98765 43210",
      subInfo: "Mon-Fri, 9 AM - 6 PM IST",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Visit Us",
      info: "123 Health Tower, MG Road",
      subInfo: "Mumbai, India 400001",
    },
    {
      icon: <FaClock />,
      title: "Working Hours",
      info: "24/7 Support",
      subInfo: "Emergency assistance available",
    },
  ];

  const socialLinks = [
    { icon: <FaWhatsapp />, name: "WhatsApp", color: "from-green-400 to-green-600", link: "#" },
    { icon: <FaTwitter />, name: "Twitter", color: "from-blue-400 to-blue-600", link: "#" },
    { icon: <FaFacebook />, name: "Facebook", color: "from-blue-600 to-blue-800", link: "#" },
    { icon: <FaInstagram />, name: "Instagram", color: "from-pink-400 to-orange-400", link: "#" },
    { icon: <FaLinkedin />, name: "LinkedIn", color: "from-blue-500 to-blue-700", link: "#" },
  ];

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-pink-300 blur-2xl opacity-60 animate-pulse"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-sky-400 flex items-center justify-center shadow-2xl animate-float">
                <FaHeadset className="text-white text-3xl animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-gray-500 text-lg mt-3">
            We'd love to hear from you. Reach out to us anytime.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left - Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/70 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-sky-100 flex items-center justify-center text-pink-500 text-xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.info}</p>
                    <p className="text-gray-400 text-xs mt-1">{item.subInfo}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/70 shadow-xl">
              <h3 className="font-semibold text-gray-800 mb-4">Connect With Us</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${social.color} flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Response */}
            <div className="bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-2xl" />
                <div>
                  <h4 className="font-bold">Quick Response</h4>
                  <p className="text-sm opacity-90">We usually respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/70 shadow-xl hover:shadow-2xl transition-all duration-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Send Us a Message</h2>
              <p className="text-gray-500 text-sm mb-6">
                Have questions? We're here to help you.
              </p>

              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-600 animate-fadeIn">
                  <FaCheckCircle className="text-xl flex-shrink-0" />
                  <div>
                    <span className="font-medium">Message sent successfully!</span>
                    <p className="text-sm text-green-500">We'll get back to you soon.</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600 animate-fadeIn">
                  <FaTimesCircle className="text-xl flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full rounded-2xl border ${
                        formErrors.name ? 'border-red-400 ring-2 ring-red-100' : 'border-pink-100'
                      } bg-white/90 pl-12 pr-4 py-3.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 hover:shadow-lg`}
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`w-full rounded-2xl border ${
                        formErrors.email ? 'border-red-400 ring-2 ring-red-100' : 'border-pink-100'
                      } bg-white/90 pl-12 pr-4 py-3.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 hover:shadow-lg`}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Subject *
                  </label>
                  <div className="relative group">
                    <FaMailBulk className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      className={`w-full rounded-2xl border ${
                        formErrors.subject ? 'border-red-400 ring-2 ring-red-100' : 'border-pink-100'
                      } bg-white/90 pl-12 pr-4 py-3.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 hover:shadow-lg`}
                    />
                  </div>
                  {formErrors.subject && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message *
                  </label>
                  <div className="relative group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      rows="5"
                      className={`w-full rounded-2xl border ${
                        formErrors.message ? 'border-red-400 ring-2 ring-red-100' : 'border-pink-100'
                      } bg-white/90 px-4 py-3.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 hover:shadow-lg resize-none`}
                    />
                  </div>
                  {formErrors.message && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>
                  )}
                  <div className="flex justify-end mt-1">
                    <span className={`text-xs ${formData.message.length >= 10 ? 'text-green-500' : 'text-gray-400'}`}>
                      {formData.message.length}/10+ characters
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 py-4 text-base font-bold text-white shadow-xl hover:shadow-pink-300/50 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <FaPaperPlane />
                    </>
                  )}
                </button>

                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-4">
                  <span className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-400" />
                    Secure
                  </span>
                  <span className="w-px h-3 bg-gray-200"></span>
                  <span className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-400" />
                    Encrypted
                  </span>
                  <span className="w-px h-3 bg-gray-200"></span>
                  <span className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-400" />
                    Privacy Protected
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-pink-100/50 pt-6">
          <p>© 2026 GlowCare — Safe Pregnancy, Smart Monitoring 🤰</p>
        </div>
      </div>

      <style >{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Contact;
