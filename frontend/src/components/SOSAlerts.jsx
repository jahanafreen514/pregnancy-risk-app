import { AlertTriangle } from "lucide-react";

const alerts = [
  {
    name: "Priya Sharma",
    issue: "Severe Contraction Pain",
    time: "2 min ago",
    location: "Hyderabad",
  },
  {
    name: "Ananya Reddy",
    issue: "High Blood Pressure",
    time: "15 min ago",
    location: "Vijayawada",
  },
  {
    name: "Meera Patil",
    issue: "Bleeding",
    time: "28 min ago",
    location: "Warangal",
  },
];

function SOSAlerts() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-[360px]">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">
          Recent SOS Alerts
        </h2>

        <button className="text-pink-500 text-sm font-semibold">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="flex items-start gap-4 border-b pb-4"
          >
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="text-red-500" size={20} />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{alert.name}</h3>
              <p className="text-sm text-gray-500">
                {alert.issue}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-400">
                {alert.time}
              </p>

              <p className="text-xs text-gray-500">
                {alert.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SOSAlerts;