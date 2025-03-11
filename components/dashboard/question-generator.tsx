"use client";

import type React from "react";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface QuestionGeneratorProps {
  onGenerate: (data: {
    query_text: string;
    num_questions: number;
    use_rag: boolean;
  }) => void;
}

export default function QuestionGenerator({
  onGenerate,
}: QuestionGeneratorProps) {
  const [queryText, setQueryText] = useState("");
  const [numQuestions, setNumQuestions] = useState(2);
  const [useRag, setUseRag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!queryText.trim()) {
      alert("Please enter some text to generate questions from");
      return;
    }

    setIsLoading(true);

    try {
      await onGenerate({
        query_text: queryText,
        num_questions: numQuestions,
        use_rag: useRag,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
      <h2 className="text-xl font-medium title-font mb-6">
        Hasilkan Pertanyaan dari Teks
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="queryText" className="block text-sm button-font">
            Konten Teks
          </label>
          <textarea
            id="queryText"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Masukkan teks yang ingin Anda buat pertanyaannya..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black resize-none"
            required
          ></textarea>
          <p className="text-xs text-gray-500">
            Sediakan teks yang terperinci untuk pembuatan pertanyaan yang lebih
            baik. Minimal 50 karakter yang disarankan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="numQuestions" className="block text-sm button-font">
              Jumlah Pertanyaan
            </label>
            <input
              type="number"
              id="numQuestions"
              value={numQuestions}
              onChange={(e) =>
                setNumQuestions(
                  Math.max(
                    1,
                    Math.min(10, Number.parseInt(e.target.value) || 1)
                  )
                )
              }
              min="1"
              max="10"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p className="text-xs text-gray-500">
              Pilih antara 1-10 pertanyaan
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm button-font mb-2">
              Opsi Lanjutan
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useRag"
                checked={useRag}
                onChange={(e) => setUseRag(e.target.checked)}
                className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="useRag" className="ml-2 block text-sm">
                Gunakan RAG (Retrieval Augmented Generation)
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Meningkatkan kualitas pertanyaan dengan konteks tambahan
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm button-font flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Bikin Soal"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
