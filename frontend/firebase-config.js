// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAoNcr7QGFQ_iOXpY0MzFBsdOSP06cBc-0",
  authDomain: "grub-n--grind.firebaseapp.com",
  projectId: "grub-n--grind",
  storageBucket: "grub-n--grind.appspot.com",
  messagingSenderId: "391648176781",
  appId: "1:391648176781:web:46a99023824f01bdae10c4"
};

const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
