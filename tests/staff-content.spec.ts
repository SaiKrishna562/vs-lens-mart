/* Staff add each type of content (sprint 5.5, Requirements_Admin.md 7). Lenses
   now; eye camps, gallery and testimonials join in the later parts. Test rows
   are named "E2E Content" and removed afterwards. */
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { expect, test, type Browser, type Page } from "@playwright/test";
import { addDays, nowInIndia } from "../src/lib/booking-rules";
import { accounts, connect, type Role } from "./helpers";

const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
const STAMP = String(Date.now()).slice(-6);
const LENS = `E2E Content Lens ${STAMP}`;
const CAMP_NEXT = `E2E Content Camp Next ${STAMP}`;
const CAMP_PAST = `E2E Content Camp Past ${STAMP}`;
const uploads = (stored: string) => path.join(process.cwd(), "uploads", ...stored.split("/"));

async function owner() {
  const c = await connect("owner");
  await c.query("select set_config('app.role', 'admin', false)");
  return c;
}
async function as(browser: Browser, role: Role, width = 1280): Promise<Page> {
  const page = await (await browser.newContext({ viewport: { width, height: 900 } })).newPage();
  const a = accounts()[role];
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(a.email);
  await page.getByLabel("Password").fill(a.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: /^Good (morning|afternoon|evening)/ })).toBeVisible();
  return page;
}
async function ready(page: Page, selector: string) {
  await page.waitForFunction((s) => { const el = document.querySelector(s); return !!el && Object.keys(el).some((k) => k.startsWith("__react")); }, selector);
}

test.afterAll(async () => {
  const c = await owner();
  await c.query("delete from lenses where name like 'E2E Content%'");
  await c.query("delete from brands where name like 'E2E Content%'");
  const camps = (await c.query("select id from eye_camps where title like 'E2E Content%'")).rows as { id: string }[];
  await c.query("delete from eye_camps where title like 'E2E Content%'");
  await c.end();
  for (const { id } of camps) rmSync(path.join(process.cwd(), "uploads", "camps", id), { recursive: true, force: true });
});
test.describe.configure({ mode: "serial" });

