# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for **VS Lens Mart**, a family-run optical shop (since 1999) with two branches (Indresham and Patelguda). Brand tone: quality, tradition, family ("Welcome to the Optical Family"). Customers browse and then enquire on WhatsApp or visit a branch. **There is no online checkout.**

Status: planning/design phase. No app code or `package.json` yet, so there are no build/lint/test commands. Add them here once the Next.js app is scaffolded.

Source documents in `docs/`: the project plan (`.docx`, the v1.1 navigation update is the current version), `changelog.md`, `client-answers.md`, `open-questions.md`, the homepage design image, and `vs_lens_mart_navbar_mega_menu.html` (navigation mockup). Per-page requirements go in `docs/requirements/` (`Requirements_<Page>.md`), and HTML mockups for client sign-off go in `mockups/`. Don't invent client facts (prices, brands, founder story, email). Mark unknowns as TODO and check `docs/open-questions.md`.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript, app in `src/` (`src/app`, `src/components`, `src/lib`) |
| Styling | Tailwind CSS, with design tokens below in the Tailwind config |
| Animation | Framer Motion, fades and slides only |
| Database | Supabase PostgreSQL, schema in `supabase/schema.sql` |
| Files / auth | Supabase Storage (buckets: frames, lenses, camps, gallery); Supabase Auth for the staff-only `/admin` |
| Forms | Server actions + Zod validation |
| Messaging | WhatsApp `wa.me` links to 9550685417 (no API in MVP) |
| Maps | Google Maps embed |
| Testing | Playwright in `tests/`, run at 360 / 768 / 1440 px |
| Hosting | GitHub + Netlify, auto-deploy from `main` |

### Data security (Supabase)

- Row-level security is on for every table.
- Public tables (frames, frame_images, lenses, eye_camps, camp_photos, gallery_photos, testimonials, branches): anyone can read rows where `is_active` / `is_visible` is true, and only staff can write.
- customers, prescriptions, appointments, enquiries and orders are staff-only for both read and write. The public booking form may **insert** into appointments but never select.
- Every form that collects a name and phone needs a consent checkbox (DPDP Act 2023). The site needs a `/privacy` page.
- Supabase keys live only in `.env.local` and Netlify env vars. The service-role key never reaches the browser.

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
| Telugu font | Noto Sans Telugu | Telugu language toggle |
| Buttons | Pill shape, 48px tall | Gold filled = primary, white outline = secondary |
| Animation | Fade and slide up on scroll, 300–500 ms | No 3D, respect reduced-motion |

Hero pattern: "Trust / Care / Innovation" eyebrow, headline with a white line, a gold line and a white line, a gold "Explore our frames" button and an outline "Book an eye test" button, and a navy gradient overlay behind text on photos. Use "Since 1999" and compute the years in code. Never hard-code "25 years".

## Navigation (v1.1, product-first mega menu)

| Item | Type | Contents |
|---|---|---|
| Utility bar (top strip) | Always visible | Since 1999 · Open 7 days, 9 AM–9:30 PM · Call 9550685417 · 2 branches · gold "Book an eye test" button |
| Logo | Link to `/` | VS logo + LENS MART, EST. 1999. Replaces the "Home" menu item |
| Frames | Mega menu | Men / Women / Kids photo tiles · Frame type (full rim, half rim, rimless) · Shape · Brands · Price range "from ₹" |
| Sunglasses | Mega menu | Men / Women / Kids tiles · Lens type (polarized, UV, tinted, power sunglasses) · Shape · Price range |
| Lenses | Mega menu | Spectacle lenses (single vision, progressive, bifocal, blue-cut, photochromic) · Contact lenses (daily, monthly, toric, colour) · Reading-power chips · Care · Lens brands |
| Eye care | Photo cards | Book an eye test · Our branches · Eye camps |
| Eye camps | Plain link | `/eye-camps` |
| About | Plain link | `/about`: journey, family, team, Gallery, Reviews (Gallery lives under About) |
| Contact | Plain link | `/contact`: both branches, maps, enquiry form |
| Right side | Icons | Search and WhatsApp (replaces the shopping bag) |

Behaviour rules:
- **Desktop:** mega menus open on hover and on click, and close on Esc or when the mouse leaves. They must be fully keyboard-usable (Tab, Enter, Esc).
- **Mobile:** the hamburger opens a full-screen accordion. Product menus expand with + / −, and plain links go straight to the page. A sticky bottom bar (Call, WhatsApp, Book test) is always visible.
- **Data:** brands, lens brands and "from ₹" prices come from the database. Hide the price column if a category has no products.
- The active page shows a gold underline. Keep to a maximum of 7 top-level items, so remove one before adding one.
- **Never in the menu:** cart, account or wishlist icons, offer columns (unless the client runs real offers), or long brand lists.

Routes: `/`, `/about`, `/frames`, `/frames/[slug]`, `/sunglasses` (frames table, category = sunglasses), `/lenses`, `/eye-care`, `/book-eye-test`, `/eye-camps`, `/gallery`, `/contact`, `/privacy`, `/admin`. Every page shares the utility bar, nav, Telugu/English toggle and a footer with both branch addresses, hours, phone, quick links and privacy link.

## Never do

- Never use stock photos or generated people on the live site.
- Never expose customer, prescription, appointment, enquiry or order data to the public.
- Never hard-code secrets; use environment variables.
- Always design mobile-first and check at 360 px.
- Follow the design system tokens; don't invent new colours.
- No 3D or heavy animation; fades and slides only.

## Repo conventions

`CLAUDE.local.md`, `.claude/settings.local.json` and `.env` / `.env.*` are gitignored. Only `.env.example` is committed.
