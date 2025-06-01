import React, { useState, useEffect } from "react";
import { Loader2, FileText, CheckCircle, Circle } from "lucide-react";
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
  }) => void;
  allowCustomQuestionCount?: boolean;
  defaultQuestionCount?: number;
}

export default function QuestionGenerator({
  onGenerate,
  allowCustomQuestionCount = true,
  defaultQuestionCount = 1,
}: QuestionGeneratorProps) {
  const [queryText, setQueryText] = useState("");
  const [numQuestions, setNumQuestions] = useState(defaultQuestionCount);
  const [useRag, setUseRag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableDocuments, setAvailableDocuments] = useState<Document[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  useEffect(() => {
    if (useRag) {
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
    } catch (error) {
      console.error("Error fetching documents:", error);
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
    } else {
      setSelectedDocuments(availableDocuments.map((doc) => doc.filename));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!queryText.trim()) {
      alert("Please enter some text to generate questions from");
      return;
    }

    if (useRag && selectedDocuments.length === 0) {
      alert("Please select at least one document to use RAG functionality");
      return;
    }

    setIsLoading(true);

    try {
      await onGenerate({
        query_text: queryText,
        num_questions: allowCustomQuestionCount
          ? numQuestions
          : defaultQuestionCount,
        use_rag: useRag,
        selected_documents: useRag ? selectedDocuments : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm">
      <h2 className="text-xl font-medium mb-4 md:mb-6">
        Hasilkan Pertanyaan dari Teks
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="space-y-2">
          <label htmlFor="queryText" className="block text-sm font-medium">
            Konten Teks
          </label>
          <textarea
            id="queryText"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Masukkan teks yang ingin Anda buat pertanyaan..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            required
            maxLength={2000}
          />
          <p className="text-xs text-gray-500">
            Sediakan teks yang terperinci untuk pembuatan pertanyaan yang lebih
            baik. Minimal 50 karakter yang disarankan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {allowCustomQuestionCount && (
            <div className="space-y-2">
              <label
                htmlFor="numQuestions"
                className="block text-sm font-medium"
              >
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
                      Math.min(5, Number.parseInt(e.target.value) || 1)
                    )
                  )
                }
                min="1"
                max="5"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                aria-label="Select number of questions between 1 and 5"
              />
              <p className="text-xs text-gray-500">
                Pilih antara 1-5 pertanyaan
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2">
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
                Gunakan Informasi dari Dokumen yang tersimpan
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Meningkatkan kualitas pertanyaan dengan konteks tambahan
            </p>
          </div>
        </div>

        {/* Document Selection Section */}
        {useRag && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Pilih Dokumen</h3>
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
                    className="flex items-center p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer"
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
                          {doc.chunk_count} chunks
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
              <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                {selectedDocuments.length} dokumen dipilih:{" "}
                {selectedDocuments.slice(0, 3).join(", ")}
                {selectedDocuments.length > 3 &&
                  ` dan ${selectedDocuments.length - 3} lainnya`}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 md:px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Membuat Soal...
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
