const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

const updatePreferences = functions.https.onCall(async (data, context) => {
  const { userId, preferences } = data;

  if (!userId || !preferences) {
    throw new functions.https.HttpsError("invalid-argument", "Missing preferences.");
  }

  await db.collection("users").doc(userId).set({ preferences }, { merge: true });
  return { success: true, message: "Preferences updated" };
});

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

module.exports = { updatePreferences, getWeeklySummary };
