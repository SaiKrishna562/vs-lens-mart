import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { withRole } from "./db";
import { tryonEnabled } from "./tryon";
import { catalogueQuery, frameDetailQuery, liveSlugsQuery, type Kind } from "./queries/catalogue";

/* Cached catalogue reads with the public role, tagged "catalogue" like the
   menus: every frame save, approval, sold-out toggle and delete in the staff
   area calls updateTag("catalogue"), so the listings and detail pages update
   straight away with no restart. */

export async function getCatalogue(kind: Kind) {
  "use cache";
  cacheTag("catalogue");
  cacheLife("hours");
  const items = await withRole("public", (tx) => catalogueQuery(tx, kind));
  // With the try-on switch off, no page learns which frames have try-on
  return tryonEnabled() ? items : items.map((f) => ({ ...f, tryon: null }));
}

export async function getFrame(kind: Kind, slug: string) {
  "use cache";
  cacheTag("catalogue");
  cacheLife("hours");
  return withRole("public", (tx) => frameDetailQuery(tx, kind, slug));
}

export async function getLiveSlugs(kind: Kind) {
  "use cache";
  cacheTag("catalogue");
  cacheLife("hours");
  return withRole("public", (tx) => liveSlugsQuery(tx, kind));
}
