# ROADMAP

VS Lens Mart website: MVP vs later modules, sprints, and build order. It's based on the Phase 5 sprint table of the project plan (v1.1 navigation update), with the changes agreed in the Phase 2 planning session (section 6).

Sources: `CLAUDE.md`, `docs/requirements/Requirements_Navigation.md`, `docs/client-answers.md`, and the v1.1 project plan. Navigation is the only page with a requirements file so far. Write each page's `docs/requirements/Requirements_<Page>.md` before its sprint starts.

## 1. MVP (first launch)

- Home
- Navigation with mega menus
- About / Our Journey
- Frames, plus frame detail
- Sunglasses
- Lenses
- Eye Care
- Book an eye test
- Eye Camps
- Gallery
- Contact
- Privacy policy
- Admin panel: frames, lenses, camps, gallery, reviews, bookings
- Basic search of frames and lenses by name or brand (added, see section 6)

## 2. Later modules

| Module | Why later / dependency |
|---|---|
| Customer and prescription records (counter use) | Needs the client's sample prescription card. Uses the private `customers` and `prescriptions` tables. |
| WhatsApp/SMS reminders for check-ups and pickups | The client said yes. Needs a WhatsApp Business API provider, and the customer records module first. |
| Orders tracking | Depends on customer records. |
| Email alerts for bookings and enquiries | Waiting on the client's enquiry email address. |
| Virtual try-on | Research first: MediaPipe face tracking or a paid SDK, a QR code per frame, an in-store screen. |
| Telugu (possible) | Not in the MVP, possibly later. It was the developer's suggestion; the client never asked for it. Revisit only if the client requests it. |

## 3. Before the sprints: Foundation (Phase 4)

| Scope | Done when | Effort |
|---|---|---|
| Next.js + TypeScript + Tailwind; design tokens and fonts in the Tailwind config; Supabase project; `supabase/schema.sql` with row-level security on every table; storage buckets (frames, lenses, camps, gallery); staff login; `.env.example`; Netlify preview deploy; Playwright config | A logged-out user can't read any private table, and the preview deploys | 2–3 days |

## 4. Sprints (Phase 5)

Sprints keep the plan's numbers, but they are **built in this order: 5.1 → 5.3 → 5.4 → 5.5 → 5.2 → 5.6** (see section 6). Estimates assume one part-time developer.

| Sprint | Features | Done when | Effort |
|---|---|---|---|
| 5.1 Layout | Utility bar; mega-menu navigation (brands and prices from the database); mobile accordion menu; sticky Call / WhatsApp / Book bar; footer; design tokens; fonts | Every page shares the layout, the menus work by mouse, touch and keyboard, and it works at 360 px | 3–4 days |
| 5.2 Home | All 13 homepage sections, with the database sections (featured frames, eye camps, reviews, branches) wired to live data | It matches the signed-off mockup | 2–3 days |
| 5.3 Admin + frames | Staff login, add/edit frames and sunglasses with photo upload (size and type checks), Frames page with filters, Sunglasses page, Frame detail, nav brand and price hookup | Staff upload a frame on a phone and it appears on the site | 4–5 days |
| 5.4 Booking + contact | Book an eye test, enquiry form, branches with maps, prefilled WhatsApp links, consent checkboxes, privacy policy | A booking is saved, a logged-out user can't read it, and the WhatsApp message opens | 2–3 days |
| 5.5 Content modules | Lenses, eye care, eye camps, gallery, testimonials (admin and public pages), About / Journey timeline | Staff can add each type of content | 4–5 days |
| 5.6 Polish | SEO titles, Open Graph images, alt text, loading states, 404 page, basic search | Lighthouse checks pass, with no console errors | 2–3 days |

The total, including Foundation, is about 19–26 working days, roughly 4–5 weeks part-time.

## 5. Dependencies

```
Foundation (schema + row-level security, auth, buckets, tokens)
 ├─> 5.1 Layout/nav ─────────> every page
 │     (mega-menu brands and prices: hidden until products exist)
 ├─> Staff login ─> Admin shell ─> 5.3 Frames admin + upload
 │        ├─> /frames, /frames/[slug], /sunglasses
 │        ├─> nav brands / "from ₹"
 │        └─> 5.2 Home "featured frames"
 ├─> branches table ─> footer, /contact, booking branch picker, Eye care cards
 ├─> appointments (insert-only) + consent + /privacy ─> /book-eye-test
 ├─> enquiries + consent + /privacy ─> contact enquiry form
 ├─> 5.5 Lenses admin ─> /lenses, nav lens brands
 ├─> 5.5 Eye camps admin ─> /eye-camps, 5.2 Home camps section
 ├─> 5.5 Gallery admin ─> /gallery (linked from /about)
 └─> 5.5 Testimonials admin ─> /about reviews, 5.2 Home reviews
Mockups signed off (Phase 3) ─> each page's sprint
```

Client inputs block **launch**, not building (see `docs/open-questions.md`):
- **Content:** photos, frame and lens brands, the "Since 1999" / years wording, the founder story.
- **Contact details:** opening time (9:00 or 9:30 AM), the phone number for each branch, the enquiry email.
- **Branding:** the final logo, and whether the eye test is free.

## 6. Changes from the plan (agreed in Phase 2)

| Change | Plan said | Roadmap says | Why |
|---|---|---|---|
| Foundation step | Part of Phase 4 | A separate step before 5.1, with "done when" and effort | Row-level security has to exist before any form or admin page |
| Home order | 5.2, built second, static content first | Still 5.2, but built after 5.5 | Its database sections can then be built once against real tables, not built static and redone |
| Sunglasses | Not in the sprint table | Added to 5.3 | It shares the frames table and admin (category = sunglasses) |
| Search | Not scheduled; the nav requirements left it as a developer TODO | Basic search in 5.6 | The search icon is in the v1.1 nav |
| Telugu | Toggle in 5.6; full translation later | Not in the MVP, possibly later: no toggle, font or translation in any sprint | It was the developer's suggestion, and the client never asked for it. It's recorded in the changelog and will go into plan v1.2. |
| Estimate | 3–4 weeks of development | About 19–26 days including Foundation | More realistic for one part-time developer; flag this to the client |
