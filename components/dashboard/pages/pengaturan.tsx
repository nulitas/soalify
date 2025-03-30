"use client";

import { User, Mail, Lock } from "lucide-react";

export default function Pengaturan() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-medium title-font mb-6">
        Pengaturan
      </h1>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Profil Pengguna</h2>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-gray-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama</label>
              <input
                type="text"
                defaultValue="Nama Lengkap"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="flex items-center">
                <input
                  type="email"
                  defaultValue="andra@example.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  disabled
                />
                <Mail className="w-5 h-5 text-gray-400 -ml-8" />
              </div>
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
    </div>
  );
}
