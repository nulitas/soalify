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

export default function DashboardSidebar() {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.startsWith("/dashboard/manajemen-paket-soal"))
      return "manajemen-paket-soal";
    if (pathname.startsWith("/dashboard/manajemen-tag")) return "manajemen-tag";
    if (pathname.startsWith("/dashboard/manajemen-dokumen"))
      return "manajemen-dokumen";
    if (pathname.startsWith("/dashboard/pengaturan")) return "pengaturan";
    return "membuat-soal";
  };

  const activeTab = getActiveTab();

  const menuItems = [
    {
      name: "Membuat Soal",
      icon: BookOpen,
      tab: "membuat-soal",
      path: "/dashboard",
    },
    {
      name: "Manajemen Paket Soal",
      icon: Package,
      tab: "manajemen-paket-soal",
      path: "/dashboard/manajemen-paket-soal",
    },
    {
      name: "Manajemen Tag",
      icon: Tag,
      tab: "manajemen-tag",
      path: "/dashboard/manajemen-tag",
    },
    {
      name: "Manajemen Dokumen",
      icon: FileText,
      tab: "manajemen-dokumen",
      path: "/dashboard/manajemen-dokumen",
    },
    {
      name: "Pengaturan",
      icon: Settings,
      tab: "pengaturan",
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
          {menuItems.map((item) => (
            <li key={item.tab}>
              <Link
                href={item.path}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeTab === item.tab
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="button-font">{item.name}</span>
              </Link>
            </li>
          ))}
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
