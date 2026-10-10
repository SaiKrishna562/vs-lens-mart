# Dummy Data Register

Created 2026-10-09. These are **placeholder values** so mockups and development can go ahead without waiting for the client. None of them are client facts.

## Rules

- Use only the values in this file for missing client details. Don't invent new ones; add them here first.
- Mark every dummy value where it's used: `// DUMMY` in code, a `DUMMY` review tag in mockups.
- **Nothing in this file may go live.** Before launch, every row must be replaced with a client-confirmed value or removed. Tick the **Replaced** box when it is.
- Dummy contact details are deliberately unusable (`.example` domains, `00000` numbers), so no real person gets a customer's email, call or WhatsApp.
- Dummy reviews and people must never appear on the live site (fake reviews, and `CLAUDE.md` bans stock or generated people).

## 1. Confirmed from the prescription card (real, not dummy)

Source: `docs/prescription_card.jpg`, received 2026-10-09.

| Fact | Value | Notes |
|---|---|---|
| Indresham branch number | 9550685417 | Printed on the card next to the Indresham address, so this is Branch 1's number. |
| Branch 1 address spelling | "Plot No. 30/Part Block-B" | Card confirms "Part" (form Q88), not "party". The card itself has typos: "Blok" and survey nos "177, 179, 179". Use 177, 178, 179 from the form. |
| Doctor on the card | Dr. N. Venkateswarlu, MBBS, DO, OSM, Family Physician, Regd No 10837 | Whether he is the founder, an owner or a visiting doctor is unknown. Don't use him in the founder story until confirmed. |
| Prescription fields | Date; Name, Age, Gender; Right eye and Left eye × SPH, CYL, AXIS; rows D.V. (distance) and N.V. (near, "Add"); Additional specifications (free text); lens type: Single Vision / Bifocal / Progressive; signature | Answers Q59. **No PD field on the card**, although Q58 says PD is always used. See contradiction 9. |
| Logo ring text | "CARE · LOVE · QUALITY · FAMILY" | Spelled correctly on the card, unlike `docs/logo.png` ("FAMLY"). The card's logo still isn't a high-res file. |

## 2. Dummy business and contact details

| # | Item | Dummy value | Replaced |
|---|---|---|---|
| D1 | Enquiry email | `info@vslensmart.example` | [ ] |
| D2 | Patelguda branch phone / WhatsApp | `+91 00000 00000` | [ ] |
| D3 | Holidays | Same for both branches; open all year except Diwali day | [ ] |
| D4 | Domain | `vslensmart.example` | [ ] |
| D5 | Instagram / Facebook / YouTube links | `https://example.com/instagram`, `https://example.com/facebook`, `https://example.com/youtube` | [ ] |
| D6 | Google rating shown on site | "4.8 ★ from 120 reviews" (only until Google Business Profiles exist) | [ ] |
| D7 | Eye test price | Free eye test | [ ] |
| D8 | Logo | Use `docs/logo.png` in mockups; redraw as SVG once the spelling is fixed | [ ] |
| D9 | Retention period shown on `/privacy` (website MVP) | Booking and enquiry details are kept for 1 year, then deleted. Customer and prescription records (store system, later) follow X7 | [ ] |

## 3. Dummy content

| # | Item | Dummy value | Replaced |
|---|---|---|---|
| C1 | Founder story | "VS Lens Mart was started in 1999 by **[Founder name]** with one small counter in Indresham and a simple promise: honest advice and careful eye testing for every family. Over the years the shop grew with its customers, and in **[year]** opened its second branch in Patelguda." | [ ] |
| C2 | Founder name / photo | "[Founder name]" and a photo placeholder | [ ] |
| C3 | Second-branch opening year | 2022 | [ ] |
| C4 | Frame brands | Ray-Ban, Vogue Eyewear, Titan, Fastrack, Carrera, IDEE | [ ] |
| C5 | Sunglasses brands | Ray-Ban, Fastrack, Carrera, Oakley | [ ] |
| C6 | Lens brands | Essilor, ZEISS, Hoya, Kodak Lens, Crizal | [ ] |
| C7 | Frame prices | ₹999–₹8,999. Nav tiers: Frames Everyday from ₹999, Premium from ₹3,999, Kids from ₹999; Sunglasses Everyday from ₹999, Branded from ₹2,999 | [ ] |
| C8 | Testimonials (3) | "Sample Customer 1/2/3" with short dummy quotes about careful testing, honest advice and quick fitting | [ ] |
| C9 | Eye camps (2) | Upcoming: "Free Eye Camp, Patelguda", 2026-11-15, 9 AM–1 PM. Past: "Community Eye Camp, Indresham", 2026-08-10, "120 participants" | [ ] |
| C10 | Team | 3 placeholder cards: "Optometrist", "Frame stylist", "Branch manager", no names | [ ] |
| C17 | Eye care health copy | Eye-test steps, "when to get your eyes checked" list, 5–6 eye care tips, and FAQ answers not confirmed by the client (`Requirements_EyeCare.md`). General wording only; **the shop's optometrist must review and approve it before launch** | [ ] |
| C16 | Lens catalogue | About 10 lenses across the C6 brands and the five types, e.g. "Crizal Rock" (single vision), "ZEISS SmartLife Progressive", "Hoya BlueControl" (blue-cut), "Essilor Transitions" (photochromic). Feature tags: Anti-glare, Scratch-resistant, Thin. Prices on some (₹1,200–₹14,000), "Ask for price" on the rest | [ ] |
| C15 | About page timeline | 2010: "[Milestone]" (e.g. new testing equipment); 2016: first community eye camp. Shown between 1999 (confirmed) and 2022 (C3) | [ ] |
| C14 | Sunglasses data | About 16 pairs: brands from C5, prices ₹999–₹8,990, lens types Polarized / UV protection / Tinted / Power sunglasses, lens colours Grey / Green / Brown / Gradient blue, codes `SG-20xx` | [ ] |
| C13 | Frame categories | Eyeglasses · Computer glasses (Sunglasses is its own page). Frame code format `VSF-1024` | [ ] |
| C12 | Homepage hero photo | The photo part of `docs/Premium Eyewear Visionary Hero.png` (AI-generated people), cropped to `mockups/assets/hero-dummy.jpg`. Mockups only; never live | [ ] |
| C11 | Photos | Grey placeholders with a label (already in `mockups/styles.css`). Internet photos only after approval, see section 6 | [ ] |

