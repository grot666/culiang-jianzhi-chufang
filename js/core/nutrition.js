// Core nutrition calculations. Pure functions, unit-testable.

export function calculateBMR(sex, age, heightCm, weightKg) {
  // Mifflin-St Jeor
  if (sex === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
}

export function calculateTDEE(bmr, activityFactor) {
  return bmr * activityFactor;
}

export function calculateTargets({ sex, age, height, weight, goalWeight, activity }) {
  const bmr = calculateBMR(sex, age, height, weight);
  const tdee = calculateTDEE(bmr, activity);
  const deficitPct = 0.20;
  let calories = Math.round(tdee * (1 - deficitPct));
  const bmrFloor = Math.round(bmr);
  if (calories < bmrFloor) {
    calories = bmrFloor; // guardrail
  }
  const proteinG = Math.round(1.6 * weight); // default 1.6g/kg; TODO: use goal if BMI>=30
  const fatPct = 0.25;
  const fatG = Math.round((calories * fatPct) / 9);
  const carbsG = Math.round((calories - proteinG * 4 - fatG * 9) / 4);
  const fiberG = 28; // midpoint 25-30
  const waterMl = Math.round(32.5 * weight); // ~30-35 ml/kg

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calories,
    proteinG,
    fatG,
    carbsG,
    fiberG,
    waterMl,
    warnings: calories === bmrFloor ? ['目标热量接近或低于基础代谢，建议咨询专业人士'] : []
  };
}
