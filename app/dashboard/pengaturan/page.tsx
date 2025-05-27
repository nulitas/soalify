"use client";

import { useEffect, useState, useCallback } from "react";
import { User, Mail, Edit, X, Check } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import ChangePasswordSection from "@/components/dashboard/change-password";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorMessage from "@/components/ui/error-message";
interface UserData {
  user_id: number;
  fullname: string;
  email: string;
  role_id: number;
}

interface RoleData {
  role_id: number;
  role_name: string;
}

export default function Pengaturan() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editedUserData, setEditedUserData] = useState<UserData | null>(null);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);

  const getRoleName = (roleId: number): string => {
    const role = roles.find((r) => r.role_id === roleId);
    return role ? role.role_name : `Role ${roleId}`;
  };

  const handleApiError = useCallback(
    (err: unknown, contextMessage: string) => {
      let displayMessage = contextMessage;
      let isSessionExpired = false;

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          displayMessage =
            "Sesi Anda telah berakhir. Anda akan dialihkan ke halaman login.";
          isSessionExpired = true;
          toast.error("Sesi Anda telah berakhir.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => {
            router.push("/login");
          }, 2500);
        } else {
          displayMessage = err.response?.data?.detail || contextMessage;
        }
      }

      setError(displayMessage);
      if (!isSessionExpired) {
        toast.error(displayMessage);
      }
      console.error(`Error: ${contextMessage}`, err);
    },
    [router]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          handleApiError(
            new Error("Token tidak ditemukan."),
            "Autentikasi diperlukan. Silakan login kembali."
          );
          if (!localStorage.getItem("token")) {
            router.push("/login");
          }
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [rolesResponse, userResponse] = await Promise.all([
          axios.get<RoleData[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/users/roles/`,
            config
          ),
          axios.get<UserData>(
            `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
            config
          ),
        ]);

        setRoles(rolesResponse.data);
        setUserData(userResponse.data);
        setEditedUserData(userResponse.data);
      } catch (err) {
        handleApiError(err, "Gagal memuat data pengguna.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router, handleApiError]);

  const handleEditProfile = () => setEditingProfile(true);
  const handleCancelEdit = () => {
    setEditingProfile(false);
    setEditedUserData(userData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedUserData) {
      setEditedUserData({ ...editedUserData, [name]: value });
    }
  };

  const saveProfile = async () => {
    if (!editedUserData || !userData) return;
    const loadingToastId = toast.loading("Menyimpan profil...");
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleApiError(
          new Error("Token tidak ditemukan."),
          "Autentikasi diperlukan untuk menyimpan."
        );
        if (!localStorage.getItem("token")) {
          router.push("/login");
        }
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userData.user_id}`,
        { fullname: editedUserData.fullname, email: editedUserData.email },
        config
      );
      setUserData(editedUserData);
      setEditingProfile(false);
      toast.success("Profil berhasil diperbarui", { id: loadingToastId });
    } catch (err) {
      toast.dismiss(loadingToastId);
      handleApiError(err, "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
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
      <h1 className="text-2xl md:text-3xl font-medium title-font mb-6">
        Pengaturan
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner message="Memuat data pengguna..." />
        </div>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : userData ? (
        <>
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Profil Pengguna</h2>
              {!editingProfile ? (
                <button
                  onClick={handleEditProfile}
                  className="flex items-center gap-1 text-sm px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  <Edit className="w-4 h-4" /> Edit Profil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 text-sm px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" /> Batal
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="flex items-center gap-1 text-sm px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Simpan
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{userData.fullname}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={editedUserData?.fullname || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    disabled={!editingProfile}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <div className="flex items-center">
                    <input
                      type="email"
                      name="email"
                      value={editedUserData?.email || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                      disabled={!editingProfile}
                    />
                    <Mail className="w-5 h-5 text-gray-400 -ml-8" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    value={
                      editedUserData ? getRoleName(editedUserData.role_id) : ""
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black bg-gray-50"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          <ChangePasswordSection userId={userData.user_id} />
        </>
      ) : null}
    </div>
  );
}
