"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Save } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface ChangePasswordSectionProps {
  userId: number;
}

interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordSection({
  userId,
}: ChangePasswordSectionProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwordData, setPasswordData] = useState<UpdatePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });

    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: "",
      });
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const validatePassword = (): boolean => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Password saat ini wajib diisi";
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "Password baru wajib diisi";
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password minimal 8 karakter";
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Konfirmasi password wajib diisi";
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Konfirmasi password tidak cocok";
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const updatePassword = async () => {
    if (!validatePassword()) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/password`,
        {
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        },
        config
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password berhasil diperbarui");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          setPasswordErrors({
            ...passwordErrors,
            currentPassword: "Password saat ini tidak valid",
          });
          toast.error("Password saat ini tidak valid");
        } else {
          toast.error(
            error.response?.data?.message || "Gagal memperbarui password"
          );
        }
      } else {
        toast.error("Terjadi kesalahan saat memperbarui password");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6">
      <div className="flex items-center mb-6">
        <div className="bg-gray-200 p-2 rounded-full mr-3">
          <Lock className="w-5 h-5 text-gray-500" />
        </div>
        <h2 className="text-xl font-medium">Ubah Password</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password Saat Ini
          </label>
          <div className="relative">
            <input
              type={showPassword.currentPassword ? "text" : "password"}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Masukkan password saat ini"
              className={`w-full px-4 py-3 border ${
                passwordErrors.currentPassword
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-gray-200"
              } w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("currentPassword")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword.currentPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {passwordErrors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">
              {passwordErrors.currentPassword}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showPassword.newPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Masukkan password baru"
                className={`w-full px-4 py-3 border ${
                  passwordErrors.newPassword
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-200"
                } w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.newPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {passwordErrors.newPassword}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Konfirmasi password baru"
                className={`w-full px-4 py-3 border ${
                  passwordErrors.confirmPassword
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-200"
                } w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.confirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {passwordErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-end">
              <button
                onClick={updatePassword}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Perbarui Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
