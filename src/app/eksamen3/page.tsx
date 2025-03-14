"use client";

import React, { useState, useEffect } from "react";
import ExamComponent, { ExamData } from "../components/examComponent";
import styles from "../eksamen1/eksamen1.module.css";
import { db, auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { fetchExamData } from "../../utils/fetchExamData";

const Eksamen1Page: React.FC = () => {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const examId = "exam_3";

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
    const loadExam = async () => {
      try {
        const fetchedExam = await fetchExamData(examId);
        setExamData(fetchedExam);
      } catch (err: any) {
        setError("Error fetching exam: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadExam();
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
