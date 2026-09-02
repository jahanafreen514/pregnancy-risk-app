import React, { useState } from "react";
import {
  FaHeartbeat,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaVideo,
  FaUserMd,
  FaCalendarCheck,
  FaBaby,
  FaChartLine,
  FaClipboardList,
  FaHospital,
  FaTimes
} from "react-icons/fa";

const Doctors = [
  {
    id: 1,
    name: "Dr. Sneha",
    specialty: "Senior Consultant Obstetrician",
    experience: "12 Years Exp",
    hospitalName: "Apollo Cradle & Children’s Hospital",
    location: "Hyderabad Clinical Hub",
    availability: "Mon - Fri (09:00 - 13:00)",
    status: "Available Now",
    statusBg: "bg-green-50 border-green-200 text-green-700",
    badgeBg: "bg-pink-100 text-pink-500"
  },
  {
    id: 2,
    name: "Dr. Priya",
    specialty: "Maternal-Fetal Ultrasound Specialist",
    experience: "10 Years Exp",
    hospitalName: "Rainbow Children's Hospital",
    location: "Vijayawada Center",
    availability: "Mon - Sat (11:00 - 16:00)",
    status: "In Consultation",
    statusBg: "bg-amber-50 border-amber-200 text-amber-700",
    badgeBg: "bg-sky-100 text-sky-500"
  },
  {
    id: 3,
    name: "Dr. Lakshmi",
    specialty: "Fetal Medicine & Neonatal Care",
    experience: "15 Years Exp",
    hospitalName: "Ankura Hospital for Women & Children",
    location: "Warangal Care Center",
    availability: "Tue - Sun (08:00 - 12:00)",
    status: "Available Now",
    statusBg: "bg-green-50 border-green-200 text-green-700",
    badgeBg: "bg-pink-100 text-pink-500"
  },
  {
    id: 4,
    name: "Dr. Anjali",
    specialty: "Reproductive Endocrinologist",
    experience: "9 Years Exp",
    hospitalName: "Fernandez Hospital",
    location: "Guntur Care Unit",
    availability: "Mon - Thu (14:00 - 18:00)",
    status: "Available Now",
    statusBg: "bg-green-50 border-green-200 text-green-700",
    badgeBg: "bg-sky-100 text-sky-500"
  },
  {
    id: 5,
    name: "Dr. Meenakshi",
    specialty: "High-Risk Gestational Consultant",
    experience: "18 Years Exp",
    hospitalName: "Cloudnine Hospital",
    location: "Vizag Medical Hub",
    availability: "Wed - Sat (10:00 - 15:00)",
    status: "On Break",
    statusBg: "bg-gray-50 border-gray-200 text-gray-600",
    badgeBg: "bg-pink-100 text-pink-500"
  }
];

