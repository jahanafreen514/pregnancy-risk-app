import { useState, useEffect } from "react";

function MedicationSection() {
  const [medicine, setMedicine] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("medications")) || [];

    setList(saved);
  }, []);

  const addMedicine = () => {
    if (!medicine) return;

    const updated = [...list, medicine];

    setList(updated);

    localStorage.setItem(
      "medications",
      JSON.stringify(updated)
    );

    setMedicine("");
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h3 className="font-bold text-lg mb-4">
        Medications
      </h3>

      <div className="flex gap-2 mb-4">

        <input
          value={medicine}
          onChange={(e) =>
            setMedicine(e.target.value)
          }
          placeholder="Medicine Name"
          className="flex-1 border rounded-xl p-2"
        />

        <button
          onClick={addMedicine}
          className="bg-pink-500 text-white px-4 rounded-xl"
        >
          Add
        </button>

      </div>

      <div className="space-y-3">

        {list.map((med, index) => (
          <div
            key={index}
            className="bg-pink-50 p-4 rounded-xl"
          >
            {med}
          </div>
        ))}

      </div>

    </div>
  );
}

export default MedicationSection;