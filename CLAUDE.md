# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for **VS Lens Mart**, a family-run optical shop (since 1999) with two branches (Indresham and Patelguda). Brand tone: a trusted family shop, premium quality at affordable prices ("Welcome to the Optical Family"). Customers browse and then enquire on WhatsApp or visit a branch. **There is no online checkout.**

Status: Phase 4, Foundation (`ROADMAP.md` section 3). Phase 3 (HTML mockups) was signed off by the client on 2026-10-21 in a Google Meet review; the mockups in `mockups/` are the approved design. Missing client details stay `DUMMY` until they arrive and must be replaced before launch. No app code or `package.json` yet, so there are no build/lint/test commands. Add them here once the Next.js app is scaffolded.

Don't invent client facts (prices, brands, founder story, email, hours, phone numbers). For anything the client hasn't confirmed, use the placeholder from `docs/dummy-data.md` and mark it `DUMMY`; if it isn't there, add it there first. Dummy values never go live. Check `docs/open-questions.md` for what's still pending.

### Scope

- MVP vs later modules and sprint order: `ROADMAP.md`.
- **Language:** English only. No language toggle, extra fonts or translations.
- **Store management system** (customer login, registration, prescriptions, orders, inventory, billing, reports, audit log, automatic WhatsApp messages) is a separate later phase. Don't build any of it into the website MVP, and don't let it delay the launch.

## Source of truth

When documents disagree, the higher one wins:

1. `CLAUDE.md`: global rules
2. `ROADMAP.md`: scope
3. `docs/requirements/Requirements_<Page>.md`: page details
4. `docs/plan/VS_Lens_Mart_Plan_v1.2.docx`: background only. Some of its figures are v1.1 drawings; their captions say what changed. Older versions are in `docs/plan/archive/`; don't use them.

Other docs:
- `docs/client-answers.md` and `docs/open-questions.md`: what the client has and hasn't confirmed. The raw form export is `docs/client-details.xlsx`.
- `docs/dummy-data.md`: the only allowed placeholders for missing client details.
- `docs/prescription_card.jpg`: the shop's real prescription card (fields, Indresham number, address).
- `docs/changelog.md`: the change history.
- `docs/ai-fluency-log.md`: the AI usage log.
- The homepage design image and `docs/vs_lens_mart_navbar_mega_menu.html`: the navigation mockup.

## Working rules

- One feature per session.
- Before working on a page, read its `docs/requirements/Requirements_<Page>.md`. If it doesn't exist, write it and get it approved first.
- After any change, add an entry at the top of `docs/changelog.md` (newest first) in this format:

  ```
  ## YYYY-MM-DD · Phase/Sprint · Area
  - **Changed:** what changed
  - **Why:** the reason or decision behind it
  - **Files:** paths touched
  ```

## Folder rules

| What | Where |
|---|---|
| Pages and routes | `src/app/<route>/` (e.g. `src/app/frames/[slug]/page.tsx`) |
| Staff admin pages | `src/app/admin/` |
| Shared UI | `src/components/` |
| Supabase client, helpers | `src/lib/` |
| Shop facts (hours, phone, WhatsApp, addresses) | The `branches` table (the admin edits it at `/admin/branches`), with `src/lib/site-config.ts` as the seed and fallback. Never hard-code them in components. |
| Database schema and row-level security | `supabase/schema.sql` |
| Playwright tests | `tests/` |
| HTML mockups for client sign-off | `mockups/` |
| Requirements | `docs/requirements/Requirements_<Page>.md` |

## Mockups (`mockups/`)

Static HTML pages, signed off by the client on 2026-10-21. They are the reference design for the build. No build step. They open straight from the file system, but use a server for browser checks:
- **Preview:** the `mockups` config in `.claude/launch.json`, or `python -m http.server 8765` from the repo root. Then open `http://localhost:8765/mockups/home.html`.
- **Verify:** check at 1440 and 375 px (plus 768 / 1180 when layout changes), in both light and dark mode.

Every page is thin; the shared files do the work:

