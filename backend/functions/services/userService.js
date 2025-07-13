const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

const trackProgress = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  const progressData = data;

  await db.collection("users").doc(uid).collection("progress").add({
    ...progressData,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true, message: "Progress tracked successfully" };
});

const getDailySummary = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  const { dateString } = data;

  if (!uid || !dateString) {
    throw new functions.https.HttpsError("invalid-argument", "Missing user ID or date.");
  }

  const date = new Date(dateString);
  const start = new Date(date.setHours(0, 0, 0, 0));
  const end = new Date(date.setHours(23, 59, 59, 999));

  const mealsRef = db.collection("users").doc(uid).collection("meals");
  const workoutsRef = db.collection("users").doc(uid).collection("workouts");

  const [mealSnap, workoutSnap] = await Promise.all([
    mealsRef.where("date", ">=", start).where("date", "<=", end).get(),
    workoutsRef.where("date", ">=", start).where("date", "<=", end).get()
  ]);

  let totalCalories = 0;
  const workouts = [];

  mealSnap.forEach(doc => totalCalories += doc.data().calories || 0);
  workoutSnap.forEach(doc => workouts.push(doc.data()));

  return {
    success: true,
    date: dateString,
    totalCalories,
    workouts
  };
});


module.exports = {
  updatePreferences,
  getWeeklySummary,
  trackProgress,
  getDailySummary
};
