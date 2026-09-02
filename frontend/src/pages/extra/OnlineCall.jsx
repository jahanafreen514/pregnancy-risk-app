import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../../config/runtime";

// WhatsApp does not expose call state (ringing, accepted, missed, or ended) to
// third-party websites. GlowCare securely shares the appointment contact only
// after the appointment is accepted; participants start the voice/video call
// using WhatsApp's own call controls.
export default function OnlineCall() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const role = JSON.parse(localStorage.getItem("currentUser") || "null")?.role;
  const [contact, setContact] = useState(null);
  const [joined, setJoined] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("");
  const [updating, setUpdating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState("Loading appointment contact…");

  useEffect(() => {
    async function loadContact() {
      try {
        const response = await fetch(apiUrl(`/appointments/${appointmentId}/contact`), {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Unable to load appointment contact.");
        setContact(data);
        setStatus("Open the secure WhatsApp chat, then use WhatsApp’s audio or video call button.");
      } catch (error) {
        setStatus(error.message || "Unable to load appointment contact.");
      }
    }
    loadContact();
  }, [appointmentId]);

  useEffect(() => {
    const checkCompletion = async () => {
      try {
        const response = await fetch(apiUrl(`/calls/${appointmentId}/status`), { headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` } });
        const data = response.ok ? await response.json() : null;
        if (data?.appointment_status === "completed") setCompleted(true);
      } catch { /* leave the call controls available while offline */ }
    };
    checkCompletion();
    const timer = setInterval(checkCompletion, 5000);
    return () => clearInterval(timer);
  }, [appointmentId]);

  const phone = `${contact?.country_code || ""}${contact?.phone || ""}`.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent("Hello, this is regarding our GlowCare appointment.")}`;
  const backPath = role === "doctor" ? "/doctor-appointments" : "/appointment";

  const confirm = async (action) => {
    setUpdating(true); setCompletionMessage("");
    try {
      const response = await fetch(apiUrl(`/calls/${appointmentId}/${action}`), { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to update consultation");
      if (action === "joined") { setJoined(true); setCompletionMessage(data.both_joined ? "Both participants joined. Confirm when the consultation is finished." : "Your attendance is saved. Waiting for the other participant to join."); }
      else { setCompletionMessage(data.message); if (data.completed) setCompleted(true); }
    } catch (error) { setCompletionMessage(error.message || "Unable to update consultation"); }
    finally { setUpdating(false); }
  };

  return <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 p-6">
    <section className="mx-auto max-w-lg rounded-3xl border border-white/70 bg-white/90 p-8 text-center shadow-xl">
      <p className="text-sm font-bold uppercase tracking-wider text-pink-500">GlowCare consultation</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-800">{completed ? "Appointment completed" : "Continue in WhatsApp"}</h1>
      <p className="mt-3 text-slate-600">{completed ? "Both participants confirmed the consultation. This appointment is now completed." : status}</p>
      {contact && !completed && <>
        <div className="mt-6 rounded-2xl bg-pink-50 p-5"><p className="font-bold text-slate-800">{contact.name}</p><p className="mt-1 text-sm text-slate-600">{contact.country_code} {contact.phone}</p></div>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-6 block rounded-xl bg-[#25D366] px-5 py-3 font-bold text-white shadow-lg">Open WhatsApp chat</a>
        <p className="mt-3 text-xs text-slate-500">Use the voice or video icon inside WhatsApp to call. Call activity is managed privately by WhatsApp.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2"><button disabled={joined || updating} onClick={() => confirm("joined")} className="rounded-xl bg-sky-500 px-4 py-3 font-bold text-white disabled:opacity-50">{joined ? "Attendance confirmed" : "I joined the consultation"}</button><button disabled={!joined || updating} onClick={() => confirm("complete")} className="rounded-xl bg-pink-500 px-4 py-3 font-bold text-white disabled:opacity-50">Confirm consultation finished</button></div>
        {completionMessage && <p className="mt-3 rounded-xl bg-sky-50 p-3 text-sm text-sky-700">{completionMessage}</p>}
      </>}
      <Link to={backPath} onClick={() => navigate(backPath)} className="mt-5 inline-block text-sm font-semibold text-pink-600">{completed ? "View completed appointment" : "Back to appointments"}</Link>
    </section>
  </main>;
}
