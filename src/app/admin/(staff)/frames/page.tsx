import type { Metadata } from "next";
import { Suspense } from "react";
import { FramesList } from "@/components/admin/frames-list";

export const metadata: Metadata = { title: "Frames" };

/* Staff frames list (Requirements_Admin.md section 7). */
export default function Page({ searchParams }: PageProps<"/admin/frames">) {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <FramesList kind="frames" searchParams={searchParams} />
    </Suspense>
  );
}
