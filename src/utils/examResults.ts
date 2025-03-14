import { collection, addDoc, query, where, orderBy, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export async function submitExamResult(
  userId: string,
  examId: string,
  correctCount: number,
  totalQuestions: number,
  answers: number[]
): Promise<void> {
  await addDoc(collection(db, "results"), {
    userId: userId ?? "anonymous",
    examId,
    correctCount,
    totalQuestions,
    answers,
    temporary: false,
    timestamp: new Date().toISOString(),
  });
  await deleteTempSaves(userId, examId);
}

export async function saveExamProgress(
  userId: string,
  examId: string,
  answers: number[],
  currentQuestionIndex: number
): Promise<void> {
  await addDoc(collection(db, "results"), {
    userId: userId ?? "anonymous",
    examId,
    answers,
    currentQuestionIndex,
    temporary: true,
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
    const docSnapshot = querySnapshot.docs[0];
    const data = docSnapshot.data();
    return {
      answers: data.answers || [],
      currentQuestionIndex: data.currentQuestionIndex || 0,
    };
  }
  return null;
}

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
