"use client";

import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handler for resetting the user's password
  const handleResetPassword = () => {
    // Implement your password reset logic here
    // e.g. sending a password reset email
    alert("Password reset link has been sent to your email (not implemented).");
  };

  // Handler for logging out
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // If there's no user, you might want to show a "Please log in" message or redirect
  if (!user) {
    return (
      <div className={styles.notLoggedIn}>
        <h2>Du må være logget inn for å se denne siden.</h2>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      {/* Profile photo */}
      <div className={styles.profilePhotoContainer}>
        {/* If user.photoURL is available, show it; otherwise, show a placeholder */}
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile Photo"
            className={styles.profilePhoto}
          />
        ) : (
          <div className={styles.profilePhotoPlaceholder}>
            <span>Profile photo</span>
          </div>
        )}
      </div>

      {/* User name */}
      <h2 className={styles.profileName}>
        {user.displayName ? user.displayName : "Name"}
      </h2>

      {/* Exam progress (placeholders) */}
      <div className={styles.examList}>
        <p>Eksamener:</p>
        <p>Eksamen 1: xx%</p>
        <p>Eksamen 2: xx%</p>
        <p>Eksamen 3: xx%</p>
      </div>

      {/* Email */}
      <div className={styles.emailContainer}>
        <span>Mail:</span>
        <span>{user.email ? user.email : "example@mail.com"}</span>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button onClick={handleResetPassword} className={styles.actionButton}>
          Reset password
        </button>
        <button onClick={handleLogout} className={styles.actionButton}>
          Log out
        </button>
      </div>
    </div>
  );
}
