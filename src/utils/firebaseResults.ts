import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export interface Result {
  id: string; // add id field
  userId: string;
  examId: string;
  correctCount: number;
  totalQuestions: number;
  answers: number[]; // make sure to store answers from the final submission
  timestamp: string;
}

export async function getUserResults(userId: string): Promise<Result[]> {
  try {
    const q = query(
      collection(db, "results"),
      where("userId", "==", userId),
      where("temporary", "==", false) // show only final submissions
    );
    const snapshot = await getDocs(q);
    const results: Result[] = snapshot.docs.map((docSnap) => {
      return { ...(docSnap.data() as Omit<Result, 'id'>), id: docSnap.id };
    });
    return results;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
}
