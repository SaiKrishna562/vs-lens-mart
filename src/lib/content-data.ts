import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { withRole } from "./db";
import { lensesQuery } from "./queries/content";

/* Cached content reads with the public role, tagged "content": every staff save
   of a lens, eye camp, gallery photo or testimonial calls updateTag("content"),
   so the public pages update straight away. */

export async function getLenses() {
  "use cache";
  cacheTag("content");
  cacheLife("hours");
  return withRole("public", (tx) => lensesQuery(tx));
}
