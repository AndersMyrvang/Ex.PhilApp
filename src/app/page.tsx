"use client";

import React from "react";
import Link from "next/link";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <div className={styles.pageWrapper}>

      <header className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <h1>Velkommen til Ex.Phil eksamensøving</h1>
          <p>Ikke gidd å stryk.</p>
        </div>
      </header>

      <section className={styles.featuresSection}>
        <div className={styles.featureCard}>
          <h2>Lag en bruker</h2>
          <p>
            Lag en bruker/logg på for å ta eksamener.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h2>Følg progresjonen din</h2>
          <p>
            Se hvor langt du har kommet i eksamensøvingen med vår progresjonsbar.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h2>Prøv å få C eller bedre</h2>
          <p>
            Kjedelig å få dårlige karakterer.
          </p>
        </div>
      </section>
    </div>
  );
}
