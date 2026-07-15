// AdminFeedback.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  MessageSquare,
  Search,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = () => {
    setLoading(true);
    const feedbackList = JSON.parse(localStorage.getItem("feedbacks")) || [];
    setFeedbacks(feedbackList);
    setFilteredFeedbacks(feedbackList);
    setLoading(false);
  };

  useEffect(() => {
    let filtered = [...feedbacks];
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(f =>
        f.userName?.toLowerCase().includes(search) ||
        f.comment?.toLowerCase().includes(search)
      );
    }
    setFilteredFeedbacks(filtered);
  }, [searchTerm, feedbacks]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 inline ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <AdminLayout activeTab="feedback">
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <MessageSquare className="text-pink-500" />
              Feedback & Reviews
            </h2>
            <p className="text-sm text-gray-500 mt-1">View all user feedback and reviews</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadFeedbacks}
              className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100 hover:bg-pink-50 transition-all text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
              <span className="text-sm font-medium text-gray-700">{filteredFeedbacks.length} feedbacks</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by user or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-pink-100 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedbacks.map((feedback, index) => (
                <div key={index} className="p-4 bg-pink-50/30 rounded-xl border border-pink-100/30 hover:bg-pink-50/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm">
                        {feedback.userName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{feedback.userName || "Anonymous"}</p>
                        <div className="flex items-center gap-1">
                          {renderStars(feedback.rating || 0)}
                          <span className="text-xs text-gray-400 ml-1">({feedback.rating || 0}/5)</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-gray-700">{feedback.comment}</p>
                  <p className="mt-1 text-xs text-gray-400">{feedback.date || new Date().toLocaleDateString()}</p>
                </div>
              ))}
              {filteredFeedbacks.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No feedback found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFeedback;