import { waLink } from "@/lib/wa";

export default function Footer() {
  return (
    <footer className="mt-20 border-t-[3px] border-ink bg-ink pb-24 pt-14 text-white md:pb-12">
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6">
        <div className="grid gap-8 border-b border-white/15 pb-10 md:grid-cols-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full border-[3px] border-ink bg-sun font-heading text-base font-bold text-ink">
                {"</>"}
              </span>
              <span className="font-heading text-xl font-bold">Jasa Koding</span>
            </div>
            <p className="max-w-sm text-sm font-medium leading-relaxed text-white/80">
              Solusi pembuatan website, aplikasi kustom, dan bot scraping untuk mahasiswa, UMKM, dan komunitas.
              Cepat, rapi, dan terpercaya.
            </p>
            <div className="pt-1">
              <a
  href={waLink("Halo Jasa Koding, mau tanya-tanya proyek")}
  target="_blank"
  rel="noopener noreferrer"
  className="neo-btn inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-xs text-ink shadow-brutal-sm"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
  Tanya-tanya via WhatsApp 
</a>
            </div>
          </div>

          {/* Navigasi */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-sun">Navigasi Cepat</h4>
            <ul className="space-y-2 text-sm font-medium text-white/80">
              <li><a className="transition-colors hover:text-sun" href="#harga">Daftar Harga Paket</a></li>
              <li><a className="transition-colors hover:text-sun" href="#portofolio">Portofolio Koding</a></li>
              <li><a className="transition-colors hover:text-sun" href="#cara-pesan">Alur & Cara Pesan</a></li>
              <li><a className="transition-colors hover:text-sun" href="#pesan">Form Order / Estimasi</a></li>
            </ul>
          </div>

          {/* Pembayaran */}
          <div className="space-y-3 md:col-span-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-sun">Metode Pembayaran</h4>
            <p className="text-xs font-medium leading-relaxed text-white/85 sm:text-sm">
              Bayar fleksibel: <span className="font-bold text-mint">QRIS Instan · Transfer Bank · E-Wallet</span>
            </p>
            <div className="space-y-1 rounded-xl border border-white/15 bg-white/10 p-3 text-xs text-white/70">
              <p className="font-bold text-white">🔒 Pembayaran Aman & Bertahap</p>
              <p>DP 50% di awal, sisa pelunasan setelah kamu menyaksikan video demo fungsionalitas program.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-8 text-xs font-medium text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Jasa Koding & Web Dev. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <span className="text-coral">♥</span> sepenuh cinta, sayangg mauraa
          </p>
        </div>
      </div>
    </footer>
  );
}