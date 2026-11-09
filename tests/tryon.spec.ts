/* Virtual try-on (Requirements_TryOn.md 11), at 360 / 768 / 1440 px.
   The test server runs with TRYON_ENABLED=true (playwright.config.ts).
   A frame is made for these tests and removed after; its try-on picture is
   drawn in the browser (a dark frame on white, like a real front-view photo). */
import { expect, test, type Page } from "@playwright/test";
import { isTransparentPng } from "../src/lib/upload-rules";
import { accounts, connect } from "./helpers";

const fixture = { id: "", code: "", slug: "", brand: "", colour: "" };
test.beforeAll(async () => {
  const c = await connect("owner");
  await c.query("select set_config('app.role', 'admin', false)");
  const one = async (sql: string, v: unknown[] = []) => (await c.query(sql, v)).rows[0];
  fixture.brand = (await one("insert into brands (name) values ('E2E Tryon Brand ' || gen_random_uuid()) returning id")).id;
  fixture.colour = (await one("insert into colours (name) values ('E2E tryon colour ' || gen_random_uuid()) returning id")).id;
  fixture.code = `E2E-T${Math.floor(Math.random() * 1e6)}`;
  fixture.slug = fixture.code.toLowerCase();
  fixture.id = (await one(
    `insert into frames (code, slug, brand_id, model, category, gender, colour_id, shape, price, available_at, status)
     values ($1, $2, $3, 'Tryon Test Model', 'eyeglasses', 'unisex', $4, 'Round', 3333, 'both', 'approved') returning id`,
    [fixture.code, fixture.slug, fixture.brand, fixture.colour])).id;
  await c.end();
});
test.afterAll(async () => {
  const c = await connect("owner");
  await c.query("select set_config('app.role', 'admin', false)");
  await c.query("delete from frames where id = $1", [fixture.id]);
  await c.query("delete from brands where id = $1", [fixture.brand]);
  await c.query("delete from colours where id = $1", [fixture.colour]);
  await c.end();
});

async function signIn(page: Page) {
  const a = accounts().staff;
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(a.email);
  await page.getByLabel("Password").fill(a.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: /^Good (morning|afternoon|evening)/ })).toBeVisible();
}

/** A front-view photo as a phone would take it: a dark frame with arms, on white. */
async function framePhoto(page: Page): Promise<Buffer> {
  const b64 = await page.evaluate(() => {
    const c = document.createElement("canvas");
    c.width = 1000; c.height = 420;
    const g = c.getContext("2d")!;
    g.fillStyle = "#ffffff"; g.fillRect(0, 0, c.width, c.height);
    g.strokeStyle = "#1a1a1a"; g.lineWidth = 22;
    g.beginPath(); g.roundRect(150, 110, 290, 210, 70); g.stroke();
    g.beginPath(); g.roundRect(560, 110, 290, 210, 70); g.stroke();
    g.beginPath(); g.moveTo(440, 170); g.quadraticCurveTo(500, 130, 560, 170); g.stroke();
    g.lineWidth = 16; g.beginPath(); g.moveTo(40, 150); g.lineTo(150, 160); g.moveTo(850, 160); g.lineTo(960, 150); g.stroke();
    return c.toDataURL("image/jpeg", 0.92).split(",")[1];
  });
  return Buffer.from(b64, "base64");
}

/** Waits until React has attached to the try-on editor, so a chosen file isn't lost. */
async function editorReady(page: Page) {
  await page.waitForFunction(() => Object.keys(document.querySelector(".tryon-edit input[type=file]") ?? {}).some((k) => k.startsWith("__react")));
}

const tryonRow = async () => {
  const c = await connect("owner");
  await c.query("select set_config('app.role', 'admin', false)");
  const r = (await c.query("select tryon_enabled, tryon_path, tryon_lens_left, tryon_lens_right, tryon_lens_y from frames where id = $1", [fixture.id])).rows[0];
  await c.end();
  return r as { tryon_enabled: boolean; tryon_path: string | null; tryon_lens_left: number; tryon_lens_right: number; tryon_lens_y: number };
};

test.describe.configure({ mode: "serial" });

