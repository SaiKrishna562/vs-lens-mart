import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingsList } from "@/components/admin/customer-lists";

export const metadata: Metadata = { title: "Bookings" };

/* Staff bookings list (Requirements_Admin.md section 7). */
export default function Page({ searchParams }: PageProps<"/admin/bookings">) {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <BookingsList searchParams={searchParams} />
    </Suspense>
  );
}
