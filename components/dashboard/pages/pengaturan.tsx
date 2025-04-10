"use client";

import { useEffect, useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UserData {
  user_id: number;
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
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getRoleName = (roleId: number): string => {
    const role = roles.find((r) => r.role_id === roleId);
    return role ? role.role_name : `Role ${roleId}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No auth token found");
          router.push("/auth/login");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

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
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            console.error("Authentication failed. Token may be expired.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/auth/login");
          } else {
            setError(error.response?.data?.message || error.message);
          }
        } else {
          setError("An unknown error occurred");
        }
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-medium title-font mb-6">
        Pengaturan
      </h1>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-middle"></div>
          <p className="mt-2">Memuat data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p>Error: {error}</p>
          <p>Gagal memuat data pengguna. Silakan coba lagi nanti.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6 mb-6">
            <h2 className="text-xl font-medium mb-4">Profil Pengguna</h2>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    User ID: {userData?.user_id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <div className="flex items-center">
                    <input
                      type="email"
                      value={userData?.email || ""}
                      className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                      disabled
                    />
                    <Mail className="w-5 h-5 text-gray-400 -ml-8" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    value={userData ? getRoleName(userData.role_id) : ""}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6 mb-6">
            <h2 className="text-xl font-medium mb-4">Keamanan</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password Saat Ini
                </label>
                <div className="flex items-center">
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <Lock className="w-5 h-5 text-gray-400 -ml-8" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
