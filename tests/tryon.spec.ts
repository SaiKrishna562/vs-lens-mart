/* Virtual try-on (Requirements_TryOn.md 11), at 360 / 768 / 1440 px.
   The test server runs with TRYON_ENABLED=true (playwright.config.ts).
   A frame is made for these tests and removed after; its try-on picture is
   drawn in the browser (a dark frame on white, like a real front-view photo). */
import { expect, test, type Page } from "@playwright/test";
import { rmSync } from "node:fs";
import path from "node:path";
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

/** A front-view photo as a phone would take it: a dark frame on white, with the side arms
    showing through the clear lenses and a grey shadow under each lens. */
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
    // A double bridge: a bar over the nose bridge, shutting in a gap that isn't a lens
    g.lineWidth = 12; g.beginPath(); g.moveTo(380, 112); g.quadraticCurveTo(500, 70, 620, 112); g.stroke(); g.lineWidth = 22;
    g.lineWidth = 16; g.beginPath(); g.moveTo(40, 150); g.lineTo(150, 160); g.moveTo(850, 160); g.lineTo(960, 150); g.stroke();
    // Arms seen through the lenses, from the hinges down towards the middle
    g.lineWidth = 12; g.beginPath(); g.moveTo(170, 140); g.quadraticCurveTo(230, 210, 260, 290); g.moveTo(830, 140); g.quadraticCurveTo(770, 210, 740, 290); g.stroke();
    // Shadows under the lenses, apart from the frame
    g.strokeStyle = "#c4c4c4"; g.lineWidth = 6; g.beginPath(); g.moveTo(170, 360); g.lineTo(420, 360); g.moveTo(580, 360); g.lineTo(830, 360); g.stroke();
    return c.toDataURL("image/jpeg", 0.92).split(",")[1];
  });
  return Buffer.from(b64, "base64");
}

/** Waits until React has attached to the try-on editor, so a chosen file isn't lost. */
async function editorReady(page: Page) {
  await page.waitForFunction(() => Object.keys(document.querySelector(".tryon-edit input[type=file]") ?? {}).some((k) => k.startsWith("__react")));
}

/** A sunglasses photo: dark rims, brown lenses, and the arms sticking up above the top corners. */
async function sunglassesPhoto(page: Page): Promise<Buffer> {
  const b64 = await page.evaluate(() => {
    const c = document.createElement("canvas");
    c.width = 1000; c.height = 420;
    const g = c.getContext("2d")!;
    g.fillStyle = "#ffffff"; g.fillRect(0, 0, c.width, c.height);
    g.lineWidth = 10; g.strokeStyle = "#1a1a1a"; g.fillStyle = "#6b4a35";
    for (const cx of [300, 700]) { g.beginPath(); g.ellipse(cx, 230, 170, 120, 0, 0, Math.PI * 2); g.fill(); g.stroke(); }
    g.beginPath(); g.moveTo(470, 200); g.quadraticCurveTo(500, 180, 530, 200); g.stroke();
    g.lineWidth = 8; g.beginPath(); g.moveTo(135, 170); g.lineTo(60, 40); g.moveTo(865, 170); g.lineTo(940, 40); g.stroke();
    return c.toDataURL("image/jpeg", 0.92).split(",")[1];
  });
  return Buffer.from(b64, "base64");
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
  // The Photos section points to the try-on section, which is further down the page
  const hint = page.getByRole("link", { name: "add a try-on picture below" });
  await expect(hint).toHaveAttribute("href", "#sec-tryon");
  await page.locator(".tryon-hint").screenshot({ path: testInfo.outputPath("tryon-hint.png") });
  await hint.click();
  const sec = page.locator(".tryon-edit");
  await expect(sec.getByRole("heading", { name: "Try-on picture" })).toBeInViewport();
  const toggle = sec.getByRole("switch", { name: /Try-on for this/ });
  await expect(toggle, "no picture yet").toBeDisabled();

  await sec.locator("input[type=file]").setInputFiles({ name: "front.jpg", mimeType: "image/jpeg", buffer: await framePhoto(page) });
  const pic = sec.getByRole("img", { name: /Try-on picture of this frame/ });
  await expect(pic).toBeVisible();

  // The two clean-up switches start on; each one visibly changes the picture
  const arms = sec.getByRole("switch", { name: /Remove arms seen through the lenses/ });
  const shadows = sec.getByRole("switch", { name: /Remove shadows/ });
  await expect(arms).toBeChecked();
  await expect(shadows).toBeChecked();
  const measure = () => pic.evaluate((c: HTMLCanvasElement) => {
    // Dark pixels in the middle band (inside the lenses) and around the bridge, and the picture's height
    const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
    const count = (x0: number, x1: number, y0: number, y1: number) => {
      let n = 0;
      for (let y = Math.floor(c.height * y0); y < c.height * y1; y++) for (let x = Math.floor(c.width * x0); x < c.width * x1; x++) {
        const i = (y * c.width + x) * 4;
        if (d[i] < 90 && d[i + 1] < 90 && d[i + 2] < 90) n++;
      }
      return n / (c.width * c.height);
    };
    return { dark: count(0.15, 0.85, 0.3, 0.8), bridge: count(0.4, 0.6, 0, 0.45), h: c.height / c.width };
  });
  const both = await measure();
  await arms.uncheck();
  const armsOff = await measure();
  expect(armsOff.dark, "arms off: more frame inside the lenses").toBeGreaterThan(both.dark * 1.05);
  expect(both.bridge, "removing the arms keeps the double bridge").toBeGreaterThan(armsOff.bridge * 0.9);
  await arms.check();
  await shadows.uncheck();
  expect((await measure()).h, "shadows off: the shadow makes the picture taller").toBeGreaterThan(both.h * 1.03);
  await shadows.check();

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

  // A saved picture can go back through the clean-up, with its switches
  await page.reload();
  await editorReady(page);
  await expect(sec.getByRole("switch", { name: /Remove arms/ })).toHaveCount(0);
  await sec.getByRole("button", { name: "Clean up this picture again" }).click();
  await expect(sec.getByRole("switch", { name: /Remove arms/ })).toBeChecked();
  await sec.getByRole("button", { name: "Cancel" }).click();

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
  await sec.getByRole("switch", { name: /Try-on for this/ }).check();
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
  // Starting a camera can take a while on a busy computer
  await expect(panel.getByLabel("Camera preview")).toBeVisible({ timeout: 15_000 });
  await expect(panel.getByRole("status")).toHaveText(/fit your face in the oval|Getting the camera ready|Starting the camera/, { timeout: 15_000 });
  await page.screenshot({ path: testInfo.outputPath("tryon-camera.png") });
  await panel.getByRole("button", { name: "Back" }).click();
  await expect(panel.getByRole("button", { name: "Take a selfie" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  expect(errors, "no page errors").toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), "sideways scroll").toBe(0);
});

