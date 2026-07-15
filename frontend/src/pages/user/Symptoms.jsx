import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeartbeat,
  FaFileMedical,
  FaNotesMedical,
  FaLightbulb,
  FaUser,
  FaCalendarAlt,
  FaWeight,
  FaHeart,
  FaTint,
  FaThermometerHalf,
  FaClipboardList,
  FaArrowRight,
  FaShieldAlt,
  FaUserCircle,
  FaStethoscope,
  FaBaby,
  FaChartLine,
  FaBell,
  FaUserMd,
  FaRuler,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const symptomsList = [
  "Headache",
  "Nausea",
  "Vomiting",
  "Swelling",
  "Blurred Vision",
  "Bleeding",
  "Chest Pain",
  "Dizziness",
  "Fever",
  "Fatigue",
  "Back Pain",
  "Reduced Baby Movement",
];

function Symptoms() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    age: "",
    week: "",
    weight: "",
    prePregnancyWeight: "",
    height: "",
    babyCount: "1",
    bpSystolic: "",
    bpDiastolic: "",
    heartRate: "",
    sugar: "",
    temperature: "",
    babyWeight: "",
    babyHeartRate: "",
    cervicalLength: "",
    symptoms: [],
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    setUser(currentUser);
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSymptom = (symptom) => {
    if (form.symptoms.includes(symptom)) {
      updateField(
        "symptoms",
        form.symptoms.filter((s) => s !== symptom)
      );
    } else {
      updateField("symptoms", [...form.symptoms, symptom]);
    }
  };

  const checkWeightRisk = () => {
    const weight = Number(form.weight);
    const week = Number(form.week);
    const babies = Number(form.babyCount);

    let risk = 0;
    let reason = [];

    if (!weight || !week) {
      return { risk: 0, reason: [] };
    }

    let minWeight;
    let maxWeight;

    if (babies === 1) {
      minWeight = 45 + week * 0.35;
      maxWeight = 90;
    } else if (babies === 2) {
      minWeight = 55 + week * 0.45;
      maxWeight = 105;
    } else {
      minWeight = 60 + week * 0.5;
      maxWeight = 120;
    }

    if (weight < minWeight) {
      risk += 15;
      reason.push("Low weight for pregnancy stage");
    }

    if (weight > maxWeight) {
      risk += 15;
      reason.push("Excessive weight gain");
    }

    return {
      risk,
      reason,
    };
  };

  const checkBabyHealth = () => {
    const babyWeight = Number(form.babyWeight);
    const babyHeartRate = Number(form.babyHeartRate);
    const cervicalLength = Number(form.cervicalLength);
    const week = Number(form.week);
    let risk = 0;
    let reason = [];

    // Baby weight check based on week
    if (babyWeight && week) {
      const avgWeight = week * 15 + 100; // Approximate average weight in grams
      if (babyWeight < avgWeight * 0.7) {
        risk += 10;
        reason.push("Baby weight below average");
      } else if (babyWeight > avgWeight * 1.3) {
        risk += 5;
        reason.push("Baby weight above average");
      }
    }

    // Baby heart rate check (normal: 110-160 bpm)
    if (babyHeartRate) {
      if (babyHeartRate < 110 || babyHeartRate > 160) {
        risk += 10;
        reason.push("Abnormal baby heart rate");
      }
    }

    // Cervical length check (normal: >25mm)
    if (cervicalLength) {
      if (cervicalLength < 25) {
        risk += 15;
        reason.push("Short cervical length - risk of preterm labor");
      }
    }

    return { risk, reason };
  };

  const handlePrediction = () => {
    setIsLoading(true);

    let score = 0;
    let riskFactors = [];
    const weightCheck = checkWeightRisk();
    const babyHealth = checkBabyHealth();

    score += weightCheck.risk;
    riskFactors.push(...weightCheck.reason);

    score += babyHealth.risk;
    riskFactors.push(...babyHealth.reason);

    // Calculate score based on symptoms
    form.symptoms.forEach((item) => {
      switch (item) {
        case "Blurred Vision":
        case "Bleeding":
        case "Reduced Baby Movement":
          score += 20;
          riskFactors.push(item);
          break;
        case "Swelling":
        case "Vomiting":
        case "Fever":
        case "Chest Pain":
          score += 12;
          riskFactors.push(item);
          break;
        default:
          score += 5;
      }
    });

    // Additional risk factors from vitals
    if (form.bpSystolic && parseInt(form.bpSystolic) > 140) {
      score += 15;
      riskFactors.push("High Blood Pressure");
    }
    if (form.sugar && parseInt(form.sugar) > 140) {
      score += 10;
      riskFactors.push("High Blood Sugar");
    }
    if (form.temperature && parseFloat(form.temperature) > 37.5) {
      score += 8;
      riskFactors.push("Fever");
    }

    let risk = "Low";
    if (score >= 70) risk = "High";
    else if (score >= 35) risk = "Moderate";

    const riskData = {
      symptoms: form.symptoms,
      riskFactors: riskFactors,
      score: Math.min(score, 100),
      risk,
      confidence: 95,
      vitals: {
        babyCount: form.babyCount,
        prePregnancyWeight: form.prePregnancyWeight,
        age: form.age,
        week: form.week,
        weight: form.weight,
        bpSystolic: form.bpSystolic,
        bpDiastolic: form.bpDiastolic,
        heartRate: form.heartRate,
        sugar: form.sugar,
        temperature: form.temperature,
        babyWeight: form.babyWeight,
        babyHeartRate: form.babyHeartRate,
        cervicalLength: form.cervicalLength,
      },
    };

    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

    // Save latest prediction
    localStorage.setItem(
      `riskData_${currentUser.email}`,
      JSON.stringify(riskData)
    );

    // Send doctor notification
    sendDoctorNotification(form.symptoms);

    // Save report history
    const reports =
      JSON.parse(localStorage.getItem(`reports_${currentUser.email}`)) || [];

    reports.unshift({
      date: new Date().toLocaleDateString(),
      ...riskData,
    });

    localStorage.setItem(
      `reports_${currentUser.email}`,
      JSON.stringify(reports)
    );

    // Save risk data with user-specific key
    if (currentUser.email) {
      localStorage.setItem(
        `riskData_${currentUser.email}`,
        JSON.stringify(riskData)
      );
    } else {
      localStorage.setItem("riskData", JSON.stringify(riskData));
    }

    setTimeout(() => {
      setIsLoading(false);
      navigate("/prediction");
    }, 1000);
  };

  const sendDoctorNotification = (symptoms) => {
    if (!user) return;

    const notifications =
      JSON.parse(localStorage.getItem("doctorNotifications")) || [];

    notifications.push({
      patient: user.name,
      email: user.email,
      symptoms: symptoms,
      message: "New symptoms reported by patient",
      time: new Date().toLocaleString(),
    });

    localStorage.setItem(
      "doctorNotifications",
      JSON.stringify(notifications)
    );
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

      {/* SIDEBAR */}
      <div
        className="fixed left-0 top-0 z-40 w-64 h-screen
             bg-white/80 backdrop-blur-2xl
             border-r border-pink-100/50
             p-5 flex flex-col shadow-xl"
      >
        <Link to="/dashboard" className="block">
          <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
          <p className="text-sm text-gray-500">Maternal Health System</p>
        </Link>

        <div className="mt-8 space-y-2 flex-1 overflow-y-auto">
          <NavItem label="Dashboard" icon={<FaHeartbeat />} to="/dashboard" />
          <NavItem label="Reports" icon={<FaFileMedical />} to="/reports" />
          <NavItem label="Pregnancy Toolkit" icon={<FaBaby />} to="/toolkit" />
          <NavItem label="Symptoms" icon={<FaNotesMedical />} to="/symptoms" active />
          <NavItem label="Suggestions" icon={<FaLightbulb />} to="/suggestions" />
          <NavItem label="Prediction" icon={<FaChartLine />} to="/prediction" />
          <NavItem label="Alerts" icon={<FaBell />} to="/alerts" />
          <NavItem label="Appointments" icon={<FaCalendarAlt />} to="/appointment" />
          <NavItem label="Profile" icon={<FaUser />} to="/profile" />
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
              <FaClipboardList className="text-pink-500" />
              Symptoms Assessment
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Fill today's health details for ML risk analysis
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              M
            </div>
            <span className="text-sm font-medium text-gray-700">Mom</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <QuickStat icon={<FaUser />} label="Age" value={form.age || "—"} color="pink" />
          <QuickStat icon={<FaCalendarAlt />} label="Week" value={form.week || "—"} color="sky" />
          <QuickStat icon={<FaWeight />} label="Weight" value={form.weight ? `${form.weight} kg` : "—"} color="purple" />
          <QuickStat icon={<FaHeart />} label="Heart Rate" value={form.heartRate ? `${form.heartRate} bpm` : "—"} color="red" />
        </div>

        {/* Health Vitals Form */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-lg border border-white/70 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaUserMd className="text-pink-500" />
            Health Vitals
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              label="Age (years)"
              value={form.age}
              icon={<FaUser className="text-pink-400" />}
              onChange={(e) => updateField("age", e.target.value)}
              placeholder="e.g., 28"
            />
            <InputField
              label="Pregnancy Week"
              value={form.week}
              icon={<FaCalendarAlt className="text-sky-400" />}
              onChange={(e) => updateField("week", e.target.value)}
              placeholder="e.g., 24"
            />
            <InputField
              label="Weight (kg)"
              value={form.weight}
              icon={<FaWeight className="text-purple-400" />}
              onChange={(e) => updateField("weight", e.target.value)}
              placeholder="e.g., 68"
            />
            <InputField
              label="Pre-Pregnancy Weight (kg)"
              value={form.prePregnancyWeight}
              icon={<FaWeight className="text-purple-400" />}
              onChange={(e) => updateField("prePregnancyWeight", e.target.value)}
              placeholder="e.g., 55"
            />

            <InputField
              label="Heart Rate (bpm)"
              value={form.heartRate}
              icon={<FaHeart className="text-red-400" />}
              onChange={(e) => updateField("heartRate", e.target.value)}
              placeholder="e.g., 78"
            />
            <InputField
              label="Blood Pressure (Systolic)"
              value={form.bpSystolic}
              icon={<FaTint className="text-red-400" />}
              onChange={(e) => updateField("bpSystolic", e.target.value)}
              placeholder="e.g., 120"
            />
            <InputField
              label="Blood Pressure (Diastolic)"
              value={form.bpDiastolic}
              icon={<FaTint className="text-blue-400" />}
              onChange={(e) => updateField("bpDiastolic", e.target.value)}
              placeholder="e.g., 80"
            />
            <InputField
              label="Blood Sugar (mg/dL)"
              value={form.sugar}
              icon={<FaTint className="text-yellow-500" />}
              onChange={(e) => updateField("sugar", e.target.value)}
              placeholder="e.g., 120"
            />
            <InputField
              label="Temperature (°C)"
              value={form.temperature}
              icon={<FaThermometerHalf className="text-orange-400" />}
              onChange={(e) => updateField("temperature", e.target.value)}
              placeholder="e.g., 36.5"
            />
            <InputField
              label="Number of Babies"
              value={form.babyCount}
              icon={<FaBaby className="text-pink-400" />}
              onChange={(e) => updateField("babyCount", e.target.value)}
              placeholder="1 / 2 / 3"
            />
            <InputField
              label="Baby Weight (grams)"
              value={form.babyWeight}
              icon={<FaWeight className="text-pink-400" />}
              onChange={(e) => updateField("babyWeight", e.target.value)}
              placeholder="e.g., 2500"
            />
            <InputField
              label="Baby Heart Rate (bpm)"
              value={form.babyHeartRate}
              icon={<FaHeartbeat className="text-red-400" />}
              onChange={(e) => updateField("babyHeartRate", e.target.value)}
              placeholder="e.g., 140"
            />
            <InputField
              label="Cervical Length (mm)"
              value={form.cervicalLength}
              icon={<FaRuler className="text-purple-400" />}
              onChange={(e) => updateField("cervicalLength", e.target.value)}
              placeholder="e.g., 35"
            />
          </div>
        </div>

        {/* Symptoms Selection */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-lg border border-white/70 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaClipboardList className="text-pink-500" />
              Select Symptoms
            </h3>
            <span className="text-sm text-gray-400">
              {form.symptoms.length} selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {symptomsList.map((symptom) => (
              <SymptomCard
                key={symptom}
                symptom={symptom}
                selected={form.symptoms.includes(symptom)}
                onClick={() => toggleSymptom(symptom)}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handlePrediction}
            disabled={isLoading || form.symptoms.length === 0}
            className="flex-1 min-w-[200px] bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Analyzing...
              </>
            ) : (
              <>
                <FaShieldAlt />
                Analyze Pregnancy Risk
              </>
            )}
          </button>

          <button
            onClick={() => {
              setForm({
                age: "",
                week: "",
                weight: "",
                prePregnancyWeight: "",
                height: "",
                babyCount: "1",
                bpSystolic: "",
                bpDiastolic: "",
                heartRate: "",
                sugar: "",
                temperature: "",
                babyWeight: "",
                babyHeartRate: "",
                cervicalLength: "",
                symptoms: [],
              });
            }}
            className="bg-gray-200 text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-300 transition-all duration-300"
          >
            Clear All
          </button>
        </div>

        {/* Info Banner */}
        {form.symptoms.length === 0 && !isLoading && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
            <p className="text-blue-600 text-sm">
              💡 Select at least one symptom to get a risk assessment
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-pink-100/50 pt-6">
          <p>© 2026 GlowCare — Safe Pregnancy, Smart Monitoring 🤰</p>
        </div>
      </div>
    </div>
  );
}

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

const InputField = ({ label, value, onChange, icon, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
      {icon}
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-xl border border-pink-100 bg-white/90 px-4 py-3 outline-none transition-all duration-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 hover:shadow-md"
    />
  </div>
);

const SymptomCard = ({ symptom, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 text-center ${
      selected
        ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg scale-105"
        : "bg-white/60 text-gray-700 hover:bg-pink-50 hover:shadow-md border border-pink-100/50"
    }`}
  >
    {symptom}
    {selected && <span className="ml-1">✓</span>}
  </button>
);

const QuickStat = ({ icon, label, value, color }) => (
  <div className="bg-white/80 backdrop-blur-2xl rounded-2xl p-4 shadow-md border border-white/70 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center gap-2">
      <span className={`text-2xl text-${color}-500`}>{icon}</span>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
    <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

export default Symptoms;