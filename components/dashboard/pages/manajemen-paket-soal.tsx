"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2, Trash2, X } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ConfirmModal from "@/components/ui/confirm-modal";
import { AlertTriangle } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

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

interface Tag {
  tag_id: number;
  tag_name: string;
  user_id?: number;
}

export default function ManajemenPaketSoal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [paketSoalList, setPaketSoalList] = useState<PaketSoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [, setUserId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const router = useRouter();

  const fetchPackages = useCallback(
    async (userId: number) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get("/packages/", {
          params: { user_id: userId },
        });

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid API response format");
        }

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

        if (axios.isAxiosError(err)) {
          console.log("API Error:", err.response?.data);

          if (axios.isAxiosError(err) && err.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            setTimeout(() => {
              router.push("/auth/login");
            }, 2000);
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const fetchAllTags = async (userId: number) => {
    try {
      setIsLoadingTags(true);
      const response = await api.get("/tags/", {
        params: { user_id: userId },
      });

      const mappedTags = response.data.map(
        (tag: { tag_id: number; tag_name: string; user_id?: number }) => ({
          tag_id: tag.tag_id,
          tag_name: tag.tag_name,
          user_id: tag.user_id,
        })
      );
      setAvailableTags(mappedTags);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
      toast.error("Gagal memuat data tag.");
    } finally {
      setIsLoadingTags(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Anda belum login.");
          toast.error("Anda belum login. Silakan login terlebih dahulu.");
          setIsLoading(false);
          return;
        }

        const userRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userId = userRes.data.user_id;
        setUserId(userId);

        await Promise.all([fetchPackages(userId), fetchAllTags(userId)]);
      } catch (err) {
        console.error("Gagal mengambil user:", err);
        setError("Gagal mengambil data pengguna.");
        toast.error("Gagal mengambil data pengguna. Silakan coba lagi nanti.");
        setIsLoading(false);

        if (axios.isAxiosError(err) && err.response?.status === 401) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        }
      }
    };

    fetchData();
  }, [fetchPackages, router]);

  const confirmDeletePackage = (packageId: number, packageName: string) => {
    setPackageToDelete({ id: packageId, name: packageName });
    setShowDeleteModal(true);
  };

  const handleDeletePackage = async () => {
    if (!packageToDelete) return;

    const loadingToast = toast.loading("Menghapus paket soal...");

    try {
      await api.delete(`/packages/${packageToDelete.id}`);
      setPaketSoalList((prev) =>
        prev.filter((pkg) => pkg.package_id !== packageToDelete.id)
      );
      toast.success("Paket soal berhasil dihapus", { id: loadingToast });
    } catch (err) {
      console.error("Gagal menghapus paket soal:", err);

      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { detail?: string } } };
        const errorMessage =
          axiosError.response?.data?.detail || "Gagal menghapus paket soal";
        setError(errorMessage);
        toast.error(errorMessage, { id: loadingToast });
      } else {
        toast.error("Gagal menghapus paket soal. Silakan coba lagi.", {
          id: loadingToast,
        });
      }
    } finally {
      setShowDeleteModal(false);
      setPackageToDelete(null);
    }
  };

  const handleTagSelect = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const removeTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  const getTagName = (tagId: number) => {
    const tag = availableTags.find((t) => t.tag_id === tagId);
    return tag ? tag.tag_name : "";
  };

  const filteredPackages = paketSoalList.filter((pkg) => {
    const matchesSearch = pkg.package_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      pkg.tags.some((tag) => selectedTags.includes(tag.tag_id));

    return matchesSearch && matchesTags;
  });

  return (
    <div>
      {/* Toast container */}
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "#10B981",
              color: "white",
              fontWeight: "500",
            },
          },
          error: {
            style: {
              background: "#EF4444",
              color: "white",
              fontWeight: "500",
            },
          },
          loading: {
            style: {
              background: "#3B82F6",
              color: "white",
              fontWeight: "500",
            },
          },
        }}
      />

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
        <div className="mb-6">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Cari paket soal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter berdasarkan tag:
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {isLoadingTags ? (
                <span className="text-sm text-gray-500">Memuat tag...</span>
              ) : (
                <select
                  className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={(e) => {
                    if (e.target.value)
                      handleTagSelect(parseInt(e.target.value));
                    e.target.value = "";
                  }}
                  value=""
                >
                  <option value="">Pilih tag...</option>
                  {availableTags.map((tag) => (
                    <option
                      key={tag.tag_id}
                      value={tag.tag_id}
                      disabled={selectedTags.includes(tag.tag_id)}
                    >
                      {tag.tag_name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tagId) => (
                  <div
                    key={tagId}
                    className="flex items-center bg-gray-100 px-3 py-1 rounded-md"
                  >
                    <span className="text-sm mr-2">{getTagName(tagId)}</span>
                    <button
                      onClick={() => removeTag(tagId)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => setSelectedTags([])}
                >
                  Hapus semua filter
                </button>
              </div>
            )}
          </div>
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
                  onClick={(e) => {
                    e.preventDefault(); // Prevent link navigation
                    confirmDeletePackage(paket.package_id, paket.package_name);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && packageToDelete && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setPackageToDelete(null);
          }}
          onConfirm={handleDeletePackage}
          title="Hapus Paket Soal"
          message={`Apakah Anda yakin ingin menghapus paket soal "${packageToDelete.name}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus"
          cancelText="Batal"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
        />
      )}
    </div>
  );
}
