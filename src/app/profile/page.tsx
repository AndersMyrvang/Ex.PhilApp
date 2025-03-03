"use client";

import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (!user) {
        return (
            <div className={styles.notLoggedIn}>
                <h2>Du må være logget inn for å se denne siden.</h2>
            </div>
        );
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profilePhotoContainer}>
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
            <h2 className={styles.profileName}>
                {user.displayName ? user.displayName : "Name"}
            </h2>
            <div className={styles.emailContainer}>
                <span>Mail:</span>
                <span>{user.email ? user.email : "example@mail.com"}</span>
            </div>
            <div className={styles.actions}>
                <button onClick={handleLogout} className={styles.actionButton}>
                    Log out
                </button>
            </div>
        </div>
    );
}
