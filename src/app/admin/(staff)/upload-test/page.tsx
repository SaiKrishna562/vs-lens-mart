import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { galleryPhotos } from "@/db/schema";
import { withRole } from "@/lib/db";
import { requireStaff } from "@/lib/session";
import { deleteTest } from "./actions";
import { TEST_CAPTION } from "./constants";
import { UploadForm } from "./upload-form";

export const metadata: Metadata = { title: "Upload test" };

/* TEMPORARY (Phase 4 step 5): try photo uploads before the "Add a frame" form
   exists. Only on the laptop (404 on a live site), only for signed-in staff.
   Remove this folder in sprint 5.3. */
export default function UploadTestPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div className="max-w-3xl">
      <Link href="/admin" className="text-sm font-semibold text-heading underline">← Dashboard</Link>
      <h1 className="mt-3 text-3xl">Upload test</h1>
      <p className="mt-2 mb-6 text-muted">
        Temporary page for trying photo uploads. Photos are saved as <b className="text-heading">hidden</b> gallery
        photos, so only signed-in staff can see them. Try a real photo, a file renamed to .jpg, a PDF, or a photo over 10 MB.
      </p>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Uploads />
      </Suspense>
    </div>
  );
}

async function Uploads() {
  const staff = await requireStaff();
  const photos = await withRole(staff.role, (tx) =>
    tx.select({ id: galleryPhotos.id, path: galleryPhotos.path, createdAt: galleryPhotos.createdAt })
      .from(galleryPhotos).where(eq(galleryPhotos.caption, TEST_CAPTION)).orderBy(desc(galleryPhotos.createdAt)), staff.id);

  return (
    <>
      <UploadForm />
      <h2 className="mt-8 text-xl">Saved test photos ({photos.length})</h2>
      {photos.length === 0 ? (
        <p className="mt-2 text-muted">None yet.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((p) => (
            <li key={p.id} className="grid gap-2 rounded-md border border-line bg-surface p-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- served by /media, which checks visibility */}
              <img src={`/media/${p.path}`} alt="Uploaded test photo" className="aspect-square w-full rounded-sm bg-bg object-cover" />
              <span className="break-all text-xs text-muted">{p.path.split("/").pop()}</span>
              {staff.role === "admin" ? (
                <form action={deleteTest}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="h-10 w-full rounded-pill border-2 border-btn-ink text-sm font-semibold text-btn-ink">Delete</button>
                </form>
              ) : (
                <span className="text-xs text-muted">Only an admin can delete.</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
