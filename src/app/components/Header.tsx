"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import "bootstrap-icons/font/bootstrap-icons.css";

// A small helper function to map the pathname to a readable title
function getPageTitle(pathname: string): string {
  switch (pathname) {
    case "/":
      return "Home";
    case "/login":
      return "login";
    case "/results":
      return "Resultater";
    case "/eksamen1":
      return "Eksamen 1";
    case "/eksamen2":
      return "Eksamen 2";
    case "/eksamen3":
      return "Eksamen 3";
    case "/eksamen4":
      return "Eksamen 4";
    case "/profile":
      return "Min Profil";
    default:
      return "ExPhil App"; // fallback if you have other routes
  }
}

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname(); // Hook to get current path
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
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
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>

        {/* Left: Current page title */}
        <div className={styles.left}>
          <button onClick={routeHome} className={styles.navButton}>
          <i className="bi bi-house"></i>
          </button>
          <span className={styles.pageTitle}>{pageTitle}</span>
        </div>

        {/* Middle: Eksamener dropdown + Resultater link */}
        <div className={styles.middle}>
          <div className={styles.dropdown} ref={dropdownRef}>
            <button onClick={toggleDropdown} className={styles.navButton}>
              Eksamener
            </button>
            {isDropdownOpen && (
              <ul className={styles.dropdownMenu}>
                <li>
                  <Link href="/eksamen1" onClick={closeDropdown}>Eksamen 1</Link>
                </li>
                <li>
                  <Link href="/eksamen2" onClick={closeDropdown}>Eksamen 2</Link>
                </li>
                <li>
                  <Link href="/eksamen3" onClick={closeDropdown}>Eksamen 3</Link>
                </li>
                <li>
                  <Link href="/eksamen4" onClick={closeDropdown}>Eksamen 4</Link>
                </li>
              </ul>
            )}
          </div>

          <button onClick={routeResults} className={styles.navButton}>
            Resultater
          </button>
        </div>

        {/* Right: Profile photo (if logged in) or Logg inn */}
        <div className={styles.right}>
          {user ? (
            // If user is logged in, show profile photo
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
