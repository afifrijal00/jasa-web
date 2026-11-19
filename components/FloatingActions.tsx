import { PACKAGES, rupiah } from "@/lib/data";
import { waLink } from "@/lib/wa";
import CatWhatsApp from "@/components/CatWhatsApp";

export default function FloatingActions() {
  const minPrice = Math.min(...PACKAGES.map((p) => p.source));

  return (
    <>
      {/* Kucing WhatsApp: animasi loop, bisa digeser, klik untuk chat */}
      <CatWhatsApp href={waLink("Halo, mau konsultasi pembuatan website.")} />

      {/* CTA bawah, khusus mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t-[3px] border-ink bg-cream/95 p-3 backdrop-blur-md md:hidden">
        <div className="pl-1">
          <span className="block text-[10px] font-bold uppercase text-ink/70">Mulai dari</span>
          <span className="font-heading text-base font-bold">{rupiah(minPrice)}</span>
        </div>
        <a href="#pesan" className="neo-btn rounded-xl bg-sun px-6 py-2.5 text-sm">
          Pesan Sekarang ⚡
        </a>
      </div>
    </>
  );
}