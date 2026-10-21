# Requirements: Admin (staff area)

Status: Approved by the client 2026-10-21 (mockups reviewed together on Google Meet; changes applied).
Route: `/admin` (staff only; not linked from the public site)
Plan version: v1.2 (pages table: "Admin and staff logins: staff add frames as drafts, admin approves; manage lenses, camps, gallery, reviews, bookings"; sprints 5.3 and 5.5)
Sources:
- `docs/client-answers.md`: form Q32–39 (frame photos and uploads), Q100–101 (camp fields), Q102–112 (staff and roles), Q137 (different access levels), Q146 (customer photo permission), Q148 (admins maintain the site)
- `CLAUDE.md` ("Data security", "Frames data")
- `ROADMAP.md`: sprint 5.3 (admin + frames), 5.4 (bookings, enquiries), 5.5 (content modules); section 7 (store management system, later)
- Data sections of `Requirements_Frames.md`, `Requirements_Sunglasses.md`, `Requirements_Lenses.md`, `Requirements_EyeCamps.md`, `Requirements_Gallery.md`, `Requirements_Booking.md`, `Requirements_Contact.md`
- `docs/dummy-data.md`

**Dummy values:** where the client hasn't answered, mockups and development use the `DUMMY` values from `docs/dummy-data.md`, visibly tagged. They never go live. "TODO (client)" means the real value is still needed before launch.

**Security first:** this is the only part of the site that can change content or read customer data. Build it in Plan Mode with high effort.
- Better Auth login (email + password); no public sign-up.
- Every rule is enforced by row-level security in the database, not only by hiding buttons.
- The browser never talks to the database; database passwords and the auth secret stay on the server.

## 1. Purpose and scope

Let the shop's staff keep the website up to date from a phone or the shop computer, without a developer:
- add frames and sunglasses (with photos taken on a phone), lenses, eye camps, gallery photos and testimonials;
- see eye-test bookings and enquiries, and mark them as handled.

An admin approves new frames before customers see them (Q37).

**Not in the website admin (store management system, later phase, `ROADMAP.md` section 7):** customers, prescriptions, orders, inventory counts, billing, sales reports, the full audit log, automatic WhatsApp messages. The admin area must not grow into these before launch.

## 2. Roles

Two roles from the start (`CLAUDE.md`). Approval needs one person to upload and another to approve.

| Can… | Staff | Admin |
|---|---|---|
| Sign in, see the dashboard | ✓ | ✓ |
| Add and edit frames, sunglasses, lenses, camps, gallery photos, testimonials | ✓ (new frames are **drafts**) | ✓ |
| Mark a frame sold out / in stock, change "Available at" | ✓ | ✓ |
| Hide content (set inactive) | ✓ | ✓ |
| **Approve** or send back a draft frame | | ✓ |
| **Delete** content | | ✓ |
| See and update bookings and enquiries | ✓ | ✓ |
| Delete a booking or enquiry | | ✓ |
| Set branch holidays (closed days) | | ✓ |
| Edit branch address, phone, WhatsApp, hours (`/admin/branches`) | (read only) | ✓ |
| Switch the branch they're working on | (fixed to home branch) | ✓ |
| Add, disable and reset staff accounts | | ✓ |

- **Q38 says staff can delete frame information.** `CLAUDE.md` says only admin deletes. Staff can **hide** a frame instead, which removes it from the site straight away; admin deletes. **TODO (client):** confirm this is acceptable.
- An admin can also approve their own draft, for days when they're the only one at work.
- **Who the admin is** (Q102) and how many accounts (Q103 "Min 5") are open. The MVP supports any number of accounts; the mockup shows 1 admin and 4 staff (`DUMMY` C22).

## 3. Sign-in and accounts

- **Sign in:** `/admin/login` with email and password (Better Auth). The page has no link from the public site, and `/admin` is `noindex` and blocked in `robots.txt`.
- **Accounts:** only an admin creates them (name, email, role, home branch). There's no public sign-up. New staff set their password from an invite link.
- **Leaving staff** (Q142 blank): an admin **disables** the account; it can't sign in, and the content it added stays.
- **Forgotten password:** an admin sets a new temporary password (no email sending in the MVP).
- **Sessions:** signed out after 12 hours without use (`DUMMY` C22). "Sign out" is always in the menu.
- **Too many failed sign-ins:** Better Auth rate limits apply; the page says "Too many attempts. Wait a few minutes and try again."

## 4. Admin layout (shared by every admin page)

