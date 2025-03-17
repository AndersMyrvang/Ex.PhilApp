"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import styles from "./home.module.css";
import { subscribeToAuthState } from "@/utils/firebaseAuth";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const isLoggedIn = Boolean(user);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <h1>Velkommen til Ex.Phil eksamensøving</h1>
          <p>Ikke gidd å stryke</p>
        </div>
      </header>

      <section className={styles.featuresSection}>
        <div
          className={styles.featureCard}
          onClick={() => router.push("/login")}
        >
          <h2>Lag en bruker</h2>
          <p>
            Lag en bruker/logg på for å ta eksamener.
          </p>
        </div>
        {isLoggedIn ? (
          <div
            className={styles.featureCard}
            onClick={() => router.push("/flashcards")}
          >
            <h2>Ta flashcards for å lære</h2>
            <p>
              Kjedelig å få lav score.
            </p>
          </div>
        ) : (
          <div
            className={styles.featureCard}
            onClick={() =>
              alert("Du må logge inn for å ta flashcards.")
            }
          >
            <h2>Ta flashcards for å lære</h2>
            <p>
              Kjedelig å få lav score.
            </p>
          </div>
        )}
        {isLoggedIn ? (
          <div
            className={styles.featureCard}
            onClick={() =>
              router.push(`/eksamen${Math.floor(Math.random() * 5) + 1}`)
            }
          >
            <h2>Start en eksamen</h2>
            <p>
              Prøv lykken med en tilfeldig eksamen.
            </p>
          </div>
        ) : (
          <div
            className={styles.featureCard}
            onClick={() =>
              alert("Du må logge inn for å ta en eksamen.")
            }
          >
            <h2>Start en eksamen</h2>
            <p>
              Prøv lykken med en tilfeldig eksamen.
            </p>
          </div>
        )}
        {isLoggedIn ? (
          <div
            className={styles.featureCard}
            onClick={() => router.push("/results")}
          >
            <h2>Følg progresjonen din</h2>
            <p>
              Se hvor langt du har kommet i eksamensøvingen med vår progresjonsbar.
            </p>
          </div>
        ) : (
          <div
            className={styles.featureCard}
            onClick={() =>
              alert("Du må logge inn for å se progresjonen din.")
            }
          >
            <h2>Følg progresjonen din</h2>
            <p>
              Se hvor langt du har kommet i eksamensøvingen med vår progresjonsbar.
            </p>
          </div>
        )}

      </section>
    </div>
  );
}
