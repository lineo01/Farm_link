import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAEi1jq2EF-3CS1qfxkMIGaN1YxmbHPI3c",
  authDomain: "farm-link-da347.firebaseapp.com",
  projectId: "farm-link-da347",
  storageBucket: "farm-link-da347.firebasestorage.app",
  messagingSenderId: "61798278746",
  appId: "1:61798278746:web:0b005227e292c1a0ca5a63",
  measurementId: "G-T7PPDMD3WZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, onAuthStateChanged, signOut };
export default app;