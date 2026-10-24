import type { Metadata } from "next";
import { Suspense } from "react";
import { HolidaysAdmin } from "@/components/admin/holidays-admin";

export const metadata: Metadata = { title: "Branch holidays" };

/* Closed days (Requirements_Admin.md settings). */
export default function Page() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <HolidaysAdmin />
    </Suspense>
  );
}
