import { cookies } from "next/headers";
import { createHash } from "crypto";

export const adminToken = () =>
  createHash("sha256").update(process.env.ADMIN_PASSWORD ?? "").digest("hex");

export async function isAdmin() {
  const c = await cookies();
  return c.get("admin")?.value === adminToken();
}