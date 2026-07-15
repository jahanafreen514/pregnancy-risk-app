import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNavbar from "../../components/TopNavbar";
import Footer from "../../components/Footer";
import { Bell, AlertTriangle, CheckCircle, Eye, Trash2, Clock } from "lucide-react";

function AdminAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = () => {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const alertList = [];

    allUsers.forEach(user => {
      const riskData = JSON.parse(localStorage.getItem(`riskData_${user.email}`));
      if (riskData && (riskData.risk === "High" || riskData.risk === "Moderate")) {
        alertList.push({
          id: Date.now() + Math.random(),
          user: user.name || "Unknown",
          email: user.email,
          risk: riskData.risk,
          score: riskData.score,
          symptoms: riskData.symptoms || [],
          riskFactors: riskData.riskFactors || [],
          time: new Date().toISOString(),
          read: false,
        });
      }
    });

    setAlerts(alertList);
  };

  const markAsRead = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const deleteAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const filteredAlerts = filter === "all" 
    ? alerts 
    : alerts.filter(a => a.risk.toLowerCase() === filter.toLowerCase());

  const getRiskBadge = (risk) => {
    switch (risk) {
      case "High": return "bg-red-100 text-red-700 border-red-200";
      case "Moderate": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50">
      <Sidebar />
      <main className="ml-72">
        <TopNavbar />
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Alerts</h1>
              <p className="text-sm text-gray-500 mt-1">Monitor all high-risk cases</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                {alerts.filter(a => !a.read).length} New
              </span>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-pink-100/50 shadow-lg">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === "all"
                    ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white"
                    : "bg-pink-50 text-gray-700 hover:bg-pink-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("high")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === "high"
                    ? "bg-red-500 text-white"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                High Risk
              </button>
              <button
                onClick={() => setFilter("moderate")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === "moderate"
                    ? "bg-orange-500 text-white"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                }`}
              >
                Moderate
              </button>
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className={`bg-white/80 backdrop-blur-xl rounded-2xl p-5 border shadow-lg transition-all duration-300 ${
                !alert.read ? "border-red-200" : "border-pink-100/50"
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${!alert.read ? "bg-red-100 animate-pulse" : "bg-gray-100"}`}>
                      {!alert.read ? (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      ) : (
                        <Bell className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-800">{alert.user}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getRiskBadge(alert.risk)}`}>
                          {alert.risk} Risk
                        </span>
                        {!alert.read && (
                          <span className="text-xs text-red-500 font-semibold">● New</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{alert.email}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {alert.symptoms?.slice(0, 3).map((s, i) => (
                          <span key={i} className="px-2 py-1 bg-pink-50 rounded-full text-xs text-pink-600">
                            {s}
                          </span>
                        ))}
                        {alert.riskFactors?.slice(0, 3).map((f, i) => (
                          <span key={i} className="px-2 py-1 bg-red-50 rounded-full text-xs text-red-600">
                            ⚠️ {f}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!alert.read && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="p-2 rounded-xl hover:bg-sky-50 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-5 h-5 text-sky-500" />
                      </button>
                    )}
                    <button className="p-2 rounded-xl hover:bg-pink-50 transition-colors" title="View details">
                      <Eye className="w-5 h-5 text-gray-400" />
                    </button>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-2xl border border-pink-100/50">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3" />
              <p className="text-gray-400">No alerts found</p>
            </div>
          )}

          <Footer />
        </div>
      </main>
    </div>
  );
}

export default AdminAlerts;