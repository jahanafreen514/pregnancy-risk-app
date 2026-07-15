// DoctorPrescriptions.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPrescription,
  FaChartLine,
  FaUsers,
  FaCalendarCheck,
  FaFileMedical,
  FaBell,
  FaUserMd,
  FaCog,
  FaSignOutAlt,
  FaSpinner,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaPhone,
  FaPills,
  FaSyringe,
  FaNotesMedical,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const DoctorPrescriptions = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    status: "active",
  });
  const [activeTab, setActiveTab] = useState("prescriptions");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "doctor") {
      navigate("/doctor-login");
      return;
    }
    setDoctor(currentUser);
    loadPrescriptions();
  }, []);

  const loadPrescriptions = () => {
    setLoading(true);
    
    // Get all prescriptions
    const allPrescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
    
    // Filter for this doctor
    const doctorPrescriptions = allPrescriptions.filter(
      p => p.doctorId === doctor?.id || p.doctorName === doctor?.name
    );
    
    // Sort by date (newest first)
    doctorPrescriptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setPrescriptions(doctorPrescriptions);
    setFilteredPrescriptions(doctorPrescriptions);
    setLoading(false);
  };

  // Filter prescriptions
  useEffect(() => {
    let filtered = [...prescriptions];
    
    if (searchTerm && searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.patientName?.toLowerCase().includes(searchLower) ||
        p.medication?.toLowerCase().includes(searchLower) ||
        p.patientEmail?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredPrescriptions(filtered);
  }, [searchTerm, prescriptions]);

  // Listen for real-time updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "prescriptions" || e.key === "currentUser") {
        loadPrescriptions();
      }
    };
    const handleDataUpdate = () => loadPrescriptions();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("dataUpdated", handleDataUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("dataUpdated", handleDataUpdate);
    };
  }, [doctor]);

  const handleSavePrescription = () => {
    const allPrescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
    
    if (editingPrescription) {
      // Update existing
      const updated = allPrescriptions.map(p =>
        p.id === editingPrescription.id ? { ...formData, id: p.id, updatedAt: new Date().toISOString() } : p
      );
      localStorage.setItem("prescriptions", JSON.stringify(updated));
    } else {
      // Add new
      const newPrescription = {
        id: `pres_${Date.now()}`,
        ...formData,
        doctorId: doctor?.id,
        doctorName: doctor?.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      allPrescriptions.push(newPrescription);
      localStorage.setItem("prescriptions", JSON.stringify(allPrescriptions));
    }
    
    loadPrescriptions();
    closeModal();
  };

  const deletePrescription = (id) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      const allPrescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
      const updated = allPrescriptions.filter(p => p.id !== id);
      localStorage.setItem("prescriptions", JSON.stringify(updated));
      loadPrescriptions();
    }
  };

  const openModal = (prescription = null) => {
    if (prescription) {
      setEditingPrescription(prescription);
      setFormData({
        patientName: prescription.patientName || "",
        patientEmail: prescription.patientEmail || "",
        medication: prescription.medication || "",
        dosage: prescription.dosage || "",
        frequency: prescription.frequency || "",
        duration: prescription.duration || "",
        instructions: prescription.instructions || "",
        status: prescription.status || "active",
      });
    } else {
      setEditingPrescription(null);
      setFormData({
        patientName: "",
        patientEmail: "",
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
        status: "active",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPrescription(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <FaSpinner className="text-4xl text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-cover bg-center flex" style={{ backgroundImage: `url(${bg})` }}>
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
      <div className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-4 h-full overflow-y-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <FaPrescription className="text-pink-500" />
              Prescriptions
            </h2>
            <p className="text-sm text-gray-500 mt-1">Manage patient prescriptions</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => openModal()} className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-600 transition-all flex items-center gap-2">
              <FaPlus /> New Prescription
            </button>
            <button onClick={loadPrescriptions} className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100 hover:bg-pink-50 transition-all text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaSpinner className={`${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard title="Total" value={prescriptions.length} icon={<FaPrescription />} color="pink" />
          <StatCard title="Active" value={prescriptions.filter(p => p.status === "active").length} icon={<FaCheckCircle />} color="green" />
          <StatCard title="Completed" value={prescriptions.filter(p => p.status === "completed").length} icon={<FaCheckCircle />} color="blue" />
          <StatCard title="Expired" value={prescriptions.filter(p => p.status === "expired").length} icon={<FaTimesCircle />} color="red" />
        </div>

        {/* Search */}
        <div className="flex flex-wrap gap-3 mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
          <div className="flex-1 min-w-[200px] relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient or medication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-pink-100 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>
        </div>

        {/* Prescriptions Table */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pink-100">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Patient</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Medication</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Dosage</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Frequency</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Status</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.map((p) => (
                  <tr key={p.id} className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-medium text-gray-800">{p.patientName}</p>
                        <p className="text-xs text-gray-400">{p.patientEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-700">{p.medication}</td>
                    <td className="py-3 px-3 text-gray-600">{p.dosage}</td>
                    <td className="py-3 px-3 text-gray-600">{p.frequency}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        p.status === "active" ? "bg-green-100 text-green-700" :
                        p.status === "completed" ? "bg-blue-100 text-blue-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {p.status?.charAt(0).toUpperCase() + p.status?.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button onClick={() => openModal(p)} className="text-blue-500 hover:text-blue-700">
                          <FaEdit />
                        </button>
                        <button onClick={() => deletePrescription(p.id)} className="text-red-500 hover:text-red-700">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPrescriptions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">No prescriptions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaPrescription className="text-pink-500" />
                {editingPrescription ? "Edit Prescription" : "New Prescription"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl">
                <FaTimesCircle />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Email</label>
                  <input
                    type="email"
                    value={formData.patientEmail}
                    onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medication *</label>
                  <input
                    type="text"
                    value={formData.medication}
                    onChange={(e) => setFormData({...formData, medication: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                    placeholder="e.g., 500mg"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    placeholder="e.g., Twice daily"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g., 7 days"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  rows="3"
                  placeholder="Additional instructions for the patient..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 mt-4">
              <button onClick={handleSavePrescription} className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-xl hover:opacity-90 transition-all">
                {editingPrescription ? "Update Prescription" : "Create Prescription"}
              </button>
              <button onClick={closeModal} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition-colors">
                Cancel
              </button>
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

export default DoctorPrescriptions;