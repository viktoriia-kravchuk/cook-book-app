import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirebaseConfig } from "./firebase-config";
import { getFirestore, collection, getDocs, query, where, addDoc, serverTimestamp,doc, getDoc } from "firebase/firestore";
import { Recipe } from "../types";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);

export const addNewRecipe = async (recipe: Recipe, image: File | null) => {
  try {
    const firestore = getFirestore();
    const storage = getStorage();

    // Upload image to Firebase Storage if an image is provided
    let imageUrl = "";
    if (image) {
      const storageRef = ref(storage, `recipes-photos/${recipe.title}-${recipe.user_id}-${Date.now()}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    const recipesCollection = collection(firestore, "recipes");
    const newRecipe = {
      ...recipe,
      created_at: serverTimestamp(),
      imageUrl: imageUrl,
    };

    const docRef = await addDoc(recipesCollection, newRecipe);

    console.log("Document written with ID: ", docRef.id);
    console.log("Recipe added successfully!");
    return recipe;
  } catch (error) {
    console.error("Error adding recipe:", error);
    throw error;
  }
};

export const getAllRecipes = async () => {
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

export const getRecipesByUserId = async (userId:string) => {
  try {
    const firestore = getFirestore();
    const recipesCollection = collection(firestore, "recipes");

    const recipesQuery = query(recipesCollection, where("user_id", "==", userId));

    const snapshot = await getDocs(recipesQuery);
    const recipes:Recipe[] = [];

    snapshot.forEach((doc) => {
      const recipeData = { ...doc.data(), id: doc.id } as Recipe;
      recipes.push(recipeData);
    });

    return recipes;
  } catch (error) {
    console.error("Error getting recipes:", error);
    throw error;
  }
};

export const getRecipeById = async (recipeId: string) => {
  try {
    const firestore = getFirestore();
    const recipeDoc = doc(firestore, "recipes", recipeId);
    const recipeSnapshot = await getDoc(recipeDoc);

    if (recipeSnapshot.exists()) {
      const recipeData = { ...recipeSnapshot.data(), id: recipeSnapshot.id } as Recipe;
      return recipeData;
    } else {
      throw new Error("Recipe not found");
    }
  } catch (error) {
    console.error("Error getting recipe by ID:", error);
    throw error;
  }
};