// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyAoNcr7QGFQ_iOXpY0MzFBsdOSP06cBc-0",
    authDomain: "grub-n--grind.firebaseapp.com",
    projectId: "grub-n--grind",
    storageBucket: "grub-n--grind.firebasestorage.app",
    messagingSenderId: "391648176781",
    appId: "1:391648176781:web:7b37e7646b6dd796ae10c4"
  };

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Functions
const functions = getFunctions(app);

// Export callable cloud functions
export const getRecipes = httpsCallable(functions, "getRecipes");
export const generateMealPlan = httpsCallable(functions, "generateMealPlan");

export { app, functions };