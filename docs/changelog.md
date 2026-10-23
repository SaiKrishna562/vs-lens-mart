# Changelog

All notable changes to the VS Lens Mart website project documentation and plan are recorded here.

New entries go at the top, newest first. Each entry starts with a heading `## YYYY-MM-DD · Phase/Sprint · Area`, followed by **Changed**, **Why** and **Files** lines (see `CLAUDE.md`). The v1.0 and v1.1 entries further down are older, plan-version entries.

## 2026-10-24 · Sprint 5.3 (part C) · Frames, Sunglasses and frame detail pages

- **Changed:**
  - `/frames` and `/sunglasses`, built from the approved mockups (`frames.html`, `sunglasses.html`, `listing.js`):
    - the client's filters with counts (empty options disabled), OR within a filter and AND across;
    - quick gender chips, active-filter chips and Clear all;
    - sort (sold out always last), "Saved (n)" and "Load more" (24 at a time);
    - the phone filter panel ("Show n frames", Esc closes it, focus stays inside);
    - both empty states and the help band.
    - Every filter is kept in the address, so the mega menu's links (`?for=kids`, `?tier=premium`, `?lens=polarized`, `?brand=…`) land filtered.
  - The frame card (`frame-card.tsx`), reused on the home page in 5.2: photo or frame drawing, price, where it's available, Sold out, heart, and Enquire (branch picker with the frame code in the WhatsApp text).
  - Favourites are saved on the device (`vslm-favourites`, as in the mockups); all hearts on a page stay in step.
  - `/frames/[slug]` and `/sunglasses/[slug]` (from `frame-detail.html`):
    - gallery with thumbnails, arrow keys, swipe and click-to-zoom;
    - title block, Enquire on WhatsApp ("Ask about similar frames" when sold out), heart, Share on WhatsApp (the customer picks the contact), Book an eye test;
    - details table, lens and branch notes (hours from the `branches` table), up to 4 similar frames;
    - `Product` structured data, title "Brand Model · ₹price", Open Graph photo.
    - Pre-rendered from the database. A draft, hidden, wrong-page or unknown frame shows "This frame isn't available", marked `noindex` (status 200 on the production server, because Next.js streams it).
  - Data: `src/lib/queries/catalogue.ts` (approved, active rows only), cached in `src/lib/catalogue-data.ts` under the `catalogue` tag that every staff save already refreshes.
  - CSS: mockup sections 7.1, 7.7, 8 and 9 ported to `src/styles/catalogue.css`, plus a short block for real photos. Five icons were added from the mockup sprite.
  - `next.config.ts` resizes `/media` photos for cards (at most an hour's cache). `site.url` is the `DUMMY` D4 domain, now listed by `check:launch`.
  - The seed now dates its frames newest first, so "Newest" matches the mockup order (the existing dev rows were re-dated in place).
- **Why:** sprint 5.3's last part (`ROADMAP.md`): an approved frame now appears on the public site, and a sold-out frame shows "Sold out". The decisions made while building are in `Requirements_Frames.md` section 8. The mockup's phone filter panel had a navy title on navy in light mode; the live one is white.
- **Files:** `src/app/(site)/frames/page.tsx`, `src/app/(site)/frames/[slug]/page.tsx`, `src/app/(site)/frames/[slug]/not-found.tsx`, `src/app/(site)/sunglasses/` (same three), `src/components/catalogue/` (`catalogue-page.tsx`, `listing.tsx`, `frame-card.tsx`, `frame-text.ts`, `frame-photo.tsx`, `favourites.ts`, `fav-button.tsx`, `gallery.tsx`, `frame-detail.tsx`), `src/lib/queries/catalogue.ts`, `src/lib/catalogue-data.ts`, `src/lib/site-config.ts`, `src/components/site/icons.tsx`, `src/styles/catalogue.css`, `src/app/globals.css`, `src/app/layout.tsx`, `next.config.ts`, `scripts/db-seed.ts`, `tests/catalogue.spec.ts`, `tests/catalogue-query.spec.ts`, `playwright.config.ts`, `docs/requirements/Requirements_Frames.md`, `docs/changelog.md`

## 2026-10-23 · Phase 4 · Logo concepts: presentation boards

- **Changed:** `mockups/logo-concepts.html` is now a presentation deck on navy. It has a cover with the five marks, one board per concept, and a side-by-side board. Each concept board has six panels: primary logo, construction lines, the logo on the website (browser tab, header, hero), a brand line, a shop sign and business card, and icons with the colour swatches. Concepts 1 and 4 have a metallic brass-to-gold rim. A new `concept-4-icon.svg` (the badge without its ring text) is used at icon sizes. Printing the page (Save as PDF, landscape) puts one board on each page.
- **Why:** the developer wanted the concepts designed visually to show the client, not just listed. The brand lines use only the existing wording ("Welcome to the Optical Family", "Care · Love · Quality · Family", "Since 1999"). There's no phone number, domain or price on any board. Still a draft: the site keeps the placeholder (`DUMMY` D8).
- **Checked:** all boards at 1440 and 375 px, with no page overflow and no console errors. Panel padding uses `%`, because `cqw` on the panel itself measures the page rather than the panel.
- **Files:** `mockups/logo-concepts.html`, `mockups/styles.css`, `mockups/assets/logo-concepts/concept-1.svg`, `concept-1-mark.svg`, `concept-4.svg`, `concept-4-mark.svg`, `concept-4-icon.svg` (new), `docs/changelog.md`

## 2026-10-23 · Phase 4 · Logo concepts for the client

- **Changed:** five logo concepts drawn as SVG, each as a mark and a full logo with the name: 1 Lens monogram, 2 Spectacles, 3 Family eye, 4 Heritage badge (the current badge cleaned up, "FAMILY" spelled correctly), 5 Clear vision. A new page, `mockups/logo-concepts.html`, shows each one on cream, on navy, and at header, phone-icon and browser-tab sizes, for the client to pick one on WhatsApp. The SVGs use the design tokens only; their colours switch on navy through `--lg-ink`, `--lg-accent` and `--lg-iris`, with light-background fallbacks.
- **Why:** the developer asked for options to show the client, who asked for a new logo on 2026-10-21 but hasn't sent one. None of them is approved. The site keeps the placeholder (`DUMMY` D8) until the client chooses. The text in the SVGs is live text, so it must be converted to outlines before final use. Concept 4's ring text can't be read at 32 px, so it would need concept 1's monogram as its browser-tab icon.
- **Checked:** all 25 inlined SVGs render at 1440 and 375 px, in light and dark mode. No page overflow at 375 px. No console errors.
- **Files:** `mockups/assets/logo-concepts/concept-1.svg` … `concept-5.svg` and `concept-1-mark.svg` … `concept-5-mark.svg` (new), `mockups/logo-concepts.html` (new), `mockups/styles.css`, `docs/open-questions.md`, `docs/changelog.md`

## 2026-10-23 · Phase 4 · Hydration warning from browser extensions

- **Changed:** added `suppressHydrationWarning` to `<body>` in `src/app/layout.tsx`, as `<html>` already has.
- **Why:** the Grammarly extension adds `data-gr-ext-installed` and `data-new-gr-c-s-check-loaded` to `<body>` before React loads, which showed a hydration mismatch in the dev error panel. It only ignores attribute differences on the `<body>` tag itself, not the page content.
- **Files:** `src/app/layout.tsx`, `docs/changelog.md`

## 2026-10-24 · Sprint 5.3 (part B) · Add, edit and approve frames with photos

- **Changed:**
  - `/admin/frames/new`, `/admin/frames/[code]`, and the same for sunglasses. Built from the approved mockup (`frame-form.tsx`, loaded by `frame-form-page.tsx`):
    - **Photos:** up to 5, Take photo or Choose; resized in the browser to 1600 px WebP; type per photo, with a consent tick for "Model wearing it"; reorder; the first is the cover.
    - **Fields and messages:** every field from Requirements_Admin 6.1, with "Add a new brand / colour"; a live "Code already used by …" check; errors under each field plus a summary.
    - **Buttons by role and status:**
      - staff: Save as draft, Send for approval;
      - admin: Save and publish, or for a waiting frame Approve and publish / Send back with a note;
      - an approved frame: Save changes.
    - **Danger zone:** staff can Hide from site; an admin can Delete, which removes the photo files too.
    - **Safety:** "Leave without saving?" guard; the fields autosave on the device, with "Continue it / Start fresh".
    - **Done screen:** "Add another", which keeps brand, category, gender and branch and suggests the next code.
  - **Server actions** (`frames/actions.ts`):
    - use the same Zod rules (`src/lib/frame-schema.ts`) and check role and status before saving;
    - remove new uploads again if a save fails;
    - every change calls `updateTag("catalogue")`, so the public menu updates at once.
  - **Security:** `staff_delete` on `frame_images`, so staff can remove and reorder photos.
  - **Removed:** the temporary `/admin/upload-test` page, its proxy block and its test.
- **Why:** sprint 5.3 part B. This is the "done when" of the sprint: staff upload on a phone, an admin approves, and only then is it public.
- **Checked:**
  - `tests/frame-form.spec.ts` (5): staff add a frame with 2 photos at 360 px (stored as WebP, the photo is 404 to the public), an admin approves it (photo 200), send back shows the note, plain errors (not a photo, a used code, missing fields), staff see Hide but not Delete, and an admin's delete removes the row and files.
  - Full suite: 88 passed.
  - **Found and fixed:**
    - a test picked a file before React had attached to the input, so it now waits until the form is ready;
    - a bad photo's message showed twice;
    - a lint error in the draft-restore check.
  - **Noted:** one slow full run (8.8 min) gave two timeouts; both passed on a rerun and in the next full run.
- **Files:** `src/app/admin/(staff)/frames/{actions.ts,new,[code]}`, `src/app/admin/(staff)/sunglasses/{new,[code]}`, `src/components/admin/{frame-form,frame-form-page,admin-shell}.tsx`, `src/lib/frame-schema.ts`, `db/security.sql`, `src/proxy.ts`, `tests/frame-form.spec.ts`, `tests/uploads.spec.ts`, `playwright.config.ts`, `docs/requirements/Requirements_Admin.md`, `docs/changelog.md`

## 2026-10-23 · Sprint 5.3 (part A) · Staff area shell, dashboard, frames list

- **Changed:**
  - Staff pages are now in `src/app/admin/(staff)/` with the shell from the mockup (`admin-shell.tsx`):
    - top bar and sidebar (a drawer on phones);
    - the admin's branch switcher, saved in a cookie; staff see their own branch;
    - menu counts and the phone "Add frame" button.
  - Real dashboard (Requirements_Admin 5): to-do cards, quick actions, today's bookings with status, approval queue (admin) or own frames (staff), branch card, recent changes, "On the site now".
  - `/admin/frames` and `/admin/sunglasses`: search, filters and a one-tap Sold out toggle that updates the public site (`updateTag("catalogue")`).
  - Sections from later sprints show "arrives in sprint …".
  - The staff CSS (mockup sections 13 and 17) is ported into `src/styles/forms.css` and `admin.css`.
  - Shared `ThemeToggle`; staff names are read through the login connection (`staff-directory.ts`).
- **Found and fixed:**
  - My CSS cleaner deleted a grouped phone rule, causing 105 px of overflow at 360 px. It now removes only the mockup selector.
  - A stale dev-server cache served old CSS; clearing `.next/dev` fixed it.
  - Streamed staff pages can't send a 404 status, so the upload test page is now blocked in `src/proxy.ts` in production.
  - Note: in a hidden browser pane React's reveal waits for a repaint, which only affects manual checks.
- **Checked:** `npm test` passes 84 tests, including the new `tests/admin-shell.spec.ts` at 360, 768 and 1440 px. In the browser: the toggle saves to the database, and the branch switch persists.
- **Files:** `src/app/admin/(staff)/*`, `src/components/admin/*`, `src/components/theme-toggle.tsx`, `src/lib/queries/admin.ts`, `src/lib/admin-branch.ts`, `src/lib/staff-directory.ts`, `src/lib/auth.ts`, `src/proxy.ts`, `src/styles/{admin,forms,site-chrome}.css`, `src/app/globals.css`, `tests/*`, `playwright.config.ts`, `docs/changelog.md`

## 2026-10-23 · Sprint 5.1 · White menu bar in light mode (proposal)

- **Changed:**
  - In light mode the main menu bar is white with navy text and logo name. The gold underline stays, but the current item's text is navy and the WhatsApp and sun icons are navy-2 (gold on white is too faint to read).
  - The search panel is cream with a white field.
  - Unchanged: dark mode stays navy, and so do the utility strip, phone menu and footer.
  - Done with new `--nav-*` colour roles in `globals.css` and one marked override block in `src/styles/site-chrome.css`, so it's a one-block revert.
- **Why:** the developer's idea, to show the client. The approved mockup is navy, so it's listed in `docs/open-questions.md` and marked "client to confirm" in `CLAUDE.md` and `Requirements_Navigation.md`.
- **Checked:**
  - In the browser: light mode at 1440 px (white bar, navy text, gold underline) and 375 px (white bar, navy menu icon, no overflow); dark mode still navy.
  - The phone menu header and footer stay white-on-navy. No console errors.
  - `npm test`: 69 passed.
- **Files:** `src/app/globals.css`, `src/styles/site-chrome.css`, `CLAUDE.md`, `docs/requirements/Requirements_Navigation.md`, `docs/open-questions.md`, `docs/changelog.md`

## 2026-10-23 · Sprint 5.1 · Layout: utility bar, navigation, mega menus, phone menu, sticky bar, footer

- **Changed:**
  - Public pages now live in the `src/app/(site)/` route group with a shared layout (the staff area keeps its own). Built from the signed-off mockups and `Requirements_Navigation.md`:
    - **Utility bar:** Since 1999, hours, each branch's call link, "2 branches", Book an eye test; a shortened strip on phones.
    - **Navigation:** the 8 items in the client's order with the gold underline on the current section; mega menus open on hover, click or keyboard and close on Esc, mouse-out or a click outside.
    - **Theme and search:** the light/dark toggle (remembered, no flash); the search panel (results page in 5.6).
    - **Phone and tablet menu:** full screen, + / − one section at a time, scroll locked, focus kept inside.
    - **Sticky bar:** Call / WhatsApp / Book test.
    - **Branch picker:** one picker for the whole site.
    - **Footer:** both branches, quick links, social links, privacy link.
  - **Data:**
    - Branches, menu brands and "from ₹" prices are read from the database (approved, active rows only) and cached with tags for instant refresh after admin edits.
    - A tier with no products is hidden (never ₹0).
    - The seed now includes the mockups' DUMMY lens catalogue.
  - **Styles:** the mockup's header and footer CSS is ported unchanged (`src/styles/site-chrome.css`); the remaining tokens are added to `globals.css`.
  - **Dummy safety:**
    - `site-config.ts` has a DUMMY register (D2, D5, D8, C7).
    - `<DummyTag>` shows only in development.
    - A placeholder phone number never works as a link.
    - New `npm run check:launch` fails while any placeholder remains (currently 14 items).
  - **Tests:** `tests/layout.spec.ts` (16 checks across 360 / 768 / 1440) and `tests/menu-data.spec.ts` (3).
- **Why:** sprint 5.1, the first build sprint. Every later page sits inside this layout.
- **Checked:**
  - `npm test`: 69 passed (the 46 earlier ones too). The 16 skipped are width-specific.
  - In the browser at 1440 and 375 px:
    - the header, the Frames mega menu (database brands, "Premium from ₹3,290"), the phone menu and the sticky-bar WhatsApp picker all match the mockups;
    - DUMMY tags show beside placeholder values only.
  - **Found and fixed:**
    - the CSS port skipped a comment's opening line, which broke the dev build; the production build had only warned and silently dropped the header styles;
    - a footer-year `<script>` caused a hydration mismatch and was replaced with a small client component;
    - a lint error (state reset in an effect) was moved to React's render-time pattern.
- **Files:** `src/app/(site)/*`, `src/components/site/*`, `src/styles/site-chrome.css`, `src/app/globals.css`, `src/lib/site-config.ts`, `src/lib/queries/site.ts`, `src/lib/site-data.ts`, `scripts/db-seed.ts`, `scripts/launch-check.ts`, `public/logo-placeholder.svg`, `tests/layout.spec.ts`, `tests/menu-data.spec.ts`, `playwright.config.ts`, `package.json`, `CLAUDE.md`, `docs/requirements/Requirements_Navigation.md`, `docs/ai-fluency-log.md`, `docs/changelog.md`

## 2026-10-23 · Phase 4 · Step 6: automated tests; Phase 4 complete

- **Changed:**
  - **`npm test`:**
    - Playwright builds the app and runs its own production server on port 3100;
    - global setup and teardown make and delete throwaway accounts with random passwords;
    - one worker, with the rate-limit test last.
  - **46 tests:**
    - `db-security.spec.ts` (18): every table has forced row-level security; the website's user can't bypass it; public, staff and admin rules, in rolled-back transactions.
    - `admin-auth.spec.ts` (9): redirects, noindex and robots, no sign-up, staff and admin sign-in and sign-out, a cross-site sign-out refused (CSRF), forged cookie, switched-off account, identical "wrong details" messages, the real limit of 5 a minute.
    - `uploads.spec.ts` (9): file-type and size rules, traversal paths, `/media` visibility for the public and staff, the upload test page is a 404 in production.
    - `ui.spec.ts` (3 × 3 widths): no overflow, fonts and colours, error message, sign-in and sign-out, Back after sign-out, no redirect to other sites.
    - `rate-limit.spec.ts` (1).
  - **Security fix 1, sign-in limit:** a browser could dodge it by sending a new fake `X-Forwarded-For` on every try (7 wrong passwords, no block). No IP header is trusted now unless `TRUSTED_IP_HEADER` is set at deployment. The test server's limit is raised with `E2E_SIGNIN_LIMIT` (tests only); the real limit of 5 has its own test.
  - **Security fix 2, Back after sign-out:** the Back button showed the dashboard (name and counts) from Next.js's in-page memory. Sign out is now a button that loads the login page fresh, replacing the `signOut` server action (`src/app/admin/actions.ts` removed).
  - `.env.example` documents `TRUSTED_IP_HEADER`; `tests/.auth/` is gitignored.
  - Phase 4 is marked complete in `CLAUDE.md` and `ROADMAP.md`.
- **Why:** Phase 4 step 6. Foundation is "done when" a public request can't read private data and the admin can sign in; both are now proven by tests that run on every change.
- **Checked:**
  - **Fixes:** both were reproduced before fixing and pass after: 7 spoofed-IP attempts now get 429 from the 6th; Back lands on the login page with no staff data.
  - **Test mistakes fixed on the way:** React's `<!-- -->` text markers; Next.js's own `role="alert"` route announcer; a sign-out test without an `Origin` header (correctly refused by CSRF protection); and a Back test that landed on a blank page and would have passed without proving anything.
  - **Result:** the full suite passes (46/46). Afterwards there are no test accounts, rows or files left. The 2 files in `uploads/` are the developer's own upload-test photos.
- **Files:** `playwright.config.ts`, `tests/*.ts`, `src/lib/auth-options.ts`, `src/app/admin/sign-out-button.tsx`, `src/app/admin/page.tsx`, `src/app/admin/actions.ts` (removed), `package.json`, `.gitignore`, `.env.example`, `CLAUDE.md`, `ROADMAP.md`, `docs/ai-fluency-log.md`, `docs/changelog.md`

## 2026-10-23 · Phase 4 · Temporary upload test page

- **Changed:**
  - Added `/admin/upload-test`, a temporary page:
    - signed-in staff only, and a 404 when the app runs in production;
    - any file can be uploaded; it's saved through `saveUpload()` as a **hidden** gallery photo and shown back through `/media/`;
    - an admin can delete each one (row and file).
  - Linked from the `/admin` placeholder on the laptop only.
  - `next.config.ts`: server-action and proxy body limits raised from 1 MB to 12 MB, so a 10 MB photo reaches our own check.
- **Why:** the developer wanted to try uploads before the frame form exists. It also tests `saveUpload()` end to end, which step 5 couldn't. Remove the `src/app/admin/upload-test/` folder in sprint 5.3.
- **Checked** (throwaway admin account, in the browser):
  - a real PNG is saved and displays;
  - a text file named `fake.jpg` gets "This file isn't a photo. Use JPG, PNG or WebP.";
  - an 11 MB file gets "This photo is too large (max 10 MB).";
  - Delete removes the row and the file (`/media` then returns 404).
  - Test account and files removed afterwards (0 files in `uploads/`). Lint and types are clean.
- **Files:** `src/app/admin/upload-test/{page.tsx,actions.ts,upload-form.tsx,constants.ts}`, `src/app/admin/page.tsx`, `next.config.ts`, `docs/changelog.md`

## 2026-10-23 · Phase 4 · Step 5: photo uploads

- **Changed:**
  - **`src/lib/upload-rules.ts`:**
    - reads the real file type from the first bytes (JPEG, PNG, WebP only);
    - enforces the 10 MB limit, with the plain error messages from the requirements;
    - allows only stored paths shaped `bucket/<uuid>/<uuid>.ext`, so no request can reach a file outside `uploads/`.
  - **`src/lib/storage.ts` (server-only):** `saveUpload()` needs the signed-in staff member, re-checks type and size, saves under a random name and never overwrites. Also `readUpload()` and `deleteUpload()`.
  - **`/media/[...path]`:** serves a photo only if its row is visible to the person asking, using row-level security with their role. Public photos are cached for an hour; staff previews of drafts are `no-store`. Sent with `nosniff`.
  - **Also:** `suppressHydrationWarning` on `<body>`, because Grammarly adds attributes there before React loads, which showed a dev-only hydration warning.
  - **Requirements_Admin 6.2:** the server refuses HEIC; the browser converts it.
- **Why:** Phase 4 Foundation, step 5 of the approved plan.
- **Checked:**
  - **Rules (21 checks, all pass):** real JPEG/PNG/WebP accepted; a text file renamed `.jpg`, an SVG with a script, an HTML page, GIF, HEIC and empty files refused; 10 MB accepted, 10 MB + 1 byte refused; 8 path-traversal and wrong-format paths refused.
  - **`/media` over HTTP:** 13 of 14 checks passed as written:
    - the public gets an approved frame's photo (correct type, cacheable, nosniff), but 404 for a draft's photo, a hidden gallery photo, a file with no row and a row with no file;
    - a throwaway staff account sees the draft and hidden photos, uncached.
  - The 14th failed only because the test expected 404 and Next.js answered 400 for an encoded `..%2F`. Re-checked by hand: four encoded traversal attempts were all refused (400/404) with no secrets in the body.
  - The test account and test files were removed. Lint and types are clean.
  - **Not yet tested:** `saveUpload()` itself. It runs end to end once the frame form exists (sprint 5.3).
- **Files:** `src/lib/upload-rules.ts`, `src/lib/storage.ts`, `src/app/media/[...path]/route.ts`, `src/app/layout.tsx`, `docs/requirements/Requirements_Admin.md`, `CLAUDE.md`, `docs/changelog.md`

## 2026-10-23 · Phase 4 · Step 4: staff login

- **Changed:**
  - **Better Auth server** (`src/lib/auth.ts`): connects as `vslm_auth`. Endpoints at `src/app/api/auth/[...all]/route.ts`. Sign-up is off; 12-hour sessions; 5 sign-in attempts a minute.
  - **Login page** `/admin/login`: a card in the design tokens, with plain error messages (wrong details, too many attempts, account switched off). The return path only allows `/admin…`, so it can't send people to another site.
  - **Gate** (`src/proxy.ts`): no session cookie means a redirect to login. **Real check** (`src/lib/session.ts`): `requireStaff()` against the database, refusing banned or role-less accounts.
  - **Temporary `/admin`:** name, role and branch, two counts read with the signed-in role, and Sign out (a server action). The `/admin` area is noindex, and `robots.ts` disallows `/admin` and `/api/`.
  - **`npm run staff:create`:** creates the first admin, or resets a password and signs that person out everywhere.
  - **Other:** a shared `scripts/prompt.ts`; `.env.example` lists the variable names.
- **Why:** Phase 4 Foundation, step 4 of the approved plan. Admin sign-in is half of the Foundation "done when".
- **Checked:**
  - Throwaway test accounts (staff, admin, a banned one), with random passwords that were never displayed; 14 HTTP checks, all pass:
    - signed out → redirect to login;
    - public sign-up refused (400);
    - staff and admin sign in, see their own name and role, and read 4 drafts with their role;
    - after sign-out the old cookie shows nothing;
    - a forged cookie passes the proxy but gets no dashboard;
    - the banned account gets 403;
    - the 6th attempt in a minute gets 429.
  - In the browser at 375 px: wrong password shows the message; correct password opens the dashboard; Sign out returns to login and Back doesn't reveal the dashboard; light and dark mode; no overflow.
  - Test accounts deleted afterwards (0 users, 0 sessions). Lint, types and build clean.
  - Fixed: the branch showed as a lowercase slug, and the `/admin` tab title missed "staff area" (a layout's title template doesn't apply to its own page).
- **Files:** `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/lib/session.ts`, `src/proxy.ts`, `src/app/api/auth/[...all]/route.ts`, `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`, `src/app/admin/actions.ts`, `src/app/admin/login/page.tsx`, `src/app/admin/login/login-form.tsx`, `src/app/robots.ts`, `scripts/staff-create.ts`, `scripts/prompt.ts`, `scripts/db-setup.ts`, `.env.example`, `package.json`, `CLAUDE.md`, `docs/requirements/Requirements_Admin.md`, `docs/changelog.md`

## 2026-10-22 · Phase 4 · Steps 1 and 3: local PostgreSQL, schema and security

- **Changed:**
  - **Step 1 (developer):** installed PostgreSQL 17. `npm run db:setup` created `vslm_dev` and the users `vslm_owner`, `vslm_app` and `vslm_auth`. They have generated passwords, `NOBYPASSRLS`, and live in a gitignored `.env.local`.
  - **Schema:** `src/db/schema.ts` defines 13 app tables from the requirement files, with checks built in: price range, 5 frame photos, 12 camp photos, consent for photos of people, valid times, field lengths. Migration: `db/migrations/0000_init.sql`.
  - **Login tables:** created by Better Auth's own migration; settings in `src/lib/auth-options.ts` (no sign-up, 12-hour sessions DUMMY C22, 5 sign-in attempts a minute).
  - **Security (`db/security.sql`):**
    - Row-level security is enabled and forced on all 17 tables, keyed on `app.role`, with public / staff / admin policies.
    - Only an admin edits branches and closed days; a trigger refuses approval by anyone but an admin.
    - Login tables are reachable only by `vslm_auth`.
    - `slot_counts()` returns booking counts only.
  - **Access:** `src/lib/db.ts` `withRole()` is the website's only way into the database (server-only).
  - **Data:** `npm run db:seed` loads the mockups' DUMMY data: 2 branches, 46 approved frames and sunglasses plus 4 drafts, 7 camps, 3 testimonials.
  - `package.json` is now `"type": "module"`, which silences a Node warning.
- **Why:** Phase 4 Foundation, steps 1 and 3 of the approved plan.
- **Checked:** connected as the website's user (`vslm_app`), 24 checks all pass. Examples:
  - **Public:** sees 46 approved frames and 0 drafts; reads 0 bookings and 0 enquiries; can add a booking but can't read it back (even with `RETURNING`) or change it; is refused on login tables.
  - **Staff:** can't approve or delete; can edit an approved frame's price.
  - **Admin:** can approve, delete and edit branches, but still can't read login tables.
  - **Other:** a request with no role is treated as public; slot counts return only "10:00 → 1".
  - The migration re-runs cleanly; lint and types are clean.
- **Files:** `src/db/schema.ts`, `db/migrations/*`, `db/security.sql`, `src/lib/db.ts`, `src/lib/auth-options.ts`, `scripts/env.ts`, `scripts/db-setup.ts`, `scripts/db-migrate.ts`, `scripts/db-seed.ts`, `drizzle.config.ts`, `package.json`, `tsconfig.json`, `CLAUDE.md`, `docs/ai-fluency-log.md`, `docs/changelog.md`

## 2026-10-21 · Phase 4 · Step 2: Next.js app scaffold

- **Changed:**
  - Scaffolded the app at the repo root with Next.js 16.4 (App Router, TypeScript, Tailwind v4, ESLint, Cache Components).
  - Ported the design tokens and light/dark colour roles from `mockups/styles.css` into `src/app/globals.css`. Tailwind's default palette is removed, so only token colours exist as utilities (`bg-navy`, `bg-surface`, `text-heading`, …). Base styles sit in `@layer base`, so utilities win.
  - Fonts via `next/font`: Inter and Plus Jakarta Sans 800. A no-flash `vslm-theme` script runs in `<head>`.
  - Added `src/lib/site-config.ts` (seed shop facts; Patelguda number `DUMMY` D2) and a temporary foundation-check home page.
  - Installed the planned packages (drizzle-orm, pg, better-auth, zod, server-only; dev: drizzle-kit, @types/pg, @playwright/test).
  - Added the `app` preview config. `.gitignore` gains `uploads/`; `mockups/` is excluded from TypeScript and ESLint.
- **Why:** Phase 4 Foundation, step 2 of the approved plan.
- **Checked:** `npm run lint`, `tsc` and `npm run build` are clean. In the browser: fonts and token colours correct in light and dark mode, no overflow at 375 px, no console errors. Found and fixed a base heading colour overriding `text-white`.
- **Files:** `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts`, `AGENTS.md`, `src/app/*`, `src/lib/site-config.ts`, `.gitignore`, `.claude/launch.json`, `CLAUDE.md`, `docs/changelog.md`

## 2026-10-21 · Phase 4 · Stack: local PostgreSQL instead of Supabase

- **Changed:**
  - The stack no longer uses Supabase:
    - Database: PostgreSQL 17 on the developer's laptop (`vslm_dev`), with Drizzle for the schema and migrations.
    - Staff login: Better Auth, with `admin` / `staff` roles and no sign-up.
    - Photos: local `uploads/` folders behind `src/lib/storage.ts`.
    - Hosting: local for now.
  - Security model: the browser never talks to the database; server code uses `withRole()`. Separate database users (`vslm_owner`, `vslm_app`, `vslm_auth`) and forced row-level security on every table, keyed on the request role.
  - Updated `CLAUDE.md` (stack, data security, folder rules), `ROADMAP.md` Foundation, and the Admin, Booking and Privacy requirements (no reset emails in the MVP; the hosting provider is named once deployment is decided). Mockup comments now say "the database".
- **Why:** developer decision: everything on DigitalOcean eventually, and run the whole project on the laptop first. Deployment is out of scope for now.
- **Files:** `CLAUDE.md`, `ROADMAP.md`, `docs/requirements/Requirements_Admin.md`, `Requirements_Booking.md`, `Requirements_Privacy.md`, `mockups/privacy.html`, `mockups/about.html`, `mockups/admin.html`, `mockups/home.html`, `mockups/lenses.html`, `mockups/camps-data.js`, `mockups/frames-data.js`, `mockups/listing.js`, `docs/changelog.md`

## 2026-10-21 · Phase 4 · Hosting: Netlify → DigitalOcean

- **Changed:**
  - Hosting is now DigitalOcean App Platform (auto-deploy from `main`) instead of Netlify, in `CLAUDE.md`, `ROADMAP.md`, the privacy requirements and mockup ("service providers"), and the 404 requirements. Old-URL redirects now go in the Next.js config, not `netlify.toml`.
  - Removed the `.netlify/` ignore rule.
  - The preview deploy moves out of Foundation; it now happens before sprint 5.1 ends.
- **Why:** the developer learned the site will be deployed on DigitalOcean, and decided to skip the deploy for now. App Platform is assumed, as the closest match to the old setup; change the wording if it's a Droplet.
- **Files:** `CLAUDE.md`, `ROADMAP.md`, `docs/requirements/Requirements_Privacy.md`, `docs/requirements/Requirements_NotFound.md`, `mockups/privacy.html`, `.gitignore`, `docs/changelog.md`

## 2026-10-21 · Phase 3 → 4 · Mockups signed off

- **Changed:** Phase 3 is complete and Phase 4 (Foundation) begins.
  - All 14 requirement files are now "Approved by the client 2026-10-21". Privacy still needs a legal review of its wording before launch.
  - `CLAUDE.md` status now says Phase 4, and the mockups are described as the approved design.
- **Why:** the client reviewed every mockup live with the developer on Google Meet (screen share). The changes they asked for were applied (previous entry) and they approved the result. `review.html` wasn't sent, since the review happened live. Missing client details stay `DUMMY` (see `docs/dummy-data.md`, `docs/open-questions.md`) and must be replaced before launch. They don't block Foundation.
- **Files:** `CLAUDE.md`, `docs/requirements/*.md` (status lines), `docs/changelog.md`

## 2026-10-21 · Phase 3 · Mockups: client changes (menu, logo, branches, eye camps)

- **Changed:** the client's change list ("changes to the mockups.txt"), clarified with the developer:
  - **Menu:** a "Home" item was added and the order is now Home · About · Frames · Sunglasses · Lenses · Eye care · Eye camps · Contact (desktop, phone menu and footer quick links). Menu labels no longer wrap at 1180 px.
  - **Logo:** the client is sending a new logo. Until it arrives, every page uses `mockups/assets/logo-placeholder.svg` (`DUMMY` D8) instead of `docs/logo.png`.
  - **Branches in admin:** a sidebar branch switcher (the admin picks Indresham or Patelguda; staff see their own branch) shows the address. The dashboard has a branch-details card, and bookings are filtered to that branch by default. There's a new `admin-branches.html` (`/admin/branches`, admin only) for editing each branch's address, phone, WhatsApp, hours, open days and visibility, with validation.
  - **Customer address:** an optional "Your area or address" field on the booking and contact forms (consent text updated). The admin booking rows show it.
  - **Eye camps in admin:** a new `admin-camps.html` (`/admin/eye-camps`) with the upcoming/past list and the add/edit form, including the after-camp people count and photos.
  - `admin.js`: branch data, routes for the new pages, and `guard(go, stay)`, so a cancelled branch switch puts the select back.
- **Why:** client feedback on the mockups. Branch details now come from the `branches` table, which the admin edits, instead of only `site-config.ts`. The optional address field goes against the earlier data-minimisation rule in `Requirements_Booking.md`, so it's optional, named in the consent text and listed as an open item.
- **Checked:**
  - Menu order and the current item at 1440, 1180 and 375 px.
  - Branch switching updates the sidebar, the dashboard and the booking filter. The branch and camp forms show errors with a summary. The staff view is read only.
  - No page-level overflow at 375 and 768 px on the dashboard, Branches, Eye camps (list, new, past), Booking, Contact, Home and About. Light and dark mode. No console errors.
- **Files:** `mockups/site.js`, `mockups/admin.js`, `mockups/admin.html`, `mockups/admin-frame.html`, `mockups/admin-branches.html` (new), `mockups/admin-camps.html` (new), `mockups/assets/logo-placeholder.svg` (new), `mockups/book-eye-test.html`, `mockups/contact.html`, `mockups/review.html`, `mockups/styles.css`, `CLAUDE.md`, `docs/requirements/Requirements_Navigation.md`, `docs/requirements/Requirements_Admin.md`, `docs/requirements/Requirements_Booking.md`, `docs/requirements/Requirements_Contact.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Client review pack

- **Changed:** added `mockups/review.html`, a page for the client (not part of the website):
  - **How to review:** phone and computer, review notes, what "DUMMY" means, light / dark mode.
  - **15 page cards:** the 13 customer and other pages (Menu counted as one), plus the staff dashboard and the add-frame form. Each has links, 1–3 numbered questions, a "Looks good / Needs changes" choice and notes. Saved only in the reviewer's browser (`vslm-review`).
  - **Decisions we made:** 13 items, marked Website or Later phase.
  - **Information still needed:** 19 items before launch and 8 for the later shop system, from `docs/dummy-data.md` and `docs/open-questions.md`.
  - **Feedback:** a sticky bar with a count, "Copy feedback" and "Send feedback on WhatsApp", which opens WhatsApp with the reviewer's answers so they choose who to send it to.
  - **Shared files:** `styles.css` gets a "Client review pack" section, including a print style. `CLAUDE.md` mentions the pack.
- **Why:** Phase 3 ends with client sign-off. One page lets the shop owner try every mockup and answer the open questions in one go.
- **Checked:**
  - All 18 links resolve. Feedback saves, survives a reload and builds the WhatsApp text.
  - At 360 px in dark mode: no overflow (strict `clientWidth` check), targets at least 36 px, the feedback bar made compact.
  - The home section order in the questions was checked against `home.html`.
- **Files:** `mockups/review.html`, `mockups/styles.css`, `CLAUDE.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: full-width check on every page

- **Changed:**
  - Re-checked every mockup for content wider than the screen, with the stricter method from the 404 work: real 360 and 768 px frames emulating a phone, measured against `clientWidth`, across the whole page (header and footer included). Intentional off-canvas parts (drawer, mega menus, search, branch picker) and horizontal scrollers (the home frame carousel) are excluded.
  - Fixed the "not found" icons on Frame detail and Camp detail: they took 150 px of height (the SVG default). Glasses are now 120 × 50 and the camp icon 72 × 72, the same as the 404 page.
- **Why:** the earlier check could miss overflow on phones (`docs/ai-fluency-log.md`, 2026-10-10).
- **Checked:**
  - 40 page-and-width checks, all passing with no page-level scroll: Home, Frames, Sunglasses, Frame detail (and not found), About, Lenses, Eye care, Book an eye test, Eye camps, Camp detail (and not found), 404 (and error), Privacy, Contact, Gallery, Admin dashboard, and Admin frame form (new and review), each at 360 and 768 px.
  - A first run inside a desktop tab gave false alarms (a 15 px desktop scrollbar made the width 345 px); it was repeated with phone emulation.
- **Files:** `mockups/styles.css`, `mockups/camp-detail.html`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: 404 and error page

- **Changed:** added `mockups/404.html` (`Requirements_NotFound.md`, approved):
  - **404:** "This page is a little out of focus." with a search field, four "where to next" cards (Frames, Sunglasses, Book an eye test, Visit a branch), WhatsApp help prefilled with the missing address, and "Back to home".
  - **Smart hints:** removed frames and sunglasses ("isn't available", "See all frames / sunglasses" first) and missing camps.
  - **Error page:** "Something went wrong on our side." with Try again, Call and WhatsApp, and no technical details.
  - **Mockup:** `?path=` stands in for the missing address and `?state=error` shows the error page; a review panel links to each state.
  - **Shared files:** `styles.css` gets a "Page not found" section (reuses `.notfound` and the quick cards).
- **Why:** dead links and failed loads should lead back to frames, a booking or the shop, not a dead end; this matches the existing frame and camp "not available" rules.
- **Checked:** in the browser:
  - all five states (titles, headings, card order, WhatsApp text); search text escaped;
  - 1440 px light, 360 px dark;
  - no console errors.
  - A real 7 px overflow at 360 px was found and fixed (headline column). The overflow check was corrected to use `clientWidth` and re-run on the 404, Privacy, Contact, Gallery and admin pages; all fit (see `docs/ai-fluency-log.md`).
- **Files:** `mockups/404.html`, `mockups/styles.css`, `docs/requirements/Requirements_NotFound.md`, `docs/ai-fluency-log.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: Privacy policy

- **Changed:** added `mockups/privacy.html` (`Requirements_Privacy.md`, approved):
  - a hero with "Last updated", an "In short" box, a contents list (sticky on desktop with the current section highlighted; collapsible on phones, closing after a tap);
  - plain-English sections: who we are, what we collect and why (a table that stacks on phones), how we use it, who can see it, how long we keep it, your rights under the DPDP Act 2023, children, keeping it safe, changes, contact;
  - a contact card with WhatsApp / Call (branch picker) and the email; a print style.
  - **Shared files:** `site.js` routes `/privacy`, so the footer link and the consent links on the booking and contact forms open it; `styles.css` gets a "Privacy" section; shared branch action buttons raised from 40 to 44 px (also on Home, Contact and Booking).
  - **Dummy data:** new C23 (privacy contact person, 30-day reply); D9 retention and D1 email shown tagged.
- **Why:** every form links to `/privacy` (DPDP consent); the page must list exactly what the site collects. The wording still needs a legal check before launch.
- **Checked:** in the browser:
  - The contact form's consent link and the footer link open it.
  - Every contents link lands below the sticky header and highlights the right section.
  - At 360 px in dark mode: contents collapsed, table stacked, no horizontal scroll, buttons 44 px.
  - The listed browser storage keys (`vslm-theme`, `vslm-favourites`) match the public mockups' code.
- **Files:** `mockups/privacy.html`, `mockups/site.js`, `mockups/styles.css`, `docs/requirements/Requirements_Privacy.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: Admin dashboard and add-frame form

- **Changed:** added the staff area mockups (`Requirements_Admin.md`, approved):
  - **`mockups/admin.js`:** its own shell instead of `site.js`: navy top bar (role, branch, theme toggle, View site, Sign out), sidebar with counts (a drawer on phones, inert when closed), "Add frame" button on phones, a mockup-only "View as Staff / Admin" switch, DUMMY drafts shared by both pages, and an unsaved-changes guard.
  - **`mockups/admin.html` (dashboard):** greeting; to-do cards (waiting for approval or your drafts, bookings today, new enquiries); quick actions; today's bookings with a branch filter, Call / WhatsApp and a status menu; the admin's approval queue or the staff member's drafts with the admin's note; recent changes; "On the site now" counts.
  - **`mockups/admin-frame.html` (add / edit / review):** up to 5 photos from the camera or gallery, resized in the browser to 1600 px WebP before upload, with type and size checks, progress, photo type, cover, reorder, remove with Undo, and a permission tick for "Model wearing it"; all frame fields (sunglasses lens fields when the category is Sunglasses); live duplicate-code check; actions by role and status (Save as draft / Send for approval; Send back with a note / Approve and publish; Save changes; Delete for admin, Hide from site for staff); autosave on the device with "Continue it"; "Add another frame" keeps brand, category, gender and branch.
  - **Shared files:** `styles.css` gets a "Staff area" section; `CLAUDE.md` lists `admin.js` in the mockups table.
  - **Dummy data:** C22 (accounts, session length, edit rule) and DUMMY customers with unusable numbers.
- **Why:** the last two of the 14 plan mockups (sprints 5.3–5.5); staff upload from a phone (Q36) and an admin approves (Q37).
- **Checked:** in the browser:
  - Desktop: the queue opens a draft in review mode; Send back refuses an empty note and lands on the result; the status menu and branch filter work; dummy numbers never dial.
  - As staff: an empty submit lists all 9 errors; a non-photo and an 11 MB file are refused; a 3000×2000 photo becomes 1600×1067 (333 KB → 39 KB); a duplicate code is caught; "Model wearing it" without permission is blocked; Send for approval works; the leave guard and "Continue it" work.
  - Approved frames: reorder keeps focus, remove + Undo; staff Hide and admin Delete ask first.
  - At 360 px in dark mode: no horizontal scroll, targets at least 44 px, the drawer opens and closes with Esc.
  - No console errors apart from Chrome blocking the leave prompt during scripted reloads.
- **Files:** `mockups/admin.js`, `mockups/admin.html`, `mockups/admin-frame.html`, `mockups/styles.css`, `CLAUDE.md`, `docs/requirements/Requirements_Admin.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: Contact

- **Changed:** added `mockups/contact.html` (`Requirements_Contact.md`, approved):
  - a hero, three quick cards (WhatsApp, Call, Book an eye test);
  - two branch cards (`#branches`, `#indresham`, `#patelguda`): address, hours, holiday note, services, "Open now / Closed now" in India time, and Directions, Call and WhatsApp for each branch's own number; maps load only when scrolled into view or tapped;
  - an enquiry form (name, mobile, branch, topic, message, reply by, consent, spam trap) with an error summary, a server-error preview and a thank-you state that shows only what was just sent;
  - prefill from a frame (`?topic=frames&frame=VSF-1024`), invalid values ignored;
  - a small FAQ, a CTA band and `OpticianStore` structured data (Patelguda phone left out while DUMMY).
  - **Shared files:** `site.js` routes `/contact`; `styles.css` gets a "Contact" section (3-column quick cards, open/closed status, select field, form side notes).
  - **Dummy data:** new C21 (enquiry reply time).
- **Why:** sprint 5.4 contact page; WhatsApp stays the primary contact (Q154), the form is the fallback.
- **Checked:** in the browser:
  - Home's "Visit a store" lands on `#branches` with Contact highlighted in the menu;
  - an empty submit lists all 5 errors and focuses the summary; a valid send shows the thank-you state; "Either" opens the branch picker, a dummy branch never dials;
  - the server-error preview keeps the entered details; a prefilled message alone is rejected;
  - at 360 px in dark mode: one column, no horizontal scroll, sticky bar shown, readable;
  - no console errors.
- **Files:** `mockups/contact.html`, `mockups/site.js`, `mockups/styles.css`, `docs/requirements/Requirements_Contact.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: Gallery

- **Changed:** added `mockups/gallery.html` (`Requirements_Gallery.md`, approved):
  - a hero with the Home › About › Gallery breadcrumb (About highlighted in the menu);
  - tag chips with counts (only tags that have photos; kept in `?tag=`);
  - a 3-column grid (2 on phones) with a large first photo, 24 per "Load more";
  - the large view staying within the current tag;
  - a consent note with an "ask to remove a photo" WhatsApp link;
  - a call to action.
  - **Data:** 28 DUMMY photos (C20); customer photos labelled "only with permission (Q146)".
  - **New shared `mockups/lightbox.js`:** the `<dialog>` large view with caption, meta, "n of m", arrows, swipe, Esc and focus return. `camp-detail.html` now uses it instead of its own copy.
  - **Shared files:** `site.js` routes `/gallery`; `styles.css` gets a "Gallery" section.
- **Checked:** in the browser:
  - About's "View the gallery" opens it; the tag filter and URL work;
  - "Load more" brings 24 up to 28; the large view wraps within a tag and returns focus;
  - camp detail still works on the shared view;
  - on phones, 2 columns and a full-width large view; dark mode readable;
  - no horizontal scroll and no console errors.
- **Files:** `mockups/gallery.html`, `mockups/lightbox.js`, `mockups/camp-detail.html`, `mockups/site.js`, `mockups/styles.css`, `docs/requirements/Requirements_Gallery.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Requirements: Gallery (draft)

- **Changed:** added `docs/requirements/Requirements_Gallery.md`:
  - **Photo data:** image, tag, caption (also used as alt text), branch, date, plus a people/consent check that blocks the upload without consent.
  - **Tag chips:** with counts, kept in `?tag=`.
  - **Grid:** a 3- or 2-column grid with a featured first photo and load more.
  - **Large view:** a shared `<dialog>` view (the same as the camp gallery).
  - **Consent note:** with a "ask to remove a photo" WhatsApp link.
  - **Other:** empty states and a call to action.
  - Added `DUMMY` C20 (gallery).
- **Why:** this is the next page in the plan's mockup order. Customer photos depend on permission the client hasn't confirmed yet (Q146).
- **Files:** `docs/requirements/Requirements_Gallery.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: Eye camps (listing and detail)

- **Changed:** added `mockups/eye-camps.html` and `mockups/camp-detail.html` (`Requirements_EyeCamps.md`, approved), plus `mockups/camps-data.js` (DUMMY C19 camps and helpers).
  - **Listing:**
    - hero with a totalled stat line ("5 camps · 461 people checked");
    - the next camp with a date block, facts, what's offered, Directions, Add to calendar (`.ics`) and Share on WhatsApp;
    - more upcoming camps as rows;
    - past camps with year chips (from the data, kept in `?year=`) and load more;
    - a "Bring a camp to your community" WhatsApp band and a call to action.
  - **Detail:**
    - an Upcoming / Past badge;
    - upcoming: what's offered, what to bring, the actions, a WhatsApp question and `Event` structured data;
    - past: participants and a photo gallery with a `<dialog>` large view (arrow keys, swipe, Esc, focus returns to the photo);
    - more camps, and a not-available state.
  - **Rule:** upcoming vs past comes from the date.
  - **Shared files:** `site.js` routes `/eye-camps` and `/eye-camps/<slug>` (so the home page's camp link works), and `styles.css` gets an "Eye camps" section.
- **Fixed:**
  - `site.js` highlighted the Eye care mega-menu card instead of the top-level "Eye camps" item; About and Contact had the same issue, so all three now target top-level items only.
  - The camp year chips shared the footer's `data-year` attribute (renamed to `data-camp-year`).
  - Dates no longer show a stray comma.
- **Checked:** in the browser:
  - the menu link opens the listing, and the year filter works;
  - past and upcoming detail pages, the gallery keyboard behaviour and the not-found state all work;
  - on phones, single columns and 44 px targets; dark mode readable;
  - no horizontal scroll and no console errors.
- **Files:** `mockups/eye-camps.html`, `mockups/camp-detail.html`, `mockups/camps-data.js`, `mockups/site.js`, `mockups/styles.css`, `docs/requirements/Requirements_EyeCamps.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Requirements: Eye Camps (draft)

- **Changed:** added `docs/requirements/Requirements_EyeCamps.md`:
  - **Camp data** from Q100: date, place, description, what's offered, participants, photos.
  - **Listing:** a hero with a stat line, the next camp with Directions / Add to calendar / Share on WhatsApp, more upcoming camps, past camps with year chips and load more, and a "Bring a camp to your community" band.
  - **Camp detail:** upcoming vs past content and a keyboard-accessible photo gallery.
  - **Rules:** camps move to Past automatically, past camps stay permanently (Q101), and there's no registration in the MVP (Q99 "Not sure").
  - Added `DUMMY` C19 (camps).
- **Why:** this is the next page in the plan's mockup order.
- **Files:** `docs/requirements/Requirements_EyeCamps.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: Book an eye test

- **Changed:** added `mockups/book-eye-test.html` (`Requirements_Booking.md`, approved). It's a working mockup in which nothing is saved:
  - **Steps:** 3 steps on one page (branch and day → time → details). Prefill from `?branch=&date=`.
  - **Slots:** 20-minute slots grouped Morning / Afternoon / Evening, with 2 hours' notice, a 30-day window, a Diwali-day closure, and DUMMY counts-only availability (about 1 in 8 slots full). DUMMY C18 and D3.
  - **Fields:** name, +91 mobile, optional for-whom and a note with a counter, a required consent checkbox with the privacy link, and a honeypot.
  - **Errors:** field errors plus a focused error summary.
  - **Confirmation:** a random reference, the last 4 digits of the mobile only, "Send to the branch on WhatsApp" (prefilled), an `.ics` calendar file, "Call or WhatsApp to change", and "Book another test".
  - **Review-only buttons:** preview the "slot just filled" and "server error" states.
  - **Layout:** the sticky bar is hidden on this page; on phones the summary card becomes a one-line summary above the submit button.
  - **Home page:** its booking band now opens this page with branch and date filled in.
  - **Shared files:** `site.js` routes `/book-eye-test`; `styles.css` gets a "Booking form" section.
- **Fixed:** the dummy availability hash marked about 40% of slots full, so it was replaced with FNV-1a (about 12%).
- **Checked:** in the browser:
  - the home band prefill works;
  - validation lists 3 errors with focus on the summary;
  - "slot just filled" makes that time Full and keeps the day;
  - "server error" keeps the entered details and offers Call / WhatsApp (dummy number blocked);
  - success shows the reference, a masked number, the WhatsApp text and the calendar file;
  - on phones, 44 px targets and no horizontal scroll; dark mode readable; no console errors.
- **Files:** `mockups/book-eye-test.html`, `mockups/home.html`, `mockups/site.js`, `mockups/styles.css`, `docs/requirements/Requirements_Booking.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Requirements: Book an eye test (draft)

- **Changed:** added `docs/requirements/Requirements_Booking.md`:
  - **Form:** 3 steps on one page (branch and day → time → details), prefilled from the home band.
  - **Slots:** 20-minute slots with notice, window and capacity rules; availability fetched as counts only.
  - **Minimal data:** name, mobile, optional for-whom and note, required consent.
  - **Checks:** server-side validation, with the capacity check and insert in one transaction.
  - **Confirmation:** a random reference, "Send to the branch on WhatsApp" (prefilled), an `.ics` calendar file, and "call or WhatsApp to change".
  - **Database and tests:** an insert-only `appointments` table with row-level security, and acceptance tests for the read-block and the race condition.
  - Added `DUMMY` C18 (booking rules).
- **Why:** this is the next page in the plan's mockup order and the first form with personal data, so it follows the `CLAUDE.md` data-security rules and the DPDP consent requirement.
- **Files:** `docs/requirements/Requirements_Booking.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: Eye care page

- **Changed:** added `mockups/eye-care.html` (`Requirements_EyeCare.md`, approved), with these sections:
  - hero;
  - the 4 services with the mega-menu anchors (`#eye-testing`, `#lens-fitting`, `#frame-adjustment`, `#frame-repair`): eye test 5–20 minutes, "Free" tagged DUMMY, repair charges TODO;
  - 4 eye-test steps;
  - the "when to get your eyes checked" checklist with an always-visible urgent-help note;
  - 6 tips with a "general information only" disclaimer;
  - an 8-question FAQ accordion (native `details`/`summary`; unconfirmed answers tagged);
  - quick links and a call to action;
  - `FAQPage` structured data (confirmed answers only).
  - **Shared files:** `site.js` routes `/eye-care` and has a new alert icon; `styles.css` gets an "Eye care page" section.
- **Checked:** in the browser:
  - the mega-menu link `/eye-care#lens-fitting` lands on the block below the header; Eye care is highlighted; there's one `h1`;
  - all sections and counts are right, and several FAQ answers open together;
  - single columns on phones, 56 px FAQ rows, dark mode readable;
  - no horizontal scroll and no console errors.
- **Files:** `mockups/eye-care.html`, `mockups/site.js`, `mockups/styles.css`, `docs/requirements/Requirements_EyeCare.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Requirements: Eye Care (draft)

- **Changed:** added `docs/requirements/Requirements_EyeCare.md`, with these sections:
  - hero;
  - the 4 services from Q92, with the mega-menu anchors;
  - what happens at an eye test;
  - when to get your eyes checked, with an always-visible "see a doctor straight away" safety note;
  - eye care tips;
  - an FAQ accordion: confirmed answers from Q75 / Q92 / Q131 / WhatsApp Q11, the rest DUMMY or TODO;
  - quick links and a call to action.
  - Added `DUMMY` C17 (health copy that needs the optometrist's approval).
- **Why:** this is the next page in the plan's mockup order. It is health information, so anything beyond the client's facts is tagged for professional review and makes no medical claims.
- **Files:** `docs/requirements/Requirements_EyeCare.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: Lenses page

- **Changed:** added `mockups/lenses.html` (`Requirements_Lenses.md`, approved), with these sections:
  - page hero with Book an eye test and Ask on WhatsApp;
  - five lens type cards, each with "See lenses (n)" (types without lenses are hidden);
  - "How we choose your lens" in 3 steps;
  - the lens catalogue:
    - Type and Brand chip filters kept in the URL;
    - cards with up to 3 feature tags, the price or "Ask for price", and Enquire on WhatsApp naming the lens;
    - an empty state;
  - brand tiles that filter the catalogue;
  - an instant lens fitting band;
  - a "Not sure which lens you need?" call to action.
  - Data is DUMMY (C6, C16).
  - **Shared files:** `site.js` routes `/lenses` here, and the mega-menu Kodak link now uses `brand=kodak-lens` to match. `styles.css` gets a "Lenses page" section.
- **Checked:** in the browser:
  - menu links land filtered (`?type=progressive` gives 2 lenses);
  - chips combine (Progressive + ZEISS gives 1), the empty state shows, Clear works, a brand tile filters, and Enquire names the lens;
  - 5 / 3 / 3 / 5 columns on desktop and 1 / 1 / 1 / 2 on phones; dark mode reads clearly;
  - no horizontal scroll and no console errors.
- **Files:** `mockups/lenses.html`, `mockups/site.js`, `mockups/styles.css`, `docs/requirements/Requirements_Lenses.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Requirements: Lenses (draft)

- **Changed:** added `docs/requirements/Requirements_Lenses.md`, with these sections:
  - hero;
  - five lens types in plain language (types with no active lenses are hidden);
  - "How we choose your lens";
  - a lens catalogue with Type and Brand chip filters kept in the URL, lens cards with an optional price ("Ask for price" otherwise) and Enquire on WhatsApp, and no detail page;
  - brands;
  - an instant lens fitting band (Q92);
  - a call to action.
  - Added `DUMMY` C16 (lens catalogue).
- **Why:** this is the next page in the plan's mockup order. The scope stays at spectacle lenses and brands (decision 2026-10-09); descriptions carry no medical claims.
- **Files:** `docs/requirements/Requirements_Lenses.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: About page

- **Changed:** added `mockups/about.html` (`Requirements_About.md`, approved), with these sections:
  - a shorter navy hero with the calculated year count;
  - founder and family with a pull-quote;
  - a vertical journey timeline (1999 → Today, with DUMMY milestones C15);
  - Trust / Care / Innovation values;
  - team roles;
  - both branches;
  - a gallery preview linking to `/gallery`;
  - 6 DUMMY reviews at `#reviews`;
  - an eye-camps band;
  - a "Come and meet the family" call to action;
  - `Organization` structured data.
  - **Shared files:** `site.js` routes `/about` here (the home page's "Read more reviews" now lands on `#reviews`). `styles.css` gets an "About page" section, and section anchors now clear the sticky header (`scroll-margin-top`).
- **Fixed:** the hero photo box now lines up with the content edge on wide screens; the timeline dot ring matches the section background.
- **Checked:**
  - In the browser at 1440 and 375 px, light and dark: about.html loads from the home page link, About is highlighted in the menu, there's one `h1`, all 10 sections are in order, both year counts read 27, there are 6 reviews, and the `#reviews` title sits below the header.
  - On phones, single columns and a left-line timeline; no horizontal scroll and no console errors.
- **Files:** `mockups/about.html`, `mockups/site.js`, `mockups/styles.css`, `docs/requirements/Requirements_About.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Requirements: About (draft); Sunglasses approved

- **Changed:**
  - Added `docs/requirements/Requirements_About.md`, with these sections:
    - hero with the calculated year count;
    - founder and family;
    - a vertical journey timeline;
    - values (Trust / Care / Innovation);
    - team;
    - branches;
    - gallery preview (the main way into `/gallery`);
    - reviews (`#reviews`, the target of the home page's link);
    - an eye-camps band and a call to action.
  - Also: anchors, empty states and acceptance criteria. Added `DUMMY` C15 (timeline milestones).
  - Marked `Requirements_Sunglasses.md` approved (developer, 2026-10-10).
- **Why:** About is the next page in the plan's mockup order. Most About content is still pending from the client (WhatsApp Q10), so the structure is designed now with tagged dummy content.
- **Files:** `docs/requirements/Requirements_About.md`, `docs/requirements/Requirements_Sunglasses.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · CLAUDE.md: mockups section (/init)

- **Changed:**
  - Added a "Mockups" section to `CLAUDE.md`: the preview command, and what `styles.css`, `site.js` (including the `MOCKS` route table), `frames-data.js` and `listing.js` each do.
  - Page conventions: the theme script, `data-page`, script order, review notes, `DUMMY` tags, branch-picker attributes.
  - The status line now says Phase 3 mockups.
- **Why:** `/init` review. `CLAUDE.md` described rules and the future app but not the mockup code that exists, which needs several files read together to understand.
- **Files:** `CLAUDE.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Requirements: Sunglasses (draft)

- **Changed:** added `docs/requirements/Requirements_Sunglasses.md`. It covers only what differs from Frames:
  - lens type and lens colour fields;
  - a Lens type filter in place of Category;
  - mega-menu tier and lens links;
  - a lens-type label on cards;
  - the power-sunglasses prescription note;
  - similar sunglasses;
  - no lens-protection claims beyond admin data.
  - Also added `DUMMY` C14 (sunglasses data).
- **Why:** this is the next page in Phase 3. `CLAUDE.md` requires a requirements file before a page's mockup.
- **Files:** `docs/requirements/Requirements_Sunglasses.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: light / dark mode

- **Changed:**
  - **Colour roles:** `mockups/styles.css` now has colour roles (`--bg`, `--bg-alt`, `--surface`, `--text`, `--text-muted`, `--line`, `--heading`, `--accent-ink`, `--btn-ink`, `--pressed-bg/-ink`, `--ph-stripe`, `--todo-ink`, `--focus`, `--navy-edge`).
    - 119 light-surface declarations were switched to them, and the page styles in `nav.html` and `frame-detail.html` too.
    - Light mode is unchanged (checked against the original computed colours).
  - **Dark mode:** three new dark surfaces (`--night` `#0A1622`, `--night-2` `#0F1E2E`, `--night-3` `#162B42`). Cream is used for text, Brass for accents, Gold for selected chips and badges. Navy blocks and gold buttons stay the same.
  - **Toggle:** a sun/moon button in the header tools on every page, desktop and mobile (`site.js`).
    - It follows the device setting until chosen.
    - The choice is saved (`vslm-theme`) and applied by a one-line script in each page's `<head>`, so there's no flash.
  - **Docs:** `CLAUDE.md` design system, the navigation icons rule, `Requirements_Navigation.md` (toggle and acceptance criterion 15) and `ROADMAP.md` (MVP, sprint 5.1) are updated.
- **Why:** developer request: every page should have a dark mode with a toggle.
- **Checked:** in the browser:
  - light mode matches the old colours exactly; the toggle switches and the choice persists across Home, Frames, Frame detail and Navigation;
  - a saved "light" wins over a dark device, and with no choice the site follows the device;
  - the mega menu, filters, cards, panels and the phone layout read clearly in dark;
  - there are no console errors.
- **Files:** `mockups/styles.css`, `mockups/site.js`, `mockups/nav.html`, `mockups/home.html`, `mockups/frames.html`, `mockups/frame-detail.html`, `CLAUDE.md`, `ROADMAP.md`, `docs/requirements/Requirements_Navigation.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: frame detail

- **Changed:** added `mockups/frame-detail.html` (`Requirements_Frames.md` section 4):
  - breadcrumb;
  - gallery of 5 DUMMY product views, with thumbnails, arrow keys, swipe on phones and click-to-zoom on desktop;
  - brand, model, frame code, exact price, In stock / Sold out, "Available at";
  - Enquire on WhatsApp (branch picker, frame code prefilled), favourite and Share on WhatsApp (`wa.me/?text=`, so the customer picks the contact; DUMMY domain D4), plus Book an eye test;
  - a 9-row details table, the lens note and the visit note;
  - up to 4 similar frames (same shape or brand, in stock first);
  - page title, description and `Product` structured data per frame.
  - **Sold out:** a badge, and the button becomes "Ask about similar frames". An unknown frame shows "This frame isn't available". There's no try-on button.
  - **Links:** `site.js` now routes `/frames/<slug>` to this page, so every frame card on Home and Frames opens its frame.
  - **Shared files:** a new share icon in `site.js`; a "Product detail" section in `styles.css`.
- **Fixed:** on phones the thumbnail labels pushed the gallery past the right margin. Grid columns can now shrink.
- **Checked:** in the browser at 1440 and 375 px:
  - a card click opens the right frame;
  - the gallery (thumbnails, keys, swipe), Enquire text, favourite and Share link all work;
  - the sold-out and not-found states work;
  - every button is at least 44 px, there's no horizontal scroll and no console errors.
- **Files:** `mockups/frame-detail.html`, `mockups/site.js`, `mockups/styles.css`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: wider layout and full-width hero

- **Changed:**
  - **Wider content area:** max width 1,280 → 1,440 px (`--max-w: 90rem`). At 1920 px the side margins shrink from 361 to 281 px; at 1366 px the content starts 48 px from the edge instead of about 83 px. It applies to every mockup.
  - **Home hero:**
    - a blurred, darkened copy of the hero photo now fills the whole hero behind everything;
    - the sharp photo fades in from the left (CSS mask) instead of ending in a hard edge;
    - a navy shade keeps the text readable;
    - on phones the fade and the shade run top to bottom.
  - The photo is passed in with `--hero-img`.
- **Why:** developer feedback that the page looked right-aligned with empty space on the left. Measured: it was centred, with equal margins. The cause was the photo bleeding to the right edge next to a flat navy left margin, plus a narrow 1,184 px content column on a 1920 px screen.
- **Checked:**
  - In the browser at 1920, 1366 and 375 px: content centred and the headline clear of the face in the photo.
  - No horizontal scroll; Frames uses the wider layout too.
- **Files:** `mockups/styles.css`, `mockups/home.html`, `docs/requirements/Requirements_HomePage.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: semi-opaque nav on Home

- **Changed:** on `home.html` the main nav bar is now semi-opaque, like the design image:
  - navy at 60% with a background blur, with the hero photo running underneath;
  - once scrolled past the hero, navy at 88%;
  - 85% navy where blur isn't supported.
  - The utility strip stays solid, and other pages keep the solid bar.
  - `--nav-h` is now 68 px below 1180 px, so the offsets match the shorter bar.
- **Why:** developer request. At 60% over the cream sections the bar turned washed-out grey and the gold "VS" faded, so it gets more navy (still see-through) once past the hero.
- **Checked:** in the browser at 1440 and 375 px: the photo shows through at the top, the bar darkens past the hero, the Frames page is still solid, and there's no horizontal scroll.
- **Files:** `mockups/styles.css`, `mockups/home.html`, `docs/requirements/Requirements_HomePage.md`, `docs/requirements/Requirements_Navigation.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: frames listing

- **Changed:** `Requirements_Frames.md` was approved, so I built `mockups/frames.html`:
  - breadcrumb and Men / Women / Kids / Unisex quick chips;
  - the client's 7 filters in order, with counts from the frames themselves; options with no matches are disabled, and there's no rim-type filter;
  - active-filter chips with "Clear all";
  - sort (sold out always last), "Saved (n)" and 24 frames per "Load more";
  - the no-results state and a help band;
  - every filter is kept in the page link, and the mega-menu tier links map to price bands;
  - below 1180 px the filters become a full-screen panel with "Show n frames", Esc and a focus trap.
  - Shared pieces:
    - `mockups/frames-data.js` holds the 30 DUMMY frames, the frame card and the device-only favourites, now used by `home.html` too.
    - The footer moved into `site.js`, so every mockup shares it.
    - `site.js` now opens mockups that exist (`/` → `home.html`, `/frames` → `frames.html`, keeping filters) instead of showing a toast.
    - `styles.css` has a new "Listing pages" section.
- **Fixed:** the mega menu's Vogue link (`brand=vogue-eyewear`); a global `[hidden]` rule; breadcrumb list styles.
- **Checked:** in the browser at 1440 and 375 px:
  - filters, page links, sort, Load more, Saved, "In stock only", the empty state and the menu tier link all work;
  - the phone panel now sits above the sticky bar, so its buttons can be reached;
  - no console errors; Home and Navigation still work.
- **Files:** `mockups/frames.html`, `mockups/frames-data.js`, `mockups/home.html`, `mockups/site.js`, `mockups/styles.css`, `docs/requirements/Requirements_Frames.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Requirements: Frames (draft)

- **Changed:** added `docs/requirements/Requirements_Frames.md`. It covers the frame data, the `/frames` listing (the client's 7 filters, sort, load more, device-only favourites, empty states) and the frame detail page (gallery, Enquire and Share on WhatsApp, details, related frames, 404). Added `DUMMY` C13 (frame categories and code format).
- **Why:** this is the next page in Phase 3. `CLAUDE.md` requires a requirements file before a page's mockup.
- **Files:** `docs/requirements/Requirements_Frames.md`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: home page + shared site chrome

- **Changed:**
  - **Requirements:** `Requirements_HomePage.md` approved with the developer's decisions:
    - the design's headline "{years} Years of Trust. A Clearer Vision for Tomorrow.", with the year count calculated from 1999 (27 in 2026), never hard-coded;
    - the design image's AI photo as a `DUMMY` hero (C12, never live);
    - dummy frames;
    - dummy reviews, to be swapped for Google reviews later;
    - the "Scroll" cue dropped.
  - **`mockups/home.html`:** all homepage sections, each with an empty state:
    - hero and quick cards (WhatsApp branch picker, Visit a store);
    - trust strip;
    - Welcome;
    - category tiles;
    - 8 featured frames (Sold out, Available at, a favourite saved on the device, Enquire with a prefilled WhatsApp message);
    - lenses and the 4 services;
    - eye camps;
    - a rotating, pausable quote band;
    - reviews;
    - branches with their own numbers;
    - the eye-test band (hands branch and date to `/book-eye-test` and stores nothing);
    - the footer with social links.
  - **New `mockups/site.js`:** the header, mega menus, drawer, sticky bar, branch picker and mockup controls now live in one shared script. `nav.html` uses it too, so every page mockup shares one header. The branch picker now:
    - works for buttons added later;
    - accepts a prefilled WhatsApp message;
    - opens above its button near the bottom of the screen;
    - closes on scroll.
  - **`mockups/styles.css`:** a new "Page sections" block, reusable by the next mockups.
  - **`mockups/assets/hero-dummy.jpg`:** cropped from the design image.
  - **`docs/dummy-data.md`:** C12 and the Q8 headline.
- **Why:** this is the Home page for Phase 3. The shared script keeps the remaining 12 mockups consistent.
- **Checked:**
  - In the browser at 1440 and 375 px: no horizontal scroll and no console errors.
  - Enquire, favourites, the quick cards, the book band and the dummy-number guard all work.
  - `nav.html` still works after the refactor.
- **Files:** `docs/requirements/Requirements_HomePage.md`, `docs/dummy-data.md`, `mockups/home.html`, `mockups/site.js`, `mockups/nav.html`, `mockups/styles.css`, `mockups/assets/hero-dummy.jpg`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Requirements: Home page (draft)

- **Changed:** added `docs/requirements/Requirements_HomePage.md`. It covers the 13 sections from plan v1.2 Figure 1 plus the quick cards below the hero, with the data source, empty state, mobile behaviour and acceptance criteria for each.
- **Why:** this is the first page of Phase 3. `CLAUDE.md` requires a requirements file before a page's mockup. Key decisions in the draft:
  - The design image's "25 Years of Trust" headline and its generated people are replaced (with a `DUMMY` headline and a photo placeholder).
  - Featured frames show only approved frames.
  - Reviews stay hidden until real ones exist.
  - The eye-test band hands off to `/book-eye-test` without storing data.
- **Files:** `docs/requirements/Requirements_HomePage.md`, `docs/changelog.md`

## 2026-10-10 · Phase 2 · Plan v1.2

- **Changed:** created `docs/plan/VS_Lens_Mart_Plan_v1.2.docx` from v1.1, and moved v1.1 to `docs/plan/archive/`. v1.2 brings the plan in line with `CLAUDE.md` and `ROADMAP.md`:
  - **Client facts:** the client details table has the form and prescription-card facts (hours, number per branch, address, prescription fields, style, frames, services, domain).
  - **Scope decisions:** English only, DUMMY placeholders, and the store management system as a later phase. The system has a new "Later phase" section after Phase 8.
  - **Menus and pages:** the navigation table, pages table and global elements are updated: branch picker, client filters, availability, favourites, services, social links, the trimmed Lenses menu, and no language toggle.
  - **Tech:** the tech stack has roles and the `wa.me` note; the security box has frame approval and roles; the folder tree is updated.
  - **Phases:** phase estimates, the build order, the sprint table, the MVP/later table, the "never do" rules, the starter prompts, the Phase 6 checks and the Phase 7–8 tasks are updated.
  - **Tables:** the open-questions table now shows statuses, and the document history has 1.2 and a planned 1.3.
  - **Figures:** 2, 3, 3a, 3c, 3d, 3e and 4 are still v1.1 drawings; their captions now say what changed. The table of contents was refreshed in Word.
- **Why:** you asked for plan v1.2 after the comparison with v1.1. `CLAUDE.md` now points to v1.2.
- **Files:** `docs/plan/VS_Lens_Mart_Plan_v1.2.docx`, `docs/plan/archive/VS_Lens_Mart_Plan_v1.1.docx`, `CLAUDE.md`, `docs/changelog.md`

## 2026-10-10 · Phase 3 · Mockups: navigation updated to requirements v1.2

- **Changed:** `mockups/nav.html` now matches `docs/requirements/Requirements_Navigation.md`:
  - **Utility bar:** hours with no TODO; both branch numbers (Patelguda tagged `DUMMY`).
  - **Branch picker:** the WhatsApp icon and the sticky-bar Call/WhatsApp buttons open a branch picker (proposal). The dummy Patelguda number never dials.
  - **Frames:** rim-type column removed; `DUMMY` brands and "from ₹" prices.
  - **Lenses:** contact lenses, reading glasses and care products removed; `DUMMY` lens brands; blue-cut/photochromic marked "to confirm".
  - **Eye care:** an "Our services" column with the client's 4 services; "Free eye test" tagged `DUMMY`; booking copy says "call or WhatsApp to reschedule".
  - **Mobile drawer:** updated the same way.
  - **Review area:** a "Changed since the last version" list and an updated "Waiting on the client" list.
  - `mockups/styles.css`: new branch-picker component; tablet utility bar hides the digits so it stays on one line; card titles align.
  - `docs/dummy-data.md` C7: the "from ₹" tier prices used in the menus.
- **Why:** the mockup still showed the pre-form navigation. Checked in the browser at 1440, 1280, 1180, 800 and 375 px: no horizontal scroll, no console errors, picker opens and closes with Esc and returns focus.
- **Files:** `mockups/nav.html`, `mockups/styles.css`, `docs/dummy-data.md`, `docs/changelog.md`

## 2026-10-09 · Phase 2 · Client form vs docs: facts and scope decisions

- **Changed:**
  - **Facts** in `CLAUDE.md`, `ROADMAP.md` and `Requirements_Navigation.md`:
    - hours 9:00 AM–9:30 PM;
    - separate number per branch (Indresham 9550685417, Patelguda `DUMMY`), with a branch picker for Call/WhatsApp (proposal);
    - "Since 1999" confirmed;
    - prescription card received;
    - logo facts ("FAMLY", no high-res file);
    - exact ₹ prices;
    - new docs listed (`dummy-data.md`, card, form export).
  - **Rule:** mockups may use tagged `DUMMY` values; the live site never does.
  - **MVP additions:**
    - frame status draft → approved, with `admin` and `staff` roles;
    - availability ("Sold out") separate from `is_active`;
    - "Available at" branch;
    - the client's frame fields and filters (no rim-type filter);
    - device-only favourites;
    - WhatsApp share;
    - social links;
    - Eye care lists the client's 4 services;
    - contact lenses, reading glasses and care products removed from the menu;
    - booking says "Call or WhatsApp to reschedule";
    - `/privacy` retention period is `DUMMY` (D9).
  - **Changes:**
    - brand tone "trusted family shop, premium quality at affordable prices";
    - hero keeps 2 buttons, with WhatsApp us / Visit store as quick cards and no Try-on button;
    - model photos need written consent.
  - **Later:**
    - new "Store management system" phase (`ROADMAP.md` section 7): customer login, registration, prescriptions, orders, inventory, billing, reports, audit log, automatic WhatsApp;
    - Google Analytics;
    - online appointment changes;
    - Google reviews.
  - Estimate is now 20–27 days.
- **Why:** the client's form (2026-10-07) and prescription card conflicted with the docs. Developer decisions on 2026-10-09. The missed approval → roles dependency is logged as Discernment in `docs/ai-fluency-log.md`. Tell the client about these decisions.
- **Files:** `CLAUDE.md`, `ROADMAP.md`, `docs/requirements/Requirements_Navigation.md`, `docs/open-questions.md`, `docs/dummy-data.md`, `docs/ai-fluency-log.md`, `docs/changelog.md`

## 2026-10-09 · Phase 2 · Dummy data, prescription card, English only

- **Changed:**
  - Added `docs/dummy-data.md`: placeholder values for every missing client detail (email, Patelguda number, founder story, brands, prices, free eye test, testimonials, eye camps, photos), a dummy decision for each contradiction, and a dummy answer for each of the 27 blank form questions. Every row has a "Replaced" box.
  - Recorded the prescription card (`docs/prescription_card.jpg`): 9550685417 is the Indresham number, the address is "Part Block-B", and its fields answer Q59. It has no PD field, which is a new contradiction with Q58.
  - `CLAUDE.md`: missing client facts now use `docs/dummy-data.md`, marked `DUMMY`, instead of `TODO (client)`. Language rule is now English only.
  - Removed every other-language item from `CLAUDE.md`, `ROADMAP.md` and `docs/open-questions.md`.
- **Why:** developer decision so mockups and development aren't blocked by missing client answers, and to fix the site to English only. Dummy values must be replaced before launch.
- **Files:** `docs/dummy-data.md`, `docs/open-questions.md`, `CLAUDE.md`, `ROADMAP.md`, `docs/changelog.md`

## 2026-10-08 · Phase 1 · Client questionnaire

- **Changed:** added the client's 160-question Google Form response (submitted 2026-10-07) to `docs/client-answers.md`, copied exactly, grouped by topic. Rewrote `docs/open-questions.md`: status of the original 11 questions, 8 contradictions inside the form, scope changes to decide, and 27 blank answers.
- **Why:** Phase 1 discovery. The form answers the opening time (9:00 AM) and says each branch has its own number, but it also asks for Telugu + Hindi, customer accounts, favourites, and a shop management system (inventory, billing, orders, staff roles). These conflict with `CLAUDE.md` and `ROADMAP.md`. They are recorded as open decisions; `CLAUDE.md` and `ROADMAP.md` are unchanged until agreed.
- **Files:** `docs/client-details.xlsx` (added by developer), `docs/client-answers.md`, `docs/open-questions.md`, `docs/changelog.md`

## 2026-10-03 · Phase 3 · Mockups: shared styles + navigation

- **Changed:** added `mockups/styles.css`, the shared stylesheet every mockup links. It holds the design tokens, base styles, buttons, photo placeholders, review-note tags and the site-header component. Also added `mockups/nav.html`, the navigation mockup:
  - utility bar;
  - the 7-item navy menu;
  - the Frames, Sunglasses, Lenses and Eye care mega menus;
  - a search drawer;
  - the mobile full-screen accordion;
  - the sticky Call / WhatsApp / Book bar.
- **Why:** this is Phase 3, building screens for client sign-off. Mockup sign-off also closes the MVP confirmation risk. Built to `docs/requirements/Requirements_Navigation.md`.
- **Proposed decisions** (for review):
  - Below 768 px the utility bar shrinks to "Since 1999 · Open 7 days, 9 AM–9:30 PM", and Call and Book move to the sticky bar.
  - The search icon is desktop and tablet only.
  - The hamburger menu takes over below 1180 px.
- **Found:** `docs/logo.png` spells "FAMLY" in its ring text. This is added to the review list for the client.
- **Files:** `mockups/styles.css`, `mockups/nav.html`, `docs/changelog.md`

## 2026-10-03 · Phase 2 · AI fluency log

- **Changed:** added the MVP confirmation risk to the AI fluency log as Diligence evidence.
- **Why:** it records how the unconfirmed MVP is being handled: mockup sign-off doubles as MVP confirmation.
- **Files:** `docs/ai-fluency-log.md`, `docs/changelog.md`

## 2026-10-03 · Phase 2 · Scope: MVP confirmation (risk)

- **Changed:** MVP not yet confirmed by client; proceeding with the v1.1 MVP list.
- **Why:** this records the risk that the client could change the MVP after work has started. Confirmation is expected sooner from the Phase 3 mockups, because clients find it easier to react to screens than to a feature list.
- **Files:** `docs/changelog.md`, `ROADMAP.md` (the MVP list)

## 2026-10-03 · Phase 2 · CLAUDE.md review fixes

- **Changed:**
  - Added a source-of-truth order (CLAUDE.md > ROADMAP.md > Requirements_<Page>.md > plan .docx), working rules, folder rules and this changelog format.
  - Pointed to the moved plan file, `docs/plan/VS_Lens_Mart_Plan_v1.1.docx`; the old version is in `docs/plan/archive/`.
  - Marked hours and phone as TODO (client), to be read only from `src/lib/site-config.ts`.
  - Split animation timing: menus 300 ms or less, page and section fades 300–500 ms.
  - Made `/gallery` its own page, linked from About and the footer.
  - Cut the Navigation section down to the 7 items plus a pointer to `Requirements_Navigation.md`.
  - Updated the brand tone.
- **Why:** a review found 4 contradictions, 4 unclear points and 2 missing sections in `CLAUDE.md`.
- **Files:** `CLAUDE.md`, `docs/changelog.md`

## 2026-10-03 · Phase 2 · Scope: Telugu dropped from MVP

- **Changed:** removed the Telugu/English toggle, the Noto Sans Telugu font and the Telugu translation from the MVP. Telugu is now "Not in MVP, possible later".
- **Why:** this is a scope change from plan v1.1. Telugu was the developer's suggestion, and the client never asked for it. It will go into plan v1.2.
- **Files:** `CLAUDE.md`, `ROADMAP.md`, `docs/requirements/Requirements_Navigation.md`

## v1.0 — Initial Plan

**Status:** Initial project plan

- Created the initial VS Lens Mart website project plan.
- Defined the project as a premium, family-oriented optical-store website.
- Established the core brand direction around trust, care, innovation, and the shop's legacy since 1999.
- Defined the main customer-facing pages:
  - Home
  - About / Our Journey
  - Frames
  - Frame Detail
  - Eye Care
  - Book an Eye Test
  - Eye Camps
  - Gallery
  - Contact
  - Privacy Policy
- Defined the staff-only Admin area for managing frames, lenses, camps, gallery content, reviews, and bookings.
- Established the initial technical stack:
  - Next.js
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Supabase PostgreSQL
  - Supabase Storage
  - Supabase Auth
  - Netlify
- Established the initial database and security direction using Supabase and Row Level Security.
- Defined the MVP and later-module split.
- Added project workflow phases from setup and requirements through development, testing, deployment, and maintenance.
- Added Claude Code workflow requirements including Plan Mode, `/init`, `/clear`, `/compact`, `/rewind`, subagents, hooks, and Playwright testing.
- Established design constraints:
  - No 3D website.
  - No online checkout.
  - Use real client photography on the live site.
  - Use gentle fade/slide animations only.
  - Mobile-first implementation.
- Added the initial documentation structure under `docs/`.

## v1.1 — Navigation Update

**Status:** Navigation refined to match the approved homepage direction

- Updated the primary website navigation to:
  - Home
  - About
  - Frames
  - Eye Care
  - Eye Camps
  - Gallery
  - Contact
- Added a persistent **Book an Eye Test** action in the header.
- Defined the mobile navigation as a collapsible menu.
- Replaced the original shopping-bag concept because the MVP does not include online checkout.
- Planned the shopping-bag replacement as a WhatsApp action or **Book an Eye Test** action.
- Added a sticky WhatsApp button at the bottom-right of the website.
- Confirmed the WhatsApp contact number for the global WhatsApp action as `9550685417`.
- Kept the navigation aligned with the homepage visual direction: dark navy header, gold accents, and a premium minimal presentation.

## v1.2 — Client Details Received

**Status:** Client details received (2026-10-07 to 2026-10-09); details in the dated entries at the top

- Received the client's 160-question Google Form (`docs/client-details.xlsx`) and the prescription card (`docs/prescription_card.jpg`).
- Confirmed hours 9:00 AM–9:30 PM, separate numbers per branch (9550685417 = Indresham), and the "Part Block-B" address.
- Added `docs/dummy-data.md` for every detail still missing.
- Set the website to English only.
