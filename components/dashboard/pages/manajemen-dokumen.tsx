import { FileText, Upload, Trash2 } from "lucide-react";

export default function ManajemenDokumen() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-medium title-font mb-6">
        Manajemen Dokumen
      </h1>
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6">
        <p className="section-description">
          Kelola dokumen sumber soal Anda di sini
        </p>

        {/* Upload section */}
        <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <Upload className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Unggah Dokumen</h3>
          <p className="text-sm text-gray-500 mb-4">
            Seret dan lepas file PDF di sini
          </p>
          <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
            Pilih File
          </button>
        </div>

        {/* Document list */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Dokumen Anda</h3>
          <div className="space-y-3">
            {[
              {
                name: "Materi_Bahasa_Indonesia.pdf",
                date: "12 Maret 2025",
                size: "2.4 MB",
              },
              {
                name: "Persona_6_Remake.pdf",
                date: "10 Maret 2077",
                size: "1.8 MB",
              },
              {
                name: "Stardew_Valley_Guide.pdf",
                date: "5 Maret 2025",
                size: "256 KB",
              },
            ].map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {doc.date} • {doc.size}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-gray-500 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
