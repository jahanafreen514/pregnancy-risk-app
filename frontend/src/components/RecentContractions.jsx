import { useEffect, useState } from "react";

function RecentContractions() {
  const [records, setRecords] = useState([]);

  const loadContractions = () => {
    const saved =
      JSON.parse(localStorage.getItem("contractions")) || [];

    setRecords(saved);
  };

  useEffect(() => {
    loadContractions();

    const interval = setInterval(() => {
      loadContractions();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h3 className="font-bold text-lg mb-4">
        Recent Contractions
      </h3>

      <div className="space-y-3">
        {records.length > 0 ? (
          records.map((item, index) => (
            <div
              key={index}
              className="bg-pink-50 p-4 rounded-xl"
            >
              <p>Duration: {item.duration}s</p>

              <p className="text-sm text-gray-500">
                {item.time}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No contractions recorded
          </p>
        )}
      </div>
    </div>
  );
}

export default RecentContractions;