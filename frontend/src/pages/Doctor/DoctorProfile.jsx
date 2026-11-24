// DoctorProfile.jsx
import React, { useState, useEffect, useCallback } from "react";
import { apiUrl } from "../../config/runtime";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaChartLine,
  FaUsers,
  FaCalendarCheck,
  FaFileMedical,
  FaPrescription,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaSpinner,
  FaEdit,
  FaSave,
  FaTimes,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaCloudUploadAlt
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

  // Re-upload form state
  const [showReupload, setShowReupload] = useState(false);
  const [reuploadLicense, setReuploadLicense] = useState(null);
  const [reuploadHospital, setReuploadHospital] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);

  const loadProfile = useCallback(async () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "doctor") {
      navigate("/doctor-login");
      return;
    }
    try {
      const response = await fetch(apiUrl("/doctors/me/profile"), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      const saved = response.ok ? await response.json() : currentUser;
      localStorage.setItem("currentUser", JSON.stringify(saved));
      setDoctor(saved);
      setFormData(saved);
    } catch {
      setDoctor(currentUser);
      setFormData(currentUser);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async () => {
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        specialization: formData.specialization,
        hospital: formData.hospital
      };
      const response = await fetch(apiUrl("/doctors/me/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify(payload)
      });
      const saved = await response.json();
      if (!response.ok) throw new Error(saved.detail || "Unable to save profile");
      localStorage.setItem("currentUser", JSON.stringify(saved));
      setDoctor(saved);
      setFormData(saved);
      setIsEditing(false);
      window.dispatchEvent(new Event("doctorProfileUpdated"));
      alert("Profile updated across GlowCare.");
    } catch (error) {
      alert(error.message || "Unable to save profile");
    }
  };

  const handleReuploadSubmit = async (e) => {
    e.preventDefault();
    if (!reuploadLicense || !reuploadHospital) {
      alert("Please select both your Medical License and Hospital ID proofs.");
      return;
    }
    setUploading(true);
    setUploadMessage(null);
    try {
      const bodyData = new FormData();
      bodyData.append("license_image", reuploadLicense);
      bodyData.append("hospital_id_image", reuploadHospital);

      const response = await fetch(apiUrl("/doctors/me/verification/reupload"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: bodyData
      });

      const resData = await response.json();
      if (response.ok) {
        setUploadMessage({ type: "success", text: "New documents submitted! AI verification updated." });
        setReuploadLicense(null);
        setReuploadHospital(null);
        setShowReupload(false);
        loadProfile();
      } else {
        setUploadMessage({ type: "error", text: resData.detail || "Upload failed. Please try again." });
      }
    } catch (err) {
      setUploadMessage({ type: "error", text: "Network error during upload." });
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <FaCheckCircle className="text-emerald-600" /> Verified Practitioner
          </span>
        );
      case "ai_reviewed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <FaShieldAlt className="text-purple-600" /> AI Review Completed (Awaiting Admin)
          </span>
        );
      case "manual_verification_required":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <FaExclamationTriangle className="text-amber-600" /> Under Manual Review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <FaTimesCircle className="text-rose-600" /> Verification Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            Pending Document Review
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <FaSpinner className="text-4xl text-pink-500 animate-spin" />
      </div>
    );
  }

  const score = Math.round(doctor?.verification_confidence_score || 0);

  return (
    <div className="relative min-h-screen overflow-y-auto bg-cover bg-center flex" style={{ backgroundImage: `url(${bg})` }}>
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-pink-300 blur-[140px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>

      {/* SIDEBAR */}
      <div className="relative z-10 w-64 bg-white/80 backdrop-blur-2xl border-r border-pink-100/50 flex-shrink-0 h-full flex flex-col">
        <div className="p-5 border-b border-pink-100/50">
          <Link to="/doctor-dashboard" className="block">
            <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
            <p className="text-xs text-gray-500">Doctor Portal</p>
          </Link>
          <div className="mt-4 flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-sky-50 rounded-2xl border border-pink-100/30">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {doctor?.name?.charAt(0).toUpperCase() || "D"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{doctor?.name || "Doctor"}</p>
              <p className="text-xs text-gray-500 truncate">{doctor?.specialization || "Gynecologist"}</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Online</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavItem label="Dashboard" icon={<FaChartLine />} to="/doctor-dashboard" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <NavItem label="Patients" icon={<FaUsers />} to="/doctor-patients" active={activeTab === "patients"} onClick={() => setActiveTab("patients")} />
          <NavItem label="Appointments" icon={<FaCalendarCheck />} to="/doctor-appointments" active={activeTab === "appointments"} onClick={() => setActiveTab("appointments")} />
          <NavItem label="Reports" icon={<FaFileMedical />} to="/doctor-reports" active={activeTab === "reports"} onClick={() => setActiveTab("reports")} />
          <NavItem label="Prescriptions" icon={<FaPrescription />} to="/doctor-prescriptions" active={activeTab === "prescriptions"} onClick={() => setActiveTab("prescriptions")} />
          <NavItem label="Notifications" icon={<FaBell />} to="/doctor-notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
          <NavItem label="Profile" icon={<FaUserMd />} to="/doctor-profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <NavItem label="Settings" icon={<FaCog />} to="/doctor-settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
        </div>

        <div className="p-3 border-t border-pink-100/50">
          <button onClick={() => { localStorage.removeItem("currentUser"); window.location.href = "/doctor-login"; }} className="w-full flex items-center justify-center gap-2 bg-pink-50 text-pink-600 px-4 py-2.5 rounded-xl hover:bg-pink-100 transition-all duration-300 text-sm font-semibold">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 pt-20 lg:pt-6 pb-12 min-h-screen overflow-y-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <FaUserMd className="text-pink-500" />
              My Profile
            </h2>
            <p className="text-sm text-gray-500 mt-1">Manage your credentials and view verification status</p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-600 transition-all flex items-center gap-2">
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition-all flex items-center gap-2">
                  <FaSave /> Save
                </button>
                <button onClick={() => { setIsEditing(false); setFormData(doctor); }} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-400 transition-all flex items-center gap-2">
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {doctor?.name?.charAt(0).toUpperCase() || "D"}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{doctor?.name}</h3>
              <p className="text-gray-500">{doctor?.specialization || "Gynecologist"}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">● Online</span>
                {getStatusBadge(doctor?.verification_status)}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Full Name</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full mt-1 px-3 py-1 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="font-semibold text-gray-800">{doctor?.name}</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Email</p>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full mt-1 px-3 py-1 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="font-semibold text-gray-800">{doctor?.email}</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Specialization</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.specialization || ""}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  className="w-full mt-1 px-3 py-1 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="font-semibold text-gray-800">{doctor?.specialization || "Not specified"}</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Phone</p>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full mt-1 px-3 py-1 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="font-semibold text-gray-800">{doctor?.phone || "Not provided"}</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Hospital</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.hospital || ""}
                  onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                  className="w-full mt-1 px-3 py-1 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="font-semibold text-gray-800">{doctor?.hospital || "Not specified"}</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Registration / License Number</p>
              <p className="font-semibold text-gray-800">{doctor?.license_number || "Not specified"}</p>
            </div>
          </div>
        </div>

        {/* AI + ML + OCR CREDENTIAL VERIFICATION STATUS SECTION */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-sky-400 flex items-center justify-center text-white text-xl shadow-md">
                <FaShieldAlt />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Professional Credential Verification</h3>
                <p className="text-xs text-gray-500">Automated AI + ML + OCR Certificate Analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {getStatusBadge(doctor?.verification_status)}
              {score > 0 && (
                <div className="px-3 py-1 bg-pink-50 border border-pink-100 rounded-xl text-xs font-bold text-pink-600">
                  AI Confidence: {score}%
                </div>
              )}
            </div>
          </div>

          {/* EXTRACTED DETAILS GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50/60 to-white border border-pink-100">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                Extracted Name
              </span>
              <p className="font-bold text-gray-800 text-sm">
                {doctor?.extracted_doctor_name || "—"}
              </p>
              {doctor?.name_match_score > 0 && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  ✓ {Math.round(doctor.name_match_score)}% Match
                </p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/60 to-white border border-sky-100">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                License / Reg Number
              </span>
              <p className="font-bold text-gray-800 text-sm">
                {doctor?.extracted_license_number || doctor?.license_number || "—"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/60 to-white border border-purple-100">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                Issuing Medical Council
              </span>
              <p className="font-bold text-gray-800 text-sm">
                {doctor?.extracted_issuing_authority || "Under Review"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-100">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                Qualifications
              </span>
              <p className="font-bold text-gray-800 text-sm">
                {doctor?.extracted_qualifications && doctor?.extracted_qualifications.length > 0
                  ? doctor.extracted_qualifications.join(", ")
                  : "MBBS / Clinical Credentials"}
              </p>
            </div>
          </div>

          {/* ADMIN NOTES OR WARNINGS */}
          {doctor?.admin_review_notes && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
              <div className="flex items-start gap-2 text-xs text-amber-800">
                <FaExclamationTriangle className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold">Verification Note from Admin:</span>
                  <p className="mt-0.5">{doctor.admin_review_notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* ACTION BUTTON TO RE-UPLOAD */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Need to upload a clearer certificate or update credentials?
            </p>
            <button
              onClick={() => setShowReupload(!showReupload)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-sky-400 text-white text-xs font-bold shadow-md hover:scale-[1.02] transition flex items-center gap-1.5"
            >
              <FaCloudUploadAlt /> {showReupload ? "Close Form" : "Re-upload Verification Proofs"}
            </button>
          </div>

          {/* RE-UPLOAD FORM ACCORDION */}
          {showReupload && (
            <form onSubmit={handleReuploadSubmit} className="mt-6 p-5 bg-pink-50/30 rounded-2xl border border-pink-100">
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaCloudUploadAlt className="text-pink-500" /> Upload Corrected Documents
              </h4>

              {uploadMessage && (
                <div
                  className={`p-3 rounded-xl mb-4 text-xs font-semibold ${
                    uploadMessage.type === "success"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {uploadMessage.text}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    State Medical Council License Proof *
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={(e) => setReuploadLicense(e.target.files[0])}
                    className="w-full text-xs p-2 rounded-xl border border-gray-200 bg-white"
                  />
                  {reuploadLicense && (
                    <p className="text-[11px] text-green-600 mt-1 truncate">✓ {reuploadLicense.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Hospital Identification Card *
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={(e) => setReuploadHospital(e.target.files[0])}
                    className="w-full text-xs p-2 rounded-xl border border-gray-200 bg-white"
                  />
                  {reuploadHospital && (
                    <p className="text-[11px] text-green-600 mt-1 truncate">✓ {reuploadHospital.name}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-400 to-sky-400 text-white font-bold text-xs shadow-md hover:scale-[1.01] transition flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Analyzing Document with AI Pipeline...
                  </>
                ) : (
                  "Submit for AI Certificate Verification"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ label, icon, to, active, onClick, badge }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm ${
      active
        ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg"
        : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="font-medium flex-1">{label}</span>
    {badge > 0 && (
      <span className={`text-xs px-2 py-0.5 rounded-full ${active ? "bg-white/30 text-white" : "bg-red-500 text-white"}`}>
        {badge}
      </span>
    )}
  </Link>
);

export default DoctorProfile;
