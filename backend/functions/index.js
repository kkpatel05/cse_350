const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { onCall } = require("firebase-functions/v2/https"); // ✅ MISSING IMPORT

admin.initializeApp();
const db = admin.firestore(); // ✅ Required to access Firestore

// === Workout Services ===
const {
  saveRecipe,
  logMeal,
  generateWorkout,
  suggestWorkouts
} = require("./services/workoutService");

// === Meal Plan Services ===
const {
  generateMealPlan,
  getNutritionStats,
  suggestMeals
} = require("./services/mealPlanService");

// === User Services ===
const {
  updatePreferences,
  getWeeklySummary,
  trackProgress,
  getDailySummary
} = require("./services/userService");

const { patchRecipesWithDietTags } = require("./services/adminPatchService");

// === Custom Callable Function === ✅ ADD THIS
exports.getRecipes = onCall(async (data, context) => {
  try {
    const snapshot = await db.collection("recipes").limit(10).get();
    const recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return recipes;
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Failed to fetch recipes");
  }
});

// === Exports ===
exports.saveRecipe = saveRecipe;
exports.logMeal = logMeal;
exports.generateWorkout = generateWorkout;
exports.suggestWorkouts = suggestWorkouts;

exports.generateMealPlan = generateMealPlan;
exports.getNutritionStats = getNutritionStats;
exports.suggestMeals = suggestMeals;

exports.updatePreferences = updatePreferences;
exports.getWeeklySummary = getWeeklySummary;
exports.trackProgress = trackProgress;
exports.getDailySummary = getDailySummary;
exports.patchRecipesWithDietTags = patchRecipesWithDietTags;
