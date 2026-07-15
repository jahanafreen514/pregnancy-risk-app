import { useEffect, useState } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import DoctorTopNavbar from "../components/DoctorTopNavbar";
import DoctorStatCard from "../components/DoctorStatCard";
import PatientTable from "../components/PatientTable";
import AppointmentTable from "../components/AppointmentTable";
import ReportTable from "../components/ReportTable";

import {
  Users,
  CalendarDays,
  FileText,
  AlertTriangle,
} from "lucide-react";

function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setPatients(JSON.parse(localStorage.getItem("users")) || []);

    setAppointments(
      JSON.parse(localStorage.getItem("appointments")) || []
    );

    setReports(
      JSON.parse(localStorage.getItem("reports")) || []
    );
  }, []);

  const totalPatients = patients.length;

  const totalReports = reports.length;

  const totalAppointments = appointments.length;

  const highRiskPatients = patients.filter(
    (patient) => patient.risk === "High"
  ).length;

  return (
    <div className="flex bg-pink-50 min-h-screen">

      <DoctorSidebar />

      <div className="flex-1">

        <DoctorTopNavbar />

        <div className="p-8">

          <div className="mb-8">

            <h1 className="text-4xl font-bold text-gray-800">
              Doctor Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome to the GlowCare Doctor Panel
            </p>

          </div>

          {/* Statistics */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            <DoctorStatCard
              title="Patients"
              value={totalPatients}
              subtitle="Registered Patients"
              growth="12%"
              icon={<Users size={28} />}
              iconBg="bg-pink-100"
              iconColor="text-pink-600"
            />

            <DoctorStatCard
              title="Reports"
              value={totalReports}
              subtitle="Medical Reports"
              growth="8%"
              icon={<FileText size={28} />}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />

            <DoctorStatCard
              title="Appointments"
              value={totalAppointments}
              subtitle="Today's Appointments"
              growth="6%"
              icon={<CalendarDays size={28} />}
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />

            <DoctorStatCard
              title="High Risk"
              value={highRiskPatients}
              subtitle="Critical Pregnancies"
              growth="3%"
              icon={<AlertTriangle size={28} />}
              iconBg="bg-red-100"
              iconColor="text-red-600"
            />

          </div>

          {/* Patient Table */}

          <div className="mt-10">

            <PatientTable patients={patients} />

          </div>

          {/* Appointment Table */}

          <div className="mt-10">

            <AppointmentTable appointments={appointments} />

          </div>

          {/* Report Table */}

          <div className="mt-10">

            <ReportTable reports={reports} />

          </div>

        </div>

      </div>

    </div>
  );
}

export default DoctorDashboard;