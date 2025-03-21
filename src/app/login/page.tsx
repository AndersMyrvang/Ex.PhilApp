"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { auth } from "@/firebase/config";
import { subscribeToAuthState, signUpWithEmail } from "@/utils/firebaseAuth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      if (user) {
        router.push("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  const handleSignUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      alert("Display name is required!");
      return;
    }

    try {
      await signUpWithEmail(email, password, displayName);
      alert("Bruker opprettet!");
      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSignUpWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Bruker signInWithPopup i stedet for signInWithRedirect
      await signInWithPopup(auth, provider);
      alert("Logget inn med Google!");
      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>

      <div className={styles.card}>
        <h1 className={styles.title}>ExPhil App</h1>
        <h2 className={styles.subtitle}>Create an account</h2>

        {/*
        <form onSubmit={handleSignUpWithEmail} className={styles.form}>
          <div>
            <label htmlFor="displayName" className={styles.label}>
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              placeholder="Your display name"
              className={styles.input}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@domain.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Sign up with email
          </button>
        </form>

        <div className={styles.hrContainer}>
          <hr className={styles.hr} />
          <span className={styles.hrText}>or continue with</span>
          <hr className={styles.hr} />
        </div>
        */}

        <button onClick={handleSignUpWithGoogle} className={styles.googleButton}>
          <svg className={styles.googleIcon} viewBox="0 0 533.5 544.3">
            <path
              fill="#4285F4"
              d="M533.5 278.4c0-15.2-1.2-29.8-3.5-44.1H272v83.6h146.7c-6.4 34.8-25.2 64.1-53.6 83.6v69h86.9c50.6-46.6 81.5-115.3 81.5-192.1z"
            />
            <path
              fill="#34A853"
              d="M272 544.3c72.3 0 133-23.9 177.4-64.9l-86.9-69c-24.2 16.3-55.1 26-90.5 26-69 0-127.4-46.6-148.3-109.2H33.5v68.3C77.1 490.2 169.2 544.3 272 544.3z"
            />
            <path
              fill="#FBBC05"
              d="M123.7 326.5c-6.5-19.4-10.3-40.1-10.3-61.5 0-21.4 3.8-42.1 10.3-61.5V135h-90.2A271.8 271.8 0 0 0 0 265c0 44.2 10.5 86 29.2 123.5l94.5-62z"
            />
            <path
              fill="#EA4335"
              d="M272 124.1c37.4 0 71 12.9 97.5 38.2l73.1-73.1C412.4 50.1 351.6 27 272 27 169.2 27 77.1 81.1 33.5 194.9l94.5 62C144.6 194.3 203 147.7 272 147.7z"
            />
          </svg>
          Google
        </button>

        <p className={styles.terms}>
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
