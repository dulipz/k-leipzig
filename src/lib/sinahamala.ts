// Interne Seite /sinahamala – Ausverkauft-Schalter für die Kasse.
// Ein gemeinsamer Login (nur Passwort). Speichert den Status direkt in
// src/data/termine.json im GitHub-Repo – dieselbe Datei, die Keystatic pflegt.
// Cloudflare baut die Website danach automatisch neu (ca. 2 Minuten).
//
// Benötigte Umgebungsvariablen (Cloudflare → Settings → Variables and Secrets):
//   SINAHAMALA_PASSWORD  – das gemeinsame Passwort (als Secret)
//   GITHUB_TOKEN         – Fine-grained Token, nur Repo k-leipzig, "Contents: Read and write" (als Secret)
//   GITHUB_REPO          – optional, Standard "dulipz/k-leipzig"
//   GITHUB_BRANCH        – optional, Standard "master"
// Lokal (npm run dev) reicht SINAHAMALA_PASSWORD in .dev.vars – ohne GITHUB_TOKEN
// wird dann direkt die lokale Datei geändert.

export const COOKIE = 'sh_session';
const SESSION_DAYS = 30;
const FILE_PATH = 'src/data/termine.json';

export type Status = 'verfuegbar' | 'ausverkauft';
export interface Termin {
  produktion: string;
  datum: string;
  uhrzeit: string;
  ort?: string | null;
  art?: string | null;
  status?: Status;
  plaetze?: number | null;
  [k: string]: unknown;
}
interface Env {
  SINAHAMALA_PASSWORD?: string;
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
}

export function getEnv(locals: any): Env {
  const rt = (locals?.runtime?.env ?? {}) as Record<string, string | undefined>;
  const pick = (k: keyof Env) =>
    rt[k] ?? (import.meta.env as any)[k] ?? (typeof process !== 'undefined' ? process.env?.[k] : undefined);
  return {
    SINAHAMALA_PASSWORD: pick('SINAHAMALA_PASSWORD'),
    GITHUB_TOKEN: pick('GITHUB_TOKEN'),
    GITHUB_REPO: pick('GITHUB_REPO') || 'dulipz/k-leipzig',
    GITHUB_BRANCH: pick('GITHUB_BRANCH') || 'master',
  };
}

export const terminKey = (t: Termin) => `${t.datum}|${t.uhrzeit}|${t.produktion}|${t.ort ?? ''}`;

/** Heutiges Datum in Berlin als YYYY-MM-DD */
export function heuteBerlin(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date());
}

// ---------- Login / Session ----------

const enc = new TextEncoder();

