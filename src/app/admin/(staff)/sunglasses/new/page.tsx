import type { Metadata } from "next";
import { Suspense } from "react";
import { FrameFormPage } from "@/components/admin/frame-form-page";

export const metadata: Metadata = { title: "Add sunglasses" };

export default function Page() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <FrameFormPage kind="sunglasses" />
    </Suspense>
  );
}
