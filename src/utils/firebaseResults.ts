import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export interface Result {
  userId: string;
  examId: string;
  correctCount: number;
  totalQuestions: number;
  timestamp: string;
}

export async function getUserResults(userId: string): Promise<Result[]> {
  try {
    const q = query(
      collection(db, "results"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const results: Result[] = snapshot.docs.map((docSnap) => docSnap.data() as Result);
    return results;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
}
