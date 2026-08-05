import React, { useState, useEffect, useRef } from "react";
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
  FaSearch,
  FaSpinner,
  FaEye,
  FaDownload,
  FaHeart,
  FaBaby,
  FaExclamationTriangle,
  FaNotesMedical,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
  FaPrint,
  FaHistory,
  FaClock,
  FaStethoscope,
  FaFileSignature,
  FaPlus,
  FaUserPlus,
  FaEdit,
} from "react-icons/fa";

import bg from "../../assets/images/bg.png";

const DoctorReports = () => {
  const navigate = useNavigate();
  const reportRef = useRef();

  const [doctor, setDoctor] = useState(null);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPatientReports, setSelectedPatientReports] = useState([]);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [editingNote, setEditingNote] = useState(false);
  const [patients, setPatients] = useState([]);
  const [reportStats, setReportStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

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

    try {
      const allPatientReports = JSON.parse(localStorage.getItem("allPatientReports")) || [];
      const patientUpdates = JSON.parse(localStorage.getItem("doctorPatientUpdates")) || [];

      if (allPatientReports.length === 0 && patientUpdates.length > 0) {
        const historyData = patientUpdates.map((item) => ({
          ...item,
          reportDate: item.updatedAt || new Date().toISOString(),
          doctorNotes: "",
          status: "Reviewed",
        }));
        localStorage.setItem("allPatientReports", JSON.stringify(historyData));
        loadReports();
        return;
      }

      const allReports = [...allPatientReports];
      
      patientUpdates.forEach((update) => {
        const exists = allReports.some(
          (r) => r.email === update.email && r.reportDate === update.updatedAt
        );
        if (!exists) {
          allReports.push({
            ...update,
            reportDate: update.updatedAt || new Date().toISOString(),
            doctorNotes: "",
            status: "New",
          });
        }
      });

      localStorage.setItem("allPatientReports", JSON.stringify(allReports));

      const formattedReports = allReports.map((item, index) => ({
        id: `${item.email}-${item.reportDate || index}`,
        patient: item.patient || "Unknown Patient",
        email: item.email || "",
        risk: item.risk || "Low",
        score: item.score || 0,
        confidence: item.confidence || 0,
        symptoms: item.symptoms || [],
        riskFactors: item.riskFactors || [],
        vitals: item.vitals || {},
        heartRate: item.heartRate || item.vitals?.heart_rate || "-",
        updatedAt: item.reportDate || new Date().toLocaleString(),
        doctorNotes: item.doctorNotes || "",
        status: item.status || "Pending Review",
      }));

      formattedReports.sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      setReports(formattedReports);
      setFilteredReports(formattedReports);

      const stats = {
        total: formattedReports.length,
        high: formattedReports.filter((r) => r.risk === "High").length,
        medium: formattedReports.filter((r) => r.risk === "Medium").length,
        low: formattedReports.filter((r) => r.risk === "Low").length,
      };
      setReportStats(stats);

      const patientMap = new Map();
      formattedReports.forEach((report) => {
        if (!patientMap.has(report.email)) {
          patientMap.set(report.email, {
            id: report.email,
            name: report.patient,
            email: report.email,
            appointments: Math.floor(Math.random() * 5) + 1,
            status: report.risk === "High" ? "Critical" : "Stable",
            latestRisk: report.risk,
            reportCount: 1,
          });
        } else {
          const existing = patientMap.get(report.email);
          existing.reportCount += 1;
        }
      });
      setPatients(Array.from(patientMap.values()));

    } catch (error) {
      console.log("Reports loading error:", error);
      setReports([]);
      setFilteredReports([]);
      setPatients([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    let data = [...reports];

    if (searchTerm.trim()) {
      data = data.filter(
        (item) =>
          item.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (riskFilter !== "all") {
      data = data.filter(
        (item) => item.risk.toLowerCase() === riskFilter.toLowerCase()
      );
    }

    setFilteredReports(data);
  }, [searchTerm, riskFilter, reports]);

  useEffect(() => {
    const updateReports = () => {
      loadReports();
    };

    window.addEventListener("storage", updateReports);
    window.addEventListener("dataUpdated", updateReports);

    return () => {
      window.removeEventListener("storage", updateReports);
      window.removeEventListener("dataUpdated", updateReports);
    };
  }, []);

  const openReport = (report) => {
    setSelectedReport(report);
    setDoctorNotes(report.doctorNotes || "");
    setEditingNote(false);
    setShowModal(true);
  };

  const closeReport = () => {
    setSelectedReport(null);
    setDoctorNotes("");
    setEditingNote(false);
    setShowModal(false);
  };
const createPrescription = () => {

  if(!selectedReport) return;


  localStorage.setItem(
    "selectedPrescriptionPatient",
    JSON.stringify({
      patient: selectedReport.patient,
      email: selectedReport.email,
      risk: selectedReport.risk,
      vitals: selectedReport.vitals,
      symptoms: selectedReport.symptoms
    })
  );


  navigate("/doctor-prescriptions");

};
  const viewPatientHistory = (patientEmail) => {
    const patientReports = reports.filter((r) => r.email === patientEmail);
    patientReports.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setSelectedPatientReports(patientReports);
    setShowHistoryModal(true);
  };

  const viewHistoricalReport = (report) => {
    setShowHistoryModal(false);
    setSelectedReport(report);
    setDoctorNotes(report.doctorNotes || "");
    setEditingNote(false);
    setShowModal(true);
  };

  const saveDoctorNotes = () => {
    if (!selectedReport) return;

    const updatedReports = reports.map((r) => {
      if (r.id === selectedReport.id) {
        return {
          ...r,
          doctorNotes: doctorNotes,
          status: "Reviewed",
        };
      }
      return r;
    });

    setReports(updatedReports);
    setFilteredReports(updatedReports);

    const allReports = JSON.parse(localStorage.getItem("allPatientReports")) || [];
    const updatedHistory = allReports.map((r) => {
      if (r.email === selectedReport.email && r.reportDate === selectedReport.updatedAt) {
        return {
          ...r,
          doctorNotes: doctorNotes,
          status: "Reviewed",
        };
      }
      return r;
    });
    localStorage.setItem("allPatientReports", JSON.stringify(updatedHistory));

    setEditingNote(false);
    setSelectedReport({ ...selectedReport, doctorNotes, status: "Reviewed" });
  };

  const viewReport = (patient) => {
    const latestReport = reports.find((r) => r.email === patient.email);
    if (latestReport) {
      openReport(latestReport);
    }
  };

  const printReport = () => {
    document.body.classList.add("printing");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("printing");
    }, 500);
  };

  const downloadReport = () => {
    if (!selectedReport) return;

    const reportData = `
====================================
        GLOWCARE HOSPITAL
====================================

Maternal Health Assessment Report
AI Assisted Pregnancy Risk Monitoring

Report ID: GC-${Date.now()}

====================================

PATIENT INFORMATION
-------------------
Patient Name: ${selectedReport.patient}
Email: ${selectedReport.email}
Report Date: ${selectedReport.updatedAt}

====================================

AI RISK ANALYSIS
----------------
Risk Level: ${selectedReport.risk}
Risk Score: ${selectedReport.score}%
Prediction Confidence: ${selectedReport.confidence}%

====================================

CLINICAL VITAL EXAMINATION
--------------------------
Blood Pressure: ${selectedReport.vitals?.systolic_bp || "-"} / ${selectedReport.vitals?.diastolic_bp || "-"}
Blood Sugar: ${selectedReport.vitals?.blood_sugar || "-"} mg/dL
Heart Rate: ${selectedReport.heartRate} bpm
BMI: ${selectedReport.vitals?.bmi || "-"}

====================================

PREGNANCY INFORMATION
---------------------
Pregnancy Week: ${selectedReport.vitals?.pregnancy_week || "-"}
Baby Count: ${selectedReport.vitals?.baby_count || "-"}
Baby Weight: ${selectedReport.vitals?.baby_weight || "-"} g
Baby Heart Rate: ${selectedReport.vitals?.baby_heart_rate || "-"} bpm

====================================

REPORTED SYMPTOMS
-----------------
${selectedReport.symptoms?.join(", ") || "No symptoms reported"}

====================================

MEDICAL OBSERVATIONS
--------------------
${selectedReport.riskFactors?.join("\n") || "No observations"}

====================================

DOCTOR NOTES
------------
${selectedReport.doctorNotes || "No notes added"}

====================================

DOCTOR VERIFICATION
-------------------
Doctor: Dr. ${doctor?.name || "GlowCare Doctor"}
Specialization: ${doctor?.specialization || "Gynecology"}
Generated: ${new Date().toLocaleString()}

====================================
        GlowCare Hospital
        Quality Care for Every Life
====================================
    `;

    const blob = new Blob([reportData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedReport.patient}_Medical_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const riskStyle = (risk) => {
    if (risk?.toLowerCase() === "high") return "bg-red-100 text-red-700 border-red-200";
    if (risk?.toLowerCase() === "medium") return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getStatusBadge = (status) => {
    if (status === "Critical") return "bg-red-100 text-red-700";
    if (status === "Stable") return "bg-green-100 text-green-700";
    if (status === "Reviewed") return "bg-blue-100 text-blue-700";
    if (status === "New") return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
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
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 blur-[140px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-300 blur-[150px] opacity-20 animate-pulse"></div>

      {/* SIDEBAR */}
      <div className="relative z-10 w-64 bg-white/80 backdrop-blur-2xl border-r border-pink-100 h-full flex flex-col">
        <div className="p-5 border-b border-pink-100">
          <Link to="/doctor-dashboard">
            <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
            <p className="text-xs text-gray-500">Doctor Portal</p>
          </Link>

          <div className="mt-4 flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-sky-50">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold">
              {doctor?.name?.charAt(0)?.toUpperCase() || "D"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {doctor?.name || "Doctor"}
              </p>
              <p className="text-xs text-gray-500">
                {doctor?.specialization || "Gynecologist"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-3 space-y-1">
          <NavItem label="Dashboard" icon={<FaChartLine />} to="/doctor-dashboard" />
          <NavItem label="Patients" icon={<FaUsers />} to="/doctor-patients" />
          <NavItem
            label="Appointments"
            icon={<FaCalendarCheck />}
            to="/doctor-appointments"
          />
          <NavItem
            label="Reports"
            icon={<FaFileMedical />}
            to="/doctor-reports"
            active
          />
          <NavItem
            label="Prescriptions"
            icon={<FaPrescription />}
            to="/doctor-prescriptions"
          />
          <NavItem
            label="Notifications"
            icon={<FaBell />}
            to="/doctor-notifications"
          />
          <NavItem label="Profile" icon={<FaUserMd />} to="/doctor-profile" />
          <NavItem label="Settings" icon={<FaCog />} to="/doctor-settings" />
        </div>

        <div className="p-3 border-t border-pink-100">
          <button
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/doctor-login";
            }}
            className="w-full flex items-center justify-center gap-2 bg-pink-50 text-pink-600 py-2.5 rounded-xl font-semibold hover:bg-pink-100 transition-colors"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex gap-2 items-center">
              <FaFileMedical className="text-pink-500" />
              Patient Reports
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Complete maternal health reports with history
            </p>
          </div>

          <button
            onClick={loadReports}
            className="bg-white px-5 py-2 rounded-full shadow text-sm flex gap-2 items-center hover:shadow-md transition-shadow"
          >
            <FaSpinner className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Reports" 
            value={reportStats.total} 
            icon={<FaFileMedical />} 
            color="pink"
          />
          <StatCard 
            title="High Risk" 
            value={reportStats.high} 
            icon={<FaExclamationTriangle />} 
            color="red"
          />
          <StatCard 
            title="Medium Risk" 
            value={reportStats.medium} 
            icon={<FaExclamationTriangle />} 
            color="orange"
          />
          <StatCard 
            title="Low Risk" 
            value={reportStats.low} 
            icon={<FaCheckCircle />} 
            color="green"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg mb-6 flex flex-wrap gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient name/email"
              className="w-full pl-10 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none bg-white/50"
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none bg-white/50"
          >
            <option value="all">All Risk</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-pink-100 overflow-hidden mb-8">
          <div className="p-5 border-b border-pink-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Patient Records</h3>
            <span className="text-xs text-gray-500">
              {patients.length} patients
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-pink-50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Reports
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {patients.slice(0, 10).map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-t border-pink-50 hover:bg-pink-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {patient.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">
                          {patient.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {patient.email}
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-sm">
                        <FaHistory className="text-pink-400" />
                        {patient.reportCount}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          patient.status
                        )}`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewReport(patient)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-sky-400 text-white text-xs font-semibold hover:shadow-md transition-all hover:scale-105"
                        >
                          <FaEye className="text-xs" />
                          View Report
                        </button>
                        <button
                          onClick={() => viewPatientHistory(patient.email)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-all"
                        >
                          <FaHistory className="text-xs" />
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredReports.length > 0 ? (
            filteredReports.slice(0, 12).map((report) => (
              <div
                key={report.id}
                className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-lg border border-pink-100 hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white text-xl font-bold shadow-md">
                      {report.patient?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {report.patient}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaEnvelope className="text-gray-400" />
                        {report.email}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <FaClock className="text-gray-400" />
                        {report.updatedAt}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${riskStyle(
                      report.risk
                    )}`}
                  >
                    {report.risk}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">Risk Score</p>
                    <p className="text-xl font-bold text-gray-800">
                      {report.score}%
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">Confidence</p>
                    <p className="text-xl font-bold text-green-600">
                      {report.confidence}%
                    </p>
                  </div>
                </div>

                <div className="bg-pink-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                    <FaHeart className="text-red-500" />
                    Vital Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Blood Pressure</p>
                      <p className="font-semibold text-gray-800">
                        {report.vitals?.systolic_bp || "-"}/
                        {report.vitals?.diastolic_bp || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Heart Rate</p>
                      <p className="font-semibold text-gray-800">{report.heartRate} bpm</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Pregnancy Week</p>
                      <p className="font-semibold text-gray-800">
                        {report.vitals?.pregnancy_week || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Baby Count</p>
                      <p className="font-semibold text-gray-800">
                        {report.vitals?.baby_count || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                <div className="flex gap-2 pt-3 border-t border-pink-100">
                  <button
                    onClick={() => openReport(report)}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-sky-400 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-md transition-all hover:scale-[1.02]"
                  >
                    <FaEye className="text-xs" />
                    View Report
                  </button>
                  <button 
                    className="px-4 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setSelectedReport(report);
                      downloadReport();
                    }}
                  >
                    <FaDownload />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-gray-400">
              <FaFileMedical className="text-5xl mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-gray-600">No Patient Reports Found</p>
              <p className="text-sm mt-1">
                Reports will appear after patient prediction
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FULL MEDICAL REPORT MODAL */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={reportRef}
            className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl print-area"
          >
            <div className="bg-gradient-to-r from-pink-500 to-sky-400 text-white p-6 rounded-t-3xl flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">GlowCare Hospital</h1>
                <p className="text-sm opacity-90 mt-1">
                  Maternal Health Assessment Report
                </p>
                <p className="text-xs mt-2 opacity-80">
                  AI Assisted Pregnancy Risk Monitoring
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={printReport}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105"
                >
                  <FaPrint />
                  Print
                </button>

                <button
                  onClick={downloadReport}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105"
                >
                  <FaDownload />
                  Download
                </button>

                <button
                 onClick={()=>{

localStorage.setItem(
"selectedPatient",
JSON.stringify({

id:selectedReport.email,
name:selectedReport.patient,
email:selectedReport.email

})
);


navigate("/doctor-prescriptions");


}}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105"
                >
                  <FaPrescription />
                  Prescribe
                </button>

                <button
                  onClick={closeReport}
                  className="text-white text-2xl ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-right text-xs text-gray-400">
                Report ID: GC-{Date.now().toString().slice(-8)}
              </div>

              <section className="border rounded-2xl p-5 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUser className="text-pink-500" />
                  Patient Information
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <ReportBox label="Patient Name" value={selectedReport.patient} />
                  <ReportBox label="Email" value={selectedReport.email} />
                  <ReportBox label="Report Date" value={selectedReport.updatedAt} />
                </div>
              </section>

              <section className="border rounded-2xl p-5 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaExclamationTriangle className="text-orange-500" />
                  AI Risk Analysis
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <ReportBox label="Risk Level" value={selectedReport.risk} />
                  <ReportBox label="Risk Score" value={`${selectedReport.score}%`} />
                  <ReportBox
                    label="Prediction Confidence"
                    value={`${selectedReport.confidence}%`}
                  />
                </div>
              </section>

              <section className="border rounded-2xl p-5 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaHeart className="text-red-500" />
                  Clinical Vital Examination
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <ReportBox
                    label="Blood Pressure"
                    value={`${selectedReport.vitals?.systolic_bp || "-"} / ${
                      selectedReport.vitals?.diastolic_bp || "-"
                    }`}
                  />
                  <ReportBox
                    label="Blood Sugar"
                    value={selectedReport.vitals?.blood_sugar || "-"}
                  />
                  <ReportBox
                    label="Heart Rate"
                    value={`${selectedReport.heartRate} bpm`}
                  />
                  <ReportBox label="BMI" value={selectedReport.vitals?.bmi || "-"} />
                </div>
              </section>

              <section className="border rounded-2xl p-5 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBaby className="text-pink-500" />
                  Pregnancy Information
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <ReportBox
                    label="Pregnancy Week"
                    value={selectedReport.vitals?.pregnancy_week || "-"}
                  />
                  <ReportBox
                    label="Baby Count"
                    value={selectedReport.vitals?.baby_count || "-"}
                  />
                  <ReportBox
                    label="Baby Weight"
                    value={`${selectedReport.vitals?.baby_weight || "-"} g`}
                  />
                  <ReportBox
                    label="Baby Heart Rate"
                    value={`${selectedReport.vitals?.baby_heart_rate || "-"} bpm`}
                  />
                </div>
              </section>

              {selectedReport.symptoms?.length > 0 && (
                <section className="border rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <FaNotesMedical className="text-purple-500" />
                    Reported Symptoms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedReport.symptoms.map((symptom, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm border border-pink-100"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {selectedReport.riskFactors?.length > 0 && (
                <section className="border rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <h3 className="font-bold mb-3">Medical Observations</h3>
                  <ul className="list-disc ml-5 text-gray-600 space-y-2">
                    {selectedReport.riskFactors.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="border rounded-2xl p-5 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaStethoscope className="text-pink-500" />
                  Doctor Notes
                </h3>
                
                {editingNote ? (
                  <div>
                    <textarea
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      placeholder="Add medical notes for this patient..."
                      className="w-full h-32 rounded-xl border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={saveDoctorNotes}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-sky-400 text-white rounded-xl text-sm font-semibold hover:shadow-md transition-all"
                      >
                        Save Notes
                      </button>
                      <button
                        onClick={() => {
                          setEditingNote(false);
                          setDoctorNotes(selectedReport.doctorNotes || "");
                        }}
                        className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-gray-50 rounded-xl p-4 min-h-[80px]">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedReport.doctorNotes || "No notes added yet."}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingNote(true)}
                      className="mt-2 text-pink-500 text-sm font-semibold flex items-center gap-1 hover:text-pink-600 transition-colors"
                    >
                      <FaEdit />
                      Edit Notes
                    </button>
                  </div>
                )}
              </section>

              <section className="border-t pt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Generated By</p>
                  <h4 className="font-bold text-gray-800">
                    Dr. {doctor?.name || "GlowCare Doctor"}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {doctor?.specialization || "Gynecology"} · GlowCare Hospital
                  </p>
                </div>
                <div className="text-right">
                  <div className="h-12 border-b-2 border-gray-300 mb-2"></div>
                  <p className="text-sm font-semibold text-gray-600">Doctor Signature</p>
                </div>
              </section>

              <div className="border-t pt-4 flex justify-end">
                <button
                  onClick={closeReport}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT HISTORY MODAL */}
      {showHistoryModal && selectedPatientReports.length > 0 && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-sky-400 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FaHistory />
                  Patient Report History
                </h2>
                <p className="text-sm opacity-90">
                  {selectedPatientReports[0]?.patient}
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-white text-2xl hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              {selectedPatientReports.map((report, index) => (
                <div
                  key={index}
                  className="border rounded-2xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => viewHistoricalReport(report)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${riskStyle(report.risk)}`}>
                          {report.risk}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                        <FaClock className="text-gray-400" />
                        {report.updatedAt}
                      </p>
                      {report.doctorNotes && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          <span className="font-semibold">Notes:</span> {report.doctorNotes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewHistoricalReport(report);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-sky-400 text-white text-xs font-semibold hover:shadow-md transition-all"
                    >
                      <FaEye />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===============================
   COMPONENTS
================================ */

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    pink: "bg-pink-100 text-pink-600",
    red: "bg-red-100 text-red-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-pink-100 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-xl font-bold text-gray-800">{value}</p>
          <p className="text-xs text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
};

const ReportBox = ({ label, value }) => (
  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:bg-gray-100 transition-colors">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="font-semibold text-gray-800">{value || "-"}</p>
  </div>
);

const NavItem = ({ label, icon, to, active, onClick, badge }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`
      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm
      ${
        active
          ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg"
          : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
      }
    `}
  >
    <span className="text-lg">{icon}</span>
    <span className="font-medium flex-1">{label}</span>
    {badge > 0 && (
      <span
        className={`
          text-xs px-2 py-0.5 rounded-full
          ${active ? "bg-white/30 text-white" : "bg-red-500 text-white"}
        `}
      >
        {badge}
      </span>
    )}
  </Link>
);

export default DoctorReports;