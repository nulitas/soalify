"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Edit, Save } from "lucide-react";
import Link from "next/link";

interface Tag {
  tag_id: number;
  tag_name: string;
  user_id: number;
}

interface PaketSoal {
  package_id: number;
  package_name: string;
  user_id: number;
  tags: Tag[];
  questions: {
    question: string;
    answer: string;
  }[];
}

interface PaketSoalDetailProps {
  paketId: number;
}

export default function PaketSoalDetail({ paketId }: PaketSoalDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPackage, setEditedPackage] = useState<PaketSoal | null>(null);
  const [viewingPackage, setViewingPackage] = useState<PaketSoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    if (paketId) {
      fetchPackage();
    }
  }, [paketId]);

  const handleEdit = () => setIsEditing(true);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editedPackage) {
      setEditedPackage({ ...editedPackage, [name]: value });
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    if (editedPackage) {
      setEditedPackage({
        ...editedPackage,
        tags: tagsString.split(",").map((tag, index) => ({
          tag_id: index + 1,
          tag_name: tag.trim(),
          user_id: editedPackage.user_id,
        })),
      });
    }
  };

  const saveChanges = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/packages/${paketId}`,
        editedPackage
      );
      setViewingPackage(editedPackage);
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
            <label className="block mb-2">Judul Paket</label>
            <input
              type="text"
              name="package_name"
              value={editedPackage?.package_name || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            <label className="block mt-4 mb-2">
              Tag (pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={editedPackage?.tags.join(", ") || ""}
              onChange={handleTagChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsEditing(false)}
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
            <h2 className="text-lg font-medium">Informasi Paket</h2>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Tag:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {viewingPackage.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-2 py-1 rounded-md text-sm"
                  >
                    {tag.tag_name}{" "}
                  </span>
                ))}
              </div>
            </div>
            <h2 className="text-lg font-medium mt-6">Daftar Soal</h2>
            {viewingPackage.questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4 mt-3">
                <h3 className="font-medium">Soal #{index + 1}</h3>
                <p className="mt-2">{question.question}</p>
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Jawaban:</p>
                  <p>{question.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
