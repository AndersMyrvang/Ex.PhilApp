"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./Header.module.css";
import { subscribeToAuthState } from "@/utils/firebaseAuth";
import "bootstrap-icons/font/bootstrap-icons.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPageTitle } from "@/utils/getPageTitle";

library.add(fas);

function DarkModeButton() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("darkMode");
      setDarkMode(savedMode === "true");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (typeof window !== "undefined") {
      document.body.classList.toggle("dark-mode", newMode);
      localStorage.setItem("darkMode", newMode.toString());
    }
  };
  
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <button
      className="dark-mode-button"
      onClick={toggleDarkMode}
      aria-label="Toggle Dark Mode"
      style={{ cursor: "pointer" }}
    >
      <FontAwesomeIcon
        icon={darkMode ? "sun" : "moon"}
        style={{ fontSize: "24px", color: darkMode ? "#FFD700" : "#555" }}
      />
    </button>
  );
}

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();
  const pathname = usePathname();

  // Refs for both desktop and mobile dropdowns
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const pageTitle = getPageTitle(pathname);

  const toggleDropdown = () => {
    if (!user) {
      alert("du må logge inn for å ta eksamener");
      return;
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close both dropdowns if click is outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickTarget = event.target as Node;

      // If click is NOT inside desktop dropdown AND NOT inside mobile dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(clickTarget) &&
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(clickTarget)
      ) {
        closeDropdown();
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const routeLogin = async () => {
    try {
      router.push("/login");
    } catch (error) {
      console.error("Feil ved innlogging:", error);
    }
  };

  const routeHome = async () => {
    try {
      router.push("/");
    } catch (error) {
      console.error("Feil ved innlogging:", error);
    }
  };

  const routeResults = async () => {
    if (!user) {
      alert("du må logge inn for å se resultater");
      return;
    }
    try {
      router.push("/results");
    } catch (error) {
      console.error("Feil ved innlogging:", error);
    }
  };

  const routeFlashcards = async () => {
    if (!user) {
      alert("du må logge inn for å ta flashcards");
      return;
    }
    try {
      router.push("/flashcards");
    } catch (error) {
      console.error("Feil ved innlogging:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Left section */}
        <div className={styles.left}>
          <button onClick={routeHome} className={styles.navButton}>
            <i className="bi bi-house"></i>
          </button>
          <span className={styles.pageTitle}>{pageTitle}</span>
        </div>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          <button onClick={routeFlashcards} className={styles.navButton}>
            Flashcards
          </button>
          <div className={styles.dropdown} ref={dropdownRef}>
            <button onClick={toggleDropdown} className={styles.navButton}>
              Eksamener
            </button>
            {isDropdownOpen && (
              <ul className={styles.dropdownMenu}>
                <li>
                  <Link href="/eksamen1" onClick={closeDropdown}>
                    Eksamen 1
                  </Link>
                </li>
                <li>
                  <Link href="/eksamen2" onClick={closeDropdown}>
                    Eksamen 2
                  </Link>
                </li>
                <li>
                  <Link href="/eksamen3" onClick={closeDropdown}>
                    Eksamen 3
                  </Link>
                </li>
                <li>
                  <Link href="/eksamen4" onClick={closeDropdown}>
                    Eksamen 4
                  </Link>
                </li>
                <li>
                  <Link href="/eksamen5" onClick={closeDropdown}>
                    Eksamen 5
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <button onClick={routeResults} className={styles.navButton}>
            Resultater
          </button>
        </div>

        {/* Mobile Burger Menu */}
        <div className={styles.mobileMenu}>
          <button onClick={toggleMobileMenu} className={styles.burgerButton}>
            <i className="bi bi-list" style={{ fontSize: "24px" }}></i>
          </button>
          {isMobileMenuOpen && (
            // Use the second ref for mobile dropdown
            <div className={styles.mobileDropdown} ref={mobileDropdownRef}>
              <button onClick={routeFlashcards} className={styles.navButton}>
                Flashcards
              </button>
              <div className={styles.dropdown}>
                <button onClick={toggleDropdown} className={styles.navButton}>
                  Eksamener
                </button>
                {isDropdownOpen && (
                  <ul className={styles.dropdownMenu}>
                    <li>
                      <Link href="/eksamen1" onClick={closeDropdown}>
                        Eksamen 1
                      </Link>
                    </li>
                    <li>
                      <Link href="/eksamen2" onClick={closeDropdown}>
                        Eksamen 2
                      </Link>
                    </li>
                    <li>
                      <Link href="/eksamen3" onClick={closeDropdown}>
                        Eksamen 3
                      </Link>
                    </li>
                    <li>
                      <Link href="/eksamen4" onClick={closeDropdown}>
                        Eksamen 4
                      </Link>
                    </li>
                    <li>
                      <Link href="/eksamen5" onClick={closeDropdown}>
                        Eksamen 5
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
              <button onClick={routeResults} className={styles.navButton}>
                Resultater
              </button>
            </div>
          )}
        </div>

        {/* Right section */}
        <div className={styles.right}>
          <div style={{ margin: "1rem" }}>
            <DarkModeButton />
          </div>
          {user ? (
            <Link href="/profile" className={styles.profilePhotoContainer}>
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Profile"
                  width={50}
                  height={50}
                  className={styles.profilePhoto}
                />
              ) : (
                <div className={styles.profilePhotoPlaceholder}>
                  {user.displayName?.charAt(0) || "U"}
                </div>
              )}
            </Link>
          ) : (
            <button onClick={routeLogin} className={styles.navButton}>
              Logg inn
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
