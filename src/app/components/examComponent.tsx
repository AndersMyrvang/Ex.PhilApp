import React, { useState, useEffect } from "react";
import styles from "./examComponent.module.css";
import { usePathname } from "next/navigation";
import { submitExamResult, saveExamProgress, fetchTempExamResult } from "../../utils/examResults";

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
    case "/eksamen5":
      return "Eksamen 5";
    default:
      return "Unknown Exam";
  }
}

const ExamComponent: React.FC<ExamComponentProps> = ({ examData, userId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | undefined)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // On component mount, check for a temporary save and normalize padded answers (-1 -> undefined)
  useEffect(() => {
    const loadTempSave = async () => {
      const uid = userId ?? "anonymous";
      const tempData = await fetchTempExamResult(uid, examData.examId);
      if (tempData) {
        const normalizedAnswers = tempData.answers.map((ans: number) =>
          ans === -1 ? undefined : ans
        );
        setSelectedAnswers(normalizedAnswers);
        setCurrentQuestionIndex(tempData.currentQuestionIndex);
      }
    };
    loadTempSave();
  }, [userId, examData.examId]);

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

  // Submit the exam and store the result as a final attempt
  const handleSubmit = async () => {
    const correctCount = calculateScore();
    setScore(correctCount);
    setSubmitted(true);

    await submitExamResult(
      userId ?? "anonymous",
      examData.examId,
      correctCount,
      examData.questions.length,
      // For final submission, no need to pad answers if you prefer.
      selectedAnswers.map(ans => ans === undefined ? -1 : ans)
    );
  };

  // Save temporary progress so the user can return later
  const handleTemporarySave = async () => {
    // Pad answers with -1 for unanswered questions.
    const paddedAnswers = examData.questions.map((_, i) =>
      selectedAnswers[i] !== undefined ? selectedAnswers[i]! : -1
    );
    await saveExamProgress(
      userId ?? "anonymous",
      examData.examId,
      paddedAnswers,
      currentQuestionIndex
    );
    window.location.href = "/";
  };

  // Navigation: previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Navigation: next question
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

  const pathname = usePathname();
  const currentQuestion = examData.questions[currentQuestionIndex];
  // Since we've normalized, selected will be undefined if not answered.
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
                className={`${styles.option} ${selected === i ? styles.selected : ""}`}
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
                : `Incorrect. Correct answer: ${currentQuestion.options[currentQuestion.correctChoice]}`}
            </p>
          )}
        </div>

        {/* Navigation Buttons */}
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
            const isAnswered =
              selectedAnswers[index] !== undefined && selectedAnswers[index] !== -1;
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

        {/* Submit button, Temporary Save button and Score display */}
        <div className={styles.buttonContainer}>
          {!submitted && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button onClick={handleTemporarySave} className={styles.tempSubmitButton}>
                  Lagre midlertidig
                </button>
                <button onClick={handleSubmit} className={styles.submitButton}>
                  Fullfør eksamen
                </button>
              </div>
            </>
          )}
          {submitted && (
            <div style={{ marginTop: "20px" }}>
              <p>
                Du fikk {score} av {examData.questions.length} riktige.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamComponent;
