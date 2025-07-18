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

  plan.forEach(entry => {
    const dayCard = document.createElement("div");
    dayCard.className = "meal-card";
    dayCard.innerHTML = `
      <h3>${entry.day}</h3>
      <p><strong>Meal:</strong> ${entry.meal?.title || "N/A"}</p>
      <p>${entry.meal?.description || ""}</p>
      <ul>
        ${(entry.meal?.ingredients || []).map(i => `<li>${i}</li>`).join("")}
      </ul>
    `;
    mealPlanContainer.appendChild(dayCard);
  });
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
