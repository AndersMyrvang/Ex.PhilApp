"use client";

import React, { useState, useEffect } from "react";
import ExamComponent, { ExamData } from "../components/examComponent";
import styles from "./eksamen1.module.css";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const Eksamen1Page: React.FC = () => {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The ID of the main exam document in the "exams" collection
  const examId = "exam_1";

  useEffect(() => {
    const fetchExam = async () => {
      try {
        // 1) Fetch the main exam document
        const examDocRef = doc(db, "exams", examId);
        const examDocSnap = await getDoc(examDocRef);

        if (!examDocSnap.exists()) {
          setError("Exam not found");
          setLoading(false);
          return;
        }

        // This might contain fields like examId or examName
        const docData = examDocSnap.data() as DocumentData;

        // 2) Fetch the "questions" subcollection
        const questionsRef = collection(db, "exams", examId, "questions");
        const questionsSnap = await getDocs(questionsRef);

        // 3) Map each subcollection document into a Question object
        const questions = questionsSnap.docs.map((questionDoc) => {
          const qData = questionDoc.data();
          return {
            questionText: qData.questionText || "",
            // Use the "options" array directly
            options: qData.options || [],
            correctChoice: qData.correctChoice ?? 0,
          };
        });

        // 4) Build the ExamData object
        const combinedExamData: ExamData = {
          examId: docData.examId || examId,
          questions,
        };

        setExamData(combinedExamData);
      } catch (err: any) {
        setError("Error fetching exam: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading exam...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      {examData && <ExamComponent examData={examData} />}
    </div>
  );
};

export default Eksamen1Page;
