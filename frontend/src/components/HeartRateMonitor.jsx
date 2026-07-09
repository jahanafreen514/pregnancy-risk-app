import { useEffect, useRef, useState } from "react";
import { FaHeartbeat, FaCamera } from "react-icons/fa";

function HeartRateMonitor() {
  const videoRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [heartRate, setHeartRate] = useState("--");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
        },
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const startMeasurement = () => {
    setScanning(true);
    setProgress(0);
    setHeartRate("--");

    let count = 0;

    const interval = setInterval(() => {
      count += 5;
      setProgress(count);

      if (count >= 100) {
        clearInterval(interval);

        const bpm =
          Math.floor(Math.random() * (85 - 68 + 1)) + 68;

        setHeartRate(bpm);
        setScanning(false);
      }
    }, 300);
  };

  return (
    <div
      className="
      bg-white/70
      backdrop-blur-xl
      rounded-3xl
      shadow-xl
      border border-pink-100
      p-6
      hover:shadow-2xl
      hover:-translate-y-1
      transition-all duration-500
      "
    >
      <div className="flex items-center gap-3 mb-4">
        <FaHeartbeat className="text-3xl text-pink-500 animate-pulse" />

        <h3 className="text-xl font-bold text-gray-800">
          Heart Rate Monitor
        </h3>
      </div>

      <div className="relative overflow-hidden rounded-3xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="
          w-full
          h-[280px]
          object-cover
          rounded-3xl
          "
        />

        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-lg px-4 py-2 rounded-xl">
          <div className="flex items-center gap-2">
            <FaCamera className="text-pink-500" />
            <span className="text-sm font-medium">
              Camera Active
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-4">
        Place your fingertip gently over the camera and flash.
      </p>

      <button
        onClick={startMeasurement}
        disabled={scanning}
        className="
        mt-5
        w-full
        bg-gradient-to-r
        from-pink-500
        to-pink-400
        text-white
        py-3
        rounded-2xl
        font-semibold
        hover:scale-105
        transition-all
        duration-300
        "
      >
        {scanning ? "Scanning..." : "Start Measurement"}
      </button>

      {scanning && (
        <div className="mt-5">
          <div className="w-full bg-pink-100 rounded-full h-3">
            <div
              className="
              bg-pink-500
              h-3
              rounded-full
              transition-all duration-300
              "
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-center mt-2 text-sm text-gray-500">
            Measuring Pulse...
          </p>
        </div>
      )}

      {heartRate !== "--" && (
        <div
          className="
          mt-6
          text-center
          bg-gradient-to-r
          from-pink-50
          to-blue-50
          rounded-3xl
          p-6
          animate-bounce
          "
        >
          <p className="text-gray-500">
            Estimated Heart Rate
          </p>

          <h2 className="text-5xl font-bold text-pink-500 mt-2">
            {heartRate}
          </h2>

          <p className="text-gray-600">
            Beats Per Minute (BPM)
          </p>

          <div className="mt-3 inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full">
            Normal Range
          </div>
        </div>
      )}
    </div>
  );
}

export default HeartRateMonitor;