import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { STATUS, rupiah } from "@/lib/data";
import { login, logout, updateStatus, addProject, deleteProject } from "./actions";

export const dynamic = "force-dynamic";

export default async function Admin() {
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto max-w-sm px-4 py-20">
        <form action={login} className="brut space-y-4 bg-white p-6">
          <h1 className="text-2xl font-black">Admin</h1>
          <input type="password" name="password" placeholder="Password" className="input" />
          <button className="btn w-full bg-sun">Masuk</button>
        </form>
      </main>
    );
  }

  const [orders, projects] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Dashboard Admin</h1>
        <form action={logout}><button className="btn bg-white">Keluar</button></form>
      </div>

      <section>
        <h2 className="mb-3 text-2xl font-black">Pesanan ({orders.length})</h2>
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="brut flex flex-wrap items-center justify-between gap-3 bg-white p-4">
              <div>
                <b>{o.kode}</b> · {o.nama} · {o.kontak}
                <div className="text-sm">
                  {o.paket}{o.deploy ? " + deploy" : ""} · {rupiah(o.estimasi)} · {o.createdAt.toLocaleDateString("id-ID")}
                </div>
                <p className="mt-1 text-sm">{o.deskripsi}</p>
              </div>
              <form action={updateStatus} className="flex gap-2">
                <input type="hidden" name="id" value={o.id} />
                <select name="status" defaultValue={o.status} className="input !w-auto">
                  {STATUS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button className="btn bg-mint !py-1">Simpan</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-black">Portofolio</h2>
        <form action={addProject} className="brut grid gap-3 bg-white p-4 md:grid-cols-2">
          <input name="judul" placeholder="Judul" className="input" required />
          <input name="tech" placeholder="Tech (pisah koma): Laravel, MySQL" className="input" required />
          <input name="url" placeholder="Link proyek (opsional)" className="input" />
          <input name="gambar" placeholder="URL gambar (opsional)" className="input" />
          <textarea name="deskripsi" placeholder="Deskripsi singkat" className="input md:col-span-2" required />
          <button className="btn bg-sun md:col-span-2">Tambah Proyek</button>
        </form>
        <div className="mt-4 space-y-2">
          {projects.map((p) => (
            <form key={p.id} action={deleteProject} className="brut flex items-center justify-between bg-white p-3">
              <span><b>{p.judul}</b> · {p.tech}</span>
              <input type="hidden" name="id" value={p.id} />
              <button className="btn bg-coral !py-1">Hapus</button>
            </form>
          ))}
        </div>
      </section>
    </main>
  );
}