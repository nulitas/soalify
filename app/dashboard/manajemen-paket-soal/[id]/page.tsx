"use client";

import { useParams } from "next/navigation";
import PaketSoalDetail from "@/components/dashboard/pages/paket-soal-detail";

export default function PaketSoalDetailPage() {
  const params = useParams();
  const paketId = params?.id ? parseInt(params.id as string) : null;

  if (!paketId) {
    return <div>Paket Soal tidak ditemukan.</div>;
  }

  return <PaketSoalDetail paketId={paketId} />;
}
