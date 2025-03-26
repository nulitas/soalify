export default function ManajemenTag() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-medium title-font mb-6">
        Manajemen Tag
      </h1>
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-6">
        <p className="section-description">
          Kelola tag untuk soal Anda di sini
        </p>

        <div className="mt-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {["Bahasa Indonesia", "Bahasa Russia", "Bahasa Kazakh"].map(
              (tag) => (
                <div
                  key={tag}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button className="ml-2 text-gray-500 hover:text-red-500">
                    ×
                  </button>
                </div>
              )
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tambah tag baru"
              className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
              Tambah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