- **Separate shell:** the admin has its own simple layout, not the public header, footer or sticky bar. It uses the same design tokens and supports light and dark mode.
- **Desktop:** a left sidebar with Dashboard · Frames · Sunglasses · Lenses · Eye camps · Gallery · Testimonials · Bookings · Enquiries · Settings (admin only: Branches, Staff, Branch holidays). The top bar shows the signed-in name, role and branch, the theme toggle, "View site" and "Sign out".
- **Branch switcher (client change 2026-10-21):** at the top of the sidebar. An admin picks "Working on branch" (Indresham / Patelguda); the choice is remembered on the device and sets the dashboard's branch card and the default booking filter. Staff see their home branch instead. Both show the branch address underneath.
- **Phone** (staff upload from a phone, Q36): the sidebar becomes a "Menu" drawer. The **Add frame** button stays reachable from every page.
- **Counts on menu items:** frames waiting for approval (admin), new bookings today, new enquiries.

## 5. Dashboard (`/admin`)

The first screen after sign-in. It answers "What needs doing today?"

| # | Block | Content |
|---|---|---|
| 1 | Greeting | "Good morning, [name]." with the role, branch and today's date |
| 2 | To-do cards | **Waiting for approval** (admin: drafts from all staff; staff: their own drafts and any sent back to them) · **Bookings today** (both branches, with a per-branch split) · **New enquiries** (status `new`). Each card links to its list |
| 3 | Quick actions | **Add frame** (primary), Add sunglasses, Add eye camp, Add gallery photo |
| 4 | Today's bookings | Time, name, branch, status; Call / WhatsApp buttons for the customer's number; "Mark attended / No-show". Empty state: "No bookings today." |
| 5 | Approval queue (admin) | Up to 5 drafts: photo, brand + model, price, added by, when. "Review" opens the frame form in review mode. "See all" link |
| 6 | Recent changes | The last 10 content changes ("Staff 1 marked VSF-1024 sold out, 10:42 AM"), from `updated_by` / `updated_at` columns. Not a full audit log (later phase, Q111–112) |
| 7 | Site at a glance | Frames live / drafts / sold out; upcoming camps; gallery photos. No sales figures (store system, later) |
| 8 | Branch details | The selected branch's address, phone and hours; "Edit branches" link for the admin |

- **Bookings** show the customer's optional area or address under the name, when given.

- Staff see the same dashboard without the approval queue, settings or delete actions.
- **Customer data on the dashboard:** names and numbers of today's bookings only, never shown on public pages, never cached publicly.

## 6. Add / edit frame form (`/admin/frames/new`, `/admin/frames/[id]`)

Sunglasses use the same form with `category = sunglasses` (and the lens type and lens colour fields). Built for a phone first: staff photograph the frame and fill the form at the counter.

### 6.1 Fields