async function hmac(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function gleich(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function passwortOk(env: Env, eingabe: string): Promise<boolean> {
  if (!env.SINAHAMALA_PASSWORD) return false;
  // Über Hashes vergleichen, damit die Länge nichts verrät
  const [a, b] = await Promise.all([hmac('pw', eingabe), hmac('pw', env.SINAHAMALA_PASSWORD)]);
  return gleich(a, b);
}

/** Das Passwort ist zugleich der Signatur-Schlüssel: Passwort ändern = alle abgemeldet. */
export async function sessionErstellen(env: Env): Promise<{ value: string; maxAge: number }> {
  const maxAge = SESSION_DAYS * 24 * 3600;
  const exp = Math.floor(Date.now() / 1000) + maxAge;
  const sig = await hmac(env.SINAHAMALA_PASSWORD!, `sinahamala:${exp}`);
  return { value: `${exp}.${sig}`, maxAge };
}

export async function sessionGueltig(env: Env, wert?: string): Promise<boolean> {
  if (!wert || !env.SINAHAMALA_PASSWORD) return false;
  const [exp, sig] = wert.split('.');
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return gleich(sig, await hmac(env.SINAHAMALA_PASSWORD, `sinahamala:${exp}`));
}

export const cookieOptionen = (maxAge: number) => ({
  path: '/sinahamala',
  httpOnly: true,
  secure: !import.meta.env.DEV,
  sameSite: 'strict' as const,
  maxAge,
});

// ---------- Termine lesen / schreiben ----------

function b64encode(text: string): string {
  const bytes = enc.encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
function b64decode(b64: string): string {
  const bin = atob(b64.replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

const parse = (text: string): Termin[] => {
  const d = JSON.parse(text);
  return Array.isArray(d) ? d : d?.termine ?? [];
};
const serialisieren = (termine: Termin[]) => JSON.stringify({ termine }, null, 2) + '\n';

/**
 * Ändert nur die eine "status"-Zeile im Originaltext, damit die Datei sonst
 * Zeichen für Zeichen gleich bleibt (saubere Commits, Keystatic-Format bleibt).
 * Fällt auf komplettes Neuschreiben zurück, wenn die Datei unerwartet aussieht.
 */
export function statusImText(text: string, termine: Termin[], idx: number, status: Status): string {
  const re = /("status"\s*:\s*)"(verfuegbar|ausverkauft)"/g;
  const treffer = [...text.matchAll(re)];
  if (treffer.length === termine.length) {
    const m = treffer[idx];
    const neu = text.slice(0, m.index!) + `${m[1]}"${status}"` + text.slice(m.index! + m[0].length);
    const probe = parse(neu);
    if (probe.length === termine.length && probe[idx]?.status === status && terminKey(probe[idx]) === terminKey(termine[idx])) return neu;
  }
  const kopie = termine.map((t) => ({ ...t }));
  kopie[idx].status = status;
  return serialisieren(kopie);
}

export class SpeicherFehler extends Error {
  constructor(msg: string, public konflikt = false) {
    super(msg);
  }
}

export async function termineLesen(env: Env, stand?: string): Promise<{ termine: Termin[]; sha: string | null; text: string }> {
  if (!env.GITHUB_TOKEN) {
    if (import.meta.env.DEV) {
      const fs = await import('node:fs/promises');
      const text = await fs.readFile(FILE_PATH, 'utf-8');
      return { termine: parse(text), sha: null, text };
    }
    throw new SpeicherFehler('GITHUB_TOKEN fehlt in den Cloudflare-Einstellungen.');
  }
  const res = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${FILE_PATH}?ref=${encodeURIComponent(stand ?? env.GITHUB_BRANCH!)}`,
    { headers: ghHeaders(env), cache: 'no-store' } as RequestInit
  );
  if (!res.ok) throw new SpeicherFehler(`Spielplan konnte nicht geladen werden (GitHub ${res.status}).`);
  const j: any = await res.json();
  const text = b64decode(j.content);
  return { termine: parse(text), sha: j.sha, text };
}

export async function termineSchreiben(env: Env, text: string, sha: string | null, nachricht: string) {
  if (!env.GITHUB_TOKEN) {
    if (import.meta.env.DEV) {
      const fs = await import('node:fs/promises');
      await fs.writeFile(FILE_PATH, text, 'utf-8');
      return;
    }
    throw new SpeicherFehler('GITHUB_TOKEN fehlt in den Cloudflare-Einstellungen.');
  }
  const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/contents/${FILE_PATH}`, {
    method: 'PUT',
    headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: nachricht, content: b64encode(text), sha, branch: env.GITHUB_BRANCH }),
  });
  if (res.status === 409 || res.status === 422) throw new SpeicherFehler('Konflikt', true);
  if (!res.ok) throw new SpeicherFehler(`Speichern fehlgeschlagen (GitHub ${res.status}).`);
}

function ghHeaders(env: Env): Record<string, string> {
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'komoedie-leipzig-sinahamala',
  };
}

// ---------- Neue Stücke & Termine (Tabs „Neues Stück“ / „Termine eintragen“) ----------

/**
 * Termine haben kein Vorlauf-Limit (Wunsch der Komödie). Nur unsinnige Jahre
 * (Tippfehler wie 20277) werden abgelehnt; ab WARNUNG_JAHRE fragt die Seite nach.
 */
export const SPAETESTES_DATUM = '2099-12-31';
export const WARNUNG_JAHRE = 2;

/** "Die Feuerzangenbowle" → "die-feuerzangenbowle" (wie die bestehenden Dateinamen) */
export function slugify(s: string): string {
  return s
    .replace(/<[^>]*>/g, ' ')
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export const PRODUKTION_DIR = 'src/content/produktionen';
export const PLAKAT_DIR = 'public/images/produktionen';

const yamlStr = (s: string) => JSON.stringify(s); // JSON-Strings sind gültiges YAML

export function produktionMdoc(p: {
  titel: string; untertitel: string; typ: string; preisAb: number; reihenfolge: number; plakat?: string | null; beschreibung?: string;
}): string {
  const zeilen = [
    '---',
    `titel: ${yamlStr(p.titel)}`,
    `untertitel: ${yamlStr(p.untertitel)}`,
    `typ: ${yamlStr(p.typ)}`,
    `preisAb: ${p.preisAb}`,
    `reihenfolge: ${p.reihenfolge}`,
  ];
  if (p.plakat) zeilen.push(`plakat: ${yamlStr(p.plakat)}`);
  zeilen.push('---');
  // Markdoc-Tags aus Freitext entschärfen, damit der Build nicht bricht
  const text = (p.beschreibung ?? '').replace(/\r\n?/g, '\n').replace(/\{%/g, '{ %').trim();
  return zeilen.join('\n') + '\n' + (text ? text + '\n' : '');
}

/** Hängt neue Termine an den Originaltext an (Rest der Datei bleibt unverändert). */
export function termineAnhaengen(text: string, alt: Termin[], neu: Termin[]): string {
  const block = neu
    .map((t) => JSON.stringify(t, null, 2).split('\n').map((l) => '    ' + l).join('\n'))
    .join(',\n');
  const m = text.match(/\}\s*\]\s*\}\s*$/);
  if (m && alt.length) {
    const pos = m.index! + 1; // nach der letzten "}"
    const kandidat = text.slice(0, pos) + ',\n' + block + text.slice(pos);
    try {
      const probe = parse(kandidat);
      if (probe.length === alt.length + neu.length) return kandidat;
    } catch { /* Fallback unten */ }
  }
  return serialisieren([...alt, ...neu]);
}

