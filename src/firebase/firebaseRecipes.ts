import { initializeApp } from "firebase/app";
import {
  getAuth
} from "firebase/auth";
import { getFirebaseConfig } from "./firebase-config";
import { getFirestore,addDoc , collection} from "firebase/firestore";
import { Recipe } from "../types";
const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);

export const addNewRecipe = async (recipe: Recipe) => {
  try {
    const firestore = getFirestore();
    const recipesCollection = collection(firestore, "recipes");
    await addDoc(recipesCollection, recipe);
    console.log("Recipe added successfully!");
    return recipe;
  } catch (error) {
    console.error("Error adding recipe:", error);
    throw error;
  }
};