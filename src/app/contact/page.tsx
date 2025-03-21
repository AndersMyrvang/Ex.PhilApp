import React from 'react';
import styles from './contact.module.css';

const AboutPage: React.FC = () => {
  return (
    <div className={styles.aboutPage}>
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutTitle}>Kontakt meg</h1>
      <p className={styles.aboutText}>
        Mail: <a href="mailto:anders.myrvang@gmail.com" className={styles.mail}>anders.myrvang@gmail.com</a>
      </p>
    </div>
    </div>
  );
};

export default AboutPage;
