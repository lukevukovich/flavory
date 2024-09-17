import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as signUserOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./Firebase";

// Provider for Google Sign-In
const provider = new GoogleAuthProvider();

// Sign in with Google
export const signIn = async () => {
  try {
    await signInWithPopup(auth, provider);
    return true;
  } catch (error) {
    return false;
  }
};

// Sign out
export const signOut = async () => {
  try {
    await signUserOut(auth);
    return true;
  } catch (error) {
    return false;
  }
};

// Check sign-in status, returns sign in status and user object
export function checkSignInStatus() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve({ isSignedIn: true, user });
      } else {
        resolve({ isSignedIn: false, user: null });
      }
    });
  });
}
