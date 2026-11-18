# Aitropolis redesign prototypes

Standalone HTML prototypes of the redesigned site. They are a design test for the Aitropolis website redesign and are not the live site.

| Page | File |
|---|---|
| Homepage | `index.html` |
| Solutions hub | `solutions.html` |
| Industries | `industries.html` (generated) |
| Case studies | `case-studies.html` (generated) |
| Insights | `insights.html` (generated) |
| Partners | `partners.html` (generated) |
| About | `about.html` (generated) |
| Contact | `contact.html` (generated) |
| AI, GPU, Growth Partner, offshore teams, ISO and BPM | `ai.html`, `ai-gpu.html`, `digital-growth-partner.html`, `solutions-offshore-it-teams.html`, `solutions-iso-bpm.html` (generated) |
| Six districts and 32 service pages | `solutions-<district>.html`, `solutions-<district>-<service>.html` (generated) |
| 21 case studies, 7 insight articles | `case-studies-<slug>.html`, `insights-<slug>.html` (generated) |
| Six sector pages and Global delivery | `industries-<sector>.html`, `global-delivery.html` (generated from the app's sector data and page copy by `tools/import_app_pages.py`) |
| Privacy, terms, accessibility | `privacy.html`, `terms.html`, `accessibility.html` (generated) |

Shared code lives in `assets/site.css` and `assets/site.js`. `assets/icons.js` is the inline Lucide icon sprite (ISC licence, see `assets/LICENSE-lucide.txt`). Each page adds its own markup and a small page script. `assets/` also holds the logo files and the favicon set (`icon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`), all the electric blue symbol. The Solutions mega menu and the district data are in `assets/site.js`.

## Generated pages

`index.html` and `solutions.html` are hand-written. The other four pages are generated from `src/`: each page is `src/<name>.html` (a few `key: value` lines, then the body) plus an optional `src/<name>.js`, wrapped in the shared header, footer, header bar and menu from `src/shell.html` and `src/header.html`. Edit the sources, then rebuild and commit the output:

```bash
python3 tools/build.py
```

The build also stamps every page's script and stylesheet links with a version, so browsers never serve a stale file after a deploy.

## Content pages (81 pages)

Every other page is written as data and rendered by one template, so the whole site stays consistent.

- `src/pages.json` lists the pages: title, description, nav state, icon and an optional closing-block override.
- `src/content/<name>.json` holds the sections of each page. `tools/import_live.py` builds these from saved copies of the current site (`tools/extract.py` does the parsing); `tools/import_source.py` reads the seven service pages that exist only in the Next.js source.
- `tools/pagegen.py` turns a content file into the page: hero with a stat card (the chart plots how many items each section lists, nothing invented), card grids, numbered steps, spec lists, stat tiles, checklists, FAQ and the closing block.
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

- **Insights is the list page only.** The seven articles link to `/insights/<slug>`, which exist only in the Next.js app. Titles, excerpts, topics, dates and reading times are the published list. The cadence line ("we publish weekly") and the email-subscribe copy from the current site are left out, since the prototype has no subscribe backend and the dates do not show a weekly cadence.
- **Vendor logos** are single-colour marks from Simple Icons (CC0), in `assets/brands/` with a licence and trademark note. They identify the vendor and imply no endorsement. Where a vendor's partner programme sets its own logo rules, swap in the programme's assets before publishing. BytePlus has no mark in that set and uses an initials tile.
- **Partner certifications are left out.** The Partners page shows what we do on each vendor and the services it supports. The certification lists on the current site are not shown until the team confirms which are held. NVIDIA is in `canon.json` but has no entry on the current Partners page, so it is not on this one either.
- **Case-study metrics are left out.** The case-study cards show only the published summaries. The numbers in `canon.json` need team sign-off before they are shown.
- **The contact form sends nothing.** It validates and shows a confirmation that says so. The Next.js build posts to the existing contact route.
- **Leadership photos are initials.** Real headshots can replace them.
- **Figures are typed in.** The homepage and Solutions page hold company figures and the six districts with their services inline, as constants. In the Next.js build these must come from `content/canon.json` and `src/lib/districts.ts`.
- **Service links** point to real site routes (for example `/solutions/systems/erp`). They return 404 on a plain static host unless a redirect or `404.html` is added.
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

## Imported copy

- **Text comes from the current site.** The 67 inner pages carry the published wording, converted to UK spelling by `tools/extract.py`. It has not had an editorial pass.
- **Claims and figures need sign-off before publishing**, in the same way as the case-study metrics: for example the GPU specifications, "10x faster model training", "99.99% availability", "50+ EBS deployments" and the monthly message and delivery-rate figures on the GMS case study.
- **Section order inside long articles follows the extractor.** Headings, paragraphs, lists, tables and callouts are kept, but a few layouts (side-by-side comparisons, quotes) fall back to plain cards or paragraphs. Read each article against the live page before porting.

## Open items

Rules: `DESIGN-SYSTEM.md` (v3). The next steps are porting the pages into the Next.js site and swapping DM Sans for Cosmica once the font files are licensed.
