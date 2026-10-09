# Changelog

All notable changes to the VS Lens Mart website project documentation and plan are recorded here.

New entries go at the top, newest first. Each entry starts with a heading `## YYYY-MM-DD · Phase/Sprint · Area`, followed by **Changed**, **Why** and **Files** lines (see `CLAUDE.md`). The v1.0 and v1.1 entries further down are older, plan-version entries.

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
