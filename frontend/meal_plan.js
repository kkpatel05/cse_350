import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-functions.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAoNcr7QGFQ_iOXpY0MzFBsdOSP06cBc-0",
  authDomain: "grub-n--grind.firebaseapp.com",
  projectId: "grub-n--grind",
  storageBucket: "grub-n--grind.appspot.com",
  messagingSenderId: "391648176781",
  appId: "1:391648176781:web:7b37e7646b6dd796ae10c4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);
const db = getFirestore(app);

const mealPlanContainer = document.getElementById("mealColumns");

function renderMealPlan(plan) {
  mealPlanContainer.innerHTML = "";

  // Auto-generate 7-day plan with rotating recipes
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (let i = 0; i < 7; i++) {
    const breakfast = plan[i % plan.length];
    const lunch = plan[(i + 1) % plan.length];
    const dinner = plan[(i + 2) % plan.length];

    const dayCard = document.createElement("div");
    dayCard.className = "meal-card";
    dayCard.innerHTML = `
      <h3>${days[i]}</h3>
      <p><strong>Breakfast:</strong> ${breakfast?.title || "N/A"}</p>
      <p><strong>Lunch:</strong> ${lunch?.title || "N/A"}</p>
      <p><strong>Dinner:</strong> ${dinner?.title || "N/A"}</p>
    `;
    mealPlanContainer.appendChild(dayCard);
  }
}

async function fetchUserPreferences(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    const userData = userDoc.data();
    return {
      diet: null, // optional if you add it later
      restrictions: userData.dietaryPrefs || []
    };
  } else {
    throw new Error("User preferences not found.");
  }
}

async function loadMealPlan(user) {
  try {
    const preferences = await fetchUserPreferences(user.uid);
    const generateMealPlan = httpsCallable(functions, "generateMealPlan");

    const result = await generateMealPlan({
      userId: user.uid,
      dailyCalories: 2000, // You can make this dynamic later
      preferences
    });

    if (result.data.success) {
      renderMealPlan(result.data.mealPlan);
    } else {
      alert("❌ Meal plan not generated.");
    }
  } catch (err) {
    console.error("Error loading meal plan:", err);
    alert("❌ Failed to load meal plan.");
  }
}

// Wait for Firebase Auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadMealPlan(user);
  } else {
    alert("Please log in first.");
    window.location.href = "login.html";
  }
});
