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
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
} from "firebase/firestore";

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

export const getUserDataById = async (userId: string) => {
  try {
    const firestore = getFirestore();
    const usersCollection = collection(firestore, "users");
    const userDoc = await getDoc(doc(usersCollection, userId));

    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

export const SignOutUser = async () => await signOut(auth);
