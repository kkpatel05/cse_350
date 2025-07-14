const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

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