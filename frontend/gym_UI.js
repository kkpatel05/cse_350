import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAoNcr7QGFQ_iOXpY0MzFBsdOSP06cBc-0",
  authDomain: "grub-n--grind.firebaseapp.com",
  projectId: "grub-n--grind",
  storageBucket: "grub-n--grind.appspot.com",
  messagingSenderId: "391648176781",
  appId: "1:391648176781:web:7b37e7646b6dd796ae10c4"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Authenticate the user (temporary)
async function loginTestUser() {
  try {
    await signInWithEmailAndPassword(auth, "testuser@example.com", "testpassword");
    console.log("✅ Logged in successfully");
  } catch (err) {
    console.error("❌ Login failed:", err.message);
    alert("Login failed: " + err.message);
  }
}

// ✅ Load workouts after auth
async function loadWorkouts() {
  const muscleGroup = document.getElementById("muscleGroup").value;
  const workoutList = document.getElementById("workoutList");
  workoutList.innerHTML = "";

  if (!muscleGroup) return;

  const q = query(collection(db, "exerciseLibrary"), where("bodyPart", "==", muscleGroup));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(doc => {
    const workout = doc.data();

    const btn = document.createElement("button");
    btn.className = "workout-btn";
    btn.textContent = workout.name;

    const detailDiv = document.createElement("div");
    detailDiv.className = "workout-details";
    detailDiv.innerHTML = `
      <img src="${workout.gifUrl}" alt="${workout.name}" />
      <p>${workout.instructions?.join("<br>") || ""}</p>
    `;

    btn.onclick = () => {
      detailDiv.style.display = detailDiv.style.display === "block" ? "none" : "block";
    };

    workoutList.appendChild(btn);
    workoutList.appendChild(detailDiv);
  });
}

// ✅ Update select dropdown color
function updateSelectColor() {
  const select = document.getElementById("muscleGroup");
  select.style.color = select.value === "" ? "grey" : "black";
}

// ✅ Set up event handlers
window.addEventListener("DOMContentLoaded", async () => {
  await loginTestUser(); // Wait for login first

  const select = document.getElementById("muscleGroup");
  select.addEventListener("change", () => {
    loadWorkouts();
    updateSelectColor();
  });

  updateSelectColor(); // Set initial dropdown color
});
