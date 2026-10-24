import type { Metadata } from "next";
import { Suspense } from "react";
import { BranchesAdmin } from "@/components/admin/branches-admin";

export const metadata: Metadata = { title: "Branches" };

/* Branch details (Requirements_Admin.md 7.1). */
export default function Page() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <BranchesAdmin />
    </Suspense>
  );
}
