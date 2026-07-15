import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import bg from "../../assets/images/bg.png";

import {
  FaHeartbeat,
  FaFileMedical,
  FaNotesMedical,
  FaLightbulb,
  FaUser,
  FaCalendarAlt,
  FaHeart,
  FaClipboardList,
  FaShieldAlt,
  FaUserCircle,
  FaBaby,
  FaChartLine,
  FaBell,
  FaSearch,
  FaEye,
  FaTrash,
  FaDownload,
  FaFilter,
  FaStethoscope,
} from "react-icons/fa";

function Reports() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, search, riskFilter]);

  const loadReports = () => {
    const saved =
      JSON.parse(
        localStorage.getItem(`reports_${currentUser.email}`)
      ) || [];

    // If no reports exist, create a sample report from riskData
    if (saved.length === 0) {
      const riskData = JSON.parse(
        localStorage.getItem(`riskData_${currentUser.email}`)
      );
      if (riskData) {
        const sampleReport = {
          id: Date.now(),
          ...riskData,
          date: new Date().toLocaleDateString(),
          vitals: riskData.vitals || {},
        };
        saved.push(sampleReport);
        localStorage.setItem(
          `reports_${currentUser.email}`,
          JSON.stringify(saved)
        );
      }
    }

    setReports(saved);
  };

  const filterReports = () => {
    let data = [...reports];

    if (riskFilter !== "All") {
      data = data.filter((r) => r.risk === riskFilter);
    }

    if (search.trim()) {
      const txt = search.toLowerCase();
      data = data.filter((r) => {
        const symptoms = Array.isArray(r.symptoms)
          ? r.symptoms.join(", ").toLowerCase()
          : "";
        return (
          (r.risk || "").toLowerCase().includes(txt) ||
          symptoms.includes(txt)
        );
      });
    }

    setFilteredReports(data);
  };

  const deleteReport = (id) => {
    if (!window.confirm("Delete this report?")) return;
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    localStorage.setItem(
      `reports_${currentUser.email}`,
      JSON.stringify(updated)
    );
    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
  };

  const downloadPDF = (report) => {
    if (!report) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("GlowCare Pregnancy Report", 20, 20);
    doc.setFontSize(12);

    const v = report.vitals || {};
    doc.text(`Patient: ${currentUser.name || "User"}`, 20, 40);
    doc.text(`Date: ${report.date || new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`Risk: ${report.risk || "Unknown"}`, 20, 60);
    doc.text(`Risk Score: ${report.score || 0}%`, 20, 70);
    doc.text(`Confidence: ${report.confidence || 0}%`, 20, 80);
    doc.text(`Age: ${v.age || "-"}`, 20, 95);
    doc.text(`Pregnancy Week: ${v.week || "-"}`, 20, 105);
    doc.text(`Weight: ${v.weight || "-"} kg`, 20, 115);
    doc.text(
      `Blood Pressure: ${v.bpSystolic || "-"} / ${v.bpDiastolic || "-"}`,
      20,
      125
    );
    doc.text(`Heart Rate: ${v.heartRate || "-"} bpm`, 20, 135);
    doc.text(`Blood Sugar: ${v.sugar || "-"}`, 20, 145);
    doc.text(`Temperature: ${v.temperature || "-"} °C`, 20, 155);

    const symptoms = Array.isArray(report.symptoms)
      ? report.symptoms.join(", ")
      : "None";
    doc.text(`Symptoms: ${symptoms}`, 20, 170);

    const factors = Array.isArray(report.riskFactors)
      ? report.riskFactors.join(", ")
      : "None";
    doc.text(`Risk Factors: ${factors}`, 20, 185);

    doc.save(`GlowCare_Report_${report.id}.pdf`);
  };

  const stats = {
    total: reports.length,
    high: reports.filter((r) => r.risk === "High").length,
    moderate: reports.filter((r) => r.risk === "Moderate").length,
    low: reports.filter((r) => r.risk === "Low").length,
  };

  // Get selected report data with null checks
  const selected = selectedReport || {};

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center flex"
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
      <div className="relative z-10 w-64 bg-white/80 backdrop-blur-2xl border-r border-pink-100/50 p-5 flex-shrink-0 h-screen flex flex-col overflow-y-auto">
        <Link to="/dashboard" className="block">
          <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
          <p className="text-sm text-gray-500">Maternal Health System</p>
        </Link>

        <div className="mt-8 space-y-2 flex-1">
          <NavItem label="Dashboard" icon={<FaHeartbeat />} to="/dashboard" />
          <NavItem label="Reports" icon={<FaFileMedical />} to="/reports" active />
          <NavItem label="Pregnancy Toolkit" icon={<FaBaby />} to="/toolkit" />
          <NavItem label="Symptoms" icon={<FaNotesMedical />} to="/symptoms" />
          <NavItem label="Suggestions" icon={<FaLightbulb />} to="/suggestions" />
          <NavItem label="Prediction" icon={<FaChartLine />} to="/prediction" />
          <NavItem label="Alerts" icon={<FaBell />} to="/alerts" />
          
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
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <FaFileMedical className="text-pink-500" />
              Pregnancy Reports
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              View and manage your health reports
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {currentUser.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {currentUser.name?.split(" ")[0] || "User"}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<FaFileMedical />} title="Total Reports" value={stats.total} />
          <StatCard icon={<FaHeart />} title="High Risk" value={stats.high} />
          <StatCard icon={<FaClipboardList />} title="Moderate" value={stats.moderate} />
          <StatCard icon={<FaCheckCircle />} title="Low Risk" value={stats.low} />
        </div>

        {/* Search & Filter */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-pink-100/50 shadow-lg mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-100 bg-white/90 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div className="flex items-center gap-2 bg-white/90 rounded-xl px-4 py-2.5 border border-pink-100">
              <FaFilter className="text-purple-500" />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="outline-none bg-transparent text-sm"
              >
                <option value="All">All Risks</option>
                <option value="High">High Risk</option>
                <option value="Moderate">Moderate Risk</option>
                <option value="Low">Low Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Cards */}
        {filteredReports.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-10 text-center border border-pink-100/50">
            <FaFileMedical className="text-5xl text-pink-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">No Reports Found</h3>
            <p className="text-gray-500 mt-2">
              Complete a pregnancy prediction to generate reports.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-pink-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-pink-600">
                      Pregnancy Report
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {report.date || new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      report.risk === "High"
                        ? "bg-red-100 text-red-600"
                        : report.risk === "Moderate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {report.risk || "Unknown"}
                  </span>
                </div>

                <div className="mt-4 space-y-1 text-gray-700">
                  <p className="text-sm">
                    <b>Score:</b> {report.score || 0}%
                  </p>
                  <p className="text-sm">
                    <b>Confidence:</b> {report.confidence || 0}%
                  </p>
                  <p className="text-sm">
                    <b>Symptoms:</b>{" "}
                    {Array.isArray(report.symptoms)
                      ? report.symptoms.slice(0, 3).join(", ")
                      : "None"}
                    {Array.isArray(report.symptoms) && report.symptoms.length > 3 && "..."}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="flex-1 bg-pink-100 text-pink-600 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-pink-200 transition-all text-sm"
                  >
                    <FaEye /> View
                  </button>
                  <button
                    onClick={() => downloadPDF(report)}
                    className="flex-1 bg-purple-100 text-purple-600 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-200 transition-all text-sm"
                  >
                    <FaDownload /> PDF
                  </button>
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="bg-red-100 text-red-500 px-4 rounded-xl hover:bg-red-200 transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-pink-100/50 pt-6">
          <p>© 2026 GlowCare — Safe Pregnancy, Smart Monitoring 🤰</p>
        </div>
      </div>

      {/* SELECTED REPORT MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-3xl font-bold text-pink-600 mb-6">
              Report Details
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-5">
                <div className="bg-pink-50 rounded-2xl p-5">
                  <h3 className="font-bold text-pink-600 mb-4">Patient Details</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Name:</strong> {currentUser.name || "Patient"}</p>
                    <p><strong>Date:</strong> {selectedReport.date || "-"}</p>
                    <p>
                      <strong>Risk Level:</strong>{" "}
                      <span className={`font-bold ${
                        selectedReport.risk === "High"
                          ? "text-red-500"
                          : selectedReport.risk === "Moderate"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}>
                        {selectedReport.risk || "-"}
                      </span>
                    </p>
                    <p><strong>Risk Score:</strong> {selectedReport.score || 0}%</p>
                    <p><strong>Confidence:</strong> {selectedReport.confidence || 0}%</p>
                  </div>
                </div>

                <div className="bg-sky-50 rounded-2xl p-5">
                  <h3 className="font-bold text-sky-600 mb-4">Symptoms</h3>
                  {Array.isArray(selectedReport.symptoms) && selectedReport.symptoms.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.symptoms.map((item, index) => (
                        <span key={index} className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No symptoms reported</p>
                  )}
                </div>

                <div className="bg-red-50 rounded-2xl p-5">
                  <h3 className="font-bold text-red-500 mb-4">Risk Factors</h3>
                  {Array.isArray(selectedReport.riskFactors) && selectedReport.riskFactors.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {selectedReport.riskFactors.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No risk factors</p>
                  )}
                </div>
              </div>

              {/* Right Column - Vitals */}
              <div>
                <div className="bg-white rounded-2xl border shadow p-6">
                  <h3 className="text-xl font-bold text-pink-600 mb-5">Health Vitals</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <VitalCard title="Age" value={selectedReport.vitals?.age} />
                    <VitalCard title="Pregnancy Week" value={selectedReport.vitals?.week} />
                    <VitalCard title="Weight" value={`${selectedReport.vitals?.weight || "-"} kg`} />
                    <VitalCard 
                      title="Blood Pressure" 
                      value={`${selectedReport.vitals?.bpSystolic || "-"} / ${selectedReport.vitals?.bpDiastolic || "-"}`} 
                    />
                    <VitalCard title="Heart Rate" value={`${selectedReport.vitals?.heartRate || "-"} bpm`} />
                    <VitalCard title="Blood Sugar" value={selectedReport.vitals?.sugar || "-"} />
                    <VitalCard title="Temperature" value={`${selectedReport.vitals?.temperature || "-"} °C`} />
                    <VitalCard title="Prediction" value={selectedReport.risk || "-"} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => downloadPDF(selectedReport)}
                className="bg-gradient-to-r from-pink-500 to-sky-400 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition"
              >
                <FaDownload /> Download PDF
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="bg-gray-200 px-6 py-3 rounded-xl hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
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

const VitalCard = ({ title, value }) => (
  <div className="bg-pink-50 rounded-xl p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-lg font-bold text-pink-600 mt-1">{value || "-"}</p>
  </div>
);

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-pink-100/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center gap-3">
      <div className="text-2xl text-pink-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

// Need to import FaCheckCircle for the stat card
const FaCheckCircle = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export default Reports;