import { Timestamp } from "firebase/firestore";

export type Recipe = {
  id?: string;
  title: string;
  description: string;
  instructions: string;
  category: string;
  user_id: string;
  created_at?: Timestamp;
  imageUrl?: string;
  likes?: number;
  saves?: number;
  isLiked?: boolean; 
  isSaved?: boolean; 
};

export type RecipeCategory = "breakfast" | "lunch" | "dinner" | "snack" | "dessert" | "drink";
