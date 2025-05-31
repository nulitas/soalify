"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Package,
  Tag,
  FileText,
  Settings,
  LogOut,
  Home,
  AlertTriangle,
  Users,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ConfirmModal from "@/components/ui/confirm-modal";

import { useAuth } from "@/context/auth-context";

interface DashboardHeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  activeTab:
    | "membuat-soal"
    | "manajemen-paket-soal"
    | "manajemen-tag"
    | "manajemen-dokumen"
    | "manajemen-pengguna"
    | "pengaturan";
  setActiveTab: (
    tab:
      | "membuat-soal"
      | "manajemen-paket-soal"
      | "manajemen-tag"
      | "manajemen-dokumen"
      | "manajemen-pengguna"
      | "pengaturan"
  ) => void;
}

export default function DashboardHeader({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeTab,
  setActiveTab,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { user, logout } = useAuth();

  const isInPaketSoal = pathname.includes("/manajemen-paket-soal");
  const userRole = user?.role_id ?? 2;

  const menuItems = [
    {
      name: "Membuat Soal",
      icon: BookOpen,
      tab: "membuat-soal" as const,
      path: "/dashboard",
    },
    {
      name: "Manajemen Paket Soal",
      icon: Package,
      tab: "manajemen-paket-soal" as const,
      path: "/dashboard/manajemen-paket-soal",
    },
    {
      name: "Manajemen Tag",
      icon: Tag,
      tab: "manajemen-tag" as const,
      path: "/dashboard/manajemen-tag",
    },
    {
      name: "Manajemen Dokumen",
      icon: FileText,
      tab: "manajemen-dokumen" as const,
      path: "/dashboard/manajemen-dokumen",
    },
    ...(userRole === 1
      ? [
          {
            name: "Manajemen Pengguna",
            icon: Users,
            tab: "manajemen-pengguna" as const,
            path: "/dashboard/manajemen-pengguna",
          },
        ]
      : []),
    {
      name: "Pengaturan",
      icon: Settings,
      tab: "pengaturan" as const,
      path: "/dashboard/pengaturan",
    },
  ];

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = () => {
    const loadingToast = toast.loading("Sedang keluar...");

    logout();

    toast.success("Berhasil keluar!", { id: loadingToast });
    setShowLogoutModal(false);
  };

  const handleHomeClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <>
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

      <header className="md:static md:border-none md:py-0 fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 py-4 px-4 md:px-6 md:ml-64">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isMobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 12h16M4 6h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white px-4 py-4 shadow-md">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => {
                const isActive =
                  item.tab === activeTab ||
                  (item.tab === "manajemen-paket-soal" && isInPaketSoal);

                return (
                  <Link
                    key={item.tab}
                    href={item.path}
                    onClick={() => {
                      setActiveTab(item.tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 py-2 text-left ${
                      isActive ? "font-medium" : ""
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="nav-text">{item.name}</span>
                  </Link>
                );
              })}
              <div className="h-px bg-gray-200 my-2"></div>
              <button
                onClick={() => {
                  handleHomeClick({ preventDefault: () => {} });
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 py-2 text-left w-full"
              >
                <Home className="w-5 h-5" />
                <span className="nav-text">Halaman Utama</span>
              </button>
              <button
                onClick={() => {
                  confirmLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 py-2 text-left w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="nav-text">Keluar</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {showLogoutModal && (
        <ConfirmModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          title="Konfirmasi Keluar"
          message="Apakah Anda yakin ingin keluar dari aplikasi?"
          confirmText="Keluar"
          cancelText="Batal"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
        />
      )}
    </>
  );
}
