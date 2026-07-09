import { useState, useEffect } from "react";

function ContractionTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval;

    if (running) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  
const stopTimer = () => {
  setRunning(false);

  const contractions =
    JSON.parse(localStorage.getItem("contractions")) || [];

  contractions.unshift({
    duration: seconds,
    time: new Date().toLocaleTimeString(),
  });
  console.log("Saving contraction:", {
  duration: seconds,
  time: new Date().toLocaleTimeString(),
});

  localStorage.setItem(
    "contractions",
    JSON.stringify(contractions.slice(0, 5))
  );

  setSeconds(0);
};
  return (
<div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6">

      <h3 className="font-bold text-lg">
        Contraction Timer
      </h3>

      <div className="text-center mt-6">

        <h2 className="text-5xl font-bold text-pink-500">
          {seconds}s
        </h2>

      </div>

      <div className="flex gap-3 mt-6">

        <button
          onClick={() => setRunning(true)}
          className="flex-1 bg-pink-500 text-white py-3 rounded-xl hover:scale-105"
        >
          Start
        </button>

        <button
  onClick={stopTimer}
  className="flex-1 bg-sky-500 text-white py-3 rounded-xl"
>
  Stop
</button>

      </div>

    </div>
  );
}

export default ContractionTimer;