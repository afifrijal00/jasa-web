export const BANNER = {
  badge: "PROMO UMKM & MAHASISWA",
  text: "Free konsultasi arsitektur & panduan instalasi source code sampai jalan! 🚀",
};

export const RESPONSE_NOTE =
  "Lanjutkan ke WhatsApp untuk konsultasi dan DP. Tim kami siap merespons dalam 15 menit.";

// Tampilan tiap paket (harga & durasi tetap diambil dari lib/data.ts)
export const PACKAGE_UI: Record<
  string,
  {
    circle: string;
    desc: string;
    deployLabel: string;
    deployNote?: { text: string; cls: string };
    cta: string;
    ctaCls: string;
    popular?: boolean;
  }
> = {
  landing: {
    circle: "bg-sun",
    desc: "Situs informatif modern untuk UMKM, profil perusahaan, portofolio profesional, atau event. Tampilan responsive HP & laptop, cepat diakses, plus tombol chat WhatsApp.",
    deployLabel: "+ Deploy Online",
    deployNote: { text: "★ Rekomendasi", cls: "text-sun" },
    cta: "Pilih Paket Ini →",
    ctaCls: "bg-white hover:bg-cream font-bold",
  },
  crud: {
    circle: "bg-mint",
    desc: "Sangat cocok untuk skripsi, tugas kuliah akhir, atau inventaris UMKM. Lengkap dengan otentikasi login admin, kelola data tambah/edit/hapus, filter, export PDF/Excel.",
    deployLabel: "+ Deploy Online",
    deployNote: { text: "★ Best Value", cls: "text-mint" },
    cta: "Pilih Paket Ini ⚡",
    ctaCls: "bg-sun font-black shadow-brutal-sm",
    popular: true,
  },
  scraping: {
    circle: "bg-bubble",
    desc: "Bot otomasi data web, ekstraksi marketplace/e-commerce, integrasi endpoint REST API, atau webhook Telegram/WhatsApp bot untuk otomasi alur kerja cepat.",
    deployLabel: "+ Deploy Server/VPS",
    cta: "Pilih Paket Ini →",
    ctaCls: "bg-white hover:bg-cream font-bold",
  },
  sistem: {
    circle: "bg-violet text-white",
    desc: "Aplikasi web skala penuh dengan multi-role access (Admin, User, Kasir), integrasi payment gateway (Midtrans/Xendit), sistem reservasi, atau e-commerce kustom.",
    deployLabel: "+ Deploy Full Staging",
    cta: "Pilih Paket Ini →",
    ctaCls: "bg-white hover:bg-cream font-bold",
  },
};

export const FAQ = [
  {
    q: "Bisa bantu skripsi atau tugas kuliah yang mepet deadline?",
    a: "Bisa banget! Kami sering menangani project express untuk mahasiswa dengan source code bersih, mudah dipahami dosen penguji, dan didampingi video penjelasan.",
  },
  {
    q: "Bagaimana kalau ada revisi atau error setelah diserahkan?",
    a: "Semua paket sudah termasuk garansi perbaikan bug dan revisi minor selama 3 hari kerja aktif setelah serah terima source code.",
  },
];

export const GRADS = [
  "from-sun/80 to-coral/70",
  "from-mint/80 to-violet/50",
  "from-bubble/80 to-sun/60",
  "from-violet/70 to-bubble/80",
  "from-mint/70 to-sun/80",
  "from-coral/80 to-bubble/70",
];

export type PortfolioItem = {
  id: string | number;
  judul: string;
  deskripsi: string;
  tech: string[];
  badge: string;
  chip: string;
  footer: string;
  icon: string;
  grad: string;
  paket: string;
  url?: string | null;
  gambar?: string | null;
};

// Proyek CONTOH dari Stitch. Hanya tampil kalau database portofolio masih kosong.
// Ganti dengan proyek aslimu, atau kosongkan array ini ([]) kalau tidak mau ada contoh.
export const SAMPLE_PROJECTS: PortfolioItem[] = [
  {
    id: "s1",
    judul: "Katalog Menu & Kasir Warung Kopi",
    deskripsi:
      "Landing page katalog menu interaktif dengan kalkulator pesanan otomatis dan link pemesanan direct ke WhatsApp admin.",
    tech: ["Tailwind", "JavaScript", "Alpine.js"],
    badge: "UMKM Kuliner",
    chip: "Live Demo",
    footer: "3 Hari Beres",
    icon: "</>",
    grad: GRADS[0],
    paket: "landing",
  },
  {
    id: "s2",
    judul: "Sistem Informasi Inventory & SPK",
    deskripsi:
      "Aplikasi dashboard manajemen stok barang masuk/keluar dengan perhitungan metode TOPSIS untuk rekomendasi restok.",
    tech: ["Laravel 11", "MySQL", "Bootstrap 5"],
    badge: "Skripsi TI",
    chip: "Akurasi 98%",
    footer: "Include DFD/ERD",
    icon: "</>",
    grad: GRADS[1],
    paket: "crud",
  },
  {
    id: "s3",
    judul: "Scraper Produk & Bot Notifikasi",
    deskripsi:
      "Script scraping berkala harga komoditas e-commerce dengan bot alert instan ke grup Telegram setiap jam 09.00 pagi.",
    tech: ["Python", "Playwright", "Telegram API"],
    badge: "Otomasi Data",
    chip: "Cron 24/7",
    footer: "Bisa Auto VPS",
    icon: "</>",
    grad: GRADS[2],
    paket: "scraping",
  },
  {
    id: "s4",
    judul: "Web E-Commerce UMKM Batik",
    deskripsi:
      "Toko online katalog produk motif batik lengkap keranjang belanja, cek ongkir RajaOngkir otomatis, dan integrasi Midtrans Snap QRIS.",
    tech: ["Next.js", "Midtrans", "Prisma ORM"],
    badge: "Toko Online",
    chip: "Payment Auto",
    footer: "Checkout Cepat",
    icon: "🛍️",
    grad: GRADS[3],
    paket: "sistem",
  },
  {
    id: "s5",
    judul: "Sistem Booking Klinik & Antrian",
    deskripsi:
      "Platform reservasi jadwal temu dokter, nomor antrian digital realtime di monitor ruang tunggu, dan rekam medis pasien terpusat.",
    tech: ["CodeIgniter 4", "WebSockets", "PostgreSQL"],
    badge: "Sistem Medis",
    chip: "Multi-Dokter",
    footer: "Live Screen",
    icon: "🏥",
    grad: GRADS[4],
    paket: "sistem",
  },
  {
    id: "s6",
    judul: "Dashboard Analytics Akademik Kampus",
    deskripsi:
      "Visualisasi grafik tren IPK mahasiswa, monitoring kelulusan tepat waktu, dan export rekapitulasi nilai per prodi format XLS/PDF.",
    tech: ["Vue 3", "FastAPI", "Tailwind"],
    badge: "Dashboard",
    chip: "Chart.js",
    footer: "Grafik Responsif",
    icon: "📊",
    grad: GRADS[5],
    paket: "crud",
  },
];