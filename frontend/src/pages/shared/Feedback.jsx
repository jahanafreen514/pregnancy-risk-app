import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../../config/runtime";
import UserSidebar from "../../components/UserSidebar";

const DoctorFeedbackSidebar = () => <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-pink-100/50 bg-white/80 p-5 shadow-xl backdrop-blur-2xl"><Link to="/doctor-dashboard"><h1 className="text-2xl font-bold text-pink-500">GlowCare</h1><p className="text-sm text-gray-500">Doctor Portal</p></Link><nav className="mt-8 flex-1 space-y-2"><Link className="block rounded-xl p-3 text-sm font-medium text-gray-700 hover:bg-pink-100" to="/doctor-dashboard">Dashboard</Link><Link className="block rounded-xl p-3 text-sm font-medium text-gray-700 hover:bg-pink-100" to="/doctor-appointments">Appointments</Link><Link className="block rounded-xl p-3 text-sm font-medium text-gray-700 hover:bg-pink-100" to="/doctor-notifications">Notifications</Link><Link className="block rounded-xl bg-gradient-to-r from-pink-500 to-sky-400 p-3 text-sm font-bold text-white" to="/share-feedback">Feedback</Link><Link className="block rounded-xl p-3 text-sm font-medium text-gray-700 hover:bg-pink-100" to="/doctor-settings">Settings</Link></nav><button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("currentUser"); window.location.href = "/doctor-login"; }} className="rounded-xl bg-pink-100 px-5 py-2 font-semibold text-pink-600">Logout</button></aside>;

export default function Feedback() {
  const role = JSON.parse(localStorage.getItem("currentUser") || "null")?.role;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    const response = await fetch(apiUrl("/feedback"), { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || localStorage.getItem("access_token") || ""}` }, body: JSON.stringify({ rating, comment, category }) });
    const data = await response.json();
    if (!response.ok) return setMessage(data.detail || "Unable to submit feedback.");
    setComment(""); setMessage("Thank you. Your feedback was sent to the GlowCare administrator.");
  };
  const dashboardPath = role === "doctor" ? "/doctor-dashboard" : "/dashboard";
  return <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 p-6 pl-72"><>{role === "doctor" ? <DoctorFeedbackSidebar /> : <UserSidebar />}</><div className="mx-auto max-w-xl rounded-3xl border border-white/70 bg-white/85 p-8 shadow-xl backdrop-blur-xl"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-sky-500">GlowCare</p><h1 className="text-3xl font-bold text-gray-800">Share Feedback</h1></div><Link to={dashboardPath} className="rounded-xl bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600">Dashboard</Link></div><form onSubmit={submit} className="space-y-5"><label className="block text-sm font-semibold text-gray-700">Your rating<select value={rating} onChange={event => setRating(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-pink-100 bg-pink-50/40 p-3">{[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{value} / 5</option>)}</select></label><label className="block text-sm font-semibold text-gray-700">Category<select value={category} onChange={event => setCategory(event.target.value)} className="mt-2 w-full rounded-xl border border-pink-100 bg-pink-50/40 p-3"><option value="general">General</option><option value="appointment">Appointment</option><option value="consultation">Consultation</option><option value="app">App experience</option></select></label><label className="block text-sm font-semibold text-gray-700">Comments<textarea required value={comment} onChange={event => setComment(event.target.value)} className="mt-2 min-h-32 w-full rounded-xl border border-pink-100 bg-pink-50/40 p-3" placeholder="Tell us what we can improve" /></label><button className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-sky-400 p-3 font-semibold text-white shadow-lg">Send feedback</button></form>{message && <p className="mt-4 rounded-xl bg-sky-50 p-3 text-sm text-sky-700">{message}</p>}</div></main>;
}