function DoctorsList() {
  // Application Interactive States
  const [activeAction, setActiveAction] = useState(null);

  const triggerAction = (doctorName, mode) => {
    setActiveAction({ doctorName, mode });
  };

  const closeOverlay = () => {
    setActiveAction(null);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat text-gray-800 flex flex-col justify-start items-center relative overflow-hidden"
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1920&auto=format&fit=crop')` 
      }}
    >
      {/* Background shading overlay layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-50/95 via-white/90 to-sky-50/90 z-0"></div>
      
      {/* Floating Design Glow Elements */}
      <div className="absolute -top-12 -left-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20 pointer-events-none z-0"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-300 rounded-full blur-3xl opacity-20 pointer-events-none z-0"></div>

      <div className="w-full max-w-7xl flex flex-col relative z-10 p-4 md:p-8">
        
        {/* Header Layout Block */}
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-10 justify-center sm:justify-start">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-sky-400 flex items-center justify-center shadow-xl animate-bounce">
            <FaHeartbeat className="text-white text-3xl animate-pulse" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
              Maternal Health Care
            </h1>
            <p className="text-gray-600 text-base font-medium mt-0.5">
              Smart Maternal Healthcare Platform
            </p>
          </div>
        </div>

        {/* Content Layout split into 2 Columns with equal height stretches */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Left Column: Title, Platform Stats & Seamlessly Stretched How It Works Panel */}
          <div className="lg:col-span-1 flex flex-col gap-6 h-full">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-gray-800 leading-tight">
                Maternal <br /> Specialists Directory
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                Connect seamlessly with verified expert gynecologists, obstetricians, and high-risk fetal health consultants ready to support your pregnancy journey.
              </p>
            </div>

            {/* Quick Statistics Panel */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-sm border border-white p-4 hover:scale-105 transition duration-500">
                <FaBaby className="text-pink-500 text-xl mb-1" />
                <h4 className="text-xl font-bold text-gray-800">25K+</h4>
                <p className="text-[11px] text-gray-500 font-medium">Assisted</p>
              </div>
              <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-sm border border-white p-4 hover:scale-105 transition duration-500">
                <FaChartLine className="text-sky-500 text-xl mb-1" />
                <h4 className="text-xl font-bold text-gray-800">24</h4>
                <p className="text-[11px] text-gray-500 font-medium">Model features</p>
              </div>
              <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-sm border border-white p-4 hover:scale-105 transition duration-500">
                <FaUserMd className="text-pink-500 text-xl mb-1" />
                <h4 className="text-xl font-bold text-gray-800">24/7</h4>
                <p className="text-[11px] text-gray-500 font-medium">Support</p>
              </div>
            </div>

            {/* EXPANDED MATTER: 5-step workflow designed to fully cover vertical alignment heights */}
            <div className="flex-grow bg-white/85 backdrop-blur-xl rounded-3xl shadow-lg p-5 md:p-6 border border-white flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 mb-5">
                  <FaClipboardList className="text-pink-500 text-lg" />
                  <h3 className="text-lg font-bold text-gray-800">Your Care Journey Roadmap</h3>
                </div>
                
                <div className="space-y-4 relative before:absolute before:bottom-2 before:top-2 before:left-[14px] before:w-[2px] before:bg-pink-100/70">
                  
                  <div className="flex gap-4 items-start relative z-10">
                    <div className="w-7 h-7 rounded-full bg-pink-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md shadow-pink-100">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 mb-0.5">Explore Specialized Profiles</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Filter top clinical specialists by location, verified experience track records, and real-time live availability states.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start relative z-10">
                    <div className="w-7 h-7 rounded-full bg-sky-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md shadow-sky-50">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 mb-0.5">Select Consultation Type</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Opt for a secure HD video <span className="font-semibold text-sky-600">Tele-Consult</span> for quick opinions or lock in an physical OPD visit directly into hospital desks.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start relative z-10">
                    <div className="w-7 h-7 rounded-full bg-pink-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md shadow-pink-50">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 mb-0.5">Share Vital Lab Records</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Securely upload ultrasound diagnostics, blood profiles, and history markers immediately via encrypted file transfer dashboards.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start relative z-10">
                    <div className="w-7 h-7 rounded-full bg-sky-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md shadow-sky-50">
                      4
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 mb-0.5">Conduct Clinical Evaluation</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Engage in interactive consults to evaluate gestational benchmarks, fetal health trackers, and tailored treatment designs.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start relative z-10">
                    <div className="w-7 h-7 rounded-full bg-pink-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md shadow-pink-100">
                      5
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 mb-0.5">Follow-up Protocols</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Receive dynamic e-prescriptions, custom diet charts, and automatic reminders guiding you smoothly toward your delivery milestones.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
              
              {/* Trust certification line */}
              <div className="text-[11px] font-medium bg-gradient-to-r from-pink-50 to-sky-50 border border-pink-100/50 rounded-xl p-2.5 text-center text-slate-600 backdrop-blur-sm mt-2">
                🔒 HIPAA Compliant Encryption Protocol Enabled
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Doctor List Main Panel */}
          <div className="lg:col-span-2 w-full bg-white/85 backdrop-blur-xl rounded-3xl shadow-xl p-5 md:p-7 border border-white flex flex-col space-y-6">
            
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                On-Duty Doctors
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Real-time active clinician matching schedule.
              </p>
            </div>

            {/* Doctor Cards Container */}
            <div className="flex flex-col gap-5">
              {Doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="group bg-white/60 backdrop-blur-md border border-gray-100/70 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-5">
                    
                    {/* Left Frame: Doctor Identity Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`${doc.badgeBg} w-14 h-14 rounded-2xl flex items-center justify-center text-xl shrink-0 hidden sm:flex group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                        <FaUserMd />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-row items-center gap-3 flex-wrap">
                          <h4 className="text-xl font-bold text-gray-800 truncate">
                            {doc.name}
                          </h4>
                          <span className={`text-xs font-bold px-2.5 py-0.5 border rounded-full shadow-sm ${doc.statusBg}`}>
                            {doc.status}
                          </span>
                        </div>

                        <p className="text-sm md:text-base font-semibold text-pink-500">
                          {doc.specialty}
                        </p>

                        {/* Metadata Row */}
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-5 gap-y-2 text-xs md:text-sm text-gray-500 pt-1">
                          <div className="flex flex-row items-center gap-1.5">
                            <FaCheckCircle className="text-sky-400 shrink-0" />
                            <span>{doc.experience}</span>
                          </div>

                          <div className="flex flex-row items-center gap-1.5">
                            <FaHospital className="text-pink-400 shrink-0" />
                            <span className="font-medium text-gray-700 truncate">{doc.hospitalName}</span>
                          </div>

                          <div className="flex flex-row items-center gap-1.5">
                            <FaMapMarkerAlt className="text-sky-400 shrink-0" />
                            <span className="truncate text-gray-500">{doc.location}</span>
                          </div>

                          <div className="flex flex-row items-center gap-1.5">
                            <FaClock className="text-pink-400 shrink-0" />
                            <span>{doc.availability}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Frame: Action Buttons with internal system flow states */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto shrink-0 border-t xl:border-t-0 pt-4 xl:pt-0 border-gray-100">
                      <button 
                        onClick={() => triggerAction(doc.name, "Tele-Consultation")}
                        className="flex items-center justify-center gap-2 bg-white/90 border border-sky-300 text-sky-600 hover:bg-sky-50 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 w-full sm:w-auto whitespace-nowrap shadow-sm active:scale-95"
                      >
                        <FaVideo className="text-xs" />
                        Tele-Consult
                      </button>
                      
                      <button 
                        onClick={() => triggerAction(doc.name, "Physical Appointment")}
                        className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-md shadow-pink-100 w-full sm:w-auto whitespace-nowrap active:scale-95"
                      >
                        <FaCalendarCheck className="text-xs" />
                        Book Appointment
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>

      </div>

      {/* ACTIVE MODAL: Appears instantly within the page layout container without breaking dependencies */}
      {activeAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-white relative space-y-4">
            
            <button 
              onClick={closeOverlay} 
              className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 transition-colors p-2"
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500 text-xl mb-2">
              {activeAction.mode === "Tele-Consultation" ? <FaVideo /> : <FaCalendarCheck />}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {activeAction.mode}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Setting up clinical session with <span className="font-semibold text-pink-500">{activeAction.doctorName}</span>.
              </p>
            </div>

            <div className="bg-pink-50/50 border border-pink-100/60 p-4 rounded-xl text-xs text-gray-600 leading-relaxed">
              🚀 <strong>Next Step Integration:</strong> This modal replaces empty page errors. You can link your backend API route handler here to instantly load interactive webRTC channels or dynamic hospital date pickers securely.
            </div>

            <button 
              onClick={closeOverlay}
              className="w-full bg-gradient-to-r from-pink-500 to-sky-500 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
            >
              Proceed with Portal Flow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;
