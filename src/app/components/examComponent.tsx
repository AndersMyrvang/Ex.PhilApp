// examComponent.tsx
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./examComponent.module.css";

export interface Question {
  questionText: string;
  options: string[];
  correctChoice: number;
}

export interface ExamData {
  examId: string;
  questions: Question[];
}

interface ExamComponentProps {
  examData: ExamData;
  userId?: string; // Om du har brukere
}

const ExamComponent: React.FC<ExamComponentProps> = ({ examData, userId }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleOptionClick = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  // Calculate how many answers are correct
  const calculateScore = () => {
    let correctCount = 0;
    examData.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctChoice) {
        correctCount++;
      }
    });
    return correctCount;
  };

  // Submit the exam and store the result
  const handleSubmit = async () => {
    const correctCount = calculateScore();
    setScore(correctCount);
    setSubmitted(true);

    const docId = `${userId ?? "anonymous"}_${examData.examId}`;
    const resultDocRef = doc(db, "results", docId);

    await setDoc(resultDocRef, {
      userId: userId ?? "anonymous",
      examId: examData.examId,
      correctCount,
      totalQuestions: examData.questions.length,
      timestamp: new Date().toISOString(),
    });
  };

  if (!examData.questions || examData.questions.length === 0) {
    return (
      <div className={styles.examContainer}>
        No questions available for this exam.
      </div>
    );
  }

  return (
    <div className={styles.backgroundExam}>
      <div className={styles.examContainer}>
        <h1>Exam: {examData.examId}</h1>
        {examData.questions.map((question, index) => {
          const selected = selectedAnswers[index];
          return (
            <div key={index} className={styles.question}>
              <p className={styles.questionText}>{question.questionText}</p>
              <ul className={styles.optionsList}>
                {question.options.map((option, i) => (
                  <li
                    key={i}
                    className={`${styles.option} ${
                      selected === i ? styles.selected : ""
                    }`}
                    onClick={() => handleOptionClick(index, i)}
                  >
                    {option}
                  </li>
                ))}
              </ul>

              {/* Show feedback only AFTER submission */}
              {submitted && selected !== undefined && (
                <p
                  className={
                    selected === question.correctChoice
                      ? styles.correct
                      : styles.incorrect
                  }
                >
                  {selected === question.correctChoice
                    ? "Correct!"
                    : `Incorrect. Correct answer: ${question.options[question.correctChoice]}`}
                </p>
              )}
            </div>
          );
        })}

        {/* Submit button / Score display */}
        {!submitted ? (
          <button onClick={handleSubmit} className={styles.submitButton}>
            Fullfør eksamen
          </button>
        ) : (
          <div style={{ marginTop: "20px" }}>
            <p>
              Du fikk {score} av {examData.questions.length} riktige.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamComponent;