export async function dateiExistiert(env: Env, pfad: string, stand?: string): Promise<boolean> {
  if (!env.GITHUB_TOKEN) {
    if (import.meta.env.DEV) {
      const fs = await import('node:fs');
      return fs.existsSync(pfad);
    }
    throw new SpeicherFehler('GITHUB_TOKEN fehlt in den Cloudflare-Einstellungen.');
  }
  const res = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${pfad}?ref=${encodeURIComponent(stand ?? env.GITHUB_BRANCH!)}`,
    { method: 'HEAD', headers: ghHeaders(env), cache: 'no-store' } as RequestInit
  );
  if (res.status === 404) return false;
  if (!res.ok) throw new SpeicherFehler(`GitHub nicht erreichbar (${res.status}).`);
  return true;
}

/**
 * Schreibt mehrere Dateien in EINEM Commit (Stück + Plakat zusammen →
 * nur ein Neubau bei Cloudflare). content ist Base64.
 */
export type Aenderung = { pfad: string; base64: string } | { pfad: string; loeschen: true };

/** Aktueller Commit des Branches (null im lokalen Modus). */
export async function aktuellerStand(env: Env): Promise<string | null> {
  if (!env.GITHUB_TOKEN) return null;
  const r = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/git/ref/heads/${encodeURIComponent(env.GITHUB_BRANCH!)}`, {
    headers: ghHeaders(env), cache: 'no-store',
  } as RequestInit);
  if (!r.ok) throw new SpeicherFehler(`GitHub nicht erreichbar (${r.status}).`);
  return ((await r.json()) as any).object.sha;
}

/**
 * basis: Commit, auf dem die Änderungen berechnet wurden. Hat sich der Branch
 * inzwischen bewegt, schlägt das Speichern als Konflikt fehl (→ neu versuchen).
 */
