# Komödie Leipzig — Design System

> **Vorhang & Rampenlicht** (Curtain & Footlights)
> A warm, theatrical identity system for Komödie Leipzig — *„Das Original — Bei uns lachen Sie besser!"*

---

## 1 · The brand

**Komödie Leipzig** is a small, family-run German **comedy dinner-theatre**
(*Dinnertheater / Erlebnisgastronomie*). It is run by **Irene Holzfurtner & Mathias Engel**
(Geschäftsführung / Intendanz), with **Moritz Holzfurtner** leading the theatre bar.

In **March 2026** the company opens its first permanent venue — the **„Kleine Komödie" Reuden**
— a ~80–90-seat theatre built inside a converted **old barn** in *Reuden an der Fuhne*, near
Bitterfeld-Wolfen. Guests come for an evening that pairs a **4-course dinner** with a staged
comedy; the bar serves the unpretentious classics (Bockwurst & Brezel).

The repertoire is **nostalgic, beloved German & cult film comedies**, restaged for the dinner
stage: *Go Trabi Go, Die Olsenbande, 3 Haselnüsse für Aschenbrödel, Die Feuerzangenbowle,
Pension Schöller, Im weißen Rössl, Ein Sommernachtstraum, Mit 66 Jahren, Eine
Weihnachtsgeschichte* and more. The audience skews warm and multi-generational; the feeling is
that of a cosy provincial theatre with real heart.

This system was commissioned as part of a **logo & brand redesign**. The new identity keeps the
historic palette (gold-on-black with a plum accent) but trades the old beveled-chrome wordmark
for something warmer, more confident and more theatrical.

### Sources reviewed
- **Old logo:** `assets/logo-old.png` (the historic beveled gold-on-black wordmark; colours sampled from it).
- **Current website:** <https://www.komoedie-leipzig.de/index.html> — a dated, table-based 2018 site. Reviewed for copy, programme and tone; not used for visual direction.
- **Imprint / contact:** Komödie Leipzig, Dorfstraße 23, 06766 Reuden an der Fuhne · kontakt@komoedie-leipzig.de · facebook.com/Komödie-Leipzig

---

## 2 · Content fundamentals — how Komödie Leipzig writes

**Language:** German. Warm, courteous, a little old-fashioned in the best way — the voice of
gracious hosts welcoming you into their home.

- **Address the guest as „Sie"**, always. Guests are *„Liebe Gäste"*. Never the informal *du*.
- **Tone:** heartfelt, hospitable, gently witty. It invites and reassures rather than sells.
  Sign-offs are personal and real: *„Wir freuen uns auf Ihren Besuch! Mit freundlichen Grüßen,
  Irene Holzfurtner & Mathias Engel."*
- **The anchor line / claim:** **„Bei uns lachen Sie besser."** — owns the whole brand. The
  secondary descriptor is **„Das Original"** and **„Dinnertheater"**.
- **Casing:** headline-style and full sentences both appear. The wordmark itself is **all-caps**;
  body copy uses normal German capitalisation. Reserve ALL-CAPS for short eyebrows / labels
  (*AKTUELL IM SPIELPLAN*, *ABGESPIELT*), never for paragraphs.
- **Genre tags** are a brand signature: every show is filed under a hyphenated *„…-Komödie"* —
  *Trabi-Komödie, Gauner-Komödie, Spar-Komödie, Liebes-Komödie, Märchen-Komödie,
  Weihnachts-Komödie, Kult-Komödie*. Use these as Badges.
- **Punctuation flourish:** the site uses repeated chevrons for "more" links — *„mehr ▸"*.
  Keep a single chevron as the brand's directional cue.
- **Emoji:** none. Not part of the voice. Use the icon set instead.
- **Numbers:** German formatting — prices as `24,50 €` (comma decimal, € after the number with a
  thin space); dates as `Fr · 13.03.2026`; times as `19:30 Uhr`.

**Do:** „Reservieren Sie Ihren Tisch", „Ein Abend voller …", „Wir freuen uns auf Sie".
**Don't:** hype-speak, exclamation spam, anglicisms, „Jetzt buchen!!!".

---

## 3 · Visual foundations

The mood is a **warm theatre at curtain-up**: deep stage darks, gold footlights, a velvet-plum
curtain, and cream playbill paper. Everything is **warm-tinted — there is no cold grey** anywhere
in the palette.

