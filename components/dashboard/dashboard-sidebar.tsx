"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  History,
  Settings,
  LogOut,
  ChevronRight,
  Home,
} from "lucide-react";

interface DashboardSidebarProps {
  activeTab: "generate" | "history" | "settings";
  setActiveTab: (tab: "generate" | "history" | "settings") => void;
}

export default function DashboardSidebar({
  activeTab,
  setActiveTab,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Membuat Soal",
      icon: BookOpen,
      tab: "generate" as const,
    },
    {
      name: "Riwayat Soal",
      icon: History,
      tab: "history" as const,
    },
    {
      name: "Pengaturan",
      icon: Settings,
      tab: "settings" as const,
    },
  ];

  return (
    <div
      className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <Link
          href="/dashboard"
          className={`title-font font-medium ${collapsed ? "hidden" : "block"}`}
        >
          Soalify
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          <ChevronRight
            className={`w-5 h-5 transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.tab}>
              <button
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeTab === item.tab
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`button-font ${collapsed ? "hidden" : "block"}`}
                >
                  {item.name}
                </span>
              </button>
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
            <span className={`button-font ${collapsed ? "hidden" : "block"}`}>
              Home
            </span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`button-font ${collapsed ? "hidden" : "block"}`}>
              Logout
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
