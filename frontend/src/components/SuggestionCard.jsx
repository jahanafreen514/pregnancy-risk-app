import React from "react";

function SuggestionCard({ title, message, color }) {
  const colors = {
    red: "border-red-500 bg-red-50",
    green: "border-green-500 bg-green-50",
    blue: "border-blue-500 bg-blue-50",
    orange: "border-orange-500 bg-orange-50",
    purple: "border-purple-500 bg-purple-50",
    pink: "border-pink-500 bg-pink-50",
    cyan: "border-cyan-500 bg-cyan-50",
  };

  return (
    <div
      className={`rounded-xl shadow-md border-l-4 p-5 ${
        colors[color] || "border-gray-400 bg-white"
      }`}
    >
      <h2 className="text-xl font-bold">{title}</h2>

      <p className="text-gray-600 mt-2">{message}</p>
    </div>
  );
}

export default SuggestionCard;