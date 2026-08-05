// AdminUsers.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  Users,
  Search,
  RefreshCw,
  CheckCircle,
  UserCog,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

 const loadUsers = async () => {

  try {

    setLoading(true);


    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");



    const response = await fetch(
      "http://127.0.0.1:8000/api/admin/users",
      {
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"application/json"
        }
      }
    );



    const data =
      await response.json();



    console.log(
      "ADMIN USERS RESPONSE:",
      data
    );



    const usersData =
      Array.isArray(data)
      ?
      data
      :
      data.users ||
      data.data ||
      [];



    setUsers(usersData);

    setFilteredUsers(usersData);


  }

  catch(error){

    console.log(
      "Users loading error:",
      error
    );

  }

  finally{

    setLoading(false);

  }

};
  useEffect(() => {
    let filtered = [...users];
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.name?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search)
      );
    }
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <AdminLayout activeTab="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <Users className="text-pink-500" />
              Users Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">Manage all users in the system</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadUsers}
              className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100 hover:bg-pink-50 transition-all text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
              <span className="text-sm font-medium text-gray-700">{filteredUsers.length} users</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-pink-100 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-pink-100">
                    <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id || user._id || user.email}
                      className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm">
                            {getInitials(user.name)}
                          </div>
                          <span className="font-medium text-gray-800">{user.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-600">{user.email}</td>
                      <td className="py-3 px-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.role === "doctor" ? "bg-sky-100 text-sky-700" :
                          user.role === "admin" ? "bg-purple-100 text-purple-700" :
                          "bg-pink-100 text-pink-700"
                        }`}>
                          {user.role || "User"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No users found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;