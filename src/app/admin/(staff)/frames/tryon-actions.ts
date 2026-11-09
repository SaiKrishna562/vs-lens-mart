"use server";

/* Virtual try-on: a frame's see-through front-view picture and its lens
   centres (Requirements_TryOn.md 6). The picture is cleaned up in the staff
   member's browser; here it's checked again (real type, size, transparency),
   saved through src/lib/storage.ts, and the frame row updated with the staff
   member's role, so row-level security and the database checks apply. Turning
   try-on on for an approved frame goes live straight away, like other edits
   (DUMMY C22). */
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { frames } from "@/db/schema";
import { withRole } from "@/lib/db";
import { requireStaff } from "@/lib/session";
import { deleteUpload, saveUpload, UploadError } from "@/lib/storage";
import { isTransparentPng, isUuid, MAX_UPLOAD_BYTES, UPLOAD_ERRORS } from "@/lib/upload-rules";

export type TryonResult = { ok: true; path: string | null; enabled: boolean } | { ok: false; error: string };

const fraction = z.coerce.number().gt(0).lt(1);
const Fields = z.object({
  frameId: z.string().refine(isUuid),
  enabled: z.enum(["true", "false"]).transform((v) => v === "true"),
  lensLeft: fraction,
  lensRight: fraction,
  lensY: fraction,
  remove: z.enum(["true", "false"]).default("false").transform((v) => v === "true"),
}).refine((f) => f.lensLeft < f.lensRight, { message: "The left lens centre must be left of the right one." });

export async function saveTryon(formData: FormData): Promise<TryonResult> {
  const staff = await requireStaff();
  const parsed = Fields.safeParse(Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the lens centres and try again." };
  const f = parsed.data;

  const picture = formData.get("picture");
  let saved: string | null = null;
  if (picture instanceof Blob && picture.size > 0) {
    if (picture.size > MAX_UPLOAD_BYTES) return { ok: false, error: UPLOAD_ERRORS.too_large };
    if (!isTransparentPng(new Uint8Array(await picture.arrayBuffer()))) return { ok: false, error: UPLOAD_ERRORS.not_transparent };
    try {
      saved = await saveUpload(staff, "frames", f.frameId, picture);
    } catch (e) {
      return { ok: false, error: e instanceof UploadError ? e.message : "The picture couldn't be saved. Try again." };
    }
  }

  try {
    const result = await withRole(staff.role, async (tx) => {
      const [row] = await tx.select({ path: frames.tryonPath }).from(frames).where(eq(frames.id, f.frameId));
      if (!row) return null;
      const path = f.remove ? null : saved ?? row.path;
      const enabled = f.enabled && path !== null;
      await tx.update(frames).set({
        tryonPath: path, tryonEnabled: enabled,
        tryonLensLeft: f.lensLeft, tryonLensRight: f.lensRight, tryonLensY: f.lensY,
        updatedBy: staff.id, updatedAt: new Date(),
      }).where(eq(frames.id, f.frameId));
      return { old: row.path !== path ? row.path : null, path, enabled };
    }, staff.id);
    if (!result) {
      if (saved) await deleteUpload(staff, saved);
      return { ok: false, error: "This frame no longer exists." };
    }
    if (result.old) await deleteUpload(staff, result.old); // after the database agreed
    updateTag("catalogue");
    revalidatePath("/admin", "layout");
    return { ok: true, path: result.path, enabled: result.enabled };
  } catch {
    if (saved) await deleteUpload(staff, saved);
    return { ok: false, error: "The try-on settings couldn't be saved. Try again." };
  }
}
