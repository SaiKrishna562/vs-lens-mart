/* Staff settings (Requirements_Admin.md 7.1 and settings): Branches now;
   Branch holidays and Staff accounts join in the next parts. Every change made
   here is put back through the same page, so the site's cache refreshes too. */
import { expect, test, type Browser, type Page } from "@playwright/test";
import { addDays, dayLabel, nowInIndia } from "../src/lib/booking-rules";
import { branches as seedBranches } from "../src/lib/site-config";
import { accounts, connect, type Role } from "./helpers";

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
test.describe.configure({ mode: "serial" });

test("branches: staff see them read-only, and the database refuses a staff change", async ({ browser }) => {
  const page = await as(browser, "staff", 360);
  await page.goto("/admin/branches");
  await expect(page.getByText("Only an admin can change branch details.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save changes" })).toHaveCount(0);
  await expect(page.locator("#indresham-address")).toHaveAttribute("readonly", "");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), "sideways scroll").toBe(0);

  const c = await connect("app");
  await c.query("select set_config('app.role', 'staff', false)");
  const r = await c.query("update branches set address = 'E2E hack' where slug = 'indresham'");
  await c.end();
  expect(r.rowCount, "staff can't write branch details").toBe(0);
});

test("branches: the admin's change reaches the footer and the booking times at once; bad values get plain messages", async ({ browser }) => {
  const admin = await as(browser, "admin");
  await admin.goto("/admin/branches");
  await ready(admin, "#indresham-closes");
  const closes = admin.locator("#indresham-closes");
  // Restore the seed value, not the one found, so a run stopped halfway doesn't leave 8:30 PM behind
  const original = seedBranches.find((b) => b.slug === "indresham")!.closes;

  // Plain messages first
  await admin.locator("#indresham-phone").fill("12345");
  await closes.fill("08:00");
  await admin.getByRole("button", { name: "Save changes" }).click();
  await expect(admin.locator(".esummary")).toContainText("Indresham: Enter a 10-digit phone number.");
  await expect(admin.locator(".esummary")).toContainText("Indresham: Closing time must be after opening time.");
  await admin.getByRole("button", { name: "Undo changes" }).click();

  // A real change: close at 8:30 PM
  await closes.fill("20:30");
  await admin.getByRole("button", { name: "Save changes" }).click();
  await expect(admin.getByText("Saved. The website shows the new details now.")).toBeVisible();
  try {
    const site = await (await browser.newContext()).newPage();
    await site.goto("/contact");
    await expect(site.locator(".footer")).toContainText("9 AM–8:30 PM");
    const tomorrow = addDays(nowInIndia().day, 1);
    await site.goto(`/book-eye-test?branch=indresham&date=${tomorrow}`);
    await expect(site.locator('input[name="time-choice"]').last()).toHaveValue("20:00"); // last start 30 minutes before closing
  } finally {
    // Put it back through the page, so the cache refreshes too
    await admin.goto("/admin/branches");
    await ready(admin, "#indresham-closes");
    await admin.locator("#indresham-closes").fill(original);
    await admin.getByRole("button", { name: "Save changes" }).click();
    await expect(admin.getByText("Saved. The website shows the new details now.")).toBeVisible();
  }
});

test("holidays: staff see them read-only, and the database refuses a staff closed day", async ({ browser }) => {
  const page = await as(browser, "staff");
  await page.goto("/admin/holidays");
  await expect(page.getByText("Only an admin can add or remove closed days.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add closed day" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Remove/ })).toHaveCount(0);
  const c = await connect("app");
  await c.query("select set_config('app.role', 'staff', false)");
  await expect(c.query("insert into branch_closures (day, note) values (current_date + 40, 'E2E staff')"), "staff can't add").rejects.toThrow(/row-level security/);
  await c.end();
});

test("holidays: the admin closes a day; bookings on it are flagged; the booking form and Contact show it; removing opens it again", async ({ browser }) => {
  const day = addDays(nowInIndia().day, 3);
  const c = await connect("owner");
  await c.query("select set_config('app.role', 'admin', false)");
  const branch = (await c.query("select id from branches where slug = 'indresham'")).rows[0].id;
  await c.query(`insert into appointments (reference, branch_id, day, slot_start, name, phone, consent_at)
                 values ('E2E-' || substr(md5(random()::text), 1, 6), $1, $2, '11:00', 'E2E Settings booking', '9000000021', now())`, [branch, day]);
  await c.end();
  try {
    const admin = await as(browser, "admin");
    await admin.goto("/admin/holidays");
    await ready(admin, "#h-day");
    await admin.locator("#h-day").fill(day);
    await admin.locator("#h-branch").selectOption("indresham");
    await admin.getByLabel(/^Note/).fill("E2E festival");
    await admin.getByRole("button", { name: "Add closed day" }).click();
    const banner = admin.getByRole("status").filter({ hasText: "is now closed" });
    await expect(banner).toContainText(`${dayLabel(day)} is now closed.`);
    await expect(banner).toContainText("1 booking is already on this day");
    await expect(banner.getByRole("link", { name: "See the bookings" })).toHaveAttribute("href", `/admin/bookings?day=${day}&branch=both`);

    await admin.locator("#h-day").fill(day);
    await admin.getByRole("button", { name: "Add closed day" }).click();
    await expect(admin.getByText("That day is already closed for this branch.")).toBeVisible();

    const site = await (await browser.newContext()).newPage();
    await site.goto(`/book-eye-test?branch=indresham&date=${day}`);
    await expect(site.locator("#slots")).toContainText(`Closed on ${dayLabel(day)}`);
    await site.goto("/contact");
    await expect(site.locator("article#indresham")).toContainText(`Closed on ${dayLabel(day)} (E2E festival)`);

    const row = admin.locator(".bk-row", { hasText: "E2E festival" });
    await row.getByRole("button", { name: /^Remove/ }).click();
    await admin.getByRole("dialog").getByRole("button", { name: "Open this day" }).click();
    await expect(row).toHaveCount(0);
    await site.goto(`/book-eye-test?branch=indresham&date=${day}`);
    await expect(site.locator('input[name="time-choice"]').first(), "bookable again").toBeAttached();
  } finally {
    const c2 = await connect("owner");
    await c2.query("select set_config('app.role', 'admin', false)");
    await c2.query("delete from appointments where name = 'E2E Settings booking'");
    await c2.query("delete from branch_closures where note = 'E2E festival'");
    await c2.end();
  }
});

