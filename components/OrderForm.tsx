"use client";

import { useActionState, useState } from "react";
import { createOrder, type OrderState } from "@/app/actions";
import { PACKAGES, rupiah } from "@/lib/data";

export default function OrderForm() {
  const [state, action, pending] = useActionState<OrderState, FormData>(createOrder, {});
  const [paket, setPaket] = useState<string>(PACKAGES[0].id);
  const [deploy, setDeploy] = useState(false);

  const pkg = PACKAGES.find((p) => p.id === paket)!;
  const estimasi = deploy ? pkg.deploy : pkg.source;

  if (state.ok) {
    return (
      <div className="brut bg-mint p-6 text-center">
        <h3 className="text-2xl font-black">Pesanan tercatat! 🎉</h3>
        <p className="mt-2">
          Kode pesananmu: <b>{state.kode}</b>
        </p>
        <p className="mt-1">Lanjutkan ke WhatsApp untuk konsultasi dan DP.</p>
        <a href={state.wa} target="_blank" className="btn bg-sun mt-4">
          Lanjut ke WhatsApp →
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="brut bg-white p-6 space-y-4">
      <div>
        <label className="font-bold">Nama</label>
        <input name="nama" className="input" required />
      </div>
      <div>
        <label className="font-bold">WhatsApp / Email</label>
        <input name="kontak" className="input" required />
      </div>
      <div>
        <label className="font-bold">Paket</label>
        <select name="paket" value={paket} onChange={(e) => setPaket(e.target.value)} className="input">
          {PACKAGES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama}
            </option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 font-bold">
        <input type="checkbox" name="deploy" checked={deploy} onChange={(e) => setDeploy(e.target.checked)} className="size-5" />
        Sekalian deploy online
      </label>
      <div>
        <label className="font-bold">Ceritakan kebutuhanmu</label>
        <textarea name="deskripsi" rows={4} className="input" required />
      </div>

      <div className="brut bg-violet p-4 text-white">
        <div className="flex justify-between"><span>Estimasi mulai dari</span><b>{rupiah(estimasi)}</b></div>
        <div className="flex justify-between"><span>DP 50%</span><b>{rupiah(estimasi / 2)}</b></div>
        <p className="mt-2 text-xs opacity-80">*Harga final menyesuaikan kebutuhan. Domain & hosting dibayar terpisah.</p>
      </div>

      {state.error && <p className="font-bold text-red-600">{state.error}</p>}
      <button disabled={pending} className="btn bg-sun w-full">
        {pending ? "Mengirim..." : "Kirim Pesanan"}
      </button>
    </form>
  );
}