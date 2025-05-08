"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ManajemenTag() {
  const [tags, setTags] = useState<
    { tag_id: number; tag_name: string; user_id: number }[]
  >([]);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/tags");
        setTags(response.data);
      } catch (err) {
        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as {
            response?: { data?: { detail?: string }; status?: number };
          };
          setError(
            axiosError.response?.data?.detail || "Gagal mengambil data."
          );

          if (axiosError.response?.status === 401) {
            router.push("/auth/login");
          }
        } else {
          setError("Terjadi kesalahan tidak dikenal.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [router]);

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    try {
      const response = await api.post("/tags", { tag_name: newTag });
      setTags((prev) => [...prev, response.data]);
      setNewTag("");
    } catch (err) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { detail?: string } } };
        setError(axiosError.response?.data?.detail || "Gagal menambahkan tag");
      }
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    try {
      await api.delete(`/tags/${tagId}`);
      setTags((prev) => prev.filter((tag) => tag.tag_id !== tagId));
    } catch (err) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { detail?: string } } };
        setError(axiosError.response?.data?.detail || "Gagal menghapus tag");
      }
    }
  };
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-medium title-font mb-6">
        Manajemen Tag
      </h1>
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6">
        <p className="section-description">
          Kelola tag untuk soal Anda di sini
        </p>

        {/* Loading & Error Handling */}
        {loading ? (
          <p className="text-sm text-gray-500">Memuat tag...</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : tags.length === 0 ? (
          <p className="text-sm text-gray-500">Tidak ada tag yang tersedia.</p>
        ) : (
          <div className="mt-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <div
                  key={tag.tag_id}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag.tag_name}
                  <button
                    onClick={() => handleDeleteTag(tag.tag_id)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Tag Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tambah tag baru"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}
