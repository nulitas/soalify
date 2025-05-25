"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import ConfirmModal from "@/components/ui/confirm-modal";
import { AlertTriangle } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function ManajemenUser() {
  const [users, setUsers] = useState<
    {
      user_id: number;
      email: string;
      fullname: string;
      role_id: number;
      is_admin: boolean;
    }[]
  >([]);
  const [newUser, setNewUser] = useState({
    email: "",
    fullname: "",
    password: "",
    role_id: 2,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<{
    id: number | null;
    email: string;
    fullname: string;
    role_id: number;
  }>({ id: null, email: "", fullname: "", role_id: 2 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: number;
    email: string;
  } | null>(null);
  const router = useRouter();

  const handleError = useCallback(
    (err: unknown) => {
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: {
            data?: { detail?: string };
            status?: number;
          };
        };
        const errorMessage =
          axiosError.response?.data?.detail || "Terjadi kesalahan";
        setError(errorMessage);
        toast.error(errorMessage);

        if (axiosError.response?.status === 401) {
          setTimeout(() => router.push("/login"), 2000);
        }
      } else {
        toast.error("Terjadi kesalahan tidak dikenal");
      }
    },
    [router]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await api.get("/users/me");
        if (currentUser.data.role_id !== 1) {
          toast.error(
            "Akses ditolak. Hanya admin yang dapat mengakses halaman ini."
          );
          router.push("/dashboard");
          return;
        }

        const response = await api.get("/users/?skip=0&limit=100");
        setUsers(response.data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, handleError]);

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.fullname || !newUser.password) {
      toast.error("Harap isi semua bidang");
      return;
    }

    const loadingToast = toast.loading("Menambahkan pengguna...");

    try {
      const response = await api.post("/users/register", newUser);
      setUsers((prev) => [...prev, response.data]);
      setNewUser({ email: "", fullname: "", password: "", role_id: 2 });
      toast.success("Pengguna berhasil ditambahkan", { id: loadingToast });
    } catch (err) {
      handleError(err);
      toast.error("Gagal menambahkan pengguna", { id: loadingToast });
    }
  };

  const confirmDeleteUser = (userId: number, userEmail: string) => {
    setUserToDelete({ id: userId, email: userEmail });
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    const loadingToast = toast.loading("Menghapus pengguna...");

    try {
      await api.delete(`/users/${userToDelete.id}`);
      setUsers((prev) =>
        prev.filter((user) => user.user_id !== userToDelete.id)
      );
      toast.success("Pengguna berhasil dihapus", { id: loadingToast });
    } catch (err) {
      handleError(err);
      toast.error("Gagal menghapus pengguna", { id: loadingToast });
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser.id || !editingUser.email || !editingUser.fullname) {
      toast.error("Harap isi semua bidang");
      return;
    }

    const loadingToast = toast.loading("Memperbarui pengguna...");

    try {
      const response = await api.put(`/users/${editingUser.id}`, {
        email: editingUser.email,
        fullname: editingUser.fullname,
        role_id: editingUser.role_id,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.user_id === editingUser.id ? { ...user, ...response.data } : user
        )
      );
      setEditingUser({ id: null, email: "", fullname: "", role_id: 2 });
      toast.success("Pengguna berhasil diperbarui", { id: loadingToast });
    } catch (err) {
      handleError(err);
      toast.error("Gagal memperbarui pengguna", { id: loadingToast });
    }
  };

  return (
    <div>
      <Toaster
        toastOptions={{
          success: { style: { background: "#10B981", color: "white" } },
          error: { style: { background: "#EF4444", color: "white" } },
          loading: { style: { background: "#3B82F6", color: "white" } },
        }}
      />

      <h1 className="text-2xl md:text-3xl font-medium title-font mb-6">
        Manajemen Pengguna
      </h1>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6">
        <p className="section-description">
          Kelola pengguna sistem di sini (Hanya akses admin)
        </p>

        {loading ? (
          <LoadingSpinner message="Memuat pengguna..." />
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <>
            {users.length === 0 ? (
              <p className="text-sm text-gray-500 mt-6">
                Tidak ada pengguna terdaftar.
              </p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Nama Lengkap</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.user_id} className="border-b">
                        {editingUser.id === user.user_id ? (
                          <>
                            <td className="py-3 px-4">
                              <input
                                type="email"
                                value={editingUser.email}
                                onChange={(e) =>
                                  setEditingUser({
                                    ...editingUser,
                                    email: e.target.value,
                                  })
                                }
                                className="border p-1 w-full"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                value={editingUser.fullname}
                                onChange={(e) =>
                                  setEditingUser({
                                    ...editingUser,
                                    fullname: e.target.value,
                                  })
                                }
                                className="border p-1 w-full"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={editingUser.role_id}
                                onChange={(e) =>
                                  setEditingUser({
                                    ...editingUser,
                                    role_id: Number(e.target.value),
                                  })
                                }
                                className="border p-1 w-full"
                              >
                                <option value={1}>Admin</option>
                                <option value={2}>User</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 flex gap-2">
                              <button
                                onClick={handleUpdateUser}
                                className="text-green-500 hover:text-green-700"
                              >
                                Simpan
                              </button>
                              <button
                                onClick={() =>
                                  setEditingUser({
                                    id: null,
                                    email: "",
                                    fullname: "",
                                    role_id: 2,
                                  })
                                }
                                className="text-gray-500 hover:text-gray-700"
                              >
                                Batal
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">{user.fullname}</td>
                            <td className="py-3 px-4">
                              {user.role_id === 1 ? "Admin" : "User"}
                            </td>
                            <td className="py-3 px-4 flex gap-2">
                              <button
                                onClick={() =>
                                  setEditingUser({
                                    id: user.user_id,
                                    email: user.email,
                                    fullname: user.fullname,
                                    role_id: user.role_id,
                                  })
                                }
                                className="text-blue-500 hover:text-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  confirmDeleteUser(user.user_id, user.email)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                Hapus
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 space-y-4">
              <h2 className="text-lg font-medium">Tambah Pengguna Baru</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={newUser.fullname}
                  onChange={(e) =>
                    setNewUser({ ...newUser, fullname: e.target.value })
                  }
                  className="border p-2 rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="border p-2 rounded"
                />
                <select
                  value={newUser.role_id}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role_id: Number(e.target.value) })
                  }
                  className="border p-2 rounded"
                >
                  <option value={1}>Admin</option>
                  <option value={2}>User</option>
                </select>
              </div>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Tambah Pengguna
              </button>
            </div>
          </>
        )}
      </div>

      {showDeleteModal && userToDelete && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
          onConfirm={handleDeleteUser}
          title="Hapus Pengguna"
          message={`Apakah Anda yakin ingin menghapus pengguna "${userToDelete.email}"?`}
          confirmText="Hapus"
          cancelText="Batal"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
        />
      )}
    </div>
  );
}
