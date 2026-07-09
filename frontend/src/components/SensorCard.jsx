import React from "react";
import { motion } from "framer-motion";

function SensorCard({ title, value, unit, status }) {
  return (
    <motion.div
      className="card"
      whileHover={{ scale: 1.05 }}
    >
      <h3>{title}</h3>
      <h1>{value} {unit}</h1>

      <p className={status === "safe" ? "safe" : "risk"}>
        {status === "safe" ? "Normal ✅" : "Risk ⚠️"}
      </p>
    </motion.div>
  );
}

export default SensorCard;