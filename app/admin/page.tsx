import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import {
  login,
  logout,
  updateStatus,
  addProject,
  deleteProject,
  addCalendarNote,
  deleteCalendarNote,
} from "./actions";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function Admin() {
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto max-w-sm px-4 py-20">
        <form action={login} className="brut space-y-4 bg-white p-6">
          <span className="inline-block rounded-full bg-ink px-3 py-1 text-xs font-extrabold text-sun">
            AREA TERBATAS
          </span>
          <h1 className="text-2xl font-black">Login Admin</h1>
          <input type="password" name="password" placeholder="Masukkan password..." className="input" required />
          <button className="btn w-full bg-sun">Masuk Dashboard</button>
        </form>
      </main>
    );
  }

  const [orders, projects, notes] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.calendarNote.findMany({ orderBy: { tanggal: "asc" } }),
  ]);

  return (
    <AdminDashboard
      orders={orders}
      projects={projects}
      notes={notes}
      logoutAction={logout}
      updateStatusAction={updateStatus}
      addProjectAction={addProject}
      deleteProjectAction={deleteProject}
      addCalendarNoteAction={addCalendarNote}
      deleteCalendarNoteAction={deleteCalendarNote}
    />
  );
}