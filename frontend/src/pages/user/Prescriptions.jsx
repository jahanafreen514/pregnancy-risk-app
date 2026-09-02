import React, { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaClipboardList, FaPills, FaSyncAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import UserSidebar from "../../components/UserSidebar";
import bg from "../../assets/images/bg.png";

const API_URL = "http://127.0.0.1:8000/api";

export default function Prescriptions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || localStorage.getItem("access_token") || ""}`,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/prescriptions/my-prescriptions`, { headers: headers() });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to load prescriptions.");
      const unique = new Map();
      (Array.isArray(data) ? data : []).forEach((item) => {
        const key = [item.medicine, item.dosage, item.doctor_name].join("|").toLowerCase();
        const existing = unique.get(key);
        const currentIsActive = item.status === "active" && !item.reviewed_by_patient;
        const existingIsActive = existing?.status === "active" && !existing?.reviewed_by_patient;
        if (!existing || (currentIsActive && !existingIsActive)) unique.set(key, item);
      });
      setItems([...unique.values()]);
    } catch (loadError) {
      setError(loadError.message || "Unable to load prescriptions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateReview = async (item, reviewed) => {
    setUpdatingId(item.id);
    try {
      const response = await fetch(`${API_URL}/prescriptions/${item.id}/reviewed`, {
        method: "PATCH", headers: headers(), body: JSON.stringify({ reviewed }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to update prescription.");
      setItems((current) => current.map((entry) => entry.id === item.id ? data.data : entry));
    } catch (updateError) {
      setError(updateError.message || "Unable to update prescription.");
    } finally {
      setUpdatingId("");
    }
  };
  
  return (
    <main className="min-h-screen bg-cover bg-center bg-fixed px-4 py-5 pt-20 sm:px-6 lg:ml-64 lg:px-8 lg:pt-8" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.72), rgba(255,255,255,.72)), url(${bg})` }}>
      <UserSidebar />
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur-2xl">
          <div><h1 className="flex items-center gap-3 text-3xl font-bold text-gray-800"><FaPills className="text-pink-500" />My Prescriptions</h1><p className="mt-1 text-gray-500">Review instructions from your doctor and confirm completion.</p></div>
          <div className="flex gap-3"><Link to="/dashboard" className="rounded-xl bg-gray-100 px-4 py-2 font-medium text-gray-700">Dashboard</Link><button onClick={load} className="rounded-xl bg-pink-500 px-4 py-2 font-medium text-white"><FaSyncAlt className="mr-2 inline" />Refresh</button></div>
        </div>
        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
        {loading ? <div className="py-16 text-center text-gray-500">Loading prescriptions…</div> : items.length === 0 ? <div className="rounded-3xl bg-white p-12 text-center shadow"><FaClipboardList className="mx-auto mb-3 text-4xl text-pink-400" /><h2 className="text-xl font-bold text-gray-700">No prescriptions yet</h2><p className="mt-2 text-gray-500">Prescriptions issued by your doctor will appear here.</p></div> : <div className="grid gap-5 md:grid-cols-2">{items.map((item) => {
          const completed = item.status === "completed" || item.reviewed_by_patient;
          return <article key={item.id} className="rounded-3xl bg-white p-6 shadow-lg"><div className="mb-4 flex items-start justify-between gap-3"><div><h2 className="text-xl font-bold text-gray-800">{item.medicine}</h2><p className="text-sm text-gray-500">Dr. {item.doctor_name}</p></div><span className={`rounded-full px-3 py-1 text-sm font-semibold ${completed ? "bg-green-100 text-green-700" : item.status === "cancelled" ? "bg-gray-200 text-gray-600" : "bg-sky-100 text-sky-700"}`}>{completed ? "Completed" : item.status}</span></div><dl className="space-y-2 text-gray-700"><div><dt className="text-xs text-gray-500">Dosage</dt><dd>{item.dosage}</dd></div><div><dt className="text-xs text-gray-500">Frequency & timing</dt><dd>{item.frequency} · {item.timing}</dd></div>{item.instructions && <div><dt className="text-xs text-gray-500">Doctor instructions</dt><dd>{item.instructions}</dd></div>}</dl><label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl bg-pink-50 p-3 text-sm font-medium text-gray-700"><input type="checkbox" checked={completed} disabled={item.status === "cancelled" || updatingId === item.id} onChange={(event) => updateReview(item, event.target.checked)} className="h-5 w-5 accent-pink-500" /><FaCheckCircle className={completed ? "text-green-500" : "text-gray-300"} />I reviewed and completed this prescription</label></article>;
        })}</div>}
      </div>
    </main>
  );
}
