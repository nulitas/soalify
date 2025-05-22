"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const words = useMemo(() => ["Soal-soal", "Jawaban"], []);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < currentWord.length) {
        setTypedText(currentWord.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setTypedText("");
        }, 2000);
      }
    }, 150);

    return () => clearInterval(typeInterval);
  }, [currentWordIndex, words]);

  return (
    <section className="px-4 md:px-8 pt-32 pb-20 max-w-7xl mx-auto bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-20 h-20 border border-gray-200 rounded-full opacity-30"></div>
      <div className="absolute top-40 right-40 w-8 h-8 bg-gray-100 rounded-full opacity-40"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 border border-gray-200 rounded-lg opacity-20 rotate-45"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-3xl">
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600 mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Telah dipercaya 500+ guru di Indonesia
            </div>
          </div>

          <h1 className="text-4xl md:text-[64px] font-semibold leading-[1.1] mb-8 title-font">
            Platform Cerdas untuk Membuat {""}
            <br></br>
            <span className="underline-word relative">
              {typedText || "Soal"}
              <span className="absolute right-0 top-0 w-0.5 h-full bg-black animate-pulse"></span>
            </span>{" "}
          </h1>

          <p className="section-description mb-8 max-w-2xl">
            Dengan Soalify, guru tidak perlu lagi repot menyusun soal satu per
            satu secara manual. Cukup masukkan materi atau tema pelajaran yang
            ingin dibuatkan soal, dan Soalify akan membuatkan soal beserta
            jawabannya secara langsung.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href=" /auth/register"
              className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200 hover:scale-105 hover:shadow-lg text-sm button-font"
            >
              Daftar Sekarang
            </Link>

            <button className="px-8 py-3 border border-black text-black rounded-full hover:bg-black hover:text-white transition-all duration-200 text-sm button-font">
              Lihat Demo
            </button>
          </div>

          <div className="flex items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">✓</span>
              </div>
              <span>Gratis untuk 50 soal pertama</span>
            </div>
          </div>
        </div>

        {/* Hero Illustration/Mockup */}
        <div className="relative lg:block hidden">
          <div className="bg-gray-50 rounded-2xl p-8 shadow-xl relative">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <div className="h-3 bg-blue-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-blue-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              Soal Generated!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
