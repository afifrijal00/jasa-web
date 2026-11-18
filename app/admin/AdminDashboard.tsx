"use client";

import { useState } from "react";
import Link from "next/link";
import { PACKAGES, STATUS, rupiah } from "@/lib/data";

type Order = {
  id: number;
  kode: string;
  nama: string;
  kontak: string;
  paket: string;
  deploy: boolean;
  estimasi: number;
  deskripsi: string;
  status: string;
  deadline: string | null;
  createdAt: Date | string;
};

type Project = {
  id: number;
  judul: string;
  tech: string;
  url: string | null;
  gambar: string | null;
  deskripsi: string;
};

type CalendarNote = {
  id: number;
  tanggal: string;
  judul: string;
  catatan: string | null;
};

type Props = {
  orders: Order[];
  projects: Project[];
  notes: CalendarNote[];
  logoutAction: () => Promise<void>;
  updateStatusAction: (formData: FormData) => Promise<void>;
  addProjectAction: (formData: FormData) => Promise<void>;
  deleteProjectAction: (formData: FormData) => Promise<void>;
  addCalendarNoteAction: (formData: FormData) => Promise<void>;
  deleteCalendarNoteAction: (formData: FormData) => Promise<void>;
};

const MENU = [
  { id: "overview", label: "Ringkasan", badge: null },
  { id: "orders", label: "Pesanan & Proses", badge: "orders" },
  { id: "calendar", label: "Kalender Tenggat", badge: "deadlines" },
  { id: "portfolio", label: "Portofolio", badge: "projects" },
  { id: "packages", label: "Paket & Harga", badge: null },
] as const;

const BULAN_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function statusBadgeColor(status: string) {
  switch (status) {
    case "BARU":
      return "bg-sun";
    case "KONSOLIDASI":
      return "bg-bubble";
    case "FIKSASI":
    case "DP DITERIMA":
      return "bg-mint";
    case "PROSES":
    case "DEMO":
      return "bg-violet text-white";
    case "SELESAI":
      return "bg-ink text-sun";
    default:
      return "bg-coral text-white";
  }
}

