"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import ConfirmModal from "@/components/ui/confirm-modal";
import { AlertTriangle } from "lucide-react";

export default function ManajemenTag() {
  const [tags, setTags] = useState<
    { tag_id: number; tag_name: string; user_id: number }[]
  >([]);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTag, setEditingTag] = useState<{
    id: number | null;
    name: string;
  }>({ id: null, name: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
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
          const errorMessage =
            axiosError.response?.data?.detail || "Gagal mengambil data.";

          setError(errorMessage);
          toast.error(errorMessage);

          if (axiosError.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            setTimeout(() => {
              router.push("/auth/login");
            }, 2000);
          }
        } else {
          const errorMessage = "Terjadi kesalahan tidak dikenal.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [router]);

  const handleAddTag = async () => {
    if (!newTag.trim()) {
      toast.error("Nama tag tidak boleh kosong");
      return;
    }

    const loadingToast = toast.loading("Menambahkan tag...");

    try {
      const response = await api.post("/tags", { tag_name: newTag });
      setTags((prev) => [...prev, response.data]);
      setNewTag("");
      setError("");
      toast.success("Tag berhasil ditambahkan", { id: loadingToast });
    } catch (err) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { detail?: string } } };
        const errorMessage =
          axiosError.response?.data?.detail || "Gagal menambahkan tag";
        setError(errorMessage);
        toast.error(errorMessage, { id: loadingToast });
      } else {
        toast.error("Gagal menambahkan tag", { id: loadingToast });
      }
    }
  };

  const confirmDeleteTag = (tagId: number, tagName: string) => {
    setTagToDelete({ id: tagId, name: tagName });
    setShowDeleteModal(true);
  };

  const handleDeleteTag = async () => {
    if (!tagToDelete) return;

    const loadingToast = toast.loading("Menghapus tag...");

    try {
      await api.delete(`/tags/${tagToDelete.id}`);
      setTags((prev) => prev.filter((tag) => tag.tag_id !== tagToDelete.id));
      setError("");
      toast.success("Tag berhasil dihapus", { id: loadingToast });
    } catch (err) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { detail?: string } } };
        const errorMessage =
          axiosError.response?.data?.detail || "Gagal menghapus tag";
        setError(errorMessage);
        toast.error(errorMessage, { id: loadingToast });
      } else {
        toast.error("Gagal menghapus tag", { id: loadingToast });
      }
    } finally {
      setShowDeleteModal(false);
      setTagToDelete(null);
    }
  };

  const handleStartEdit = (tagId: number, tagName: string) => {
    setEditingTag({ id: tagId, name: tagName });
  };

  const handleCancelEdit = () => {
    setEditingTag({ id: null, name: "" });
  };

  const handleUpdateTag = async () => {
    if (!editingTag.id || !editingTag.name.trim()) {
      toast.error("Nama tag tidak boleh kosong");
      return;
    }

    const loadingToast = toast.loading("Memperbarui tag...");

    try {
      const response = await api.put(`/tags/${editingTag.id}`, {
        tag_name: editingTag.name,
      });

      setTags((prev) =>
        prev.map((tag) =>
          tag.tag_id === editingTag.id
            ? { ...tag, tag_name: response.data.tag_name }
            : tag
        )
      );
      setEditingTag({ id: null, name: "" });
      setError("");
      toast.success("Tag berhasil diperbarui", { id: loadingToast });
    } catch (err) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { detail?: string } } };
        const errorMessage =
          axiosError.response?.data?.detail || "Gagal memperbarui tag";
        setError(errorMessage);
        toast.error(errorMessage, { id: loadingToast });
      } else {
        toast.error("Gagal memperbarui tag", { id: loadingToast });
      }
    }
  };

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
                  {editingTag.id === tag.tag_id ? (
                    <>
                      <input
                        type="text"
                        value={editingTag.name}
                        onChange={(e) =>
                          setEditingTag({ ...editingTag, name: e.target.value })
                        }
                        className="bg-transparent outline-none w-24"
                        autoFocus
                      />
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={handleUpdateTag}
                          className="text-green-500 hover:text-green-700"
                          title="Simpan"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-500 hover:text-gray-700"
                          title="Batal"
                        >
                          ×
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {tag.tag_name}
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() =>
                            handleStartEdit(tag.tag_id, tag.tag_name)
                          }
                          className="text-gray-500 hover:text-blue-500"
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() =>
                            confirmDeleteTag(tag.tag_id, tag.tag_name)
                          }
                          className="text-gray-500 hover:text-red-500"
                          title="Hapus"
                        >
                          ×
                        </button>
                      </div>
                    </>
                  )}
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
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddTag();
              }
            }}
          />
          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Tambah
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && tagToDelete && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setTagToDelete(null);
          }}
          onConfirm={handleDeleteTag}
          title="Hapus Tag"
          message={`Apakah Anda yakin ingin menghapus tag "${tagToDelete.name}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus"
          cancelText="Batal"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
        />
      )}
    </div>
  );
}
