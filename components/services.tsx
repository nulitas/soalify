export default function Services() {
  const services = [
    {
      id: "01",
      title: "Menghemat Waktu",
      description: "Soalify membantu guru membuat soal dalam hitungan detik.",
      icon: "⏱️",
      stat: "95%",
      statLabel: "waktu tersimpan",
    },
    {
      id: "02",
      title: "Soal Sesuai Materi",
      description:
        "Soal yang dihasilkan diambil dari materi yang sudah diunggah, jadi tidak perlu khawatir soal yang muncul melenceng dari topik.",
      icon: "📚",
      stat: "100%",
      statLabel: "akurasi materi",
    },
    {
      id: "03",
      title: "Praktis dan Mudah",
      description:
        "Semua bisa dilakukan langsung dari website, tanpa perlu install aplikasi tambahan.",
      icon: "💻",
      stat: "0",
      statLabel: "instalasi diperlukan",
    },
  ];

  return (
    <section
      id="tentang"
      className="section-bg px-4 md:px-8 py-20 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-gray-300 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-gray-300 rounded-lg rotate-45"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="section-title">TENTANG</h2>
          <h3 className="section-heading mb-6 mx-auto">
            Kenapa Guru Perlu Menggunakan Soalify?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Soalify dirancang khusus untuk membantu guru menghemat waktu dan
            tenaga dalam membuat soal ujian yang berkualitas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="text-4xl">{service.icon}</div>
                <div className="text-sm text-gray-400 content-font font-medium">
                  {service.id}
                </div>
              </div>

              <h4 className="text-xl title-font font-medium mb-4 group-hover:text-black transition-colors">
                {service.title}
              </h4>

              <p className="section-description mb-6 leading-relaxed">
                {service.description}
              </p>

              <div className="pt-4 border-t border-gray-100">
                <div className="text-2xl font-bold text-black mb-1">
                  {service.stat}
                </div>
                <div className="text-sm text-gray-500">{service.statLabel}</div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white rounded-full px-8 py-4 shadow-sm border">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">500+</div>
              <div className="text-sm text-gray-500">Guru Pengguna</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">10K+</div>
              <div className="text-sm text-gray-500">Soal Dibuat</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">98%</div>
              <div className="text-sm text-gray-500">Kepuasan</div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
