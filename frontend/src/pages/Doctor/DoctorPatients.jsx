// DoctorPatients.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaUsers,
  FaChartLine,
  FaCalendarCheck,
  FaFileMedical,
  FaPrescription,
  FaBell,
  FaUserMd,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaAmbulance,
  FaEnvelope,
  FaPhone,
  FaHeartbeat,
  FaBaby,
  FaNotesMedical,
  FaTimes,
  FaUser,
  FaHeart,
} from "react-icons/fa";

import bg from "../../assets/images/bg.png";

const DoctorPatients = () => {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [activeTab, setActiveTab] = useState("patients");

  // LOGIN CHECK
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "doctor") {
      navigate("/doctor-login");
      return;
    }

    setDoctor(currentUser);
    loadPatients();
  }, []);

  // LOAD PATIENTS FROM PREDICTION FLOW
  const loadPatients = () => {
    setLoading(true);

    try {
      const storedPatients = JSON.parse(localStorage.getItem("doctorPatientUpdates")) || [];

      const formattedPatients = storedPatients.map((item, index) => ({
        id: item.email || index,
        name: item.patient || "Unknown Patient",
        email: item.email || "N/A",
        phone: item.phone || "N/A",
        age: item.vitals?.age || "N/A",
        gender: item.gender || "Not specified",
        lastVisit: item.updatedAt || new Date().toISOString(),
        pregnancyWeek: item.vitals?.pregnancy_week || "N/A",
        riskLevel: item.risk || "Low",
        riskScore: item.score || 0,
        confidence: item.confidence || 0,
        symptoms: item.symptoms || [],
        riskFactors: item.riskFactors || [],
        vitals: item.vitals || {},
        updatedAt: item.updatedAt || new Date().toLocaleString(),
        notes: "",
      }));

      setPatients(formattedPatients);
      setFilteredPatients(formattedPatients);
    } catch (error) {
      console.log("Patient loading error:", error);
      setPatients([]);
      setFilteredPatients([]);
    }

    setLoading(false);
  };

  // FILTER FUNCTION
  useEffect(() => {
    let data = [...patients];

    if (searchTerm.trim()) {
      const value = searchTerm.toLowerCase();
      data = data.filter(
        (patient) =>
          patient.name.toLowerCase().includes(value) ||
          patient.email.toLowerCase().includes(value)
      );
    }

    if (riskFilter !== "all") {
      data = data.filter(
        (patient) => patient.riskLevel.toLowerCase() === riskFilter.toLowerCase()
      );
    }

    setFilteredPatients(data);
  }, [searchTerm, riskFilter, patients]);

  // REAL TIME UPDATE LISTENER
  useEffect(() => {
    const updatePatients = () => {
      loadPatients();
    };

    window.addEventListener("dataUpdated", updatePatients);
    window.addEventListener("storage", updatePatients);

    return () => {
      window.removeEventListener("dataUpdated", updatePatients);
      window.removeEventListener("storage", updatePatients);
    };
  }, []);

  // HELPERS
  const openPatient = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setShowModal(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRiskFilter("all");
  };

  const totalPatients = patients.length;
  const highRisk = patients.filter((p) => p.riskLevel === "High").length;
  const mediumRisk = patients.filter((p) => p.riskLevel === "Medium").length;
  const lowRisk = patients.filter((p) => p.riskLevel === "Low").length;

  // Helper function for risk badge styling
  const getRiskBadge = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-600 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-600 border-orange-200";
      case "low":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <FaSpinner className="text-5xl text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="relative h-screen overflow-hidden bg-cover bg-center flex"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />

      {/* SIDEBAR */}
      <div className="relative z-10 w-64 bg-white/85 backdrop-blur-xl border-r border-pink-100 h-full flex flex-col">
        <div className="p-5 border-b border-pink-100">
          <Link to="/doctor-dashboard">
            <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
            <p className="text-xs text-gray-500">Doctor Portal</p>
          </Link>

          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-sky-50 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold">
              {doctor?.name?.charAt(0)?.toUpperCase() || "D"}
            </div>
            <div>
              <p className="font-semibold text-sm">{doctor?.name || "Doctor"}</p>
              <p className="text-xs text-gray-500">{doctor?.specialization || "Gynecologist"}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-3 space-y-2">
          <NavItem label="Dashboard" icon={<FaChartLine />} to="/doctor-dashboard" active={false} />
          <NavItem
            label="Patients"
            icon={<FaUsers />}
            to="/doctor-patients"
            active={true}
            badge={highRisk}
          />
          <NavItem label="Appointments" icon={<FaCalendarCheck />} to="/doctor-appointments" />
          <NavItem label="Reports" icon={<FaFileMedical />} to="/doctor-reports" />
          <NavItem label="Prescriptions" icon={<FaPrescription />} to="/doctor-prescriptions" />
          <NavItem label="Notifications" icon={<FaBell />} to="/doctor-notifications" />
          <NavItem label="Profile" icon={<FaUserMd />} to="/doctor-profile" />
          <NavItem label="Settings" icon={<FaCog />} to="/doctor-settings" />
        </div>

        <div className="p-3 border-t border-pink-100">
          <button
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/doctor-login";
            }}
            className="w-full flex items-center justify-center gap-2 bg-pink-50 text-pink-600 py-3 rounded-xl font-semibold"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex gap-2 items-center">
              <FaUsers className="text-pink-500" />
              Patients
            </h2>
            <p className="text-sm text-gray-500">Patient monitoring and medical records</p>
          </div>

          <button
            onClick={loadPatients}
            className="bg-white px-4 py-2 rounded-xl shadow flex gap-2 items-center"
          >
            <FaSpinner />
            Refresh
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Patients" value={totalPatients} icon={<FaUsers />} />
          <StatCard title="High Risk" value={highRisk} icon={<FaAmbulance />} />
          <StatCard title="Need Attention" value={mediumRisk} icon={<FaExclamationTriangle />} />
          <StatCard title="Stable" value={lowRisk} icon={<FaCheckCircle />} />
        </div>

        {/* FILTERS */}
        <div className="bg-white/80 rounded-2xl p-4 shadow mb-6 flex gap-3 flex-wrap">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient name or email"
              className="w-full pl-10 py-2 rounded-xl border border-pink-100 outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-4 rounded-xl border border-pink-100 outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="all">All Risk</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button onClick={clearFilters} className="px-4 rounded-xl bg-pink-100 text-pink-600">
            Clear
          </button>
        </div>

        {/* PATIENT LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white/90 backdrop-blur-xl rounded-3xl border border-pink-100 shadow-lg hover:shadow-2xl transition-all duration-300 p-5"
            >
              {/* Patient Header */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                    {patient.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{patient.name}</h3>
                    <p className="text-xs text-gray-500">{patient.email}</p>
                    <p className="text-xs text-gray-400 mt-1">Patient ID : {patient.id}</p>
                  </div>
                </div>

                {/* Risk Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    patient.riskLevel?.toLowerCase() === "high"
                      ? "bg-red-100 text-red-600"
                      : patient.riskLevel?.toLowerCase() === "medium"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {patient.riskLevel}
                </span>
              </div>

              {/* Medical Summary */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Age</p>
                  <p className="font-bold text-gray-700">{patient.age}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Pregnancy Week</p>
                  <p className="font-bold text-gray-700">{patient.pregnancyWeek}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Blood Pressure</p>
                  <p className="font-bold text-gray-700">
                    {patient.vitals?.systolic_bp || "-"} / {patient.vitals?.diastolic_bp || "-"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Heart Rate</p>
                  <p className="font-bold text-gray-700">{patient.vitals?.heart_rate || "-"} bpm</p>
                </div>
              </div>

              {/* AI RISK */}
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-pink-50 to-sky-50">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">AI Risk Score</span>
                  <span className="font-bold text-pink-600">{patient.riskScore}%</span>
                </div>
                <div className="h-2 bg-white rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full"
                    style={{ width: `${patient.riskScore}%` }}
                  />
                </div>
              </div>

              {/* Symptoms */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">Recent Symptoms</p>
                <div className="flex flex-wrap gap-2">
                  {patient.symptoms?.slice(0, 3).map((symptom, index) => (
                    <span
                      key={index}
                      className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-xs"
                    >
                      {symptom}
                    </span>
                  ))}
                  {patient.symptoms?.length > 3 && (
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs">
                      +{patient.symptoms.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => openPatient(patient)}
                className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-sky-400 text-white font-semibold hover:scale-[1.02] transition"
              >
                <FaNotesMedical className="inline mr-2" />
                View Medical Record
              </button>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredPatients.length === 0 && (
          <div className="bg-white/80 rounded-3xl p-10 text-center shadow">
            <FaUsers className="text-5xl mx-auto text-gray-300 mb-3" />
            <h3 className="font-bold text-gray-600">No Patients Found</h3>
            <p className="text-sm text-gray-400 mt-2">
              Patients will appear after prediction data is shared
            </p>
          </div>
        )}
      </div>

      {/* MEDICAL RECORD MODAL */}
      {showModal && selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6">
            {/* HEADER */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaNotesMedical className="text-pink-500" />
                  Patient Medical Record
                </h2>
                <p className="text-sm text-gray-500 mt-1">Complete pregnancy health summary</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-red-500 text-xl"
              >
                <FaTimes />
              </button>
            </div>

            {/* PATIENT PROFILE */}
            <div className="bg-gradient-to-r from-pink-50 to-sky-50 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {selectedPatient.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedPatient.name}</h3>
                <div className="text-sm text-gray-600 space-y-1 mt-1">
                  <p>
                    <FaEnvelope className="inline mr-2" />
                    {selectedPatient.email}
                  </p>
                  <p>
                    <FaPhone className="inline mr-2" />
                    {selectedPatient.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* AI PREDICTION SUMMARY */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">Risk Level</p>
                <p className="font-bold text-lg text-red-600">{selectedPatient.riskLevel}</p>
              </div>
              <div className="bg-pink-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">AI Risk Score</p>
                <p className="font-bold text-lg text-pink-600">{selectedPatient.riskScore}%</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">Confidence</p>
                <p className="font-bold text-lg text-green-600">{selectedPatient.confidence}%</p>
              </div>
            </div>

            {/* PREGNANCY DETAILS */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaBaby className="text-pink-500" />
                Pregnancy Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["Age", selectedPatient.vitals?.age],
                  ["Pregnancy Week", selectedPatient.vitals?.pregnancy_week],
                  ["Baby Count", selectedPatient.vitals?.baby_count],
                  ["Baby Weight", selectedPatient.vitals?.baby_weight],
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">{item[0]}</p>
                    <p className="font-bold text-gray-700">{item[1] || "N/A"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* VITALS */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaHeartbeat className="text-red-500" />
                Vitals Monitoring
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["Blood Pressure", `${selectedPatient.vitals?.systolic_bp || "-"} / ${selectedPatient.vitals?.diastolic_bp || "-"}`],
                  ["Heart Rate", `${selectedPatient.vitals?.heart_rate || "-"} bpm`],
                  ["BMI", selectedPatient.vitals?.bmi],
                  ["Temperature", selectedPatient.vitals?.body_temp],
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">{item[0]}</p>
                    <p className="font-bold">{item[1] || "N/A"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SYMPTOMS SECTION */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-800 mb-3">Reported Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPatient.symptoms && selectedPatient.symptoms.length > 0 ? (
                  selectedPatient.symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 rounded-full bg-pink-100 text-pink-700 text-sm"
                    >
                      {symptom}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No symptoms recorded</p>
                )}
              </div>
            </div>

            {/* RISK FACTORS */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-800 mb-3">AI Risk Factors</h3>
              {selectedPatient.riskFactors && selectedPatient.riskFactors.length > 0 ? (
                <div className="space-y-2">
                  {selectedPatient.riskFactors.map((factor, index) => (
                    <div
                      key={index}
                      className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-sm text-orange-700 flex gap-2 items-center"
                    >
                      <FaExclamationTriangle />
                      {factor}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-50 rounded-xl p-3 text-green-700 text-sm">
                  <FaCheckCircle className="inline mr-2" />
                  No major risk factors detected
                </div>
              )}
            </div>

            {/* HEALTH SUMMARY */}
            <div className="mt-6 bg-gradient-to-r from-pink-50 to-sky-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-800 mb-3">Health Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Latest Prediction</p>
                  <p className="font-bold">{selectedPatient.riskLevel} Risk</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-bold">{selectedPatient.updatedAt}</p>
                </div>
                <div>
                  <p className="text-gray-500">Pregnancy Status</p>
                  <p className="font-bold text-green-600">Monitoring Required</p>
                </div>
                <div>
                  <p className="text-gray-500">Doctor Review</p>
                  <p className="font-bold">Pending</p>
                </div>
              </div>
            </div>

            {/* DOCTOR NOTES */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaNotesMedical className="text-pink-500" />
                Doctor Notes
              </h3>
              <textarea
                placeholder="Add medical notes for this patient..."
                className="w-full h-28 rounded-xl border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-pink-400"
              ></textarea>
            </div>

            {/* MODAL ACTIONS */}
            <div className="mt-6 flex gap-3 border-t pt-4">
              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
              >
                Close
              </button>
              <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-sky-400 text-white font-semibold">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Information Box
const InfoBox = ({ title, value }) => (
  <div className="bg-white rounded-xl p-3 shadow-sm">
    <p className="text-xs text-gray-400">{title}</p>
    <p className="font-semibold text-gray-700 mt-1">{value}</p>
  </div>
);

// Vital Card
const VitalCard = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-xs text-gray-400">{label}</p>
    <p className="font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

// Sidebar Item
const NavItem = ({ label, icon, to, active, onClick, badge }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
      active
        ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg"
        : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="flex-1 font-medium">{label}</span>
    {badge > 0 && (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        {badge}
      </span>
    )}
  </Link>
);

// Stats Card
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-pink-100">
    <div className="flex items-center gap-3">
      <div className="p-3 rounded-full bg-pink-100 text-pink-600">{icon}</div>
      <div>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{title}</p>
      </div>
    </div>
  </div>
);

export default DoctorPatients;