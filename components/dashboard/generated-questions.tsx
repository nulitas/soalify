"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Info,
  BookOpen,
  Target,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";

interface Question {
  question: string;
  answer: string;
  learning_outcome_achieved: string;
}

interface Metadata {
  count: number;
  education_level: string;
  target_learning_outcome: string;
  actual_learning_outcome: string;
  level_reasoning: string;
  outcome_reasoning: string;
  status: string;
  error_message?: string;
}

interface GeneratedResult {
  questions: Question[];
  metadata: Metadata;
}

interface GeneratedQuestionsProps {
  result: GeneratedResult;
  method: string;
}

function GeneratedQuestions({ result }: GeneratedQuestionsProps) {
  const [copied, setCopied] = useState(false);

  const validQuestionsToDisplay = result?.questions?.filter(
    (q) => q.question && q.question.trim() !== ""
  );

  if (result?.metadata?.status === "error") {
    return (
      <div className="bg-red-50 p-4 md:p-6 rounded-lg border border-red-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h2 className="text-lg md:text-xl font-medium text-red-700">
            Materi Terlalu Tinggi
          </h2>
        </div>

        <div className="bg-white p-4 rounded-lg border border-red-100 mb-4">
          <p className="text-red-700 text-base mb-3">
            {result.metadata.error_message ||
              "Level pencapaian materi terlalu tinggi untuk diproses."}
          </p>

          {result.metadata.level_reasoning && (
            <div className="pt-3 border-t border-red-200">
              <p className="text-xs text-red-600 mb-1">Analisis Level Materi</p>
              <p className="text-sm text-red-700">
                {result.metadata.level_reasoning}
              </p>
            </div>
          )}
        </div>

        {/* <div className="text-xs text-red-500">
          Dianalisis menggunakan metode {method.toUpperCase()} •{" "}
          {new Date().toLocaleString()}
        </div> */}
      </div>
    );
  }

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
          `Pertanyaan ${index + 1}: ${q.question}\nJawaban: ${
            q.answer
          }\nCapaian Pembelajaran: ${q.learning_outcome_achieved}`
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
      case "Terlalu Tinggi":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getLearningOutcomeColor = (outcome: string) => {
    if (outcome.includes("Pengetahuan faktual")) {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    } else if (outcome.includes("Pemahaman konseptual")) {
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    } else if (outcome.includes("Penerapan prosedural")) {
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    } else if (outcome.includes("Analisis")) {
      return "bg-violet-100 text-violet-700 border-violet-200";
    } else {
      return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-medium">
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

            {/* Target Learning Outcome */}
            {result.metadata.target_learning_outcome && (
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Target Capaian Pembelajaran
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${getLearningOutcomeColor(
                      result.metadata.target_learning_outcome
                    )}`}
                  >
                    {result.metadata.target_learning_outcome}
                  </span>
                </div>
              </div>
            )}

            {/* Actual Learning Outcome */}
            {result.metadata.actual_learning_outcome && (
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Capaian Pembelajaran Aktual
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${getLearningOutcomeColor(
                      result.metadata.actual_learning_outcome
                    )}`}
                  >
                    {result.metadata.actual_learning_outcome}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Level Reasoning */}
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

          {/* Outcome Reasoning */}
          {result.metadata.outcome_reasoning && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-1">
                Alasan Pemilihan Capaian Pembelajaran
              </p>
              <p className="text-sm text-gray-700">
                {result.metadata.outcome_reasoning}
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
                <span className="text-sm font-medium">
                  Pertanyaan {index + 1}
                </span>
              </div>
              <p className="text-sm md:text-base">{item.question}</p>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Jawaban</span>
              </div>
              <p className="text-sm md:text-base">{item.answer}</p>
            </div>

            {/* Learning Outcome Achieved for each question */}
            {item.learning_outcome_achieved && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">
                    Capaian Pembelajaran
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${getLearningOutcomeColor(
                    item.learning_outcome_achieved
                  )}`}
                >
                  {item.learning_outcome_achieved}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* <div className="mt-4 md:mt-6 text-xs text-gray-500">
        Dihasilkan menggunakan metode {method.toUpperCase()} •{" "}
        {new Date().toLocaleString()}
        {result?.metadata?.status && (
          <span className="ml-2">• Status: {result.metadata.status}</span>
        )}
      </div> */}
    </div>
  );
}

export default GeneratedQuestions;
