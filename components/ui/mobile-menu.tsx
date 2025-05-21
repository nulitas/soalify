"use client";

import { BookOpen, History, Settings, Home, LogOut, X } from "lucide-react";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab: "generate" | "history" | "settings";
  setActiveTab: (tab: "generate" | "history" | "settings") => void;
}

export default function MobileMenu({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
}: MobileMenuProps) {
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

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-40 bg-white">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="text-lg font-medium title-font">Menu</div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu items */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center gap-4 p-4 rounded-md transition-colors ${
                  activeTab === item.tab
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-base button-font">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-1">
            <Link
              href="/"
              className="w-full flex items-center gap-4 p-4 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Home className="w-6 h-6" />
              <span className="text-base button-font">Home</span>
            </Link>
            <Link
              href="/login"
              className="w-full flex items-center gap-4 p-4 rounded-md hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-base button-font">Logout</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