| File | Role |
|---|---|
| `styles.css` | All styles. Section 1 holds the tokens and the colour roles; light and dark mode swap only the roles. Later sections: header, home sections (7), listings (8), product detail (9). Components use roles (`--surface`, `--heading`, …), never raw light colours. |
| `site.js` | Injects the header (utility bar, nav, mega menus, search, theme toggle), mobile drawer, sticky bar, branch picker, footer (after `<main>`) and mockup controls, then wires them. Its `MOCKS` table maps live routes to mockup files: a link to a built page opens it, anything else shows a "not mocked up yet" toast. Add a line there when a page is built. |
| `frames-data.js` | `window.VSLM`: DUMMY frames and sunglasses (same shape as the live `frames` table), `card()`, slugs and URLs, device-only favourites. |
| `listing.js` | `VSLM_LISTING(cfg)`: filters, counts, chips, sort, Saved, load more, URL state and the phone filter panel. Frames and Sunglasses differ only in `cfg` (`items`, `groups`, `tiers`, wording). |
| `admin.js` | The staff area shell for `admin*.html`, used **instead of** `site.js`: top bar, sidebar (a drawer on phones) with the branch switcher (admin picks a branch; staff see their own), branch details, DUMMY drafts, a mockup-only "View as Staff / Admin" switch (`[data-only="admin|staff"]`), and a `guard` hook for unsaved changes. Its `mockFile()` maps admin routes to mockup files. |

Page conventions:
- Each page has the one-line `vslm-theme` script before `styles.css` in `<head>` (applies dark mode before paint).
- `<body data-page="…">` sets the current menu item; content goes in `<main id="main">`.
- Load `site.js` first, then the data and listing scripts, then the page's own script.
- `frame-detail.html` serves both `/frames/<slug>` and `/sunglasses/<slug>` via `?frame=<slug>`.
- `review.html` is the client review pack (not a site page). The client reviewed the mockups live on Google Meet instead, so it wasn't sent; it still lists the missing information.
- **Review notes:** `.todo` tags (dashed gold) and `.mock-only` blocks are notes for the client, hidden by the "Review notes" toggle and never part of the site. Tag every dummy value `DUMMY` with its `docs/dummy-data.md` id.
- **Branch picker:** `data-picker="call|whatsapp"` on any button opens it, and `data-wa-text` prefills the message. `data-dummy` on a link stops a dummy number from dialling.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS, with the design tokens below in the Tailwind config |
| Animation | Framer Motion, fades and slides only |
| Database | Supabase PostgreSQL |
| Files / auth | Supabase Storage (buckets: frames, lenses, camps, gallery); Supabase Auth for the `/admin` area, with two roles: `admin` and `staff` |
| Forms | Server actions + Zod validation |
| Messaging | WhatsApp `wa.me` links. They work with a normal WhatsApp number, so no WhatsApp Business account is needed for launch. No WhatsApp API in the MVP. |
| Favourites | Saved on the device only (`localStorage`), no login |
| Maps | Google Maps embed |
| Testing | Playwright, run at 360 / 768 / 1440 px |
| Hosting | GitHub + DigitalOcean App Platform, auto-deploy from `main` |

### Data security (Supabase)

- Row-level security is on for every table.
- **Roles:** `staff` add and edit content; a frame they add is a `draft`. Only `admin` approves frames, manages staff accounts and deletes content.
- **Public tables** (frames, frame_images, lenses, eye_camps, camp_photos, gallery_photos, testimonials, branches): anyone can read rows where `is_active` / `is_visible` is true (frames: also `status = 'approved'`), and only staff can write.
- **Private tables** (customers, prescriptions, appointments, enquiries, orders): staff-only for both read and write. The public booking form may **insert** into appointments but never select.
- Every form that collects a name and phone needs a consent checkbox (DPDP Act 2023). The site needs a `/privacy` page. Its data-retention period is a `DUMMY` value from `docs/dummy-data.md` until the client confirms it.
- Supabase keys live only in `.env.local` and the DigitalOcean app's environment variables. The service-role key never reaches the browser.

### Frames data

From the client's form (Q20, Q27, Q34, Q37, Q39). It applies to sunglasses too (category = sunglasses).

- **Fields:**
  - frame code, brand, category, model, colour, price (exact ₹), gender, material, size, shape;
  - up to 5 photos;
  - `status`: `draft` → `approved`;
  - `availability`: in stock / sold out. This is separate from `is_active`; sold-out frames stay visible with a "Sold out" label.
  - `available_at`: Indresham / Patelguda / both. There are no stock counts; those belong to the store management system.
- **Customer filters:** brand, price, gender, category, colour, shape, availability. There is no rim-type filter unless the client asks for one.
- **Frame detail:** enquire on WhatsApp, share on WhatsApp, favourite.
- **Photos:** product-only photos. "Model wearing it" photos only with real staff or customers who gave written consent.

## Design system