export async function dateienCommitten(env: Env, dateien: Aenderung[], nachricht: string, basis?: string | null) {
  if (!env.GITHUB_TOKEN) {
    if (import.meta.env.DEV) {
      const fs = await import('node:fs/promises');
      const path = await import('node:path');
      for (const d of dateien) {
        if ('loeschen' in d) { await fs.rm(d.pfad, { force: true }); continue; }
        await fs.mkdir(path.dirname(d.pfad), { recursive: true });
        await fs.writeFile(d.pfad, Uint8Array.from(atob(d.base64), (c) => c.charCodeAt(0)));
      }
      return;
    }
    throw new SpeicherFehler('GITHUB_TOKEN fehlt in den Cloudflare-Einstellungen.');
  }
  const api = `https://api.github.com/repos/${env.GITHUB_REPO}/git`;
  const h = { ...ghHeaders(env), 'Content-Type': 'application/json' };
  const gh = async (url: string, init?: RequestInit) => {
    const r = await fetch(url, { headers: h, cache: 'no-store', ...init } as RequestInit);
    if (r.status === 409 || r.status === 422) throw new SpeicherFehler('Konflikt', true);
    if (!r.ok) throw new SpeicherFehler(`Speichern fehlgeschlagen (GitHub ${r.status}).`);
    return r.json() as Promise<any>;
  };
  const parent = basis ?? ((await gh(`${api}/ref/heads/${encodeURIComponent(env.GITHUB_BRANCH!)}`)).object.sha as string);
  const commit = await gh(`${api}/commits/${parent}`);
  const blobs = await Promise.all(
    dateien.map((d) =>
      'loeschen' in d ? null : gh(`${api}/blobs`, { method: 'POST', body: JSON.stringify({ content: d.base64, encoding: 'base64' }) })
    )
  );
  const tree = await gh(`${api}/trees`, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: commit.tree.sha,
      tree: dateien.map((d, i) => ({ path: d.pfad, mode: '100644', type: 'blob', sha: 'loeschen' in d ? null : blobs[i].sha })),
    }),
  });
  const neu = await gh(`${api}/commits`, {
    method: 'POST',
    body: JSON.stringify({ message: nachricht, tree: tree.sha, parents: [parent] }),
  });
  await gh(`${api}/refs/heads/${encodeURIComponent(env.GITHUB_BRANCH!)}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: neu.sha, force: false }),
  });
}

export const textZuBase64 = (text: string) => b64encode(text);

export const TERMINE_PFAD = FILE_PATH;
export const termineOhne = (termine: Termin[], produktion: string) => {
  const rest = termine.filter((t) => t.produktion !== produktion);
  return { rest, text: serialisieren(rest) };
};

/** Liest eine Textdatei aus dem Repo (oder lokal). null = gibt es nicht. */
export async function dateiLesen(env: Env, pfad: string, stand?: string | null): Promise<string | null> {
  if (!env.GITHUB_TOKEN) {
    if (import.meta.env.DEV) {
      const fs = await import('node:fs/promises');
      return fs.readFile(pfad, 'utf-8').catch(() => null);
    }
    throw new SpeicherFehler('GITHUB_TOKEN fehlt in den Cloudflare-Einstellungen.');
  }
  const res = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${pfad}?ref=${encodeURIComponent(stand ?? env.GITHUB_BRANCH!)}`,
    { headers: ghHeaders(env), cache: 'no-store' } as RequestInit
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new SpeicherFehler(`GitHub nicht erreichbar (${res.status}).`);
  return b64decode(((await res.json()) as any).content);
}

/** Frontmatter-Wert (einzeilig) lesen, z. B. plakat oder reihenfolge. */
export function fmWert(text: string, key: string): string | null {
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  const m = fm?.[1].match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  if (!m) return null;
  const v = m[1].trim();
  try { return v.startsWith('"') ? JSON.parse(v) : v; } catch { return v.replace(/^"|"$/g, ''); }
}

/**
 * Ändert nur die angegebenen einzeiligen Frontmatter-Felder (Regie, Besetzung,
 * Hinweise usw. bleiben unangetastet) und ersetzt optional die Beschreibung.
 * Wert null = Feld entfernen.
 */
