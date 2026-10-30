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

export async function termineLesen(env: Env): Promise<{ termine: Termin[]; sha: string | null; text: string }> {
  if (!env.GITHUB_TOKEN) {
    if (import.meta.env.DEV) {
      const fs = await import('node:fs/promises');
      const text = await fs.readFile(FILE_PATH, 'utf-8');
      return { termine: parse(text), sha: null, text };
    }
    throw new SpeicherFehler('GITHUB_TOKEN fehlt in den Cloudflare-Einstellungen.');
  }
  const res = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${FILE_PATH}?ref=${encodeURIComponent(env.GITHUB_BRANCH!)}`,
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
