// eksamen1/page.tsx
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
import { db, auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const Eksamen1Page: React.FC = () => {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const examId = "exam_1";

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const examDocRef = doc(db, "exams", examId);
        const examDocSnap = await getDoc(examDocRef);

        if (!examDocSnap.exists()) {
          setError("Exam not found");
          setLoading(false);
          return;
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

  if (!userId) {
    return <div className={styles.error}>Please log in to take the exam.</div>;
  }

  return (
    <div className={styles.pageContainer}>
      {examData && <ExamComponent examData={examData} userId={userId} />}
    </div>
  );
};

export default Eksamen1Page;
