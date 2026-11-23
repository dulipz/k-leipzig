import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import {
  COOKIE, getEnv, sessionGueltig, termineLesen, termineSchreiben, terminKey, plaetzeSetzen, SpeicherFehler,
} from '../../lib/sinahamala';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** Ticket-Zähler: freie Plätze einer Vorstellung setzen. Body: { key, idx, plaetze: number | null } */
export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const env = getEnv(locals);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ fehler: 'Nicht erlaubt.' }, 403);
  if (!(await sessionGueltig(env, cookies.get(COOKIE)?.value))) return json({ fehler: 'Bitte neu anmelden.' }, 401);

  let b: any;
  try { b = await request.json(); } catch { return json({ fehler: 'Ungültige Anfrage.' }, 400); }
  const key = String(b?.key ?? '');
  const idx = Number(b?.idx);
  const roh = b?.plaetze;
  const plaetze = roh === null || roh === '' ? null : Math.round(Number(roh));
  if (!key) return json({ fehler: 'Ungültige Anfrage.' }, 400);
  if (plaetze !== null && (!Number.isFinite(plaetze) || plaetze < 0 || plaetze > 9999)) {
    return json({ fehler: 'Bitte eine Zahl zwischen 0 und 9999 eingeben.' }, 400);
  }

  for (let versuch = 0; versuch < 3; versuch++) {
    try {
      const { termine, sha } = await termineLesen(env);
      const i = Number.isInteger(idx) && termine[idx] && terminKey(termine[idx]) === key ? idx : termine.findIndex((t) => terminKey(t) === key);
      if (i < 0) return json({ fehler: 'Diese Vorstellung gibt es nicht mehr. Bitte Seite neu laden.' }, 404);

      const t = termine[i];
      const alt = typeof t.plaetze === 'number' ? t.plaetze : null;
      if (alt === plaetze) return json({ ok: true, plaetze, status: t.status ?? 'verfuegbar' });

      const { text, status } = plaetzeSetzen(termine, i, plaetze);
      const prod = await getEntry('produktionen', t.produktion).catch(() => undefined);
      const titel = (prod?.data as any)?.titel ?? t.produktion;
      const [y, m, d] = t.datum.split('-');
      const msg = `Plätze ${titel}, ${d}.${m}.${y} ${t.uhrzeit}: ${plaetze === null ? 'Zähler aus' : plaetze}` +
        `${status !== (t.status ?? 'verfuegbar') ? (status === 'ausverkauft' ? ' → ausverkauft' : ' → wieder buchbar') : ''} (via /sinahamala)`;

      await termineSchreiben(env, text, sha, msg);
      return json({ ok: true, plaetze, status });
    } catch (e) {
      if (e instanceof SpeicherFehler && e.konflikt) continue;
      return json({ fehler: e instanceof Error ? e.message : 'Speichern fehlgeschlagen.' }, 500);
    }
  }
  return json({ fehler: 'Gerade wurde gleichzeitig etwas geändert. Bitte noch einmal versuchen.' }, 409);
};
