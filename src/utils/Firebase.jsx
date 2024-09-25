import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDv1AdiaodjBXTBn91YVuABwF5gSLaLj4M",
  authDomain: "flavory2.firebaseapp.com",
  projectId: "flavory2",
  storageBucket: "flavory2.appspot.com",
  messagingSenderId: "54926408365",
  appId: "1:54926408365:web:a0560bcbbf5afadacd2424",
  measurementId: "G-6NNCPWMNB9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
