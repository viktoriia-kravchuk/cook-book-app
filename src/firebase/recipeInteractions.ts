import {
    getFirestore,
    collection,
    getDoc,
    runTransaction,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    increment,
  } from "firebase/firestore";
  
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
      const collectionName = action === "like" || action === "unlike" ? COLLECTIONS.likes : COLLECTIONS.saves;
      const recipeRef = doc(firestore, collectionName, `${userId}_${recipeId}`);
  
      if (action === "unlike" || action === "unsave") {
        await deleteDoc(recipeRef);
      } else {
        const data = { userId, recipeId, [action === "like" ? "liked" : "saved"]: true };
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
  
  export const updateRecipeLikes = async (recipeId: string, incrementValue: number) => {
    await performUpdateRecipe("likes", recipeId, incrementValue);
  };
  
  export const updateRecipeSaves = async (recipeId: string, incrementValue: number) => {
    await performUpdateRecipe("saves", recipeId, incrementValue);
  };

  const performUpdateRecipe = async (collectionName: string, recipeId: string, incrementValue: number) => {
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

export const checkUserInteraction = async (userId: string, recipeId: string, collectionName: string): Promise<boolean> => {
    try {
      const firestore = getFirestore();
      const interactionRef = doc(firestore, collectionName, `${userId}_${recipeId}`);
      const snapshot = await getDoc(interactionRef);
      return snapshot.exists();
    } catch (error) {
      console.error(`Error checking user interaction for ${collectionName}:`, error);
      throw error;
    }
  };
  