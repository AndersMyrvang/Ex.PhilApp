"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Åpne/lukke drop-down
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Lytt på endringer i innlogget bruker (Firebase)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Ruting til profilside
  const routeProfile = async () => {
    try {
      router.push("/profile");
    } catch (error) {
      console.error("Feil ved routing til profile:", error);
    }
  };

  // Ruting til innloggingsside
  const handleLogin = async () => {
    try {
      router.push("/login");
    } catch (error) {
      console.error("Feil ved innlogging:", error);
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        
        {/* Venstre: Hjem-knapp */}
        <div className={styles.left}>
          <Link href="/">
            <span className={styles.homeButton}>Hjem</span>
          </Link>
        </div>

        {/* Midten: Drop-down med eksamener */}
        <div className={styles.middle}>
          <div className={styles.dropdown}>
            <button onClick={toggleDropdown} className={styles.dropdownButton}>
              Eksamener
            </button>
            {isDropdownOpen && (
              <ul className={styles.dropdownMenu}>
                <li>
                  <Link href="/eksamen1">Eksamen 1</Link>
                </li>
                <li>
                  <Link href="/eksamen2">Eksamen 2</Link>
                </li>
                <li>
                  <Link href="/eksamen3">Eksamen 3</Link>
                </li>
                {/* Legg til flere eksamensider etter behov */}
              </ul>
            )}
          </div>
        </div>

        {/* Høyre: Profil- eller innloggingsknapp */}
        <div className={styles.right}>
          {user ? (
            <button onClick={routeProfile} className={styles.profileButton}>
              Profile
            </button>
          ) : (
            <button onClick={handleLogin} className={styles.profileButton}>
              Logg inn
            </button>
          )}
        </div>

      </nav>
    </header>
  );
}
