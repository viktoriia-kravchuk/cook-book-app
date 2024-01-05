import {
  getFirestore,
  collection,
  where,
  getDoc,
  getDocs,
  runTransaction,
  doc,
  setDoc,
  deleteDoc,
  query,
} from "firebase/firestore";
import { Recipe } from "../types";

const COLLECTIONS = {
  likes: "likes",
  saves: "saves",
  recipes: "recipes",
};

const performRecipeAction = async (
  userId: string,
  recipeId: string,
  action: "like" | "save" | "unlike" | "unsave"
) => {
  try {
    const firestore = getFirestore();
    const collectionName =
      action === "like" || action === "unlike"
        ? COLLECTIONS.likes
        : COLLECTIONS.saves;
    const recipeRef = doc(firestore, collectionName, `${userId}_${recipeId}`);

    if (action === "unlike" || action === "unsave") {
      await deleteDoc(recipeRef);
    } else {
      const data = {
        userId,
        recipeId,
        [action === "like" ? "liked" : "saved"]: true,
      };
      await setDoc(recipeRef, data);
    }
  } catch (error) {
    console.error(`Error ${action}ing recipe:`, error);
    throw error;
  }
};

export const likeRecipe = async (userId: string, recipeId: string) => {
  await performRecipeAction(userId, recipeId, "like");
};

export const saveRecipe = async (userId: string, recipeId: string) => {
  await performRecipeAction(userId, recipeId, "save");
};

export const unlikeRecipe = async (userId: string, recipeId: string) => {
  await performRecipeAction(userId, recipeId, "unlike");
};

export const unsaveRecipe = async (userId: string, recipeId: string) => {
  await performRecipeAction(userId, recipeId, "unsave");
};

export const updateRecipeLikes = async (
  recipeId: string,
  incrementValue: number
) => {
  await performUpdateRecipe("likes", recipeId, incrementValue);
};

export const updateRecipeSaves = async (
  recipeId: string,
  incrementValue: number
) => {
  await performUpdateRecipe("saves", recipeId, incrementValue);
};

const performUpdateRecipe = async (
  collectionName: string,
  recipeId: string,
  incrementValue: number
) => {
  const firestore = getFirestore();
  const recipeDoc = doc(firestore, COLLECTIONS.recipes, recipeId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const recipeSnapshot = await transaction.get(recipeDoc);

      if (!recipeSnapshot.exists()) {
        throw new Error(`Recipe with ID ${recipeId} does not exist.`);
      }

      const currentCount = recipeSnapshot.get(collectionName) || 0;
      const newCount = currentCount + incrementValue;

      transaction.update(recipeDoc, { [collectionName]: newCount });
    });
  } catch (error) {
    console.error(`Error updating recipe ${collectionName}:`, error);
    throw error;
  }
};

export const checkUserInteraction = async (
  userId: string,
  recipeId: string,
  collectionName: string
): Promise<boolean> => {
  try {
    const firestore = getFirestore();
    const interactionRef = doc(
      firestore,
      collectionName,
      `${userId}_${recipeId}`
    );
    const snapshot = await getDoc(interactionRef);
    return snapshot.exists();
  } catch (error) {
    console.error(
      `Error checking user interaction for ${collectionName}:`,
      error
    );
    throw error;
  }
};

export const getRecipesByUserAction = async (
  userId: string,
  type: "like" | "save"
): Promise<Recipe[]> => {
  try {
    const firestore = getFirestore();
    const collectionName =
      type === "like"
        ? COLLECTIONS.likes
        : type === "save"
        ? COLLECTIONS.saves
        : "";
    if (!collectionName) {
      throw new Error("Invalid collection");
    }
    const userActionQuery = query(
      collection(firestore, collectionName),
      where("userId", "==", userId)
    );
    const userActionSnapshot = await getDocs(userActionQuery);
    const userActionRecipes: Recipe[] = [];

    for (const actionDoc of userActionSnapshot.docs) {
      const recipeId = actionDoc.data().recipeId;
      const recipeDoc = doc(firestore, COLLECTIONS.recipes, recipeId);
      const recipeSnapshot = await getDoc(recipeDoc);
      if (recipeSnapshot.exists()) {
        const recipeData = {
          ...recipeSnapshot.data(),
          id: recipeSnapshot.id,
        } as Recipe;
        userActionRecipes.push(recipeData);
      } else {
        throw new Error("Recipe not found");
      }
    }
    return userActionRecipes;
  } catch (error) {
    console.error(`Error getting ${type} recipes by user:`, error);
    throw error;
  }
};

export const getSavedOrLikedRecipesByUser = async (
  userId: string,
  action: "like" | "save"
): Promise<Recipe[]> => {
  return getRecipesByUserAction(userId, action);
};



export const deleteRecipe = async (userId: string, recipeId: string) => {
  const firestore = getFirestore();
  const recipeDoc = doc(firestore, COLLECTIONS.recipes, recipeId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const recipeSnapshot = await transaction.get(recipeDoc);

      if (!recipeSnapshot.exists()) {
        throw new Error(`Recipe with ID ${recipeId} does not exist.`);
      }

      transaction.delete(recipeDoc);

      const likesQuery = query(
        collection(firestore, COLLECTIONS.likes),
        where("recipeId", "==", recipeId)
      );
      const likesSnapshot = await getDocs(likesQuery);
      likesSnapshot.forEach((likeDoc) => {
        transaction.delete(likeDoc.ref);
      });

      const savesQuery = query(
        collection(firestore, COLLECTIONS.saves),
        where("recipeId", "==", recipeId)
      );
      const savesSnapshot = await getDocs(savesQuery);
      savesSnapshot.forEach((saveDoc) => {
        transaction.delete(saveDoc.ref);
      });
    });
  } catch (error) {
    console.error("Error deleting recipe and interactions:", error);
    throw error;
  }
};