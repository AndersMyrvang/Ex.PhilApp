"use client";

import React, { useState } from "react";
import styles from "./flashcard.module.css";

interface Card {
    id: string;
    question: string;
    answer: string;
}

const FlashcardsPage: React.FC = () => {
    // For now, using local dummy data. Later, you could fetch flashcards from Firebase.
    const [cards] = useState<Card[]>([
        { id: "1", question: "What is the capital of France?", answer: "Paris" },
        { id: "2", question: "What is 2 + 2?", answer: "4" },
        { id: "3", question: "Who wrote '1984'?", answer: "George Orwell" },
        { id: "4", question: "What is the chemical symbol for Gold?", answer: "Au" },
        // Add more cards as needed
    ]);

    // Track which card is currently shown
    const [currentIndex, setCurrentIndex] = useState(0);

    // Handle flipping the current card
    const [flipped, setFlipped] = useState(false);

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
