import { count, eq, ne } from "drizzle-orm";
import type { Metadata } from "next";
import { Suspense } from "react";
import { appointments, frames } from "@/db/schema";
import { withRole } from "@/lib/db";
import { branches as branchFacts } from "@/lib/site-config";
import { requireStaff } from "@/lib/session";
import { signOut } from "./actions";

// Absolute: the admin layout's title template only applies to pages below /admin
export const metadata: Metadata = { title: { absolute: "Dashboard | VS Lens Mart staff area" } };

/* Foundation check for the staff area (Phase 4). Proves sign-in, the role
   check and role-based database access work end to end. The real dashboard
   (Requirements_Admin.md section 5) replaces this in sprint 5.3. */
export default function AdminHome() {
  return (
    <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Dashboard />
      </Suspense>
    </main>
  );
}

async function Dashboard() {
  const staff = await requireStaff();
  // Counted with the signed-in role, so row-level security decides what's visible
  const [notApproved, bookings] = await withRole(staff.role, async (tx) => [
    (await tx.select({ n: count() }).from(frames).where(ne(frames.status, "approved")))[0].n,
    (await tx.select({ n: count() }).from(appointments).where(eq(appointments.status, "booked")))[0].n,
  ], staff.id);

  const branchName = branchFacts.find((b) => b.slug === staff.branch)?.name;

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent-ink">Staff area</p>
      <h1 className="mt-2 text-3xl">Hello, {staff.name}.</h1>
      <p className="mt-2 text-muted">
        Signed in as <b className="text-heading">{staff.role === "admin" ? "Admin" : "Staff"}</b>
        {branchName ? <> · {branchName} branch</> : null} · {staff.email}
      </p>
      <dl className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-line bg-surface p-5">
          <dt className="text-sm text-muted">Frames not yet approved</dt>
          <dd className="font-display text-4xl font-extrabold text-heading">{notApproved}</dd>
        </div>
        <div className="rounded-md border border-line bg-surface p-5">
          <dt className="text-sm text-muted">Eye-test bookings to come</dt>
          <dd className="font-display text-4xl font-extrabold text-heading">{bookings}</dd>
        </div>
      </dl>
      <p className="mt-6 text-sm text-muted">The full dashboard comes in sprint 5.3.</p>
      <form action={signOut} className="mt-6">
        <button type="submit" className="inline-flex h-12 items-center rounded-pill border-2 border-btn-ink px-6 font-semibold text-btn-ink">
          Sign out
        </button>
      </form>
    </>
  );
}
