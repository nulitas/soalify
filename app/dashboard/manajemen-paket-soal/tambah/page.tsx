"use client";

import { useState, useEffect } from "react";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import axios from "axios";

interface Tag {
  tag_id: number;
  tag_name: string;
}
export default function TambahPaketSoal() {
  const router = useRouter();
  const [packageName, setPackageName] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/tags/");
        setAvailableTags(response.data);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
        setError("Gagal memuat tag. Silakan coba lagi.");
      }
    };
    fetchTags();
  }, []);

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const savePackage = async () => {
    if (!packageName.trim()) {
      setError("Nama paket harus diisi");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const newPackage = {
        package_name: packageName,
        tag_ids: selectedTags,
      };

      await api.post("/packages/", newPackage);
      router.push("/dashboard/manajemen-paket-soal");
    } catch (err) {
      console.error("Failed to create package:", err);
      setError("Gagal menambahkan paket soal. Silakan coba lagi.");

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          router.push("/login");
        }
      } else if (err instanceof Error) {
        console.log("Generic error:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link
          href="/dashboard/manajemen-paket-soal"
          className="mr-4 p-2 rounded-full hover:bg-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-medium">Tambah Paket Soal</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nama Paket</label>
          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Masukkan nama paket soal"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tag</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.tag_id}
                onClick={() => handleTagToggle(tag.tag_id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag.tag_id)
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                {tag.tag_name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={savePackage}
            className="px-4 py-2 bg-black text-white rounded-md flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              "Menyimpan..."
            ) : (
              <>
                <Save className="w-4 h-4" /> Simpan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
