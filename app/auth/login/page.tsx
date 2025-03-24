"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { redirect } from "next/navigation";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.email) {
      newErrors.email = "Email dibutuhkan";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email tidak valid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password dibutuhkan";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Login form submitted:", formData);
      alert("Login successful!");
      redirect("/dashboard");
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm button-font hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
            <h1 className="text-2xl md:text-3xl mb-6 title-font font-medium">
              Selamat Datang
            </h1>

            <p className="section-description mb-8">
              Masuk untuk mengakses akun Anda.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm button-font">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Masukkan email Anda"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm button-font">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black pr-10"
                    placeholder="Masukkan password Anda"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm button-font hover:underline"
                >
                  Lupa Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 ease-in-out text-sm button-font"
              >
                Masuk
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm content-font">
                Tidak punya akun?{" "}
                <Link
                  href="/auth/register"
                  className="ml-2 text-sm button-font font-medium hover:underline"
                >
                  Daftar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
