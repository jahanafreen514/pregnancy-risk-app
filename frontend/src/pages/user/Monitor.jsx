import React from "react";
import { motion } from "framer-motion";

const Monitor = () => {
  return (
    <motion.div
      className="glow-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Live Monitoring</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        
        <div className="glow-card">
          ❤️ Heart Rate: 82 BPM
        </div>

        <div className="glow-card">
          🌡 Temperature: 36.8°C
        </div>

      </div>
    </motion.div>
  );
};

export default Monitor;