## 4. Dummy answers to the 8 (+1) contradictions

See `docs/open-questions.md` section 2 for the original answers.

| # | Topic | Dummy decision | Replaced |
|---|---|---|---|
| X1 | Editing prescriptions | Staff enter new prescriptions; only Admin edits a saved one, and each edit keeps the previous version | [ ] |
| X2 | Editing orders | Staff create orders and change their status; only Admin edits amounts or cancels | [ ] |
| X3 | Staff reports and inventory | Staff view and update stock; only Admin sees sales reports | [ ] |
| X4 | Google reviews without a Google profile | Show dummy testimonials (C8) and rating (D6) until profiles exist | [ ] |
| X5 | WhatsApp contact | WhatsApp is the primary contact button | [ ] |
| X6 | Low stock | Below 2 pieces of the same frame model | [ ] |
| X7 | Record retention | Customer and prescription records kept 3 years after the last visit (check DPDP Act before launch) | [ ] |
| X8 | Branch 1 address spelling | **Resolved by the card:** "Part Block-B" | [x] |
| X9 | PD (new): form says always used, card has no field | Record PD as an optional field | [ ] |

## 5. Dummy answers to the 27 blank questions

| Q | Question | Dummy answer | Replaced |
|---|---|---|---|
| 3b | Preferred brand colours | None; keep the `CLAUDE.md` design tokens | [ ] |
| 8 | Homepage headline | "{years} Years of Trust." / "A Clearer Vision" / "for Tomorrow." (white / gold / white, from the design image; years calculated from 1999). Developer decision 2026-10-10; client to confirm | [ ] |
| 10 | Above the fold | Headline, "Since 1999", Explore frames + Book an eye test buttons, WhatsApp button, today's hours | [ ] |
| 59 | Other prescription fields | **Answered by the card** (section 1) | [x] |
| 68 | How advance payment is recorded | Amount, method (Cash / UPI), date, receipt number | [ ] |
| 80 | Appointment notice | At least 2 hours before the slot | [ ] |
| 93 | Which branch has which frames | Every frame can be at both branches; stock is tracked per branch | [ ] |
| 97 | Who organises eye camps | VS Lens Mart with local community groups | [ ] |
| 98 | How often | Once a month | [ ] |
| 102 | Administrator | The shop owner, one Admin account | [ ] |
| 111 | Record who did each action | Yes | [ ] |
| 112 | Audit log actions | Create / edit / delete of frames, prescriptions, orders, payments and staff accounts; logins | [ ] |
| 121 | Other inventory fields | None | [ ] |
| 125 | Most important for staff search | Frame code, brand, colour | [ ] |
| 126 | Existing inventory system | None | [ ] |
| 127 | How inventory is kept now | Paper stock register | [ ] |
| 128 | Biggest stock problem | Not knowing which branch has a frame | [ ] |
| 136 | Who sees customer data | Admin, and staff for their own branch | [ ] |
| 139 | Retention | 3 years after last visit (same as X7) | [ ] |
| 142 | Staff member leaves | Account disabled the same day; their history is kept | [ ] |
| 143 | Who writes website text | Developer drafts, client approves | [ ] |
| 144 | Who provides photos | Client, taken on a phone in the shop | [ ] |
| 145 | Who provides testimonials | Client collects them from customers, with consent | [ ] |
| 149 | Google keywords | optical shop Patancheru, eye test Indresham, spectacles Patelguda, opticians near Ellenki College, sunglasses Sangareddy | [ ] |
| 157 | Domain name | `vslensmart.example` (same as D4) | [ ] |
| 158 | Who owns domain and hosting | Client owns the accounts; developer manages them | [ ] |
| 159 | Who pays | Client | [ ] |
| 160 | Maintenance | Developer fixes bugs for 3 months after launch; staff update content from the admin panel | [ ] |

"Other" was ticked without details in Q35, Q85, Q100, Q104, Q105, Q131 and Q153. Dummy answer for all of them: nothing extra beyond the listed options.

## 6. Dummy photos (not downloaded yet)

Mockups currently use labelled grey placeholders, so no photos are needed yet. If real-looking photos are wanted, these would come from Unsplash (free licence) into `mockups/dummy-photos/`, about 10–12 images of roughly 150–400 KB each, after approval:

- Frames on a plain background (front, side, close-up), sunglasses
- Optical shop interior, frame display wall
- Eye test equipment (phoropter, slit lamp), no faces
- Lenses

Avoid photos of people. Track each downloaded file here with its source URL and licence, and never deploy them.
