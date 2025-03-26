"use client";

import Link from "next/link";
import {
  User,
  BookOpen,
  Package,
  Tag,
  FileText,
  Settings,
  LogOut,
  Home,
} from "lucide-react";

interface DashboardHeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  activeTab:
    | "membuat-soal"
    | "manajemen-paket-soal"
    | "manajemen-tag"
    | "manajemen-dokumen"
    | "pengaturan";
  setActiveTab: (
    tab:
      | "membuat-soal"
      | "manajemen-paket-soal"
      | "manajemen-tag"
      | "manajemen-dokumen"
      | "pengaturan"
  ) => void;
}

export default function DashboardHeader({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeTab,
  setActiveTab,
}: DashboardHeaderProps) {
  const menuItems = [
    {
      name: "Membuat Soal",
      icon: BookOpen,
      tab: "membuat-soal" as const,
    },
    {
      name: "Manajemen Paket Soal",
      icon: Package,
      tab: "manajemen-paket-soal" as const,
    },
    {
      name: "Manajemen Tag",
      icon: Tag,
      tab: "manajemen-tag" as const,
    },
    {
      name: "Manajemen Dokumen",
      icon: FileText,
      tab: "manajemen-dokumen" as const,
    },
    {
      name: "Pengaturan",
      icon: Settings,
      tab: "pengaturan" as const,
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 py-4 px-4 md:px-6 md:ml-64">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="text-xl font-medium title-font">
            Soalify
          </Link>

          {/* Desktop Search */}

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium title-font">Andra</p>
                <p className="text-xs text-gray-500">Pengguna</p>
              </div>
            </div>

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
              {menuItems.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`flex items-center gap-3 py-2 text-left ${
                    activeTab === item.tab ? "font-medium" : ""
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="nav-text">{item.name}</span>
                </button>
              ))}
              <div className="h-px bg-gray-200 my-2"></div>
              <Link
                href="/"
                className="flex items-center gap-3 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span className="nav-text">Home</span>
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center gap-3 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogOut className="w-5 h-5" />
                <span className="nav-text">Logout</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
