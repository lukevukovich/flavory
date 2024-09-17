import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as signUserOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./Firebase";

const provider = new GoogleAuthProvider();

export const signIn = async () => {
  try {
    await signInWithPopup(auth, provider);
    return true;
  } catch (error) {
    return false;
  }
};
export const signOut = async () => {
  try {
    await signUserOut(auth);
    return true;
  } catch (error) {
    return false;
  }
};

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

export function getUser() {
  return auth.currentUser;
}
