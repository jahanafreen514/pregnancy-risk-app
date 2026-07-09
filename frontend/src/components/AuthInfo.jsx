import React from "react";
import {
  FaHeartbeat,
  FaShieldAlt,
  FaRobot,
  FaBaby,
  FaChartLine,
  FaUserMd,
} from "react-icons/fa";

const features = [
  {
    icon: <FaRobot />,
    title: "AI Risk Prediction",
    text: "Instant pregnancy risk analysis using intelligent symptom assessment.",
    color: "text-pink-500",
    bg: "bg-pink-100",
  },
  {
    icon: <FaHeartbeat />,
    title: "Health Monitoring",
    text: "Monitor heart rate, contractions and maternal health in real time.",
    color: "text-sky-500",
    bg: "bg-sky-100",
  },
  {
    icon: <FaShieldAlt />,
    title: "Emergency Alerts",
    text: "Receive immediate notifications for abnormal pregnancy conditions.",
    color: "text-pink-500",
    bg: "bg-pink-100",
  },
];

function AuthInfo() {
  return (
  <div className="hidden lg:flex flex-col sticky top-8 self-start py-8">

      {/* Floating Glow */}
      <div className="absolute -top-12 -left-10 w-40 h-40 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-52 h-52 bg-sky-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      {/* Logo */}
      <div className="flex items-center gap-4 mb-8">

        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-400 to-sky-400 flex items-center justify-center shadow-2xl animate-bounce">

          <FaHeartbeat className="text-white text-4xl animate-pulse" />

        </div>

        <div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
            GlowCare
          </h1>

          <p className="text-gray-600 text-lg mt-2">
            Smart Maternal Healthcare Platform
          </p>
        </div>

      </div>

      {/* Heading */}
      <h2 className="text-5xl font-bold text-gray-800 leading-tight">
        AI Powered
        <br />
        Pregnancy Monitoring
      </h2>

      <p className="mt-6 text-lg text-gray-600 leading-8 max-w-xl">
        A modern healthcare platform designed to monitor maternal health,
        predict pregnancy risks, track symptoms, manage medications,
        monitor fetal wellbeing and assist mothers throughout pregnancy.
      </p>

      {/* Feature Cards */}
      <div className="space-y-5 mt-10">

        {features.map((item, index) => (

          <div
            key={index}
            className="group bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >

            <div className="flex gap-5 items-start">

              <div
                className={`${item.bg} ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}
              >
                {item.icon}
              </div>

              <div>

                <h3 className="text-xl font-bold text-gray-800">
                  {item.title}
                </h3>

                <p className="text-gray-500 mt-2 leading-7">
                  {item.text}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-5 mt-12">

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-6 hover:scale-105 transition duration-500">

          <FaBaby className="text-pink-500 text-3xl mb-3" />

          <h3 className="text-3xl font-bold text-gray-800">
            25K+
          </h3>

          <p className="text-gray-500 mt-2">
            Mothers Assisted
          </p>

        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-6 hover:scale-105 transition duration-500">

          <FaChartLine className="text-sky-500 text-3xl mb-3" />

          <h3 className="text-3xl font-bold text-gray-800">
            98%
          </h3>

          <p className="text-gray-500 mt-2">
            Prediction Accuracy
          </p>

        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-6 hover:scale-105 transition duration-500">

          <FaUserMd className="text-pink-500 text-3xl mb-3" />

          <h3 className="text-3xl font-bold text-gray-800">
            24/7
          </h3>

          <p className="text-gray-500 mt-2">
            Medical Support
          </p>

        </div>

      </div>

    </div>
  );
}

export default AuthInfo;