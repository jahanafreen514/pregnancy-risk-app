// DoctorPatients.jsx
import React, { useState, useEffect } from "react";
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
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaHeart,
  FaBaby,
  FaWeight,
  FaRuler,
  FaSyringe,
  FaAmbulance,
  FaNotesMedical,
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

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "doctor") {
      navigate("/doctor-login");
      return;
    }
    setDoctor(currentUser);
    loadPatients();
  }, []);

  const loadPatients = () => {
    setLoading(true);
    
    // Get all appointments
    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    
    // Get all users
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    
    // Get patient health updates
    const healthUpdates = JSON.parse(localStorage.getItem("patientHealthUpdates")) || [];
    
    // Get patient risk assessments
    const riskAssessments = JSON.parse(localStorage.getItem("patientRiskAssessments")) || [];
    
    // Filter appointments for this doctor
    const doctorAppointments = allAppointments.filter(
      app => app.doctorId === doctor?.id || app.doctorName === doctor?.name
    );
    
    // Get unique patients from appointments
    const patientMap = new Map();
    
    doctorAppointments.forEach(app => {
      const patientId = app.patientId || app.patientEmail;
      if (!patientMap.has(patientId)) {
        // Find user data
        const userData = allUsers.find(u => u.id === app.patientId || u.email === app.patientEmail);
        
        // Get health updates for this patient
        const patientUpdates = healthUpdates.filter(
          u => u.patientId === app.patientId || u.patientEmail === app.patientEmail
        );
        
        // Get latest risk assessment
        const latestRisk = riskAssessments
          .filter(r => r.patientId === app.patientId || r.patientEmail === app.patientEmail)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        
        // Calculate patient stats
        const patientAppointments = doctorAppointments.filter(
          a => a.patientId === app.patientId || a.patientEmail === app.patientEmail
        );
        
        const completedAppointments = patientAppointments.filter(
          a => a.status?.toLowerCase() === "completed"
        ).length;
        
        const pendingAppointments = patientAppointments.filter(
          a => a.status?.toLowerCase() === "pending"
        ).length;
        
        patientMap.set(patientId, {
          id: app.patientId || patientId,
          name: app.patientName || app.patient || userData?.name || "Unknown",
          email: app.patientEmail || userData?.email || "",
          phone: app.patientPhone || userData?.phone || "",
          age: userData?.age || "N/A",
          gender: userData?.gender || "N/A",
          riskLevel: latestRisk?.riskLevel || "Low",
          riskScore: latestRisk?.score || 0,
          lastVisit: app.date || "N/A",
          totalAppointments: patientAppointments.length,
          completedAppointments,
          pendingAppointments,
          lastUpdate: app.updatedAt || app.createdAt || new Date().toISOString(),
          healthUpdates: patientUpdates,
          symptoms: latestRisk?.symptoms || [],
          vitals: latestRisk?.vitals || null,
        });
      }
    });
    
    const patientsList = Array.from(patientMap.values());
    
    // Sort by last visit (newest first)
    patientsList.sort((a, b) => {
      return new Date(b.lastVisit) - new Date(a.lastVisit);
    });
    
    setPatients(patientsList);
    setFilteredPatients(patientsList);
    setLoading(false);
  };

  // Filter patients
  useEffect(() => {
    let filtered = [...patients];

    if (searchTerm && searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower) ||
        p.phone.includes(searchTerm)
      );
    }

    if (riskFilter !== "all") {
      filtered = filtered.filter(p => 
        p.riskLevel?.toLowerCase() === riskFilter.toLowerCase()
      );
    }

    setFilteredPatients(filtered);
  }, [searchTerm, riskFilter, patients]);

  // Listen for real-time updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "appointments" || e.key === "users" || 
          e.key === "patientHealthUpdates" || e.key === "patientRiskAssessments" ||
          e.key === "currentUser") {
        loadPatients();
      }
    };

    const handleDataUpdate = () => {
      loadPatients();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("dataUpdated", handleDataUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("dataUpdated", handleDataUpdate);
    };
  }, [doctor]);

  const getRiskBadge = (risk) => {
    const riskMap = {
      high: "bg-red-100 text-red-700 border-red-200",
      moderate: "bg-orange-100 text-orange-700 border-orange-200",
      low: "bg-green-100 text-green-700 border-green-200",
    };
    return riskMap[risk?.toLowerCase()] || riskMap.low;
  };

  const getRiskIcon = (risk) => {
    switch (risk?.toLowerCase()) {
      case "high":
        return <FaAmbulance className="text-red-500" />;
      case "moderate":
        return <FaExclamationTriangle className="text-orange-500" />;
      default:
        return <FaCheckCircle className="text-green-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return dateString;
    }
  };

  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRiskFilter("all");
  };

  const isFilterActive = searchTerm || riskFilter !== "all";

  // Stats
  const total = patients.length;
  const highRisk = patients.filter(p => p.riskLevel?.toLowerCase() === "high").length;
  const moderateRisk = patients.filter(p => p.riskLevel?.toLowerCase() === "moderate").length;
  const lowRisk = patients.filter(p => p.riskLevel?.toLowerCase() === "low").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <FaSpinner className="text-4xl text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="relative h-screen overflow-hidden bg-cover bg-center flex"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-pink-300 blur-[140px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-pink-200 blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: "1s" }}></div>

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
          <NavItem label="Patients" icon={<FaUsers />} to="/doctor-patients" active={activeTab === "patients"} onClick={() => setActiveTab("patients")} badge={highRisk} />
          <NavItem label="Appointments" icon={<FaCalendarCheck />} to="/doctor-appointments" active={activeTab === "appointments"} onClick={() => setActiveTab("appointments")} />
          <NavItem label="Reports" icon={<FaFileMedical />} to="/doctor-reports" active={activeTab === "reports"} onClick={() => setActiveTab("reports")} />
          <NavItem label="Prescriptions" icon={<FaPrescription />} to="/doctor-prescriptions" active={activeTab === "prescriptions"} onClick={() => setActiveTab("prescriptions")} />
          <NavItem label="Notifications" icon={<FaBell />} to="/doctor-notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
          <NavItem label="Profile" icon={<FaUserMd />} to="/doctor-profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <NavItem label="Settings" icon={<FaCog />} to="/doctor-settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
        </div>

        <div className="p-3 border-t border-pink-100/50">
          <button
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/doctor-login";
            }}
            className="w-full flex items-center justify-center gap-2 bg-pink-50 text-pink-600 px-4 py-2.5 rounded-xl hover:bg-pink-100 transition-all duration-300 text-sm font-semibold"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-4 h-full overflow-y-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <FaUsers className="text-pink-500" />
              My Patients
            </h2>
            <p className="text-sm text-gray-500 mt-1">View and manage all your patients</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadPatients} className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100 hover:bg-pink-50 transition-all text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaSpinner className={`${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
              <span className="text-sm font-medium text-gray-700">{total} Patients</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard title="Total Patients" value={total} icon={<FaUsers />} color="pink" />
          <StatCard title="High Risk" value={highRisk} icon={<FaAmbulance />} color="red" />
          <StatCard title="Moderate Risk" value={moderateRisk} icon={<FaExclamationTriangle />} color="orange" />
          <StatCard title="Low Risk" value={lowRisk} icon={<FaCheckCircle />} color="green" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
          <div className="flex-1 min-w-[200px] relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-pink-100 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-pink-100 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="moderate">Moderate Risk</option>
            <option value="low">Low Risk</option>
          </select>
          {isFilterActive && (
            <button onClick={clearFilters} className="px-4 py-2 rounded-xl bg-pink-100 text-pink-600 hover:bg-pink-200 transition-all flex items-center gap-2 text-sm font-medium">
              Clear Filters
            </button>
          )}
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white/80 backdrop-blur-2xl rounded-2xl p-5 border border-pink-100/50 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
              onClick={() => viewPatientDetails(patient)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                    {patient.name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{patient.name}</h4>
                    <p className="text-xs text-gray-400">{patient.email}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${getRiskBadge(patient.riskLevel)}`}>
                  {getRiskIcon(patient.riskLevel)}
                  {patient.riskLevel}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-400">Age</p>
                  <p className="font-semibold text-gray-700">{patient.age}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-400">Gender</p>
                  <p className="font-semibold text-gray-700">{patient.gender}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-400">Total Appointments</p>
                  <p className="font-semibold text-gray-700">{patient.totalAppointments}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-400">Last Visit</p>
                  <p className="font-semibold text-gray-700">{formatDate(patient.lastVisit)}</p>
                </div>
              </div>

              {patient.symptoms && patient.symptoms.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {patient.symptoms.slice(0, 3).map((symptom, idx) => (
                    <span key={idx} className="text-xs px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full">
                      {symptom}
                    </span>
                  ))}
                  {patient.symptoms.length > 3 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                      +{patient.symptoms.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}

          {filteredPatients.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              <FaUsers className="text-4xl mx-auto mb-2 opacity-50" />
              <p className="font-medium">No patients found</p>
              <p className="text-xs mt-1">
                {isFilterActive ? "Try adjusting your filters" : "Patients will appear here once they book appointments"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Patient Details Modal */}
      {showModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaUser className="text-pink-500" />
                Patient Details
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl">
                <FaTimesCircle />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-2xl">
                  {selectedPatient.name?.charAt(0) || "P"}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedPatient.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaEnvelope /> {selectedPatient.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaPhone /> {selectedPatient.phone || "N/A"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Age</p>
                  <p className="font-semibold">{selectedPatient.age}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Gender</p>
                  <p className="font-semibold">{selectedPatient.gender}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Risk Level</p>
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${getRiskBadge(selectedPatient.riskLevel)}`}>
                    {getRiskIcon(selectedPatient.riskLevel)}
                    {selectedPatient.riskLevel}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Risk Score</p>
                  <p className="font-semibold">{selectedPatient.riskScore}%</p>
                </div>
              </div>

              {selectedPatient.vitals && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Vitals</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">BP</p>
                      <p className="font-semibold">{selectedPatient.vitals.bpSystolic}/{selectedPatient.vitals.bpDiastolic}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Heart Rate</p>
                      <p className="font-semibold">{selectedPatient.vitals.heartRate} bpm</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Weight</p>
                      <p className="font-semibold">{selectedPatient.vitals.weight} kg</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedPatient.symptoms && selectedPatient.symptoms.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.symptoms.map((symptom, idx) => (
                      <span key={idx} className="text-xs px-3 py-1 bg-pink-100 text-pink-700 rounded-full">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button onClick={closeModal} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ label, icon, to, active, onClick, badge }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm ${
      active ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg" : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
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

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    pink: "bg-pink-100 text-pink-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 border border-pink-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-2">
        <div className={`${colorClasses[color]} p-2 rounded-full text-xs`}>
          {icon}
        </div>
        <div>
          <p className="text-lg font-bold text-gray-800">{value}</p>
          <p className="text-[10px] text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;