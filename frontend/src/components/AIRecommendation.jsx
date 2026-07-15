import React from "react";
import { Brain } from "lucide-react";

function AIRecommendation({ user }) {
  let recommendation = "";

  if (user.risk === "High") {
    recommendation =
      "High pregnancy risk detected. Visit your doctor immediately and monitor blood pressure regularly.";
  } else if (user.risk === "Medium") {
    recommendation =
      "Continue regular prenatal checkups and maintain a healthy diet.";
  } else {
    recommendation =
      "Everything looks stable. Continue healthy habits and routine checkups.";
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex items-center gap-3 mb-4">

        <Brain className="text-purple-600" size={35} />

        <h2 className="text-2xl font-bold">
          AI Recommendation
        </h2>

      </div>

      <p className="text-gray-600 leading-7">
        {recommendation}
      </p>

    </div>
  );
}

export default AIRecommendation;