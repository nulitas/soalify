"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Package,
  Tag,
  FileText,
  Settings,
  LogOut,
  Home,
} from "lucide-react";

interface DashboardSidebarProps {
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

export default function DashboardSidebar({
  activeTab,
  setActiveTab,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const isInPaketSoal = pathname.includes("/manajemen-paket-soal");

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
    {
      name: "Pengaturan",
      icon: Settings,
      tab: "pengaturan" as const,
      path: "/dashboard/pengaturan",
    },
  ];

  return (
    <div className="bg-white border-r border-gray-200 fixed top-0 left-0 h-screen w-64 flex flex-col z-40">
      <div className="p-4 border-b border-gray-200">
        <Link href="/dashboard" className="title-font font-medium text-xl">
          Soalify
        </Link>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const isActive =
              item.tab === activeTab ||
              (item.tab === "manajemen-paket-soal" && isInPaketSoal);

            return (
              <li key={item.tab}>
                <Link
                  href={item.path}
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                    isActive ? "bg-black text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="button-font">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span className="button-font">Home</span>
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="button-font">Keluar</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
