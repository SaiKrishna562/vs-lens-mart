# ROADMAP

VS Lens Mart website: MVP vs later modules, build order, and sprints. This follows the v1.1 navigation update of the project plan.

Sources: `CLAUDE.md`, `docs/requirements/Requirements_Navigation.md`, `docs/client-answers.md`, and the v1.1 project plan. Navigation is the only page with a requirements file so far. Write each page's `docs/requirements/Requirements_<Page>.md` before its sprint starts.

## 1. MVP (first launch)

| Area | Features |
|---|---|
| Foundation | Next.js + TypeScript + Tailwind with design tokens and fonts; Supabase project; `supabase/schema.sql` with row-level security on every table; storage buckets (frames, lenses, camps, gallery); staff login; Netlify preview deploys; Playwright setup |
| Layout | Utility bar, v1.1 mega-menu navigation, mobile accordion, sticky Call / WhatsApp / Book bar, footer |
| Products | `/frames` with filters, `/frames/[slug]`, `/sunglasses`, `/lenses`; admin add/edit with photo upload |
| Customer actions | `/book-eye-test` (appointments insert-only), enquiry form on `/contact`, branches with maps, prefilled WhatsApp links, consent checkboxes, `/privacy` |
| Content | `/eye-care` (static), `/eye-camps` (upcoming and past, plus detail pages), `/gallery`, testimonials, `/about` journey timeline; admin for each |
| Home | All 13 sections, with the database-driven ones (featured frames, eye camps, reviews, branches) wired to live data |
| Polish | SEO titles, Open Graph images, alt text, loading states, 404 page, basic search (frames and lenses by name or brand), Lighthouse pass |

## 2. Later modules

| Module | Why later / dependency |
|---|---|
| Customer and prescription records (counter use) | Needs the client's sample prescription card. Uses the private `customers` and `prescriptions` tables. |
| WhatsApp/SMS reminders for check-ups and pickups | The client said yes. Needs a WhatsApp Business API provider, and the customer records module first. |
| Orders tracking | Depends on customer records. |
| Email alerts for bookings and enquiries | Waiting on the client's enquiry email address. |
| Virtual try-on | Research first: MediaPipe face tracking or a paid SDK, a QR code per frame, an in-store screen. |

## 3. Dependencies (build order)

```
Foundation (schema + row-level security, auth, buckets, tokens)
 ├─> Layout/nav ─────────────> every page
 │     (mega-menu brands and prices: hidden until products exist)
 ├─> Staff login ─> Admin shell ─> Frames admin + upload
 │        ├─> /frames, /frames/[slug], /sunglasses
 │        ├─> nav brands / "from ₹"
 │        └─> Home "featured frames"
 ├─> branches table ─> footer, /contact, booking branch picker, Eye care cards
 ├─> appointments (insert-only) + consent + /privacy ─> /book-eye-test
 ├─> enquiries + consent + /privacy ─> contact enquiry form
 ├─> Lenses admin ─> /lenses, nav lens brands
 ├─> Eye camps admin ─> /eye-camps, Home camps section
 ├─> Gallery admin ─> /gallery (linked from /about)
 └─> Testimonials admin ─> /about reviews, Home reviews
Mockups signed off (Phase 3) ─> each page sprint
```

Client inputs block **launch**, not building (see `docs/open-questions.md`):
- **Content:** photos, frame and lens brands, the "Since 1999" / years wording, the founder story.
- **Contact details:** opening time (9:00 or 9:30 AM), the phone number for each branch, the enquiry email.
- **Branding:** the final logo, and whether the eye test is free.

## 4. Sprints and rough effort

Estimates assume one part-time developer.

| Sprint | Scope | Done when | Effort |
|---|---|---|---|
| S0 Foundation | Scaffold, Tailwind tokens and fonts, `schema.sql` with row-level security, buckets, staff login, `.env.example`, Netlify preview, Playwright config | A logged-out user can't read any private table; the preview deploys | 2–3 days |
| S1 Layout + nav | Everything in `Requirements_Navigation.md`, plus the footer | Navigation acceptance criteria pass at 360 / 768 / 1440 px | 3–4 days |
| S2 Admin + frames | Admin shell, frames and sunglasses add/edit with upload (size and type checks), listing filters, detail page, nav data hookup | Staff upload a frame on a phone and it appears in the listing and the nav | 4–5 days |
| S3 Booking + contact | Branches, maps, booking form, enquiry form, WhatsApp prefill, consent, `/privacy` | A booking is saved, a logged-out user can't read it, and WhatsApp opens | 2–3 days |
| S4 Content modules | Lenses, eye care, eye camps, gallery, testimonials, about (admin and public pages) | Staff can add each content type | 4–5 days |
| S5 Home | All 13 sections, wired to live data | Matches the signed-off mockup | 2–3 days |
| S6 Polish | SEO, Open Graph, alt text, loading states, 404, search, Lighthouse | Lighthouse checks pass, no console errors | 2–3 days |

The total is about 19–26 working days, roughly 4–5 weeks part-time.

### Changes from the v1.1 plan

- **Home moves after the content modules.** Its database sections can then be built once, against real tables.
- **S0 Foundation is a sprint of its own.** Row-level security then exists before any form or admin page.
- **The estimate is longer.** 19–26 days is a little over the plan's 3–4 weeks.
- **A basic search is in the MVP.** The navigation requirements left its behaviour open.
- **Telugu is dropped.** The language toggle and the Telugu translation are not in this roadmap.