export default function AdminDashboard({
  orders,
  projects,
  notes,
  logoutAction,
  updateStatusAction,
  addProjectAction,
  deleteProjectAction,
  addCalendarNoteAction,
  deleteCalendarNoteAction,
}: Props) {
  const [activeTab, setActiveTab] = useState<(typeof MENU)[number]["id"]>("overview");
  const [statusFilter, setStatusFilter] = useState<string>("SEMUA");

  // State Pop-up Modal
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  // State Kalender
  const todayStr = new Date().toISOString().slice(0, 10);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Statistik
  const totalEstimasi = orders
    .filter((o) => o.status !== "BATAL")
    .reduce((acc, o) => acc + (o.estimasi || 0), 0);
  const activeOrders = orders.filter((o) => o.status !== "SELESAI" && o.status !== "BATAL");
  const ordersWithDeadline = orders.filter((o) => Boolean(o.deadline));

  const filteredOrders =
    statusFilter === "SEMUA" ? orders : orders.filter((o) => o.status === statusFilter);

  // Helper Kalender Bulanan
  const firstDayOfMonth = new Date(currentMonth.year, currentMonth.month, 1).getDay();
  const daysInMonth = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate();
  const calendarCells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const formatYMD = (day: number) => {
    const m = String(currentMonth.month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentMonth.year}-${m}-${d}`;
  };

  const prevMonth = () =>
    setCurrentMonth((prev) =>
      prev.month === 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: prev.month - 1 }
    );

  const nextMonth = () =>
    setCurrentMonth((prev) =>
      prev.month === 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: prev.month + 1 }
    );

  // Agenda pada tanggal terpilih
  const selectedDayDeadlines = orders.filter((o) => o.deadline === selectedDate);
  const selectedDayNotes = notes.filter((n) => n.tanggal === selectedDate);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row">
        {/* SIDEBAR */}
        <aside className="w-full shrink-0 md:w-64">
          <div className="brut sticky top-6 flex flex-col justify-between bg-white p-5">
            <div>
              <span className="inline-block rounded-full bg-ink px-3 py-1 text-xs font-extrabold tracking-wider text-sun">
                ADMIN PANEL
              </span>
              <h1 className="mt-3 text-2xl font-black leading-tight">Jasa Koding & Web Dev</h1>
              <p className="mt-1 text-xs text-neutral-600">
                Kelola order, tenggat, & portofolio.
              </p>

              <nav className="mt-6 flex flex-row gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
                {MENU.map((item) => {
                  const isActive = activeTab === item.id;
                  const count =
                    item.badge === "orders"
                      ? orders.length
                      : item.badge === "projects"
                      ? projects.length
                      : item.badge === "deadlines"
                      ? ordersWithDeadline.length + notes.length
                      : null;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`flex shrink-0 items-center justify-between rounded-lg border-2 border-ink px-3 py-2.5 text-left text-sm font-black transition-all ${
                        isActive ? "bg-sun shadow-[3px_3px_0px_#000]" : "bg-white hover:bg-neutral-100"
                      }`}
                    >
                      <span>{item.label}</span>
                      {count !== null && (
                        <span className="ml-2 rounded-full border-2 border-ink bg-mint px-2 py-0.5 text-xs">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="mt-6 space-y-2 border-t-2 border-ink pt-4">
              <Link href="/" target="_blank" className="btn block w-full bg-bubble text-center text-sm">
                Lihat Landing Page ↗
              </Link>
              <form action={logoutAction}>
                <button className="btn w-full bg-coral text-sm text-white">Keluar</button>
              </form>
            </div>
          </div>
        </aside>

        {/* KONTEN UTAMA */}
        <main className="flex-1 space-y-6">
          {/* TAB 1: RINGKASAN */}
          {activeTab === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="brut bg-sun p-5">
                  <div className="text-xs font-extrabold uppercase">Proyek Aktif</div>
                  <div className="mt-1 text-3xl font-black">{activeOrders.length}</div>
                  <div className="mt-1 text-xs font-bold">Dari total {orders.length} order</div>
                </div>
                <div className="brut bg-mint p-5">
                  <div className="text-xs font-extrabold uppercase">Potensi Omzet</div>
                  <div className="mt-1 text-2xl font-black">{rupiah(totalEstimasi)}</div>
                  <div className="mt-1 text-xs font-bold">Tidak termasuk order batal</div>
                </div>
                <div className="brut bg-bubble p-5">
                  <div className="text-xs font-extrabold uppercase">Tenggat Terjadwal</div>
                  <div className="mt-1 text-3xl font-black">{ordersWithDeadline.length}</div>
                  <div className="mt-1 text-xs font-bold">Tersinkron ke kalender</div>
                </div>
              </div>

              <div className="brut bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-black">Pesanan & Progres Terbaru</h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="text-sm font-black underline"
                  >
                    Kelola semua →
                  </button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-sm text-neutral-600">Belum ada pesanan masuk.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 4).map((o) => (
                      <div
                        key={o.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border-2 border-ink p-3"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black">{o.kode}</span>
                            <span>· {o.nama}</span>
                            <span
                              className={`rounded-full border border-ink px-2 py-0.5 text-xs font-black ${statusBadgeColor(
                                o.status
                              )}`}
                            >
                              {o.status}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-neutral-600">
                            {o.paket} {o.deploy ? "(+ Deploy)" : ""} · {rupiah(o.estimasi)}
                            {o.deadline && (
                              <span className="ml-2 font-bold text-ink">
                                | Tenggat: {o.deadline}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingOrder(o)}
                          className="btn bg-sun !px-3 !py-1 text-xs"
                        >
                          Atur Tahap
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "orders" && (
            <section className="space-y-4">
              <div className="brut bg-sun p-4">
                <h2 className="text-2xl font-black">Pesanan & Tahap Pengerjaan</h2>
                <p className="text-xs font-bold">
                  Filter berdasarkan tahap (Konsolidasi, Fiksasi, Proses, dll.) dan tentukan tanggal tenggat klien.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["SEMUA", ...STATUS].map((st) => {
                  const count =
                    st === "SEMUA" ? orders.length : orders.filter((o) => o.status === st).length;
                  const active = statusFilter === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`rounded-full border-2 border-ink px-3 py-1 text-xs font-black transition-all ${
                        active ? "bg-ink text-sun" : "bg-white hover:bg-neutral-100"
                      }`}
                    >
                      {st} ({count})
                    </button>
                  );
                })}
              </div>

              {filteredOrders.length === 0 ? (
                <div className="brut bg-white p-6 text-center text-sm font-bold">
                  Tidak ada pesanan pada tahap “{statusFilter}”.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((o) => (
                    <div
                      key={o.id}
                      className="brut flex flex-wrap items-start justify-between gap-4 bg-white p-5"
                    >
                      <div className="max-w-xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-ink px-2 py-0.5 text-xs font-black text-sun">
                            {o.kode}
                          </span>
                          <b className="text-base">{o.nama}</b>
                          <span className="text-sm font-bold text-neutral-600">({o.kontak})</span>
                          <span
                            className={`rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-black ${statusBadgeColor(
                              o.status
                            )}`}
                          >
                            {o.status}
                          </span>
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm font-bold">
                          <span>
                            {o.paket}
                            {o.deploy ? " + Deploy Online" : " (Source Code)"}
                          </span>
                          <span>·</span>
                          <span className="underline">{rupiah(o.estimasi)}</span>
                          {o.deadline ? (
                            <span className="rounded border border-ink bg-coral px-2 py-0.5 text-xs font-black text-white">
                              Tenggat: {o.deadline}
                            </span>
                          ) : (
                            <span className="rounded border border-dashed border-ink px-2 py-0.5 text-xs text-neutral-500">
                              Belum ada tenggat
                            </span>
                          )}
                        </div>

                        <p className="mt-2 rounded border border-dashed border-ink bg-neutral-50 p-2.5 text-sm">
                          {o.deskripsi}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingOrder(o)}
                        className="btn bg-mint text-sm"
                      >
                        Atur Tahap & Tenggat
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "calendar" && (
            <section className="space-y-5">
              <div className="brut flex flex-wrap items-center justify-between gap-3 bg-bubble p-4">
                <div>
                  <h2 className="text-2xl font-black">Kalender Tenggat & Agenda</h2>
                  <p className="text-xs font-bold">
                    Tenggat pesanan klien otomatis muncul di sini. Klik tanggal untuk tambah keterangan manual.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(true)}
                  className="btn bg-sun text-sm"
                >
                  + Tambah Catatan Tanggal
                </button>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                <div className="brut bg-white p-5 lg:col-span-2">
                  <div className="mb-4 flex items-center justify-between">
                    <button type="button" onClick={prevMonth} className="btn bg-white !px-3 !py-1 text-sm">
                      ←
                    </button>
                    <h3 className="text-lg font-black">
                      {BULAN_ID[currentMonth.month]} {currentMonth.year}
                    </h3>
                    <button type="button" onClick={nextMonth} className="btn bg-white !px-3 !py-1 text-sm">
                      →
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-black">
                    {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((hari) => (
                      <div key={hari} className="py-1 text-neutral-500">
                        {hari}
                      </div>
                    ))}

                    {calendarCells.map((day, idx) => {
                      if (!day) return <div key={`empty-${idx}`} className="h-16" />;

                      const dateStr = formatYMD(day);
                      const dayDeadlines = orders.filter((o) => o.deadline === dateStr);
                      const dayNotes = notes.filter((n) => n.tanggal === dateStr);
                      const isSelected = selectedDate === dateStr;
                      const isToday = todayStr === dateStr;

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          onClick={() => setSelectedDate(dateStr)}
                          className={`flex h-16 flex-col justify-between rounded-lg border-2 p-1.5 text-left transition-all ${
                            isSelected
                              ? "border-ink bg-sun shadow-[2px_2px_0px_#000]"
                              : "border-neutral-200 bg-white hover:border-ink"
                          }`}
                        >
                          <span
                            className={`text-xs font-black ${
                              isToday ? "rounded bg-ink px-1.5 text-sun" : ""
                            }`}
                          >
                            {day}
                          </span>

                          <div className="flex flex-col gap-0.5 overflow-hidden">
                            {dayDeadlines.length > 0 && (
                              <span className="truncate rounded bg-coral px-1 text-[10px] font-black text-white">
                                {dayDeadlines.length} Tenggat
                              </span>
                            )}
                            {dayNotes.length > 0 && (
                              <span className="truncate rounded bg-mint px-1 text-[10px] font-black text-ink">
                                {dayNotes.length} Catatan
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="brut flex flex-col justify-between bg-white p-5">
                  <div>
                    <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                      <div>
                        <div className="text-xs font-bold uppercase text-neutral-500">Agenda Tanggal</div>
                        <h3 className="text-lg font-black">{selectedDate}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsNoteModalOpen(true)}
                        className="btn bg-sun !px-2.5 !py-1 text-xs"
                      >
                        + Catatan
                      </button>
                    </div>

                    <div className="mt-4 space-y-4">
                      {/* Tenggat Klien */}
                      <div>
                        <h4 className="text-xs font-black uppercase text-coral">
                          Tenggat Pesanan Klien ({selectedDayDeadlines.length})
                        </h4>
                        {selectedDayDeadlines.length === 0 ? (
                          <p className="mt-1 text-xs text-neutral-500">Tidak ada tenggat proyek.</p>
                        ) : (
                          <div className="mt-2 space-y-2">
                            {selectedDayDeadlines.map((o) => (
                              <div
                                key={o.id}
                                className="rounded-lg border-2 border-ink bg-neutral-50 p-2.5 text-xs"
                              >
                                <div className="flex items-center justify-between font-black">
                                  <span>
                                    {o.kode} · {o.nama}
                                  </span>
                                  <span
                                    className={`rounded px-1.5 py-0.5 text-[10px] ${statusBadgeColor(
                                      o.status
                                    )}`}
                                  >
                                    {o.status}
                                  </span>
                                </div>
                                <div className="mt-1 text-neutral-600">{o.paket}</div>
                                <button
                                  type="button"
                                  onClick={() => setEditingOrder(o)}
                                  className="mt-1.5 font-black underline"
                                >
                                  Ubah tenggat/tahap →
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-black uppercase text-ink">
                          Catatan Admin ({selectedDayNotes.length})
                        </h4>
                        {selectedDayNotes.length === 0 ? (
                          <p className="mt-1 text-xs text-neutral-500">Belum ada catatan pada tanggal ini.</p>
                        ) : (
                          <div className="mt-2 space-y-2">
                            {selectedDayNotes.map((n) => (
                              <div
                                key={n.id}
                                className="flex items-start justify-between gap-2 rounded-lg border-2 border-ink bg-mint/40 p-2.5 text-xs"
                              >
                                <div>
                                  <b className="block">{n.judul}</b>
                                  {n.catatan && <p className="mt-0.5 text-neutral-700">{n.catatan}</p>}
                                </div>
                                <form action={deleteCalendarNoteAction}>
                                  <input type="hidden" name="id" value={n.id} />
                                  <button className="font-black text-coral hover:underline">Hapus</button>
                                </form>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "portfolio" && (
            <section className="space-y-5">
              <div className="brut flex flex-wrap items-center justify-between gap-3 bg-mint p-4">
                <div>
                  <h2 className="text-2xl font-black">Kelola Portofolio ({projects.length})</h2>
                  <p className="text-xs font-bold">
                    Proyek aktif otomatis tampil di bagian #portofolio halaman depan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(true)}
                  className="btn bg-sun text-sm"
                >
                  + Tambah Portofolio
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="brut bg-white p-8 text-center">
                  <p className="text-sm font-bold">Belum ada portofolio.</p>
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(true)}
                    className="btn mt-3 bg-sun text-sm"
                  >
                    + Tambah Proyek Pertama
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects.map((p) => (
                    <div key={p.id} className="brut flex flex-col justify-between bg-white p-4">
                      <div>
                        <h4 className="text-lg font-black">{p.judul}</h4>
                        <p className="mt-1 text-sm text-neutral-700">{p.deskripsi}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {p.tech.split(",").map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-ink bg-sun px-2 py-0.5 text-xs font-bold"
                            >
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t-2 border-ink pt-3">
                        {p.url ? (
                          <a href={p.url} target="_blank" className="text-xs font-black underline">
                            Buka Link ↗
                          </a>
                        ) : (
                          <span className="text-xs text-neutral-500">Tanpa link</span>
                        )}
                        <form action={deleteProjectAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button className="btn bg-coral !px-3 !py-1 text-xs text-white">Hapus</button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "packages" && (
            <section className="space-y-4">
              <div className="brut bg-bubble p-4">
                <h2 className="text-2xl font-black">Katalog Paket & Harga Aktif</h2>
                <p className="text-xs font-bold">
                  Sinkron dengan daftar harga di bagian #harga landing page.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {PACKAGES.map((p, idx) => (
                  <div key={p.id} className="brut bg-white p-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`grid size-8 place-items-center rounded-full border-2 border-ink font-black ${p.bg}`}
                      >
                        {idx + 1}
                      </span>
                      <h3 className="text-lg font-black">{p.nama}</h3>
                    </div>
                    <p className="mt-2 text-sm">{p.desk}</p>
                    <div className="mt-2 inline-block rounded-full border border-ink px-2 py-0.5 text-xs font-bold">
                      Estimasi: {p.durasi}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
                      <div className="brut bg-sun p-2">
                        <div className="text-xs">Source Code</div>
                        <b>{rupiah(p.source)}</b>
                      </div>
                      <div className="brut bg-violet p-2 text-white">
                        <div className="text-xs">+ Deploy</div>
                        <b>{rupiah(p.deploy)}</b>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="brut w-full max-w-md bg-white p-6">
            <div className="flex items-center justify-between border-b-2 border-ink pb-3">
              <div>
                <span className="rounded bg-ink px-2 py-0.5 text-xs font-black text-sun">
                  {editingOrder.kode}
                </span>
                <h3 className="mt-1 text-xl font-black">{editingOrder.nama}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="btn bg-coral !px-2.5 !py-1 text-xs text-white"
              >
                ✕
              </button>
            </div>

            <form
              action={async (fd) => {
                await updateStatusAction(fd);
                setEditingOrder(null);
              }}
              className="mt-4 space-y-4"
            >
              <input type="hidden" name="id" value={editingOrder.id} />

              <div>
                <label className="mb-1 block text-xs font-black uppercase">Tahap Pengerjaan</label>
                <select name="status" defaultValue={editingOrder.status} className="input">
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-black uppercase">
                  Tanggal Tenggat / Deadline (Otomatis masuk kalender)
                </label>
                <input
                  type="date"
                  name="deadline"
                  defaultValue={editingOrder.deadline || ""}
                  className="input"
                />
                <p className="mt-1 text-[11px] text-neutral-500">
                  Kosongkan jika belum ada kesepakatan tanggal selesai.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-black uppercase">
                  Estimasi / Harga Deal (Rp)
                </label>
                <input
                  type="number"
                  name="estimasi"
                  defaultValue={editingOrder.estimasi}
                  className="input"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="btn bg-white text-sm"
                >
                  Batal
                </button>
                <button type="submit" className="btn bg-mint text-sm">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="brut w-full max-w-lg bg-white p-6">
            <div className="flex items-center justify-between border-b-2 border-ink pb-3">
              <h3 className="text-xl font-black">+ Tambah Portofolio Baru</h3>
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                className="btn bg-coral !px-2.5 !py-1 text-xs text-white"
              >
                ✕
              </button>
            </div>

            <form
              action={async (fd) => {
                await addProjectAction(fd);
                setIsProjectModalOpen(false);
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="mb-1 block text-xs font-black uppercase">Judul Proyek</label>
                <input
                  name="judul"
                  placeholder="Mis. Sistem Layanan Informasi Publik"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-black uppercase">Tech Stack (pisah koma)</label>
                <input name="tech" placeholder="Laravel, MySQL, Tailwind" className="input" required />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-black uppercase">Link Proyek (Opsional)</label>
                  <input name="url" placeholder="https://..." className="input" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black uppercase">URL Gambar (Opsional)</label>
                  <input name="gambar" placeholder="https://..." className="input" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-black uppercase">Deskripsi Singkat</label>
                <textarea
                  name="deskripsi"
                  placeholder="Jelaskan fitur utama aplikasi..."
                  className="input"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="btn bg-white text-sm"
                >
                  Batal
                </button>
                <button type="submit" className="btn bg-sun text-sm">
                  Simpan Portofolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

     
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="brut w-full max-w-md bg-white p-6">
            <div className="flex items-center justify-between border-b-2 border-ink pb-3">
              <h3 className="text-xl font-black">+ Tambah Catatan Kalender</h3>
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                className="btn bg-coral !px-2.5 !py-1 text-xs text-white"
              >
                ✕
              </button>
            </div>

            <form
              action={async (fd) => {
                await addCalendarNoteAction(fd);
                setIsNoteModalOpen(false);
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="mb-1 block text-xs font-black uppercase">Tanggal</label>
                <input
                  type="date"
                  name="tanggal"
                  defaultValue={selectedDate}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-black uppercase">Judul Agenda / Keterangan</label>
                <input
                  name="judul"
                  placeholder="Mis. Meeting Fiksasi Klien / Video Demo"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-black uppercase">Detail Catatan (Opsional)</label>
                <textarea
                  name="catatan"
                  placeholder="Jam meeting, link GMeet, atau catatan revisi..."
                  className="input"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="btn bg-white text-sm"
                >
                  Batal
                </button>
                <button type="submit" className="btn bg-sun text-sm">
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}