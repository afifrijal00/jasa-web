export const PACKAGES = [
  {
    id: "landing",
    nama: "Landing Page & Profil Usaha",
    desk: "Halaman responsif untuk UMKM, organisasi, atau portofolio. Siap terhubung ke form kontak & WhatsApp.",
    durasi: "3–5 hari",
    source: 350000,
    deploy: 500000,
    bg: "bg-coral",
  },
  {
    id: "crud",
    nama: "Web CRUD & Dashboard",
    desk: "Aplikasi Flask atau Laravel + database: kelola data, login, dan grafik ringkasan.",
    durasi: "3–6 hari",
    source: 400000,
    deploy: 550000,
    bg: "bg-mint",
  },
  {
    id: "scraping",
    nama: "Scraping Bot & REST API",
    desk: "Ambil data otomatis ke CSV, JSON, atau Excel, atau bikin API yang siap dipakai.",
    durasi: "1–3 hari",
    source: 250000,
    deploy: 350000,
    bg: "bg-bubble",
  },
  {
    id: "sistem",
    nama: "Sistem Web Lengkap",
    desk: "Multi-role (Admin, User, Petugas), laporan PDF/Excel, dan dashboard analitik untuk bisnis atau organisasi.",
    durasi: "2–3 minggu",
    source: 1500000,
    deploy: 1800000,
    bg: "bg-sun",
  },
] as const;

export const STATUS = [
  "BARU",
  "KONSOLIDASI",
  "FIKSASI",
  "DP DITERIMA",
  "PROSES",
  "DEMO",
  "SELESAI",
  "BATAL",
] as const;

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);