"use client";

import axios from "axios";
import { useState } from "react";
import QuestionGenerator from "@/components/dashboard/question-generator";
import GeneratedQuestions from "@/components/dashboard/generated-questions";

export default function MembuatSoal() {
  const [generatedContent, setGeneratedContent] = useState<{
    result: { questions: { question: string; answer: string }[] };
    method: string;
  } | null>(null);

  const handleGenerateQuestions = async (data: {
    query_text: string;
    num_questions: number;
    use_rag: boolean;
  }) => {
    try {
      console.log("API Request:", data);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/questions/generate`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);

      setGeneratedContent({
        result: response.data.result,
        method: response.data.method,
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    }
  };

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-medium title-font mb-2">
          Membuat Soal
        </h1>
        <p className="section-description text-gray-600">
          Buat soal dan jawaban dari konten teks Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <QuestionGenerator onGenerate={handleGenerateQuestions} />

          {generatedContent && (
            <div className="mt-4 md:mt-6">
              <GeneratedQuestions
                result={generatedContent.result}
                method={generatedContent.method}
              />
            </div>
          )}
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-medium title-font mb-4">Teks Contoh</h3>
            <div className="space-y-3">
              {[
                "Bahasa Indonesia adalah bahasa resmi dan nasional Republik Indonesia...",
                "Fotosintesis adalah proses pembuatan makanan oleh tumbuhan hijau...",
                "Perang Dunia II adalah konflik global yang berlangsung dari tahun 1939 hingga 1945...",
                "Teorema Pythagoras menyatakan bahwa dalam segitiga siku-siku...",
              ].map((template, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <span className="button-font text-sm truncate text-left">
                    {template}
                  </span>
                  <span className="flex-shrink-0 ml-2">+</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-medium title-font mb-4">Tips</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">•</span>
                <span>
                  Berikan teks yang detail untuk pertanyaan yang lebih akurat
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">•</span>
                <span>
                  Gunakan opsi RAG untuk pemahaman konteks yang lebih baik
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">•</span>
                <span>Mulai dengan 2-3 pertanyaan untuk menguji kualitas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">•</span>
                <span>
                  Anda dapat mengedit pertanyaan yang dihasilkan sebelum
                  menyimpan
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
