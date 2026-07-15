import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHeartbeat,
  FaBaby,
  FaStethoscope,
  FaShieldAlt,
  FaHeart,
  FaSpinner,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const Splash = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    // Navigate to home after 3.5 seconds
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
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

      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300/30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: -100,
              x: Math.random() * window.innerWidth,
              rotate: 360,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          >
            <FaHeart className="text-4xl" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-3xl px-6">
        {/* Logo with Pulse Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1,
          }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-pink-300 blur-3xl opacity-60 animate-pulse"></div>
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-sky-400 flex items-center justify-center shadow-2xl animate-float">
              <FaHeartbeat className="text-white text-5xl animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 mb-3"
        >
          <span className="bg-gradient-to-r from-pink-500 to-sky-400 bg-clip-text text-transparent">
            GlowCare
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg sm:text-xl text-gray-600 font-medium mb-2"
        >
          Maternal Health Monitoring System
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-sm text-gray-500 mb-8"
        >
          Caring for Mothers • Monitoring Health • Saving Lives
        </motion.p>

        {/* Features Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium text-pink-600 border border-pink-200 shadow-sm flex items-center gap-1.5">
            <FaBaby className="text-pink-500" />
            Pregnancy Tracking
          </span>
          <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium text-sky-600 border border-sky-200 shadow-sm flex items-center gap-1.5">
            <FaStethoscope className="text-sky-500" />
            Health Monitoring
          </span>
          <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium text-purple-600 border border-purple-200 shadow-sm flex items-center gap-1.5">
            <FaShieldAlt className="text-purple-500" />
            AI Predictions
          </span>
        </motion.div>

        {/* Loading Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="max-w-xs mx-auto"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-sky-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-xs font-medium text-gray-400 min-w-[2.5rem]">
              {progress}%
            </span>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-2"
        >
          <span className="animate-spin">⏳</span>
          Preparing your health dashboard...
        </motion.p>

        {/* Version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-[10px] text-gray-300 mt-4"
        >
          v2.0 • Secure • HIPAA Compliant
        </motion.p>
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

export default Splash;