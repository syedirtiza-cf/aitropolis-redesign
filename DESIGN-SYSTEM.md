# AITROPOLIS DESIGN SYSTEM · v3

Rules for the redesigned site. `assets/site.css` holds the values (its `:root` block holds every token); this file holds the rules. v3 replaces v2 (paper, indigo, ink, volt, copper), which still governs the live site until the redesign is ported.

**Source.** The layout, motion and effects come from the Kelder template (public domain). The type choice comes from Awesomic's style reference. Colour sits on the Aitropolis electric blue. Do not copy anything from Kelder that is not in the prototypes here.

## 1 / Colour

One blue family, one accent.

| Role | Token | Value |
|---|---|---|
| Page | `--page` | `#f5f8fc` |
| Card | `--surface` | `#ffffff` |
| Soft panel | `--soft` | `#f1f5fb` |
| Hairline | `--line` | `#dde5f0` |
| Dashed rule | `--dash` | `#9fb3d1` |
| Ink (text, dark buttons) | `--ink` | `#06142e` |
| Body copy | `--muted` | `#55667f` |
| Disabled, decorative | `--faint` | `#9aa8bd` |
| Action blue | `--accent` | `#0a4da6` |
| Chart blue | `--accent2` | `#2f74d0` |
| Blue ramp | `--b100` … `--b400` | `#d0e1f8` `#bfd6f6` `#8dbaf0` `#5c9be6` |
| Accent | `--lime` | `#ddf545` |
| On dark | `--on` `--on-soft` `--on-mute` | `#fff` `#c9d9f0` `#a9bcda` |

**Lime.** One accent, used for the primary action, today or live states, and the logo's hop. It is a fill with ink on top, or a mark on a dark surface. Never lime text, never a lime line on a light surface.

**Gradients.** Only the named ones: `--g-hero`, `--g-dash`, `--g-recall`, `--g-a`/`--g-b`/`--g-c` (tile fills), `--g-steps`, `--g-bar`, `--g-sec`, `--g-note`, `--g-foot`. No purple-to-blue, mesh or unnamed gradients.

**Contrast, already measured**
- ink on page 17.2:1, muted on page 5.5:1, muted on soft 5.3:1, accent on white 8.0:1
- on-soft on the dashboard blue 6.8:1, on-mute on the steps block 5.6:1 or better
- white on `#2f74d0` is 4.6:1: large text and UI only
- footer text on the lightest part of the footer gradient uses `#e6eefb` (4.9:1). `--on-soft` is 4.0:1 there and is not allowed for small text.
- `--faint` is 2.4:1 on white. Disabled and decorative only, never copy.

## 2 / Type

One family, set in weights 300, 400 and 500. The reference names **Cosmica**; **DM Sans** is its listed substitute and is what ships until the Cosmica files are licensed. Change `--font` once.

| Role | Size | Notes |
|---|---|---|
| Display `h1` | 86px (5.375rem) | weight 500, tracking -0.04em, leading 1 |
| `h2` | 60px | tracking -0.035em |
| `h3` | 44px | tracking -0.03em |
| Figures `xl` / `l` / `m` | 124 / 76 / 44px | weight 300, tabular, tracking -0.05em to -0.04em |
| Titles | 28 / 22px | weight 500 |
| Body | 17px (20px lead) | leading about 1.55 |
| Label | 14px | |

At 1024 and below the heading tokens step down (64, 48, 36, 96, 60) and again at 768 and 560. No weight above 500. Left-aligned body copy. Hero and section headings may centre.

## 3 / Layout: one rem, four frames

The page is drawn at 1440 and re-laid at 1024, 768 and 390. Everything is in rem and the root font-size scales: `100vw*16/1440` up to 1920 (held above that), then `/1024`, `/768`, `/390` at 1024, 768 and 560. Never write a px size or spacing in a component, except hairlines and the halftone canvas.

- Page gutter `max(2.5rem, (100% - 85rem)/2)`; 1.25rem at 1024 and below.
- Sections sit 110px apart (80 at 1024, 56 at 560) and open with a dashed rule.
- Section head: a label pill in column 1, the `h2` across columns 2 and 3; stacked and centred at 768.
- Cards: 20px corners, white, no shadow. Panels 14px, tiles and inputs 8px to 10px.
- Rails: three-card rows become sideways scrollers at 768 and below.
- Hero: gradient from near-black navy through blue to mist, tall, copy centred, then the dashboard card.

## 4 / The hero and header

- The header sits on dark navy. **The halftone dots fade to nothing across the top band** (about 5.75rem clear, then a 9rem fade) so the menu always has a clean, dark ground. Do not let dots, imagery or gradients run behind the nav.
- The logo is the pearl-white lockup on dark surfaces and the electric blue lockup on light ones: the scrolled bar and the mobile menu are white with the electric blue logo.
- After the hero, a compact bar slides in and stays pinned.
- The dashboard card rests tilted back (20deg, scale 0.9; 7deg and 0.94 on phones) and flattens as it scrolls in.

## 5 / Components

