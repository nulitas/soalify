"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface GeneratedQuestionsProps {
  result: {
    questions: { question: string; answer: string }[];
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
          {" "}
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
      </div>
    </div>
  );
}
