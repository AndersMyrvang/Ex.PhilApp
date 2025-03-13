import { collection, addDoc, query, where, orderBy, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// Function to submit a complete exam attempt
export async function submitExamResult(
  userId: string,
  examId: string,
  correctCount: number,
  totalQuestions: number,
  answers: number[]
): Promise<void> {
  // Create a new document in the "results" collection with a new id.
  await addDoc(collection(db, "results"), {
    userId: userId ?? "anonymous",
    examId,
    correctCount,
    totalQuestions,
    answers, // include the user's answers
    temporary: false, // flag to indicate this is a final submission
    timestamp: new Date().toISOString(),
  });

  // After submitting the final result, delete temporary saves for the same userId and examId.
  await deleteTempSaves(userId, examId);
}

// Function to save temporary exam progress
export async function saveExamProgress(
  userId: string,
  examId: string,
  answers: number[],
  currentQuestionIndex: number
): Promise<void> {
  // Save progress with a flag so you can differentiate it later.
  await addDoc(collection(db, "results"), {
    userId: userId ?? "anonymous",
    examId,
    answers, // possibly a partial list
    currentQuestionIndex, // where the user left off
    temporary: true, // flag to indicate this is a temporary save
    timestamp: new Date().toISOString(),
  });
}

export async function fetchTempExamResult(
  userId: string,
  examId: string
): Promise<{ answers: number[]; currentQuestionIndex: number } | null> {
  const q = query(
    collection(db, "results"),
    where("userId", "==", userId),
    where("examId", "==", examId),
    where("temporary", "==", true),
    orderBy("timestamp", "desc")
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    // Get the most recent temporary save
    const docSnapshot = querySnapshot.docs[0];
    const data = docSnapshot.data();
    return {
      answers: data.answers || [],
      currentQuestionIndex: data.currentQuestionIndex || 0,
    };
  }
  return null;
}

// Helper function to delete temporary saves
async function deleteTempSaves(userId: string, examId: string): Promise<void> {
  const tempQuery = query(
    collection(db, "results"),
    where("userId", "==", userId),
    where("examId", "==", examId),
    where("temporary", "==", true)
  );
  const querySnapshot = await getDocs(tempQuery);
  const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}
