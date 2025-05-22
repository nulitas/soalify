export default function Usages() {
  const usageSteps = [
    {
      step: "01",
      title: "Admin Upload Materi",
      description:
        "Admin mengunggah file PDF materi pelajaran ke dalam sistem Soalify. File ini akan menjadi basis pembuatan soal.",
      details: [
        "Upload file PDF",
        "Sistem memproses materi",
        "Materi siap digunakan",
      ],
    },
    {
      step: "02",
      title: "Guru Login ke Sistem",
      description:
        "Guru masuk ke akun mereka yang telah dibuat oleh admin untuk mengakses fitur pembuatan soal.",
      details: [
        "Login dengan akun guru",
        "Akses dashboard",
        "Pilih fitur generate soal",
      ],
    },
    {
      step: "03",
      title: "Input Topik Materi",
      description:
        "Guru memasukkan topik atau konteks materi yang ingin dibuatkan soal, misalnya 'Matematika Pecahan Kelas 5'.",
      details: [
        "Ketik topik materi",
        "Pilih jenis soal",
        "Tentukan jumlah soal",
      ],
    },
    {
      step: "04",
      title: "Sistem Generate Soal",
      description:
        "Soalify secara otomatis membuat soal dan jawaban berdasarkan materi yang telah diunggah dan topik yang diminta.",
      details: [
        "AI memproses request",
        "Generate soal + jawaban",
        "Review dan edit jika perlu",
      ],
    },
  ];

  return (
    <section id="penggunaan" className="px-4 md:px-8 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">PENGGUNAAN</h2>
          <h3 className="section-heading mb-6 mx-auto">
            Cara Menggunakan Soalify
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ikuti 4 langkah sederhana untuk mulai membuat soal dan jawaban
            secara otomatis dengan Soalify.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gray-200 hidden lg:block"></div>

          <div className="space-y-12">
            {usageSteps.map((usage, index) => (
              <div
                key={index}
                className="relative flex flex-col lg:flex-row items-start gap-8"
              >
                {/* Step number */}
                <div className="flex-shrink-0 relative">
                  <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg z-10 relative">
                    {usage.step}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 lg:ml-8">
                  <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                    <h4 className="text-2xl title-font font-medium mb-4">
                      {usage.title}
                    </h4>
                    <p className="section-description text-lg leading-relaxed mb-6">
                      {usage.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {usage.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-3 bg-white p-4 rounded-lg border"
                        >
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 text-sm">✓</span>
                          </div>
                          <span className="text-sm">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-8">
          <h4 className="text-xl font-medium mb-6 text-center">
            Pertanyaan Umum
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg">
              <h5 className="font-medium mb-2">
                Berapa lama proses generate soal?
              </h5>
              <p className="text-sm text-gray-600">
                Proses pembuatan soal hanya membutuhkan waktu 10-30 detik
                tergantung kompleksitas materi.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h5 className="font-medium mb-2">
                Apakah bisa edit soal yang sudah dibuat?
              </h5>
              <p className="text-sm text-gray-600">
                Ya, guru bisa mengedit, menambah, atau mengurangi soal sesuai
                kebutuhan sebelum digunakan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
