import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import type React from "react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "soalify",
  description: "Platform Pembuat Soal dan Jawaban Otomatis",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <AuthProvider>
        <body className={`${spaceGrotesk.variable} ${inter.variable}`}>
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}

import "./globals.css";
