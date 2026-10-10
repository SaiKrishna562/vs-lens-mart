# Changelog

All notable changes to the VS Lens Mart website project documentation and plan are recorded here.

New entries go at the top, newest first. Each entry starts with a heading `## YYYY-MM-DD · Phase/Sprint · Area`, followed by **Changed**, **Why** and **Files** lines (see `CLAUDE.md`). The v1.0 and v1.1 entries further down are older, plan-version entries.

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
