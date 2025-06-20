"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="flex justify-between items-center py-6 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="text-xl font-medium title-font">
          soalify
        </Link>

        {/* --- Desktop Menu --- */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: "Tentang", url: "#tentang" },
            { name: "Fitur", url: "#fitur" },
            { name: "Penggunaan", url: "#penggunaan" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.url}
              className="nav-text hover:no-underline group transition-colors duration-200 ease-in-out"
            >
              <span className="group-hover:underline decoration-1 underline-offset-4">
                {item.name}
              </span>
            </Link>
          ))}{" "}
          {loading ? (
            <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          ) : user ? (
            <Link
              href="/dashboard"
              className="nav-text px-4 py-1 border border-black rounded-full bg-black text-white transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="nav-text px-4 py-1 border border-black rounded-full hover:bg-black hover:text-white transition-colors"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* --- Mobile menu button --- */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 12h16M4 6h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* --- Mobile menu --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-4 shadow-md">
          <div className="flex flex-col space-y-4">
            {[
              { name: "Tentang", url: "#tentang" },
              { name: "Fitur", url: "#fitur" },
              { name: "Penggunaan", url: "#penggunaan" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.url}
                onClick={() => setIsMobileMenuOpen(false)}
                className="nav-text hover:no-underline group transition-colors duration-200 ease-in-out"
              >
                <span className="group-hover:underline decoration-1 underline-offset-4">
                  {item.name}
                </span>
              </Link>
            ))}

            {loading ? (
              <div className="w-20 h-7 bg-gray-200 rounded-md animate-pulse"></div>
            ) : user ? (
              <Link
                href="/dashboard"
                className="nav-text py-2 text-white bg-black rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="nav-text py-2 text-left hover:underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