- **Pill:** 32px, 16px line icon, three tones (glass on dark, line on page, soft on card).
- **Button:** 56px, 10px corners. Primary is lime with ink text; outline is white or ink; dark is ink. On hover or focus the lime square from the logo grows from the left edge to fill the button.
- **Card hover:** lifts 3px. Fine pointers above 1024px only.
- **Tile:** 64px number tile that fills lime as the scroll front passes it.
- **Pixel art:** a 32 by 22 grid of 2px dots; the picture is 10px pixels that grow out of the grid in the tile's own order.
- **Charts:** bars grow from the baseline 80ms apart; lines draw left to right. Only real figures are charted.
- **Forms:** 64px, 14px corners, border turns blue on focus.

Required states on every interactive element: default, hover, active, focus-visible, disabled, error. Touch targets 44px or more. Focus ring is `2px solid --accent2` with a 3px offset.

## 5b / Icons and the Solutions menu

- **Icons:** Lucide (ISC licence), 24px grid, 1.75 stroke (2 at 16px), no fill, `currentColor`. One glyph per concept. A subset is inlined as an SVG sprite in `assets/icons.js`; add an icon there before using it. No emoji and no other icon set. The Lucide licence text is in `assets/LICENSE-lucide.txt`.
- **Solutions menu (desktop):** a white 20px panel under the header that opens on click, on hover for fine pointers, and on the down arrow key. The left column lists the six districts with their Lucide icons; hovering or focusing one swaps the right column to that district's services, each with its own icon and one-line subtitle. A bottom row holds the extra offers (AI Center, Growth Partner offer, Offshore IT teams) and "See all solutions". Esc closes it and returns focus. It closes on scroll and on outside click. The page dims behind it.
- **Solutions menu (mobile):** the sheet's "Solutions" row expands into an accordion of districts, each expanding to its services.

## 5c / Page patterns

- **Sub-page hero:** the same hero as the homepage, with a tilted stat card. The card holds one big figure, three dashed rows and a chart of real data (bars of counts, or the studio coverage chart). No invented numbers.
- **Explorer (industries):** a sticky list of sectors on the left; the right panel swaps content on hover, click or arrow keys, and follows the URL hash. On tablet and phone the list becomes a horizontal chip row.
- **Filter and search (case studies):** pill filters with `aria-pressed`, a live search, an `aria-live` count, an empty state. Cards fade out before they are hidden.
- **People and offices (about):** initials tiles on the blue gradients, years of experience as a plain figure, and offices with a live local time.
- **Form (contact):** 14px fields, visible labels with "required" or "optional", inline errors tied to the field with `aria-invalid`, an error summary with `role="alert"` and focus on the first error, a loading state, and a confirmation with `role="status"` and focus moved to it. A honeypot field is hidden from people and screen readers. Errors use `#b3261e`, which is never used for anything else.

## 6 / Motion

Calm and precise, no bounce. Critically damped feel: `cubic-bezier(.2, 0, 0, 1)`, 0.9 to 1.4s for entrances, 150 to 400ms for hover. One shared animation ticker; per-frame values scale by real frame time. Heading lines rise out of masks. Content blocks rise 48px and fade once, siblings 90ms apart. Numbers count up once in view. Three canvas effects run only while on screen: the hero halftone, the line flows, the cursor dot trail.

**Reduced motion:** the static design exactly as the markup paints it. No preloader, no entrances, no canvases except the line flows as one still frame. The menu, tabs and FAQ still work.

## 7 / Banned

- Emoji as icons or markers
- A gradient that is not named in section 1
- Lime text or lime lines on a light surface
- Dots, imagery or gradients behind the header nav
- Weights above 500, justified body copy, all-caps beyond short labels
- Card shadows as the default elevation
- Any px font-size or px spacing in a component
- A chart that plots numbers that are not real
- Client-only rendering of a number, date or clock that a crawler should see (in the Next.js build, figures render on the server)
- Stock photography. Imagery is generated art, product UI or real project photography.

## 8 / Accessibility

WCAG 2.1 AA. Semantic HTML, full keyboard path, visible focus, alt text on every image, `aria-expanded` on menus, `inert` on the hidden header bar, labelled form fields, `prefers-reduced-motion` honoured. The contrast pairs in section 1 are the checked set; add a pair here before using it.

## 9 / Copy

- UK English. No exclamation marks.
- Open in the buyer's world, not with Aitropolis.
- End with the single next step or a result.
- A number where an adjective would be, and every figure traceable to `content/canon.json`.
- One honest limitation per major narrative.
- Primary action: "Book a 15-minute assessment". Secondary: "Talk to an engineer, not a form" or "Read the 3-minute case". Banned: "Get started", "Learn more", "Submit", "Get in touch".

## 10 / Ship gate

A page ships when all ten are true:
1. No raw px sizes or hex values in components (tokens only)
2. Gradients are the named set; lime appears only as a fill or on dark
3. Contrast pairs pass, including every dark block and the footer
4. Figures come from canon and districts data, rendered server-side
5. One primary action per page
6. The page ends in a next step
7. All interaction states, visible focus, complete keyboard path
8. No pattern from section 7
9. Reduced-motion view is complete and readable
10. Clean at 1440, 1024, 768 and 390, no horizontal scroll, no console errors
