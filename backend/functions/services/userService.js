const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

// ✅ updatePreferences: Store user preferences
const updatePreferences = functions.https.onCall(async (data, context) => {
  const { userId, preferences } = data;

  if (!userId || !preferences) {
    throw new functions.https.HttpsError("invalid-argument", "Missing preferences.");
  }

  await db.collection("users").doc(userId).set({ preferences }, { merge: true });
  return { success: true, message: "Preferences updated" };
});

// ✅ getWeeklySummary: Return 7 days of logs
const getWeeklySummary = functions.https.onCall(async (data, context) => {
  const { userId } = data;

  if (!userId) {
    throw new functions.https.HttpsError("invalid-argument", "Missing user ID.");
  }

  const logsRef = db.collection("users").doc(userId).collection("dailyLogs");
  const snapshot = await logsRef.orderBy("date", "desc").limit(7).get();

  const summary = snapshot.docs.map(doc => ({
    date: doc.id,
    ...doc.data()
  }));

  return { success: true, summary };
});

// ✅ trackProgress
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

// ✅ getDailySummary
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

// ✅ Export all
module.exports = {
  updatePreferences,
  getWeeklySummary,
  trackProgress,
  getDailySummary
};
