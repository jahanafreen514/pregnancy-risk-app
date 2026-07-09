function StatCard({ title, value, percentage, icon, color }) {
  const colors = {
    pink: "bg-pink-500",
    purple: "bg-purple-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">

      <div>
        <p className="text-gray-500 text-sm">{title}</p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>

        <p className="text-green-600 text-sm mt-2">
          {percentage} this month
        </p>
      </div>

      <div
        className={`${colors[color]} w-16 h-16 rounded-2xl flex items-center justify-center text-white`}
      >
        {icon}
      </div>

    </div>
  );
}

export default StatCard;