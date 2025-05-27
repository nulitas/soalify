export default function Features() {
  const features = [
    {
      title: "Upload Materi Pelajaran",
      description:
        "Admin bisa mengunggah file PDF berisi materi pelajaran. Materi ini nantinya akan dipakai oleh sistem untuk membuat soal yang sesuai.",
      step: "01",
      side: "left",
    },
    {
      title: "Kelola Akun Pengguna",
      description:
        "Admin juga bisa membuat akun baru untuk guru, menghapus akun, atau mereset data jika diperlukan.",
      step: "02",
      side: "right",
    },
    {
      title: "Reset Data Materi",
      description:
        "Kalau materi yang diunggah sudah tidak relevan atau ingin diganti, admin bisa menghapus semua materi lama dan menggantinya dengan materi baru.",
      step: "03",
      side: "left",
    },
    {
      title: "Membuat Soal dan Jawaban",
      description:
        'Guru cukup mengisi topik atau konteks materi yang ingin dibuatkan soal, misalnya "Materi Bahasa Indonesia". Setelah itu, Soalify akan langsung membuatkan soal beserta jawabannya sesuai materi yang telah diunggah oleh admin sebelumnya.',
      step: "04",
      side: "right",
    },
  ];

  return (
    <section id="fitur" className="px-4 md:px-8 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">FITUR</h2>
          <h3 className="section-heading mb-6 mx-auto">
            Apa yang membedakan dari yang lain
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fitur-fitur canggih yang dirancang khusus untuk kemudahan guru dan
            admin dalam mengelola soal ujian.
          </p>
        </div>

        <div className="space-y-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                feature.side === "right" ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold">
                    {feature.step}
                  </div>
                  <h4 className="text-2xl title-font font-medium">
                    {feature.title}
                  </h4>
                </div>
                <p className="section-description text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Mockup/Image */}
              <div className="flex-1">
                <div className="bg-gray-50 rounded-2xl p-8 shadow-lg border">
                  {feature.step === "01" && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm">📄</span>
                        </div>
                        <span className="font-medium">Materi Pelajaran</span>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <div className="text-4xl mb-4">📁</div>
                        <p className="text-gray-600">
                          Seret dan lepas file PDF materi pelajaran di sini atau
                          klik tombol di bawah untuk memilih file dari perangkat
                        </p>
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                          Pilih File
                        </button>
                      </div>
                    </div>
                  )}

                  {feature.step === "02" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="font-medium">Kelola Pengguna</h4>
                        <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">
                          + Tambah Pengguna
                        </button>
                      </div>
                      <div className="space-y-3">
                        {[
                          "Tony Stark",
                          "Victor Von Doom",
                          "Wade Winston Wilson",
                        ].map((name, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-white rounded border"
                          >
                            <span>{name}</span>
                            <div className="flex space-x-2">
                              <button className="text-blue-500 text-sm">
                                Ubah
                              </button>
                              <button className="text-red-500 text-sm">
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {feature.step === "03" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="font-medium">Data Materi</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                          <span className="text-sm">
                            Bahasa_Indonesia_1.pdf
                          </span>
                          <span className="text-red-500 text-xs">
                            Akan dihapus
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                          <span className="text-sm">
                            Bahasa_Indonesia_2.pdf
                          </span>
                          <span className="text-red-500 text-xs">
                            Akan dihapus
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {feature.step === "04" && (
                    <div className="space-y-4">
                      <div className="mb-6">
                        <h4 className="font-medium mb-4">Bikin Soal</h4>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Masukkan topik materi..."
                            className="w-full p-3 border rounded-lg"
                            defaultValue="Bahasa Indonesia adalah bahasa resmi Republik Indonesia dan bahasa persatuan bangsa Indonesia. "
                          />
                          <button className="w-full p-3 bg-black text-white rounded-lg">
                            Bikin Soal
                          </button>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-800 mb-2">
                          Soal berhasil dibuat!
                        </p>
                        <p className="text-xs text-green-600">
                          5 soal telah dibuat
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
