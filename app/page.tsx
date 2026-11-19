import { prisma } from "@/lib/prisma";
import { PACKAGES, rupiah } from "@/lib/data";
import {
  BANNER,
  FAQ,
  GRADS,
  PACKAGE_UI,
  SAMPLE_PROJECTS,
  type PortfolioItem,
} from "@/lib/landing";
import OrderForm from "@/components/OrderForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import Reveal from "@/components/Reveal";
import PortfolioCarousel from "@/components/PortfolioCarousel";
import SelectPackageLink from "@/components/SelectPackageLink";
import { Star, Squiggle } from "@/components/Decor";

export const dynamic = "force-dynamic";

const LANGKAH = [
  {
    n: 1,
    t: "Konsultasi",
    d: "Kirim kebutuhanmu, dapat estimasi harga & waktu secara gratis tanpa komitmen.",
    bg: "bg-sun",
  },
  {
    n: 2,
    t: "DP 50%",
    d: "Pengerjaan langsung dimulai setelah DP masuk via QRIS instan atau Transfer Bank.",
    bg: "bg-mint",
  },
  {
    n: 3,
    t: "Video Demo",
    d: "Cek fungsinya lewat demo video sebelum pelunasan. Bebas cek alur & request penyesuaian.",
    bg: "bg-bubble",
  },
  {
    n: 4,
    t: "Pelunasan",
    d: "Lunas, lalu source code & database diserahkan full, plus panduan install atau deploy live.",
    bg: "bg-coral text-white",
  },
];

