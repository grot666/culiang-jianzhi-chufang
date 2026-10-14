export function blendGrains(selections) {
  // selections: [{id, ratioPct, ...data}]
  const totalRatio = selections.reduce((s, g) => s + g.ratioPct, 0);
  if (Math.abs(totalRatio - 100) > 1) return null;
  let kcal = 0, protein = 0, fat = 0, carbs = 0, fiber = 0, yieldFactor = 0;
  selections.forEach(g => {
    const w = g.ratioPct / 100;
    kcal += g.kcal * w;
    protein += g.protein * w;
    fat += g.fat * w;
    carbs += g.carbs * w;
    fiber += g.fiber * w;
    yieldFactor += (g.cookedYield || 2.5) * w;
  });
  return {
    rawPer100: { kcal: Math.round(kcal), protein: +protein.toFixed(1), fat: +fat.toFixed(1), carbs: +carbs.toFixed(1), fiber: +fiber.toFixed(1) },
    cookedPer100: { 
      kcal: Math.round(kcal / yieldFactor), 
      protein: +(protein / yieldFactor).toFixed(1) 
    },
    bowlCookedG: 200, // typical
    bowlKcal: Math.round((kcal / yieldFactor) * 2),
    waterRatio: 1.2, // approximate for blend
    needsSoak: selections.some(g => g.soak)
  };
}
