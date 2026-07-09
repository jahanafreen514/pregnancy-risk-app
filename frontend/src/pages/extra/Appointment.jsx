// src/pages/Appointment.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, Plus, Stethoscope, User, MapPin, 
  ChevronRight, CheckCircle, XCircle, Clock as ClockIcon,
  Search, Hospital, Star, Phone, Mail, Navigation, 
  Filter, Sliders, Info, Heart, Shield, Award,
  Building2, Users, BadgeCheck, Video, Mic, CalendarDays
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Appointment = () => {
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showHospitalList, setShowHospitalList] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentType, setAppointmentType] = useState("in-person");

  // Hospitals data
  const hospitals = [
    {
      id: 1,
      name: "City Maternity Hospital",
      address: "123 Health Ave, Medical District",
      distance: "2.5 km",
      rating: 4.8,
      reviews: 1256,
      specialty: "Obstetrics & Gynecology",
      phone: "+91 98765 43210",
      email: "contact@citymaternity.com",
      image: "🏥",
      facilities: ["24/7 Emergency", "NICU", "Lactation Support", "Ultrasound"],
      doctors: ["Dr. Sneha", "Dr. Priya", "Dr. Lakshmi"]
    },
    {
      id: 2,
      name: "Sunrise Women's Hospital",
      address: "45 Sunrise Blvd, Sector 12",
      distance: "4.1 km",
      rating: 4.9,
      reviews: 2134,
      specialty: "Women's Health",
      phone: "+91 87654 32109",
      email: "info@sunrisehospital.com",
      image: "🏨",
      facilities: ["24/7 Emergency", "Neonatal Care", "Vaccination", "Lab Services"],
      doctors: ["Dr. Ananya", "Dr. Meera", "Dr. Kavitha"]
    },
    {
      id: 3,
      name: "Lotus Fertility & Maternity",
      address: "789 Lotus Lane, Phase 2",
      distance: "6.3 km",
      rating: 4.7,
      reviews: 876,
      specialty: "Fertility & Maternity",
      phone: "+91 76543 21098",
      email: "care@lotusfertility.com",
      image: "💒",
      facilities: ["IVF Center", "Genetic Screening", "Counselling", "Yoga Classes"],
      doctors: ["Dr. Priya", "Dr. Suresh", "Dr. Anita"]
    },
    {
      id: 4,
      name: "Healing Hands Medical Center",
      address: "101 Care Street, Town Center",
      distance: "8.7 km",
      rating: 4.6,
      reviews: 543,
      specialty: "General Medicine",
      phone: "+91 65432 10987",
      email: "healing@medicalcenter.com",
      image: "🩺",
      facilities: ["General Checkup", "Lab Services", "Pharmacy", "Ambulance"],
      doctors: ["Dr. Raj", "Dr. Maya", "Dr. Kumar"]
    }
  ];

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      type: "Prenatal Checkup",
      doctor: "Dr. Sneha",
      specialty: "Obstetrician",
      hospital: "City Maternity Hospital",
      date: "2026-06-25",
      time: "10:00",
      location: "City Hospital - Room 302",
      status: "confirmed",
      notes: "Regular checkup, bring previous reports",
      type: "in-person"
    },
    {
      id: 2,
      type: "Ultrasound Scan",
      doctor: "Dr. Priya",
      specialty: "Radiologist",
      hospital: "Sunrise Women's Hospital",
      date: "2026-07-02",
      time: "14:30",
      location: "City Hospital - Room 105",
      status: "pending",
      notes: "Anomaly scan - 20 weeks",
      type: "in-person"
    },
    {
      id: 3,
      type: "Glucose Test",
      doctor: "Lab Specialist",
      specialty: "Pathologist",
      hospital: "Lab Center",
      date: "2026-07-10",
      time: "09:00",
      location: "Lab Center - Floor 2",
      status: "confirmed",
      notes: "Fasting required for 8 hours",
      type: "in-person"
    },
  ]);

  const [form, setForm] = useState({
    type: "",
    doctor: "",
    specialty: "",
    hospital: "",
    date: "",
    time: "",
    location: "",
    notes: "",
    type: "in-person"
  });

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
    setForm({
      ...form,
      hospital: hospital.name,
      location: hospital.address,
      doctor: hospital.doctors[0] || "",
      specialty: hospital.specialty
    });
    setShowHospitalList(false);
  };

  const handleBookOrUpdate = () => {
    if (!form.type || !form.doctor || !form.date || !form.time) {
      alert("Please fill all required fields");
      return;
    }

    const newAppointment = {
      id: editingId || (appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1),
      ...form,
      status: editingId ? appointments.find(a => a.id === editingId)?.status || "pending" : "pending",
      type: form.type || "in-person"
    };

    if (editingId) {
      setAppointments(
        appointments.map((appt) =>
          appt.id === editingId ? newAppointment : appt
        )
      );
    } else {
      setAppointments([...appointments, newAppointment]);
    }

    setForm({ type: "", doctor: "", specialty: "", hospital: "", date: "", time: "", location: "", notes: "", type: "in-person" });
    setEditingId(null);
    setShowBookForm(false);
    setSelectedHospital(null);
    alert(editingId ? "Appointment Rescheduled Successfully!" : "Appointment Booked Successfully!");
  };

  const handleRescheduleClick = (appt) => {
    setForm({
      type: appt.type,
      doctor: appt.doctor,
      specialty: appt.specialty || "",
      hospital: appt.hospital || "",
      date: appt.date,
      time: appt.time,
      location: appt.location || "",
      notes: appt.notes || "",
      type: appt.type || "in-person"
    });
    setEditingId(appt.id);
    setShowBookForm(true);
  };

  const handleCancel = () => {
    setForm({ type: "", doctor: "", specialty: "", hospital: "", date: "", time: "", location: "", notes: "", type: "in-person" });
    setEditingId(null);
    setShowBookForm(false);
    setSelectedHospital(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle size={16} className="text-green-600" />;
      case 'pending': return <ClockIcon size={16} className="text-yellow-600" />;
      case 'cancelled': return <XCircle size={16} className="text-red-600" />;
      default: return null;
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    const matchesStatus = selectedStatus === "all" || appt.status === selectedStatus;
    const matchesSearch = appt.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          appt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (appt.hospital && appt.hospital.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50">
     
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="bg-gradient-to-r from-[#FF6B8A] to-[#FF8A9B] p-3 rounded-2xl shadow-lg shadow-pink-200">
                <Calendar className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#2D1B3D]">
                  My Appointments
                </h1>
                <p className="text-gray-600 mt-1">Find hospitals and book online consultations</p>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                handleCancel();
                setShowBookForm(!showBookForm);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B8A] to-[#FF8A9B] hover:from-[#FF5A7A] hover:to-[#FF7A8B] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-pink-200"
            >
              <Plus size={20} />
              Book Appointment
            </motion.button>
          </div>

          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8"
          >
            {[
              { label: "Total", value: appointments.length, icon: Calendar, color: "pink" },
              { label: "Upcoming", value: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length, icon: Clock, color: "green" },
              { label: "Confirmed", value: appointments.filter(a => a.status === 'confirmed').length, icon: CheckCircle, color: "blue" },
              { label: "Pending", value: appointments.filter(a => a.status === 'pending').length, icon: ClockIcon, color: "yellow" },
              { label: "Hospitals", value: hospitals.length, icon: Hospital, color: "purple" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl p-4 shadow-sm border border-pink-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#2D1B3D]">{stat.value}</p>
                  </div>
                  <div className={`bg-${stat.color}-100 p-3 rounded-full`}>
                    <stat.icon className={`text-${stat.color}-600`} size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-4 border border-pink-100 mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {["all", "confirmed", "pending", "cancelled"].map((status) => (
                  <motion.button
                    key={status}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedStatus === status
                        ? "bg-[#FF6B8A] text-white shadow-md shadow-pink-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </motion.button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 p-2 rounded-lg border-2 border-pink-100 focus:border-[#FF6B8A] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </motion.div>

          {/* Appointment List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-pink-100"
          >
            <AnimatePresence mode="wait">
              {filteredAppointments.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <Calendar className="mx-auto text-gray-300" size={64} />
                  <p className="text-gray-500 mt-4">No appointments found</p>
                  <button
                    onClick={() => setShowBookForm(true)}
                    className="mt-4 text-[#FF6B8A] font-semibold hover:underline"
                  >
                    Book your first appointment
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      className="bg-gradient-to-r from-pink-50 to-white border border-pink-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl font-bold text-[#2D1B3D]">
                              {item.type}
                            </h3>
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)} flex items-center gap-1`}>
                              {getStatusIcon(item.status)}
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </div>
                            {item.type === "online" && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center gap-1">
                                <Video size={12} /> Online
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                            <div className="flex items-center gap-2 text-gray-700">
                              <User size={16} className="text-[#FF6B8A]" />
                              <span>{item.doctor}</span>
                              {item.specialty && (
                                <span className="text-sm text-gray-500">({item.specialty})</span>
                              )}
                            </div>

                            {item.hospital && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Hospital size={16} className="text-[#FF6B8A]" />
                                <span className="text-sm">{item.hospital}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-gray-700">
                              <Calendar size={16} className="text-[#FF6B8A]" />
                              <span>{item.date}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-700">
                              <Clock size={16} className="text-[#FF6B8A]" />
                              <span>{item.time}</span>
                            </div>

                            {item.location && (
                              <div className="flex items-center gap-2 text-gray-700 col-span-2">
                                <MapPin size={16} className="text-[#FF6B8A]" />
                                <span className="text-sm">{item.location}</span>
                              </div>
                            )}
                          </div>

                          {item.notes && (
                            <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                              📝 {item.notes}
                            </div>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRescheduleClick(item)}
                          className="flex items-center gap-2 bg-white border-2 border-[#FF6B8A] text-[#FF6B8A] hover:bg-[#FF6B8A] hover:text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                        >
                          Reschedule
                          <ChevronRight size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Booking Form Modal */}
          <AnimatePresence>
            {showBookForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={(e) => {
                  if (e.target === e.currentTarget) handleCancel();
                }}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-white rounded-2xl shadow-2xl border-2 border-pink-200 p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#2D1B3D]">
                      {editingId ? "Reschedule Appointment" : "Book New Appointment"}
                    </h2>
                    <motion.button
                      whileHover={{ rotate: 90 }}
                      onClick={handleCancel}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </motion.button>
                  </div>

                  {/* Appointment Type Selection */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-3">
                      Appointment Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setForm({ ...form, type: "in-person" })}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          form.type === "in-person"
                            ? "border-[#FF6B8A] bg-pink-50"
                            : "border-gray-200 hover:border-pink-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Hospital size={20} className={form.type === "in-person" ? "text-[#FF6B8A]" : "text-gray-400"} />
                          <span className="font-medium">In-Person</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Visit hospital/clinic</p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setForm({ ...form, type: "online" })}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          form.type === "online"
                            ? "border-[#FF6B8A] bg-pink-50"
                            : "border-gray-200 hover:border-pink-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Video size={20} className={form.type === "online" ? "text-[#FF6B8A]" : "text-gray-400"} />
                          <span className="font-medium">Online Consultation</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Video call with doctor</p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Hospital Selection */}
                  {form.type === "in-person" && (
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Select Hospital <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setShowHospitalList(!showHospitalList)}
                          className="w-full p-3 rounded-xl bg-pink-50/30 border-2 border-pink-100 focus:border-[#FF6B8A] focus:outline-none transition-colors text-left flex items-center justify-between"
                        >
                          <span className={form.hospital ? "text-gray-800" : "text-gray-400"}>
                            {form.hospital || "Search and select a hospital..."}
                          </span>
                          <Search size={18} className="text-gray-400" />
                        </button>

                        <AnimatePresence>
                          {showHospitalList && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-pink-100 max-h-80 overflow-y-auto"
                            >
                              <div className="p-3">
                                <input
                                  type="text"
                                  placeholder="Search hospitals..."
                                  className="w-full p-2 rounded-lg border border-gray-200 focus:border-[#FF6B8A] focus:outline-none"
                                  onChange={(e) => {
                                    // Filter hospitals based on search
                                  }}
                                />
                              </div>
                              {hospitals.map((hospital) => (
                                <motion.div
                                  key={hospital.id}
                                  whileHover={{ backgroundColor: "#FFF5F5" }}
                                  onClick={() => handleHospitalSelect(hospital)}
                                  className="p-4 cursor-pointer border-b border-gray-100 last:border-0"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="text-2xl">{hospital.image}</div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-[#2D1B3D]">{hospital.name}</h4>
                                        <div className="flex items-center gap-1">
                                          <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                          <span className="text-sm font-medium">{hospital.rating}</span>
                                          <span className="text-xs text-gray-500">({hospital.reviews})</span>
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-600">{hospital.specialty}</p>
                                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                          <MapPin size={12} /> {hospital.distance}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Users size={12} /> {hospital.doctors.length} doctors
                                        </span>
                                      </div>
                                      <div className="flex gap-2 mt-1 flex-wrap">
                                        {hospital.facilities.slice(0, 3).map((facility, idx) => (
                                          <span key={idx} className="px-2 py-0.5 bg-pink-50 rounded-full text-xs text-pink-600">
                                            {facility}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {selectedHospital && form.type === "in-person" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200"
                    >
                      <div className="flex items-start gap-3">
                        <BadgeCheck className="text-green-600" size={20} />
                        <div>
                          <p className="font-medium text-green-800">Hospital Selected</p>
                          <p className="text-sm text-green-700">{selectedHospital.name}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            📍 {selectedHospital.address} • 📞 {selectedHospital.phone}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Appointment Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Prenatal Checkup"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="w-full p-3 rounded-xl bg-pink-50/30 border-2 border-pink-100 focus:border-[#FF6B8A] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Doctor <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.doctor}
                        onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                        className="w-full p-3 rounded-xl bg-pink-50/30 border-2 border-pink-100 focus:border-[#FF6B8A] focus:outline-none transition-colors"
                      >
                        <option value="">Select Doctor</option>
                        {selectedHospital ? (
                          selectedHospital.doctors.map((doc) => (
                            <option key={doc} value={doc}>{doc}</option>
                          ))
                        ) : (
                          <>
                            <option>Dr. Sneha</option>
                            <option>Dr. Priya</option>
                            <option>Dr. Lakshmi</option>
                            <option>Dr. Ananya</option>
                            <option>Lab Specialist</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Specialty
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Obstetrician"
                        value={form.specialty}
                        onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                        className="w-full p-3 rounded-xl bg-pink-50/30 border-2 border-pink-100 focus:border-[#FF6B8A] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full p-3 rounded-xl bg-pink-50/30 border-2 border-pink-100 focus:border-[#FF6B8A] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        className="w-full p-3 rounded-xl bg-pink-50/30 border-2 border-pink-100 focus:border-[#FF6B8A] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., City Hospital - Room 302"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="w-full p-3 rounded-xl bg-pink-50/30 border-2 border-pink-100 focus:border-[#FF6B8A] focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Notes
                      </label>
                      <textarea
                        placeholder="Any additional notes or requirements..."
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full p-3 rounded-xl bg-pink-50/30 border-2 border-pink-100 focus:border-[#FF6B8A] focus:outline-none transition-colors resize-none"
                        rows="3"
                      />
                    </div>
                  </div>

                  {/* Online Consultation Details */}
                  {form.type === "online" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
                    >
                      <div className="flex items-center gap-2 text-blue-800 mb-2">
                        <Video size={18} />
                        <span className="font-medium">Online Consultation Details</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        You will receive a video call link via email before the appointment.
                        Please ensure you have a stable internet connection.
                      </p>
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBookOrUpdate}
                      className="bg-gradient-to-r from-[#FF6B8A] to-[#FF8A9B] hover:from-[#FF5A7A] hover:to-[#FF7A8B] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-pink-200 flex-1"
                    >
                      {editingId ? "Confirm Reschedule" : "Confirm Booking"}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex-1"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Appointment;