"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {auth.currentUser?.displayName}!</h1>
      <button 
        onClick={() => {
          auth.signOut();
          router.push("/");
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
