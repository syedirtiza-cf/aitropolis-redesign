# Aitropolis redesign prototype

A standalone static prototype of the redesigned Aitropolis website: 90 HTML files (89 pages and a 404). It is a design test and is not the live site. Last updated 21 November 2026.

## What is here

| Area | Files |
|---|---|
| Home, Solutions hub, About, Contact, Partners, Industries, Case studies list, Insights list | `index.html`, `solutions.html` (hand-written); `about`, `contact`, `partners`, `industries`, `case-studies`, `insights` (generated from `src/*.html`) |
| Six district hubs | `solutions-<district>.html` |
| 32 service pages | `solutions-<district>-<service>.html` |
| AI Center, GPU, Growth Partner, offshore teams, ISO and BPM | `ai.html`, `ai-gpu.html`, `digital-growth-partner.html`, `solutions-offshore-it-teams.html`, `solutions-iso-bpm.html` |
| Six sector pages, Global delivery | `industries-<sector>.html`, `global-delivery.html` |
| 21 case studies | `case-studies-<slug>.html` |
| 7 insight articles | `insights-<slug>.html` |
| Legal | `privacy.html`, `terms.html`, `accessibility.html` |

Shared code: `assets/site.css` (all styles and tokens), `assets/site.js` (motion, mega menu, route rewriting), `assets/icons.js` (inline Lucide sprite, ISC licence), `assets/brands/` (single-colour vendor marks, CC0), `assets/` logos and favicons. Rules: `DESIGN-SYSTEM.md` (v3).

## Page layouts

Six hand-built pages plus five generated layouts (the layout is chosen in `tools/build.py` and written in `tools/pagegen.py`):

| Page type | Layout |
|---|---|
| District hubs (6) | District switcher, hero card listing every service, service tiles with pixel art, industries as linked chips |
| Service pages (32) | Sticky section nav, side rail (counts, platforms named, next step), row lists, dark delivery band |
| Case studies (21) | Hero card with headline result and key figures, chapters, dark results panel, connections tiles |
| Insight articles (7) | Reading-time hero card with contents, sticky contents, progress bar, callouts, tables, questions |
| Other generated pages | General layout: cards, bento with pixel art, split sections, dark band, checklists |
| Privacy, terms, accessibility | Plain reading layout with a contents list |

## How the pages are built (89 generated or hand-written)

Except the homepage and the Solutions hub, pages are written as data and rendered by the generator, so the whole site stays consistent.

- `src/pages.json` lists the pages: title, description, nav state, icon and an optional closing-block override.
- `src/content/<name>.json` holds the sections of each page. `tools/import_live.py` builds these from saved copies of the current site (`tools/extract.py` does the parsing); `tools/import_source.py` reads the seven service pages that exist only in the Next.js source.
- `tools/pagegen.py` turns a content file into the page: hero with a stat card (the chart plots how many items each section lists, nothing invented), card grids, numbered steps, spec lists, stat tiles, checklists, FAQ and the closing block.
- `tools/import_app_pages.py` builds the six sector pages (from `src/industries.js`) and Global delivery. `tools/add_icons.py` adds Lucide icons to the sprite. `tools/audit.js` checks every page.
- A route like `/solutions/systems/erp` is the flat file `solutions-systems-erp.html`. `assets/site.js` rewrites `/a/b` links to that name at load, so menu and card links resolve on a static host.

To change a page, edit its JSON (or `src/pages.json`), run `python3 tools/build.py` and commit the output. Re-running an import overwrites hand edits to the JSON for that page, so edit the JSON and do not re-import once you have.

## Run it

Serve the folder over http. Opening the files directly breaks the relative asset paths.

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

## Hosting a test build

No build step: the folder is plain static files, so any static host works. `robots.txt` and a `noindex` meta tag on each page ask search engines to stay away, so a test URL does not compete with the live site. The site is not linked to the live app or its domains.

## Where the design comes from

- **Layout, motion and effects:** the Kelder template (getlayers.ai), released into the public domain (Unlicense). The prototypes are written fresh from its spec and source: the preloader, the hero halftone and its clear band behind the header, the tilted dashboard card, silk line flows, pixel-art tiles, the footer revealed from under the page, and the cursor dot trail.
- **Type:** Awesomic's `DESIGN.md` names Cosmica. DM Sans is its listed substitute and is loaded from Google Fonts. To switch, change `--font` in `assets/site.css` once the Cosmica files are licensed.
- **Logos:** the approved electric blue and pearl-white SVGs. Pearl-white sits on the dark hero and footer. Electric blue sits on light surfaces (the scrolled header bar and the mobile menu).
- **Colour:** the Kelder palette on the Aitropolis electric blue, with one lime accent (`#ddf545`) for the primary action and live states.

## Things to know before porting

- **Insights list.** The list page shows the seven published titles, excerpts, topics, dates and reading times. The cadence line ("we publish weekly") and the email-subscribe copy from the current site are left out, since the prototype has no subscribe backend and the dates do not show a weekly cadence. The seven articles are built as pages here; in the app they are `/insights/<slug>` routes.
- **Vendor logos** are single-colour marks from Simple Icons (CC0), in `assets/brands/` with a licence and trademark note. They identify the vendor and imply no endorsement. Where a vendor's partner programme sets its own logo rules, swap in the programme's assets before publishing. BytePlus has no mark in that set and uses an initials tile.
- **Partner certifications are left out.** The Partners page shows what we do on each vendor and the services it supports. The certification lists on the current site are not shown until the team confirms which are held. NVIDIA is in `canon.json` but has no entry on the current Partners page, so it is not on this one either.
- **Case-study figures.** The case-study pages show the published headline result and key figures from the current site. The list page cards show only the summaries. All figures need team sign-off before publishing.
- **The contact form sends nothing.** It validates and shows a confirmation that says so. The Next.js build posts to the existing contact route.
- **Leadership photos are initials.** Real headshots can replace them.
- **Figures are typed in.** The homepage and Solutions page hold company figures and the six districts with their services inline, as constants. In the Next.js build these must come from `content/canon.json` and `src/lib/districts.ts`.
- **Links** use the app's routes (for example `/solutions/systems/erp`) and `assets/site.js` rewrites them to the flat file names at load, so everything resolves on a static host. In the Next.js build they stay as real routes.
- **Motion is hand-written JavaScript** (springs approximated with CSS easing, one shared animation ticker). In Next.js it becomes client components.
- **Copy is a first draft.** Process statements (for example "scope changes are agreed in writing") need a read by the delivery lead before publishing.
- **Reduced motion:** the pages render their static design with no entrances, preloader or canvases except the line flows as a still frame.
- **Preview limitation:** the in-app browser throttles animation frames, so check motion timing in a normal browser.

## Checking the pages

`tools/audit.js` is a paste-in console script. Serve the folder, open any page, paste it, and it checks every page for overflow at 390, h1 count, title and description length, missing alt text, missing icons, empty sections, duplicate ids, broken internal links and stray "undefined" text. Run it after every build. The last run (82 pages) found only duplicate ids, which are fixed.

Lessons from reviewing the pages (also in `DESIGN-SYSTEM.md` section 5d):
- Reading the live site's markup is not enough to get structure right. Numbers drawn as separate elements (step numbers, "01" counters) arrive as stray bullets or attach to the wrong card. Always run a scan for number-only items after an import.
- A generator needs one id rule: derive from the section title, omit it when empty, and give generated blocks their own names (`keep-exploring`, `platform-wall`) so they cannot collide with imported sections.
- Check by eye as well as by script. The script cannot see a truncated chart label or a hero count that disagrees with the side rail; a screenshot can.
- Chrome will not go narrower than about 606px, so true phone width is checked with the audit script's 390px iframes, not by resizing the window.
- Roll a new layout out on one page first, review it, then widen it (the `service` flag set in `tools/build.py` decides which pages use the service layout).

## Service pages

The 32 service pages (`solutions-<district>-<service>.html`) share a layout: a sticky section nav, a side rail with the section, step and question counts, the platforms the page names and the next step, row lists in place of card grids, a dark band for the delivery steps and a "Keep exploring" row of sibling services. The section nav appears when a page has three or more titled sections. The District hubs, Offshore IT teams and ISO and BPM keep the general layout.

## Case studies

The 21 case studies (`case-studies-*.html`) share a story layout: the hero card carries the headline result and the four key figures from the published case, a side rail keeps district, domain and headline in view, and the chapters run Challenge, Solution, Results (a dark panel with the figures in lime), then the technology or architecture list and the connections tiles. It handles results lists of two to six, a result without a figure, and a district-only label such as "Foundations + Systems".

## Insight articles

The seven articles (`insights-*.html`) share an editorial layout: the hero card shows reading time, date, topic and a numbered contents list; the body has a sticky contents list with the current section highlighted, a reading-progress bar under the header, a callout for the short answer, a dark callout for the bottom line, checklists with a bold lead-in and a note, tables for figures, and a questions block that opens one answer at a time. Privacy, terms and accessibility keep the plainer reading layout.

## District hubs

The six hubs (`solutions-<district>.html`) share a navigation-first layout: a district switcher under the hero, a hero card that lists every service page in the district, a grid of service tiles (pixel art, the page's own description, a link), then the district's own sections, with industries as chips that link to the sector pages where one exists. The service list comes from the manifest, so a new service page appears on its hub on the next build. The hubs no longer show the live site's "Dive deeper" list, which was missing some services.

## Import rules that matter

- A list item made of a number, a title and a description (live site: `li > p, h3, p`) is kept as three parts and becomes a numbered step. A list item made of two or more spans (name and note) becomes a spec row. A bare marker such as a diamond does not count as a part.
- Card titles the author numbered ("1. Discovery") become numbered steps with the number removed from the title. Articles keep their numbered headings.
- A numbered steps list that runs 1 to k with no gaps and is followed by an unnumbered card shows that card as a note below the band, not as an extra step.
- `tools/build.py` also re-stamps the asset versions on `index.html` and `solutions.html`, which are hand-written. If it did not, returning visitors could keep old styles on those two pages.

## Imported copy

- **Text comes from the current site.** The 67 inner pages carry the published wording, converted to UK spelling by `tools/extract.py`. It has not had an editorial pass.
- **Claims and figures need sign-off before publishing**, in the same way as the case-study metrics: for example the GPU specifications, "10x faster model training", "99.99% availability", "50+ EBS deployments" and the monthly message and delivery-rate figures on the GMS case study.
- **Section order inside long articles follows the extractor.** Headings, paragraphs, lists, tables and callouts are kept, but a few layouts (side-by-side comparisons, quotes) fall back to plain cards or paragraphs. Read each article against the live page before porting.

## Open items

- A phone and tablet review by eye of every page type (the audit script covers 390px for overflow and links only).
- Bring the earlier hand-built pages (home, Solutions, Industries, Partners, About, Contact) in line with the later wayfinding: breadcrumbs, mono labels, "Keep exploring" rows.
- Team sign-off on imported copy, claims and figures.
- Port the pages into the Next.js site (figures from `content/canon.json`, districts from `src/lib/districts.ts`, metadata from `src/lib/seo.ts`; motion as client components).
- Swap DM Sans for Cosmica once the font files are licensed; real photography and partner badges if provided.
