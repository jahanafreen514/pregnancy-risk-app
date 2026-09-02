import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeartbeat,
  FaLock,
  FaEnvelope,
  FaArrowLeft,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
      setOtpSent(true);
      setStep(2);
      setSuccess(data.message || "OTP sent. Please check your inbox.");
    } else {
      setError(data.detail || "Unable to send OTP.");
    }
    } catch {
      setError("Unable to reach the server. Please try again shortly.");
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/validate-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Invalid OTP");
      setStep(3);
      setSuccess("OTP verified. Please set your new password.");
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, new_password: newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Could not reset the password.");
      } else {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch {
      setError("Unable to reach the server. Please try again shortly.");
    }
    setIsLoading(false);
  };

  const resendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setSuccess(response.ok ? (data.message || "OTP resent.") : (data.detail || "Unable to resend OTP."));
    } catch {
      setError("Unable to reach the server. Please try again shortly.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* Floating Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-pink-300 blur-[140px] opacity-20 animate-pulse"></div>
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-pink-200 blur-[120px] opacity-10 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-300 via-pink-200 to-sky-300 blur-2xl opacity-70 animate-pulse"></div>
          
          <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/70 shadow-2xl p-8">
            {/* Back Button */}
            <button
              onClick={() => navigate("/login")}
              className="mb-4 flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-all duration-300 group"
            >
              <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Login</span>
            </button>

            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-pink-300 blur-2xl opacity-60 animate-pulse"></div>
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-sky-400 flex items-center justify-center shadow-2xl animate-float">
                  <FaHeartbeat className="text-white text-2xl animate-pulse" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Reset Password"}
            </h2>
            <p className="text-center text-gray-500 text-sm mt-1 mb-6">
              {step === 1 && "Enter your email to receive an OTP"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Set your new password"}
            </p>

            {/* Success/Error Messages */}
            {success && typeof success === 'string' && (
              <div className="mb-4 p-3.5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-600">
                <FaCheckCircle className="text-lg flex-shrink-0" />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600">
                <FaTimesCircle className="text-lg flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Step 1: Email */}
            {step === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      required
                      className="w-full rounded-2xl border border-pink-100 bg-white/90 pl-12 pr-4 py-3.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 hover:shadow-lg"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 py-3.5 text-base font-bold text-white shadow-lg hover:shadow-pink-300/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Enter OTP
                  </label>
                  <div className="relative group">
                    <FaShieldAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      required
                      className="w-full rounded-2xl border border-pink-100 bg-white/90 pl-12 pr-4 py-3.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 hover:shadow-lg"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Check your registered email for the six-digit OTP.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 py-3.5 text-base font-bold text-white shadow-lg hover:shadow-pink-300/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <button
                  type="button"
                  onClick={resendOTP}
                  className="w-full text-center text-sm text-pink-500 hover:text-pink-600 font-medium transition-colors"
                >
                  Resend OTP
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      className="w-full rounded-2xl border border-pink-100 bg-white/90 pl-12 pr-4 py-3.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 hover:shadow-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      className="w-full rounded-2xl border border-pink-100 bg-white/90 pl-12 pr-4 py-3.5 text-sm outline-none transition-all duration-300 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 hover:shadow-lg"
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>Password must contain:</p>
                  <p>• At least 8 characters</p>
                  <p>• One uppercase letter</p>
                  <p>• One lowercase letter</p>
                  <p>• One number</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 py-3.5 text-base font-bold text-white shadow-lg hover:shadow-pink-300/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-pink-100/50 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <FaShieldAlt className="text-pink-400" />
                <span>Your data is encrypted and secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
