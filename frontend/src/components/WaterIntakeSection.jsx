import { useState, useEffect } from "react";

function WaterIntakeSection() {
  const [water, setWater] = useState(0);

  useEffect(() => {
    const saved =
      Number(localStorage.getItem("waterIntake")) || 0;

    setWater(saved);
  }, []);

  const addWater = () => {
    if (water < 10) {
      const updated = water + 1;

      setWater(updated);

      localStorage.setItem(
        "waterIntake",
        updated
      );
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h3 className="font-bold text-lg">
        Water Intake
      </h3>

      <div className="mt-5">

        <div className="w-full bg-sky-100 h-4 rounded-full">

          <div
            className="bg-sky-500 h-4 rounded-full transition-all duration-500"
            style={{
              width: `${(water / 10) * 100}%`,
            }}
          ></div>

        </div>

        <p className="mt-3 text-gray-500">
          {water} of 10 glasses completed
        </p>

        <button
          onClick={addWater}
          className="mt-4 bg-sky-500 text-white px-4 py-2 rounded-xl"
        >
          Add Glass
        </button>

      </div>

    </div>
  );
}

export default WaterIntakeSection;