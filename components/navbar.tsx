"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="flex justify-between items-center py-6 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="text-xl font-medium title-font">
          soalify
        </Link>

        <div className="hidden md:flex gap-8">
          {["Tentang", "Fitur", "Penggunaan", "Masuk"].map((item) => (
            <button
              key={item}
              onClick={() =>
                scrollToSection(item.toLowerCase().replace(/\s+/g, "-"))
              }
              className="nav-text hover:no-underline group transition-colors duration-200 ease-in-out"
            >
              <span className="group-hover:underline decoration-1 underline-offset-4">
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
