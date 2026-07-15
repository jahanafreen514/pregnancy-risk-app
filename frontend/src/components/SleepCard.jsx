import { Moon } from "lucide-react";

function SleepCard({ user }) {

  let sleepTips = [];

  if (user.risk === "High") {

    sleepTips = [
      "Sleep at least 8-9 hours.",
      "Sleep on your left side.",
      "Avoid stress before bed.",
      "Keep your room quiet.",
    ];

  } else {

    sleepTips = [
      "Sleep 8 hours daily.",
      "Avoid mobile before sleep.",
      "Take a warm bath before bed.",
      "Use comfortable pillows.",
    ];

  }

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex items-center gap-3 mb-5">

        <Moon
          className="text-indigo-600"
          size={35}
        />

        <h2 className="text-xl font-bold">
          Sleep Tips
        </h2>

      </div>

      <ul className="space-y-3">

        {sleepTips.map((tip, index) => (

          <li
            key={index}
            className="bg-indigo-50 rounded-lg p-3"
          >
            😴 {tip}
          </li>

        ))}

      </ul>

    </div>

  );

}

export default SleepCard;
