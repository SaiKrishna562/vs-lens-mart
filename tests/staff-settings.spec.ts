/* Staff settings (Requirements_Admin.md 7.1 and settings): Branches now;
   Branch holidays and Staff accounts join in the next parts. Every change made
   here is put back through the same page, so the site's cache refreshes too. */
import { expect, test, type Browser, type Page } from "@playwright/test";
import { addDays, nowInIndia } from "../src/lib/booking-rules";
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
  const original = await closes.inputValue();

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
