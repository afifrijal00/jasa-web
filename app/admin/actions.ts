"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { adminToken, isAdmin } from "@/lib/auth";

export async function login(fd: FormData) {
  if (fd.get("password") === process.env.ADMIN_PASSWORD) {
    (await cookies()).set("admin", adminToken(), { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
  }
  revalidatePath("/admin");
}

export async function logout() {
  (await cookies()).delete("admin");
  revalidatePath("/admin");
}

export async function updateStatus(fd: FormData) {
  if (!(await isAdmin())) return;
  const deadlineRaw = String(fd.get("deadline") || "").trim();
  const estimasiRaw = fd.get("estimasi");

  await prisma.order.update({
    where: { id: Number(fd.get("id")) },
    data: {
      status: String(fd.get("status")),
      deadline: deadlineRaw || null,
      ...(estimasiRaw ? { estimasi: Number(estimasiRaw) } : {}),
    },
  });
  revalidatePath("/admin");
}

export async function addProject(fd: FormData) {
  if (!(await isAdmin())) return;
  await prisma.project.create({
    data: {
      judul: String(fd.get("judul")),
      deskripsi: String(fd.get("deskripsi")),
      tech: String(fd.get("tech")),
      url: String(fd.get("url") || "") || null,
      gambar: String(fd.get("gambar") || "") || null,
    },
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteProject(fd: FormData) {
  if (!(await isAdmin())) return;
  await prisma.project.delete({ where: { id: Number(fd.get("id")) } });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function addCalendarNote(fd: FormData) {
  if (!(await isAdmin())) return;
  await prisma.calendarNote.create({
    data: {
      tanggal: String(fd.get("tanggal")),
      judul: String(fd.get("judul")),
      catatan: String(fd.get("catatan") || "") || null,
    },
  });
  revalidatePath("/admin");
}

export async function deleteCalendarNote(fd: FormData) {
  if (!(await isAdmin())) return;
  await prisma.calendarNote.delete({ where: { id: Number(fd.get("id")) } });
  revalidatePath("/admin");
}