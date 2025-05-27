"use client";

import axios from "axios";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import QuestionGenerator from "@/components/dashboard/question-generator";
import GeneratedQuestions from "@/components/dashboard/generated-questions";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorMessage from "@/components/ui/error-message";

const exampleTexts = [
  {
    id: "bahasa",
    content:
      "Bahasa Indonesia adalah bahasa resmi Republik Indonesia dan bahasa persatuan bangsa Indonesia. Bahasa ini diresmikan penggunaannya setelah Proklamasi Kemerdekaan Indonesia, tepatnya sehari sesudahnya, bersamaan dengan mulai berlakunya konstitusi. Berakar dari bahasa Melayu, Bahasa Indonesia digunakan sebagai lingua franca di nusantara selama berabad-abad, memfasilitasi komunikasi antar suku yang memiliki lebih dari 700 bahasa daerah yang berbeda.",
  },
  {
    id: "fotosintesis",
    content:
      "Fotosintesis adalah proses biokimia yang dilakukan oleh tumbuhan, alga, dan beberapa jenis bakteri untuk mengubah energi cahaya menjadi energi kimia. Dalam proses ini, tumbuhan hijau menggunakan klorofil (zat hijau daun) untuk menyerap energi dari sinar matahari. Energi ini kemudian digunakan untuk mengubah air (H₂O) dan karbon dioksida (CO₂) dari udara menjadi glukosa (C₆H₁₂O₆), yang merupakan sumber makanan bagi tumbuhan, dan oksigen (O₂) yang dilepaskan ke atmosfer sebagai produk sampingan.",
  },
  {
    id: "pd2",
    content:
      "Perang Dunia II adalah sebuah konflik militer global yang berlangsung dari tahun 1939 hingga 1945. Perang ini melibatkan sebagian besar negara di dunia, termasuk semua kekuatan besar, yang pada akhirnya membentuk dua aliansi militer yang berlawanan: Sekutu (Allies) dan Poros (Axis). Perang ini dianggap sebagai konflik paling mematikan dalam sejarah umat manusia, dengan perkiraan korban jiwa mencapai 70 hingga 85 juta orang, dan merupakan pemicu utama berbagai perubahan besar dalam peta politik dunia dan struktur sosial.",
  },
  {
    id: "pythagoras",
    content:
      "Teorema Pythagoras adalah prinsip fundamental dalam geometri Euklides yang menjelaskan hubungan antara tiga sisi dari sebuah segitiga siku-siku. Teorema ini menyatakan bahwa kuadrat dari panjang sisi miring (hipotenusa), yaitu sisi yang berhadapan dengan sudut siku-siku, sama dengan jumlah dari kuadrat panjang kedua sisi penyikunya. Secara matematis, jika 'a' dan 'b' adalah panjang sisi penyiku dan 'c' adalah panjang sisi miring, maka berlaku rumus: a² + b² = c².",
  },
];

export default function MembuatSoal() {
  const [generatedContent, setGeneratedContent] = useState<{
    result: { questions: { question: string; answer: string }[] };
    method: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleApiError = useCallback(
    (err: unknown, contextMessage: string) => {
      let displayMessage = contextMessage;
      let isSessionExpired = false;

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          displayMessage =
            "Sesi Anda telah berakhir. Anda akan dialihkan ke halaman login.";
          isSessionExpired = true;
          toast.error("Sesi Anda telah berakhir.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => {
            router.push("/login");
          }, 2500);
        } else {
          displayMessage = err.response?.data?.detail || contextMessage;
        }
      }

      setError(displayMessage);
      if (!isSessionExpired) {
        toast.error(displayMessage);
      }
      console.error(`Error: ${contextMessage}`, err);
    },
    [router]
  );

  const handleGenerateQuestions = async (data: {
    query_text: string;
    num_questions: number;
    use_rag: boolean;
  }) => {
    setIsLoading(true);
    setGeneratedContent(null);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      handleApiError(
        {
          response: {
            status: 401,
            data: { detail: "Autentikasi diperlukan untuk membuat soal." },
          },
        } as {
          response: {
            status: number;
            data: { detail: string };
          };
        },
        "Autentikasi diperlukan untuk membuat soal."
      );
      setIsLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/questions/generate`,
        data,
        config
      );
      setGeneratedContent({
        result: response.data.result,
        method: response.data.method,
      });
      toast.success("Soal berhasil dibuat!");
    } catch (err) {
      handleApiError(err, "Gagal membuat soal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyClick = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedId(id);
        toast.success("Teks contoh berhasil disalin!");
        setTimeout(() => {
          setCopiedId(null);
        }, 2000);
      },
      (err) => {
        console.error("Failed to copy text: ", err);
        toast.error("Gagal menyalin teks contoh.");
      }
    );
  };

  return (
    <>
      <Toaster
        toastOptions={{
          success: {
            style: { background: "#10B981", color: "white", fontWeight: "500" },
          },
          error: {
            style: { background: "#EF4444", color: "white", fontWeight: "500" },
          },
          loading: {
            style: { background: "#3B82F6", color: "white", fontWeight: "500" },
          },
        }}
      />
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-medium title-font mb-2">
          Membuat Soal
        </h1>
        <p className="section-description text-gray-600">
          Buat soal dan jawaban dari konten teks Anda
        </p>
      </div>

      <ErrorMessage message={error} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          {!error && (
            <QuestionGenerator
              onGenerate={handleGenerateQuestions}
              allowCustomQuestionCount={false}
              defaultQuestionCount={1}
            />
          )}

          <div className="mt-4 md:mt-6">
            {isLoading && (
              <div className="flex justify-center items-center py-10">
                {" "}
                {/* Centered loader */}
                <LoadingSpinner message="Sedang membuat soal, mohon tunggu..." />
              </div>
            )}
            {generatedContent && !isLoading && !error && (
              <GeneratedQuestions
                result={generatedContent.result}
                method={generatedContent.method}
              />
            )}
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-medium title-font mb-4">
              Salin Teks Contoh
            </h3>
            <div className="space-y-3">
              {exampleTexts.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleCopyClick(template.content, template.id)}
                  disabled={copiedId === template.id}
                  className="w-full flex items-center justify-between p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-all disabled:bg-green-50 disabled:border-green-300"
                >
                  <span className="button-font text-sm truncate text-left">
                    {copiedId === template.id
                      ? "Teks disalin!"
                      : template.content}
                  </span>
                  <span className="flex-shrink-0 ml-2 font-semibold">
                    {copiedId === template.id ? "✓" : "+"}
                  </span>
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
                <span>Mulai dengan satu pertanyaan untuk menguji kualitas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