| Section | Field | Type | Rules |
|---|---|---|---|
| Photos | Photos | Up to 5 (Q34). "Take photo" (camera) or "Choose from gallery" | At least 1 to submit. Drag or arrow buttons to reorder; the first is the cover. See 6.2 |
| | Photo type | Per photo: Front · Side · Close-up · Model wearing it (Q35) | "Model wearing it" requires ticking "This person gave written permission to show this photo" |
| Basics | Frame code | Text | Required, unique, e.g. `VSF-1024` (format `DUMMY` C13). Checked while typing: "Code already used by Ray-Ban RB5154" |
| | Brand | Select with "Add a new brand" | Required. `DUMMY` C4 / C5 |
| | Model | Text | Required, max 60 |
| | Category | Select | Required. `DUMMY` C13: Eyeglasses · Computer glasses · Sunglasses |
| | Gender | Radio chips | Men · Women · Unisex · Kids. Required |
| Details | Colour | Select with "Add a new colour" | Required (it's a customer filter) |
| | Shape | Select | Required. `DUMMY`: Rectangle · Square · Round · Cat-eye · Aviator |
| | Material | Select with "Other" | Optional, e.g. Acetate · Metal · TR90 · Titanium |
| | Size | Three number fields: lens · bridge · temple (mm) | Optional, e.g. 52-18-140 |
| | Lens type, lens colour | Select | Sunglasses only (C14): Polarized · UV protection · Tinted · Power sunglasses; Grey · Green · Brown · Gradient blue. No claims beyond these labels |
| Price and stock | Price | Number with ₹ prefix | Required, whole rupees, 1–1,00,000. Shown as "₹4,990" |
| | Availability | Toggle: In stock / Sold out | Default In stock |
| | Available at | Chips: Indresham · Patelguda · Both | Required, default the staff member's branch |
| Publishing | Visible on site | Toggle | Default on. Off = hidden even after approval |
| | Status | Shown, not edited by staff | Draft · Waiting for approval · Approved · Sent back (with the admin's note) |

- **Brands and colours** come from small lookup tables, so filters stay consistent ("Ray-Ban", not "rayban"). Staff can add a new one; it's saved with the frame.
- **No stock counts, cost price, supplier or barcode:** they belong to the store management system.

### 6.2 Photos

- **On the phone:** "Take photo" opens the camera (`accept="image/*"`, `capture="environment"`); "Choose from gallery" opens the photo picker.
- **Before upload:** the browser resizes each photo to at most 1600 px on the long side and converts it to WebP (or JPEG), so uploads are fast on mobile data. A preview with a progress bar shows for each.
- **Checks:** JPEG, PNG, WebP or HEIC only; at most 10 MB before resizing. The server checks the real file type (not just the extension) and the size again. Errors: "This file isn't a photo. Use JPG, PNG or WebP." and "This photo is too large (max 10 MB)."
- **Storage:** the `frames` uploads folder via `src/lib/storage.ts`, path `frames/<frame id>/<random>.webp`. Uploads only for signed-in staff; files are public only once the frame is approved and visible.
- **Guidance on screen:** "Plain light background, whole frame in view, no reflections. Product-only photos unless the person gave written permission."
- **Removing** a photo asks "Remove this photo?" and can be undone until saving.

### 6.3 Saving and approval

| Who | Buttons | What happens |
|---|---|---|
| Staff, new frame | **Send for approval** (primary) · Save as draft | Draft is saved; "Send for approval" sets status *Waiting for approval* and it appears in the admin's queue. Not on the site |
| Admin, reviewing | **Approve and publish** (primary) · Send back with a note · Save changes | Approve: status *Approved*, `approved_by` and time stored, on the site straight away (if visible). Send back: status *Sent back*, the note shows to the staff member |
| Anyone, approved frame | **Save changes** | Changes go live straight away and appear in "Recent changes". Availability and "Available at" are one-tap toggles on the frames list as well |
| Admin | Delete (in a "Danger zone" at the bottom) | Asks "Delete VSF-1024 permanently? Its photos are deleted too." Staff see **Hide from site** instead |

- **Edits to approved frames don't need approval again** (`DUMMY` C22 decision). This keeps day-to-day changes (price, sold out) quick. **TODO (client):** confirm.
- **Unsaved changes:** leaving the page asks "Leave without saving?"; a draft is also autosaved on the device every few seconds, so a dropped connection doesn't lose a half-filled form.
- **Validation:** the same pattern as the public forms: errors under each field and a summary at the top; Zod validation again in the server action.
- **After saving:** a toast ("Sent for approval", "Published") and two buttons: "Add another frame" (keeps brand, category, gender and branch filled in, for adding a batch) and "Back to frames".

## 7. Other admin pages (MVP, built in sprints 5.3–5.5; not mocked up)

| Page | What staff do | Notes |
|---|---|---|
| Frames / Sunglasses list | Search by code, brand or model; filter by status, availability, branch; one-tap Sold out / In stock; open to edit | Drafts and "Sent back" at the top for their owner |
| Lenses | Add / edit / hide lenses (`Requirements_Lenses.md` section 2) | No approval step |
| Eye camps | See 7.2 | Mocked up (`admin-camps.html`) |
| Gallery | Upload photos with tag, caption, branch, month (`Requirements_Gallery.md` section 2) | "Shows people" requires the consent tick; Customers tag blocked until Q146 is confirmed |
| Testimonials | Add a customer's first name, branch, quote and the date they agreed | Only with the customer's permission; no invented reviews |
| Bookings | List by day and branch; status `booked` → `attended` / `no_show` / `cancelled`; Call / WhatsApp the customer | Staff read and update; admin deletes. Deleted automatically after the retention period (`DUMMY` D9) |
| Enquiries | List of new / replied / closed; reply on WhatsApp or call from the row | As bookings |
| Settings (admin) | Branches (see 7.1); staff accounts; branch holidays (closed days, which the booking form uses) | |

### 7.1 Branches (`/admin/branches`, client change 2026-10-21; mocked up)

- One card per branch: address (required), Google Maps link (optional), phone and WhatsApp number (10 digits; "Same as phone"), opening and closing time, open days, "Show this branch on the site".
- Only an admin saves; staff see the page read only. Validation: full address, 10-digit numbers, closing after opening, at least one day.
- Changes update the public site straight away (footer, Contact, branch picker, booking form). Branch data moves from `site-config.ts` to the `branches` table, with `site-config.ts` as the seed.

### 7.2 Eye camps (`/admin/eye-camps`, client change 2026-10-21; mocked up)

- **List:** Upcoming / Past, each row with date, name, time, place and status; past camps missing a people count or photos are flagged "Add people count and photos". "Add eye camp" button.
- **Form** (`/new`, `/[slug]`): camp name, date, start/end time, nearest branch, location and address, organised with (optional), description, what's offered (chips), visible on site. Fields from `Requirements_EyeCamps.md` section 2.
- **After the camp:** people checked and up to 12 photos open once the date has passed. New photos need the permission tick. Photo upload as 6.2, bucket `camps`.
- No approval step: camps show on the site as soon as they're saved. Staff hide; admin deletes.

## 8. Data and security

- **Tables used:** `frames`, `frame_images`, `brands`, `colours`, `lenses`, `eye_camps`, `camp_photos`, `gallery_photos`, `testimonials`, `appointments`, `enquiries`, `branches`, `branch_closures`, `staff_profiles` (user id, name, role `admin` / `staff`, branch, active).
- **Row-level security:**
  - Staff and admin can read and write content tables; only admin can delete, approve (`status = 'approved'`), and change `staff_profiles` and `branch_closures`.
  - A staff member can't set a frame's status to `approved`, even with a hand-made request: a database check enforces it.
  - Private tables (`appointments`, `enquiries`) are readable only by signed-in staff with an active profile.
  - A disabled account loses access at once (its profile is inactive), even if a session is still open.
- **Who did what:** content tables have `created_by`, `updated_by`, `updated_at`; frames also `approved_by`, `approved_at`. This feeds "Recent changes". The full audit log is a later module.
- **Storage:** uploads only by signed-in staff; file type and size checked on the server; public read only for approved, visible content.
- **No secrets in the browser:** the browser never connects to the database; admin-only tasks (creating accounts) run in server actions, checked against the signed-in role.

## 9. Behaviour and accessibility

- **Phone first:** every admin task works at 360 px; buttons and toggles at least 44 px; the photo step works one-handed.
- **Forms:** visible labels, fieldsets for chip groups, errors announced, focus to the error summary.
- **Destructive actions** (delete, disable account) always ask first and say exactly what will be removed.
- **Light / dark mode:** the shared colour roles.
- **Not indexed:** `noindex`, `robots.txt` disallow, no links from the public site.

## 10. Acceptance criteria

Done when:

1. **Sign-in:** only staff with an active account can open any `/admin` page; everyone else is sent to `/admin/login`. A disabled account can't sign in.
2. **Roles (tested in Playwright and SQL):**
   - Staff can add a frame, but it stays a draft and isn't on the public site.
   - Only an admin can approve, delete, manage accounts and set holidays; a staff request to approve or delete is refused by the database.
3. **Frame upload on a phone:** at 360 px, a staff member can take up to 5 photos, fill the form and send it for approval; the admin approves it and it appears on `/frames` (or `/sunglasses`) straight away.
4. **Photos:** files that aren't photos or are over 10 MB are refused with a clear message, both in the browser and on the server; photos are resized before upload.
5. **Sold out:** one tap marks a frame sold out, and the public page shows "Sold out" without hiding it.
6. **Dashboard:** shows the to-do counts, today's bookings with Call / WhatsApp, the approval queue (admin only) and recent changes.
7. **Content modules:** staff can add each content type (lenses, camps, gallery photos, testimonials); hidden content never appears publicly.
8. **Consent:** a gallery or frame photo marked as showing a person can't be saved without the consent tick.
9. **Privacy:** booking and enquiry data appear only inside `/admin`, and only for signed-in staff.
10. **Live site:** no `DUMMY` accounts or rules; keyboard-accessible, light and dark mode, no console errors.

## 11. Open items

| Item | Owner | Mockup uses |
|---|---|---|
| Who the administrator is (Q102 blank) | Client | `DUMMY` C22: "Admin" |
| How many staff accounts, names, branches (Q103 "Min 5") | Client | `DUMMY` C22: 1 admin, 4 staff |
| Can staff delete frames, or only hide them? (Q38 "Yes" vs `CLAUDE.md`) | Client | Staff hide; admin deletes |
| Do edits to an approved frame need approval again? | Client | `DUMMY` C22: no, they go live |
| Frame code format, categories, shapes, colours | Client | `DUMMY` C13 and the Frames requirements |
| Audit log (Q111, Q112, Q141 blank or "Not sure") | Client | Only "Recent changes" in the MVP |
| What happens when staff leave (Q142 blank) | Client | Admin disables the account |
| Session length | Client | `DUMMY` C22: 12 hours |
| Customer address on bookings and enquiries: wanted on both forms? | Client | Optional field on both |
