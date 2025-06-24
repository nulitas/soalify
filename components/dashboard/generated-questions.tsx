"use client";

import { useState } from "react";
import { Copy, Check, Info, BookOpen, Target } from "lucide-react";

interface GeneratedQuestionsProps {
  result: {
    questions: { question: string; answer: string }[];
    metadata?: {
      count: number;
      education_level: string;
      level_reasoning: string;
      status: string;
    };
  };
  method: string;
}

export default function GeneratedQuestions({
  result,
  method,
}: GeneratedQuestionsProps) {
  const [copied, setCopied] = useState(false);

  const validQuestionsToDisplay = result?.questions?.filter(
    (q) => q.question && q.question.trim() !== ""
  );

  if (!validQuestionsToDisplay || validQuestionsToDisplay.length === 0) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm text-center">
        <p className="text-gray-700 text-base">
          Maaf, konteks materi tidak ditemukan.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    const formattedText = validQuestionsToDisplay
      .map(
        (q, index) =>
          `Pertanyaan ${index + 1}: ${q.question}\nJawaban: ${q.answer}`
      )
      .join("\n\n");

    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEducationLevelColor = (level: string) => {
    switch (level) {
      case "SD":
        return "bg-green-100 text-green-700 border-green-200";
      case "SMP":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "SMA":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Perguruan Tinggi":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-medium title-font">
          Pertanyaan yang Dihasilkan
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Metadata Section */}
      {result?.metadata && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Informasi Analisis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Target className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Jumlah Pertanyaan</p>
                <p className="text-sm font-medium">
                  {result.metadata.count} pertanyaan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Level Pendidikan</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${getEducationLevelColor(
                    result.metadata.education_level
                  )}`}
                >
                  {result.metadata.education_level}
                </span>
              </div>
            </div>
          </div>

          {result.metadata.level_reasoning && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-1">
                Alasan Pemilihan Level
              </p>
              <p className="text-sm text-gray-700">
                {result.metadata.level_reasoning}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4 md:space-y-6">
        {validQuestionsToDisplay.map((item, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-md p-3 md:p-4 bg-gray-50"
          >
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium button-font">
                  Pertanyaan {index + 1}
                </span>
              </div>
              <p className="text-sm md:text-base">{item.question}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium button-font">Jawaban</span>
              </div>
              <p className="text-sm md:text-base">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 md:mt-6 text-xs text-gray-500">
        Dihasilkan menggunakan metode {method.toUpperCase()} •{" "}
        {new Date().toLocaleString()}
        {result?.metadata?.status && (
          <span className="ml-2">• Status: {result.metadata.status}</span>
        )}
      </div>
    </div>
  );
}