test("staff: a front-view photo becomes a see-through try-on picture, served to the public only while try-on is on", async ({ page, request }, testInfo) => {
  await signIn(page);
  await page.goto(`/admin/frames/${fixture.code}`);
  await editorReady(page);
  const sec = page.locator(".tryon-edit");
  await expect(sec.getByRole("heading", { name: "Try-on picture" })).toBeVisible();
  const toggle = sec.getByRole("switch");
  await expect(toggle, "no picture yet").toBeDisabled();

  await sec.locator("input[type=file]").setInputFiles({ name: "front.jpg", mimeType: "image/jpeg", buffer: await framePhoto(page) });
  await expect(sec.getByRole("img", { name: /Try-on picture of this frame/ })).toBeVisible();
  await sec.getByLabel(/Trim left arm/).fill("10");
  await sec.getByLabel(/Trim right arm/).fill("10");
  await sec.screenshot({ path: testInfo.outputPath("tryon-editor.png") });
  await toggle.check();
  await sec.getByRole("button", { name: "Save try-on" }).click();
  await expect(sec.getByText("Saved. Try-on is on for this frame.")).toBeVisible();

  const row = await tryonRow();
  expect(row.tryon_enabled).toBe(true);
  expect(row.tryon_path).toMatch(new RegExp(`^frames/${fixture.id}/[0-9a-f-]{36}\\.png$`));
  const staffGet = await page.request.get(`/media/${row.tryon_path}`);
  expect(staffGet.status()).toBe(200);
  expect(isTransparentPng(new Uint8Array(await staffGet.body())), "the saved picture is see-through").toBe(true);
  expect((await request.get(`/media/${row.tryon_path}`)).status(), "public, try-on on").toBe(200);

  // Try-on off: the public no longer gets the picture; staff still do
  await toggle.uncheck();
  await sec.getByRole("button", { name: "Save try-on" }).click();
  await expect(sec.getByText("Saved. Try-on is off for this frame.")).toBeVisible();
  expect((await request.get(`/media/${row.tryon_path}`)).status(), "public, try-on off").toBe(404);
  expect((await page.request.get(`/media/${row.tryon_path}`)).status(), "staff, try-on off").toBe(200);

  // Remove: the row forgets it and the file is gone
  await sec.getByRole("button", { name: "Remove picture" }).click();
  await expect(sec.getByText("Try-on picture removed.")).toBeVisible();
  expect((await tryonRow()).tryon_path).toBeNull();
  expect((await page.request.get(`/media/${row.tryon_path}`)).status(), "file deleted").toBe(404);
  await expect(toggle).toBeDisabled();
});

/* ---------- Customer side ---------- */
// Chromium's fake camera (a moving test pattern, no face) and no permission prompt
test.use({ launchOptions: { args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] } });

/** Gives the fixture frame a try-on picture straight in the database (the staff flow is tested above). */
async function withTryon(on: boolean) {
  const c = await connect("owner");
  await c.query("select set_config('app.role', 'admin', false)");
  await c.query("update frames set tryon_enabled = $2, tryon_path = case when $2 then 'frames/' || id || '/00000000-0000-4000-8000-000000000000.png' else null end where id = $1", [fixture.id, on]);
  await c.end();
}

test("customer: Try it on appears only on frames with try-on, opens the panel, loads face tracking and handles a photo with no face", async ({ page }, testInfo) => {
  // The site caches the catalogue; a staff save would refresh it, so save through the staff page
  await signIn(page);
  await page.goto(`/admin/frames/${fixture.code}`);
  await editorReady(page);
  const sec = page.locator(".tryon-edit");
  await sec.locator("input[type=file]").setInputFiles({ name: "front.jpg", mimeType: "image/jpeg", buffer: await framePhoto(page) });
  await expect(sec.getByRole("img", { name: /Try-on picture of this frame/ })).toBeVisible();
  await sec.getByRole("switch").check();
  await sec.getByRole("button", { name: "Save try-on" }).click();
  await expect(sec.getByText("Saved. Try-on is on for this frame.")).toBeVisible();
  await page.context().clearCookies(); // the customer isn't signed in

  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`/frames/${fixture.slug}`);
  const cta = page.getByRole("button", { name: "Try it on" });
  await expect(cta).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("tryon-button.png") });
  await page.waitForFunction(() => Object.keys(document.querySelector(".tryon-cta") ?? {}).some((k) => k.startsWith("__react")));
  await cta.click();
  const panel = page.getByRole("dialog", { name: /Try on/ });
  await expect(panel).toBeVisible();
  await expect(panel.getByText("Your photo stays on this device.")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("tryon-start.png") });

  // A photo with no face: face tracking loads from this site and says so
  const outside: string[] = [];
  page.on("request", (r) => { if (!r.url().startsWith(new URL(page.url()).origin)) outside.push(r.url()); });
  const noFace = await page.evaluate(() => {
    const c = document.createElement("canvas"); c.width = 640; c.height = 480;
    const g = c.getContext("2d")!; g.fillStyle = "#FAF6EE"; g.fillRect(0, 0, 640, 480);
    return c.toDataURL("image/jpeg").split(",")[1];
  });
  await panel.locator("input[type=file]").setInputFiles({ name: "wall.jpg", mimeType: "image/jpeg", buffer: Buffer.from(noFace, "base64") });
  await expect(panel.getByRole("alert")).toContainText("We couldn't find a face in that photo", { timeout: 30_000 });
  expect(outside, "the model and its runtime come from this site, not a CDN").toEqual([]);

  // The camera: the preview and the guide, then Back
  await panel.getByRole("button", { name: "Try the camera again" }).click();
  await expect(panel.getByLabel("Camera preview")).toBeVisible();
  await expect(panel.getByRole("status")).toHaveText(/fit your face in the oval|Getting the camera ready|Starting the camera/);
  await page.screenshot({ path: testInfo.outputPath("tryon-camera.png") });
  await panel.getByRole("button", { name: "Back" }).click();
  await expect(panel.getByRole("button", { name: "Take a selfie" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  expect(errors, "no page errors").toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), "sideways scroll").toBe(0);
});

test("customer: a frame without try-on has no Try it on button", async ({ page }) => {
  await withTryon(false);
  const c = await connect("app");
  await c.query("select set_config('app.role', 'public', false)");
  const other = (await c.query("select slug from frames where status = 'approved' and is_active and not tryon_enabled and category <> 'sunglasses' limit 1")).rows[0].slug as string;
  await c.end();
  await page.goto(`/frames/${other}`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: "Try it on" })).toHaveCount(0);
});
