import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock, Search, RefreshCw, XCircle } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { apiUrl } from "../../config/runtime";

const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token") || ""}` });
const verificationStatus = (doctor) => doctor.is_verified || doctor.verification_status === "approved" ? "approved" : doctor.verification_status || "not_uploaded";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDoctors = async () => {
    setLoading(true); setMessage("");
    try {
      const response = await fetch(apiUrl("/admin/doctors"), { headers: headers() });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to load doctors.");
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) { setMessage(error.message || "Unable to load doctors."); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadDoctors(); }, []);

  const review = async (doctor, action) => {
    try {
      const response = await fetch(apiUrl(`/admin/doctors/${doctor.user_id}/${action}`), { method: "PUT", headers: headers() });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || `Unable to ${action} doctor.`);
      setMessage(action === "approve" ? "Doctor approved." : "Doctor declined.");
      loadDoctors();
    } catch (error) { setMessage(error.message || "Review failed."); }
  };

  const openDocument = async (doctorId, type) => {
    const preview = window.open("", "_blank");
    try {
      const response = await fetch(apiUrl(`/doctors/${doctorId}/verification-document/${type}`), { headers: headers() });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Unable to open verification document.");
      }
      const objectUrl = URL.createObjectURL(await response.blob());
      if (preview) preview.location.href = objectUrl;
      else window.open(objectUrl, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch (error) {
      if (preview) preview.close();
      setMessage(error.message || "Unable to open verification document.");
    }
  };

  const filtered = useMemo(() => doctors.filter((doctor) => {
    const haystack = [doctor.name, doctor.email, doctor.specialization, doctor.hospital].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(query.toLowerCase()) && (status === "all" || verificationStatus(doctor) === status);
  }), [doctors, query, status]);
  const totals = { total: doctors.length, approved: doctors.filter((d) => verificationStatus(d) === "approved").length, pending: doctors.filter((d) => verificationStatus(d) === "pending").length };

  return <AdminLayout activeTab="doctors"><div className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur-2xl"><div><h1 className="text-3xl font-extrabold text-slate-800">Doctor verification</h1><p className="mt-1 text-sm text-slate-500">Review both submitted documents before approving a doctor.</p></div><button onClick={loadDoctors} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-sky-400 px-4 py-2 font-semibold text-white"><RefreshCw className="h-4 w-4" />Refresh</button></header>
    <div className="grid gap-4 sm:grid-cols-3">{[["Total", totals.total, "text-slate-800"], ["Approved", totals.approved, "text-green-600"], ["Pending", totals.pending, "text-amber-600"]].map(([label, value, color]) => <div key={label} className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg"><p className="text-sm text-slate-500">{label}</p><p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p></div>)}</div>
    <div className="flex flex-wrap gap-3 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-lg"><label className="relative min-w-60 flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, hospital, specialty..." className="w-full rounded-xl border border-pink-100 py-2 pl-10 pr-3" /></label><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-pink-100 bg-white px-3"><option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="not_uploaded">Documents missing</option></select></div>
    {message && <p className="rounded-xl bg-sky-50 p-3 text-sm text-sky-700">{message}</p>}
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{loading ? <p className="text-slate-500">Loading doctors...</p> : filtered.map((doctor) => { const current = verificationStatus(doctor); return <article key={doctor.user_id} className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-xl"><div className="flex items-start justify-between gap-3"><div><h2 className="font-bold text-slate-800">{doctor.name}</h2><p className="text-sm text-slate-500">{doctor.specialization || "Specialization not provided"}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${current === "approved" ? "bg-green-100 text-green-700" : current === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{current}</span></div><div className="mt-4 space-y-1 text-sm text-slate-600"><p>{doctor.email}</p><p>{doctor.phone || "Phone not provided"}</p><p>{doctor.hospital || "Hospital not provided"}</p></div><div className="mt-4 flex flex-wrap gap-2">{doctor.license_image && <button type="button" onClick={() => openDocument(doctor.user_id, "license")} className="rounded-lg bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700">View license</button>}{doctor.hospital_id_image && <button type="button" onClick={() => openDocument(doctor.user_id, "hospital-id")} className="rounded-lg bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700">View hospital ID</button>}</div>{current === "pending" ? <div className="mt-5 grid grid-cols-2 gap-2"><button onClick={() => review(doctor, "approve")} className="flex items-center justify-center gap-1 rounded-xl bg-green-500 p-2 text-sm font-bold text-white"><CheckCircle className="h-4 w-4" />Accept</button><button onClick={() => review(doctor, "reject")} className="flex items-center justify-center gap-1 rounded-xl bg-red-500 p-2 text-sm font-bold text-white"><XCircle className="h-4 w-4" />Decline</button></div> : <p className="mt-5 flex items-center gap-1 text-sm font-semibold text-slate-500">{current === "approved" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4" />}{current === "approved" ? "Approved" : "No action available"}</p>}</article>; })}{!loading && filtered.length === 0 && <p className="rounded-2xl bg-white/80 p-8 text-center text-slate-500">No doctors match this filter.</p>}</section>
  </div></AdminLayout>;
}
