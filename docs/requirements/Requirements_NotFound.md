# Requirements: Page not found (404) and error page

Status: Approved by the client 2026-10-21 (mockups reviewed together on Google Meet; changes applied).
Route: any unknown URL (Next.js `src/app/not-found.tsx`); errors while a page loads (`src/app/error.tsx`)
Plan version: v1.2 (not in the 14 planned mockups; a suggested extra, like `/privacy`)
Sources:
- `docs/requirements/Requirements_Frames.md` ("Missing frame": "This frame isn't available", a 404) and `Requirements_EyeCamps.md` ("Missing camp")
- `docs/requirements/Requirements_Navigation.md` (shared header, search, sticky bar)
- `CLAUDE.md` (brand tone; WhatsApp is the main contact)

## 1. Purpose

When someone follows an old link, mistypes an address or opens a frame that's been removed, they should land on a friendly page that gets them back to frames, a booking or the shop in one tap, not a dead end. The same layout covers the rare case when a page fails to load.

## 2. The 404 page

| # | Part | Content |
|---|---|---|
| 1 | Shared layout | The normal header, footer and sticky Call / WhatsApp / Book bar, so the menu still works |
| 2 | Message | Glasses icon; eyebrow "404"; `h1` "This page is a little out of focus."; "We couldn't find the page you were looking for. It may have moved, or the link may be wrong." |
| 3 | Search | A search field ("Search frames, sunglasses and lenses"), the same search as the header (`/search`, sprint 5.6) |
| 4 | Where to next | Four cards: **Frames** (`/frames`), **Sunglasses** (`/sunglasses`), **Book an eye test** (`/book-eye-test`), **Visit a branch** (`/contact#branches`) |
| 5 | Help | "Still can't find it? Ask us on WhatsApp" (branch picker, prefilled "Hi VS Lens Mart, I was looking for a page on your website: [address]") and "Back to home" |

- **Smart hint:** when the missing address starts with `/frames/` or `/sunglasses/`, the message becomes "This frame isn't available. It may have been sold or removed." and the first card is "See all frames" (or sunglasses). The same for `/eye-camps/` ("This camp isn't available"). This matches the existing frame and camp detail requirements.
- **No guessing redirects:** we don't send people to a "closest match" automatically; the hint and search do that job.
- **Old URLs:** if the shop had an earlier website, its main addresses go in `netlify.toml` as 301 redirects. **TODO (client):** is there an old site or printed QR codes with links?

## 3. The error page ("Something went wrong")

The same layout and cards, with:
- `h1` "Something went wrong on our side."; "Please try again. If it keeps happening, call or WhatsApp us and we'll help straight away."
- A **Try again** button (re-loads the part of the page that failed), plus the WhatsApp and Call buttons.
- No technical details for customers. The real error goes to the server log only.

## 4. Behaviour and accessibility

- **Status codes:** the 404 page returns HTTP **404** (not 200), so Google drops dead links; the error page returns **500**. Both are `noindex`.
- **Title:** "Page not found | VS Lens Mart" and "Something went wrong | VS Lens Mart".
- **Focus:** the `h1` is the first heading; the search field isn't auto-focused (it would open the phone keyboard).
- **Light / dark mode:** shared colour roles; reuses the `.notfound` style from the frame and camp detail pages.
- **No animation** beyond the normal fade-in; none with reduced motion.
- **Admin:** unknown `/admin/...` addresses show a short "Page not found" inside the staff area shell (link back to the dashboard), never the public page; signed-out visitors are sent to `/admin/login` first.

## 5. Acceptance criteria

Done when:

1. Any unknown address shows the 404 page with the shared header, footer and sticky bar, and returns HTTP 404 (checked in Playwright).
2. The four cards, search, WhatsApp (prefilled with the address) and "Back to home" all work at 360 px and on desktop.
3. A removed or draft frame address shows the frame hint and "See all frames"; a missing camp shows the camp hint.
4. A page error shows "Something went wrong" with Try again, WhatsApp and Call, returns 500, and shows no technical details.
5. Both pages are `noindex`, readable in light and dark mode, keyboard-accessible, with no horizontal scroll and no console errors.

## 6. Open items

| Item | Owner | Mockup uses |
|---|---|---|
| Old website or printed links/QR codes that need redirects | Client | None |
| Headline wording ("a little out of focus") | Client | As written |
