"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
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
import api from "@/lib/api";
import ConfirmModal from "@/components/ui/confirm-modal";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [userRole, setUserRole] = useState<number>(2);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role_id);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const getActiveTab = () => {
    if (pathname.startsWith("/dashboard/manajemen-paket-soal"))
      return "manajemen-paket-soal";
    if (pathname.startsWith("/dashboard/manajemen-tag")) return "manajemen-tag";
    if (pathname.startsWith("/dashboard/manajemen-dokumen"))
      return "manajemen-dokumen";
    if (pathname.startsWith("/dashboard/manajemen-pengguna"))
      return "manajemen-pengguna";
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
    ...(userRole === 1
      ? [
          {
            name: "Manajemen Pengguna",
            icon: Users,
            tab: "manajemen-pengguna",
            path: "/dashboard/manajemen-pengguna",
          },
        ]
      : []),
    {
      name: "Pengaturan",
      icon: Settings,
      tab: "pengaturan",
      path: "/dashboard/pengaturan",
    },
  ];

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    const loadingToast = toast.loading("Sedang keluar...");

    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      delete api.defaults.headers.common["Authorization"];

      toast.success("Berhasil keluar!", { id: loadingToast });

      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Gagal keluar. Silakan coba lagi.", { id: loadingToast });
    } finally {
      setShowLogoutModal(false);
    }
  };

  const handleHomeClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    router.push("/");
  };

  return (
    <div className="bg-white border-r border-gray-200 fixed top-0 left-0 h-screen w-64 flex flex-col z-40">
      {/* Toast container */}
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "#10B981",
              color: "white",
              fontWeight: "500",
            },
          },
          error: {
            style: {
              background: "#EF4444",
              color: "white",
              fontWeight: "500",
            },
          },
          loading: {
            style: {
              background: "#3B82F6",
              color: "white",
              fontWeight: "500",
            },
          },
        }}
      />

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
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors text-left w-full"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span className="button-font">Home</span>
          </button>
          <button
            onClick={confirmLogout}
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors text-left w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="button-font">Keluar</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
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
    </div>
  );
}
