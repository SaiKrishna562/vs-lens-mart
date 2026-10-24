import type { Metadata } from "next";
import { Suspense } from "react";
import { EnquiriesList } from "@/components/admin/customer-lists";

export const metadata: Metadata = { title: "Enquiries" };

/* Staff enquiries list (Requirements_Admin.md section 7). */
export default function Page({ searchParams }: PageProps<"/admin/enquiries">) {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <EnquiriesList searchParams={searchParams} />
    </Suspense>
  );
}
