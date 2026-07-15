// AdminDoctors.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  UserCog,
  Search,
  RefreshCw,
  CheckCircle,
  Stethoscope,
  Hospital,
  Mail,
  Phone,
} from "lucide-react";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = () => {
    setLoading(true);
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const doctorsList = allUsers.filter(u => u.role === "doctor");
    setDoctors(doctorsList);
    setFilteredDoctors(doctorsList);
    setLoading(false);
  };

  useEffect(() => {
    let filtered = [...doctors];
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(d =>
        d.name?.toLowerCase().includes(search) ||
        d.email?.toLowerCase().includes(search) ||
        d.specialization?.toLowerCase().includes(search)
      );
    }
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  const getInitials = (name) => {
    if (!name) return "D";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <AdminLayout activeTab="doctors">
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <UserCog className="text-pink-500" />
              Doctors Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">Manage all doctors in the system</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadDoctors}
              className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100 hover:bg-pink-50 transition-all text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
              <span className="text-sm font-medium text-gray-700">{filteredDoctors.length} doctors</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-pink-100 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white/80 backdrop-blur-2xl rounded-2xl p-5 border border-pink-100/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {getInitials(doctor.name)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{doctor.name}</h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" /> {doctor.specialization || "General"}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <p className="text-gray-600 flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gray-400" /> {doctor.email}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Phone className="w-3 h-3 text-gray-400" /> {doctor.phone || "N/A"}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Hospital className="w-3 h-3 text-gray-400" /> {doctor.hospital || "N/A"}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Active
                </span>
              </div>
            </div>
          ))}
          {filteredDoctors.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              <UserCog className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No doctors found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDoctors;