# Requirements: Navigation

Status: Draft for client review
Plan version: v1.1 (navigation update)
Sources: project plan v1.1 section 3 "Navigation bar (mega menu)", `docs/client-answers.md`, homepage design image (`docs/Premium Eyewear Visionary Hero.png`), navigation mockup (`docs/vs_lens_mart_navbar_mega_menu.html`), `CLAUDE.md`

## 1. Purpose

The navigation sits on every page. It must let customers:
- find frames, sunglasses and lenses in one or two clicks;
- book an eye test or contact the shop on WhatsApp from anywhere on the site.

It has to look like the approved homepage design: a dark navy bar, gold accents and a gold underline on the active item. There is no online checkout, so there is no cart, account or wishlist.

## 2. Structure overview

From top to bottom:

1. **Utility bar:** a thin strip with shop facts and the main call to action.
2. **Main navigation bar:** the logo, 7 top-level menu items, and Search and WhatsApp icons.
3. **Mega menu panel** (desktop): opens under the bar for Frames, Sunglasses, Lenses and Eye care.
4. **Mobile only:** a hamburger that opens a full-screen accordion, plus a sticky bottom action bar.

## 3. Utility bar

Always visible above the main navigation on desktop.

| Item | Content | Source / status |
|---|---|---|
| Legacy | "Since 1999" | Plan. Don't show "25 years" or "27 years" (see TODO below). |
| Hours | "Open 7 days, 9 AM–9:30 PM" | Client: Monday–Sunday, 9:00 AM–9:30 PM. **TODO (client):** the plan's open questions ask whether opening is 9:00 or 9:30 AM. |
| Phone | "Call 9550685417", a click-to-call `tel:` link | Client |
| Branches | "2 branches", linking to the branch section on `/contact` | Plan |
| CTA | Gold pill "Book an eye test" button, linking to `/book-eye-test` | Plan, design system |

- **TODO (client):** is 9550685417 the number for both branches, or does each branch have its own?
- **TODO (client):** final legacy wording ("Vision of 25 years" vs 27 years vs "Since 1999"). Until it's answered, use "Since 1999". Any year count must be calculated in code from 1999.
- **TODO (design):** on mobile the utility bar's content moves to the sticky bottom bar (section 7). Decide whether a shortened utility bar (for example "Since 1999 · Open 7 days") still shows at 360 px, or whether it hides.

## 4. Main navigation bar

### 4.1 Left: logo

- The VS logo plus "LENS MART" and "EST. 1999" link to `/`. The logo replaces a "Home" menu item.
- **TODO (client):** final logo file. The design shows the tagline "THE VISION OF TOMORROW". The client's answer to the "INOVATION" spelling question was only "VS Lens Mart", so confirm the final logo artwork and tagline before use.

### 4.2 Centre: 7 top-level items

| # | Item | Type | Destination |
|---|---|---|---|
| 1 | Frames | Mega menu | `/frames` |
| 2 | Sunglasses | Mega menu | `/sunglasses` |
| 3 | Lenses | Mega menu | `/lenses` |
| 4 | Eye care | Photo-card menu | `/eye-care` |
| 5 | Eye camps | Plain link | `/eye-camps` |
| 6 | About | Plain link | `/about` (Our journey, family, team, Gallery, Reviews) |
| 7 | Contact | Plain link | `/contact` (both branches, maps, enquiry form) |

- No more than 7 top-level items. Adding an item means removing one.
- Gallery is not a top-level item. It's reached from the About page, and `/gallery` stays a valid page.

**Differences from the homepage design image:**
- The image shows a dropdown arrow on "Eye camps". In v1.1 it's a plain link with no dropdown.
- The image shows a shopping-bag icon. Replace it with WhatsApp (section 4.3).

### 4.3 Right: icons

| Icon | Behaviour |
|---|---|
| Search | Opens site search across frames, sunglasses and lenses. **TODO (dev):** decide the search behaviour, for example an overlay with results from the frames and lenses tables. |
| WhatsApp | Opens `https://wa.me/919550685417` in a new tab. It replaces the shopping bag. |

Never show cart, account or wishlist icons.

### 4.4 Telugu / English toggle

Every page needs the toggle (plan: global elements). **TODO (design):** decide where it sits, either the utility bar or the right-side icons. Only the toggle is MVP: translating every page into Telugu is a later module.

## 5. Mega menu contents (desktop)

General rules:
- Each column heading is a link to the matching listing page with that filter applied.
- Each mega menu ends with a "View all …" link.
- Brands, lens brands and "from ₹" prices are read from the database, so they update when staff upload products.
- If a category has no active products, hide its price row or column. Never show "₹0" or placeholder prices.

### 5.1 Frames

| Column | Items | Data |
|---|---|---|
| Shop for | Men · Women · Kids (photo tiles) | Static labels. **TODO (client):** real photos for each tile, with no stock photos of people. |
| Frame type | Full rim · Half rim · Rimless | Static |
| Shape | Rectangle · Square · Round · Cat-eye · Aviator | Static list from the mockup. **TODO (client):** confirm the shapes stocked. |
| Brands | A short list of brands and an "All brands →" link | Database (`frames`). **TODO (client):** frame brands stocked. The client hasn't named any. |
| Price range | Everyday "from ₹…" · Premium "from ₹…" · Kids "from ₹…" | The minimum price per tier from the database. **TODO (client):** tier names and price boundaries. The client has confirmed prices are shown on the site. |

Ends with "View all frames →", linking to `/frames`.

### 5.2 Sunglasses

| Column | Items | Data |
|---|---|---|
| Shop for | Men · Women · Kids (photo tiles) | Static labels. **TODO (client):** photos. |
| Lens type | Polarized · UV protection · Tinted · Power sunglasses | Static |
| Shape | Aviator · Wayfarer · Round · Square | Static list from the mockup. **TODO (client):** confirm. |
| Price range | Everyday "from ₹…" · Branded "from ₹…" | Database (`frames` where category = sunglasses). **TODO (client):** tiers. |

Ends with "View all sunglasses →", linking to `/sunglasses`.

### 5.3 Lenses

| Column | Items | Data |
|---|---|---|
| Spectacle lenses | Single vision · Progressive · Bifocal · Blue-cut / computer · Photochromic | Static |
| Contact lenses | Daily · Monthly · Toric · Colour | Static. **TODO (client):** confirm which types are stocked. |
| Reading glasses | Power chips, for example +1.0 to +2.5 as in the mockup | **TODO (client):** the reading powers actually stocked. |
| Care | Solutions and accessories | Static. **TODO (client):** confirm care products are sold. |
| All branded lenses | Lens brand names, plus "Not sure? Book an eye test →" | Database (`lenses`). The client says "All branded lenses available". **TODO (client):** the actual brand names. Don't list any brand until it's provided. |

### 5.4 Eye care (photo cards)

Three cards:
1. Book an eye test, linking to `/book-eye-test`
2. Our branches, linking to `/contact`
3. Eye camps, linking to `/eye-camps`

**TODO (client):** real photos of the test room, each storefront and a past eye camp. The mockup uses icons as placeholders.

**TODO (client):** is the eye test free? Card copy must not say "free" until this is confirmed.

## 6. Mobile accordion menu

- The bar shows the logo, the hamburger and the WhatsApp icon. The 7 items are hidden behind the hamburger.
- The hamburger opens a **full-screen** menu with a navy background and the design-system typography.
- The four mega-menu items (Frames, Sunglasses, Lenses, Eye care) show their column links stacked, opening with **+** and closing with **−**. Only one section is open at a time.
- The plain links (Eye camps, About, Contact) go straight to the page.
- The menu closes when a link is followed, when the close button is pressed, or when Esc is pressed on a connected keyboard.
- Page scroll is locked while the menu is open.
- Brand and price rows follow the same database rules as on desktop (section 5).

## 7. Sticky bottom bar (mobile)

