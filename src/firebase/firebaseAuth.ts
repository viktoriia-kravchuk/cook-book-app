import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  NextOrObserver,
  User,
} from "firebase/auth";
import { getFirebaseConfig } from "./firebase-config";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);

export const signInUser = async (email: string, password: string) => {
  if (!email && !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUpUser = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const firestore = getFirestore();
    const userRef = doc(firestore, "users", user.uid);

    const userData = {
      email: user.email,
    };

    await setDoc(userRef, userData);

    return user;
  } catch (error) {
    console.error("Error signing up user:", error);
    throw error;
  }
};

export const userStateListener = (callback: NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback);
};

export const SignOutUser = async () => await signOut(auth);
