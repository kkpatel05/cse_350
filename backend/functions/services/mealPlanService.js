const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

function matchesPreferences(recipe, preferences) {
  if (!recipe || !preferences) return false;

  const userDiet = preferences.diet?.toLowerCase();
  const userRestrictions = preferences.restrictions || []; 

  // ✅ Check diet match (e.g., vegetarian, vegan, keto, etc.)
  if (userDiet && recipe.diet?.toLowerCase() !== userDiet0) {
    return false;
  }
  // ✅ Check that all user restrictions are included in recipe.tags
  const recipeTags = recipe.tags?.map(tag => tag.toLowerCase()) || [];

  for (const restriction of userRestrictions) {
    if (!recipeTags.includes(restriction.toLowerCase())) {
      return false;
    }
  }
  return true;
}

// 🍽️ Generate Meal Plan
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

// 🔢 Get Nutrition Stats
const getNutritionStats = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  const { startDate, endDate } = data;

  if (!uid || !startDate || !endDate) {
    throw new functions.https.HttpsError("invalid-argument", "Missing dates or user ID.");
  }

  const mealsRef = db.collection("users").doc(uid).collection("meals");
  const snapshot = await mealsRef
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .get();

  let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

  snapshot.forEach(doc => {
    const meal = doc.data();
    totalCalories += meal.calories || 0;
    totalProtein += meal.protein || 0;
    totalCarbs += meal.carbs || 0;
    totalFat += meal.fat || 0;
  });

  return {
    success: true,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat
  };
});

// 🥗 Suggest Meals from Firestore
const suggestMeals = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  const { diet, targetCalories } = data;

  if (!uid) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  const recipesRef = db.collection("recipes");
  const snapshot = await recipesRef.get();

  const suggestions = [];
  snapshot.forEach(doc => {
    const recipe = doc.data();
    const matchesDiet = !diet || recipe.diet === diet;
    const withinCalories = !targetCalories || (
      recipe.calories >= (targetCalories - 100) &&
      recipe.calories <= (targetCalories + 100)
    );

    if (matchesDiet && withinCalories) {
      suggestions.push({ id: doc.id, ...recipe });
    }
  });

  return {
    success: true,
    suggestions: suggestions.slice(0, 5)
  };
});

module.exports = {
  generateMealPlan,
  getNutritionStats,
  suggestMeals
};
