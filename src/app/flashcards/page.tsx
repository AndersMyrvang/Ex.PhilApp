"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./flashcard.module.css";

interface Card {
  id: string;
  question: string;
  answer: string;
}

// Hovedkomponent for Flashcards-siden
const FlashcardsPage: React.FC = () => {
  // Definerer tilstander for kort, indeks, om kortet er flippet, lastestatus og ønsket kortnummer
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [desiredCard, setDesiredCard] = useState("");

  // Effekt for å hente flashcards fra databasen
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

  // Effekt for å oppdatere ønsket kortnummer basert på den nåværende indeksen
  useEffect(() => {
    setDesiredCard(String(currentIndex + 1));
  }, [currentIndex]);

  // Effekt for å legge til tastatur-hendelser for navigasjon og flippe kort
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorerer tastaturhendelser for input-felt
      if ((e.target as HTMLElement).tagName === "INPUT") return;

      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((prev) => !prev);
      } else if (e.code === "ArrowLeft") {
        handlePrev();
      } else if (e.code === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, cards]);

  // Funksjon for å vise forrige kort
  const handlePrev = () => {
    if (currentIndex > 0) {
      setFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Funksjon for å vise neste kort
  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Funksjon for å hoppe til et spesifikt kort basert på brukerinput
  const handleJump = () => {
    const index = parseInt(desiredCard, 10);
    if (!isNaN(index)) {
      const newIndex = index - 1;
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

  // Viser lastemelding mens data hentes
  if (loading) {
    return <p className={styles.loading}>Loading flashcards...</p>;
  }

  // Viser melding hvis ingen flashcards er funnet
  if (cards.length === 0) {
    return <p className={styles.noCards}>No flashcards found.</p>;
  }

  // Henter det nåværende kortet basert på indeksen
  const currentCard = cards[currentIndex];

  // Renderer flashcard-UI, inkludert navigasjonsknapper og flippefunksjonalitet
  return (
    <div className={styles.backgroundFlashcards}>
      <div className={styles.cardsContainer}>
        <h1 className={styles.title}>Flashcards</h1>

        <div className={styles.cardNav}>
          {/* Knapp for å gå til forrige kort */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={styles.navButton}
          >
            &lt; Prev
          </button>

          {/* Inndata for å hoppe til et spesifikt kort */}
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

          {/* Knapp for å gå til neste kort */}
          <button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className={styles.navButton}
          >
            Next &gt;
          </button>
        </div>

        {/* Flashcard visning med flippe-effekt */}
        <div className={styles.flashcardWrapper}>
          <div className={`${styles.card} ${flipped ? styles.flipped : ""}`} onClick={() => setFlipped(!flipped)}>
            <div className={styles.front}>
              <div className={styles.cardContent}>
                <p>{currentCard.question}</p>
              </div>
            </div>
            <div className={styles.back}>
              <div className={styles.cardContent}>
                <p>{currentCard.answer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;
