"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface PaketSoal {
  package_id: number;
  package_name: string;
  tags: {
    tag_id: number;
    tag_name: string;
  }[];
  questions: {
    question: string;
    answer: string;
  }[];
}

export default function ManajemenPaketSoal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [paketSoalList, setPaketSoalList] = useState<PaketSoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/packages/`
      );
      const formattedData = response.data.map(
        (pkg: {
          id: number;
          package_name: string;
          tags?: { tag_id: number; tag_name: string }[];
          questions?: { question: string; answer: string }[];
        }) => ({
          package_id: pkg.id,
          package_name: pkg.package_name,
          tags: pkg.tags || [],
          questions: pkg.questions || [],
        })
      );
      setPaketSoalList(formattedData);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
      setError("Gagal memuat data paket soal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePackage = async (packageId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus paket ini?")) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/packages/${packageId}`
      );
      setPaketSoalList((prev) =>
        prev.filter((pkg) => pkg.package_id !== packageId)
      );
    } catch (err) {
      console.error("Gagal menghapus paket soal:", err);
      alert("Gagal menghapus paket soal. Silakan coba lagi.");
    }
  };

  const filteredPackages = paketSoalList.filter((pkg) =>
    pkg.package_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-medium title-font">
          Manajemen Paket Soal
        </h1>
        <Link
          href="/dashboard/manajemen-paket-soal/tambah"
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Buat Paket Baru
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6">
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Cari paket soal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Tidak ada paket soal yang ditemukan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPackages.map((paket) => (
              <div
                key={paket.package_id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer block relative"
              >
                <Link
                  href={`/dashboard/manajemen-paket-soal/${paket.package_id}`}
                >
                  <h3 className="font-medium mb-3">{paket.package_name}</h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {paket.tags.length > 0 ? (
                      paket.tags.map((tag) => (
                        <span
                          key={`${paket.package_id}-${tag.tag_id}`}
                          className="bg-gray-100 text-xs px-2 py-0.5 rounded-md"
                        >
                          {tag.tag_name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">
                        Tidak ada tag
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{paket.questions.length} soal</span>
                  </div>
                </Link>
                <button
                  onClick={() => deletePackage(paket.package_id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
