import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthContextProvider } from '@/context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import React, { JSX } from "react";


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ExPhil Exam Project',
  description: 'A platform for taking exams to practice for Ex.Phil',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <AuthContextProvider>
          <Header />
          <main className="min-h-screen p-4">
            {children}
          </main>
          <Footer />
        </AuthContextProvider>
      </body>
    </html>
  );
}
