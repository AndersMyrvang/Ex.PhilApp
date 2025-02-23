"use client";

import React from "react";
import styles from "./home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <h2 className={styles.subtitle}>Discover, Share, and Connect</h2>
          <p className={styles.description}>
            ExPhil is a platform for sharing your ideas and connecting with like-minded people.
          </p>
          <button className={styles.ctaButton}>Get Started</button>
        </section>
      </main>
    </div>
  );
}
