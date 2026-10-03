# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for **VS Lens Mart**, a family-run optical shop (since 1999) with two branches (Indresham and Patelguda). Brand tone: warm, traditional, trustworthy family business; quality first ("Welcome to the Optical Family"). Customers browse and then enquire on WhatsApp or visit a branch. **There is no online checkout.**

Status: planning/design phase. No app code or `package.json` yet, so there are no build/lint/test commands. Add them here once the Next.js app is scaffolded.

Don't invent client facts (prices, brands, founder story, email, hours, phone numbers). Mark unknowns as `TODO (client)` and check `docs/open-questions.md`.

### Scope

- MVP vs later modules and sprint order: `ROADMAP.md`.
- **Telugu:** not in the MVP, possibly later. Build no language toggle, Telugu font or translations unless `ROADMAP.md` adds them.

## Source of truth

When documents disagree, the higher one wins:

1. `CLAUDE.md`: global rules
2. `ROADMAP.md`: scope
3. `docs/requirements/Requirements_<Page>.md`: page details
4. `docs/plan/VS_Lens_Mart_Plan_v1.1.docx`: background only. Older versions are in `docs/plan/archive/`; don't use them.

Other docs:
- `docs/client-answers.md` and `docs/open-questions.md`: what the client has and hasn't confirmed.
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
| Shop facts (hours, phone, WhatsApp, addresses) | `src/lib/site-config.ts` only. Never hard-code them in components. |
| Database schema and row-level security | `supabase/schema.sql` |
| Playwright tests | `tests/` |
| HTML mockups for client sign-off | `mockups/` |
| Requirements | `docs/requirements/Requirements_<Page>.md` |

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS, with the design tokens below in the Tailwind config |
| Animation | Framer Motion, fades and slides only |
| Database | Supabase PostgreSQL |
| Files / auth | Supabase Storage (buckets: frames, lenses, camps, gallery); Supabase Auth for the staff-only `/admin` |
| Forms | Server actions + Zod validation |
| Messaging | WhatsApp `wa.me` links (no API in MVP) |
| Maps | Google Maps embed |
| Testing | Playwright, run at 360 / 768 / 1440 px |
| Hosting | GitHub + Netlify, auto-deploy from `main` |

### Data security (Supabase)

- Row-level security is on for every table.
- **Public tables** (frames, frame_images, lenses, eye_camps, camp_photos, gallery_photos, testimonials, branches): anyone can read rows where `is_active` / `is_visible` is true, and only staff can write.
- **Private tables** (customers, prescriptions, appointments, enquiries, orders): staff-only for both read and write. The public booking form may **insert** into appointments but never select.
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
| Buttons | Pill shape, 48px tall | Gold filled = primary, white outline = secondary |
| Animation: page / section | Fade and slide up on scroll, 300–500 ms | No 3D, respect reduced-motion |
| Animation: menus | Open / close in 300 ms or less | No animation when reduced-motion is on |

**Hero pattern:**
- "Trust / Care / Innovation" eyebrow.
- A headline with a white line, a gold line and a white line.
- A gold "Explore our frames" button and an outline "Book an eye test" button.
- A navy gradient overlay behind any text on photos.

Use "Since 1999" and compute the years in code. Never hard-code "25 years".

## Navigation

Full spec (mega-menu contents, mobile accordion, sticky bar, behaviour, acceptance criteria): `docs/requirements/Requirements_Navigation.md`.

The logo links to `/`; there's no "Home" item. The 7 top-level items, in order:

1. **Frames:** mega menu
2. **Sunglasses:** mega menu
3. **Lenses:** mega menu
4. **Eye care:** photo cards
5. **Eye camps:** plain link to `/eye-camps`
6. **About:** plain link to `/about`
7. **Contact:** plain link to `/contact`

On the right are Search and WhatsApp icons. There are never cart, account or wishlist icons. To add an item, remove one first.

**Routes:**
- `/`, `/about`, `/frames`, `/frames/[slug]`, `/sunglasses` (frames table, category = sunglasses)
- `/lenses`, `/eye-care`, `/book-eye-test`, `/eye-camps`
- `/gallery`: its own page, linked from About and the footer, not from the top menu
- `/contact`, `/privacy`, `/admin`

Every page shares the utility bar, the nav, and a footer with both branch addresses, hours, phone, quick links and the privacy link. Hours and phone are `TODO (client)`: the opening time (9:00 or 9:30 AM) and whether both branches share 9550685417 are both unconfirmed. They're read from `src/lib/site-config.ts`.

## Never do

- Never use stock photos or generated people on the live site.
- Never expose customer, prescription, appointment, enquiry or order data to the public.
- Never hard-code secrets; use environment variables.
- No 3D or heavy animation; fades and slides only.
- Never use colours outside the design-system tokens.
- Always design mobile-first and check at 360 px.

## Repo conventions

`CLAUDE.local.md`, `.claude/settings.local.json` and `.env` / `.env.*` are gitignored. Only `.env.example` is committed.
