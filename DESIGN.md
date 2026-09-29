# Design system: L'Angolo del Compleanno

Recorded from the shipped build (index.html, style.css, script.js). Revised to a quieter system at the user's request: warm blush base, colour used sparingly, no numbered labels, badges, gloss or tilted cards, one soft entrance motion.

## Colour (rationed by role)

Palette derived from the ui-ux-pro-max "Wedding/Event Planning" profile (romantic rose + elegant gold on a rosy ground), warmed to match the coral, pearl and gold balloon illustrations.

| Token | Hex | Role |
|---|---|---|
| `--bg` | #FCF1EC | Page background (warm blush) |
| `--surface` | #FFFFFF | Cards, form, hours table |
| `--band` | #F7E1D9 | Alternate sections (Servizi, Contatti), composer preview |
| `--gold-soft` | #FBEBCB | "Come funziona" band, feature art field, "oggi" badge, selection |
| `--ink` | #3A1F2B | Text, dark buttons, footer (13.4:1 on bg) |
| `--ink-2` | #6E4F5A | Secondary text (6.5:1 on bg, 5.7:1 on band) |
| `--rose` | #C8375A | ACTION: primary buttons with white text (5.1:1), link underlines |
| `--rose-hi` | #B8324F | Primary hover |
| `--rose-deep` | #9E2A47 | Focus ring, icons, required marks (6.6:1 on bg) |
| `--gold` | #E3A21A | Rating stars |
| `--line` / `--line-2` | #EDD8CF / #DDBFB3 | Rules, input borders |

Balloon colours (content, not UI) live in `COLORI` in script.js and in the illustrations: coral, blush, sun, butter, sky, azure, pearl, gold, sage, lilac (hero panels recoloured to dusty rose and soft gold), each as light/base/dark radial gradient stops.

## Type

- Display: **Red Hat Display** variable (self-hosted, `fonts/redhat-display-latin.woff2`), weight 700 (800 for the wordmark), tracking -0.02/-0.03em.
- Body/UI: **Red Hat Text** variable (`fonts/redhat-text-latin.woff2`), 17px / 1.6.
- Scale: display `clamp(2.4rem … 4.4rem)`, h2 `clamp(1.9rem … 3rem)`, h3 1.2rem, lead `clamp(1.08rem … 1.25rem)`.

## Components

- **Occasion card:** white card, 24px radius, tinted art field (band / gold-soft), title, one sentence, "Chiedi un preventivo" link; horizontal on phones.
- **Reviews:** score line plus real Google review quotes (lightly corrected typos, abbreviated names) separated by rules.
- **Buttons:** pill, 42/48/54px. Primary rose with white text; ink; line. Text links underlined in rose.
- **Composer:** band-coloured preview panel with live SVG bouquet recoloured through CSS custom properties, swatch balls, 50px inputs with 12px radius.

## Hero

Full-bleed photo of one of the shop's real set-ups (from their Google Business listing, `img/hero-1600.jpg` / `img/hero-900.jpg`) at 42% opacity over the blush page, fading out at the bottom (mask), with a soft blush glow behind the centred text. Dark ink title with the business name only, no slogan.

## One continuous page

All sections sit on the same blush ground (no alternating bands); cards stay white. Behind everything, `[data-ribbons]` draws two satin ribbons (rose left, gold right, each with a thin dotted companion line) along the page edges, built in JS on the real size of `<main>` so they run uninterrupted from section to section, with a few balloons tied to them. They unroll down to the bottom of the screen as you scroll.

## Occasions

"Palloncini e allestimenti per ogni festa": six cards (Battesimi, Comunioni, Compleanni, 18 anni, Matrimoni, Eventi, all confirmed by public sources) with illustrations in `img/occasioni/`, each linking to the quote form with the occasion pre-selected; below, a strip with the confirmed services.

## Motion

- Load: hero title rises word by word, then lead, buttons and rating (ease-out cubic-bezier(.23,1,.32,1)).
- Scroll-linked (CSS scroll-driven animations, only where `animation-timeline` is supported and motion is allowed): hero photo drifts slower than the page and the hero text fades away; blocks fade up as they enter the viewport; the composer bouquet floats up gently while crossing the screen; the edge ribbons unroll with the scroll.
- In view: the illustrated set-up in "Chi siamo" assembles once (panels rise, balloons inflate) when 35% visible.
- Fallback without scroll timelines: IntersectionObserver fade-up. `prefers-reduced-motion` shows everything static.

## Space and layout

Container 1200px, gutter `clamp(16px, 4.5vw, 40px)`, section padding `clamp(80px, 10vw, 136px)`. Breakpoints: 480, 560, 600, 800, 900, 960px.

## Assets

Hero photo is the business's own (Google Business listing). Illustrations are authored SVG: the set-up illustration inline in "Chi siamo", feature illustration `img/figurine/balloon-art.svg`, `favicon.svg`.
