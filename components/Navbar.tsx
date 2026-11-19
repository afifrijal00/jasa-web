"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-cream/95 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-[1140px] items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <a href="#" className="group flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full border-[3px] border-ink bg-sun font-heading text-lg font-bold shadow-brutal-sm transition-transform duration-300 group-hover:rotate-12">
            {"</>"}
          </span>
          <span className="flex flex-col">
            <span className="font-heading text-xl font-bold leading-none tracking-tight transition-colors group-hover:text-violet">
              Jasa Koding
            </span>
            <span className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-violet">
              Web Dev & Solution
            </span>
          </span>
        </a>

        {/* Menu desktop */}
        <nav className="hidden items-center gap-7 font-heading text-sm font-bold tracking-wide md:flex">
          <a href="#harga" className="underline-offset-4 transition-colors hover:text-violet hover:underline">
            Harga
          </a>
          <a
            href="#portofolio"
            className="flex items-center gap-1.5 underline-offset-4 transition-colors hover:text-violet hover:underline"
          >
            <span>Portofolio</span>
            <span className="size-2 animate-ping rounded-full bg-coral" />
          </a>
          <a href="#cara-pesan" className="underline-offset-4 transition-colors hover:text-violet hover:underline">
            Cara Pesan
          </a>
          <a href="#faq" className="underline-offset-4 transition-colors hover:text-violet hover:underline">
            FAQ
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="#pesan" className="neo-btn flex items-center gap-2 rounded-xl bg-sun px-5 py-2.5 text-sm">
            <span>Pesan Sekarang</span>
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Hamburger */}
        <button
          type="button"
          aria-label="Buka menu navigasi"
          onClick={() => setOpen((v) => !v)}
          className="neo-btn grid size-11 place-items-center rounded-xl bg-white shadow-brutal-sm hover:bg-sun md:hidden"
        >
          <svg className="size-6" fill="none" stroke="#1E1B3A" strokeWidth="2.5" viewBox="0 0 24 24">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="space-y-4 border-b-[3px] border-ink bg-cream px-6 py-5 shadow-brutal md:hidden">
          <div className="flex flex-col gap-3 font-heading text-base font-bold">
            <a href="#harga" onClick={close} className="border-b border-ink/15 py-2 hover:text-violet">
              Daftar Harga
            </a>
            <a
              href="#portofolio"
              onClick={close}
              className="flex items-center justify-between border-b border-ink/15 py-2 hover:text-violet"
            >
              <span>Portofolio & Studi Kasus</span>
              <span className="rounded border-2 border-ink bg-sun px-2 py-0.5 text-xs">Carousel</span>
            </a>
            <a href="#cara-pesan" onClick={close} className="border-b border-ink/15 py-2 hover:text-violet">
              Cara Pemesanan
            </a>
            <a href="#pesan" onClick={close} className="py-2 hover:text-violet">
              Form Order
            </a>
          </div>
          <a
            href="#pesan"
            onClick={close}
            className="neo-btn block w-full rounded-xl bg-sun py-3 text-center text-base shadow-brutal"
          >
            Pesan Sekarang ⚡
          </a>
        </div>
      )}
    </header>
  );
}