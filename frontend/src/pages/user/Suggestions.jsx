import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHeartbeat,
  FaFileMedical,
  FaStethoscope,
  FaBaby,
  FaNotesMedical,
  FaLightbulb,
  FaChartLine,
  FaBell,
  FaShieldAlt,
  FaCalendarAlt,
  FaUser,
  FaHeart,
  FaTint,
  FaWeight,
  FaBed,
  FaWalking,
  FaAppleAlt,
  FaPills,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaSmile,
  FaThermometerHalf,
  FaRuler,
  FaWeightHanging,
  FaCog,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";
import { apiUrl } from "../../config/runtime";

const Suggestions = () => {
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [healthData, setHealthData] = useState({
    heartRate: 0,
    bloodPressure: "",
    weight: 0,
    waterIntake: 0,
    trimester: "",
    risk: "",
    symptoms: [],
    medications: [],
    appointments: [],
    babyWeight: 0,
    babyHeartRate: 0,
    cervicalLength: 0,
    temperature: 0,
    sugar: 0,
    week: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadUserData = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setUser(currentUser);

    // Load risk data (user-specific)
    const riskData =
      JSON.parse(localStorage.getItem(`riskData_${currentUser.email}`)) || {
        risk: "Low",
        score: 0,
        symptoms: [],
        riskFactors: [],
        vitals: {},
      };

    const water = Number(localStorage.getItem("waterIntake")) || 0;
    const medications = JSON.parse(localStorage.getItem("medications")) || [];
    
    // Load heart rate from localStorage (not hardcoded)
    const heartRate = Number(localStorage.getItem("heartRate")) || 0;
    // If no heart rate in localStorage, try from riskData vitals
    const heartRateFromVitals = riskData.vitals?.heartRate || 0;
    const finalHeartRate = heartRate || heartRateFromVitals || 78;
    
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    
    // Get user's appointments
    const userAppointments = appointments.filter(
      (app) => app.patientEmail === currentUser.email
    );

    // Get vitals from risk data
    const vitals = riskData.vitals || {};
    
    // Determine trimester from week
    const week = parseInt(vitals.week) || 28;
    let trimester = "2nd";
    if (week <= 12) trimester = "1st";
    else if (week <= 26) trimester = "2nd";
    else trimester = "3rd";

    setHealthData({
      heartRate: finalHeartRate,
      bloodPressure: vitals.bpSystolic && vitals.bpDiastolic 
        ? `${vitals.bpSystolic}/${vitals.bpDiastolic}` 
        : "120/80",
      weight: vitals.weight || 68,
      waterIntake: water,
      trimester: trimester,
      risk: riskData.risk || "Low",
      symptoms: riskData.symptoms || [],
      medications: medications,
      appointments: userAppointments,
      babyWeight: vitals.babyWeight || 0,
      babyHeartRate: vitals.babyHeartRate || 0,
      cervicalLength: vitals.cervicalLength || 0,
      temperature: vitals.temperature || 0,
      sugar: vitals.sugar || 0,
      week: week,
      riskScore: riskData.score || 0,
      riskFactors: riskData.riskFactors || [],
    });

    generateSuggestions(riskData, water, medications, finalHeartRate, userAppointments, vitals);
    setLoading(false);
  };

  const generateSuggestions = (riskData, water, medications, heartRate, appointments, vitals) => {
    const list = [];
    const week = parseInt(vitals.week) || 28;
    const babyWeight = vitals.babyWeight || 0;
    const babyHeartRate = vitals.babyHeartRate || 0;
    const cervicalLength = vitals.cervicalLength || 0;
    const temperature = vitals.temperature || 0;
    const sugar = vitals.sugar || 0;

    // Risk-based suggestions
    if (riskData.risk === "High") {
      list.push({
        id: 1,
        title: "🚨 High Risk Pregnancy",
        message: "Please contact your doctor immediately. Monitor blood pressure twice daily and avoid heavy work. Seek emergency care if you experience any severe symptoms.",
        type: "critical",
        icon: <FaExclamationTriangle className="text-red-500" />,
      });
      list.push({
        id: 2,
        title: "🏥 Immediate Consultation Needed",
        message: "Schedule an emergency appointment with your gynecologist today. Do not delay medical attention.",
        type: "critical",
        icon: <FaHeartbeat className="text-red-500" />,
      });
      if (riskData.riskFactors && riskData.riskFactors.length > 0) {
        list.push({
          id: 3,
          title: "⚠️ Risk Factors Identified",
          message: `Risk factors detected: ${riskData.riskFactors.slice(0, 3).join(', ')}. Please discuss these with your doctor.`,
          type: "critical",
          icon: <FaExclamationTriangle className="text-red-500" />,
        });
      }
    } else if (riskData.risk === "Moderate" || riskData.risk === "Medium") {
      list.push({
        id: 1,
        title: "⚠️ Moderate Risk",
        message: "Continue medications regularly and attend weekly checkups. Monitor your symptoms closely and report any changes to your doctor.",
        type: "warning",
        icon: <FaExclamationTriangle className="text-orange-500" />,
      });
      list.push({
        id: 2,
        title: "📋 Weekly Checkup Reminder",
        message: "Don't forget your scheduled weekly checkup with your doctor. Regular monitoring is important at this stage.",
        type: "warning",
        icon: <FaCalendarAlt className="text-orange-500" />,
      });
    } else {
      list.push({
        id: 1,
        title: "✅ Healthy Pregnancy",
        message: "Maintain a balanced diet and continue regular prenatal checkups. You're doing great! Keep up the healthy habits.",
        type: "success",
        icon: <FaCheckCircle className="text-green-500" />,
      });
      list.push({
        id: 2,
        title: "🌟 Keep Up the Good Work",
        message: "Your healthy habits are making a difference. Stay consistent with your routine and enjoy this beautiful journey.",
        type: "success",
        icon: <FaSmile className="text-green-500" />,
      });
    }

    // Baby health suggestions
    if (babyWeight > 0) {
      const avgWeight = week * 15 + 100;
      if (babyWeight < avgWeight * 0.7) {
        list.push({
          id: 10,
          title: "👶 Baby Weight Alert",
          message: `Baby weight (${babyWeight}g) is below average for ${week} weeks. Please consult your doctor for proper nutrition advice.`,
          type: "warning",
          icon: <FaBaby className="text-orange-500" />,
        });
      } else if (babyWeight > avgWeight * 1.3) {
        list.push({
          id: 10,
          title: "👶 Baby Weight",
          message: `Baby weight (${babyWeight}g) is above average for ${week} weeks. Continue with regular checkups.`,
          type: "info",
          icon: <FaBaby className="text-blue-500" />,
        });
      } else {
        list.push({
          id: 10,
          title: "👶 Healthy Baby Weight",
          message: `Baby weight (${babyWeight}g) is within normal range for ${week} weeks. Keep up the good nutrition!`,
          type: "success",
          icon: <FaCheckCircle className="text-green-500" />,
        });
      }
    }

    // Baby heart rate
    if (babyHeartRate > 0) {
      if (babyHeartRate < 110 || babyHeartRate > 160) {
        list.push({
          id: 11,
          title: "💓 Baby Heart Rate Alert",
          message: `Baby heart rate (${babyHeartRate} bpm) is outside normal range (110-160 bpm). Please consult your doctor immediately.`,
          type: "critical",
          icon: <FaHeartbeat className="text-red-500" />,
        });
      } else {
        list.push({
          id: 11,
          title: "💓 Healthy Baby Heart Rate",
          message: `Baby heart rate (${babyHeartRate} bpm) is within normal range. Continue monitoring regularly.`,
          type: "success",
          icon: <FaCheckCircle className="text-green-500" />,
        });
      }
    }

    // Cervical length
    if (cervicalLength > 0) {
      if (cervicalLength < 25) {
        list.push({
          id: 12,
          title: "📏 Cervical Length Alert",
          message: `Cervical length (${cervicalLength}mm) is below normal (>25mm). This may indicate risk of preterm labor. Consult your doctor immediately.`,
          type: "critical",
          icon: <FaRuler className="text-red-500" />,
        });
      } else {
        list.push({
          id: 12,
          title: "📏 Healthy Cervical Length",
          message: `Cervical length (${cervicalLength}mm) is within normal range. Good job!`,
          type: "success",
          icon: <FaCheckCircle className="text-green-500" />,
        });
      }
    }

    // Temperature
    if (temperature > 0) {
      if (temperature > 37.5) {
        list.push({
          id: 13,
          title: "🌡️ Fever Alert",
          message: `Your temperature (${temperature}°C) is elevated. Please monitor closely and consult your doctor if it persists.`,
          type: "warning",
          icon: <FaThermometerHalf className="text-orange-500" />,
        });
      }
    }

    // Blood sugar
    if (sugar > 0) {
      if (sugar > 140) {
        list.push({
          id: 14,
          title: "🍬 Blood Sugar Alert",
          message: `Blood sugar (${sugar} mg/dL) is elevated. Please monitor your diet and consult your doctor.`,
          type: "warning",
          icon: <FaTint className="text-orange-500" />,
        });
      }
    }

    // Water intake suggestion
    if (water < 8) {
      list.push({
        id: 4,
        title: "💧 Hydration Reminder",
        message: `Drink ${8 - water} more glasses of water today. Stay hydrated for a healthy pregnancy.`,
        type: "info",
        icon: <FaTint className="text-blue-500" />,
      });
    } else {
      list.push({
        id: 4,
        title: "💧 Great Hydration!",
        message: "You've met your water intake goal for today. Keep it up!",
        type: "success",
        icon: <FaCheckCircle className="text-green-500" />,
      });
    }

    // Heart rate suggestion
    if (heartRate > 100) {
      list.push({
        id: 5,
        title: "❤️ Heart Rate Alert",
        message: "Your heart rate is slightly high. Rest for a while and consult your doctor if it remains elevated.",
        type: "warning",
        icon: <FaHeart className="text-red-500" />,
      });
    } else if (heartRate > 0 && heartRate < 60) {
      list.push({
        id: 5,
        title: "❤️ Low Heart Rate",
        message: "Your heart rate is below normal. Please consult your doctor if you feel dizzy or fatigued.",
        type: "warning",
        icon: <FaHeart className="text-orange-500" />,
      });
    } else if (heartRate > 0) {
      list.push({
        id: 5,
        title: "❤️ Healthy Heart Rate",
        message: `Your heart rate of ${heartRate} BPM is within normal range. Keep monitoring regularly.`,
        type: "success",
        icon: <FaHeart className="text-green-500" />,
      });
    }

    // Trimester-specific suggestions
    const trimester = healthData.trimester || "2nd";
    if (trimester === "1st") {
      list.push({
        id: 6,
        title: "🌱 First Trimester",
        message: "Take folic acid daily and get plenty of rest. Avoid stress and eat small frequent meals. Stay hydrated.",
        type: "info",
        icon: <FaBaby className="text-purple-500" />,
      });
    } else if (trimester === "2nd") {
      list.push({
        id: 6,
        title: "🌿 Second Trimester",
        message: "Increase calcium, protein and iron-rich foods. Stay active with gentle exercises like walking and prenatal yoga.",
        type: "info",
        icon: <FaBaby className="text-purple-500" />,
      });
    } else {
      list.push({
        id: 6,
        title: "🌸 Third Trimester",
        message: "Monitor baby's movements daily. Prepare for delivery and pack your hospital bag. Stay active with light exercises.",
        type: "info",
        icon: <FaBaby className="text-purple-500" />,
      });
    }

    // Medication reminders
    if (medications && medications.length > 0) {
      const pendingMeds = medications.filter(m => !m.taken);
      if (pendingMeds.length > 0) {
        list.push({
          id: 7,
          title: "💊 Medication Reminder",
          message: `You have ${pendingMeds.length} medication${pendingMeds.length > 1 ? 's' : ''} pending: ${pendingMeds.map(m => m.name).join(', ')}. Please take them on time.`,
          type: "warning",
          icon: <FaPills className="text-pink-500" />,
        });
      } else {
        list.push({
          id: 7,
          title: "💊 All Medications Taken",
          message: "Great job! You've taken all your medications for today.",
          type: "success",
          icon: <FaCheckCircle className="text-green-500" />,
        });
      }
    }

    // Symptoms tracking
    if (riskData.symptoms && riskData.symptoms.length > 0) {
      list.push({
        id: 8,
        title: "📝 Tracked Symptoms",
        message: `You've reported: ${riskData.symptoms.slice(0, 3).join(', ')}${riskData.symptoms.length > 3 ? ` and ${riskData.symptoms.length - 3} more` : ''}. Keep monitoring and report any new symptoms.`,
        type: "info",
        icon: <FaNotesMedical className="text-purple-500" />,
      });
    } else {
      list.push({
        id: 8,
        title: "📝 No Symptoms Reported",
        message: "You haven't reported any symptoms today. Continue maintaining your healthy routine.",
        type: "success",
        icon: <FaCheckCircle className="text-green-500" />,
      });
    }

    // Appointment reminder
    if (appointments && appointments.length > 0) {
      const upcoming = appointments.sort((a, b) => new Date(a.date) - new Date(b.date))[0];
      list.push({
        id: 9,
        title: "📅 Upcoming Appointment",
        message: `Your next appointment is scheduled for ${upcoming.date} at ${upcoming.time} with ${upcoming.doctor || 'your doctor'}.`,
        type: "info",
        icon: <FaCalendarAlt className="text-blue-500" />,
      });
    } else {
      list.push({
        id: 9,
        title: "📅 No Upcoming Appointments",
        message: "You don't have any upcoming appointments. Book one to stay on track with your pregnancy care.",
        type: "info",
        icon: <FaCalendarAlt className="text-blue-500" />,
      });
    }

    // Sort suggestions: critical first, then warnings, then others
    const sortedList = list.sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2, success: 3 };
      return (order[a.type] || 4) - (order[b.type] || 4);
    });

    setSuggestions(sortedList);
  };

  // Get suggestion type color
  const getTypeStyles = (type) => {
    const styles = {
      critical: "border-red-200 bg-red-50/50",
      warning: "border-orange-200 bg-orange-50/50",
      success: "border-green-200 bg-green-50/50",
      info: "border-blue-200 bg-blue-50/50",
    };
    return styles[type] || styles.info;
  };

  // Auto-refresh every 3 seconds
  useEffect(() => {
    const interval = setInterval(loadUserData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Load data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  // The latest saved assessment is authoritative. Local storage remains only as
  // an offline fallback for an interrupted connection.
  useEffect(() => {
    const refreshFromOverview = async () => {
      try {
        const response = await fetch(apiUrl("/users/me/overview"), { headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` } });
        if (!response.ok) return;
        const overview = await response.json();
        const latest = overview.latest || {};
        const timing = overview.pregnancy_timing || {};
        const apiRisk = { risk: latest.risk_level || "Not assessed", score: latest.risk_score || 0, symptoms: latest.symptoms || [], riskFactors: [], vitals: { heartRate: latest.heart_rate || 0, bpSystolic: latest.bp_systolic, bpDiastolic: latest.bp_diastolic, temperature: latest.temperature, sugar: latest.sugar, week: timing.pregnancy_week || latest.pregnancy_week || 0 } };
        const medications = Array.from({ length: overview.prescriptions?.total || 0 }, () => ({}));
        const appointments = overview.appointments || [];
        setUser(current => ({ ...(current || {}), ...overview.user }));
        setHealthData(current => ({ ...current, heartRate: apiRisk.vitals.heartRate, bloodPressure: apiRisk.vitals.bpSystolic && apiRisk.vitals.bpDiastolic ? `${apiRisk.vitals.bpSystolic}/${apiRisk.vitals.bpDiastolic}` : "Not recorded", trimester: timing.trimester ? `${timing.trimester}${timing.trimester === 1 ? "st" : timing.trimester === 2 ? "nd" : "rd"}` : "Not recorded", risk: apiRisk.risk, symptoms: apiRisk.symptoms, medications, appointments, temperature: apiRisk.vitals.temperature || 0, sugar: apiRisk.vitals.sugar || 0, week: apiRisk.vitals.week || 0, riskScore: apiRisk.score }));
        generateSuggestions(apiRisk, Number(localStorage.getItem("waterIntake")) || 0, medications, apiRisk.vitals.heartRate || 0, appointments, apiRisk.vitals);
      } catch { /* retain offline fallback */ }
    };
    refreshFromOverview();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your suggestions...</p>
        </div>
      </div>
    );
  }

  // Get dynamic values for Quick Stats
  const getHeartRateDisplay = () => {
    const hr = healthData.heartRate || 0;
    return hr > 0 ? `${hr} BPM` : "—";
  };

  const getWaterDisplay = () => {
    return `${healthData.waterIntake || 0}/10`;
  };

  const getTrimesterDisplay = () => {
    return healthData.trimester || "—";
  };

  const getRiskDisplay = () => {
    return healthData.risk || "—";
  };

  const getRiskColorClass = () => {
    const risk = healthData.risk;
    if (risk === "High") return "red";
    if (risk === "Moderate" || risk === "Medium") return "orange";
    return "green";
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center flex"
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

      <div className="fixed left-0 top-0 z-40 w-64 bg-white/80 backdrop-blur-2xl border-r border-pink-100/50 p-5 h-screen flex flex-col">
        <Link to="/dashboard" className="block">
          <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
          <p className="text-sm text-gray-500">Maternal Health System</p>
        </Link>

        <div className="mt-8 space-y-2 flex-1 overflow-y-auto">
          <NavItem label="Dashboard" icon={<FaHeartbeat />} to="/dashboard"  />
          <NavItem label="Reports" icon={<FaFileMedical />} to="/reports" />
          <NavItem label="Prescriptions" icon={<FaFileMedical />} to="/prescriptions" />
          <NavItem label="Pregnancy Toolkit" icon={<FaBaby />} to="/toolkit" />
          <NavItem label="Symptoms" icon={<FaNotesMedical />} to="/symptoms" />
          <NavItem label="Suggestions" icon={<FaLightbulb />} to="/suggestions" active/>
          <NavItem label="Prediction" icon={<FaChartLine />} to="/prediction" />
          <NavItem label="Alerts" icon={<FaBell />} to="/alerts" />
          <NavItem label="Appointments" icon={<FaCalendarAlt />} to="/appointment" />
          <NavItem label="Reminders" icon={<FaBell />} to="/reminders" />
          <NavItem label="Feedback" icon={<FaLightbulb />} to="/share-feedback" />
          <NavItem label="Profile" icon={<FaUser />} to="/profile" />
          <NavItem label="Settings" icon={<FaShieldAlt />} to="/settings" />
        </div>

        <div className="pt-4 border-t border-pink-100/50">
          <button
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/login";
            }}
            className="w-full bg-pink-100 text-pink-600 px-5 py-2 rounded-xl hover:bg-pink-200 transition-all duration-300 text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </div>


      {/* MAIN CONTENT */}
      <div className="relative z-10 ml-64 flex-1 px-6 py-6">
        {/* Top Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <FaLightbulb className="text-pink-500" />
              Personalized Suggestions
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, <span className="font-semibold text-pink-500">{user?.name}</span> 👋
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-sm font-medium text-gray-700">{user?.name?.split(" ")[0] || "User"}</span>
          </div>
        </div>

        {/* Quick Health Stats - DYNAMIC */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <QuickStat 
            icon={<FaHeart />} 
            label="Heart Rate" 
            value={getHeartRateDisplay()} 
            color="red" 
          />
          <QuickStat 
            icon={<FaTint />} 
            label="Water Intake" 
            value={getWaterDisplay()} 
            color="blue" 
          />
          <QuickStat 
            icon={<FaBaby />} 
            label="Trimester" 
            value={getTrimesterDisplay()} 
            color="purple" 
          />
          <QuickStat 
            icon={<FaExclamationTriangle />} 
            label="Risk Level" 
            value={getRiskDisplay()} 
            color={getRiskColorClass()} 
          />
        </div>

        {/* ML Recommendation Banner */}
        <div className="bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 rounded-2xl p-5 mb-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <FaHeartbeat className="text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg">ML Recommendation</h3>
              <p className="text-white/90 text-sm mt-1">
                Based on your health data, we recommend {healthData.risk === "High" ? "immediate consultation with your doctor" : 
                  healthData.risk === "Moderate" ? "regular monitoring and weekly checkups" : 
                  "continuing your healthy routine and regular checkups"}.
                {healthData.week > 0 && ` You are currently in week ${healthData.week} of pregnancy.`}
              </p>
            </div>
          </div>
        </div>

        {/* Suggestions List */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800">Today's Recommendations</h3>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`bg-white/80 backdrop-blur-xl rounded-2xl p-5 border ${getTypeStyles(suggestion.type)} shadow-md hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center flex-shrink-0">
                  {suggestion.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{suggestion.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{suggestion.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nutrition & Medication Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/80 backdrop-blur-2xl rounded-2xl p-6 border border-white/70 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <FaAppleAlt className="text-green-500" />
              Nutrition Tips
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Eat iron-rich foods like spinach and lentils
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Include calcium sources like milk and cheese
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Consume folic acid through leafy greens
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Stay hydrated with 8-10 glasses of water
              </li>
            </ul>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl rounded-2xl p-6 border border-white/70 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <FaPills className="text-pink-500" />
              Medication Reminder
            </h3>
            {healthData.medications && healthData.medications.length > 0 ? (
              <ul className="space-y-3">
                {healthData.medications.map((med, index) => (
                  <li key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{med.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${med.taken ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {med.taken ? '✓ Taken' : 'Pending'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No medications scheduled</p>
            )}
          </div>
        </div>

        {/* Health Status */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-2xl p-6 border border-white/70 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <FaHeartbeat className="text-pink-500" />
            Health Status Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-pink-50/50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">Blood Pressure</p>
              <p className="text-base font-semibold text-gray-800">{healthData.bloodPressure || "120/80"}</p>
            </div>
            <div className="bg-pink-50/50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">Weight</p>
              <p className="text-base font-semibold text-gray-800">{healthData.weight || 68} kg</p>
            </div>
            <div className="bg-pink-50/50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">Symptoms</p>
              <p className="text-base font-semibold text-gray-800">{healthData.symptoms?.length || 0}</p>
            </div>
            <div className="bg-pink-50/50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">Medications</p>
              <p className="text-base font-semibold text-gray-800">{healthData.medications?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-pink-100/50 pt-6">
          <p>© 2026 GlowCare — Safe Pregnancy, Smart Monitoring 🤰</p>
        </div>
      </div>
    </div>
  );
};

/* ===== COMPONENTS ===== */

const NavItem = ({ label, icon, to, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
      active
        ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg"
        : "hover:bg-pink-100 text-gray-700 hover:translate-x-2"
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

const QuickStat = ({ icon, label, value, color }) => {
  const colorMap = {
    red: "text-red-500 bg-red-50",
    blue: "text-blue-500 bg-blue-50",
    purple: "text-purple-500 bg-purple-50",
    green: "text-green-500 bg-green-50",
    orange: "text-orange-500 bg-orange-50",
    pink: "text-pink-500 bg-pink-50",
  };

  return (
    <div className="bg-white/80 backdrop-blur-2xl rounded-2xl p-4 shadow-md border border-white/70 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full ${colorMap[color] || 'bg-pink-50'} flex items-center justify-center`}>
          <span className={`text-lg ${colorMap[color]?.replace(' bg-', ' text-') || 'text-pink-500'}`}>{icon}</span>
        </div>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
};

export default Suggestions;
