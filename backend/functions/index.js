const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Import all service functions
const { saveRecipe, logMeal, generateWorkout } = require("./services/workoutService");
const { generateMealPlan } = require("./services/mealPlanService");
const { updatePreferences, getWeeklySummary } = require("./services/userService");

// Export cloud functions
exports.saveRecipe = saveRecipe;
exports.logMeal = logMeal;
exports.generateWorkout = generateWorkout;
exports.generateMealPlan = generateMealPlan;
exports.updatePreferences = updatePreferences;
exports.getWeeklySummary = getWeeklySummary;
