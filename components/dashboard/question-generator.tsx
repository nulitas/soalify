import React, { useState, useEffect } from "react";
import {
  Loader2,
  FileText,
  CheckCircle,
  Circle,
  Search,
  BookOpen,
  Lightbulb,
  AlertCircle,
  Target,
  GraduationCap,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface Document {
  filename: string;
  chunk_count: number;
  page_count?: number;
  page_range?: string;
}

interface QuestionGeneratorProps {
  onGenerate: (data: {
    query_text: string;
    num_questions: number;
    use_rag: boolean;
    selected_documents?: string[];
    target_learning_outcome: string;
  }) => void;
  allowCustomQuestionCount?: boolean;
  defaultQuestionCount?: number;
  maxQuestionsAllowed?: number;
}

export default function QuestionGenerator({
  onGenerate,
  allowCustomQuestionCount = true,
  defaultQuestionCount = 1,
  maxQuestionsAllowed = 30,
}: QuestionGeneratorProps) {
  const [queryText, setQueryText] = useState("");
  const [numQuestions, setNumQuestions] = useState(
    String(defaultQuestionCount)
  );
  const [useRag, setUseRag] = useState(false);
  const [targetLearningOutcome, setTargetLearningOutcome] = useState("auto");
  const [isLoading, setIsLoading] = useState(false);
  const [availableDocuments, setAvailableDocuments] = useState<Document[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [inputMode, setInputMode] = useState<"keywords" | "content">(
    "keywords"
  );

  const learningOutcomeOptions = [
    {
      value: "auto",
      label: "Otomatis (Sistem Pilih)",
      description: "Sistem akan memilih capaian pembelajaran yang paling sesuai",
      icon: "🤖",
    },
    {
      value: "pengetahuan_faktual",
      label: "Pengetahuan Faktual",
      description: "Mengingat dan memahami fakta, istilah, dan informasi dasar",
      icon: "📚",
    },
    {
      value: "pemahaman_konseptual",
      label: "Pemahaman Konseptual",
      description: "Memahami konsep, prinsip, dan hubungan antar ide",
      icon: "🧠",
    },
    {
      value: "penerapan_prosedural",
      label: "Penerapan Prosedural",
      description: "Menerapkan prosedur dan langkah-langkah dalam praktik",
      icon: "⚙️",
    },
    {
      value: "analisis_sederhana",
      label: "Analisis Sederhana",
      description: "Menganalisis informasi dan membuat kesimpulan dasar",
      icon: "🔍",
    },
  ];

  useEffect(() => {
    if (useRag) {
      setInputMode("keywords");
      fetchAvailableDocuments();
    } else {
      setSelectedDocuments([]);
    }
  }, [useRag]);

  const fetchAvailableDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const response = await api.get("/database/document-info", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setAvailableDocuments(response.data.documents || []);
      toast.success("Dokumen berhasil dimuat");
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Gagal memuat dokumen. Silakan coba lagi.");
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleDocumentToggle = (filename: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(filename)
        ? prev.filter((doc) => doc !== filename)
        : [...prev, filename]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === availableDocuments.length) {
      setSelectedDocuments([]);
      toast.success("Semua dokumen dibatalkan");
    } else {
      setSelectedDocuments(availableDocuments.map((doc) => doc.filename));
      toast.success(`${availableDocuments.length} dokumen dipilih`);
    }
  };

  const handleSubmit = async () => {
    if (!queryText.trim()) {
      toast.error(
        inputMode === "keywords"
          ? "Mohon masukkan kata kunci atau topik untuk pencarian"
          : "Mohon masukkan konten untuk membuat pertanyaan",
        {
          duration: 4000,
          icon: "⚠️",
        }
      );
      return;
    }

    if (inputMode === "keywords" && queryText.trim().length < 3) {
      toast.error("Kata kunci terlalu pendek. Minimal 3 karakter.", {
        duration: 4000,
        icon: "⚠️",
      });
      return;
    }

    if (inputMode === "content" && queryText.trim().length < 50) {
      toast.error("Konten terlalu pendek. Minimal 50 karakter.", {
        duration: 4000,
        icon: "⚠️",
      });
      return;
    }

    const num = Number(numQuestions);
    if (!numQuestions || isNaN(num) || !Number.isInteger(num) || num <= 0) {
      toast.error("Jumlah soal harus berupa angka bulat lebih dari 0.", {
        icon: "🔢",
      });
      return;
    }

    if (num > maxQuestionsAllowed) {
      toast.error(
        `Jumlah soal tidak boleh lebih dari ${maxQuestionsAllowed}.`,
        {
          icon: "⚠️",
        }
      );
      return;
    }

    if (useRag && selectedDocuments.length === 0) {
      toast.error("Pilih minimal satu dokumen untuk menggunakan fitur RAG", {
        duration: 4000,
        icon: "📄",
      });
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading(
      "Sedang membuat pasangan pertanyaan-jawaban..."
    );

    try {
      await onGenerate({
        query_text: queryText,
        num_questions: num,
        use_rag: useRag,
        selected_documents: useRag ? selectedDocuments : undefined,
        target_learning_outcome: targetLearningOutcome,
      });

      toast.success(
        `${
          allowCustomQuestionCount ? numQuestions : defaultQuestionCount
        } pasangan pertanyaan-jawaban berhasil dibuat!`,
        {
          id: loadingToast,
          duration: 3000,
          icon: "✅",
        }
      );
    } catch {
      toast.error("Gagal membuat pertanyaan. Silakan coba lagi.", {
        id: loadingToast,
        duration: 4000,
        icon: "❌",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholderText = () => {
    if (inputMode === "keywords") {
      return useRag
        ? "bahasa Indonesia, sejarah Indonesia, biologi sel..."
        : "topik matematika, statistik, fisika kuantum...";
    } else {
      return "Masukkan materi atau konten yang ingin dijadikan dasar pembuatan soal...";
    }
  };

  const getInputDescription = () => {
    if (inputMode === "keywords") {
      return useRag
        ? "Masukkan kata kunci untuk mencari informasi dalam dokumen yang dipilih"
        : "Masukkan topik atau kata kunci yang ingin dijadikan tema soal";
    } else {
      return "Masukkan materi pembelajaran yang akan dijadikan dasar pembuatan soal";
    }
  };

  const getSelectedOutcomeInfo = () => {
    return learningOutcomeOptions.find(
      (option) => option.value === targetLearningOutcome
    );
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Buat Soal Otomatis</h2>
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Cara kerja pembuatan soal:</p>
            <p>
              Sistem akan menganalisis materi yang Anda berikan dan membuat soal
              yang relevan berdasarkan konten dan target capaian pembelajaran.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Input Mode Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Jenis Input Materi
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setInputMode("keywords")}
              disabled={useRag}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                inputMode === "keywords"
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              } ${useRag ? "opacity-75" : ""}`}
            >
              <div className="flex items-center gap-3">
                <Search
                  className={`w-5 h-5 ${
                    inputMode === "keywords" ? "text-black" : "text-gray-500"
                  }`}
                />
                <div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    Kata Kunci & Topik
                    {useRag && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Direkomendasikan untuk RAG
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {useRag
                      ? "Optimal untuk pencarian dalam dokumen"
                      : "Masukkan topik atau kata kunci singkat"}
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setInputMode("content")}
              disabled={useRag}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                inputMode === "content"
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              } ${useRag ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-3">
                <BookOpen
                  className={`w-5 h-5 ${
                    inputMode === "content" ? "text-black" : "text-gray-500"
                  }`}
                />
                <div>
                  <div className="font-medium text-sm">Materi Lengkap</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {useRag
                      ? "Tidak tersedia saat RAG aktif"
                      : "Masukkan teks materi pembelajaran"}
                  </div>
                </div>
              </div>
            </button>
          </div>
          {useRag && (
            <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded border-l-4 border-blue-400">
              <strong>Mode RAG aktif:</strong> Input kata kunci dipilih otomatis
              karena lebih efektif untuk pencarian dalam dokumen.
            </div>
          )}
        </div>

        {/* Material Input */}
        <div className="space-y-3">
          <label htmlFor="queryText" className="block text-sm font-medium">
            {inputMode === "keywords" ? "Kata Kunci" : "Materi Pembelajaran"}
          </label>

          {inputMode === "keywords" ? (
            <input
              type="text"
              id="queryText"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder={getPlaceholderText()}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              required
              maxLength={200}
            />
          ) : (
            <textarea
              id="queryText"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder={getPlaceholderText()}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              required
              maxLength={1000}
            />
          )}

          <div className="flex justify-between items-start">
            <p className="text-xs text-gray-600">{getInputDescription()}</p>
            <p className="text-xs text-gray-400">
              {queryText.length}/{inputMode === "keywords" ? "200" : "1000"}
            </p>
          </div>
        </div>

        {/* Learning Outcome Selection */}
        <div className="space-y-3">
          <label className="flex text-sm font-medium items-center gap-2">
            <Target className="w-4 h-4" />
            Target Capaian Pembelajaran
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {learningOutcomeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTargetLearningOutcome(option.value)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  targetLearningOutcome === option.value
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{option.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {targetLearningOutcome !== "auto" && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Target Dipilih: {getSelectedOutcomeInfo()?.label}
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Sistem akan membuat soal yang fokus pada capaian pembelajaran ini
              </p>
            </div>
          )}
        </div>

        {/* Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allowCustomQuestionCount && (
            <div className="space-y-2">
              <label
                htmlFor="numQuestions"
                className="block text-sm font-medium"
              >
                Jumlah Soal (Maks: {maxQuestionsAllowed})
              </label>
              <input
                type="number"
                id="numQuestions"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                min="1"
                max={maxQuestionsAllowed}
                placeholder="Contoh: 5"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Sumber Referensi
            </label>
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                id="useRag"
                checked={useRag}
                onChange={(e) => setUseRag(e.target.checked)}
                className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="useRag" className="ml-3 flex-1">
                <div className="text-sm font-medium">
                  Gunakan Dokumen Tersimpan
                </div>
                <div className="text-xs text-gray-600">
                  Tambahkan referensi dari dokumen yang sudah diupload
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Document Selection Section */}
        {useRag && (
          <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div className="text-sm text-amber-800">
                <strong>Mode Dokumen Aktif:</strong> Sistem akan mencari
                informasi dalam dokumen yang dipilih berdasarkan input Anda di
                atas.
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Pilih Dokumen Referensi</h3>
              {availableDocuments.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm text-black hover:text-gray-700 font-medium"
                >
                  {selectedDocuments.length === availableDocuments.length
                    ? "Batalkan Semua"
                    : "Pilih Semua"}
                </button>
              )}
            </div>

            {loadingDocuments ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm text-gray-600">Memuat dokumen...</span>
              </div>
            ) : availableDocuments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Tidak ada dokumen tersedia</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableDocuments.map((doc) => (
                  <div
                    key={doc.filename}
                    className="flex items-center p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleDocumentToggle(doc.filename)}
                  >
                    <div className="flex-shrink-0 mr-3">
                      {selectedDocuments.includes(doc.filename) ? (
                        <CheckCircle className="w-5 h-5 text-black" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.filename}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-xs text-gray-500">
                          {doc.chunk_count} potongan teks
                        </p>
                        {doc.page_count && (
                          <p className="text-xs text-gray-500">
                            {doc.page_count} halaman
                          </p>
                        )}
                        {doc.page_range && (
                          <p className="text-xs text-gray-500">
                            Hal. {doc.page_range}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedDocuments.length > 0 && (
              <div className="text-xs text-gray-600 bg-white p-3 rounded border">
                <strong>{selectedDocuments.length} dokumen dipilih:</strong>{" "}
                {selectedDocuments.slice(0, 2).join(", ")}
                {selectedDocuments.length > 2 &&
                  ` dan ${selectedDocuments.length - 2} lainnya`}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Membuat Soal...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4" />
                Buat Soal
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}