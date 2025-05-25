"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

import DashboardSidebar from "@/components/ui/dashboard-sidebar";
import DashboardHeader from "@/components/ui/dashboard-header";

export type DashboardTab =
  | "membuat-soal"
  | "manajemen-paket-soal"
  | "manajemen-pengguna"
  | "manajemen-tag"
  | "manajemen-dokumen"
  | "pengaturan";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("membuat-soal");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f9f7f3]">
        <div className="font-medium text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f7f3] flex">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <DashboardSidebar />
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
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
