import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirebaseConfig } from "./firebase-config";
import { getFirestore, collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { Recipe } from "../types";
const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);

export const addNewRecipe = async (recipe: Recipe) => {
  try {
    const firestore = getFirestore();
    const recipesCollection = collection(firestore, "recipes");
    const docRef = await addDoc(recipesCollection, recipe);

    // const docRef = await addDoc(collection(db, "todos"), {
    //   todo: todo,    
    // });
    console.log("Document written with ID: ", docRef.id);
    console.log("Recipe added successfully!");
    return recipe;
  } catch (error) {
    console.error("Error adding recipe:", error);
    throw error;
  }
};

export const getRecipes = async () => {
  try {
    const firestore = getFirestore();
    const recipesCollection = collection(firestore, "recipes");
    const recipesQuery = query(recipesCollection);

    const snapshot = await getDocs(recipesQuery);
    const recipes: Recipe[] = [];

    snapshot.forEach((doc) => {
      const recipeData = {...doc.data(), id:doc.id } as Recipe;
      recipes.push(recipeData);
    });

    return recipes;
  } catch (error) {
    console.error("Error getting recipes:", error);
    throw error;
  }
};