// DoctorReports.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFileMedical,
  FaChartLine,
  FaUsers,
  FaCalendarCheck,
  FaPrescription,
  FaBell,
  FaUserMd,
  FaCog,
  FaSignOutAlt,
  FaSpinner,
  FaDownload,
  FaPrint,
  FaEye,
  FaChartPie,
  FaChartBar,
  FaAmbulance,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const DoctorReports = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reports");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "doctor") {
      navigate("/doctor-login");
      return;
    }
    setDoctor(currentUser);
    loadReports();
  }, []);

  const loadReports = () => {
    setLoading(true);
    
    // Get appointments
    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const doctorAppointments = allAppointments.filter(
      app => app.doctorId === doctor?.id || app.doctorName === doctor?.name
    );
    setAppointments(doctorAppointments);
    
    // Get unique patients
    const patientMap = new Map();
    doctorAppointments.forEach(app => {
      const patientId = app.patientId || app.patientEmail;
      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, {
          id: patientId,
          name: app.patientName || app.patient,
          email: app.patientEmail,
        });
      }
    });
    setPatients(Array.from(patientMap.values()));
    
    setLoading(false);
  };

  // Listen for updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "appointments" || e.key === "currentUser") {
        loadReports();
      }
    };
    const handleDataUpdate = () => loadReports();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("dataUpdated", handleDataUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("dataUpdated", handleDataUpdate);
    };
  }, [doctor]);

  const total = appointments.length;
  const pending = appointments.filter(a => a.status?.toLowerCase() === "pending").length;
  const approved = appointments.filter(a => a.status?.toLowerCase() === "approved" || a.status?.toLowerCase() === "confirmed").length;
  const completed = appointments.filter(a => a.status?.toLowerCase() === "completed").length;
  const cancelled = appointments.filter(a => a.status?.toLowerCase() === "rejected" || a.status?.toLowerCase() === "cancelled").length;

  const onlineAppointments = appointments.filter(a => a.type?.toLowerCase() === "online").length;
  const inPersonAppointments = appointments.filter(a => a.type?.toLowerCase() === "in-person").length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pendingRate = total > 0 ? Math.round((pending / total) * 100) : 0;

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
              <FaFileMedical className="text-pink-500" />
              Reports & Analytics
            </h2>
            <p className="text-sm text-gray-500 mt-1">View detailed reports and analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadReports} className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100 hover:bg-pink-50 transition-all text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaSpinner className={`${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard title="Total Appointments" value={total} icon={<FaCalendarCheck />} color="pink" />
          <StatCard title="Patients" value={patients.length} icon={<FaUsers />} color="purple" />
          <StatCard title="Completion Rate" value={`${completionRate}%`} icon={<FaChartLine />} color="green" />
          <StatCard title="Pending Rate" value={`${pendingRate}%`} icon={<FaClock />} color="yellow" />
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Status Distribution */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <FaChartPie className="text-pink-500" />
              Appointment Status
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold">{pending} ({total > 0 ? Math.round((pending/total)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 rounded-full h-2" style={{ width: `${total > 0 ? (pending/total)*100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Approved</span>
                  <span className="font-semibold">{approved} ({total > 0 ? Math.round((approved/total)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 rounded-full h-2" style={{ width: `${total > 0 ? (approved/total)*100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold">{completed} ({total > 0 ? Math.round((completed/total)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 rounded-full h-2" style={{ width: `${total > 0 ? (completed/total)*100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Cancelled</span>
                  <span className="font-semibold">{cancelled} ({total > 0 ? Math.round((cancelled/total)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 rounded-full h-2" style={{ width: `${total > 0 ? (cancelled/total)*100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Type Distribution */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <FaChartBar className="text-pink-500" />
              Appointment Types
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Online</span>
                  <span className="font-semibold">{onlineAppointments} ({total > 0 ? Math.round((onlineAppointments/total)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-sky-500 rounded-full h-2" style={{ width: `${total > 0 ? (onlineAppointments/total)*100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">In-Person</span>
                  <span className="font-semibold">{inPersonAppointments} ({total > 0 ? Math.round((inPersonAppointments/total)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 rounded-full h-2" style={{ width: `${total > 0 ? (inPersonAppointments/total)*100 : 0}%` }}></div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">Most common appointment type: <span className="font-semibold">{onlineAppointments >= inPersonAppointments ? "Online" : "In-Person"}</span></p>
            </div>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <FaUser className="text-pink-500" />
            Recent Patients
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pink-100">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Patient</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Email</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Appointments</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.slice(0, 10).map((patient) => {
                  const patientAppointments = appointments.filter(a => a.patientId === patient.id || a.patientEmail === patient.email);
                  const completedCount = patientAppointments.filter(a => a.status?.toLowerCase() === "completed").length;
                  const pendingCount = patientAppointments.filter(a => a.status?.toLowerCase() === "pending").length;
                  
                  return (
                    <tr key={patient.id} className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-2 px-3 font-medium text-gray-800">{patient.name}</td>
                      <td className="py-2 px-3 text-gray-600">{patient.email}</td>
                      <td className="py-2 px-3 text-gray-600">{patientAppointments.length}</td>
                      <td className="py-2 px-3">
                        {completedCount > 0 && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full mr-1">✓ {completedCount}</span>}
                        {pendingCount > 0 && <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">⏳ {pendingCount}</span>}
                      </td>
                    </tr>
                  );
                })}
                {patients.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-400">No patients found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

export default DoctorReports;