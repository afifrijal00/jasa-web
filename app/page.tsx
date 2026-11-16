import { prisma } from "@/lib/prisma";
import { PACKAGES, rupiah } from "@/lib/data";
import OrderForm from "@/components/OrderForm";

export const dynamic = "force-dynamic";

const LANGKAH = [
  { n: 1, t: "Konsultasi", d: "Kirim kebutuhanmu, dapat estimasi harga & waktu.", bg: "bg-sun" },
  { n: 2, t: "DP 50%", d: "Pengerjaan langsung dimulai setelah DP masuk.", bg: "bg-mint" },
  { n: 3, t: "Video Demo", d: "Cek fungsinya lewat demo video sebelum pelunasan.", bg: "bg-bubble" },
  { n: 4, t: "Pelunasan", d: "Lunas, lalu source code & database diserahkan.", bg: "bg-coral" },
];

export default async function Home() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20">
      {/* HERO */}
      <section className="pt-12 pb-10">
        <span className="inline-block rounded-full bg-ink px-4 py-1 text-sm font-extrabold tracking-widest text-sun">
          JASA KODING & WEB DEV
        </span>
        <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">
          Ide kamu,
          <br />
          kodenya <span className="brut inline-block -rotate-1 bg-coral px-3">beres!</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg">
          Pembuatan website & aplikasi untuk mahasiswa, UMKM, dan organisasi. Source code rapi, bisa sekalian di-<b>deploy</b> online.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold">
          {[["Mahasiswa", "bg-mint"], ["UMKM", "bg-sun"], ["Organisasi & Komunitas", "bg-bubble"], ["Portofolio & Lomba", "bg-white"]].map(([t, c]) => (
            <span key={t} className={`rounded-full border-2 border-ink px-3 py-1 ${c}`}>{t}</span>
          ))}
        </div>
        <a href="#pesan" className="btn bg-sun mt-8">Pesan Sekarang</a>
      </section>

      {/* HARGA */}
      <section id="harga" className="py-10">
        <h2 className="text-3xl font-black">Daftar Harga</h2>
        <p className="text-sm">*harga mulai dari, final menyesuaikan kebutuhan</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {PACKAGES.map((p, i) => (
            <div key={p.id} className="brut bg-white p-5">
              <div className="flex items-center gap-3">
                <span className={`grid size-9 place-items-center rounded-full border-2 border-ink font-black ${p.bg}`}>{i + 1}</span>
                <h3 className="text-xl font-black">{p.nama}</h3>
              </div>
              <p className="mt-2 text-sm">{p.desk}</p>
              <span className="mt-2 inline-block rounded-full border-2 border-ink px-2 text-xs font-bold">{p.durasi}</span>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="brut bg-sun p-2"><div className="text-xs">Source Code</div><b>{rupiah(p.source)}</b></div>
                <div className="brut bg-violet p-2 text-white"><div className="text-xs">+ Deploy Online</div><b>{rupiah(p.deploy)}</b></div>
              </div>
            </div>
          ))}
        </div>
        <div className="brut mt-6 grid gap-4 bg-ink p-5 text-white md:grid-cols-2">
          <div><b className="text-sun">Paket Source Code</b><p className="text-sm">Full source code (.ZIP), database (.SQL), dan panduan install (README).</p></div>
          <div><b className="text-mint">Paket + Deploy</b><p className="text-sm">Setup server/hosting, SSL, upload & konfigurasi sampai online. Domain & hosting dibayar terpisah.</p></div>
        </div>
      </section>

      {/* PORTOFOLIO */}
      <section id="portofolio" className="py-10">
        <h2 className="text-3xl font-black">Portofolio</h2>
        {projects.length === 0 ? (
          <p className="mt-4">Belum ada proyek. Tambahkan lewat halaman /admin.</p>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {projects.map((p) => (
              <article key={p.id} className="brut overflow-hidden bg-white">
                {p.gambar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.gambar} alt={p.judul} className="h-40 w-full border-b-[3px] border-ink object-cover" />
                ) : (
                  <div className="grid h-40 place-items-center border-b-[3px] border-ink bg-mint text-4xl font-black">{"</>"}</div>
                )}
                <div className="p-4">
                  <h3 className="font-black">{p.judul}</h3>
                  <p className="mt-1 text-sm">{p.deskripsi}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.tech.split(",").map((t) => (
                      <span key={t} className="rounded-full border-2 border-ink bg-sun px-2 text-xs font-bold">{t.trim()}</span>
                    ))}
                  </div>
                  {p.url && <a href={p.url} target="_blank" className="mt-3 inline-block text-sm font-bold underline">Lihat proyek →</a>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CARA PESAN */}
      <section className="py-10">
        <h2 className="text-3xl font-black">Cara Pesan</h2>
        <span className="brut mt-2 inline-block bg-coral px-3 py-1 text-sm font-bold text-white">Garansi revisi 3 hari kerja!</span>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {LANGKAH.map((l) => (
            <div key={l.n} className="brut bg-white p-4">
              <span className={`grid size-9 place-items-center rounded-full border-2 border-ink font-black ${l.bg}`}>{l.n}</span>
              <h3 className="mt-2 font-black">{l.t}</h3>
              <p className="text-sm">{l.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section id="pesan" className="py-10">
        <h2 className="mb-1 text-3xl font-black">Yuk, mulai proyekmu!</h2>
        <p className="mb-6">Isi form di bawah, estimasi harga gratis. Bayar fleksibel: QRIS Instan, Transfer Bank, E-Wallet.</p>
        <div className="mx-auto max-w-xl"><OrderForm /></div>
      </section>
    </main>
  );
}