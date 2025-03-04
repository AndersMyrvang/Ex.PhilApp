// examComponent.tsx
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./examComponent.module.css";
import { usePathname } from "next/navigation";


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
  userId?: string;
}

const pathname = usePathname();

function getExamTitle(pathname: string): string {
  switch (pathname) {
    case "/eksamen1":
      return "Eksamen 1";
    case "/eksamen2":
      return "Eksamen 2";
    case "/eksamen3":
      return "Eksamen 3";
    case "/eksamen4":
      return "Eksamen 4";
    default:
      return "Unknown Exam";
  }
}

const ExamComponent: React.FC<ExamComponentProps> = ({ examData, userId }) => {
  // Keep track of the current question being displayed
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Helper to handle selecting an option
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

  // Navigation: go to previous question (if possible)
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Navigation: go to next question (if possible)
  const handleNextQuestion = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Navigation: jump to a specific question
  const handleQuestionNumberClick = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (!examData.questions || examData.questions.length === 0) {
    return (
      <div className={styles.examContainer}>
        No questions available for this exam.
      </div>
    );
  }

  

  const currentQuestion = examData.questions[currentQuestionIndex];
  const selected = selectedAnswers[currentQuestionIndex];
  const pageTitle = getExamTitle(pathname);


  return (
    <div className={styles.backgroundExam}>
      <div className={styles.examContainer}>
        <h1>{pageTitle}:</h1>

        <div className={styles.question}>
          <p className={styles.questionText}>
            Question {currentQuestionIndex + 1} of {examData.questions.length}
          </p>
          <p className={styles.questionText}>{currentQuestion.questionText}</p>
          <ul className={styles.optionsList}>
            {currentQuestion.options.map((option, i) => (
              <li
                key={i}
                className={`${styles.option} ${selected === i ? styles.selected : ""
                  }`}
                onClick={() => handleOptionClick(currentQuestionIndex, i)}
              >
                {option}
              </li>
            ))}
          </ul>

          {submitted && selected !== undefined && (
            <p
              className={
                selected === currentQuestion.correctChoice
                  ? styles.correct
                  : styles.incorrect
              }
            >
              {selected === currentQuestion.correctChoice
                ? "Correct!"
                : `Incorrect. Correct answer: ${currentQuestion.options[currentQuestion.correctChoice]
                }`}
            </p>
          )}
        </div>

        {/* Navigation Buttons (Previous / Next) */}
        <div className={styles.navContainer}>
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={styles.navButton}
          >
            &lt; Prev
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === examData.questions.length - 1}
            className={styles.navButton}
          >
            Next &gt;
          </button>
        </div>

        {/* Numbered question buttons */}
        <div className={styles.questionNumbers}>
          {examData.questions.map((_, index) => {
            const isAnswered = selectedAnswers[index] !== undefined;
            return (
              <button
                key={index}
                onClick={() => handleQuestionNumberClick(index)}
                className={`
        ${styles.questionNumberButton}
        ${isAnswered ? styles.answeredQuestion : ""}
        ${currentQuestionIndex === index ? styles.activeQuestion : ""}
      `}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

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
