// AdminReports.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  FileText,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    setLoading(true);
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const reportList = [];
    allUsers.forEach(user => {
      const riskData = JSON.parse(localStorage.getItem(`riskData_${user.email}`));
      if (riskData) {
        reportList.push({
          ...riskData,
          userName: user.name || "Unknown",
          userEmail: user.email,
          date: riskData.createdAt || new Date().toISOString(),
        });
      }
    });
    setReports(reportList);
    setFilteredReports(reportList);
    setLoading(false);
  };

  useEffect(() => {
    let filtered = [...reports];
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.userName?.toLowerCase().includes(search) ||
        r.userEmail?.toLowerCase().includes(search)
      );
    }
    if (riskFilter !== "all") {
      filtered = filtered.filter(r => r.risk?.toLowerCase() === riskFilter);
    }
    setFilteredReports(filtered);
  }, [searchTerm, riskFilter, reports]);

  const getRiskBadge = (risk) => {
    const styles = {
      high: "bg-red-100 text-red-700 border-red-200",
      moderate: "bg-orange-100 text-orange-700 border-orange-200",
      medium: "bg-orange-100 text-orange-700 border-orange-200",
      low: "bg-green-100 text-green-700 border-green-200",
    };
    return styles[risk?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <AdminLayout activeTab="reports">
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <FileText className="text-pink-500" />
              Health Reports
            </h2>
            <p className="text-sm text-gray-500 mt-1">View all patient health reports</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadReports}
              className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100 hover:bg-pink-50 transition-all text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
              <span className="text-sm font-medium text-gray-700">{filteredReports.length} reports</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by patient..."
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
            <option value="all">All Risks</option>
            <option value="high">High Risk</option>
            <option value="moderate">Moderate Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredReports.map((report, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-2xl rounded-2xl p-5 border border-pink-100/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">{report.userName}</h4>
                  <p className="text-xs text-gray-500">{report.userEmail}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${getRiskBadge(report.risk)}`}>
                  {report.risk || "Low"} Risk
                </span>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Risk Score</span>
                  <span className="font-semibold">{report.score || 0}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Symptoms</span>
                  <span className="text-gray-600">{report.symptoms?.length || 0} reported</span>
                </div>
                {report.symptoms && report.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {report.symptoms.slice(0, 3).map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full">{s}</span>
                    ))}
                  </div>
                )}
                {report.vitals && (
                  <div className="mt-2 p-2 bg-pink-50 rounded-lg text-xs text-gray-600">
                    <span>BP {report.vitals.bpSystolic}/{report.vitals.bpDiastolic} | HR {report.vitals.heartRate} bpm</span>
                  </div>
                )}
              </div>
              <div className="mt-3 text-[10px] text-gray-400">Updated: {new Date(report.date).toLocaleDateString()}</div>
            </div>
          ))}
          {filteredReports.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No reports available</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;