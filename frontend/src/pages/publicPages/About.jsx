import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeartbeat,
  FaBaby,
  FaStethoscope,
  FaShieldAlt,
  FaChartLine,
  FaBell,
  FaUserMd,
  FaCalendarAlt,
  FaClipboardList,
  FaLightbulb,
  FaRocket,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
  FaRobot,
  FaDatabase,
  FaCloud,
  FaMobile,
  FaShieldVirus,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";
import { apiUrl } from "../../config/runtime";

const About = () => {
  const [systemInfo, setSystemInfo] = useState(null);
  useEffect(() => {
    fetch(apiUrl("/contact/about"))
      .then((response) => response.ok ? response.json() : null)
      .then(setSystemInfo)
      .catch(() => setSystemInfo(null));
  }, []);
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center"
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-8">
        {/* Header - Moved down with pt-24 */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-pink-300 blur-2xl opacity-60 animate-pulse"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-sky-400 flex items-center justify-center shadow-2xl animate-float">
                <FaHeartbeat className="text-white text-3xl animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
            About GlowCare
          </h1>
          <p className="text-gray-500 text-lg mt-3">
            Revolutionizing Maternal Healthcare with ML-Powered Insights
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Mission Section */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/70 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-sky-100 flex items-center justify-center">
                <FaRocket className="text-pink-500 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              GlowCare is dedicated to transforming maternal healthcare by leveraging 
              cutting-edge Machine Learning and Artificial Intelligence to provide 
              continuous monitoring, early risk detection, and personalized support 
              for expectant mothers. Our mission is to reduce maternal mortality rates 
              and ensure safe pregnancies through intelligent technology.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/70 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800">Live system information</h2>
            {systemInfo ? <div className="mt-3 text-sm text-gray-600 space-y-1"><p>Risk levels: {systemInfo.risk_classes?.join(", ")}</p><p>Model: {systemInfo.model_algorithm} · {systemInfo.feature_count} health inputs</p><p className="text-xs text-gray-400">{systemInfo.disclaimer}</p></div> : <p className="mt-3 text-sm text-gray-400">System information is temporarily unavailable.</p>}
          </div>

          {/* Problem Section */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/70 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
                <FaShieldVirus className="text-red-500 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">The Problem We Solve</h2>
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Every year, millions of women face pregnancy complications that could 
              have been prevented with early detection and timely intervention. 
              Traditional healthcare systems often lack the tools for continuous 
              monitoring and real-time risk assessment. GlowCare bridges this gap 
              by providing:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-red-50/50 rounded-xl p-4 border border-red-100/50">
                <h4 className="font-semibold text-gray-800">⚠️ Late Detection</h4>
                <p className="text-sm text-gray-500">Risks identified only during scheduled visits</p>
              </div>
              <div className="bg-red-50/50 rounded-xl p-4 border border-red-100/50">
                <h4 className="font-semibold text-gray-800">📊 Data Gaps</h4>
                <p className="text-sm text-gray-500">Incomplete health data for accurate predictions</p>
              </div>
              <div className="bg-red-50/50 rounded-xl p-4 border border-red-100/50">
                <h4 className="font-semibold text-gray-800">⏰ Delayed Response</h4>
                <p className="text-sm text-gray-500">Slow communication between patients and providers</p>
              </div>
              <div className="bg-red-50/50 rounded-xl p-4 border border-red-100/50">
                <h4 className="font-semibold text-gray-800">🧠 Limited Insights</h4>
                <p className="text-sm text-gray-500">No AI-powered predictive analytics</p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/70 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                <FaRobot className="text-sky-500 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">How GlowCare Works</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-pink-50 to-sky-50 rounded-2xl p-6 text-center border border-pink-100/50 hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FaClipboardList className="text-white text-2xl" />
                </div>
                <h4 className="font-bold text-gray-800">1. Data Collection</h4>
                <p className="text-sm text-gray-500 mt-2">
                  Users input symptoms, vitals, and health data through an intuitive interface
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-sky-50 rounded-2xl p-6 text-center border border-pink-100/50 hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FaChartLine className="text-white text-2xl" />
                </div>
                <h4 className="font-bold text-gray-800">2. ML Analysis</h4>
                <p className="text-sm text-gray-500 mt-2">
                  Advanced algorithms analyze patterns and detect risk factors in real-time
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-sky-50 rounded-2xl p-6 text-center border border-pink-100/50 hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FaBell className="text-white text-2xl" />
                </div>
                <h4 className="font-bold text-gray-800">3. Intelligent Alerts</h4>
                <p className="text-sm text-gray-500 mt-2">
                  Instant notifications and recommendations for timely medical intervention
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/70 shadow-xl hover:shadow-2xl transition-all duration-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <FaHeartbeat className="text-pink-500" />
              Key Features
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard 
                icon={<FaUserMd />}
                title="Doctor Support"
                description="Connect with healthcare professionals instantly"
              />
              <FeatureCard 
                icon={<FaShieldAlt />}
                title="Secure Records"
                description="Bank-grade encryption for your health data"
              />
              <FeatureCard 
                icon={<FaChartLine />}
                title="ML Predictions"
                description="Early risk detection using advanced algorithms"
              />
              <FeatureCard 
                icon={<FaBell />}
                title="Instant Alerts"
                description="Real-time notifications for critical changes"
              />
              <FeatureCard 
                icon={<FaCalendarAlt />}
                title="Appointment Management"
                description="Schedule and track all medical appointments"
              />
              <FeatureCard 
                icon={<FaBaby />}
                title="Pregnancy Tracking"
                description="Monitor fetal growth and development"
              />
            </div>
          </div>

          

          {/* Call to Action */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/70 shadow-xl text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gray-500 mb-6">
              Join thousands of mothers who trust GlowCare for their pregnancy journey
            </p>
            <Link
              to="/starting"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 text-white font-bold shadow-xl hover:shadow-pink-300 hover:scale-105 transition-all duration-300"
            >
              Get Started
              <FaArrowRight />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-pink-100/50 pt-6">
          <p>© 2026 GlowCare — Safe Pregnancy, Smart Monitoring 🤰</p>
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

/* ===== COMPONENTS ===== */

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 text-center border border-pink-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-sky-100 flex items-center justify-center mx-auto mb-3 text-pink-500 text-xl">
      {icon}
    </div>
    <h4 className="font-semibold text-gray-800">{title}</h4>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </div>
);

const TechCard = ({ icon, title, description }) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 text-center border border-pink-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div className="text-3xl text-pink-500 mb-2 flex justify-center">{icon}</div>
    <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
    <p className="text-xs text-gray-500 mt-1">{description}</p>
  </div>
);

export default About; 
