"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import styles from "../results.module.css";

import { fetchExamData } from "../../../utils/fetchExamData";

interface Question {
    questionText: string;
    options: string[];
    correctChoice: number;
}

interface ExamData {
    examId: string;
    questions: Question[];
}

interface ResultDetail {
    id: string;
    userId: string;
    examId: string;
    correctCount: number;
    totalQuestions: number;
    answers: number[];
    timestamp: string;
}

const ResultDetailPage: React.FC = () => {
    const params = useParams() as { resultId: string };
    const [result, setResult] = useState<ResultDetail | null>(null);
    const [examData, setExamData] = useState<ExamData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResultDetail = async () => {
            try {
                const docRef = doc(db, "results", params.resultId);
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    console.error("No such result document!");
                    setLoading(false);
                    return;
                }

                const data = docSnap.data() as Omit<ResultDetail, "id">;
                const newResult: ResultDetail = {
                    id: docSnap.id,
                    ...data,
                };
                setResult(newResult);

                const fetchedExamData = await fetchExamData(newResult.examId);
                setExamData(fetchedExamData);
            } catch (error) {
                console.error("Error fetching result detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResultDetail();
    }, [params.resultId]);

    if (loading) {
        return <p className={styles.loading}>Laster detaljert resultat...</p>;
    }

    if (!result || !examData) {
        return <p className={styles.error}>Kunne ikke finne resultatdetaljer.</p>;
    }

    return (
        <div className={styles.backgroundExam}>
            <div className={styles.resultsIdContainer}>
                <h1 className={styles.title}>Resultat for {result.examId}</h1>
                <p className={styles.subTitle}>
                    <strong>Riktige svar:</strong> {result.correctCount} / {result.totalQuestions}
                </p>
                <p className={styles.subTitle}>
                    <strong>Dato:</strong> {new Date(result.timestamp).toLocaleString()}
                </p>
                <h2 className={styles.subTitle}>Detaljer</h2>
                <ul className={styles.resultsList}>
                    {examData.questions.map((q, index) => {
                        const userAnswer = result.answers[index] === -1 ? null : result.answers[index];
                        const isCorrect = userAnswer === q.correctChoice;
                        return (
                            <li key={index} className={styles.resultIdItem}>
                                <p>
                                    <strong>Spørsmål {index + 1}:</strong> {q.questionText}
                                </p>
                                <ul>
                                    {q.options.map((option, optIndex) => (
                                        <li
                                            key={optIndex}
                                            style={{ fontWeight: "bold" }}
                                        >
                                            {option}
                                            {userAnswer === optIndex && (
                                                <span style={{ marginLeft: "10px", color: isCorrect ? "green" : "red" }}>
                                                    (Ditt svar)
                                                </span>
                                            )}
                                            {q.correctChoice === optIndex && (
                                                <span className={styles.correctAnswer}>
                                                    (Riktig svar)
                                                </span>
                                            )}

                                        </li>
                                    ))}
                                </ul>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default ResultDetailPage;
