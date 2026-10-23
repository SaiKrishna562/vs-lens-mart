"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { appointments, frames } from "@/db/schema";
import { BRANCH_COOKIE, branchSlugs } from "@/lib/admin-branch";
import { withRole } from "@/lib/db";
import { requireStaff } from "@/lib/session";

/* Staff-area actions for the shell, dashboard and frames list. Every one checks
   the signed-in staff member first and runs with their role, so row-level
   security has the last word (a staff request to delete or approve is refused
   by the database even if the UI were bypassed). */

/** Admin only: which branch the sidebar and dashboard show. */
export async function setWorkingBranch(slug: string) {
  const staff = await requireStaff();
  if (staff.role !== "admin" || !branchSlugs.includes(slug)) return;
  (await cookies()).set(BRANCH_COOKIE, slug, { httpOnly: true, sameSite: "lax", path: "/admin", maxAge: 60 * 60 * 24 * 365 });
  revalidatePath("/admin", "layout");
}

const id = z.uuid();

/** One-tap Sold out / In stock (Requirements_Admin.md 6.3). The public site updates straight away. */
export async function toggleSoldOut(frameId: string) {
  const staff = await requireStaff();
  const fid = id.parse(frameId);
  await withRole(staff.role, async (tx) => {
    const [f] = await tx.select({ availability: frames.availability }).from(frames).where(eq(frames.id, fid));
    if (!f) return;
    await tx.update(frames)
      .set({ availability: f.availability === "sold_out" ? "in_stock" : "sold_out", updatedBy: staff.id, updatedAt: new Date() })
      .where(eq(frames.id, fid));
  }, staff.id);
  updateTag("catalogue");
  revalidatePath("/admin", "layout");
}

const bookingStatus = z.enum(["booked", "attended", "no_show", "cancelled"]);

/** Today's bookings: Attended / No-show / Cancelled. */
export async function setBookingStatus(appointmentId: string, status: string) {
  const staff = await requireStaff();
  const aid = id.parse(appointmentId), s = bookingStatus.parse(status);
  await withRole(staff.role, (tx) =>
    tx.update(appointments).set({ status: s, updatedBy: staff.id, updatedAt: new Date() })
      .where(and(eq(appointments.id, aid))), staff.id);
  revalidatePath("/admin");
}
