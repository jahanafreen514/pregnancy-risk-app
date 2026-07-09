import React from "react";
import Sidebar from "../../components/Sidebar";
import TopNavbar from "../../components/TopNavbar";
import StatCard from "../../components/StatCard";
import RiskChart from "../../components/RiskChart";
import TrimesterChart from "../../components/TrimesterChart";
import SOSAlerts from "../../components/SOSAlerts";
import RegisteredUsers from "../../components/RegisteredUsers";
import HealthMonitoring from "../../components/HealthMonitoring";
import Footer from "../../components/Footer";

import {
  Users,
  HeartPulse,
  Baby,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";

function AdminDashboard() {
  return (
   <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">

<Sidebar />

<main className="ml-72">
        <TopNavbar />

        <div className="p-8 space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

            <StatCard
              title="Total Users"
              value="1,245"
              percentage="+12%"
              color="pink"
              icon={<Users size={30}/>}
            />

            <StatCard
              title="Pregnancies"
              value="986"
              percentage="+8%"
              color="purple"
              icon={<Baby size={30}/>}
            />

            <StatCard
              title="High Risk Cases"
              value="128"
              percentage="+5%"
              color="blue"
              icon={<AlertTriangle size={30}/>}
            />

            <StatCard
              title="Heart Monitoring"
              value="432"
              percentage="+15%"
              color="green"
              icon={<HeartPulse size={30}/>}
            />

            <StatCard
              title="Appointments"
              value="356"
              percentage="+10%"
              color="orange"
              icon={<CalendarDays size={30}/>}
            />

          </div>


          <div className="grid xl:grid-cols-3 gap-6">

            <RiskChart />

            <TrimesterChart />

            <SOSAlerts />

          </div>


          <div className="grid xl:grid-cols-3 gap-6">

            <div className="xl:col-span-2">
              <RegisteredUsers />
            </div>

            <HealthMonitoring />

          </div>


          <Footer />

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;