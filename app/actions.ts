"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PACKAGES, rupiah } from "@/lib/data";

const schema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  kontak: z.string().min(6, "Isi nomor WhatsApp atau email yang valid"),
  paket: z.enum(["landing", "crud", "scraping", "sistem"]),
  deploy: z.boolean(),
  deskripsi: z.string().min(10, "Ceritakan kebutuhanmu minimal 10 karakter"),
});

export type OrderState = { ok?: boolean; error?: string; kode?: string; wa?: string };

export async function createOrder(_: OrderState, fd: FormData): Promise<OrderState> {
  const parsed = schema.safeParse({
    nama: fd.get("nama"),
    kontak: fd.get("kontak"),
    paket: fd.get("paket"),
    deploy: fd.get("deploy") === "on",
    deskripsi: fd.get("deskripsi"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const d = parsed.data;
  const pkg = PACKAGES.find((p) => p.id === d.paket)!;
  const estimasi = d.deploy ? pkg.deploy : pkg.source;
  const kode = "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  await prisma.order.create({ data: { kode, ...d, estimasi } });

  const pesan =
    `Halo, saya mau pesan.\n` +
    `Kode: ${kode}\nNama: ${d.nama}\nPaket: ${pkg.nama}${d.deploy ? " + Deploy" : ""}\n` +
    `Estimasi: ${rupiah(estimasi)} (DP 50% = ${rupiah(estimasi / 2)})\n` +
    `Kebutuhan: ${d.deskripsi}`;
  const wa = `https://wa.me/${process.env.WA_NUMBER}?text=${encodeURIComponent(pesan)}`;

  return { ok: true, kode, wa };
}