export default function Services() {
  const services = [
    {
      id: "01",
      title: "Menghemat Waktu ",
      description: "Soalify membantu guru membuat soal dalam hitungan detik.",
    },
    {
      id: "02",
      title: "Soal Sesuai Materi ",
      description:
        " Soal yang dihasilkan diambil dari materi yang sudah diunggah, jadi tidak perlu khawatir soal yang muncul melenceng dari topik.",
    },
    {
      id: "03",
      title: "Praktis dan Mudah",
      description:
        "Semua bisa dilakukan langsung dari website, tanpa perlu install aplikasi tambahan.",
    },
  ];

  return (
    <section id="what-we-do" className="section-bg px-4 md:px-8 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">TENTANG</h2>
        <h3 className="section-heading">
          Kenapa Guru Perlu Menggunakan Soalify?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className="space-y-4">
              <div className="text-sm text-black content-font font-medium">
                {service.id}
              </div>
              <h4 className="text-xl title-font font-medium">
                {service.title}
              </h4>
              <p className="section-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
