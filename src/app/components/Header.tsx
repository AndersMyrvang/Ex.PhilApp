"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.css";
import { subscribeToAuthState } from "@/utils/firebaseAuth";
import { auth } from "@/firebase/config";
import "bootstrap-icons/font/bootstrap-icons.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPageTitle } from "@/utils/getPageTitle";

library.add(fas);

function DarkModeButton() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle("dark-mode", newMode);
    localStorage.setItem("darkMode", newMode.toString());
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
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
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

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <button onClick={routeHome} className={styles.navButton}>
            <i className="bi bi-house"></i>
          </button>
          <span className={styles.pageTitle}>{pageTitle}</span>
        </div>

        <div className={styles.middle}>
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
              </ul>
            )}
          </div>

          <button onClick={routeResults} className={styles.navButton}>
            Resultater
          </button>
        </div>

        <div className={styles.right}>
          <div style={{ margin: "1rem" }}>
            <DarkModeButton />
          </div>
          {user ? (
            <Link href="/profile" className={styles.profilePhotoContainer}>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
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
