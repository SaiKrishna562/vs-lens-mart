"use server";

import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { galleryPhotos } from "@/db/schema";
import { withRole } from "@/lib/db";
import { requireStaff } from "@/lib/session";
import { deleteUpload, saveUpload, UploadError } from "@/lib/storage";
import { TEST_CAPTION } from "./constants";

/* TEMPORARY (Phase 4 step 5): lets the developer try photo uploads before the
   real "Add a frame" form exists. Remove this folder in sprint 5.3.
   Photos are saved as HIDDEN gallery photos, so the public never sees them. */

export type UploadState = { ok?: string; error?: string } | undefined;

function devOnly() {
  if (process.env.NODE_ENV === "production") notFound();
}

export async function uploadTest(_prev: UploadState, formData: FormData): Promise<UploadState> {
  devOnly();
  const staff = await requireStaff();
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a photo first." };

  const id = randomUUID();
  let stored: string;
  try {
    stored = await saveUpload(staff, "gallery", id, file);
  } catch (e) {
    if (e instanceof UploadError) return { error: e.message };
    throw e;
  }
  try {
    await withRole(staff.role, (tx) =>
      tx.insert(galleryPhotos).values({
        id, path: stored, tag: "shop", caption: TEST_CAPTION, isVisible: false,
        createdBy: staff.id, updatedBy: staff.id,
      }), staff.id);
  } catch (e) {
    await deleteUpload(staff, stored); // no row, so don't keep the file
    throw e;
  }
  revalidatePath("/admin/upload-test");
  return { ok: `Saved "${file.name}" (${Math.round(file.size / 1024)} KB).` };
}

export async function deleteTest(formData: FormData): Promise<void> {
  devOnly();
  const staff = await requireStaff();
  const id = String(formData.get("id") ?? "");
  // Row-level security: only an admin's delete removes a row; for staff it removes nothing
  const removed = await withRole(staff.role, (tx) =>
    tx.delete(galleryPhotos)
      .where(and(eq(galleryPhotos.id, id), eq(galleryPhotos.caption, TEST_CAPTION)))
      .returning({ path: galleryPhotos.path }), staff.id);
  for (const r of removed) await deleteUpload(staff, r.path);
  revalidatePath("/admin/upload-test");
}
