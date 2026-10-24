/* Public content (sprint 5.5): lenses now; eye camps, gallery and testimonials
   follow. Plain functions that take a transaction, like queries/site.ts; they
   filter for active / visible rows themselves as well as relying on row-level
   security. src/lib/content-data.ts caches them under the "content" tag. */
import { and, asc, eq, sql } from "drizzle-orm";
import { branches, brands, campPhotos, eyeCamps, lenses } from "../../db/schema";
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

export type CampItem = {
  slug: string; title: string; day: string; starts: string; ends: string; place: string; branch: string | null;
  organisedWith: string | null; description: string; offered: string[]; people: number | null; cover: string | null; photoCount: number;
};
export type CampDetail = CampItem & { photos: { path: string; showsPeople: boolean }[] };

const campColumns = {
  id: eyeCamps.id, slug: eyeCamps.slug, title: eyeCamps.title, day: eyeCamps.day, starts: eyeCamps.starts, ends: eyeCamps.ends,
  place: eyeCamps.place, branch: branches.name, organisedWith: eyeCamps.organisedWith, description: eyeCamps.description,
  offered: eyeCamps.offered, people: eyeCamps.people,
  cover: sql<string | null>`(select ${campPhotos.path} from ${campPhotos} where ${campPhotos.campId} = ${eyeCamps.id} order by ${campPhotos.position} limit 1)`,
  photoCount: sql<number>`(select count(*)::int from ${campPhotos} where ${campPhotos.campId} = ${eyeCamps.id})`,
};
const toCamp = (r: Omit<CampItem, "starts" | "ends"> & { starts: string; ends: string }): CampItem => ({
  slug: r.slug, title: r.title, day: r.day, starts: r.starts.slice(0, 5), ends: r.ends.slice(0, 5), place: r.place, branch: r.branch,
  organisedWith: r.organisedWith, description: r.description, offered: r.offered, people: r.people, cover: r.cover, photoCount: r.photoCount,
});

/** Visible camps, by date (oldest first; the page splits upcoming and past). */
export async function campsQuery(tx: Tx): Promise<CampItem[]> {
  const rows = await tx.select(campColumns).from(eyeCamps).leftJoin(branches, eq(branches.id, eyeCamps.branchId))
    .where(eq(eyeCamps.isVisible, true)).orderBy(asc(eyeCamps.day), asc(eyeCamps.starts));
  return rows.map(toCamp);
}

/** One visible camp with its photos, or null (hidden or unknown). */
export async function campDetailQuery(tx: Tx, slug: string): Promise<CampDetail | null> {
  const [row] = await tx.select(campColumns).from(eyeCamps).leftJoin(branches, eq(branches.id, eyeCamps.branchId))
    .where(and(eq(eyeCamps.isVisible, true), eq(eyeCamps.slug, slug)));
  if (!row) return null;
  const photos = await tx.select({ path: campPhotos.path, showsPeople: campPhotos.showsPeople }).from(campPhotos)
    .where(eq(campPhotos.campId, row.id)).orderBy(asc(campPhotos.position));
  return { ...toCamp(row), photos };
}
