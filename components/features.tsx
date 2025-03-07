import { ArrowRight } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Upload Materi Pelajaran",
      description:
        "Admin bisa mengunggah file PDF berisi materi pelajaran. Materi ini nantinya akan dipakai oleh sistem untuk membuat soal yang sesuai.",
    },
    {
      title: "Kelola Akun Pengguna",
      description:
        "Admin juga bisa membuat akun baru untuk guru, menghapus akun, atau mereset data jika diperlukan.",
    },
    {
      title: "Reset Data Materi",
      description:
        "Kalau materi yang diunggah sudah tidak relevan atau ingin diganti, admin bisa menghapus semua materi lama dan menggantinya dengan materi baru.",
    },
    {
      title: "Membuat Soal dan Jawaban",
      description:
        'Guru cukup mengisi topik atau konteks materi yang ingin dibuatkan soal, misalnya "Materi Matematika tentang Pecahan". Setelah itu, Soalify akan langsung membuatkan soal beserta jawabannya sesuai materi yang telah diunggah oleh admin sebelumnya.',
    },
  ];

  return (
    <section id="fitur" className="px-4 md:px-8 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">FITUR</h2>
        <h3 className="section-heading">Apa yang membedakan dari yang lain</h3>

        <div className="space-y-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 pb-12 border-b border-gray-200 last:border-0 max-w-3xl"
            >
              <ArrowRight className="w-6 h-6 mt-1 flex-shrink-0 text-black" />
              <div>
                <h4 className="text-xl title-font font-medium mb-4">
                  {feature.title}
                </h4>
                <p className="section-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
