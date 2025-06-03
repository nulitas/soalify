"use client";

import { useState } from "react";
import axios from "axios";
import { Save, Plus, Trash, AlertTriangle } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/confirm-modal";
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

interface EditPaketSoalProps {
  paketData: PaketSoal;
  availableTags: Tag[];
  paketId: number;
  onSaveSuccess: (updatedPackage: PaketSoal) => void;
  onCancel: () => void;
  handleApiError: (error: unknown) => void;
}

export default function EditPaketSoal({
  paketData,
  availableTags,
  paketId,
  onSaveSuccess,
  onCancel,
  handleApiError,
}: EditPaketSoalProps) {
  const [editedPackage, setEditedPackage] = useState<PaketSoal>({
    ...paketData,
  });
  const [showQuestionGenerator, setShowQuestionGenerator] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    result: { questions: Question[] };
    method: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<{
    index: number;
    question: string;
  } | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleTagToggle = (tag: Tag) => {
    const tagExists = editedPackage.tags.some((t) => t.tag_id === tag.tag_id);
    const updatedTags = tagExists
      ? editedPackage.tags.filter((t) => t.tag_id !== tag.tag_id)
      : [...editedPackage.tags, tag];

    setEditedPackage({ ...editedPackage, tags: updatedTags });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedPackage({ ...editedPackage, [name]: value });
  };

  const handleQuestionChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updatedQuestions = [...editedPackage.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };

    setEditedPackage({ ...editedPackage, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setEditedPackage({
      ...editedPackage,
      questions: [...editedPackage.questions, { question: "", answer: "" }],
    });

    toast.success("Soal baru ditambahkan");
  };

  const confirmDeleteQuestion = (index: number, question: string) => {
    setQuestionToDelete({ index, question });
    setShowDeleteModal(true);
  };

  const handleDeleteQuestion = () => {
    if (questionToDelete === null) return;

    const loadingToast = toast.loading("Menghapus soal...");

    const updatedQuestions = editedPackage.questions.filter(
      (_, i) => i !== questionToDelete.index
    );

    setEditedPackage({
      ...editedPackage,
      questions: updatedQuestions,
    });

    toast.success("Soal berhasil dihapus", { id: loadingToast });
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };

  const handleGenerateQuestions = async (data: {
    query_text: string;
    num_questions: number;
    use_rag: boolean;
  }) => {
    try {
      // const loadingToast = toast.loading("Menghasilkan soal...");

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

      // toast.success(
      //   `Berhasil menghasilkan ${response.data.result.questions.length} soal`,
      //   { id: loadingToast }
      // );
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Gagal menghasilkan pertanyaan. Silakan coba lagi.");
    }
  };

  const addGeneratedQuestions = () => {
    if (!generatedContent) return;

    const loadingToast = toast.loading("Menambahkan soal yang dihasilkan...");

    setEditedPackage({
      ...editedPackage,
      questions: [
        ...editedPackage.questions,
        ...generatedContent.result.questions,
      ],
    });

    setGeneratedContent(null);
    setShowQuestionGenerator(false);
    toast.success("Soal berhasil ditambahkan", { id: loadingToast });
  };

  const confirmCancel = () => {
    if (JSON.stringify(paketData) !== JSON.stringify(editedPackage)) {
      setShowCancelModal(true);
    } else {
      onCancel();
    }
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      const loadingToast = toast.loading("Menyimpan perubahan...");

      const payload = {
        package_name: editedPackage.package_name,
        tag_ids: editedPackage.tags.map((tag) => tag.tag_id),
        questions: editedPackage.questions,
      };

      const { data } = await api.put(`/packages/${paketId}`, payload);
      onSaveSuccess(data);
      toast.success("Perubahan berhasil disimpan!", { id: loadingToast });
    } catch (err) {
      handleApiError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium">Edit Tag</h2>
      <div className="flex flex-wrap gap-2 mt-3">
        {availableTags.map((tag) => (
          <button
            key={tag.tag_id}
            onClick={() => handleTagToggle(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              editedPackage.tags.some((t) => t.tag_id === tag.tag_id)
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
          value={editedPackage.package_name}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Daftar Soal</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowQuestionGenerator(!showQuestionGenerator)}
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
          {editedPackage.questions.map((question, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Soal #{index + 1}</h3>
                <button
                  onClick={() =>
                    confirmDeleteQuestion(
                      index,
                      question.question.substring(0, 30) + "..."
                    )
                  }
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
                    handleQuestionChange(index, "question", e.target.value)
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
        <button onClick={confirmCancel} className="px-4 py-2 border rounded-md">
          Batal
        </button>
        <button
          onClick={saveChanges}
          disabled={saving}
          className="px-4 py-2 bg-black text-white rounded-md flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <div className="flex items-center">
              <svg
                className="animate-spin h-4 w-4 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Menyimpan...
            </div>
          ) : (
            <>
              <Save className="w-4 h-4" /> Simpan
            </>
          )}
        </button>
      </div>

      {/* Delete Question Confirmation Modal */}
      {showDeleteModal && questionToDelete && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setQuestionToDelete(null);
          }}
          onConfirm={handleDeleteQuestion}
          title="Hapus Soal"
          message={`Apakah Anda yakin ingin menghapus soal "${questionToDelete.question}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus"
          cancelText="Batal"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
        />
      )}

      {/* Cancel Edit Confirmation Modal */}
      {showCancelModal && (
        <ConfirmModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={onCancel}
          title="Batalkan Perubahan"
          message="Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin membatalkan perubahan?"
          confirmText="Ya, Batalkan"
          cancelText="Tidak, Lanjutkan Edit"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
        />
      )}
    </div>
  );
}
