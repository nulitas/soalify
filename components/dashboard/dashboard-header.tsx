"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  User,
  BookOpen,
  History,
  Settings,
  LogOut,
  Home,
} from "lucide-react";

interface DashboardHeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  activeTab: "generate" | "history" | "settings";
  setActiveTab: (tab: "generate" | "history" | "settings") => void;
}

export default function DashboardHeader({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeTab,
  setActiveTab,
}: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    {
      name: "Generate Questions",
      icon: BookOpen,
      tab: "generate" as const,
    },
    {
      name: "Question History",
      icon: History,
      tab: "history" as const,
    },
    {
      name: "Settings",
      icon: Settings,
      tab: "settings" as const,
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
          <div className="hidden md:block relative w-full max-w-md mx-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* User Profile & Notifications */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="hidden md:flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium title-font">User Name</p>
                <p className="text-xs text-gray-500">Free Plan</p>
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
                href="/login"
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
