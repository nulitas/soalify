export default function Footer() {
  return (
    <footer className="dark-section text-white px-4 md:px-8 py-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm md:text-base footer-text">
          © 2025 soalify | All rights reserved
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/nulitas/soalify"
            className="hover:opacity-80 footer-text"
          >
            GitHub
          </a>
          <div className="w-px h-4 bg-white/20" />
          <a href="#top" className="hover:opacity-80 footer-text">
            Kembali ke awal ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
