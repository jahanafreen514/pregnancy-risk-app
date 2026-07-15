// DoctorAppointments.jsx - Fixed for unique appointments per doctor
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaChartLine,
  FaUsers,
  FaFileMedical,
  FaPrescription,
  FaBell,
  FaUserMd,
  FaCog,
  FaSignOutAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaSearch,
  FaEnvelope,
  FaPhone,
  FaUndo,
  FaPlus,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("appointments");
  const [showStatusMessage, setShowStatusMessage] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "doctor") {
      navigate("/doctor-login");
      return;
    }
    setDoctor(currentUser);
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    setLoading(true);
    
    // Get all appointments from localStorage
    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    
    console.log("All appointments:", allAppointments);
    console.log("Current doctor:", doctor);
    
    // Filter appointments for this specific doctor
    // Check multiple fields to ensure we get all appointments for this doctor
    const doctorAppointments = allAppointments.filter(app => {
      const isForDoctor = 
        app.doctorId === doctor?.id ||
        app.doctorId?.toString() === doctor?.id?.toString() ||
        app.doctorName === doctor?.name ||
        app.doctorName?.toLowerCase() === doctor?.name?.toLowerCase() ||
        app.doctorEmail === doctor?.email ||
        app.doctor === doctor?.name;
      
      return isForDoctor;
    });
    
    console.log("Doctor appointments before dedupe:", doctorAppointments);
    
    // Remove duplicates based on appointment ID
    const uniqueAppointments = [];
    const seenIds = new Set();
    
    for (const app of doctorAppointments) {
      if (app.id && !seenIds.has(app.id)) {
        seenIds.add(app.id);
        uniqueAppointments.push(app);
      }
    }
    
    console.log("Unique appointments:", uniqueAppointments);
    
    // Sort by date (newest first)
    uniqueAppointments.sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(b.date) - new Date(a.date);
      }
      return (a.time || "").localeCompare(b.time || "");
    });
    
    setAppointments(uniqueAppointments);
    setFilteredAppointments(uniqueAppointments);
    setLoading(false);
  };

  // Filter appointments
  useEffect(() => {
    let filtered = [...appointments];

    // Search filter
    if (searchTerm && searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(app => {
        const patientName = (app.patientName || app.patient || "").toLowerCase();
        const patientEmail = (app.patientEmail || "").toLowerCase();
        const patientPhone = (app.patientPhone || "").toLowerCase();
        
        return patientName.includes(searchLower) || 
               patientEmail.includes(searchLower) || 
               patientPhone.includes(searchLower);
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => {
        const appStatus = (app.status || "").toLowerCase();
        return appStatus === statusFilter.toLowerCase();
      });
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(app => {
        const appType = (app.type || "").toLowerCase();
        return appType === typeFilter.toLowerCase();
      });
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, typeFilter, appointments]);

  // Listen for real-time updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "appointments" || e.key === "currentUser") {
        loadAppointments();
      }
    };

    const handleAppointmentUpdate = () => {
      loadAppointments();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("appointmentUpdated", handleAppointmentUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("appointmentUpdated", handleAppointmentUpdate);
    };
  }, [doctor]);

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    
    const appointmentToUpdate = allAppointments.find(a => a.id === appointmentId);
    
    if (!appointmentToUpdate) {
      console.error("Appointment not found");
      return;
    }

    const updatedAppointments = allAppointments.map(app =>
      app.id === appointmentId ? { 
        ...app, 
        status: newStatus, 
        updatedAt: new Date().toISOString() 
      } : app
    );
    
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    
    // Add notification
    const notifs = JSON.parse(localStorage.getItem("doctorNotifications")) || [];
    const statusMessages = {
      approved: "✅ Confirmed",
      rejected: "❌ Declined", 
      completed: "📋 Completed",
      pending: "⏳ Pending",
      cancelled: "❌ Cancelled"
    };
    
    notifs.push({
      id: Date.now(),
      type: "appointment_update",
      patientName: appointmentToUpdate.patientName || appointmentToUpdate.patient,
      message: `Appointment with ${appointmentToUpdate.patientName || appointmentToUpdate.patient} ${statusMessages[newStatus] || "📋 Updated"}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("doctorNotifications", JSON.stringify(notifs));
    
    setShowStatusMessage({
      message: `Appointment ${statusMessages[newStatus] || "updated"} successfully!`,
      type: newStatus === "approved" || newStatus === "completed" ? "success" : "error"
    });
    
    setTimeout(() => setShowStatusMessage(null), 3000);
    
    loadAppointments();
    window.dispatchEvent(new Event("appointmentUpdated"));
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-gray-100 text-gray-700 border-gray-200",
      confirmed: "bg-green-100 text-green-700 border-green-200",
    };
    return statusMap[status?.toLowerCase()] || statusMap.pending;
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "approved":
      case "confirmed":
        return <FaCheckCircle className="text-green-500" />;
      case "completed":
        return <FaCheckCircle className="text-blue-500" />;
      case "rejected":
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return dateString;
    }
  };

  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  // Calculate stats
  const total = appointments.length;
  const pending = appointments.filter(a => a.status?.toLowerCase() === "pending").length;
  const approved = appointments.filter(a => a.status?.toLowerCase() === "approved" || a.status?.toLowerCase() === "confirmed").length;
  const completed = appointments.filter(a => a.status?.toLowerCase() === "completed").length;
  const cancelled = appointments.filter(a => a.status?.toLowerCase() === "rejected" || a.status?.toLowerCase() === "cancelled").length;

  const isFilterActive = searchTerm || statusFilter !== "all" || typeFilter !== "all";

  const addSampleAppointments = () => {
    // Check if we already have appointments for this doctor
    const existingAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    
    // Only add samples if the doctor has no appointments
    const doctorHasAppointments = existingAppointments.some(
      app => app.doctorId === doctor?.id || app.doctorName === doctor?.name
    );
    
    if (doctorHasAppointments) {
      setShowStatusMessage({
        message: "You already have appointments!",
        type: "error"
      });
      setTimeout(() => setShowStatusMessage(null), 3000);
      return;
    }
    
    const sampleAppointments = [
      {
        id: "sample1_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
        patientName: "Sarah Johnson",
        patientEmail: "sarah@email.com",
        patientPhone: "+1 234 567 890",
        doctorId: doctor?.id,
        doctorName: doctor?.name,
        doctorEmail: doctor?.email,
        date: new Date().toISOString().split('T')[0],
        time: "10:00 AM",
        type: "online",
        status: "pending",
        notes: "First pregnancy checkup",
        createdAt: new Date().toISOString()
      },
      {
        id: "sample2_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
        patientName: "Priya Sharma",
        patientEmail: "priya@email.com",
        patientPhone: "+91 98765 43210",
        doctorId: doctor?.id,
        doctorName: doctor?.name,
        doctorEmail: doctor?.email,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: "2:30 PM",
        type: "in-person",
        status: "pending",
        notes: "Follow-up appointment",
        createdAt: new Date().toISOString()
      },
      {
        id: "sample3_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
        patientName: "Emily Davis",
        patientEmail: "emily@email.com",
        patientPhone: "+1 345 678 901",
        doctorId: doctor?.id,
        doctorName: doctor?.name,
        doctorEmail: doctor?.email,
        date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        time: "11:00 AM",
        type: "online",
        status: "approved",
        notes: "Routine checkup",
        createdAt: new Date().toISOString()
      }
    ];
    
    // Add sample appointments to existing ones
    const allAppointments = [...existingAppointments, ...sampleAppointments];
    localStorage.setItem("appointments", JSON.stringify(allAppointments));
    
    loadAppointments();
    setShowStatusMessage({
      message: "Sample appointments added successfully!",
      type: "success"
    });
    setTimeout(() => setShowStatusMessage(null), 3000);
  };

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
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* Floating Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-pink-300 blur-[140px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-pink-200 blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: "1s" }}></div>

      {/* Status Message Toast */}
      {showStatusMessage && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${
          showStatusMessage.type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white font-medium animate-slide-in`}>
          {showStatusMessage.message}
        </div>
      )}

      {/* SIDEBAR */}
      <div className="relative z-10 w-64 bg-white/80 backdrop-blur-2xl border-r border-pink-100/50 flex-shrink-0 h-full flex flex-col">
        {/* Doctor Profile */}
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

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavItem 
            label="Dashboard" 
            icon={<FaChartLine />} 
            to="/doctor-dashboard" 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")}
          />
          <NavItem 
            label="Patients" 
            icon={<FaUsers />} 
            to="/doctor-patients" 
            active={activeTab === "patients"} 
            onClick={() => setActiveTab("patients")}
          />
          <NavItem 
            label="Appointments" 
            icon={<FaCalendarCheck />} 
            to="/doctor-appointments" 
            active={activeTab === "appointments"} 
            onClick={() => setActiveTab("appointments")}
            badge={pending}
          />
          <NavItem 
            label="Reports" 
            icon={<FaFileMedical />} 
            to="/doctor-reports" 
            active={activeTab === "reports"} 
            onClick={() => setActiveTab("reports")}
          />
          <NavItem 
            label="Prescriptions" 
            icon={<FaPrescription />} 
            to="/doctor-prescriptions" 
            active={activeTab === "prescriptions"} 
            onClick={() => setActiveTab("prescriptions")}
          />
          <NavItem 
            label="Notifications" 
            icon={<FaBell />} 
            to="/doctor-notifications" 
            active={activeTab === "notifications"} 
            onClick={() => setActiveTab("notifications")}
          />
          <NavItem 
            label="Profile" 
            icon={<FaUserMd />} 
            to="/doctor-profile" 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")}
          />
          <NavItem 
            label="Settings" 
            icon={<FaCog />} 
            to="/doctor-settings" 
            active={activeTab === "settings"} 
            onClick={() => setActiveTab("settings")}
          />
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-pink-100/50">
          <button
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/doctor-login";
            }}
            className="w-full flex items-center justify-center gap-2 bg-pink-50 text-pink-600 px-4 py-2.5 rounded-xl hover:bg-pink-100 transition-all duration-300 text-sm font-semibold"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-4 h-full overflow-y-auto">
        {/* Top Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <FaCalendarCheck className="text-pink-500" />
              Appointments
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage all patient appointments
            </p>
          </div>
          <div className="flex items-center gap-3">
            {appointments.length === 0 && (
              <button
                onClick={addSampleAppointments}
                className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-600 transition-all flex items-center gap-2"
              >
                <FaPlus /> Add Sample
              </button>
            )}
            <button
              onClick={loadAppointments}
              className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100 hover:bg-pink-50 transition-all text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <FaSpinner className={`${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
              <span className="text-sm font-medium text-gray-700">{total} Total</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <StatCard title="Total" value={total} icon={<FaCalendarCheck />} color="pink" />
          <StatCard title="Pending" value={pending} icon={<FaClock />} color="yellow" />
          <StatCard title="Approved" value={approved} icon={<FaCheckCircle />} color="green" />
          <StatCard title="Completed" value={completed} icon={<FaCheckCircle />} color="blue" />
          <StatCard title="Cancelled" value={cancelled} icon={<FaTimesCircle />} color="red" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
          <div className="flex-1 min-w-[200px] relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-pink-100 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimesCircle />
              </button>
            )}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-pink-100 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-pink-100 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          >
            <option value="all">All Types</option>
            <option value="online">Online</option>
            <option value="in-person">In-Person</option>
          </select>
          {isFilterActive && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl bg-pink-100 text-pink-600 hover:bg-pink-200 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <FaUndo /> Clear Filters
            </button>
          )}
          <div className="flex items-center px-3 text-sm text-gray-500">
            Showing {filteredAppointments.length} of {appointments.length}
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
          {appointments.length === 0 && (
            <div className="mb-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-sm text-yellow-700">
                No appointments found. Click "Add Sample" to add test appointments, or wait for patients to book.
              </p>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pink-100">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 && appointments.length > 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400">
                      <FaSearch className="text-4xl mx-auto mb-2 opacity-50" />
                      <p className="font-medium">No appointments match your filters</p>
                      <p className="text-xs mt-1">Try adjusting your search or filters</p>
                      {isFilterActive && (
                        <button
                          onClick={clearFilters}
                          className="mt-2 px-4 py-1.5 bg-pink-100 text-pink-600 rounded-lg text-xs font-medium hover:bg-pink-200 transition-all"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400">
                      <FaCalendarCheck className="text-4xl mx-auto mb-2 opacity-50" />
                      <p className="font-medium">No appointments found</p>
                      <p className="text-xs mt-1">Patient appointments will appear here once booked</p>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((app) => (
                    <tr key={app.id} className="border-b border-pink-50 hover:bg-pink-50/30 transition-all cursor-pointer" onClick={() => viewAppointmentDetails(app)}>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                            {app.patientName?.charAt(0) || app.patient?.charAt(0) || "P"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{app.patientName || app.patient || "Unknown"}</p>
                            <p className="text-xs text-gray-400">{app.patientEmail || "No email"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-700">{formatDate(app.date)}</td>
                      <td className="py-3 px-3 text-gray-700">{app.time || "N/A"}</td>
                      <td className="py-3 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${app.type?.toLowerCase() === "online" ? "bg-sky-100 text-sky-700" : "bg-purple-100 text-purple-700"}`}>
                          {app.type?.toLowerCase() === "online" ? "Online" : "In-Person"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                          {getStatusIcon(app.status)}
                          {app.status ? (app.status.charAt(0).toUpperCase() + app.status.slice(1)) : "Unknown"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-2">
                          {app.status?.toLowerCase() === "pending" && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateAppointmentStatus(app.id, "approved");
                                }}
                                className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateAppointmentStatus(app.id, "rejected");
                                }}
                                className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {(app.status?.toLowerCase() === "approved" || app.status?.toLowerCase() === "confirmed") && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateAppointmentStatus(app.id, "completed");
                                }}
                                className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                              >
                                Complete
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateAppointmentStatus(app.id, "pending");
                                }}
                                className="px-3 py-1 text-xs font-medium text-yellow-600 bg-yellow-100 rounded-full hover:bg-yellow-200 transition-colors"
                              >
                                Revert
                              </button>
                            </>
                          )}
                          {app.status?.toLowerCase() === "completed" && (
                            <span className="px-3 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full flex items-center gap-1">
                              <FaCheckCircle /> Done
                            </span>
                          )}
                          {(app.status?.toLowerCase() === "rejected" || app.status?.toLowerCase() === "cancelled") && (
                            <span className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full flex items-center gap-1">
                              <FaTimesCircle /> Declined
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              viewAppointmentDetails(app);
                            }}
                            className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaCalendarCheck className="text-pink-500" />
                Appointment Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
              >
                <FaTimesCircle />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Patient Name</p>
                  <p className="font-semibold text-gray-800">{selectedAppointment.patientName || selectedAppointment.patient}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full border ${getStatusBadge(selectedAppointment.status)}`}>
                    {getStatusIcon(selectedAppointment.status)}
                    {selectedAppointment.status ? (selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)) : "Unknown"}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-semibold text-gray-800">{formatDate(selectedAppointment.date)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-semibold text-gray-800">{selectedAppointment.time || "N/A"}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Type</p>
                  <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full ${selectedAppointment.type?.toLowerCase() === "online" ? "bg-sky-100 text-sky-700" : "bg-purple-100 text-purple-700"}`}>
                    {selectedAppointment.type?.toLowerCase() === "online" ? "💻 Online" : "🏥 In-Person"}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Doctor</p>
                  <p className="font-semibold text-gray-800">{selectedAppointment.doctorName || doctor?.name}</p>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Notes</p>
                  <p className="text-gray-800">{selectedAppointment.notes}</p>
                </div>
              )}

              {selectedAppointment.patientEmail && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Contact</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1 text-gray-700">
                      <FaEnvelope className="text-pink-400" /> {selectedAppointment.patientEmail}
                    </span>
                    {selectedAppointment.patientPhone && (
                      <span className="flex items-center gap-1 text-gray-700">
                        <FaPhone className="text-pink-400" /> {selectedAppointment.patientPhone}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {selectedAppointment.status?.toLowerCase() === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        updateAppointmentStatus(selectedAppointment.id, "approved");
                        closeModal();
                      }}
                      className="flex-1 min-w-[120px] bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        updateAppointmentStatus(selectedAppointment.id, "rejected");
                        closeModal();
                      }}
                      className="flex-1 min-w-[120px] bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition-colors"
                    >
                      Decline
                    </button>
                  </>
                )}
                {(selectedAppointment.status?.toLowerCase() === "approved" || selectedAppointment.status?.toLowerCase() === "confirmed") && (
                  <>
                    <button
                      onClick={() => {
                        updateAppointmentStatus(selectedAppointment.id, "completed");
                        closeModal();
                      }}
                      className="flex-1 min-w-[120px] bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => {
                        updateAppointmentStatus(selectedAppointment.id, "pending");
                        closeModal();
                      }}
                      className="flex-1 min-w-[120px] bg-yellow-500 text-white py-2 rounded-xl hover:bg-yellow-600 transition-colors"
                    >
                      Revert
                    </button>
                  </>
                )}
                <button
                  onClick={closeModal}
                  className="flex-1 min-w-[120px] bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition-colors"
                >
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

// ===== NAVITEM COMPONENT =====
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

// ===== STATCARD COMPONENT =====
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

export default DoctorAppointments;