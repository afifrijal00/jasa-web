"use client";

import { useActionState, useEffect, useState } from "react";
import { createOrder, type OrderState } from "@/app/actions";
import { PACKAGES, rupiah } from "@/lib/data";
import { RESPONSE_NOTE } from "@/lib/landing";

function FormInner({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = useActionState<OrderState, FormData>(createOrder, {});
  const [paket, setPaket] = useState<string>(PACKAGES[0].id);
  const [deploy, setDeploy] = useState(false);

  // Tombol "Pilih Paket Ini" / "Pesan tipe ini" memilih paket di form
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (PACKAGES.some((p) => p.id === id)) setPaket(id);
    };
    window.addEventListener("select-package", handler);
    return () => window.removeEventListener("select-package", handler);
  }, []);

  const pkg = PACKAGES.find((p) => p.id === paket)!;
  const estimasi = deploy ? pkg.deploy : pkg.source;

  if (state.ok) {
    return (
      <div className="neo-card space-y-4 border-4 bg-mint p-8 text-center shadow-brutal-lg">
        <div className="mx-auto grid size-16 place-items-center rounded-full border-[3px] border-ink bg-white text-3xl shadow-brutal-sm">
          🎉
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold sm:text-3xl">Pesanan tercatat! 🎉</h3>
          <div className="my-2 inline-block rounded-lg border-[3px] border-ink bg-ink px-3.5 py-1.5 font-mono text-sm font-bold text-sun shadow-brutal-sm">
            Kode pesananmu: {state.kode}
          </div>
          <p className="mx-auto max-w-md text-sm font-semibold text-ink/90">{RESPONSE_NOTE}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <a
            href={state.wa}
            target="_blank"
            className="neo-btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sun px-8 py-3.5 text-base shadow-brutal sm:w-auto"
          >
            <span>Lanjut ke WhatsApp</span>
            <span>→</span>
          </a>
          <button type="button" onClick={onReset} className="neo-btn rounded-xl bg-white px-5 py-3 text-xs">
            Isi Form Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="neo-card bg-white p-6 shadow-brutal-lg sm:p-9">
      <form action={action} className="space-y-6">
        <div>
          <label className="mb-2 block font-heading text-sm font-bold" htmlFor="nama">
            Nama Lengkap <span className="text-coral">*</span>
          </label>
          <input
            id="nama"
            name="nama"
            className="input"
            placeholder="Contoh: Budi Santoso / CV Maju Bersama"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-heading text-sm font-bold" htmlFor="kontak">
            Nomor WhatsApp atau Email <span className="text-coral">*</span>
          </label>
          <input
            id="kontak"
            name="kontak"
            className="input"
            placeholder="08123456789 atau nama@email.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-heading text-sm font-bold" htmlFor="paket">
            Pilih Paket Proyek <span className="text-coral">*</span>
          </label>
          <div className="relative">
            <select
              id="paket"
              name="paket"
              value={paket}
              onChange={(e) => setPaket(e.target.value)}
              className="input cursor-pointer appearance-none pr-10 font-heading font-bold"
            >
              {PACKAGES.map((p, i) => (
                <option key={p.id} value={p.id}>
                  {i + 1}. {p.nama} (Mulai {rupiah(p.source)})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 font-bold">▼</div>
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3.5 rounded-xl border-[3px] border-ink bg-cream/60 p-4 transition hover:bg-cream">
          <input
            type="checkbox"
            name="deploy"
            checked={deploy}
            onChange={(e) => setDeploy(e.target.checked)}
            className="check mt-0.5"
          />
          <span className="select-none text-xs font-bold leading-snug text-ink sm:text-sm">
            <span>Sekalian deploy online ke internet (+ server setup & SSL aktif)</span>
            <span className="mt-0.5 block text-[11px] font-normal text-ink/70">
              Kami bantu konfigurasi hosting/VPS sampai web live dapat link publik.
            </span>
          </span>
        </label>

        <div>
          <label className="mb-2 block font-heading text-sm font-bold" htmlFor="deskripsi">
            Ceritakan Kebutuhanmu <span className="text-coral">*</span>
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            rows={4}
            className="input"
            placeholder="Jelaskan fitur yang kamu butuhkan, deadline, referensi desain, atau topik skripsi..."
            required
          />
        </div>

        {/* Estimasi */}
        <div className="space-y-3 rounded-2xl border-[3px] border-ink bg-violet p-5 text-white shadow-brutal-sm">
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <span className="font-heading text-xs font-bold uppercase tracking-wide text-white/80">
              Estimasi Biaya Awal
            </span>
            <span
              className={`rounded px-2 py-0.5 font-heading text-[10px] font-bold uppercase text-ink ${
                deploy ? "bg-mint" : "bg-sun"
              }`}
            >
              {deploy ? "+ Deploy Live Online" : "Source Code Only"}
            </span>
          </div>
          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
            <span className="font-heading text-2xl font-bold text-sun sm:text-3xl">
              Estimasi mulai dari {rupiah(estimasi)}
            </span>
            <span className="font-heading text-sm font-bold text-mint">DP 50% {rupiah(Math.round(estimasi / 2))}</span>
          </div>
          <p className="pt-1 text-[11px] font-medium leading-normal text-white/80">
            *Harga final menyesuaikan kebutuhan. Domain & hosting dibayar terpisah.
          </p>
        </div>

        {state.error && (
          <div className="rounded-xl border-[3px] border-red-600 bg-red-100 p-3 text-xs font-bold text-red-700">
            ⚠️ {state.error}
          </div>
        )}

        <div className="space-y-3 pt-2">
          {pending ? (
            <div className="w-full animate-pulse rounded-xl border-[3px] border-ink bg-cream py-3 text-center font-heading text-sm font-bold">
              ⏳ Mengirim... Menyambungkan ke sistem...
            </div>
          ) : (
            <button className="neo-btn flex w-full items-center justify-center gap-2 rounded-xl bg-sun py-4 text-lg shadow-brutal">
              <span>Kirim Pesanan</span>
              <span>🚀</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function OrderForm() {
  const [k, setK] = useState(0);
  return <FormInner key={k} onReset={() => setK((v) => v + 1)} />;
}