export const calculateRisk = (data) => {
  let score = 0;

  // Vitals
  if (Number(data.bpSystolic) >= 140) score += 20;
  if (Number(data.sugar) >= 140) score += 15;
  if (Number(data.temperature) >= 38) score += 10;
  if (Number(data.heartRate) >= 110) score += 10;

  // Symptoms
  if (data.symptoms.includes("Swelling")) score += 15;
  if (data.symptoms.includes("Blurred Vision")) score += 20;
  if (data.symptoms.includes("Bleeding")) score += 30;
  if (data.symptoms.includes("Chest Pain")) score += 25;
  if (data.symptoms.includes("Reduced Baby Movement")) score += 25;
  if (data.symptoms.includes("Headache")) score += 10;
  if (data.symptoms.includes("Dizziness")) score += 10;
  if (data.symptoms.includes("Fever")) score += 10;

  let level = "Low";

  if (score > 60)
    level = "High";
  else if (score > 30)
    level = "Medium";

  return {
    score,
    level,
  };
};