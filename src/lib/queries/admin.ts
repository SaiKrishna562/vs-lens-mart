/* Staff-area reads (Requirements_Admin.md sections 5 and 7). Plain functions
   that take a transaction already running with the signed-in role (withRole),
   so row-level security still decides what each role can see. "Today" is
   India time (Asia/Kolkata), whatever the server's clock zone is. */
import { and, asc, desc, eq, ilike, inArray, ne, or, sql, type SQL } from "drizzle-orm";
import { appointments, branches, brands, enquiries, eyeCamps, frameImages, frames, galleryPhotos } from "../../db/schema";
import type { Tx } from "../db";

const TODAY = sql`(now() at time zone 'Asia/Kolkata')::date`;
export type Kind = "frames" | "sunglasses";
const kindWhere = (kind: Kind) =>
  kind === "sunglasses" ? eq(frames.category, "sunglasses") : inArray(frames.category, ["eyeglasses", "computer_glasses"]);

const photoCount = sql<number>`(select count(*)::int from ${frameImages} where ${frameImages.frameId} = ${frames.id})`;
const frameRow = {
  id: frames.id, code: frames.code, slug: frames.slug, brand: brands.name, model: frames.model, category: frames.category,
  price: frames.price, status: frames.status, availability: frames.availability, availableAt: frames.availableAt,
  isActive: frames.isActive, reviewNote: frames.reviewNote, createdBy: frames.createdBy, createdAt: frames.createdAt,
  updatedAt: frames.updatedAt, photos: photoCount,
};
export type FrameRow = Awaited<ReturnType<typeof framesList>>[number];

/** Frames waiting for the admin's approval (oldest first, so nothing waits too long). */
export function waitingFrames(tx: Tx, limit = 5) {
  return tx.select(frameRow).from(frames).innerJoin(brands, eq(brands.id, frames.brandId))
    .where(eq(frames.status, "waiting")).orderBy(asc(frames.updatedAt)).limit(limit);
}

/** A staff member's own frames not yet approved, sent-back ones first. */
export function myOpenFrames(tx: Tx, userId: string, limit = 5) {
  return tx.select(frameRow).from(frames).innerJoin(brands, eq(brands.id, frames.brandId))
    .where(and(eq(frames.createdBy, userId), ne(frames.status, "approved")))
    .orderBy(sql`${frames.status} = 'sent_back' desc`, desc(frames.updatedAt)).limit(limit);
}

export async function todaysBookings(tx: Tx) {
  return tx.select({
    id: appointments.id, time: appointments.slotStart, name: appointments.name, phone: appointments.phone,
    branch: branches.name, branchSlug: branches.slug, status: appointments.status, note: appointments.note, address: appointments.address,
  }).from(appointments).innerJoin(branches, eq(branches.id, appointments.branchId))
    .where(eq(appointments.day, TODAY)).orderBy(asc(appointments.slotStart));
}

export async function counts(tx: Tx, userId: string) {
  const [r] = await tx.select({
    waitingFrames: sql<number>`(select count(*)::int from ${frames} where ${frames.status} = 'waiting' and ${frames.category} <> 'sunglasses')`,
    waitingSunglasses: sql<number>`(select count(*)::int from ${frames} where ${frames.status} = 'waiting' and ${frames.category} = 'sunglasses')`,
    myOpen: sql<number>`(select count(*)::int from ${frames} where ${frames.createdBy} = ${userId} and ${frames.status} <> 'approved')`,
    mySentBack: sql<number>`(select count(*)::int from ${frames} where ${frames.createdBy} = ${userId} and ${frames.status} = 'sent_back')`,
    bookingsToday: sql<number>`(select count(*)::int from ${appointments} where ${appointments.day} = ${TODAY} and ${appointments.status} <> 'cancelled')`,
    newEnquiries: sql<number>`(select count(*)::int from ${enquiries} where ${enquiries.status} = 'new')`,
    framesLive: sql<number>`(select count(*)::int from ${frames} where ${frames.status} = 'approved' and ${frames.isActive} and ${frames.category} <> 'sunglasses')`,
    sunglassesLive: sql<number>`(select count(*)::int from ${frames} where ${frames.status} = 'approved' and ${frames.isActive} and ${frames.category} = 'sunglasses')`,
    soldOut: sql<number>`(select count(*)::int from ${frames} where ${frames.status} = 'approved' and ${frames.isActive} and ${frames.availability} = 'sold_out')`,
    notApproved: sql<number>`(select count(*)::int from ${frames} where ${frames.status} <> 'approved')`,
    upcomingCamps: sql<number>`(select count(*)::int from ${eyeCamps} where ${eyeCamps.isVisible} and ${eyeCamps.day} >= ${TODAY})`,
    galleryPhotos: sql<number>`(select count(*)::int from ${galleryPhotos} where ${galleryPhotos.isVisible})`,
  }).from(sql`(select 1) as one`);
  return r;
}

/** The last content changes, from updated_by / updated_at (not a full audit log; later phase). */
export async function recentChanges(tx: Tx, limit = 8) {
  const { rows } = await tx.execute<{ at: string; by: string | null; what: string; status: string | null }>(sql`
    (select ${frames.updatedAt} as at, ${frames.updatedBy} as by,
            ${frames.code} || ' ' || ${brands.name} || ' ' || ${frames.model} as what, ${frames.status}::text as status
       from ${frames} join ${brands} on ${brands.id} = ${frames.brandId} where ${frames.updatedBy} is not null)
    union all
    (select ${eyeCamps.updatedAt}, ${eyeCamps.updatedBy}, ${eyeCamps.title}, null from ${eyeCamps} where ${eyeCamps.updatedBy} is not null)
    order by at desc limit ${limit}`);
  return rows;
}

export type ListFilters = { q?: string; status?: string; avail?: string; branch?: string };

/** The staff frames list: search and filters; the viewer's own drafts and sent-back frames first. */
export function framesList(tx: Tx, kind: Kind, f: ListFilters, userId: string) {
  const where: SQL[] = [kindWhere(kind)];
  const q = f.q?.trim();
  if (q) where.push(or(ilike(frames.code, `%${q}%`), ilike(frames.model, `%${q}%`), ilike(brands.name, `%${q}%`))!);
  if (f.status && ["draft", "waiting", "sent_back", "approved"].includes(f.status)) where.push(eq(frames.status, f.status as "draft"));
  if (f.status === "hidden") where.push(eq(frames.isActive, false));
  if (f.avail === "in_stock" || f.avail === "sold_out") where.push(eq(frames.availability, f.avail));
  if (f.branch === "indresham" || f.branch === "patelguda") where.push(inArray(frames.availableAt, [f.branch, "both"]));
  return tx.select(frameRow).from(frames).innerJoin(brands, eq(brands.id, frames.brandId))
    .where(and(...where))
    .orderBy(
      sql`(${frames.createdBy} = ${userId} and ${frames.status} in ('draft', 'sent_back')) desc`,
      sql`${frames.status} = 'waiting' desc`,
      desc(frames.updatedAt),
    )
    .limit(200);
}
