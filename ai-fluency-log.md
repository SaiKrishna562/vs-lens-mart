# AI Fluency Log

This document records how AI/Claude Code was used during the VS Lens Mart website project, following the 4D framework:

- **Delegation** — What work was given to AI?
- **Description** — How was the task described?
- **Discernment** — How were AI outputs reviewed and decisions made?
- **Diligence** — How was the final result verified?

---

## v1.0 — Initial Project Planning

### Delegation

AI was used to help structure the initial VS Lens Mart website project plan from the available client requirements, design direction, and technical requirements.

The goal was to convert the project information into a structured implementation plan covering:

- Website pages
- Navigation
- Features
- Admin functionality
- Database requirements
- Technical stack
- Development workflow
- MVP vs later modules
- Testing and deployment

### Description

The project was described as a premium optical-store website for VS Lens Mart.

The main business goals were to communicate:

- Trust
- Care
- Family values
- Professional eye care
- Premium eyewear
- Innovation
- The shop's legacy

The project plan also established the technical direction and development workflow.

### Discernment

AI-generated planning was reviewed against the actual client requirements rather than accepting every suggestion automatically.

Unknown business information was kept as unresolved rather than invented.

Examples include:

- Exact enquiry email
- Founding story
- Founder details
- Complete brand list
- Final legacy wording
- Client-provided photography

### Diligence

The resulting project plan was organized into documentation so that requirements could be reviewed and updated independently.

The project documentation was separated into areas such as:

- Client answers
- Open questions
- Requirements
- Changelog
- AI fluency evidence

---

## v1.1 — Navigation Update

### Delegation

AI was asked to help define the updated navigation structure for the VS Lens Mart website.

The task included documenting:

- Utility bar
- 7 top-level menu items
- Mega menus
- Mobile navigation
- Mobile accordion behaviour
- Sticky mobile bottom bar
- Acceptance criteria

### Description

The navigation was changed to a product-first structure with 7 top-level items:

1. Frames
2. Sunglasses
3. Lenses
4. Eye Care
5. Eye Camps
6. About
7. Contact

The VS Lens Mart logo acts as the Home link rather than adding Home as an eighth menu item.

The navigation also includes actions for:

- Search
- WhatsApp
- Book an Eye Test

The shopping-bag/cart concept was not retained because online checkout is outside the project scope.

### Discernment

The navigation requirements were checked against the documented project direction.

Particular attention was given to preventing unsupported information from being added.

The client confirmed:

- Shop name: VS Lens Mart
- Phone/WhatsApp number: 9550685417
- Frame prices should be shown
- Branded lenses are available
- Exact lens brands are still pending

Therefore, exact brands and prices were **not invented**.

They are treated as database/client-provided information.

### Diligence

The navigation requirements were written with acceptance criteria so that the implementation can later be tested against them.

The requirements cover:

- Desktop navigation
- Mega-menu behaviour
- Keyboard accessibility
- Mobile accordion behaviour
- Sticky bottom bar
- WhatsApp action
- Responsive behaviour
- Data-driven brands and prices
- Client TODOs

---

## Client Requirements Extraction

### Delegation

AI was used to organize the client's WhatsApp responses into a structured `client-answers.md` document.

### Description

The client's answers were preserved as the source for business information.

Important confirmed information includes:

- **Business name:** VS Lens Mart
- **Phone:** 9550685417
- **GST:** No GST
- **Working hours:** Monday–Sunday, 9:00 AM–9:30 PM
- **Frame prices:** Show on website
- **Lens availability:** All branded lenses available
- **Reminders:** Yes
- **Counter devices:** Computer, tablet, and mobile

### Discernment

Answers that were incomplete or pending were not treated as confirmed requirements.

For example:

- Email — pending
- Founding story — pending
- Photos — client will share
- Prescription sample — client will share
- Final anniversary/legacy wording — pending

### Diligence

The information was separated into:

- `docs/client-answers.md`
- `docs/open-questions.md`

This makes confirmed information distinguishable from information that still requires client input.

---

## Navigation Requirements Documentation

### Delegation

AI was asked to draft:

`docs/requirements/Requirements_Navigation.md`

using the project documentation and client answers.

The task specifically required coverage of:

- Utility bar
- 7 menu items
- Mega menu contents
- Mobile accordion
- Sticky bottom bar
- Acceptance criteria

### Description

The navigation requirements define the desktop and mobile behaviour of the website.

The documented mega-menu structure includes:

**Frames**
- Men
- Women
- Kids
- Frame types
- Shapes
- Brands
- Price range

**Sunglasses**
- Men
- Women
- Kids
- Lens types
- Shapes
- Price range

**Lenses**
- Single vision
- Progressive
- Bifocal
- Blue-cut
- Photochromic
- Contact lenses
- Reading power
- Care
- Lens brands

**Eye Care**
- Book an eye test
- Our branches
- Eye camps

**About**
- Our Journey
- Family
- Team
- Gallery
- Reviews

**Contact**
- Branches
- Maps
- Hours
- Enquiry form

### Discernment

The requirements explicitly avoid inventing business information.

Exact brand names and prices were not supplied by the client, so they are marked as:

`TODO — client/admin data`

Similarly, unresolved business information is marked as:

`TODO — client confirmation required`

### Diligence

Acceptance criteria were included so the navigation can later be validated during implementation and testing.

The acceptance criteria cover:

- Correct number of top-level menu items
- Desktop mega menus
- Mobile accordion
- Sticky bottom bar
- WhatsApp functionality
- Keyboard accessibility
- Responsive behaviour
- Database-driven product information
- No invented brands or prices

---

## AI Output Review Principles

During the project, AI output is treated as a draft or implementation aid rather than automatically accepted as fact.

The following rules are followed:

1. Client-provided information takes priority over AI assumptions.
2. Unknown information is marked `TODO` or `Pending client confirmation`.
3. Brands and prices are never invented.
4. Business claims are not added without a source.
5. Design decisions are checked against the approved homepage design.
6. Technical changes are reviewed before implementation.
7. Large unrelated code changes are avoided.
8. Requirements are documented before implementing major features.
9. Acceptance criteria are used to verify completed work.
10. Client-provided assets are preferred over placeholder or invented content for the final website.

---

## Current Documentation Created

The project documentation currently includes:

- `docs/client-answers.md`
- `docs/open-questions.md`
- `docs/changelog.md`
- `docs/requirements/Requirements_Navigation.md`
- `docs/ai-fluency-log.md`
- `CLAUDE.md`
- `CLAUDE.local.md`

---

## Lessons Learned

### Lesson 1 — Do not invent missing client information

When the client has not supplied a brand name, price, founder detail, email address, or other business information, it should remain a TODO rather than being filled using AI assumptions.

### Lesson 2 — Keep shared and local instructions separate

Shared project rules belong in `CLAUDE.md`.

Personal/local development notes belong in `CLAUDE.local.md`.

### Lesson 3 — Requirements should exist before implementation

The navigation requirements were documented before implementation so that the final UI can be checked against explicit acceptance criteria.

### Lesson 4 — AI output requires human review

AI can organize requirements and propose structures, but the final decision must be checked against the client documentation and approved design.

### Lesson 5 — Keep the project documentation traceable

Client answers, unresolved questions, changes, requirements, and AI usage are maintained in separate files so that future development decisions can be traced back to their source.