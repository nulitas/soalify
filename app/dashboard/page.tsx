"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import QuestionGenerator from "@/components/dashboard/question-generator";
import GeneratedQuestions from "@/components/dashboard/generated-questions";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "generate" | "history" | "settings"
  >("generate");
  const [generatedContent, setGeneratedContent] = useState<{
    result: string;
    method: string;
  } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGenerateQuestions = async (data: {
    query_text: string;
    num_questions: number;
    use_rag: boolean;
  }) => {
    try {
      console.log("API Request:", data);

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/generate-questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);

      setGeneratedContent({
        result: responseData.result,
        method: responseData.method,
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7f3] flex">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main content area */}
      <div className="flex-1 w-full md:ml-64">
        <DashboardHeader
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }}
        />

        <main className="p-4 md:p-6 mt-24 md:mt-16">
          <div className="max-w-7xl mx-auto">
            {activeTab === "generate" && (
              <>
                <div className="mb-6 md:mb-8">
                  <h1 className="text-2xl md:text-3xl font-medium title-font mb-2">
                    Generator Pertanyaan
                  </h1>
                  <p className="section-description text-gray-600">
                    Hasilkan pertanyaan dan jawaban dari konten teks Anda
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
                      <h3 className="text-lg font-medium title-font mb-4">
                        Contoh Teks
                      </h3>
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
                      <h3 className="text-lg font-medium title-font mb-4">
                        Tips
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-black font-bold">•</span>
                          <span>
                            Sediakan teks terperinci untuk pertanyaan yang lebih
                            akurat
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-black font-bold">•</span>
                          <span>
                            Gunakan opsi RAG untuk meningkatkan pemahaman
                            konteks
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-black font-bold">•</span>
                          <span>
                            {" "}
                            Mulailah dengan 2-3 pertanyaan untuk menguji
                            kualitas
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-black font-bold">•</span>
                          <span>
                            Anda dapat mengedit pertanyaan yang dibuat sebelum
                            menyimpan
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "history" && (
              <div>
                <h1 className="text-2xl md:text-3xl font-medium title-font mb-6">
                  Riwayat Pertanyaan
                </h1>
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6">
                  <p className="section-description">
                    Lihat riwayat pertanyaan Anda di sini
                  </p>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h1 className="text-2xl md:text-3xl font-medium title-font mb-6">
                  Pengaturan
                </h1>
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6">
                  <p className="section-description">
                    Kelola pengaturan Anda di sini
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
