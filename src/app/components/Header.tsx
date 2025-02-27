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

  // Toggle dropdown only if user is logged in
  const toggleDropdown = () => {
    if (!user) {
      alert("du må logge inn for å ta eksamener");
      return;
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Listen for auth state changes (Firebase)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Route to profile page
  const routeProfile = async () => {
    try {
      router.push("/profile");
    } catch (error) {
      console.error("Feil ved routing til profile:", error);
    }
  };

  // Route to login page
  const routeLogin = async () => {
    try {
      router.push("/");
    } catch (error) {
      console.error("Feil ved innlogging:", error);
    }
  };

   // Route to home page
   const routeHome = async () => {
    try {
      router.push("/home");
    } catch (error) {
      console.error("Feil ved innlogging:", error);
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Left: Home button */}
        <div className={styles.left}>
        <button onClick={routeHome} className={styles.profileButton}>
              Hjem
            </button>
        </div>

        {/* Middle: Dropdown for exams */}
        <div className={styles.middle}>
          <div className={styles.dropdown}>
            <button onClick={toggleDropdown} className={styles.profileButton}>
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
                {/* Add more exam pages as needed */}
              </ul>
            )}
          </div>
        </div>

        {/* Right: Profile or login button */}
        <div className={styles.right}>
          {user ? (
            <button onClick={routeProfile} className={styles.profileButton}>
              Profile
            </button>
          ) : (
            <button onClick={routeLogin} className={styles.profileButton}>
              Logg inn
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
