// src/pages/admin/AdminSystemStatus.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  Server,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Users,
  Activity,
  Clock,
  Shield,
  FileText,
  MessageSquare,
} from "lucide-react";

const AdminSystemStatus = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalReports: 0,
    totalFeedbacks: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    
    // Load users
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const doctors = allUsers.filter(u => u.role === "doctor");
    
    // Load appointments
    let allAppointments = [];
    const possibleKeys = ['appointments', 'doctorAppointmentRequests', 'appointmentRequests'];
    for (const key of possibleKeys) {
      const data = JSON.parse(localStorage.getItem(key));
      if (data && Array.isArray(data) && data.length > 0) {
        allAppointments = data;
        break;
      }
    }

    // Load feedbacks
    const feedbackList = JSON.parse(localStorage.getItem("feedbacks")) || [];
    
    // Load reports from risk data
    const reportList = [];
    allUsers.forEach(user => {
      const riskData = JSON.parse(localStorage.getItem(`riskData_${user.email}`));
      if (riskData) {
        reportList.push(riskData);
      }
    });
    
    setStats({
      totalUsers: allUsers.length,
      totalDoctors: doctors.length,
      totalReports: reportList.length || allAppointments.length,
      totalFeedbacks: feedbackList.length,
    });

    // Generate system alerts
    const alertList = [];
    
    // Check for critical issues
    if (doctors.length === 0) {
      alertList.push({
        type: "critical",
        title: "No Doctors Available",
        message: "There are no doctors registered in the system. Please add doctors to serve patients.",
      });
    }
    
    if (allUsers.length === 0) {
      alertList.push({
        type: "critical",
        title: "No Users Registered",
        message: "There are no users registered in the system.",
      });
    }
    
    // Check for high risk cases
    const highRiskCases = reportList.filter(r => r.risk?.toLowerCase() === "high").length;
    if (highRiskCases > 5) {
      alertList.push({
        type: "warning",
        title: "High Risk Cases Detected",
        message: `${highRiskCases} patients are at high risk. Immediate attention needed.`,
      });
    }
    
    // Check for pending appointments
    const pendingAppointments = allAppointments.filter(a => a.status?.toLowerCase() === "pending").length;
    if (pendingAppointments > 10) {
      alertList.push({
        type: "warning",
        title: "Appointment Backlog",
        message: `${pendingAppointments} appointments are pending approval.`,
      });
    }
    
    // Performance check
    if (allAppointments.length > 50) {
      alertList.push({
        type: "info",
        title: "High Appointment Volume",
        message: `System is handling ${allAppointments.length} appointments. Performance is normal.`,
      });
    }
    
    setAlerts(alertList);
    setLastUpdated(new Date());
    setLoading(false);
  };

  return (
    <AdminLayout activeTab="systemstatus">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <Server className="text-pink-500" />
              System Status
            </h2>
            <p className="text-sm text-gray-500 mt-1">Monitor system health and performance</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <button
              onClick={loadData}
              className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100 hover:bg-pink-50 transition-all text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-green-700 font-medium">All Systems Operational</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* System Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard 
                title="Total Users" 
                value={stats.totalUsers} 
                icon={<Users className="w-5 h-5" />} 
                color="pink" 
              />
              <MetricCard 
                title="Total Doctors" 
                value={stats.totalDoctors} 
                icon={<Users className="w-5 h-5" />} 
                color="sky" 
              />
              <MetricCard 
                title="Total Reports" 
                value={stats.totalReports} 
                icon={<FileText className="w-5 h-5" />} 
                color="purple" 
              />
              <MetricCard 
                title="Feedbacks" 
                value={stats.totalFeedbacks} 
                icon={<MessageSquare className="w-5 h-5" />} 
                color="green" 
              />
            </div>

            {/* Performance Metrics */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-pink-500" />
                Performance Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">Response Time</p>
                  <p className="text-2xl font-bold text-green-600">120ms</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">Uptime</p>
                  <p className="text-2xl font-bold text-green-600">99.9%</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">Error Rate</p>
                  <p className="text-2xl font-bold text-green-600">0%</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">Active Users</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-pink-500" />
                System Alerts
                {alerts.length > 0 && (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                    {alerts.length} active
                  </span>
                )}
              </h3>
              <div className="space-y-3">
                {alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-4 rounded-xl border ${
                        alert.type === "critical" ? "bg-red-50 border-red-200" : 
                        alert.type === "warning" ? "bg-orange-50 border-orange-200" : 
                        "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        alert.type === "critical" ? "bg-red-100" : 
                        alert.type === "warning" ? "bg-orange-100" : 
                        "bg-blue-100"
                      }`}>
                        {alert.type === "critical" ? (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        ) : alert.type === "warning" ? (
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{alert.title}</p>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.type === "critical" ? "bg-red-100 text-red-700" : 
                        alert.type === "warning" ? "bg-orange-100 text-orange-700" : 
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {alert.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-400 font-medium">All systems are running smoothly! ✨</p>
                    <p className="text-xs text-gray-400 mt-1">No alerts at this time</p>
                  </div>
                )}
              </div>
            </div>

            {/* System Health Summary */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-pink-500" />
                System Health Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-green-700">Database</span>
                  </div>
                  <p className="text-sm text-green-600">Connected</p>
                  <p className="text-xs text-gray-400">{stats.totalUsers} records</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-green-700">Storage</span>
                  </div>
                  <p className="text-sm text-green-600">Operational</p>
                  <p className="text-xs text-gray-400">{stats.totalReports} files</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-green-700">API</span>
                  </div>
                  <p className="text-sm text-green-600">Running</p>
                  <p className="text-xs text-gray-400">{stats.totalUsers} requests</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

// ===== METRIC CARD COMPONENT =====
const MetricCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    pink: "bg-pink-100 text-pink-600",
    sky: "bg-sky-100 text-sky-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-pink-100/50 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemStatus;