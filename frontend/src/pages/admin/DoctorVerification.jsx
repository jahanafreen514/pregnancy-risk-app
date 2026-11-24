import React, { useEffect, useState, useCallback } from "react";
import { apiUrl } from "../../config/runtime";
import {
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaEye,
  FaSpinner,
  FaShieldAlt,
  FaRedoAlt,
  FaAward,
  FaBuilding,
  FaIdCard,
  FaClock
} from "react-icons/fa";

function DoctorVerification() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [reviewNotes, setReviewNotes] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "ai_reviewed", "manual_verification_required", "pending"

  const token = localStorage.getItem("token");

  const fetchPendingDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl("/admin/doctors/pending"), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (err) {
      console.error("Failed to fetch pending doctors:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPendingDoctors();
  }, [fetchPendingDoctors]);

  const handleAction = async (id, action) => {
    setActionLoading(id);
    const note = reviewNotes[id] || "";
    try {
      const endpoint = `${apiUrl()}/admin/doctors/${id}/${action}`;
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ admin_review_notes: note })
      });
      if (response.ok) {
        setReviewNotes((prev) => ({ ...prev, [id]: "" }));
        fetchPendingDoctors();
      } else {
        const err = await response.json();
        alert(err.detail || `Action ${action} failed.`);
      }
    } catch (e) {
      alert(`Network error during ${action}.`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ai_reviewed":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
            <FaShieldAlt /> AI Review Completed
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
            <FaCheckCircle /> Verified Doctor
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
            <FaTimesCircle /> Rejected
          </span>
        );
      case "manual_verification_required":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
            <FaExclamationTriangle /> Manual Review Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
            <FaClock /> Pending OCR
          </span>
        );
    }
  };

  const getScoreColor = (score) => {
    if (score >= 88) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 65) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const filteredDoctors = doctors.filter((doc) => {
    if (filter === "all") return true;
    return doc.verification_status === filter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-pink-100">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-sky-400 flex items-center justify-center text-white text-xl shadow-md">
              <FaShieldAlt />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Doctor Certificate Verification
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                AI + ML + OCR Intelligent Document Verification Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {["all", "ai_reviewed", "manual_verification_required", "pending"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                filter === tab
                  ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.replace(/_/g, " ")} ({tab === "all" ? doctors.length : doctors.filter((d) => d.verification_status === tab).length})
            </button>
          ))}
          <button
            onClick={fetchPendingDoctors}
            className="p-2 rounded-full text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition"
            title="Refresh"
          >
            <FaRedoAlt className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* DOCTORS LIST */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-500">
          <FaSpinner className="text-4xl text-pink-500 animate-spin mb-3" />
          <p className="text-sm font-medium">Loading pending doctor credentials...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 text-center border border-pink-100 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <FaCheckCircle />
          </div>
          <h3 className="text-lg font-bold text-gray-800">All Caught Up!</h3>
          <p className="text-sm text-gray-500 mt-1">
            No doctors are currently awaiting verification in this category.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredDoctors.map((doc) => {
            const score = Math.round(doc.verification_confidence_score || 0);
            const notes = reviewNotes[doc._id] || "";

            return (
              <div
                key={doc._id}
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-md border border-pink-100/80 p-6 transition-all hover:shadow-lg"
              >
                {/* TOP BAR: DOCTOR IDENTITY & STATUS */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {doc.registered_name?.charAt(0) || "D"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-900">
                          {doc.registered_name || "Doctor"}
                        </h2>
                        {getStatusBadge(doc.verification_status)}
                      </div>
                      <p className="text-xs text-gray-500">
                        {doc.email} • {doc.phone || "No phone"} • Specialization:{" "}
                        <span className="font-semibold text-gray-700">{doc.specialization || "General"}</span>
                      </p>
                    </div>
                  </div>

                  {/* AI CONFIDENCE SCORE BADGE */}
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100">
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">AI Verification Score</p>
                      <p className="text-xs text-gray-500">Explainable Confidence</p>
                    </div>
                    <div className={`px-3 py-1 rounded-xl font-extrabold text-lg border ${getScoreColor(score)}`}>
                      {score}%
                    </div>
                  </div>
                </div>

                {/* COMPARISON GRID */}
                <div className="grid lg:grid-cols-12 gap-6 my-6">
                  {/* LEFT: REGISTERED DATA */}
                  <div className="lg:col-span-4 bg-sky-50/40 rounded-2xl p-4 border border-sky-100">
                    <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <FaUserMd /> Registered Information
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-gray-400">Doctor Name:</span>
                        <p className="font-semibold text-gray-800">{doc.registered_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Stated License Number:</span>
                        <p className="font-semibold text-gray-800">{doc.license_number || "Not provided"}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Hospital / Clinic:</span>
                        <p className="font-semibold text-gray-800">{doc.hospital || "Not provided"}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Address / City:</span>
                        <p className="font-semibold text-gray-800">
                          {[doc.city, doc.state, doc.pincode].filter(Boolean).join(", ") || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CENTER: AI/ML EXTRACTED CREDENTIALS */}
                  <div className="lg:col-span-5 bg-pink-50/40 rounded-2xl p-4 border border-pink-100">
                    <h3 className="text-xs font-bold text-pink-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <FaAward /> AI-Extracted from Certificate
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Extracted Name:</span>
                        <p className="font-bold text-gray-900">{doc.extracted_doctor_name || "—"}</p>
                        {doc.name_match_score > 0 && (
                          <span className={`text-[10px] font-semibold ${doc.name_match_score >= 80 ? "text-green-600" : "text-amber-600"}`}>
                            Match: {Math.round(doc.name_match_score)}%
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-gray-400">Extracted Reg Number:</span>
                        <p className="font-bold text-gray-900">{doc.extracted_license_number || "—"}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Issuing Medical Council:</span>
                        <p className="font-semibold text-gray-800">{doc.extracted_issuing_authority || "—"}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Qualifications:</span>
                        <p className="font-semibold text-gray-800">
                          {doc.extracted_qualifications && doc.extracted_qualifications.length > 0
                            ? doc.extracted_qualifications.join(", ")
                            : "None recognized"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: DOCUMENT PREVIEWS */}
                  <div className="lg:col-span-3 flex flex-col justify-between bg-gray-50/70 rounded-2xl p-4 border border-gray-100">
                    <div>
                      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Uploaded Proofs
                      </h3>
                      <div className="space-y-2">
                        <button
                          onClick={() =>
                            setSelectedImage(`${apiUrl()}/doctors/${doc.user_id}/verification-document/license`)
                          }
                          className="w-full flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:border-pink-300 hover:text-pink-600 transition"
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <FaIdCard className="text-pink-500" /> Medical License
                          </span>
                          <FaEye className="text-gray-400" />
                        </button>

                        <button
                          onClick={() =>
                            setSelectedImage(`${apiUrl()}/doctors/${doc.user_id}/verification-document/hospital-id`)
                          }
                          className="w-full flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:border-sky-300 hover:text-sky-600 transition"
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <FaBuilding className="text-sky-500" /> Hospital ID
                          </span>
                          <FaEye className="text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* MINI SCORES */}
                    <div className="mt-3 pt-3 border-t border-gray-200/60 grid grid-cols-2 gap-1 text-[11px] text-gray-500">
                      <div>Quality: <span className="font-bold text-gray-700">{Math.round(doc.document_quality_score || 0)}%</span></div>
                      <div>OCR: <span className="font-bold text-gray-700">{Math.round(doc.ocr_confidence || 0)}%</span></div>
                    </div>
                  </div>
                </div>

                {/* AI VERIFICATION REASONS & WARNINGS */}
                <div className="space-y-2 mb-6">
                  {doc.verification_reasons && doc.verification_reasons.length > 0 && (
                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3">
                      <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FaCheckCircle className="text-emerald-500" /> AI Verification Findings
                      </p>
                      <ul className="list-disc list-inside text-xs text-emerald-700 space-y-0.5">
                        {doc.verification_reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {doc.verification_warnings && doc.verification_warnings.length > 0 && (
                    <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-3">
                      <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FaExclamationTriangle className="text-amber-500" /> Discrepancies & Warnings
                      </p>
                      <ul className="list-disc list-inside text-xs text-amber-700 space-y-0.5">
                        {doc.verification_warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* ADMIN ACTION PANEL */}
                <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="w-full md:flex-1">
                    <input
                      type="text"
                      placeholder="Admin review notes / rejection reason (optional)..."
                      value={notes}
                      onChange={(e) =>
                        setReviewNotes({ ...reviewNotes, [doc._id]: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      disabled={actionLoading === doc._id}
                      onClick={() => handleAction(doc._id, "request-reupload")}
                      className="flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition border border-amber-200"
                    >
                      Request Re-upload
                    </button>

                    <button
                      disabled={actionLoading === doc._id}
                      onClick={() => handleAction(doc._id, "reject")}
                      className="flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition border border-rose-200"
                    >
                      Reject
                    </button>

                    <button
                      disabled={actionLoading === doc._id}
                      onClick={() => handleAction(doc._id, "approve")}
                      className="flex-1 md:flex-none px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition"
                    >
                      {actionLoading === doc._id ? "Processing..." : "Approve & Verify"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-gray-800 text-sm">Certificate Evidence Preview</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-gray-50">
              <img
                src={selectedImage}
                alt="Verification Document"
                className="max-h-[75vh] w-auto rounded-xl shadow-md border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/800x600?text=Protected+Document+Preview";
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorVerification;
