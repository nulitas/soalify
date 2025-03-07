export default function Hero() {
  return (
    <section className="px-4 md:px-8 pt-32 pb-20 max-w-7xl mx-auto bg-white">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-[64px] font-semibold leading-[1.1] mb-8 title-font">
          Platform Cerdas untuk Membuat{" "}
          <span className="underline-word">Soal</span>
          {""} dan <span className="underline-word">Jawaban</span> bagi Guru
        </h1>
        <p className="section-description mb-8 max-w-2xl">
          Dengan Soalify, guru tidak perlu lagi repot menyusun soal satu per
          satu secara manual. Cukup masukkan materi atau tema pelajaran yang
          ingin dibuatkan soal, dan Soalify akan membuatkan soal beserta
          jawabannya secara langsung.
        </p>
        <button className="px-6 py-3 border border-black text-black rounded-full hover:bg-black hover:text-white transition-colors duration-200 ease-in-out text-sm button-font">
          Daftar Di sini
        </button>
      </div>
    </section>
  );
}
