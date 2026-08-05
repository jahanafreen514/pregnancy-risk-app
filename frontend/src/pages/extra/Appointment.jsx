import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHeartbeat,
  FaFileMedical,
  FaStethoscope,
  FaBaby,
  FaNotesMedical,
  FaLightbulb,
  FaChartLine,
  FaBell,
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaVideo,
  FaUserMd,
  FaCalendarCheck,
  FaClipboardList,
  FaHospital,
  FaTimes,
  FaUserCircle,
  FaPhone,
  FaEnvelope,
  FaSpinner,
  FaStar,
  FaTrash,
  FaEdit,
  FaCheck,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";
const API_URL = "http://127.0.0.1:8000/api";

function Appointments() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    doctorName: "",
    doctorEmail: "",
    patientName: "",
    patientEmail: "",
    date: "",
    time: "",
    type: "in-person",
    notes: "",
  });

  // Load user + verified doctors + requests
  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser")
    );

    if(currentUser){
      setUser(currentUser);
    }

    const savedRequests = JSON.parse(
      localStorage.getItem("doctorAppointmentRequests")
    ) || [];

    setDoctorRequests(savedRequests);

    fetchVerifiedDoctors();
  }, []);

  // Fetch only admin approved doctors
  const fetchVerifiedDoctors = async() => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/doctors/verified"
      );

      const data = await response.json();

      const formattedDoctors = data.map((doctor) => ({
        id: doctor.id,
        user_id: doctor.user_id || doctor.id,
        name: doctor.name,
        specialty: doctor.specialization || "Maternal Health Specialist",
        experience: "Verified Doctor",
        hospitalName: doctor.hospital || "GlowCare Hospital",
        location: "GlowCare Partner Hospital",
        availability: "Available",
        status: "Available",
        statusBg: "bg-green-50 border-green-200 text-green-700",
        badgeBg: "bg-pink-100 text-pink-500",
        rating: 5,
        reviews: 0,
        phone: doctor.phone || "",
        email: doctor.email
      }));

      setDoctors(formattedDoctors);
    } catch(error) {
      console.log("Verified doctor fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save requests whenever changed
  useEffect(() => {
    localStorage.setItem(
      "doctorAppointmentRequests",
      JSON.stringify(doctorRequests)
    );
  }, [doctorRequests]);

  // Open booking form
  const openBookingForm = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingForm({
      doctorName: doctor.name,
      doctorEmail: doctor.email,
      patientName: user?.name || "",
      patientEmail: user?.email || "",
      date: "",
      time: "",
      type: "in-person",
      notes: "",
    });
    setShowBookingForm(true);
  };

  // Close booking form
  const closeBookingForm = () => {
    setShowBookingForm(false);
    setSelectedDoctor(null);
  };

  // Submit booking request to API
  const submitBookingRequest = async (e) => {
  e.preventDefault();

  if (!bookingForm.date || !bookingForm.time) {
    alert("Please select date and time");
    return;
  }

  // Access token is stored separately
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Your login session was not found. Please login again.");
    window.location.href = "/login";
    return;
  }

  if (!selectedDoctor?.id) {
    alert("Doctor information is missing.");
    return;
  }

  try {
    const scheduledDate = new Date(
      `${bookingForm.date}T${bookingForm.time}`
    );

    const response = await fetch(
      `${API_URL}/appointments`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          // Use doctor ID from verified doctors API
          doctor_id:
            selectedDoctor.user_id ||
            selectedDoctor.id,

          scheduled_for:
            scheduledDate.toISOString(),

          reason:
            bookingForm.notes || null,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Appointment API error:",
        data
      );

      throw new Error(
        data.detail ||
        "Appointment booking failed"
      );
    }

    console.log(
      "Appointment created:",
      data
    );

    alert(
      "Appointment request sent successfully"
    );

    closeBookingForm();

  } catch (error) {

    console.error(
      "Appointment error:",
      error
    );

    alert(
      error.message ||
      "Unable to book appointment"
    );
  }
};

  // Update appointment status (for doctor - this would be called from doctor dashboard)
  const updateAppointmentStatus = (requestId, newStatus) => {
    const updatedRequests = doctorRequests.map(req => 
      req.id === requestId 
        ? { ...req, status: newStatus, updatedAt: new Date().toISOString() } 
        : req
    );
    setDoctorRequests(updatedRequests);
    
    // Update in localStorage
    const allRequests = JSON.parse(localStorage.getItem("doctorAppointmentRequests")) || [];
    const updated = allRequests.map(req => 
      req.id === requestId 
        ? { ...req, status: newStatus, updatedAt: new Date().toISOString() } 
        : req
    );
    localStorage.setItem("doctorAppointmentRequests", JSON.stringify(updated));
  };

  // Cancel appointment (user)
  const cancelAppointment = (requestId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const updatedRequests = doctorRequests.map(req => 
        req.id === requestId 
          ? { ...req, status: "cancelled", updatedAt: new Date().toISOString() } 
          : req
      );
      setDoctorRequests(updatedRequests);
      
      const allRequests = JSON.parse(localStorage.getItem("doctorAppointmentRequests")) || [];
      const updated = allRequests.map(req => 
        req.id === requestId 
          ? { ...req, status: "cancelled", updatedAt: new Date().toISOString() } 
          : req
      );
      localStorage.setItem("doctorAppointmentRequests", JSON.stringify(updated));
      alert("Appointment cancelled successfully.");
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return statusMap[status] || statusMap.pending;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "pending": return "⏳";
      case "approved": return "✅";
      case "rejected": return "❌";
      case "completed": return "✔️";
      case "cancelled": return "🚫";
      default: return "⏳";
    }
  };

  // Get user's appointments
  const userAppointments = doctorRequests.filter(
    req => req.patientEmail === user?.email
  );

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
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-pink-200 blur-[120px] opacity-10 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* SIDEBAR */}
      <div className="relative z-10 w-64 bg-white/80 backdrop-blur-2xl border-r border-pink-100/50 p-5 flex-shrink-0 h-full flex flex-col overflow-y-auto">
        <Link to="/dashboard" className="block">
          <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
          <p className="text-sm text-gray-500">Maternal Health System</p>
        </Link>

        <div className="mt-8 space-y-2 flex-1 overflow-y-auto">
          <NavItem label="Dashboard" icon={<FaHeartbeat />} to="/dashboard" />
          <NavItem label="Reports" icon={<FaFileMedical />} to="/reports" />
          <NavItem label="Pregnancy Toolkit" icon={<FaBaby />} to="/toolkit" />
          <NavItem label="Symptoms" icon={<FaNotesMedical />} to="/symptoms" />
          <NavItem label="Suggestions" icon={<FaLightbulb />} to="/suggestions" />
          <NavItem label="Prediction" icon={<FaChartLine />} to="/prediction" />
          <NavItem label="Alerts" icon={<FaBell />} to="/alerts" />
          <NavItem label="Appointments" icon={<FaCalendarAlt />} to="/appointment" active />
          <NavItem label="Profile" icon={<FaUser />} to="/profile" />
        </div>

        <div className="pt-4 border-t border-pink-100/50">
          <button
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/login";
            }}
            className="w-full bg-pink-100 text-pink-600 px-5 py-2 rounded-xl hover:bg-pink-200 transition-all duration-300 text-sm font-semibold"
          >
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
              <FaCalendarAlt className="text-pink-500" />
              Find a Doctor
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Connect with verified maternal health specialists
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.name?.split(" ")[0] || "User"}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Verified Doctors"
            value={doctors.length}
            icon={<FaUserMd />}
            color="green"
          />
          <StatCard
            title="My Appointments"
            value={userAppointments.length}
            icon={<FaCalendarCheck />}
            color="pink"
          />
          <StatCard
            title="Pending"
            value={userAppointments.filter((a) => a.status === "pending").length}
            icon={<FaClock />}
            color="yellow"
          />
          <StatCard
            title="Approved"
            value={userAppointments.filter((a) => a.status === "approved").length}
            icon={<FaCheckCircle />}
            color="sky"
          />
        </div>

        {/* My Appointments Section */}
        {userAppointments.length > 0 && (
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaCalendarCheck className="text-pink-500"/>
              My Appointments
            </h3>

            <div className="space-y-3">
              {userAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-pink-100/50 hover:shadow-md transition-all"
                >
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-semibold text-gray-800">
                          {appt.doctorName}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(appt.status)}`}
                        >
                          {getStatusIcon(appt.status)}
                          {appt.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-pink-400"/>
                          {appt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="text-pink-400"/>
                          {appt.time}
                        </span>
                        <span className="flex items-center gap-1">
                          {appt.type === "online"
                            ? <FaVideo className="text-sky-400"/>
                            : <FaHospital className="text-purple-400"/>
                          }
                          {appt.type === "online" ? "Online" : "In-Person"}
                        </span>
                      </div>

                      {appt.notes && (
                        <p className="text-xs text-gray-400 mt-2">
                          📝 {appt.notes}
                        </p>
                      )}
                    </div>

                    {appt.status === "pending" && (
                      <button
                        onClick={() => cancelAppointment(appt.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                      >
                        <FaTrash/>
                        Cancel
                      </button>
                    )}

                    {appt.status === "approved" && (
                      <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                        <FaCheck/>
                        Confirmed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctors List */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              Available Verified Doctors
            </h3>
            <span className="text-sm text-gray-500 bg-pink-50 px-3 py-1 rounded-full">
              {doctors.length} available
            </span>
          </div>

          {doctors.length === 0 ? (
            <div className="text-center py-10">
              <FaUserMd className="mx-auto text-4xl text-gray-300"/>
              <p className="text-gray-500 mt-3">
                No verified doctors available
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {doctors.map((doc) => (
                <DoctorCard
                  key={doc.id}
                  doctor={doc}
                  onBook={() => openBookingForm(doc)}
                  userEmail={user?.email}
                />
              ))}
            </div>
          )}
        </div>
         
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-pink-100/50 pt-6">
          <p>© 2026 GlowCare — Safe Pregnancy, Smart Monitoring 🤰</p>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-white relative space-y-4 max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={closeBookingForm} 
              className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 transition-colors p-2"
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500 text-xl mb-2">
              <FaCalendarCheck />
            </div>

            <h3 className="text-2xl font-bold text-gray-800">Book Appointment</h3>
            <p className="text-sm text-gray-500">
              Request an appointment with <span className="font-semibold text-pink-500">{selectedDoctor.name}</span>
            </p>

            <form onSubmit={submitBookingRequest} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={bookingForm.patientName}
                    onChange={(e) => setBookingForm({...bookingForm, patientName: e.target.value})}
                    className="w-full rounded-xl border border-pink-100 bg-white/90 px-4 py-2.5 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Patient Email</label>
                  <input
                    type="email"
                    value={bookingForm.patientEmail}
                    onChange={(e) => setBookingForm({...bookingForm, patientEmail: e.target.value})}
                    className="w-full rounded-xl border border-pink-100 bg-white/90 px-4 py-2.5 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                    className="w-full rounded-xl border border-pink-100 bg-white/90 px-4 py-2.5 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                    className="w-full rounded-xl border border-pink-100 bg-white/90 px-4 py-2.5 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Appointment Type</label>
                <select
                  value={bookingForm.type}
                  onChange={(e) => setBookingForm({...bookingForm, type: e.target.value})}
                  className="w-full rounded-xl border border-pink-100 bg-white/90 px-4 py-2.5 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="in-person">In-Person Visit</option>
                  <option value="online">Online Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                  rows="3"
                  placeholder="Any special requests or notes..."
                  className="w-full rounded-xl border border-pink-100 bg-white/90 px-4 py-2.5 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-sky-400 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
                >
                  Request Appointment
                </button>
                <button
                  type="button"
                  onClick={closeBookingForm}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== COMPONENTS ===== */

const NavItem = ({ label, icon, to, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
      active
        ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg"
        : "hover:bg-pink-100 text-gray-700 hover:translate-x-2"
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    pink: "bg-pink-100 text-pink-600",
    sky: "bg-sky-100 text-sky-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-pink-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const DoctorCard = ({ doctor, onBook, userEmail }) => {
  const hasPendingRequest = () => {
    const requests = JSON.parse(
      localStorage.getItem("doctorAppointmentRequests")
    ) || [];

    return requests.some(
      (req) =>
        req.doctorName === doctor.name &&
        req.patientEmail === userEmail &&
        req.status === "pending"
    );
  };

  return (
    <div className="group bg-white/60 backdrop-blur-md border border-gray-100/70 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
      <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-5">
        {/* Doctor Details */}
        <div className="flex items-start gap-4 flex-1">
          <div
            className={`${doctor.badgeBg} w-14 h-14 rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}
          >
            <FaUserMd/>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h4 className="text-xl font-bold text-gray-800">
                {doctor.name}
              </h4>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${doctor.statusBg}`}
              >
                {doctor.status}
              </span>
            </div>

            <p className="text-sm md:text-base font-semibold text-pink-500 mt-1">
              {doctor.specialty}
            </p>

            <div className="flex flex-col gap-2 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FaHospital className="text-pink-400"/>
                <span>{doctor.hospitalName}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-sky-400"/>
                <span>{doctor.experience}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-sky-400"/>
                <span>{doctor.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-pink-400"/>
                <span>{doctor.availability}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-3 text-yellow-500 text-sm">
              <FaStar/>
              {doctor.rating}
              <span className="text-gray-400">
                ({doctor.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Booking Button */}
        <div className="w-full xl:w-auto">
          <button
            onClick={onBook}
            disabled={hasPendingRequest()}
            className={`w-full xl:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
              hasPendingRequest()
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-sky-400 text-white hover:shadow-lg hover:scale-105"
            }`}
          >
            <FaCalendarCheck/>
            {hasPendingRequest() ? "Request Pending" : "Book Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appointments;