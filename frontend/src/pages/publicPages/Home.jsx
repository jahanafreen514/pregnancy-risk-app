import React from "react";
import { Link } from "react-router-dom";
import {
  FaHeartbeat,
  FaUserMd,
  FaArrowRight,
  FaPlayCircle,
  FaQuoteLeft,
  FaBaby,
  FaShieldAlt,
  FaChartLine,
  FaBell,
} from "react-icons/fa";

import bg from "../../assets/images/bg.png";
import hero from "../../assets/images/hero-mother.png";

const Home = () => {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* Floating Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-pink-300 blur-[140px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-pink-200 blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: "1s" }}></div>

      <div className="relative z-10">
        {/* ========== HERO SECTION ========== */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT CONTENT */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1]">
                <span className="text-gray-800">Smart Pregnancy</span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 bg-clip-text text-transparent">
                  Monitoring Platform
                </span>
              </h1>

              <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-lg">
                Detect risks early, track maternal health in real-time, and
                connect with doctors instantly using ML-powered insights designed
                for safe motherhood.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/starting"
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 text-white font-bold text-lg shadow-xl hover:shadow-pink-300 hover:scale-[1.03] active:scale-95 transition-all duration-300"
                >
                  Get Started
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <Link
                  to="/about"
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-pink-200/50 bg-white/60 backdrop-blur-sm font-semibold text-gray-700 hover:bg-white hover:border-pink-300 hover:shadow-xl transition-all duration-300"
                >
                  <FaPlayCircle className="text-pink-500" />
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-2xl font-extrabold text-transparent bg-gradient-to-r from-pink-500 to-sky-400 bg-clip-text">
                    98%
                  </div>
                  <div className="text-sm text-gray-500 font-medium mt-1">safety</div>
                </div>
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-2xl font-extrabold text-transparent bg-gradient-to-r from-pink-500 to-sky-400 bg-clip-text">
                    High
                  </div>
                  <div className="text-sm text-gray-500 font-medium mt-1">Accuracy</div>
                </div>
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-2xl font-extrabold text-transparent bg-gradient-to-r from-pink-500 to-sky-400 bg-clip-text">
                    24/7
                  </div>
                  <div className="text-sm text-gray-500 font-medium mt-1">Monitoring</div>
                </div>
              </div>
            </div>

            {/* RIGHT - Hero Image - Increased Size */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute w-[500px] h-[500px] bg-pink-300 blur-[120px] opacity-20 rounded-full animate-pulse"></div>
              <div className="absolute w-[350px] h-[350px] bg-sky-300 blur-[100px] opacity-10 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
              
              <div className="relative group">
                <div className="absolute -inset-6 rounded-[50px] bg-gradient-to-r from-pink-300 via-pink-200 to-sky-300 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img
                  src={hero}
                  alt="Pregnant mother with glowing care"
                  className="relative w-[95%] max-w-xl mx-auto hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========== FEATURES SECTION ========== */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
              Everything You Need for{" "}
              <span className="bg-gradient-to-r from-pink-500 to-sky-400 bg-clip-text text-transparent">
                Safe Pregnancy
              </span>
            </h2>
            <p className="text-gray-500 text-lg mt-3">
              One platform. Complete maternal health monitoring.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Feature 
              icon={<FaUserMd className="text-2xl" />}
              title="Doctor Support" 
              description="Connect with certified healthcare professionals instantly"
            />
            <Feature 
              icon={<FaShieldAlt className="text-2xl" />}
              title="Secure Records" 
              description="Bank-grade encryption for your sensitive health data"
            />
            <Feature 
              icon={<FaChartLine className="text-2xl" />}
              title="ML Predictions" 
              description="Early risk detection using advanced machine learning"
            />
            <Feature 
              icon={<FaBell className="text-2xl" />}
              title="Instant Alerts" 
              description="Real-time notifications for critical health changes"
            />
          </div>
        </section>

        {/* ========== STORY / WHY SECTION ========== */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="relative">
            <div className="absolute -inset-1 rounded-[40px] bg-gradient-to-r from-pink-300 via-pink-200 to-sky-300 blur-xl opacity-30"></div>
            
            <div className="relative bg-white/80 backdrop-blur-2xl rounded-[40px] p-10 md:p-14 border border-white/70 shadow-2xl">
              <div className="flex items-start gap-6">
                <div className="hidden md:block">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center shadow-lg flex-shrink-0">
                    <FaQuoteLeft className="text-white text-2xl" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                    Why{" "}
                    <span className="bg-gradient-to-r from-pink-500 to-sky-400 bg-clip-text text-transparent">
                      GlowCare
                    </span>{" "}
                    Exists
                  </h2>
                  
                  <div className="mt-6 space-y-4 text-gray-600 leading-relaxed text-lg">
                    <p>
                      Pregnancy complications often develop silently. GlowCare uses ML
                      to continuously monitor health signals and detect early warning
                      signs before they become critical.
                    </p>
                    <p>
                      Our goal is to reduce maternal risk through early intervention
                      and real-time monitoring. This system helps doctors make faster
                      decisions and gives mothers peace of mind throughout their journey.
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-pink-100/50">
                      <span className="text-xl">🔍</span>
                      <span className="font-medium text-gray-700">Early Detection</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-pink-100/50">
                      <span className="text-xl">🤖</span>
                      <span className="font-medium text-gray-700">ML-Powered</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-pink-100/50">
                      <span className="text-xl">💚</span>
                      <span className="font-medium text-gray-700">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== CTA BANNER ========== */}
        <section className="max-w-7xl mx-auto px-6 py-12 pb-20">
          <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 p-12 text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                🤰 Ready to Start Your Journey?
              </h3>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of mothers who trust GlowCare for their maternal health monitoring.
              </p>
              <Link
                to="/starting"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-white text-pink-500 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Get Started Now 🚀
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

/* ========== COMPONENTS ========== */

const Feature = ({ icon, title, description }) => (
  <div className="group relative">
    <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-r from-pink-300 via-pink-200 to-sky-300 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
    
    <div className="relative bg-white/80 backdrop-blur-2xl rounded-[30px] p-8 text-center border border-white/70 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-100 to-sky-100 flex items-center justify-center mx-auto mb-4 text-pink-500 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export default Home;