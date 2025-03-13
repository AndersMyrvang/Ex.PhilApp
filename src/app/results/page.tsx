"use client";

import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./results.module.css";
import { getUserResults, Result } from "../../utils/firebaseResults";

const ResultaterPage: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

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
    const fetchResults = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const fetchedResults = await getUserResults(userId);
        setResults(fetchedResults);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [userId]);

  if (loading) {
    return <p className={styles.loading}>Laster resultater...</p>;
  }

  if (!userId) {
    return <p className={styles.error}>Vennligst logg inn for å se dine resultater.</p>;
  }

  if (results.length === 0) {
    return <p className={styles.noResults}>Ingen resultater funnet.</p>;
  }

  return (
    <div className={styles.backgroundExam}>
      <div className={styles.resultsContainer}>
        <h1 className={styles.title}>Dine resultater</h1>
        <ul className={styles.resultsList}>
          {results.map((res) => (
            <li
              key={res.id}
              className={styles.resultItem}
              onClick={() => router.push(`/results/${res.id}`)}
              style={{ cursor: "pointer" }}
            >
              <p>
                <strong>Eksamens-ID:</strong> {res.examId}
              </p>
              <p>
                <strong>Riktige svar:</strong> {res.correctCount} / {res.totalQuestions}
              </p>
              <p>
                <strong>Dato:</strong>{" "}
                {new Date(res.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultaterPage;
