const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

function matchesPreferences(recipe, preferences) {
  // For now, always return true. Customize later.
  return true;
}

const generateMealPlan = functions.https.onCall(async (data, context) => {
  const { userId, dailyCalories, preferences } = data;

  if (!userId || !dailyCalories || !preferences) {
    throw new functions.https.HttpsError("invalid-argument", "Missing meal plan inputs.");
  }

  const recipesSnap = await db.collection("recipes")
    .where("calories", "<=", dailyCalories)
    .get();

  const filtered = recipesSnap.docs
    .map(doc => doc.data())
    .filter(recipe => matchesPreferences(recipe, preferences));

  return { success: true, mealPlan: filtered.slice(0, 5) };
});

module.exports = { generateMealPlan };
