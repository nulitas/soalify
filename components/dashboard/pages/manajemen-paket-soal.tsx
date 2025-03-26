export default function ManajemenPaketSoal() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-medium title-font mb-6">
        Manajemen Paket Soal
      </h1>
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6">
        <p className="section-description">Kelola paket soal Anda di sini</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium mb-2">Paket Soal #{item}</h3>
              <p className="text-sm text-gray-600 mb-3">
                10 soal • Dibuat pada 26 Maret 2025
              </p>
              <div className="flex justify-end">
                <button className="text-sm text-blue-600 hover:underline">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
