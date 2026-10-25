import type { Metadata } from "next";
import { Suspense } from "react";
import { StaffAdmin } from "@/components/admin/staff-admin";

export const metadata: Metadata = { title: "Staff accounts" };

/* Staff accounts (Requirements_Admin.md section 3). */
export default function Page({ searchParams }: PageProps<"/admin/staff">) {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <StaffAdmin searchParams={searchParams} />
    </Suspense>
  );
}
