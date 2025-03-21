"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { loadAnalytics } from "../firebase/config"; // Pass på at stien er korrekt


const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent === null) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = async () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
    try {
      await loadAnalytics();
    } catch (err) {
      console.error("Feil ved lasting av Firebase Analytics:", err);
    }
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "false");
    setVisible(false);
    // Eventuelle andre tjenester som benytter cookies, kan deaktiveres her
  };

  if (!visible) return null;

  return (
    <div style={styles.container}>
      <p>
        Vi bruker cookies for å forbedre din opplevelse, gi deg personlige tilpasninger og for statistikk.
        Les mer i vår <Link href="/cookiePolicy">cookie-policy</Link>.
      </p>
      <div>
        <button onClick={acceptCookies} style={styles.accept}>Aksepter</button>
        <button onClick={declineCookies} style={styles.decline}>Avslå</button>
      </div>
    </div>
  );
};

const styles: { 
  container: React.CSSProperties; 
  accept: React.CSSProperties; 
  decline: React.CSSProperties;
} = {
  container: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#333",
    color: "#fff",
    padding: "20px",
    textAlign: "center",
    zIndex: 1000,
  },
  accept: {
    margin: "5px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  decline: {
    margin: "5px",
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default CookieConsent;
