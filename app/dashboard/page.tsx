"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";

import MembuatSoal from "@/components/dashboard/pages/membuat-soal";
import ManajemenPaketSoal from "@/components/dashboard/pages/manajemen-paket-soal";
import ManajemenTag from "@/components/dashboard/pages/manajemen-tag";
import ManajemenDokumen from "@/components/dashboard/pages/manajemen-dokumen";
import Pengaturan from "@/components/dashboard/pages/pengaturan";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<
    | "membuat-soal"
    | "manajemen-paket-soal"
    | "manajemen-tag"
    | "manajemen-dokumen"
    | "pengaturan"
  >("membuat-soal");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "membuat-soal":
        return <MembuatSoal />;
      case "manajemen-paket-soal":
        return <ManajemenPaketSoal />;
      case "manajemen-tag":
        return <ManajemenTag />;
      case "manajemen-dokumen":
        return <ManajemenDokumen />;
      case "pengaturan":
        return <Pengaturan />;
      default:
        return <MembuatSoal />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7f3] flex">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main content area */}
      <div className="flex-1 w-full md:ml-64">
        <DashboardHeader
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }}
        />

        <main className="p-4 md:p-6 mt-24 md:mt-16">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
