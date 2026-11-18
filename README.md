# Aitropolis redesign prototypes

Standalone HTML prototypes of the redesigned site. They are a design test for the Aitropolis website redesign and are not the live site.

| Page | File |
|---|---|
| Homepage | `index.html` |
| Solutions hub | `solutions.html` |
| Industries | `industries.html` (generated) |
| Case studies | `case-studies.html` (generated) |
| Partners | `partners.html` (generated) |
| About | `about.html` (generated) |
| Contact | `contact.html` (generated) |

Shared code lives in `assets/site.css` and `assets/site.js`. `assets/icons.js` is the inline Lucide icon sprite (ISC licence, see `assets/LICENSE-lucide.txt`). Each page adds its own markup and a small page script. `assets/` also holds the logo files and the favicon set (`icon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`), all the electric blue symbol. The Solutions mega menu and the district data are in `assets/site.js`.

## Generated pages

`index.html` and `solutions.html` are hand-written. The other four pages are generated from `src/`: each page is `src/<name>.html` (a few `key: value` lines, then the body) plus an optional `src/<name>.js`, wrapped in the shared header, footer, header bar and menu from `src/shell.html` and `src/header.html`. Edit the sources, then rebuild and commit the output:

```bash
python3 tools/build.py
```

The build also stamps every page's script and stylesheet links with a version, so browsers never serve a stale file after a deploy.

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

## Open items

Rules: `DESIGN-SYSTEM.md` (v3). The next steps are porting both pages into the Next.js site, redesigning the inner pages, and swapping DM Sans for Cosmica once the font files are licensed.
