"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Upload, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/loading-spinner";
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
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setUserLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No auth token found");
          router.push("/login");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get<UserData>(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          config
        );

        setUserData(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
          }
        }
      } finally {
        setUserLoading(false);
      }
    };

    fetchDocuments();
    fetchUserData();
  }, [router]);

  const fetchDocuments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/database/documents`
      );
      setDocuments(response.data.document_sources || []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Gagal mengambil dokumen");
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${filename}?`)) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/database/source/${filename}`
      );
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc !== filename));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.detail || "Gagal menghapus dokumen");
      } else {
        alert("Terjadi kesalahan yang tidak diketahui.");
      }
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Hanya file PDF yang diperbolehkan.");
      return;
    }

    const formData = new FormData();
    formData.append("files", file);

    setUploading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/database/upload-documents`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Dokumen berhasil diunggah!");
      fetchDocuments();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.detail || "Gagal mengunggah dokumen");
      } else {
        alert("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setUploading(false);
    }
  };

  const isAdmin = userData?.role_id === 1;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-medium title-font mb-6">
        Manajemen Dokumen
      </h1>
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6">
        <p className="section-description">
          Kelola dokumen sumber soal di sini
        </p>

        {/* Upload section  */}
        {isAdmin && (
          <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <Upload className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Unggah Dokumen</h3>
            <p className="text-sm text-gray-500 mb-4">
              Seret dan lepas file PDF di sini
            </p>

            <label className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors cursor-pointer">
              {uploading ? "Mengunggah..." : "Pilih File"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleUpload}
              />
            </label>
          </div>
        )}

        {/* Document list */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Dokumen Yang Tersedia</h3>

          {loading || userLoading ? (
            <LoadingSpinner message="Memuat dokumen..." />
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-gray-500">
              Tidak ada dokumen yang tersedia.
            </p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-3 text-gray-500" />
                    <p className="font-medium">{doc}</p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(doc)}
                      className="p-2 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
