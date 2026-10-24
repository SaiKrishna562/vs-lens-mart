/* Public content (sprint 5.5): lenses now; eye camps, gallery and testimonials
   follow. Plain functions that take a transaction, like queries/site.ts; they
   filter for active / visible rows themselves as well as relying on row-level
   security. src/lib/content-data.ts caches them under the "content" tag. */
import { asc, eq } from "drizzle-orm";
import { brands, lenses } from "../../db/schema";
import type { Tx } from "../db";
import { slugify } from "../site-config";

export type LensItem = {
  id: string; brand: string; brandSlug: string; name: string; type: string; features: string[]; price: number | null; photo: string | null;
};

/** Active lenses, by brand then name. */
export async function lensesQuery(tx: Tx): Promise<LensItem[]> {
  const rows = await tx.select({
    id: lenses.id, brand: brands.name, name: lenses.name, type: lenses.type, features: lenses.features, price: lenses.price, photo: lenses.photoPath,
  }).from(lenses).innerJoin(brands, eq(brands.id, lenses.brandId))
    .where(eq(lenses.isActive, true)).orderBy(asc(brands.name), asc(lenses.name));
  return rows.map((r) => ({ ...r, brandSlug: slugify(r.brand) }));
}
