function SymptomCard({
  symptom,
  selected,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        selected
          ? "bg-pink-500 text-white border-pink-500"
          : "bg-white border-pink-100 hover:border-pink-400"
      }`}
    >
      {symptom}
    </div>
  );
}

export default SymptomCard;