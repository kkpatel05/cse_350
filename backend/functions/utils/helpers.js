function calculateMacros(ingredients) {
  let totalProtein = 0, totalCarbs = 0, totalFat = 0;

  for (const item of ingredients) {
    totalProtein += parseFloat(item.protein || 0);
    totalCarbs += parseFloat(item.carbs || 0);
    totalFat += parseFloat(item.fat || 0);
  }

  return {
    protein: Number(totalProtein.toFixed(2)),
    carbs: Number(totalCarbs.toFixed(2)),
    fat: Number(totalFat.toFixed(2)),
  };
}

function getWorkoutPlan(goal, level, equipment) {
  const samplePlans = {
    strength: ["Squats", "Deadlifts", "Overhead Press"],
    fatLoss: ["Burpees", "Jump Rope", "Mountain Climbers"],
    endurance: ["Running", "Cycling", "Jumping Jacks"],
  };

  const filtered = samplePlans[goal] || [];
  return filtered.map(ex => `${ex} (${level}, Equipment: ${equipment ? "Yes" : "No"})`);
}

module.exports = { calculateMacros, getWorkoutPlan };
