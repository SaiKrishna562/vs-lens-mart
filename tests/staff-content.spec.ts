/* Staff add each type of content (sprint 5.5, Requirements_Admin.md 7). Lenses
   now; eye camps, gallery and testimonials join in the later parts. Test rows
   are named "E2E Content" and removed afterwards. */
import { expect, test, type Browser, type Page } from "@playwright/test";
import { accounts, connect, type Role } from "./helpers";

const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
const STAMP = String(Date.now()).slice(-6);
const LENS = `E2E Content Lens ${STAMP}`;

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
  await c.end();
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
  await expect(page.getByText("Saved. It's on the Lenses page now.")).toBeVisible();
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
  await expect(staff.getByText("Saved. It's hidden from the site.")).toBeVisible();
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
