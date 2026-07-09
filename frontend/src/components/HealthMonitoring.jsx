import {
  HeartPulse,
  Activity,
  Thermometer,
  Droplets,
} from "lucide-react";

function HealthMonitoring() {
  const cards = [
    {
      title: "Heart Rate",
      value: "78 BPM",
      icon: <HeartPulse size={28} />,
      color: "bg-red-100 text-red-500",
    },
    {
      title: "Blood Pressure",
      value: "120 / 80",
      icon: <Activity size={28} />,
      color: "bg-blue-100 text-blue-500",
    },
    {
      title: "Body Temperature",
      value: "36.8°C",
      icon: <Thermometer size={28} />,
      color: "bg-orange-100 text-orange-500",
    },
    {
      title: "Hydration",
      value: "85%",
      icon: <Droplets size={28} />,
      color: "bg-cyan-100 text-cyan-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Health Monitoring
      </h2>

      <div className="grid grid-cols-2 gap-5">

        {cards.map((card, index) => (

          <div
            key={index}
            className="border rounded-2xl p-5 hover:shadow-lg transition"
          >

            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.color}`}
            >
              {card.icon}
            </div>

            <h3 className="mt-4 text-gray-500">
              {card.title}
            </h3>

            <p className="text-2xl font-bold mt-1">
              {card.value}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default HealthMonitoring;