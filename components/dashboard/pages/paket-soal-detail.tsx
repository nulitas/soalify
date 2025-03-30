"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Edit, Save, Plus, Trash } from "lucide-react";
import Link from "next/link";
import QuestionGenerator from "@/components/dashboard/question-generator";
import GeneratedQuestions from "@/components/dashboard/generated-questions";

interface Tag {
  tag_id: number;
  tag_name: string;
  user_id: number;
}

interface Question {
  question: string;
  answer: string;
}

interface PaketSoal {
  package_id: number;
  package_name: string;
  user_id: number;
  tags: Tag[];
  questions: Question[];
}

interface PaketSoalDetailProps {
  paketId: number;
}

export default function PaketSoalDetail({ paketId }: PaketSoalDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPackage, setEditedPackage] = useState<PaketSoal | null>(null);
  const [viewingPackage, setViewingPackage] = useState<PaketSoal | null>(null);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuestionGenerator, setShowQuestionGenerator] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    result: { questions: Question[] };
    method: string;
  } | null>(null);

  useEffect(() => {
    async function fetchPackage() {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/packages/${paketId}`
        );
        setViewingPackage(response.data);
        setEditedPackage(response.data);
      } catch (err) {
        console.error("Failed to fetch package:", err);
        setError("Gagal memuat paket soal");
      } finally {
        setLoading(false);
      }
    }

    async function fetchTags() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/tags/`
        );
        setAvailableTags(response.data);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    }

    if (paketId) {
      fetchPackage();
      fetchTags();
    }
  }, [paketId]);

  const handleEdit = () => setIsEditing(true);

  const handleTagToggle = (tag: Tag) => {
    if (!editedPackage) return;

    setEditedPackage((prev) => {
      if (!prev) return null;
      const tagExists = prev.tags.some((t) => t.tag_id === tag.tag_id);
      const updatedTags = tagExists
        ? prev.tags.filter((t) => t.tag_id !== tag.tag_id)
        : [...prev.tags, tag];

      return { ...prev, tags: updatedTags };
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editedPackage) {
      setEditedPackage({ ...editedPackage, [name]: value });
    }
  };

  const handleQuestionChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    if (!editedPackage) return;

    setEditedPackage((prev) => {
      if (!prev) return null;

      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };

      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleAddQuestion = () => {
    if (!editedPackage) return;

    setEditedPackage((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        questions: [...prev.questions, { question: "", answer: "" }],
      };
    });
  };

  const handleDeleteQuestion = (index: number) => {
    if (!editedPackage) return;

    setEditedPackage((prev) => {
      if (!prev) return null;

      const updatedQuestions = prev.questions.filter((_, i) => i !== index);
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleGenerateQuestions = async (data: {
    query_text: string;
    num_questions: number;
    use_rag: boolean;
  }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/questions/generate`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setGeneratedContent({
        result: response.data.result,
        method: response.data.method,
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Gagal menghasilkan pertanyaan. Silakan coba lagi.");
    }
  };

  const addGeneratedQuestions = () => {
    if (!editedPackage || !generatedContent) return;

    setEditedPackage((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        questions: [...prev.questions, ...generatedContent.result.questions],
      };
    });

    setGeneratedContent(null);
    setShowQuestionGenerator(false);
  };

  const saveChanges = async () => {
    if (!editedPackage) return;

    try {
      const payload = {
        id: editedPackage.package_id,
        package_name: editedPackage.package_name,
        user_id: editedPackage.user_id,
        tag_ids: editedPackage.tags.map((tag) => tag.tag_id),
        questions: editedPackage.questions,
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/packages/${paketId}`,
        payload
      );

      setViewingPackage(response.data);
      setEditedPackage(response.data);
      setIsEditing(false);
      alert("Perubahan berhasil disimpan!");
    } catch (err) {
      console.error("Failed to save changes:", err);
      alert("Gagal menyimpan perubahan. Silakan coba lagi.");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Memuat Paket Soal...</div>;
  }

  if (error || !viewingPackage) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4">
          {error || "Paket Soal tidak ditemukan"}
        </h2>
        <Link
          href="/dashboard/manajemen-paket-soal"
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link
          href="/dashboard/manajemen-paket-soal"
          className="mr-4 p-2 rounded-full hover:bg-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-medium">
          {isEditing ? "Edit Paket Soal" : viewingPackage.package_name}
        </h1>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="ml-auto flex items-center gap-1 px-3 py-1 bg-black text-white rounded-md"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        {isEditing ? (
          <div>
            <h2 className="text-lg font-medium">Edit Tag</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {availableTags.map((tag) => (
                <button
                  key={tag.tag_id}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    editedPackage?.tags.some((t) => t.tag_id === tag.tag_id)
                      ? "bg-black text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {tag.tag_name}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="block mb-2">Judul Paket</label>
              <input
                type="text"
                name="package_name"
                value={editedPackage?.package_name || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Daftar Soal</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setShowQuestionGenerator(!showQuestionGenerator)
                    }
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    {showQuestionGenerator
                      ? "Tutup Generator"
                      : "Gunakan Generator Soal"}
                  </button>
                  <button
                    onClick={handleAddQuestion}
                    className="px-3 py-1 bg-black text-white rounded-md text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Tambah Soal
                  </button>
                </div>
              </div>

              {showQuestionGenerator && (
                <div className="mt-4 p-4 border rounded-lg">
                  <h3 className="text-md font-medium mb-3">Generator Soal</h3>
                  <QuestionGenerator onGenerate={handleGenerateQuestions} />

                  {generatedContent && (
                    <div className="mt-4">
                      <GeneratedQuestions
                        result={generatedContent.result}
                        method={generatedContent.method}
                      />
                      <button
                        onClick={addGeneratedQuestions}
                        className="mt-4 px-4 py-2 bg-black text-white rounded-md"
                      >
                        Tambahkan Semua Soal
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4 mt-4">
                {editedPackage?.questions.map((question, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Soal #{index + 1}</h3>
                      <button
                        onClick={() => handleDeleteQuestion(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm mb-1">Pertanyaan:</label>
                      <textarea
                        value={question.question}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "question",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border rounded-md"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Jawaban:</label>
                      <textarea
                        value={question.answer}
                        onChange={(e) =>
                          handleQuestionChange(index, "answer", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setShowQuestionGenerator(false);
                  setGeneratedContent(null);
                }}
                className="px-4 py-2 border rounded-md"
              >
                Batal
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-black text-white rounded-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Simpan
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-medium">Tag</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {viewingPackage.tags.map((tag) => (
                <span
                  key={tag.tag_id}
                  className="bg-gray-200 px-2 py-1 rounded-md text-sm"
                >
                  {tag.tag_name}
                </span>
              ))}
            </div>
            <h2 className="text-lg font-medium mt-6">Daftar Soal</h2>
            {viewingPackage.questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Belum ada soal dalam paket ini.
              </div>
            ) : (
              viewingPackage.questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4 mt-3">
                  <h3 className="font-medium">Soal #{index + 1}</h3>
                  <p className="mt-2">{question.question}</p>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Jawaban:</p>
                    <p>{question.answer}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
