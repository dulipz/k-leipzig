# Komödie Leipzig — Website (Astro)

Mobile-first, GDPR-freundliche Website für die **Kleine Komödie Reuden**.
Statisch gerendert mit **Astro**, gedacht für **Cloudflare Pages**.

## Schnellstart

```bash
npm install
npm run dev      # Entwicklungsserver: http://localhost:4321
npm run build    # Produktions-Build nach ./dist
npm run preview  # Build lokal ansehen
```

Node 18+ erforderlich.

## Inhalts-Modell (Content Collections)

Zwei Quellen speisen die ganze Seite — einmal pflegen, überall sichtbar:

- **`src/content/produktionen/*.md`** — der Katalog der Inszenierungen
  („das Was“). Eine Markdown-Datei pro Stück. Felder: `titel`, `untertitel`,
  `typ` (`theater` | `dinner` | `familie`), `preisAb`, `reihenfolge`.
  Speist die Programm-Karten und (später) die Detailseiten.
- **`src/data/termine.json`** — der Spielplan („das Wann“). Liste von
  Vorstellungen; jede verweist per `produktion`-ID auf ein Stück. Felder:
  `datum` (ISO `JJJJ-MM-TT`), `uhrzeit`, `status` (`verfuegbar` |
  `ausverkauft`), optional `ticketUrl`. Speist „Nächste Vorstellungen“
  auf der Startseite und (später) die Spielplan-Seite.

Das Schema steht in `src/content.config.ts`.

## Was bereits steht

- Startseite (`src/pages/index.astro`), datengetrieben aus beiden Collections
- Design-System in `src/styles/global.css` (Palette: #421531 / #f4a14d / #000)
- Header, Footer, Produktions-Karte, Termin-Zeile als Komponenten
- Basis-SEO: Titel/Description, Open Graph, `PerformingArtsTheater`-JSON-LD

## Platzhalter (noch zu ersetzen)

- Telefonnummer (`[Telefon folgt]` in Header & Footer)
- Show-Plakate / Fotos („Plakat folgt“)
- Beispiel-Termine & Beispiel-Preise
- Social-Links (Facebook/Instagram)

## Nächste Schritte

1. **Spielplan-, Detail-, Venue- und Rechtsseiten** als eigene Routen ergänzen.
2. **Keystatic** als Backend aufsetzen (`/keystatic`), damit die Inhaberschaft
   Produktionen & Termine ohne Code pflegen kann.
3. **Ticketing** anbinden (Reservix / eveeno / Pretix) → füllt `ticketUrl`.
4. **Cloudflare-Adapter** (`@astrojs/cloudflare`) ergänzen, sobald ein
   serverseitiger Endpunkt nötig ist (Kontaktformular via Resend).
# k-leipzig
