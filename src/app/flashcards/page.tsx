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

  // For the text input that specifies which card to jump to
  // We'll keep track of whatever the user types, but also sync
  // it to the current card number on Next/Prev or initial load
  const [desiredCard, setDesiredCard] = useState("");

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const snapshot = await getDocs(collection(db, "flashcards"));
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

  // Whenever currentIndex changes, update the input to match the (index + 1)
  useEffect(() => {
    setDesiredCard(String(currentIndex + 1));
  }, [currentIndex]);

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

  // Called when user presses "Enter" or clicks a "Go" button
  const handleJump = () => {
    const index = parseInt(desiredCard, 10);
    if (!isNaN(index)) {
      // We store pages from 1..N in user-facing, but internally it's 0..N-1
      const newIndex = index - 1;
      // Validate range
      if (newIndex >= 0 && newIndex < cards.length) {
        setFlipped(false);
        setCurrentIndex(newIndex);
      } else {
        alert(`Please enter a number between 1 and ${cards.length}`);
      }
    } else {
      alert("Please enter a valid number");
    }
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

        {/* Navigation area */}
        <div className={styles.cardNav}>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={styles.navButton}
          >
            &lt; Prev
          </button>

          <div className={styles.goToContainer}>
            <input
              type="number"
              min={1}
              max={cards.length}
              value={desiredCard}
              onChange={(e) => setDesiredCard(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleJump();
                }
              }}
              className={styles.inputNumber}
            />
            <span className={styles.separator}> / {cards.length}</span>
            <button onClick={handleJump} className={styles.goButton}>
              Go
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className={styles.navButton}
          >
            Next &gt;
          </button>
        </div>

        {/* The actual flashcard */}
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
