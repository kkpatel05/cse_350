const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

//
// 🚀 saveRecipe(): Save a recipe to Firestore and calculate macros
//
exports.saveRecipe = functions.https.onCall(async (data, context) => {
  const { userId, ingredients, recipeName } = data;

  if (!userId || !ingredients || ingredients.length === 0 || !recipeName) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required recipe data.");
  }

  const macros = calculateMacros(ingredients);

  await db.collection("users").doc(userId).collection("recipes").add({
    recipeName,
    ingredients,
    macros,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Recipe saved!", macros };
});

//
// 🍽️ logMeal(): Log a meal and update daily macro totals
//
exports.logMeal = functions.https.onCall(async (data, context) => {
  const { userId, mealMacros, date } = data;

  if (!userId || !mealMacros || !date) {
    throw new functions.https.HttpsError("invalid-argument", "Missing meal log data.");
  }

  const dayRef = db.collection("users").doc(userId).collection("dailyLogs").doc(date);
  const doc = await dayRef.get();

  if (!doc.exists) {
    await dayRef.set({
      protein: mealMacros.protein,
      carbs: mealMacros.carbs,
      fat: mealMacros.fat,
    });
  } else {
    const existing = doc.data();
    await dayRef.update({
      protein: existing.protein + mealMacros.protein,
      carbs: existing.carbs + mealMacros.carbs,
      fat: existing.fat + mealMacros.fat,
    });
  }

  return { success: true, message: "Meal logged successfully." };
});

//
// 🏋️ generateWorkout(): Return a personalized workout plan
//
exports.generateWorkout = functions.https.onCall((data, context) => {
  const { fitnessGoal, level, equipment } = data;

  if (!fitnessGoal || !level || !equipment) {
    throw new functions.https.HttpsError("invalid-argument", "Missing workout generation inputs.");
  }

  const workouts = getWorkoutPlan(fitnessGoal, level, equipment);
  return { success: true, plan: workouts };
});

//
// 🔧 Helper Functions
//
function calculateMacros(ingredients) {
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

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
  const finalPlan = filtered.map(ex => `${ex} (${level}, Equipment: ${equipment ? "Yes" : "No"})`);
  return finalPlan;
}
