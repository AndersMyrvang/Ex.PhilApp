"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config"; // path to your config
import styles from "./flashcard.module.css";

interface Card {
  id: string;
  question: string;
  answer: string;
}

const FlashcardsPage: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch cards from Firestore on mount
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const snapshot = await getDocs(collection(db, "flashcards"));
        // Map docs to your local structure
        const fetchedCards: Card[] = snapshot.docs.map((doc) => {
          const data = doc.data() as {
            term?: string;
            definition?: string;
          };
          return {
            id: doc.id,
            question: data.term || "No question found",
            answer: data.definition || "No answer found",
          };
        });
        setCards(fetchedCards);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToCard = (index: number) => {
    setFlipped(false);
    setCurrentIndex(index);
  };

  // Early return if still loading or no cards
  if (loading) {
    return <p className={styles.loading}>Loading flashcards...</p>;
  }

  if (cards.length === 0) {
    return <p className={styles.noCards}>No flashcards found.</p>;
  }

  const currentCard = cards[currentIndex];

  return (
    <div className={styles.backgroundFlashcards}>
      <div className={styles.cardsContainer}>
        <h1 className={styles.title}>Flashcards</h1>

        <div className={styles.cardNav}>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={styles.navButton}
          >
            &lt; Prev
          </button>
          <div className={styles.pageNumbers}>
            {cards.map((_, index) => (
              <div
                key={index}
                className={
                  index === currentIndex
                    ? `${styles.pageNumber} ${styles.activePage}`
                    : styles.pageNumber
                }
                onClick={() => goToCard(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className={styles.navButton}
          >
            Next &gt;
          </button>
        </div>

        <div className={styles.flashcardWrapper}>
          <div
            className={`${styles.card} ${flipped ? styles.flipped : ""}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className={styles.front}>
              <p>{currentCard.question}</p>
            </div>
            <div className={styles.back}>
              <p>{currentCard.answer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;