export default async function Home() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  // Proyek dari database. Kalau kosong, tampilkan contoh dari lib/landing.ts
  const dbItems: PortfolioItem[] = projects.map((p, i) => {
    const tech = p.tech.split(",").map((t) => t.trim()).filter(Boolean);
    return {
      id: p.id,
      judul: p.judul,
      deskripsi: p.deskripsi,
      tech,
      badge: tech[0] ?? "Proyek",
      chip: p.url ? "Live Demo" : "",
      footer: "",
      icon: "</>",
      grad: GRADS[i % GRADS.length],
      paket: "",
      url: p.url,
      gambar: p.gambar,
    };
  });
  const items = dbItems.length > 0 ? dbItems : SAMPLE_PROJECTS;

  const minPrice = Math.min(...PACKAGES.map((p) => p.source));

  return (
    <>
      {/* BANNER */}
      <div className="relative z-50 flex items-center justify-center gap-2 border-b-[3px] border-ink bg-violet px-4 py-2.5 text-center text-xs font-bold text-white md:text-sm">
        <span className="inline-block animate-pulse rounded-full bg-sun px-2.5 py-0.5 text-xs font-bold text-ink shadow-brutal-sm">
          {BANNER.badge}
        </span>
        <span>{BANNER.text}</span>
      </div>

      <Navbar />

      <main className="mx-auto max-w-[1140px] px-4 sm:px-6">
        {/* 1. HERO */}
        <section className="relative py-12 md:py-20">
          <Reveal>
            <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none opacity-35 md:left-2 md:translate-x-0">
              <Star className="floating-shape size-12" fill="#1E1B3A" />
            </div>

            <div className="grid items-center gap-10 lg:grid-cols-12">
              {/* Kiri */}
              <div className="space-y-6 text-left lg:col-span-7">
                <div className="inline-flex cursor-default items-center gap-2 rounded-full bg-ink px-4 py-1.5 font-heading text-xs font-bold text-sun shadow-brutal-sm transition-transform hover:scale-105 md:text-sm">
                  <span className="inline-block size-2.5 animate-ping rounded-full bg-mint" />
                  <span>JASA KODING & WEB DEV</span>
                </div>

                <h1 className="text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
                  Ide kamu, kodenya{" "}
                  <span className="relative mt-2 inline-block sm:mt-0">
                    <span className="inline-block -rotate-2 cursor-pointer rounded-2xl border-[3px] border-ink bg-coral px-3 py-1 text-white shadow-brutal transition-all hover:rotate-1 hover:scale-105 sm:px-4">
                      beres!
                    </span>
                    <Squiggle className="absolute -bottom-5 left-2 w-28" color="#FFC93C" />
                  </span>
                </h1>

                <p className="max-w-xl text-base font-medium leading-relaxed text-ink/90 sm:text-lg">
                  Pembuatan website & aplikasi untuk mahasiswa, UMKM, dan organisasi. Source code rapi, mudah
                  dipelajari, dan bisa sekalian di-<b>deploy</b> online langsung pakai.
                </p>

                <div className="pt-2">
                  <p className="mb-2.5 font-heading text-xs font-bold uppercase tracking-wider text-ink/70">
                    Siap melayani untuk:
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      ["🎓 Mahasiswa (Tugas/Skripsi)", "bg-mint"],
                      ["🏪 UMKM & Bisnis Lokal", "bg-sun"],
                      ["🏛️ Organisasi & Komunitas", "bg-bubble"],
                      ["🏆 Portofolio & Lomba", "bg-white"],
                    ].map(([t, c]) => (
                      <span
                        key={t}
                        className={`flex cursor-pointer items-center gap-1.5 rounded-full border-[3px] border-ink px-3.5 py-1.5 font-heading text-xs font-bold shadow-brutal-sm transition-transform hover:-translate-y-1 sm:text-sm ${c}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <a
                    href="#pesan"
                    className="neo-btn group flex items-center gap-2.5 rounded-xl bg-sun px-8 py-3.5 text-base shadow-brutal"
                  >
                    <span>Pesan Sekarang</span>
                    <svg
                      className="size-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  <a
                    href="#portofolio"
                    className="neo-btn rounded-xl bg-white px-7 py-3.5 text-base shadow-brutal hover:bg-cream"
                  >
                    Lihat Demo Proyek 🚀
                  </a>
                </div>
              </div>

              {/* Kanan: mockup */}
              <div className="relative mt-6 flex justify-center lg:col-span-5 lg:mt-0">
                <div className="relative w-full max-w-[420px]">
                  <div className="floating-shape absolute -right-4 -top-4 z-0 size-40 rotate-12 rounded-3xl border-[3px] border-ink bg-mint" />
                  <div className="absolute -bottom-6 -left-6 z-0 size-24 rounded-full border-[3px] border-ink bg-bubble" />
                  <Star className="floating-shape absolute -left-4 -top-8 z-20 size-11" fill="#FFC93C" />

                  <div className="neo-card relative z-10 space-y-4 bg-white p-5">
                    <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-block size-3.5 rounded-full border-2 border-ink bg-coral" />
                        <span className="inline-block size-3.5 rounded-full border-2 border-ink bg-sun" />
                        <span className="inline-block size-3.5 rounded-full border-2 border-ink bg-mint" />
                      </div>
                      <div className="flex items-center gap-1 rounded-md border-2 border-ink bg-cream px-3 py-0.5 font-mono text-[11px] font-bold">
                        <span className="size-1.5 rounded-full bg-mint" /> localhost:3000/app
                      </div>
                      <span className="w-4" />
                    </div>

                    <div className="space-y-2 rounded-xl border-2 border-ink bg-ink p-4 font-mono text-xs text-white">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-sun/90">
                        <span className="flex items-center gap-1.5 font-bold">
                          <span className="size-2 rounded-full bg-mint" /> deploy.sh
                        </span>
                        <span className="text-[10px] text-white/50">Node.js + Tailwind</span>
                      </div>
                      <p className="text-mint">
                        <span className="font-bold text-bubble">$</span> git commit -m &quot;fitur siap deploy&quot;
                      </p>
                      <p className="text-white/80">
                        <span className="font-bold text-bubble">$</span> build success in 1.4s ⚡
                      </p>
                      <div className="flex items-center justify-between rounded border-2 border-mint/40 bg-black/40 p-2 text-[11px] text-sun">
                        <span>✔ Status: Online & Fast</span>
                        <span className="rounded bg-mint px-1.5 py-0.5 text-[10px] font-bold text-ink">200 OK</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3">
                        <span className="grid size-12 place-items-center rounded-full border-[3px] border-ink bg-sun font-heading text-xl font-bold shadow-brutal-sm transition-transform hover:rotate-12">
                          {"</>"}
                        </span>
                        <div>
                          <h2 className="font-heading text-sm font-bold">Garansi Berjalan</h2>
                          <p className="text-xs font-semibold text-ink/70">Source code full milik kamu</p>
                        </div>
                      </div>
                      <span className="rotate-2 rounded-lg border-[3px] border-ink bg-coral px-2.5 py-1 font-heading text-xs font-bold text-white shadow-brutal-sm transition-transform hover:rotate-0">
                        100% Bersih
                      </span>
                    </div>
                  </div>

                  <div className="floating-badge absolute -bottom-4 right-2 z-20 flex items-center gap-1.5 rounded-full border-[3px] border-ink bg-sun px-3.5 py-1.5 font-heading text-xs font-bold shadow-brutal">
                    ⚡ Pengerjaan 1-3 Hari
                  </div>
                </div>
              </div>
            </div>

            {/* Trust strip */}
            <div className="neo-card mt-14 bg-white p-4 sm:p-5">
              <div className="grid gap-4 divide-y-2 divide-ink/15 text-center md:grid-cols-3 md:divide-x-2 md:divide-y-0">
                {[
                  ["✓", "bg-mint", "Revisi 3 hari kerja aktif"],
                  ["📹", "bg-sun", "Demo video sebelum lunas"],
                  ["🚀", "bg-bubble", "Bisa sekalian deploy online"],
                ].map(([ic, bg, t]) => (
                  <div key={t} className="group flex items-center justify-center gap-3 pt-2 first:pt-0 md:pt-0">
                    <span
                      className={`grid size-8 place-items-center rounded-full border-[3px] border-ink text-sm font-bold transition-transform group-hover:scale-110 ${bg}`}
                    >
                      {ic}
                    </span>
                    <span className="font-heading text-sm font-bold sm:text-base">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* 2. DAFTAR HARGA */}
        <section id="harga" className="scroll-mt-24 py-16">
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-sun px-3 py-1 font-heading text-xs font-bold shadow-brutal-sm">
                <span>TRANSPARAN & TERJANGKAU</span>
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Daftar Harga</h2>
              <p className="text-sm font-semibold text-ink/80 sm:text-base">
                *harga mulai dari, final menyesuaikan kebutuhan fitur & kerumitan
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {PACKAGES.map((p, i) => {
                const ui = PACKAGE_UI[p.id];
                const popular = ui?.popular;
                return (
                  <div
                    key={p.id}
                    className={`neo-card relative flex flex-col justify-between p-6 sm:p-7 ${
                      popular ? "border-4 bg-[#FFFDF7] ring-2 ring-coral/40" : ""
                    }`}
                  >
                    {popular && (
                      <div className="floating-badge absolute -top-4 right-6 rotate-3 rounded-full border-[3px] border-ink bg-coral px-4 py-1 font-heading text-xs font-bold uppercase text-white shadow-brutal">
                        🔥 Paling Populer
                      </div>
                    )}
                    <div>
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <span
                          className={`grid size-12 place-items-center rounded-full border-[3px] border-ink font-heading text-xl font-bold shadow-brutal-sm ${
                            ui?.circle ?? "bg-sun"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="rounded-full border-[3px] border-ink bg-cream px-3 py-1 font-heading text-xs font-bold">
                          ⏱️ {p.durasi}
                        </span>
                      </div>
                      <h3 className="mb-2 text-2xl font-bold">{p.nama}</h3>
                      <p className="mb-6 text-sm font-medium leading-relaxed text-ink/80">{ui?.desc ?? p.desk}</p>
                    </div>

                    <div className="space-y-3 border-t-2 border-ink/15 pt-4">
                      <div className="flex items-center justify-between rounded-xl border-[3px] border-ink bg-sun/30 p-3">
                        <span className="font-heading text-xs font-bold uppercase">Paket Source Code</span>
                        <span className="font-heading text-lg font-bold">{rupiah(p.source)}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border-[3px] border-ink bg-violet p-3 text-white shadow-brutal-sm">
                        <span className="flex items-center gap-1 font-heading text-xs font-bold uppercase">
                          <span>{ui?.deployLabel ?? "+ Deploy Online"}</span>
                          {ui?.deployNote && (
                            <span className={`text-[10px] ${ui.deployNote.cls}`}>{ui.deployNote.text}</span>
                          )}
                        </span>
                        <span className="font-heading text-lg font-bold text-sun">{rupiah(p.deploy)}</span>
                      </div>
                      <SelectPackageLink
                        id={p.id}
                        className={`neo-btn mt-2 block w-full rounded-xl py-2.5 text-center text-xs ${
                          ui?.ctaCls ?? "bg-white font-bold hover:bg-cream"
                        }`}
                      >
                        {ui?.cta ?? "Pilih Paket Ini →"}
                      </SelectPackageLink>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info card navy */}
            <div className="mt-12 rounded-2xl border-[3px] border-ink bg-ink p-6 text-white shadow-brutal-lg sm:p-8">
              <div className="grid grid-cols-1 gap-8 divide-y-2 divide-white/20 md:grid-cols-2 md:divide-x-2 md:divide-y-0">
                <div className="space-y-3 md:pr-6">
                  <div className="flex items-center gap-2.5">
                    <span className="size-3 rounded-full border-2 border-white bg-sun" />
                    <h4 className="text-xl font-bold text-sun">Paket Source Code</h4>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-white/90 sm:text-base">
                    Kamu menerima Full source code (.ZIP), file database (.SQL), dan panduan instalasi lengkap
                    (README) dengan petunjuk langkah demi langkah menjalankan di localhost kamu.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2 font-mono text-xs">
                    <span className="rounded bg-white/10 px-2.5 py-1">📦 .ZIP rapi</span>
                    <span className="rounded bg-white/10 px-2.5 py-1">🗄️ Database siap import</span>
                    <span className="rounded bg-white/10 px-2.5 py-1">📖 Dokumentasi setup</span>
                  </div>
                </div>
                <div className="space-y-3 pt-6 md:pl-6 md:pt-0">
                  <div className="flex items-center gap-2.5">
                    <span className="size-3 rounded-full border-2 border-white bg-mint" />
                    <h4 className="text-xl font-bold text-mint">Paket + Deploy</h4>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-white/90 sm:text-base">
                    Setup server/hosting, instalasi SSL HTTPS, upload file, dan konfigurasi database sampai website
                    online live dan siap diakses publik.{" "}
                    <span className="font-bold text-sun">*Domain & hosting dibayar terpisah</span> sesuai paket
                    pilihanmu.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2 font-mono text-xs">
                    <span className="rounded bg-white/10 px-2.5 py-1">🔒 SSL Gratis</span>
                    <span className="rounded bg-white/10 px-2.5 py-1">🌐 Live URL Publik</span>
                    <span className="rounded bg-white/10 px-2.5 py-1">⚙️ Siap Pakai</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 3. PORTOFOLIO */}
        <section id="portofolio" className="relative scroll-mt-24 py-16">
          <Reveal>
            {items.length === 0 ? (
              <div className="neo-card mx-auto max-w-xl space-y-4 bg-white p-10 text-center">
                <div className="mx-auto grid size-20 place-items-center rounded-full border-[3px] border-ink bg-sun text-3xl shadow-brutal-sm">
                  📂
                </div>
                <h3 className="text-2xl font-bold">Belum ada proyek yang ditampilkan saat ini</h3>
                <p className="text-sm font-medium leading-relaxed text-ink/80">
                  Kami sedang merapikan showcase proyek-proyek terbaru. Kamu bisa langsung konsultasikan ide proyekmu
                  dan jadi yang berikutnya tampil di sini!
                </p>
                <a
                  href="#pesan"
                  className="neo-btn inline-flex items-center gap-2 rounded-xl bg-mint px-6 py-2.5 font-heading text-xs shadow-brutal-sm"
                >
                  <span>Mulai Proyek Pertamamu</span>
                  <span>⚡</span>
                </a>
              </div>
            ) : (
              <PortfolioCarousel
                items={items}
                header={
                  <>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-mint px-3 py-1 font-heading text-xs font-bold shadow-brutal-sm">
                      <span>HASIL PENGERJAAN NYATA • SLIDER AKTIF</span>
                    </div>
                    <h2 className="text-3xl font-bold sm:text-4xl">Portofolio Proyek</h2>
                    <p className="mt-1 text-sm font-medium text-ink/80 sm:text-base">
                      Geser dan telusuri beragam aplikasi & website yang sudah selesai dan teruji.
                    </p>
                  </>
                }
              />
            )}
          </Reveal>
        </section>

        {/* 4. CARA PESAN */}
        <section id="cara-pesan" className="scroll-mt-24 py-16">
          <Reveal>
            <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-bubble px-3 py-1 font-heading text-xs font-bold shadow-brutal-sm">
                  <span>ALUR MUDAH & JELAS</span>
                </div>
                <h2 className="text-3xl font-bold sm:text-4xl">Cara Pesan</h2>
              </div>
              <div className="floating-badge self-start rounded-xl border-[3px] border-ink bg-coral px-4 py-2 font-heading text-xs font-bold text-white shadow-brutal sm:self-auto sm:text-sm">
                🛡️ Garansi revisi 3 hari kerja!
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-8 right-8 top-1/2 -z-0 hidden h-1 -translate-y-8 border-t-4 border-dashed border-ink/30 lg:block" />
              <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {LANGKAH.map((l) => (
                  <div key={l.n} className="neo-card flex flex-col justify-between bg-white p-6">
                    <div>
                      <div
                        className={`mb-4 grid size-12 place-items-center rounded-2xl border-[3px] border-ink font-heading text-xl font-bold shadow-brutal-sm ${l.bg}`}
                      >
                        {l.n}
                      </div>
                      <h3 className="mb-2 text-xl font-bold">{l.t}</h3>
                      <p className="text-xs font-medium leading-relaxed text-ink/85 sm:text-sm">{l.d}</p>
                    </div>
                    <div className="mt-4 border-t-2 border-ink/10 pt-3 font-mono text-[11px] font-bold text-violet">
                      Step 0{l.n} / 04{l.n === 4 ? " • Beres!" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* 5. FORM PEMESANAN */}
        <section id="pesan" className="scroll-mt-24 py-16">
          <Reveal>
            <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-sun px-3 py-1 font-heading text-xs font-bold shadow-brutal-sm">
                <span>KONSULTASI GRATIS</span>
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Yuk, mulai proyekmu!</h2>
              <p className="text-sm font-medium text-ink/85 sm:text-base">
                Isi form di bawah, estimasi harga gratis. Bayar fleksibel: QRIS Instan, Transfer Bank, E-Wallet.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {["📱 QRIS Semua Bank", "🏦 Transfer BCA / Mandiri / BRI", "👛 Gopay / OVO / Dana / ShopeePay"].map(
                  (t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 rounded-full border-[3px] border-ink bg-white px-3 py-1 font-heading text-xs font-bold shadow-brutal-sm transition-transform hover:-translate-y-0.5"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="mx-auto max-w-2xl">
              <OrderForm />
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-t-2 border-ink/15 py-12">
          <Reveal>
            <div className="mx-auto mb-8 max-w-xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Pertanyaan Umum (FAQ)</h2>
            </div>
            <div className="mx-auto max-w-2xl space-y-3">
              {FAQ.map((f) => (
                <details key={f.q} className="neo-card group cursor-pointer bg-white p-4">
                  <summary className="flex list-none items-center justify-between font-heading text-sm font-bold sm:text-base">
                    <span>{f.q}</span>
                    <span className="text-lg font-bold transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-2 border-t border-ink/10 pt-3 text-xs font-medium leading-relaxed text-ink/80 sm:text-sm">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}