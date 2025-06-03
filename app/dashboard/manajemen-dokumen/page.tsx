"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { FileText, Upload, Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorMessage from "@/components/ui/error-message";
import ConfirmModal from "@/components/ui/confirm-modal";

interface UserData {
  user_id: number;
  fullname: string;
  email: string;
  role_id: number;
}

export default function ManajemenDokumen() {
  const router = useRouter();
  const [documents, setDocuments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

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
          displayMessage =
            err.response?.data?.detail || err.message || contextMessage;
        }
      } else if (err instanceof Error) {
        displayMessage = err.message;
      }

      setError(displayMessage);
      if (!isSessionExpired) {
        toast.error(displayMessage);
      }
      console.error(`Error (${contextMessage}):`, err);
    },
    [router]
  );

  const fetchUserData = useCallback(async () => {
    setUserLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleApiError(
          { response: { status: 401 } } as { response: { status: number } },
          "Autentikasi diperlukan."
        );
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get<UserData>(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        config
      );
      setUserData(response.data);
    } catch (err: unknown) {
      handleApiError(err, "Gagal memuat data pengguna.");
    } finally {
      setUserLoading(false);
    }
  }, [handleApiError]);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleApiError(
          { response: { status: 401 } } as { response: { status: number } },
          "Autentikasi diperlukan untuk melihat dokumen."
        );
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/database/documents`,
        config
      );
      setDocuments(response.data.document_sources || []);
    } catch (err: unknown) {
      handleApiError(err, "Gagal mengambil daftar dokumen.");
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  useEffect(() => {
    fetchUserData();
    fetchDocuments();
  }, [fetchUserData, fetchDocuments]);

  const executeDelete = async () => {
    if (!documentToDelete) return;

    const filename = documentToDelete;
    const originalDocuments = [...documents];
    setDocuments((prevDocs) => prevDocs.filter((doc) => doc !== filename));
    setError(null);
    const loadingToastId = toast.loading(`Menghapus ${filename}...`);
    setShowDeleteModal(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleApiError(
          { response: { status: 401 } } as { response: { status: number } },
          "Autentikasi diperlukan untuk menghapus dokumen."
        );
        setDocuments(originalDocuments);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/database/source/${filename}`,
        config
      );
      toast.success(`Dokumen "${filename}" berhasil dihapus.`, {
        id: loadingToastId,
      });
      setDocumentToDelete(null);
    } catch (err: unknown) {
      toast.dismiss(loadingToastId);
      handleApiError(err, `Gagal menghapus dokumen "${filename}".`);
      setDocuments(originalDocuments);
      setDocumentToDelete(null);
    }
  };

  const confirmDeleteDocument = (filename: string) => {
    setDocumentToDelete(filename);
    setShowDeleteModal(true);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Hanya file PDF yang diperbolehkan.");
      return;
    }

    const formData = new FormData();
    formData.append("files", file);

    setUploading(true);
    setError(null);
    const loadingToastId = toast.loading(`Mengunggah ${file.name}...`);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleApiError(
          { response: { status: 401 } } as { response: { status: number } },
          "Autentikasi diperlukan untuk mengunggah dokumen."
        );
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/database/upload-documents`,
        formData,
        config
      );
      toast.success(`Dokumen "${file.name}" berhasil diunggah!`, {
        id: loadingToastId,
      });
      fetchDocuments();
    } catch (err: unknown) {
      toast.dismiss(loadingToastId);
      handleApiError(err, `Gagal mengunggah dokumen "${file.name}".`);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const isAdmin = userData?.role_id === 1;

  return (
    <div>
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
      <h1 className="text-2xl md:text-3xl font-medium title-font mb-6">
        Manajemen Dokumen
      </h1>
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6">
        <p className="section-description mb-4">
          Kelola dokumen sumber soal di sini
        </p>

        <ErrorMessage message={error} />

        {isAdmin && (
          <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <Upload className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Unggah Dokumen (PDF)</h3>
            <p className="text-sm text-gray-500 mb-4">
              Seret dan lepas file PDF di sini, atau klik untuk memilih.
            </p>
            <label
              className={`px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors cursor-pointer ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "Mengunggah..." : "Pilih File"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Dokumen Yang Tersedia</h3>
          {loading || userLoading ? (
            <div className="flex justify-center items-center py-10">
              <LoadingSpinner message="Memuat dokumen..." />
            </div>
          ) : !error ? (
            <>
              {documents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Silakan minta admin untuk mengupload dokumen.
                </p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />
                        <p className="font-medium break-all">{doc}</p>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => confirmDeleteDocument(doc)}
                          className="p-2 text-gray-500 hover:text-red-500 ml-2"
                          title={`Hapus ${doc}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      {showDeleteModal && documentToDelete && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDocumentToDelete(null);
          }}
          onConfirm={executeDelete}
          title="Konfirmasi Hapus Dokumen"
          message={`Apakah Anda yakin ingin menghapus dokumen "${documentToDelete}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus"
          cancelText="Batal"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
        />
      )}
    </div>
  );
}
