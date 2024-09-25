import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNAnFvLqNKAk_Zi8_4QWzmjwAUrp7Tqo8",
  authDomain: "flavory-f4009.firebaseapp.com",
  projectId: "flavory-f4009",
  storageBucket: "flavory-f4009.appspot.com",
  messagingSenderId: "8958390883",
  appId: "1:8958390883:web:9e3fb13ab83208f88d3e56",
  measurementId: "G-7BBZ2PTP4R",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
