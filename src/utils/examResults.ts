import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export async function submitExamResult(
  userId: string,
  examId: string,
  correctCount: number,
  totalQuestions: number
): Promise<void> {
  const docId = `${userId ?? "anonymous"}_${examId}`;
  const resultDocRef = doc(db, "results", docId);

  await setDoc(resultDocRef, {
    userId: userId ?? "anonymous",
    examId,
    correctCount,
    totalQuestions,
    timestamp: new Date().toISOString(),
  });
}
