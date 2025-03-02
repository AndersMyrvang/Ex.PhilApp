// components/examComponent.tsx
import React, { useState } from 'react';
import styles from './examComponent.module.css';

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
}

const ExamComponent: React.FC<ExamComponentProps> = ({ examData }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const handleOptionClick = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  // If questions is undefined or empty, render a fallback
  if (!examData.questions || examData.questions.length === 0) {
    return <div className={styles.examContainer}>No questions available for this exam.</div>;
  }

  return (
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
                  className={`${styles.option} ${selected === i ? styles.selected : ''}`}
                  onClick={() => handleOptionClick(index, i)}
                >
                  {option}
                </li>
              ))}
            </ul>
            {selected !== undefined && (
              <p className={selected === question.correctChoice ? styles.correct : styles.incorrect}>
                {selected === question.correctChoice
                  ? 'Correct!'
                  : `Incorrect. Correct answer: ${question.options[question.correctChoice]}`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ExamComponent;
