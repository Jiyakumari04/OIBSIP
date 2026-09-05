# Savitribai Phule — Tribute Page

**OIBSIP Track:** Web Development & Designing — Level 2, Task 2 (Tribute Page)

## About
A single-page tribute to Savitribai Phule, India's first female teacher and
a pioneer of girls' education and social reform in 19th-century Maharashtra.
Content is original, paraphrased writing based on well-documented
biographical facts — not copied from any source.

## Tech Stack
- HTML5
- CSS3 (separate file — no JavaScript)
- Google Fonts (Rozha One for display headings, Work Sans for body text)

**Note on JavaScript:** this task's tech stack marks JS as optional. The
flickering diyas and drifting petals are decorative CSS animations
(`@keyframes`), which don't need JavaScript to run — so no `script.js` is
included. If a future task needs actual interactive logic, a script file
will be added alongside it.

**Note on the photograph:** the image is hotlinked directly from Wikimedia
Commons (public domain), per the task brief's own suggestion to source
images from Wikimedia Commons or Unsplash rather than downloading and
re-hosting copies.

## Features
- Page title with subject name and one-line tagline
- Historical photograph of Savitribai Phule (public domain, hotlinked from
  Wikimedia Commons via `Special:FilePath`, with caption and attribution)
- Animated tribute beneath the portrait: five flickering CSS-drawn diyas
  (oil lamps) and a field of drifting marigold-toned petals — built entirely
  with CSS `@keyframes`, no JavaScript required. Respects
  `prefers-reduced-motion`.
- Biography section: original written content across two sections
- Timeline of 7 key life events (styled list)
- Distinctly styled quote block with attribution
- "Why It Still Matters" legacy section with 4 cards
- Two background colours alternate across sections (parchment / deeper parchment)
- Two font families used intentionally (serif display / sans body)
- Fully responsive layout

## How to view
Open `index.html` in any browser. Keep `style.css` in the same folder — it's
linked with a relative path.

## Folder placement in OIBSIP repo
```
OIBSIP/WebDev-L2-TributePage/
├── index.html
├── style.css
├── README.md
└── screenshots/   (add your own before pushing)
```

## Sources used for factual content
Biographical details were drawn from widely available public accounts of
Savitribai Phule's life, including her educational work with Jyotirao Phule,
her published poetry collections, and her death while treating plague
patients — all paraphrased into original wording for this page.

## Notes for submission
- Screenshot the hero section and at least one content section before pushing.
- Record the demo video per the SIP Task List workflow (2-second title card,
  then a scroll-through of the full page).
