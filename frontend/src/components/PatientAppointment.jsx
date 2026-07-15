// PatientBookAppointment.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Video, MapPin } from "lucide-react";

function PatientAppointment() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    type: "online",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);

    // Load doctors from localStorage
    const allDoctors = JSON.parse(localStorage.getItem("users"))?.filter(
      (u) => u.role === "doctor"
    ) || [];
    setDoctors(allDoctors);
  }, [navigate]);

  const bookAppointment = (e) => {
    e.preventDefault();
    
    if (!selectedDoctor) {
      alert("Please select a doctor");
      return;
    }

    if (!appointmentData.date || !appointmentData.time) {
      alert("Please select date and time");
      return;
    }

    setLoading(true);

    // Get all appointments from localStorage
    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];

    // Create new appointment
    const newAppointment = {
      id: `app_${Date.now()}`,
      patientName: currentUser.name || currentUser.fullName || "Patient",
      patientId: currentUser.id,
      patientEmail: currentUser.email || "",
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name || selectedDoctor.fullName,
      date: appointmentData.date,
      time: appointmentData.time,
      type: appointmentData.type,
      status: "Pending",
      notes: appointmentData.notes || "",
      createdAt: new Date().toISOString(),
    };

    // Add to appointments array
    allAppointments.push(newAppointment);
    localStorage.setItem("appointments", JSON.stringify(allAppointments));

    // Trigger update for doctor's view
    window.dispatchEvent(new Event("appointmentUpdated"));

    // Also trigger storage event for cross-tab updates
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "appointments",
        newValue: JSON.stringify(allAppointments),
        storageArea: localStorage,
      })
    );

    setLoading(false);
    alert("Appointment booked successfully!");
    navigate("/patient-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="text-pink-500" />
            Book Appointment
          </h2>

          <form onSubmit={bookAppointment} className="space-y-6">
            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Doctor
              </label>
              <select
                onChange={(e) => {
                  const doctor = doctors.find(d => d.id === e.target.value);
                  setSelectedDoctor(doctor);
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                required
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name || doctor.fullName} - {doctor.specialization || "General"}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={appointmentData.date}
                onChange={(e) =>
                  setAppointmentData({ ...appointmentData, date: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={appointmentData.time}
                onChange={(e) =>
                  setAppointmentData({ ...appointmentData, time: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                required
              />
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setAppointmentData({ ...appointmentData, type: "online" })
                  }
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    appointmentData.type === "online"
                      ? "border-pink-500 bg-pink-50 text-pink-700"
                      : "border-gray-200 hover:border-pink-200"
                  }`}
                >
                  <Video className="w-5 h-5" />
                  Online
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAppointmentData({ ...appointmentData, type: "in-person" })
                  }
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    appointmentData.type === "in-person"
                      ? "border-pink-500 bg-pink-50 text-pink-700"
                      : "border-gray-200 hover:border-pink-200"
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  In-Person
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={appointmentData.notes}
                onChange={(e) =>
                  setAppointmentData({ ...appointmentData, notes: e.target.value })
                }
                rows="3"
                placeholder="Any additional information for the doctor..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PatientAppointment;