test("staff add a lens with a new brand and a photo on a phone; it's on /lenses at once", async ({ browser }) => {
  const page = await as(browser, "staff", 360);
  await page.goto("/admin/lenses/new");
  await ready(page, "#name");
  await page.getByLabel("Brand", { exact: true }).selectOption({ label: "Add a new brand…" });
  await page.getByLabel("Brand", { exact: true }).fill(`E2E Content Brand ${STAMP}`);
  await page.getByLabel("Lens name").fill(LENS);
  await page.getByLabel("Type").selectOption("progressive");
  await page.getByLabel(/^Features/).fill("Anti-glare");
  await page.getByRole("button", { name: "Add feature" }).click();
  await page.getByTestId("photo-input").setInputFiles({ name: "lens.png", mimeType: "image/png", buffer: PNG });
  await expect(page.locator(".ptile")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), "sideways scroll").toBe(0);
  await page.getByRole("button", { name: "Add lens" }).click();
  await expect(page.getByText("Saved. It's on the Lenses page now.").filter({ visible: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Delete lens" }), "staff can't delete").toHaveCount(0);

  const c = await owner();
  const row = (await c.query("select l.type, l.features, l.price, l.photo_path, b.for_lenses from lenses l join brands b on b.id = l.brand_id where l.name = $1", [LENS])).rows[0];
  await c.end();
  expect(row).toMatchObject({ type: "progressive", features: ["Anti-glare"], price: null, for_lenses: true });
  expect(row.photo_path).toMatch(/^lenses\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.webp$/);

  const pub = await (await browser.newContext()).newPage();
  await pub.goto("/lenses?type=progressive");
  const card = pub.locator(".lcard", { has: pub.getByRole("heading", { name: LENS }) });
  await expect(card).toContainText("Ask for price");
  await expect(card).toContainText("Anti-glare");
  expect((await pub.request.get(`/media/${row.photo_path}`)).status()).toBe(200);
});

test("hiding a lens takes it off the site; only an admin deletes it (and its photo)", async ({ browser, request }) => {
  const c = await owner();
  const { id, photo_path } = (await c.query("select id, photo_path from lenses where name = $1", [LENS])).rows[0];
  await c.end();
  const staff = await as(browser, "staff");
  await staff.goto(`/admin/lenses/${id}`);
  await ready(staff, "#name");
  await staff.getByLabel("Show this lens on the Lenses page").uncheck();
  await staff.getByRole("button", { name: "Save changes" }).click();
  await expect(staff.getByText("Saved. It's hidden from the site.").filter({ visible: true })).toBeVisible();
  await expect.poll(async () => (await request.get(`/media/${photo_path}`)).status(), "a hidden lens's photo isn't public").toBe(404);

  const admin = await as(browser, "admin");
  await admin.goto(`/admin/lenses/${id}`);
  await admin.getByRole("button", { name: "Delete lens" }).click();
  await admin.getByRole("dialog").getByRole("button", { name: "Delete lens" }).click();
  await expect(admin).toHaveURL(/\/admin\/lenses$/);
  const c2 = await owner();
  expect((await c2.query("select count(*)::int n from lenses where name = $1", [LENS])).rows[0].n).toBe(0);
  await c2.end();
});

test("staff add an upcoming camp: no photos before the day, and it's on the site at once", async ({ browser }) => {
  const day = addDays(nowInIndia().day, 20);
  const page = await as(browser, "staff", 360);
  await page.goto("/admin/eye-camps/new");
  await ready(page, "#title");
  await page.getByLabel("Camp name").fill(CAMP_NEXT);
  await page.getByLabel("Date").fill(day);
  await page.getByLabel("Location and address").fill("E2E Community hall, Citizens Colony, Indresham");
  await page.getByLabel("Description").fill("A free vision check for everyone in the colony.");
  await page.locator('label.rchoice:has-text("Vision check")').click();
  await expect(page.getByText("It opens by itself once the date has passed.")).toBeVisible();
  await expect(page.getByTestId("photo-input"), "photos wait until after the camp").toHaveCount(0);
  await page.getByRole("button", { name: "Save camp" }).click();
  await expect(page.getByText("Saved. It's on the Eye camps page now.").filter({ visible: true })).toBeVisible();
  await expect(page).toHaveURL((u) => u.pathname === `/admin/eye-camps/e2e-content-camp-next-${STAMP}-${day}` && u.searchParams.get("saved") === "1");

  const pub = await (await browser.newContext()).newPage();
  await pub.goto(`/eye-camps/e2e-content-camp-next-${STAMP}-${day}`);
  await expect(pub.locator(".status")).toHaveText("Upcoming");
  await expect(pub.locator(".pill-list")).toContainText("Vision check");
});

test("a past camp: people checked and photos; a photo of people needs the permission tick (browser, server and database)", async ({ browser }) => {
  const day = addDays(nowInIndia().day, -10);
  const page = await as(browser, "staff");
  await page.goto("/admin/eye-camps/new");
  await ready(page, "#title");
  await page.getByLabel("Camp name").fill(CAMP_PAST);
  await page.getByLabel("Date").fill(day);
  await page.getByLabel("Location and address").fill("E2E School hall, Patelguda");
  await page.getByLabel("Description").fill("Vision checks for the school's students and staff.");
  await page.getByLabel("People checked").fill("42");
  await page.getByTestId("photo-input").setInputFiles([
    { name: "a.png", mimeType: "image/png", buffer: PNG },
    { name: "b.png", mimeType: "image/png", buffer: PNG },
  ]);
  await expect(page.locator(".ptile")).toHaveCount(2);
  await page.locator(".ptile").nth(1).getByLabel("Shows people").check();
  await page.getByRole("button", { name: "Save camp" }).click();
  await expect(page.locator(".esummary")).toContainText("Tick the permission box for every photo that shows people");
  await page.locator(".ptile").nth(1).getByLabel(/gave written permission/).check();
  await page.getByRole("button", { name: "Save camp" }).click();
  await expect(page.getByText("Saved. It's on the Eye camps page now.").filter({ visible: true })).toBeVisible();

  const c = await owner();
  const camp = (await c.query("select id, people from eye_camps where title = $1", [CAMP_PAST])).rows[0];
  const photos = (await c.query("select path, shows_people, consent from camp_photos where camp_id = $1 order by position", [camp.id])).rows;
  expect(camp.people).toBe(42);
  expect(photos.map((p) => [p.shows_people, p.consent])).toEqual([[false, false], [true, true]]);
  await expect(c.query("update camp_photos set consent = false where camp_id = $1 and shows_people", [camp.id]), "the database refuses it too")
    .rejects.toThrow(/camp_photos_consent/);
  await c.end();
});

test("the photo viewer: opens from a photo, arrow keys move, Esc closes and gives focus back", async ({ browser }) => {
  const c = await owner();
  const slug = (await c.query("select slug from eye_camps where title = $1", [CAMP_PAST])).rows[0].slug;
  await c.end();
  const page = await (await browser.newContext()).newPage();
  await page.goto(`/eye-camps/${slug}`);
  await expect(page.locator(".people-big")).toHaveText("42");
  await page.waitForFunction(() => { const b = document.querySelector(".photo-grid button"); return !!b && Object.keys(b).some((k) => k.startsWith("__react")); });
  const first = page.getByRole("button", { name: "Open photo 1 of 2" });
  await first.click();
  const viewer = page.locator("dialog.lightbox");
  await expect(viewer).toBeVisible();
  await expect(viewer).toContainText("1 of 2");
  await page.keyboard.press("ArrowRight");
  await expect(viewer).toContainText("2 of 2");
  await page.keyboard.press("Escape");
  await expect(viewer).toBeHidden();
  await expect(first).toBeFocused();
});

test("only an admin deletes a camp, and its photo files go too", async ({ browser }) => {
  const c = await owner();
  const camp = (await c.query("select id, slug from eye_camps where title = $1", [CAMP_PAST])).rows[0];
  const paths = (await c.query("select path from camp_photos where camp_id = $1", [camp.id])).rows.map((r) => r.path as string);
  await c.end();
  expect(paths.every((p) => existsSync(uploads(p)))).toBe(true);
  const staff = await as(browser, "staff");
  await staff.goto(`/admin/eye-camps/${camp.slug}`);
  await expect(staff.getByRole("button", { name: "Delete camp" })).toHaveCount(0);
  const admin = await as(browser, "admin");
  await admin.goto(`/admin/eye-camps/${camp.slug}`);
  await admin.getByRole("button", { name: "Delete camp" }).click();
  await admin.getByRole("dialog").getByRole("button", { name: "Delete camp" }).click();
  await expect(admin).toHaveURL(/\/admin\/eye-camps$/);
  expect(paths.some((p) => existsSync(uploads(p))), "photo files removed").toBe(false);
});

