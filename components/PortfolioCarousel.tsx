"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SelectPackageLink from "@/components/SelectPackageLink";
import type { PortfolioItem } from "@/lib/landing";

const GAP = 24;
const getStep = (t: HTMLDivElement) => {
  const c = t.firstElementChild as HTMLElement | null;
  return c ? c.offsetWidth + GAP : 360;
};

export default function PortfolioCarousel({
  items,
  header,
}: {
  items: PortfolioItem[];
  header: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  const [paused, setPaused] = useState(false);
  const n = items.length;

  const measure = useCallback(() => {
    const t = trackRef.current;
    if (t) setScrollable(t.scrollWidth - t.clientWidth > 8);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, n]);

  const goTo = useCallback((i: number) => {
    const t = trackRef.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    t.scrollTo({ left: Math.min(i * getStep(t), max), behavior: "smooth" });
    setIndex(i);
  }, []);

  const onScroll = () => {
    const t = trackRef.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    const i = t.scrollLeft >= max - 4 ? n - 1 : Math.round(t.scrollLeft / getStep(t));
    setIndex(Math.max(0, Math.min(n - 1, i)));
  };

  // Auto-slide: berhenti saat hover/sentuh, menghormati reduced motion
  useEffect(() => {
    if (!scrollable || paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => goTo((index + 1) % n), 4000);
    return () => clearTimeout(id);
  }, [index, scrollable, paused, n, goTo]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      {/* Header + kontrol */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>{header}</div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="neo-btn rounded-xl bg-sun px-3.5 py-2 text-xs shadow-brutal-sm">
            Semua Proyek ({n})
          </span>
          {scrollable && (
            <div className="flex items-center gap-2 pl-2">
              <button
                type="button"
                aria-label="Slide sebelumnya"
                onClick={() => goTo((index - 1 + n) % n)}
                className="neo-btn grid size-10 place-items-center rounded-full bg-white hover:bg-sun"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Slide berikutnya"
                onClick={() => goTo((index + 1) % n)}
                className="neo-btn grid size-10 place-items-center rounded-full bg-sun"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between pb-3 font-heading text-xs font-bold text-ink/70">
        
        <span className="rounded-lg border-2 border-ink bg-white px-2.5 py-1 text-[11px] text-ink">
          Slide {index + 1} dari {n}
        </span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 py-2"
      >
        {items.map((p) => (
          <article
            key={p.id}
            className="neo-card group flex w-[85vw] shrink-0 snap-start flex-col justify-between overflow-hidden sm:w-[350px] md:w-[360px]"
          >
            <div>
              {/* Visual atas */}
              <div className="relative h-44 border-b-2 border-ink">
                {p.gambar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.gambar} alt={p.judul} className="size-full object-cover" />
                ) : (
                  <div className={`flex size-full items-center justify-center bg-linear-to-br p-4 ${p.grad}`}>
                    <span className="grid size-16 place-items-center rounded-full border-[3px] border-ink bg-white font-heading text-2xl font-bold shadow-brutal-sm transition-transform group-hover:scale-110">
                      {p.icon}
                    </span>
                  </div>
                )}
                <span className="absolute right-3 top-3 rounded bg-ink px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                  {p.badge}
                </span>
                {p.chip && (
                  <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full border-2 border-ink bg-white px-2 py-0.5 font-heading text-[10px] font-bold">
                    <span className="size-1.5 rounded-full bg-mint" /> {p.chip}
                  </span>
                )}
              </div>

              {/* Isi */}
              <div className="space-y-3 p-5">
                <h3 className="text-xl font-bold leading-tight">{p.judul}</h3>
                <p className="text-xs font-medium leading-relaxed text-ink/80">{p.deskripsi}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border-2 border-ink bg-sun px-2.5 py-0.5 font-heading text-[11px] font-bold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-ink/10 px-5 pb-5 pt-3">
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 font-heading text-xs font-bold text-violet underline-offset-4 hover:text-ink hover:underline"
                >
                  Lihat proyek →
                </a>
              ) : (
                <SelectPackageLink
                  id={p.paket}
                  className="inline-flex items-center gap-1.5 font-heading text-xs font-bold text-violet underline-offset-4 hover:text-ink hover:underline"
                >
                  Pesan tipe ini →
                </SelectPackageLink>
              )}
              {p.footer && <span className="font-mono text-[11px] font-bold text-ink/60">{p.footer}</span>}
            </div>
          </article>
        ))}
      </div>

      {/* Dots */}
      {scrollable && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {items.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-3 rounded-full border-2 border-ink transition-all duration-300 ${
                i === index ? "w-8 bg-ink" : "w-3 bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}