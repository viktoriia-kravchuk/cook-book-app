import { Timestamp } from "firebase/firestore";

export type Recipe = {
  id?: string;
  title: string;
  description: string;
  instructions: string;
  category: string;
  user_id: string;
  created_at?: Timestamp;
};