export function mdocBearbeiten(text: string, felder: Record<string, string | number | null>, beschreibung?: string): string {
  const m = text.replace(/\r\n?/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new SpeicherFehler('Die Datei des Stücks hat ein unerwartetes Format – bitte in Keystatic bearbeiten.');
  let zeilen = m[1].split('\n');
  for (const [key, wert] of Object.entries(felder)) {
    const neu = wert === null ? null : `${key}: ${typeof wert === 'number' ? wert : yamlStr(wert)}`;
    const i = zeilen.findIndex((z) => z.startsWith(`${key}:`));
    if (i >= 0) {
      if (neu === null) zeilen.splice(i, 1); else zeilen[i] = neu;
    } else if (neu !== null) {
      zeilen.push(neu);
    }
  }
  let body = m[2];
  if (beschreibung !== undefined) {
    const t = beschreibung.replace(/\r\n?/g, '\n').replace(/\{%/g, '{ %').trim();
    body = t ? t + '\n' : '';
  }
  return `---\n${zeilen.join('\n')}\n---\n${body}`;
}

/** Plakat-Dateiname mit Version, damit Browser kein altes Bild aus dem Cache zeigen. */
export const plakatDatei = (slug: string) => `${PLAKAT_DIR}/${slug}-${Date.now().toString(36)}.jpg`;

/** Hochgeladenes Plakat (unter /images/produktionen/<slug>…) → Repo-Pfad zum Löschen, sonst null. */
export function eigenesPlakat(slug: string, plakat: string | null): string | null {
  if (!plakat || !plakat.startsWith(`/images/produktionen/${slug}`)) return null;
  return 'public' + plakat;
}

/** Base64-JPEG aus dem Browser prüfen. Gibt reines Base64 zurück oder wirft. */
export function bildPruefen(roh: unknown): string {
  const bild = String(roh ?? '').replace(/^data:[^,]+,/, '');
  if (bild.length * 0.75 > 4 * 1024 * 1024) throw new SpeicherFehler('Das Bild ist zu groß.');
  let kopf = '';
  try { kopf = atob(bild.slice(0, 8)); } catch { throw new SpeicherFehler('Das Bild konnte nicht gelesen werden.'); }
  if (kopf.charCodeAt(0) !== 0xff || kopf.charCodeAt(1) !== 0xd8) throw new SpeicherFehler('Bitte ein JPG- oder PNG-Bild wählen.');
  return bild;
}

// ---------- Ticket-Zähler (freie Plätze) ----------

/**
 * Setzt die freien Plätze einer Vorstellung. 0 → automatisch ausverkauft,
 * von 0 wieder hoch → automatisch wieder buchbar. null = Zähler aus.
 */
export function plaetzeSetzen(termine: Termin[], idx: number, plaetze: number | null): { text: string; status: Status } {
  const kopie = termine.map((t) => ({ ...t }));
  const t = kopie[idx];
  const vorher = typeof t.plaetze === 'number' ? t.plaetze : null;
  if (plaetze === null) delete t.plaetze; else t.plaetze = plaetze;
  if (plaetze === 0) t.status = 'ausverkauft';
  else if (plaetze !== null && plaetze > 0 && vorher === 0) t.status = 'verfuegbar';
  return { text: serialisieren(kopie), status: (t.status ?? 'verfuegbar') as Status };
}

// ---------- Einzelnen Termin bearbeiten / löschen ----------

/** Ersetzt die Felder eines Termins (Status, Plätze usw. bleiben erhalten). */
export function terminAendern(
  termine: Termin[], idx: number,
  f: { produktion: string; datum: string; uhrzeit: string; ort: string; art: string; preis: number | null }
): string {
  const kopie = termine.map((t) => ({ ...t }));
  kopie[idx] = { ...kopie[idx], ...f };
  return serialisieren(kopie);
}

/** Entfernt einen Termin. */
export function terminLoeschen(termine: Termin[], idx: number): string {
  return serialisieren(termine.filter((_, i) => i !== idx));
}
