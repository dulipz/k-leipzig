# Inhalte pflegen mit Keystatic

Das Redaktions-Backend läuft unter **`/keystatic`** und kann **Produktionen**,
**Termine** und das **Ensemble** verwalten (anlegen, ändern, löschen).

- **Beim Entwickeln (lokal):** Speichermodus *local* – Änderungen gehen direkt
  in die Projektdateien.
- **Auf der veröffentlichten Seite:** Speichermodus *Keystatic Cloud* – die
  Redaktion meldet sich mit eigenem **Login (E-Mail/Passwort)** an; kein
  GitHub-Konto nötig. Änderungen werden automatisch in das GitHub-Repo
  geschrieben, Cloudflare baut die Seite neu.

Die öffentlichen Seiten bleiben statisch und schnell – nur das Backend
(`/keystatic` + `/api/keystatic`) läuft serverseitig über den Cloudflare-Adapter.

---

## Einmalige Einrichtung (für den Live-Login)

1. **Keystatic-Cloud-Konto anlegen:** https://keystatic.cloud → Team + Projekt
   erstellen. Den Projekt-Slug notieren (Format `team-name/projekt-name`).
2. **Projekt-Slug eintragen:** in `keystatic.config.ts` die Zeile
   `cloud: { project: 'DEIN-TEAM/k-leipzig' }` auf den echten Slug ändern.
3. **GitHub-Repo verbinden:** im Keystatic-Cloud-Projekt das Repo
   `dulipz/k-leipzig` verknüpfen und autorisieren (damit Cloud Inhalte
   committen darf).
4. **Erlaubte Domains:** in den Keystatic-Cloud-Projekteinstellungen die
   Produktions-URL (z. B. `https://www.komoedie-leipzig.de`) und für lokale
   Tests `http://localhost:4321` hinzufügen.
5. **Cloudflare Pages – Node-Kompatibilität:** im Pages-Projekt unter
   *Settings → Functions* (Production **und** Preview) das Compatibility-Flag
   **`nodejs_compat`** setzen und ein aktuelles Compatibility-Date wählen.
   Build-Befehl bleibt `npm run build`, Ausgabe-Ordner `dist`.

Danach beim nächsten Deploy ist `https://<domain>/keystatic` mit Login erreichbar.

> Im Cloud-Modus sind **keine geheimen Schlüssel** in Cloudflare nötig – die
> Anmeldung übernimmt Keystatic Cloud.

---

## Lokal bearbeiten / Vorschau

```bash
npm install        # einmalig bzw. nach Updates
npm run dev        # lokale Vorschau
```

- Website: http://localhost:4321
- Backend: http://localhost:4321/keystatic  (lokaler Modus, schreibt in Dateien)

## Veröffentlichen

- **Über das Live-Backend:** Redaktion öffnet `https://<domain>/keystatic`,
  meldet sich an, ändert Inhalte → Keystatic Cloud committet ins Repo →
  Cloudflare baut automatisch neu.
- **Lokal geänderte Inhalte:** committen und pushen:

  ```bash
  git add -A && git commit -m "Inhalte aktualisiert" && git push
  ```

---

## Was verwaltet wird

- **Produktionen** – `src/content/produktionen/*.mdoc`
  (Titel, Untertitel, Typ, Preis ab, Reihenfolge, Beschreibung).
- **Termine (Spielplan)** – `src/data/termine.json`
  (Liste aus Produktion, Datum, Uhrzeit, Status, optional Ticket-Link).
- **Ensemble** – `src/content/ensemble/*.yaml`, Fotos unter
  `public/images/ensemble/`; sichtbar auf **/ensemble**.

  > Hinweis: Das Ensemble wurde aus den vorhandenen Fotos vorbefüllt. Die Namen
  > sind Platzhalter (aus den Dateinamen) – bitte einmal Name, Rolle und Bio
  > ergänzen.

---

## Ausverkauft-Schalter (`/sinahamala`)

Interne, nicht verlinkte Seite für die Kasse: kommende Vorstellungen mit einem Tipp
auf **Ausverkauft** / **Karten frei** setzen. Ein gemeinsames Passwort, Login bleibt
30 Tage gespeichert. Jede Änderung wird direkt in `src/data/termine.json` im GitHub-Repo
gespeichert (nur die eine Status-Zeile) → Cloudflare baut neu → nach ca. 2 Minuten live.

**Einrichtung (Cloudflare → Projekt `k-leipzig` → Settings → Variables and Secrets):**

| Name | Typ | Wert |
|---|---|---|
| `SINAHAMALA_PASSWORD` | Secret | das gemeinsame Passwort |
| `GITHUB_TOKEN` | Secret | GitHub Fine-grained Token: nur Repo `dulipz/k-leipzig`, Berechtigung *Contents: Read and write* |
| `GITHUB_BRANCH` | Text (optional) | Standard `master` – nur ändern, falls Cloudflare von einem anderen Branch baut |

Passwort ändern = Secret ändern → alle Geräte sind abgemeldet.

**Lokal testen:** `.dev.vars` mit `SINAHAMALA_PASSWORD=...` anlegen (nicht committen),
`npm run dev`, dann http://localhost:4321/sinahamala. Ohne `GITHUB_TOKEN` wird lokal
direkt die Datei geändert.
