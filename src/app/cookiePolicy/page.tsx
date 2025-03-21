import React from 'react';
import styles from './cookie.module.css';

const AboutPage: React.FC = () => {
  return (
    <div className={styles.aboutPage}>
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutTitle}>Cookie policy</h1>
      <p className={styles.aboutText}>
        Hvis du aksepterer cookies, bruker vi kun den informasjonen som samles inn for Google Analytics i Firebase. Denne dataen gjør oss i stand til å se hvor mye av appen som blir brukt, slik at vi kan forbedre opplevelsen din.
      </p>
    </div>
    </div>
  );
};

export default AboutPage;
