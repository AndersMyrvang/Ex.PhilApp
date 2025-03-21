import React from 'react';
import styles from './about.module.css';

const AboutPage: React.FC = () => {
  return (
    <div className={styles.aboutPage}>
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutTitle}>Om prosjektet mitt</h1>
      <p className={styles.aboutText}>
        Dette prosjektet er først og fremst laget som et prosjekt for koding, så informasjonen er ikke hovedinnholdet.
      </p>
      <p className={styles.aboutText}>
        Det vil si at jeg ikke har noen beståttgaranti eller lignende, hvis du velger å ta i bruk appen.
      </p>
    </div>
    </div>
  );
};

export default AboutPage;