### Colour
- **Bühnengold (`--gold-500` #E2841C)** — the primary. The laugh, the footlight, the brass. Used
  for CTAs, the wordmark on dark, eyebrows, active states.
- **Vorhang plum (`--plum-500` #7C3A60`, deepening to `--plum-900`)** — the secondary / curtain.
  Dark stage surfaces, accents, the velvet behind the gold.
- **Warm neutrals** run from **`--ink-950` #15100E** (deep, warm stage-black) up to
  **`--parchment` #FDF8EF** (playbill paper, the default light surface).
- **Two surface contexts:** *light "playbill"* (parchment + white cards, dark ink text — the
  default for content) and *dark "stage"* (ink/plum + gold + cream — for heroes, marquees,
  footers). Components carry a `tone`/`onStage` switch for this.
- Semantic hues are kept warm: success = curtain-call green, danger = brick *rouge*, warning
  leans into the amber, info = a restrained dusk blue. Use sparingly.

### Type
- **Display — Lo-Type** (Louis Oppenheim, 1914; **self-hosted** brand font): the *playbill
  voice*. Wordmark, show titles, big numbers. A warm, characterful German display serif with
  genuine period heritage — the right historical register for a Leipzig theatre. **Single weight
  (Regular 400);** drive hierarchy with size, never faux-bold it.
- **Sans — Bricolage Grotesque** (CDN): warm, slightly characterful grotesque. All UI, body, labels,
  buttons. Readable, friendly, with just enough wonk to feel like comedy.
- **Eyebrow / kicker** is a brand device: small, **uppercase, gold, wide-tracked** sans line
  above headings (see `.kl-eyebrow`).
- Scale is a 1.25 ramp on 16px; never below 11px. Body 16/24.

### Backgrounds & texture
- No photo-as-everything. The signature backdrop is the **footlight glow**: a warm gold
  radial-gradient rising from the lower edge with a plum wash from a top corner — see the
  `.kl-stage` helper. It evokes light spilling up onto a curtain.
- Production imagery (show stills, cast photos) is **warm-graded**, never cold or desaturated.
  Present it inside cards with a soft warm shadow; full-bleed only for hero posters.
- No busy patterns or noise. The historic logo's motion-blur streaks are **retired**.

### Shape, depth & motion
- **Radii are soft but modest** — `--radius-md` 10px on cards/inputs, `--radius-pill` for tags &
  ghost buttons. Not a bubbly app; a warm classic brand.
- **Shadows are warm-tinted** (cast in ink, not neutral black) and low. A special
  `--shadow-glow` gold halo is reserved for the primary hero CTA / hovered poster.
- On dark stage cards, depth comes from a **hairline rim** (`--shadow-stage-rim`) rather than a drop shadow.
- **Motion is gentle and theatrical:** content fades & glides up (`--ease-curtain`), curtains and
  footlights *fade in*. **No bounces, no springs.** Respect `prefers-reduced-motion`.
- **Hover:** fills deepen one step (gold-500 → gold-600), ghost/links shift toward gold-600,
  posters lift with the glow shadow. **Press:** a subtle `scale(0.98)`, no colour flash.
- **Borders:** hairline `--border-default` on light; translucent champagne `--border-stage` on dark.
- **Focus:** 2px gold outline, 2px offset — always visible.

---

## 4 · Iconography

The brand has **no historic icon set** (the old site used plain text links and chevrons).

- **System icons:** **[Lucide](https://lucide.dev)** — loaded from CDN. *(Substitution flagged: Lucide
  was chosen as the closest match for a warm, friendly, modern brand — clean ~1.75px strokes,
  rounded joins. If you adopt a different set, update this section.)* Stroke icons only; size 20–24px;
  colour `currentColor` so they inherit text colour (gold on stage, ink on playbill).
- **Brand mark:** the **proscenium Monogram** (`components/brand/Monogram`) — a stage arch with
  three footlights and a serif K. Use as favicon, avatar, loading mark.
- **The single chevron `▸`** is the brand's directional cue ("mehr ▸", "weiter ▸"). Keep it
  singular; the old site's `>>>>` is retired.
- **No emoji.** Genre is communicated with text Badges, not pictograms.
- Do **not** hand-draw new pictograms in product work — pull from Lucide and recolour.

---

## 5 · Index / manifest

**Root**
- `styles.css` — the entry point consumers link. `@import` manifest only.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`.
- `assets/` — `logo-old.png` (historic reference).
- `readme.md` — this guide. · `SKILL.md` — Agent-Skill wrapper.

**Components** (`components/…`, namespace `window.KomDieLeipzigDesignSystem_ce970b`)
- `brand/` — **Wordmark**, **Monogram**
- `core/` — **Button**, **IconButton**, **Badge**
- `cards/` — **ShowCard**
- `forms/` — **Input**, **Select**

**UI kits** (`ui_kits/…`)
- `website/` — the marketing site: Home (hero + Spielplan), Show detail, Tickets/reservation.

**Slides** (`slides/`)
- Brand slide templates (title / programme / quote).

**Design System tab** — every `*.card.html` and specimen renders there, grouped Brand · Colors ·
Type · Spacing · Components · Website · Slides.

---

## 6 · Open questions / caveats
- **Fonts:** the display face **Lo-Type is self-hosted** (`fonts/Lo-Type_Regular.otf`, brand file
  supplied by the client) — single weight. The body face **Bricolage Grotesque is loaded from the
  Google Fonts CDN**; no brand file was provided for it and CDN delivery is fine. To self-host it
  too, add its `.woff2` files and swap the `@import` for `@font-face` rules.
- **Icons** use Lucide via CDN as a flagged substitution — confirm or replace.
- The redesigned **logo is type-built** (Lo-Type + a geometric proscenium mark). It is not yet a
  finalised vector lock-up; treat it as the agreed direction to hand to a vector tool.
