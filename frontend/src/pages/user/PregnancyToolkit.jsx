import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaBaby,
  FaNotesMedical,
  FaFileMedical,
  FaUser,
  FaCalendarAlt,
  FaWeight,
  FaHeartbeat,
  FaUtensils,
  FaWalking,
  FaBed,
  FaStethoscope,
  FaPills,
  FaShieldAlt,
  FaClipboardList,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaBell,
  FaPlus,
  FaTrash,
  FaEdit,
  FaChartLine,
  FaWater,
  FaAppleAlt,
  FaDumbbell,
  FaHeart,
  FaMoon,
  FaSun,
  FaSmile,
  FaUserCircle,
  FaLightbulb,
  FaSpinner,
  FaTint,
  FaStopwatch,
  FaPlay,
  FaPause,
  FaRedo,
  FaThermometerHalf,
  FaCamera,
  FaStop,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";
import UserSidebar from "../../components/UserSidebar";

const PregnancyToolkit = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentWeek, setCurrentWeek] = useState(24);
  const [showWeekSelector, setShowWeekSelector] = useState(false);
  
  // ===== CONTRACTION TIMER =====
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [contractions, setContractions] = useState([]);
  const [contractionDuration, setContractionDuration] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // ===== HEART RATE MONITOR - Camera Based =====
  const [heartRate, setHeartRate] = useState(0);
  const [isMonitoringHeart, setIsMonitoringHeart] = useState(false);
  const [heartRateHistory, setHeartRateHistory] = useState([]);
  const [heartRateStatus, setHeartRateStatus] = useState("Ready to measure");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isStopping, setIsStopping] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const valuesRef = useRef([]);
  const peaksRef = useRef([]);
  const lastPeakTimeRef = useRef(0);
  const isProcessingRef = useRef(false);
  const stopTimeoutRef = useRef(null);

  // ===== WATER INTAKE =====
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal] = useState(10);

  // ===== MEDICINES TRACKER =====
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Prenatal Vitamins", dosage: "1 tablet", time: "8:00 AM", taken: false },
    { id: 2, name: "Iron Supplement", dosage: "1 tablet", time: "2:00 PM", taken: false },
    { id: 3, name: "Calcium + Vitamin D", dosage: "1 tablet", time: "9:00 PM", taken: false },
  ]);
  const [newMedicine, setNewMedicine] = useState({ name: "", dosage: "", time: "" });
  const [showMedicineForm, setShowMedicineForm] = useState(false);

  // ===== REMINDERS =====
  const [reminders, setReminders] = useState([
    { id: 1, text: "Take prenatal vitamins", time: "8:00 AM", done: false },
    { id: 2, text: "Drink 8 glasses of water", time: "Throughout day", done: false },
    { id: 3, text: "Light exercise - 30 mins", time: "6:00 PM", done: false },
  ]);
  const [newReminder, setNewReminder] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("");
  const [editingReminder, setEditingReminder] = useState(null);
  
  // ===== CHECKLIST =====
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Take prenatal vitamins", done: false },
    { id: 2, text: "Check blood pressure", done: false },
    { id: 3, text: "Monitor weight gain", done: true },
    { id: 4, text: "Track fetal movements", done: false },
  ]);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  
  // ===== MOOD =====
  const [mood, setMood] = useState("Happy");
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [healthScore, setHealthScore] = useState(85);
  const [isLoading, setIsLoading] = useState(false);
  const [riskLevel, setRiskLevel] = useState("Low");
  const [userWeight, setUserWeight] = useState("68 kg");

  // ===== LOAD ALL DATA =====
  const loadAllData = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    
    // 1. Load week from localStorage (set by Symptoms page)
    const savedWeek = localStorage.getItem("pregnancyWeek");
    if (savedWeek) {
      const week = parseInt(savedWeek);
      if (week > 0 && week <= 40) {
        setCurrentWeek(week);
      }
    }
    
    // 2. Load risk data
    const riskData = JSON.parse(
      localStorage.getItem(`riskData_${currentUser.email}`)
    ) || JSON.parse(localStorage.getItem("riskData")) || null;

    // 3. Also check riskData vitals for week
    if (riskData?.vitals?.week) {
      const weekFromVitals = parseInt(riskData.vitals.week);
      if (weekFromVitals > 0 && weekFromVitals <= 40) {
        setCurrentWeek(weekFromVitals);
      }
    }

    if (riskData) {
      setRiskLevel(riskData.risk || "Low");
      const score = calculateHealthScore(riskData.risk, riskData.score);
      setHealthScore(score);
      if (riskData.vitals?.weight) {
        setUserWeight(`${riskData.vitals.weight} kg`);
      }
    }

    // 4. Load heart rate
    const hr = Number(localStorage.getItem("heartRate")) || 0;
    if (hr > 0) setHeartRate(hr);
  };

  // ===== CALCULATE HEALTH SCORE =====
  const calculateHealthScore = (risk, score) => {
    let baseScore = 100;
    
    if (risk === "High") {
      baseScore = 100 - (score || 0) * 0.7;
    } else if (risk === "Moderate" || risk === "Medium") {
      baseScore = 100 - (score || 0) * 0.4;
    } else if (risk === "Low") {
      baseScore = 100 - (score || 0) * 0.2;
    }
    
    return Math.min(100, Math.max(0, Math.round(baseScore)));
  };

  const refreshPregnancyTiming = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/me/overview", { headers: { Authorization: `Bearer ${token}` } });
      const overview = response.ok ? await response.json() : null;
      const week = overview?.pregnancy_timing?.pregnancy_week;
      if (week) {
        setCurrentWeek(week);
        localStorage.setItem("pregnancyWeek", String(week));
      }
    } catch (error) { console.error("Unable to refresh pregnancy timing", error); }
  };

  // ===== GET RISK COLOR =====
  const getRiskColor = (risk) => {
    switch(risk) {
      case "High": return "text-red-500";
      case "Moderate": return "text-orange-500";
      case "Medium": return "text-orange-500";
      case "Low": return "text-green-500";
      default: return "text-green-500";
    }
  };

  const getRiskEmoji = (risk) => {
    switch(risk) {
      case "High": return "🔴";
      case "Moderate": return "🟠";
      case "Medium": return "🟠";
      case "Low": return "🟢";
      default: return "🟢";
    }
  };

  // ===== HEART RATE CAMERA FUNCTIONS =====
  const startHeartRateMonitoring = async () => {
    try {
      setCameraError(null);
      setHeartRateStatus("📸 Starting camera...");
      
      if (streamRef.current) {
        stopHeartRateMonitoring();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false,
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsCameraReady(true);
          setHeartRateStatus("📸 Camera ready - Place finger on lens");
          showNotification("📸 Camera ready! Place your finger on the lens.");
          processFrames();
        };
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setCameraError("Camera access denied. Please allow camera access.");
      setHeartRateStatus("❌ Camera access denied");
      showNotification("❌ Please allow camera access in browser settings");
      setIsMonitoringHeart(false);
      setIsCameraReady(false);
    }
  };

  const processFrames = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !isMonitoringHeart) return;
    
    const ctx = canvas.getContext("2d");
    canvas.width = 160;
    canvas.height = 120;
    
    let frameCount = 0;
    const values = [];
    const peaks = [];
    let lastPeakTime = 0;
    let stableReadings = 0;
    let lastValidBpm = 0;
    
    const processFrame = () => {
      if (!isMonitoringHeart || isStopping) {
        return;
      }
      
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let total = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          total += data[i];
          count++;
        }
        const avg = total / count;
        
        values.push(avg);
        if (values.length > 100) values.shift();
        
        if (values.length > 20) {
          const current = values[values.length - 1];
          const prev = values[values.length - 2];
          const prevPrev = values[values.length - 3];
          
          const recentAvg = values.slice(-20).reduce((a, b) => a + b, 0) / Math.min(values.length, 20);
          const threshold = recentAvg * 0.05 + 5;
          
          if (current > prev && prev > prevPrev && current > threshold + 10) {
            const now = Date.now();
            const timeSinceLastPeak = now - lastPeakTime;
            
            if (timeSinceLastPeak > 300 && timeSinceLastPeak < 2000) {
              peaks.push(now);
              if (peaks.length > 20) peaks.shift();
              
              if (peaks.length >= 4) {
                const totalTime = peaks[peaks.length - 1] - peaks[0];
                const avgInterval = totalTime / (peaks.length - 1);
                const bpm = Math.round(60000 / avgInterval);
                
                if (bpm >= 40 && bpm <= 200) {
                  if (Math.abs(bpm - lastValidBpm) < 5) {
                    stableReadings++;
                    if (stableReadings >= 3) {
                      setHeartRate(bpm);
                      setHeartRateStatus(`❤️ ${bpm} BPM`);
                      
                      setHeartRateHistory(prev => {
                        const newHistory = [...prev, bpm];
                        if (newHistory.length > 10) newHistory.shift();
                        return newHistory;
                      });
                    }
                  } else {
                    stableReadings = 0;
                    lastValidBpm = bpm;
                  }
                  
                  if (heartRateHistory.length >= 5 && stableReadings >= 3) {
                    setHeartRateStatus(`✅ ${heartRateHistory.length} readings captured`);
                    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
                    stopTimeoutRef.current = setTimeout(() => {
                      if (isMonitoringHeart) {
                        stopHeartRateMonitoring();
                        showNotification("✅ Heart rate monitoring complete!");
                      }
                    }, 3000);
                  }
                }
              }
              lastPeakTime = now;
            }
          }
        }
        
        frameCount++;
      } catch (e) {
        console.error("Frame processing error:", e);
      }
      
      if (isMonitoringHeart && !isStopping) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
      }
    };
    
    if (isMonitoringHeart && !isStopping) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
    }
  };

  const toggleHeartMonitor = async () => {
    if (isMonitoringHeart) {
      stopHeartRateMonitoring();
    } else {
      setIsMonitoringHeart(true);
      setHeartRate(0);
      setHeartRateHistory([]);
      setHeartRateStatus("Starting...");
      setCameraError(null);
      await startHeartRateMonitoring();
    }
  };

  const stopHeartRateMonitoring = () => {
    setIsStopping(true);
    setHeartRateStatus("⏹️ Stopping...");
    
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
        streamRef.current = null;
      } catch (e) {
        console.error("Error stopping stream:", e);
      }
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
    }
    
    setIsMonitoringHeart(false);
    setIsCameraReady(false);
    setIsStopping(false);
    setCameraError(null);
    valuesRef.current = [];
    peaksRef.current = [];
    lastPeakTimeRef.current = 0;
    
    setHeartRateStatus("⏹️ Monitoring stopped");
    showNotification("Heart rate monitoring stopped ⏹️");
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        try {
          streamRef.current.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
          });
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      }
    };
  }, []);

  // ===== CONTRACTION TIMER FUNCTIONS =====
  const startTimer = () => {
    setIsTimerRunning(true);
    const id = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    const duration = timerSeconds;
    setContractionDuration(duration);
    setContractions([...contractions, { 
      id: Date.now(), 
      duration: duration, 
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    }]);
    setTimerSeconds(0);
    showNotification(`Contraction recorded: ${duration} seconds ⏱️`);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setTimerSeconds(0);
  };

  const deleteContraction = (id) => {
    if (window.confirm("Delete this contraction record?")) {
      setContractions(contractions.filter(c => c.id !== id));
      showNotification("Contraction record deleted 🗑️");
    }
  };

  // ===== WATER INTAKE FUNCTIONS =====
  const addWater = () => {
    if (waterIntake < waterGoal) {
      setWaterIntake(prev => prev + 1);
      showNotification(`💧 Water intake: ${waterIntake + 1}/${waterGoal} glasses`);
    } else {
      showNotification("🎉 You've reached your water goal for today!");
    }
  };

  const resetWater = () => {
    if (window.confirm("Reset water intake for today?")) {
      setWaterIntake(0);
      showNotification("Water intake reset 🔄");
    }
  };

  // ===== MEDICINE FUNCTIONS =====
  const addMedicine = () => {
    if (newMedicine.name && newMedicine.dosage && newMedicine.time) {
      setMedicines([
        ...medicines,
        { 
          id: Date.now(), 
          ...newMedicine, 
          taken: false 
        }
      ]);
      setNewMedicine({ name: "", dosage: "", time: "" });
      setShowMedicineForm(false);
      showNotification("Medicine added 💊");
    }
  };

  const toggleMedicine = (id) => {
    setMedicines(
      medicines.map(m => 
        m.id === id ? { ...m, taken: !m.taken } : m
      )
    );
    const med = medicines.find(m => m.id === id);
    showNotification(med?.taken ? `Medication marked as not taken ❌` : `💊 ${med?.name} taken!`);
  };

  const deleteMedicine = (id) => {
    if (window.confirm("Delete this medicine?")) {
      setMedicines(medicines.filter(m => m.id !== id));
      showNotification("Medicine deleted 🗑️");
    }
  };

  // ===== REMINDER FUNCTIONS =====
  const addReminder = () => {
    if (newReminder.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setReminders([
          ...reminders,
          {
            id: Date.now(),
            text: newReminder,
            time: newReminderTime || "Custom",
            done: false,
          },
        ]);
        setNewReminder("");
        setNewReminderTime("");
        setIsLoading(false);
        showNotification("Reminder added successfully! ✅");
      }, 500);
    }
  };

  const toggleReminder = (id) => {
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, done: !r.done } : r
      )
    );
    const reminder = reminders.find(r => r.id === id);
    showNotification(reminder?.done ? `Marked as incomplete ❌` : `Completed! 🎉`);
  };

  const deleteReminder = (id) => {
    if (window.confirm("Delete this reminder?")) {
      setReminders(reminders.filter((r) => r.id !== id));
      showNotification("Reminder deleted 🗑️");
    }
  };

  const editReminder = (id) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      setEditingReminder(reminder);
      setNewReminder(reminder.text);
      setNewReminderTime(reminder.time);
    }
  };

  const saveEditReminder = () => {
    if (editingReminder && newReminder.trim()) {
      setReminders(
        reminders.map((r) =>
          r.id === editingReminder.id
            ? { ...r, text: newReminder, time: newReminderTime || "Custom" }
            : r
        )
      );
      setEditingReminder(null);
      setNewReminder("");
      setNewReminderTime("");
      showNotification("Reminder updated! ✅");
    }
  };

  // ===== CHECKLIST FUNCTIONS =====
  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist([
        ...checklist,
        { id: Date.now(), text: newChecklistItem, done: false },
      ]);
      setNewChecklistItem("");
      showNotification("Checklist item added! ✅");
    }
  };

  const toggleChecklist = (id) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
    const item = checklist.find(i => i.id === id);
    showNotification(item?.done ? `Marked as incomplete ❌` : `Completed! 🎉`);
  };

  const deleteChecklistItem = (id) => {
    if (window.confirm("Delete this item?")) {
      setChecklist(checklist.filter((item) => item.id !== id));
      showNotification("Item deleted 🗑️");
    }
  };

  // ===== WEEK FUNCTIONS =====
  const updateWeek = (week) => {
    setCurrentWeek(week);
    setShowWeekSelector(false);
    // Save week to localStorage so other pages can access it
    localStorage.setItem("pregnancyWeek", week.toString());
    showNotification(`Updated to week ${week} 📅`);
    
    // Recalculate health score
    const newScore = Math.min(95, Math.max(70, 85 + (week - 24) * 0.5));
    let adjustedScore = newScore;
    if (riskLevel === "High") adjustedScore = newScore - 15;
    else if (riskLevel === "Moderate") adjustedScore = newScore - 8;
    setHealthScore(Math.min(100, Math.max(0, Math.round(adjustedScore))));
  };

  // ===== MOOD FUNCTIONS =====
  const setMoodValue = (value) => {
    setMood(value);
    setShowMoodSelector(false);
    showNotification(`Mood updated: ${value} ${getMoodEmoji(value)}`);
  };

  const getMoodEmoji = (mood) => {
    const emojis = { Happy: "😊", Calm: "😌", Tired: "😴", Anxious: "😰", Excited: "🤩", Relaxed: "🧘" };
    return emojis[mood] || "😊";
  };

  // ===== NOTIFICATION SYSTEM =====
  const [notification, setNotification] = useState(null);
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // ===== GET TRIMESTER =====
  const getTrimester = () => {
    if (currentWeek <= 12) return { name: "First", color: "green", emoji: "🌱" };
    if (currentWeek <= 26) return { name: "Second", color: "blue", emoji: "🌿" };
    return { name: "Third", color: "purple", emoji: "🌸" };
  };

  const trimester = getTrimester();

  // ===== CLEANUP =====
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        try {
          streamRef.current.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
          });
        } catch (e) {}
      }
    };
  }, [intervalId]);

  // ===== SAVE TO LOCAL STORAGE =====
  useEffect(() => {
    localStorage.setItem("waterIntake", waterIntake.toString());
    localStorage.setItem("medications", JSON.stringify(medicines));
    localStorage.setItem("contractions", JSON.stringify(contractions));
  }, [waterIntake, medicines, contractions]);

  // ===== LOAD DATA ON MOUNT & AUTO-REFRESH =====
  useEffect(() => {
    loadAllData();
    refreshPregnancyTiming();
    
    const interval = setInterval(() => { loadAllData(); refreshPregnancyTiming(); }, 60000);
    window.addEventListener("pregnancyTimingUpdated", refreshPregnancyTiming);
    return () => { clearInterval(interval); window.removeEventListener("pregnancyTimingUpdated", refreshPregnancyTiming); };
  }, []);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex"
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

      {/* Hidden video and canvas */}
      <video ref={videoRef} className="hidden" playsInline />
      <canvas ref={canvasRef} className="hidden" />

      <UserSidebar />
      <div className="hidden">
        <Link to="/dashboard" className="block">
          <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
          <p className="text-sm text-gray-500">Maternal Health System</p>
        </Link>

        <div className="mt-8 space-y-2 flex-1 overflow-y-auto">
          <NavItem label="Dashboard" icon={<FaHeartbeat />} to="/dashboard"  />
          <NavItem label="Reports" icon={<FaFileMedical />} to="/reports" />
          <NavItem label="Prescriptions" icon={<FaFileMedical />} to="/prescriptions" />
          <NavItem label="Pregnancy Toolkit" icon={<FaBaby />} to="/toolkit" active />
          <NavItem label="Symptoms" icon={<FaNotesMedical />} to="/symptoms" />
          <NavItem label="Suggestions" icon={<FaLightbulb />} to="/suggestions" />
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
      <div className="relative z-10 flex-1 px-4 py-4 sm:px-6 lg:ml-64 lg:px-8">
        {/* Top Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div className="relative">
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <FaBaby className="text-pink-500" />
              Pregnancy Toolkit
              <button
                onClick={() => setShowWeekSelector(!showWeekSelector)}
                className="text-sm font-normal text-gray-500 bg-pink-50 px-3 py-1 rounded-full flex items-center gap-1 pointer-events-none"
              >
                Week {currentWeek} {trimester.emoji}
                <span className="text-xs">▼</span>
              </button>
            </h2>
            {false && showWeekSelector && (
              <div className="absolute mt-2 bg-white rounded-2xl shadow-2xl p-4 border border-pink-100 w-80 z-50">
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 20 }, (_, i) => i + 20).map((week) => (
                    <button
                      key={week}
                      onClick={() => updateWeek(week)}
                      className={`p-2 rounded-xl text-sm font-medium transition-all ${
                        currentWeek === week
                          ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white"
                          : "hover:bg-pink-50 text-gray-700"
                      }`}
                    >
                      {week}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              M
            </div>
            <span className="text-sm font-medium text-gray-700">Mom</span>
            <div className="w-px h-6 bg-pink-200"></div>
            <span className="text-sm text-gray-500">{trimester.name} Trimester</span>
          </div>
        </div>

        {/* Quick Stats - DYNAMIC */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <QuickStat 
            icon={<FaHeartbeat />} 
            label="Heart Rate" 
            value={heartRate > 0 ? `${heartRate} bpm` : "—"} 
            color="pink" 
          />
          <QuickStat 
            icon={<FaWeight />} 
            label="Weight" 
            value={userWeight || "68 kg"} 
            color="sky" 
          />
          <QuickStat 
            icon={<FaCalendarAlt />} 
            label="Weeks" 
            value={`${currentWeek}`} 
            color="purple" 
          />
          <QuickStat 
            icon={<FaHeart />} 
            label="Risk Level" 
            value={riskLevel || "Low"} 
            color={riskLevel === "High" ? "red" : riskLevel === "Moderate" ? "orange" : "green"} 
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white/60 backdrop-blur-sm p-2 rounded-2xl border border-white/70">
          <TabButton label="Overview" icon={<FaBaby />} active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <TabButton label="Contractions" icon={<FaStopwatch />} active={activeTab === "contractions"} onClick={() => setActiveTab("contractions")} />
          <TabButton label="Heart Rate" icon={<FaHeartbeat />} active={activeTab === "heartrate"} onClick={() => setActiveTab("heartrate")} />
          <TabButton label="Water" icon={<FaTint />} active={activeTab === "water"} onClick={() => setActiveTab("water")} />
          <TabButton label="Reminders" icon={<FaBell />} active={activeTab === "reminders"} onClick={() => setActiveTab("reminders")} />
        </div>

        {/* Tab Content */}
        <div className="space-y-6 pb-6">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <>
              <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-lg border border-white/70">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FaCalendarAlt className="text-pink-500" />
                    Week {currentWeek} Overview
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Risk Level:</span>
                    <span className={`font-bold ${getRiskColor(riskLevel)}`}>
                      {getRiskEmoji(riskLevel)} {riskLevel}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-pink-50 to-pink-100/50 rounded-2xl p-4">
                    <p className="text-sm text-gray-500">Trimester</p>
                    <p className="text-lg font-bold text-gray-800">{trimester.name} {trimester.emoji}</p>
                    <p className="text-xs text-gray-400">Week {currentWeek}</p>
                  </div>
                  <div className="bg-gradient-to-r from-sky-50 to-sky-100/50 rounded-2xl p-4">
                    <p className="text-sm text-gray-500">Health Score</p>
                    <p className="text-lg font-bold text-gray-800">{healthScore}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          healthScore >= 80 ? "bg-green-500" :
                          healthScore >= 60 ? "bg-yellow-500" :
                          "bg-red-500"
                        }`}
                        style={{ width: `${healthScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl p-4">
                    <p className="text-sm text-gray-500">Current Mood</p>
                    <p className="text-lg font-bold text-gray-800">{getMoodEmoji(mood)} {mood}</p>
                    <p className="text-xs text-gray-400">Tap mood to change</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 rounded-3xl p-6 text-white shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <FaLightbulb className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Weekly Tip</h4>
                    <p className="text-white/90 mt-1">Stay hydrated, get plenty of rest, and track your baby's movements! 💕</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button onClick={() => setActiveTab("contractions")} className="bg-white/80 backdrop-blur-2xl p-4 rounded-2xl shadow-md border border-white/70 hover:shadow-xl transition-all hover:-translate-y-1 text-center">
                  <FaStopwatch className="text-2xl text-pink-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Contractions</p>
                </button>
                <button onClick={() => setActiveTab("heartrate")} className="bg-white/80 backdrop-blur-2xl p-4 rounded-2xl shadow-md border border-white/70 hover:shadow-xl transition-all hover:-translate-y-1 text-center">
                  <FaHeartbeat className="text-2xl text-red-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Heart Rate</p>
                </button>
                <button onClick={() => setActiveTab("water")} className="bg-white/80 backdrop-blur-2xl p-4 rounded-2xl shadow-md border border-white/70 hover:shadow-xl transition-all hover:-translate-y-1 text-center">
                  <FaTint className="text-2xl text-sky-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Water</p>
                </button>
              </div>
            </>
          )}

          {/* CONTRACTIONS TAB */}
          {activeTab === "contractions" && (
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-lg border border-white/70">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaStopwatch className="text-pink-500" />
                Contraction Timer
              </h3>
              
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-pink-500 mb-4 font-mono">
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </div>
                <div className="flex justify-center gap-4">
                  {!isTimerRunning ? (
                    <button onClick={startTimer} className="bg-gradient-to-r from-green-500 to-emerald-400 text-white px-8 py-3 rounded-2xl font-semibold hover:scale-105 transition-all flex items-center gap-2">
                      <FaPlay /> Start
                    </button>
                  ) : (
                    <button onClick={stopTimer} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold hover:scale-105 transition-all flex items-center gap-2">
                      <FaPause /> Stop & Record
                    </button>
                  )}
                  <button onClick={resetTimer} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-all flex items-center gap-2">
                    <FaRedo /> Reset
                  </button>
                </div>
              </div>

              {contractionDuration > 0 && (
                <div className="bg-pink-50 rounded-xl p-4 mb-4 text-center">
                  <p className="text-gray-600">Last contraction duration: <span className="font-bold text-pink-500">{contractionDuration} seconds</span></p>
                </div>
              )}

              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-3">Contraction History</h4>
                {contractions.length === 0 ? (
                  <p className="text-center text-gray-400 py-4">No contractions recorded yet</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {contractions.slice().reverse().map((c) => (
                      <div key={c.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                        <div>
                          <span className="font-medium text-gray-700">{c.duration}s</span>
                          <span className="text-sm text-gray-400 ml-3">{c.time}</span>
                          <span className="text-xs text-gray-400 ml-2">{c.date}</span>
                        </div>
                        <button onClick={() => deleteContraction(c.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* HEART RATE TAB */}
          {activeTab === "heartrate" && (
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-lg border border-white/70">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaHeartbeat className="text-red-500" />
                Heart Rate Monitor
              </h3>
              
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-red-500 mb-2">
                  {heartRate > 0 ? heartRate : "—"}
                </div>
                <p className="text-gray-500">BPM</p>
                <p className="text-sm text-gray-400 mt-2">{heartRateStatus}</p>
                {cameraError && (
                  <p className="text-sm text-red-500 mt-2">{cameraError}</p>
                )}
                {isMonitoringHeart && heartRateHistory.length > 0 && (
                  <p className="text-xs text-green-500 mt-1">
                    📊 {heartRateHistory.length} readings captured
                  </p>
                )}
              </div>

              {isMonitoringHeart && (
                <div className="bg-gray-900 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-center">
                    <div className="text-white text-center">
                      <FaCamera className="text-4xl mb-2 animate-pulse mx-auto" />
                      <p className="text-sm">📸 Camera active</p>
                      <p className="text-xs text-gray-400 mt-1">Place finger on lens & hold steady</p>
                      <p className="text-xs text-green-400 mt-2">
                        {heartRate > 0 ? `❤️ ${heartRate} BPM detected` : "Waiting for signal..."}
                      </p>
                      {heartRateHistory.length > 0 && (
                        <p className="text-xs text-blue-400 mt-1">
                          Auto-stopping in 3 seconds after stable reading...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={toggleHeartMonitor}
                  className={`flex-1 py-3 rounded-2xl font-semibold transition-all ${
                    isMonitoringHeart
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gradient-to-r from-pink-500 to-sky-400 text-white hover:scale-105"
                  }`}
                >
                  {isMonitoringHeart ? (
                    <>
                      <FaStop className="inline mr-2" /> Stop Monitoring
                    </>
                  ) : (
                    <>
                      <FaCamera className="inline mr-2" /> Start Camera Monitor
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-500 bg-blue-50 p-3 rounded-xl">
                <p className="flex items-center gap-2">💡 <span>Place your finger gently over the camera lens. Keep steady for 10-15 seconds. Auto-stops after getting stable readings.</span></p>
              </div>

              {heartRateHistory.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Heart Rate History</h4>
                  <div className="flex gap-2 flex-wrap">
                    {heartRateHistory.map((rate, index) => (
                      <div key={index} className="bg-pink-50 px-4 py-2 rounded-xl text-center">
                        <div className="text-sm font-bold text-pink-500">{rate}</div>
                        <div className="text-xs text-gray-400">Reading {index + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* WATER TAB */}
          {activeTab === "water" && (
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-lg border border-white/70">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaTint className="text-sky-500" />
                Water Intake Tracker
              </h3>
              
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-sky-500 mb-2">{waterIntake}</div>
                <p className="text-gray-500">out of {waterGoal} glasses</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                  <div className="bg-gradient-to-r from-sky-400 to-sky-600 h-4 rounded-full transition-all duration-500" style={{ width: `${(waterIntake / waterGoal) * 100}%` }}></div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={addWater} className="flex-1 bg-gradient-to-r from-sky-400 to-sky-600 text-white py-3 rounded-2xl font-semibold hover:scale-105 transition-all">
                  💧 Add Glass
                </button>
                <button onClick={resetWater} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-all">
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* MEDICINES TAB */}
          {activeTab === "medicines" && (
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-lg border border-white/70">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaPills className="text-purple-500" />
                  Medicines Tracker
                </h3>
                <button
                  onClick={() => setShowMedicineForm(!showMedicineForm)}
                  className="bg-gradient-to-r from-pink-500 to-sky-400 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-all flex items-center gap-2"
                >
                  <FaPlus /> Add Medicine
                </button>
              </div>

              {showMedicineForm && (
                <div className="bg-pink-50 p-4 rounded-xl mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Medicine name"
                      value={newMedicine.name}
                      onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                      className="rounded-xl border border-pink-200 px-4 py-2 outline-none focus:border-sky-300"
                    />
                    <input
                      type="text"
                      placeholder="Dosage"
                      value={newMedicine.dosage}
                      onChange={(e) => setNewMedicine({...newMedicine, dosage: e.target.value})}
                      className="rounded-xl border border-pink-200 px-4 py-2 outline-none focus:border-sky-300"
                    />
                    <input
                      type="text"
                      placeholder="Time"
                      value={newMedicine.time}
                      onChange={(e) => setNewMedicine({...newMedicine, time: e.target.value})}
                      className="rounded-xl border border-pink-200 px-4 py-2 outline-none focus:border-sky-300"
                    />
                  </div>
                  <button onClick={addMedicine} className="mt-3 bg-green-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-600 transition-all">
                    Save Medicine
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {medicines.map((med) => (
                  <div key={med.id} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${med.taken ? "bg-green-50 border border-green-200" : "bg-gray-50/50 border border-gray-100"}`}>
                    <button onClick={() => toggleMedicine(med.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${med.taken ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-pink-500"}`}>
                      {med.taken && <FaCheckCircle className="text-white text-sm" />}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${med.taken ? "text-gray-400 line-through" : "text-gray-700"}`}>{med.name}</p>
                      <div className="flex gap-3 text-xs text-gray-400">
                        <span>💊 {med.dosage}</span>
                        <span>⏰ {med.time}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteMedicine(med.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <FaTrash />
                    </button>
                  </div>
                ))}
                {medicines.length === 0 && (
                  <p className="text-center text-gray-400 py-4">No medicines added yet</p>
                )}
              </div>
            </div>
          )}

          {/* REMINDERS TAB */}
          {activeTab === "reminders" && (
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-lg border border-white/70">
              <div className="flex flex-wrap gap-3 mb-6">
                <input type="text" value={newReminder} onChange={(e) => setNewReminder(e.target.value)} placeholder={editingReminder ? "Edit reminder..." : "Add reminder..."} className="flex-1 min-w-[200px] rounded-xl border border-pink-100 bg-white/90 px-4 py-3 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 transition-all" />
                <input type="text" value={newReminderTime} onChange={(e) => setNewReminderTime(e.target.value)} placeholder="Time" className="w-40 rounded-xl border border-pink-100 bg-white/90 px-4 py-3 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 transition-all" />
                {editingReminder ? (
                  <button onClick={saveEditReminder} className="bg-gradient-to-r from-green-500 to-emerald-400 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all flex items-center gap-2">
                    <FaEdit /> Save
                  </button>
                ) : (
                  <button onClick={addReminder} disabled={isLoading} className="bg-gradient-to-r from-pink-500 to-sky-400 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50">
                    {isLoading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                    {isLoading ? "Adding..." : "Add"}
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${reminder.done ? "bg-green-50 border border-green-200" : "bg-pink-50/50 border border-pink-100"}`}>
                    <button onClick={() => toggleReminder(reminder.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${reminder.done ? "bg-green-500 border-green-500 text-white" : "border-pink-300 hover:border-pink-500"}`}>
                      {reminder.done && <FaCheckCircle className="text-white text-sm" />}
                    </button>
                    <span className={`flex-1 font-medium ${reminder.done ? "text-gray-400 line-through" : "text-gray-700"}`}>{reminder.text}</span>
                    <span className="text-sm text-gray-400 flex items-center gap-1"><FaClock className="text-pink-400" /> {reminder.time}</span>
                    <button onClick={() => editReminder(reminder.id)} className="text-sky-400 hover:text-sky-600 transition-colors"><FaEdit /></button>
                    <button onClick={() => deleteReminder(reminder.id)} className="text-red-400 hover:text-red-600 transition-colors"><FaTrash /></button>
                  </div>
                ))}
                {reminders.length === 0 && <p className="text-center text-gray-400 py-8">No reminders yet. Add one above! ✨</p>}
              </div>
            </div>
          )}

          {/* CHECKLIST TAB */}
          {activeTab === "checklist" && (
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-lg border border-white/70">
              <div className="flex flex-wrap gap-3 mb-6">
                <input type="text" value={newChecklistItem} onChange={(e) => setNewChecklistItem(e.target.value)} placeholder="Add checklist item..." className="flex-1 min-w-[200px] rounded-xl border border-pink-100 bg-white/90 px-4 py-3 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 transition-all" />
                <button onClick={addChecklistItem} className="bg-gradient-to-r from-pink-500 to-sky-400 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all flex items-center gap-2"><FaPlus /> Add</button>
              </div>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <div key={item.id} className={`flex items-center gap-3 p-4 rounded-xl transition-all ${item.done ? "bg-green-50 border border-green-200" : "bg-gray-50/50 border border-gray-100"}`}>
                    <button onClick={() => toggleChecklist(item.id)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${item.done ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-pink-500"}`}>
                      {item.done && <FaCheckCircle className="text-white text-xs" />}
                    </button>
                    <span className={`flex-1 ${item.done ? "text-gray-400 line-through" : "text-gray-700"}`}>{item.text}</span>
                    <button onClick={() => deleteChecklistItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors"><FaTrash /></button>
                  </div>
                ))}
                {checklist.length === 0 && <p className="text-center text-gray-400 py-8">No items yet. Add one above! ✨</p>}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-pink-100/50 pt-6">
          <p>© 2026 GlowCare — Safe Pregnancy, Smart Monitoring 🤰</p>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl p-4 px-6 border border-pink-100 animate-slideIn max-w-md">
          <p className="text-gray-800 font-medium">{notification}</p>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

/* ===== COMPONENTS ===== */

const NavItem = ({ label, icon, to, active }) => (
  <Link to={to} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${active ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg" : "hover:bg-pink-100 text-gray-700 hover:translate-x-2"}`}>
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

const TabButton = ({ label, icon, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${active ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg" : "bg-white/60 text-gray-600 hover:bg-white hover:shadow-md"}`}>
    {icon}
    <span className="text-sm">{label}</span>
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

export default PregnancyToolkit;