| Token | Value | Use |
|---|---|---|
| Navy (primary) | `#0D1B2A` | Header, hero, footer, quote band |
| Navy (secondary) | `#1E3A5F` | Cards, hover states, borders |
| Gold (accent) | `#F5C842` | Primary buttons, headline highlight |
| Gold (logo / brass) | `#C9A227` | Logo, thin dividers, icons |
| Cream (background) | `#FAF6EE` | Light page sections |
| Text dark / light | `#1A1A1A` / `#FFFFFF` | Body text on light / dark |
| Heading font | Plus Jakarta Sans, ExtraBold | Headlines |
| Body font | Inter, Regular | Paragraphs, forms |
| Buttons | Pill shape, 48px tall | Gold filled = primary, white outline = secondary |
| Animation: page / section | Fade and slide up on scroll, 300–500 ms | No 3D, respect reduced-motion |
| Animation: menus | Open / close in 300 ms or less | No animation when reduced-motion is on |
| Dark mode: page / sections / cards | `#0A1622` / `#0F1E2E` / `#162B42` | Dark mode only. Text and headings use Cream, accents use Brass and Gold |

**Light and dark mode:**
- Every page has a light and a dark mode. A sun/moon toggle in the header switches them.
- It follows the device setting until the visitor chooses. The choice is saved on the device (`localStorage` `vslm-theme`) and applied in `<head>` before the page draws.
- Components use colour roles (`--bg`, `--bg-alt`, `--surface`, `--text`, `--text-muted`, `--line`, `--heading`, `--accent-ink`, `--btn-ink`, `--pressed-bg` / `--pressed-ink`), never raw light colours, so both modes come from one stylesheet. See `mockups/styles.css` section 1.
- Navy blocks (hero, nav, footer, quote band) and gold buttons look the same in both modes.

**Hero pattern:**
- "Trust / Care / Innovation" eyebrow.
- A headline with a white line, a gold line and a white line.
- A gold "Explore our frames" button and an outline "Book an eye test" button. Only these two.
- "WhatsApp us" and "Visit store" go in quick cards below the hero.
- There is no "Virtual try-on" button until the try-on module exists.
- A navy gradient overlay behind any text on photos.

Use "Since 1999" and compute the years in code. Never hard-code "25 years".

## Navigation

Full spec (mega-menu contents, mobile accordion, sticky bar, behaviour, acceptance criteria): `docs/requirements/Requirements_Navigation.md`.

The logo and a "Home" item both link to `/`. The 8 top-level items, in order (client change 2026-10-21):

1. **Home:** plain link to `/`
2. **About:** plain link to `/about`
3. **Frames:** mega menu
4. **Sunglasses:** mega menu
5. **Lenses:** mega menu
6. **Eye care:** photo cards
7. **Eye camps:** plain link to `/eye-camps`
8. **Contact:** plain link to `/contact`

On the right are the light/dark toggle, Search and WhatsApp icons. There are never cart or account icons. Favourites are a heart on frame cards and frame detail, not a nav icon. To add an item, remove one first.

**Routes:**
- `/`, `/about`, `/frames`, `/frames/[slug]`, `/sunglasses` (frames table, category = sunglasses)
- `/lenses`, `/eye-care`, `/book-eye-test`, `/eye-camps`
- `/gallery`: its own page, linked from About and the footer, not from the top menu
- `/contact`, `/privacy`, `/admin`

Every page shares the utility bar, the nav, and a footer with:
- both branch addresses, hours and phone numbers;
- quick links;
- social links (YouTube, Facebook, Instagram; `DUMMY` URLs until the client sends them);
- the privacy link.

Shop facts, read from the `branches` table (edited by the admin at `/admin/branches`; `src/lib/site-config.ts` holds the seed values):
- **Hours:** 9:00 AM–9:30 PM, Monday–Sunday, both branches.
- **Indresham:** 9550685417 (phone and WhatsApp).
- **Patelguda:** its own number, still `DUMMY` (`docs/dummy-data.md` D2).

## Never do

- Never use stock photos or generated people on the live site. Real people only with written consent.
- Never put `DUMMY` values on the live site.
- Never expose customer, prescription, appointment, enquiry or order data to the public.
- Never hard-code secrets; use environment variables.
- No 3D or heavy animation; fades and slides only.
- Never use colours outside the design-system tokens.
- Always design mobile-first and check at 360 px.

## Repo conventions

`CLAUDE.local.md`, `.claude/settings.local.json` and `.env` / `.env.*` are gitignored. Only `.env.example` is committed.
