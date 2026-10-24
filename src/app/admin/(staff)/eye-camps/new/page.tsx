import type { Metadata } from "next";
import { Suspense } from "react";
import { CampFormPage } from "@/components/admin/camp-form-page";

export const metadata: Metadata = { title: "Add an eye camp" };

export default function Page() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <CampFormPage />
    </Suspense>
  );
}
