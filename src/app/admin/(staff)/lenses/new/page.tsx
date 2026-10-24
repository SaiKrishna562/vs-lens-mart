import type { Metadata } from "next";
import { Suspense } from "react";
import { LensFormPage } from "@/components/admin/lens-form-page";

export const metadata: Metadata = { title: "Add a lens" };

export default function Page() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <LensFormPage />
    </Suspense>
  );
}
