import { doc, getDoc, collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../firebase/config";
import { ExamData } from "../app/components/examComponent";

export async function fetchExamData(examId: string): Promise<ExamData> {
  const examDocRef = doc(db, "exams", examId);
  const examDocSnap = await getDoc(examDocRef);

  if (!examDocSnap.exists()) {
    throw new Error("Exam not found");
  }

  const docData = examDocSnap.data() as DocumentData;

  const questionsRef = collection(db, "exams", examId, "questions");
  const questionsSnap = await getDocs(questionsRef);

  const questions = questionsSnap.docs.map((questionDoc) => {
    const qData = questionDoc.data();
    return {
      questionText: qData.questionText || "",
      options: qData.options || [],
      correctChoice: qData.correctChoice ?? 0,
    };
  });

  return {
    examId: docData.examId || examId,
    questions,
  };
}