Always visible at the bottom of the screen on mobile, below the tablet breakpoint.

| Button | Action |
|---|---|
| Call | `tel:9550685417` |
| WhatsApp | `https://wa.me/919550685417` |
| Book test | `/book-eye-test` |

- It must not cover page content. Pages need bottom padding equal to the bar's height.
- It stays visible while the accordion menu is open.
- **TODO (client):** if each branch has its own number (section 3), decide whether Call opens a branch picker.

## 8. Behaviour and accessibility

- **Desktop:** mega menus open on hover and on click or Enter. They close on Esc, when the mouse leaves the menu and panel, or when another top-level item opens.
- **Keyboard:** Tab moves through the top-level items. Enter or Space opens a mega menu, and focus can move into the panel. Esc closes the panel and returns focus to its trigger.
- **Screen readers:** triggers use `aria-expanded` and `aria-controls`. Panels are real lists of links. Icon buttons have accessible labels ("Search", "Chat on WhatsApp", "Open menu").
- **Active page:** the current section shows the gold underline from the design.
- **Animation:** panels fade and slide in over 300 ms or less. There is no animation when the user's system is set to reduced motion.
- **Colours and type:** use only design-system tokens (`CLAUDE.md`), with navy `#0D1B2A` for the bar, gold `#F5C842` for the active underline and CTA, and white text.
- **Touch targets:** at least 44 × 44 px. Buttons are pill-shaped and 48 px tall.

## 9. Acceptance criteria

Done when:

1. Every page shows the utility bar, the main bar with exactly 7 top-level items in the order in section 4.2, and the footer.
2. The logo links to `/`, and there's no "Home" menu item.
3. There are no cart, account or wishlist icons anywhere. The WhatsApp icon opens a chat with 9550685417.
4. "Book an eye test" in the utility bar goes to `/book-eye-test`.
5. **Desktop (1440 px):**
   - Frames, Sunglasses, Lenses and Eye care each open a panel on hover and on click.
   - Each panel closes on Esc and when the mouse leaves.
   - Eye camps, About and Contact navigate directly.
6. **Keyboard only:** every menu item and panel link can be reached and used with Tab, Enter and Esc, with visible focus styles.
7. **Mobile (360 px):**
   - The hamburger opens a full-screen accordion. Product sections expand and collapse with + / −. Plain links navigate.
   - There's no horizontal scrolling.
8. **Mobile sticky bar:** at 360 px the Call, WhatsApp and Book test buttons are always visible and work. Page content isn't hidden behind the bar.
9. **Product data:**
   - Brands, lens brands and "from ₹" prices in the menus come from the database. Adding an active frame in admin updates the menu without a code change.
   - A category with no products shows no price.
10. **No invented data:** no brand names, prices, reading powers or "free eye test" claims appear unless they come from the client or the database.
11. **Legacy wording:** the site never says "25 years". Any year count is calculated from 1999.
12. **Active page:** the active top-level item shows the gold underline on its section's pages.
13. **Tests:** Playwright tests at 360, 768 and 1440 px cover:
    - mega menus with mouse and keyboard;
    - the mobile accordion;
    - the sticky bar;
    - the WhatsApp and phone links.

    The tests pass with no console errors.
14. **Reduced motion:** with reduced motion on, menus open without animation.

## 10. Open items summary

| Item | Owner |
|---|---|
| Opening time: 9:00 AM or 9:30 AM | Client |
| Same phone/WhatsApp number for both branches? | Client |
| "Since 1999" vs "25/27 years" wording | Client |
| Final logo file and tagline | Client |
| Frame brands and lens brand names | Client, then entered by staff in admin |
| Price tiers and "from ₹" boundaries | Client |
| Shapes, contact lens types, reading powers and care products stocked | Client |
| Is the eye test free? | Client |
| Real photos for Men/Women/Kids tiles and Eye care cards | Client |
| Search behaviour | Developer |
| Telugu toggle placement; utility bar on mobile | Developer / design |