test("staff: sunglasses lenses: mirrored is found, tinted lets the eyes show through, and the eraser clears leftover arms", async ({ page }, testInfo) => {
  await signIn(page);
  await page.goto(`/admin/frames/${fixture.code}`);
  await editorReady(page);
  const sec = page.locator(".tryon-edit");
  await sec.locator("input[type=file]").setInputFiles({ name: "sun.jpg", mimeType: "image/jpeg", buffer: await sunglassesPhoto(page) });
  const pic = sec.getByRole("img", { name: /Try-on picture of this frame/ });
  await expect(pic).toBeVisible();

  await sec.getByRole("radio", { name: /Mirrored/ }).check();
  await expect(sec.getByText("A gold dot isn't on a lens")).toHaveCount(0);
  await sec.getByRole("radio", { name: /Tinted/ }).check();
  await expect(sec.getByText("A gold dot isn't on a lens")).toHaveCount(0);

  // Erase the arm sticking up at the top-left corner
  await sec.getByRole("button", { name: "Erase bits" }).click();
  // Mid-screen, clear of the staff area's sticky top bar
  await pic.evaluate((el) => el.scrollIntoView({ block: "center" }));
  const box = (await pic.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.005, box.y + box.height * 0.01);
  await page.mouse.down();
  for (const [x, y] of [[0.04, 0.12], [0.07, 0.25], [0.09, 0.35], [0.02, 0.05], [0.06, 0.06]]) await page.mouse.move(box.x + box.width * x, box.y + box.height * y, { steps: 4 });
  await page.mouse.up();
  await expect(sec.getByRole("button", { name: "Undo" })).toBeEnabled();
  await sec.screenshot({ path: testInfo.outputPath("sunglasses-editor.png") });

  await sec.getByRole("switch", { name: /Try-on for this/ }).check();
  await sec.getByRole("button", { name: "Save try-on" }).click();
  await expect(sec.getByText("Saved. Try-on is on for this frame.")).toBeVisible();

  const row = await tryonRow();
  const check = await page.evaluate(async ({ path, l, y }) => {
    const bmp = await createImageBitmap(await (await fetch(`/media/${path}`)).blob());
    const c = document.createElement("canvas"); c.width = bmp.width; c.height = bmp.height;
    const g = c.getContext("2d")!; g.drawImage(bmp, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    const alpha = (fx: number, fy: number) => d[(Math.round(fy * c.height) * c.width + Math.round(fx * c.width)) * 4 + 3];
    // Opaque share of the top-left corner, where the arm was
    let solid = 0, all = 0;
    for (let yy = 0; yy < c.height * 0.2; yy++) for (let xx = 0; xx < c.width * 0.06; xx++) { all++; if (d[(yy * c.width + xx) * 4 + 3] > 128) solid++; }
    return { lens: alpha(l, y), corner: solid / all };
  }, { path: row.tryon_path!, l: row.tryon_lens_left, y: row.tryon_lens_y });
  expect(check.lens, "tinted lens: about 60% see-through tint").toBeGreaterThan(120);
  expect(check.lens).toBeLessThan(180);
  expect(check.corner, "the erased arm is gone").toBeLessThan(0.05);
});

/* Add frame page: try-on is optional and saves with the new frame */
const newCodes: string[] = [];
test.afterAll(async () => {
  if (!newCodes.length) return;
  const c = await connect("owner");
  await c.query("select set_config('app.role', 'admin', false)");
  const rows = (await c.query("select id, tryon_path from frames where code = any($1)", [newCodes])).rows as { id: string; tryon_path: string | null }[];
  await c.query("delete from frames where code = any($1)", [newCodes]);
  await c.end();
  for (const r of rows) rmSync(path.join("uploads", "frames", r.id), { recursive: true, force: true });
});

async function addFrame(page: Page, code: string) {
  await page.goto("/admin/frames/new");
  await page.waitForFunction(() => ["[data-testid=photo-input]", ".tryon-edit input[type=file]"]
    .every((s) => Object.keys(document.querySelector(s) ?? {}).some((k) => k.startsWith("__react"))));
  await page.getByLabel("Frame code").fill(code);
  await page.getByLabel("Category").selectOption("eyeglasses");
  await page.getByLabel("Brand").selectOption({ index: 1 });
  await page.getByLabel("Model").fill(`E2E Tryon New ${code}`);
  await page.getByText("Unisex", { exact: true }).click();
  await page.getByLabel("Colour").selectOption({ index: 1 });
  await page.getByLabel("Shape").selectOption("Round");
  await page.getByLabel("Price", { exact: true }).fill("2450");
}

test("staff: a try-on picture added on the Add frame page is saved with the new frame", async ({ page }, testInfo) => {
  await signIn(page);
  const code = `QN${testInfo.project.name.slice(0, 1).toUpperCase()}-${10000 + Math.floor(Math.random() * 9e4)}`; // the form's format, e.g. QNP-12345
  newCodes.push(code);
  await addFrame(page, code);
  await expect(page.locator(".tryon-hint")).toContainText("optional; it's saved with the frame");
  const sec = page.locator(".tryon-edit");
  await expect(sec).toContainText("Optional. It's saved with the frame");
  await expect(sec.getByRole("button", { name: "Save try-on" }), "no separate Save here").toHaveCount(0);
  await sec.locator("input[type=file]").setInputFiles({ name: "front.jpg", mimeType: "image/jpeg", buffer: await framePhoto(page) });
  await expect(sec.getByRole("img", { name: /Try-on picture of this frame/ })).toBeVisible();
  await expect(sec.getByRole("switch", { name: /Try-on for this/ }), "a first picture switches try-on on").toBeChecked();
  await page.getByRole("button", { name: "Save as draft" }).click();
  await expect(page.getByRole("heading", { name: "Saved as draft" })).toBeVisible();
  await expect(page.getByText("Its try-on picture is saved, and try-on is on.")).toBeVisible();

  const c = await connect("owner");
  await c.query("select set_config('app.role', 'admin', false)");
  const row = (await c.query("select id, status, tryon_enabled, tryon_path from frames where code = $1", [code])).rows[0];
  await c.end();
  expect(row.status).toBe("draft");
  expect(row.tryon_enabled).toBe(true);
  expect(row.tryon_path).toMatch(new RegExp(`^frames/${row.id}/[0-9a-f-]{36}\\.png$`));
  expect(isTransparentPng(new Uint8Array(await (await page.request.get(`/media/${row.tryon_path}`)).body()))).toBe(true);
});

test("staff: try-on is optional on the Add frame page; it can be added later on the edit page", async ({ page }, testInfo) => {
  await signIn(page);
  const code = `QO${testInfo.project.name.slice(0, 1).toUpperCase()}-${10000 + Math.floor(Math.random() * 9e4)}`;
  newCodes.push(code);
  await addFrame(page, code);
  await page.getByRole("button", { name: "Save as draft" }).click();
  await expect(page.getByRole("heading", { name: "Saved as draft" })).toBeVisible();
  await expect(page.getByText(/try-on/i)).toHaveCount(0);
  // Later, on its edit page
  await page.goto(`/admin/frames/${code}`);
  await expect(page.locator(".tryon-edit").getByRole("button", { name: "Choose a front-view photo" })).toBeVisible();
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
