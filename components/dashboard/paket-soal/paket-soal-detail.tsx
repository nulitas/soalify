"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

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

import ViewPaketSoal from "@/components/dashboard/paket-soal/view-paket-soal";
import EditPaketSoal from "../paket-soal/edit-paket-soal";
export default function PaketSoalDetail({ paketId }: PaketSoalDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [packageData, setPackageData] = useState<PaketSoal | null>(null);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleApiError = useCallback(
    (error: unknown) => {
      const isAxiosError = (
        err: unknown
      ): err is {
        response?: { data?: { detail?: string }; status?: number };
      } => {
        return (err as { isAxiosError?: boolean }).isAxiosError === true;
      };

      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.detail || "Terjadi kesalahan pada server";
        setError(errorMessage);
        toast.error(errorMessage);

        if (error.response?.status === 401) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } else if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        const errorMessage = "Terjadi kesalahan tidak dikenal";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [router]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [packageRes, tagsRes] = await Promise.all([
          api.get(`/packages/${paketId}`),
          api.get("/tags"),
        ]);

        if (!packageRes.data.user_id) {
          toast.error("Paket soal tidak ditemukan");
          router.push("/dashboard/manajemen-paket-soal");
          return;
        }

        setPackageData(packageRes.data);
        setAvailableTags(tagsRes.data);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    if (paketId) fetchData();
  }, [paketId, router, handleApiError]);

  const handleEdit = () => setIsEditing(true);

  const handleSaveSuccess = (updatedPackage: PaketSoal) => {
    setPackageData(updatedPackage);
    setIsEditing(false);
    toast.success("Perubahan berhasil disimpan!");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading) {
    return <div className="text-center py-12">Memuat Paket Soal...</div>;
  }

  if (error || !packageData) {
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

      <div className="flex items-center mb-6">
        <Link
          href="/dashboard/manajemen-paket-soal"
          className="mr-4 p-2 rounded-full hover:bg-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-medium">
          {isEditing ? "Edit Paket Soal" : packageData.package_name}
        </h1>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        {isEditing ? (
          <EditPaketSoal
            paketData={packageData}
            availableTags={availableTags}
            onSaveSuccess={handleSaveSuccess}
            onCancel={handleCancelEdit}
            paketId={paketId}
            handleApiError={handleApiError}
          />
        ) : (
          <ViewPaketSoal paketData={packageData} onEdit={handleEdit} />
        )}
      </div>
    </div>
  );
}
