"use client";

import { useActionState } from "react";
import { uploadTest, type UploadState } from "./actions";

/* No file-type filter or size check in the browser on purpose: this page is for
   trying the SERVER's checks with any file. The real frame form will also
   resize photos in the browser first (Requirements_Admin.md 6.2). */
export function UploadForm() {
  const [state, action, pending] = useActionState<UploadState, FormData>(uploadTest, undefined);
  return (
    <form action={action} className="grid gap-4 rounded-md border border-line bg-surface p-5">
      <label className="grid gap-2 text-sm font-semibold text-heading">
        Choose any file
        <input name="photo" type="file" required className="text-sm font-normal text-text file:mr-3 file:h-11 file:rounded-pill file:border-2 file:border-btn-ink file:bg-transparent file:px-4 file:font-semibold file:text-btn-ink" />
      </label>
      <button type="submit" disabled={pending} className="inline-flex h-12 w-fit items-center rounded-pill bg-gold px-6 font-semibold text-navy disabled:opacity-60">
        {pending ? "Uploading…" : "Upload"}
      </button>
      {state?.error && <p role="alert" className="rounded-sm border-l-4 border-gold bg-bg px-4 py-3 text-sm">{state.error}</p>}
      {state?.ok && <p role="status" className="rounded-sm border-l-4 border-brass bg-bg px-4 py-3 text-sm">{state.ok}</p>}
    </form>
  );
}
