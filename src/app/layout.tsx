import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthContextProvider } from "@/context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import React, { JSX } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExPhil Exam Project",
  description: "A platform for taking exams to practice for Ex.Phil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className="h-full">
      <head />
      <body className={`${inter.className} h-full flex flex-col m-0 p-0`}>
        <AuthContextProvider>
          <Header />
          <main className="flex-1 p-4">{children}</main>
          <Footer />
        </AuthContextProvider>
      </body>
    </html>
  );
}
