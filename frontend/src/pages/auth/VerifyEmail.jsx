import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const API = "http://127.0.0.1:8000/api/auth";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(params.get("email") || "");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async (event) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch(`${API}/verify-email`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Verification failed");
      setMessage("Email verified. You can now sign in.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const resend = async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch(`${API}/resend-verification`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to resend OTP");
      setMessage(data.message);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return <main className="min-h-screen flex items-center justify-center bg-pink-50 p-4"><form onSubmit={verify} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl space-y-4"><h1 className="text-2xl font-bold text-pink-600">Verify your email</h1><p className="text-sm text-gray-600">Enter the six-digit OTP sent to your registered email.</p>{message && <p className="text-sm text-green-600">{message}</p>}{error && <p className="text-sm text-red-600">{error}</p>}<input className="w-full border rounded-lg p-3" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required /><input className="w-full border rounded-lg p-3" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit OTP" required /><button className="w-full rounded-lg bg-pink-500 p-3 font-semibold text-white disabled:opacity-50" disabled={loading}>{loading ? "Please wait..." : "Verify email"}</button><button type="button" onClick={resend} className="w-full text-sm text-pink-600" disabled={loading}>Resend OTP</button><Link className="block text-center text-sm text-gray-500" to="/login">Back to login</Link></form></main>;
}
