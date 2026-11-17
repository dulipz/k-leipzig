import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  COOKIE, getEnv, sessionGueltig, SpeicherFehler, termineLesen, termineSchreiben, termineAnhaengen, terminKey,
  dateiExistiert, heuteBerlin, SPAETESTES_DATUM, PRODUKTION_DIR, type Termin,
} from '../../lib/sinahamala';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const MAX_PRO_MAL = 100;

/**
 * Trägt neue Vorstellungen ein – ab heute, ohne Vorlauf-Limit.
 * Body: { produktion, ort, art, preis?, termine: [{ datum, uhrzeit }] }
 */
export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const env = getEnv(locals);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ fehler: 'Nicht erlaubt.' }, 403);
  if (!(await sessionGueltig(env, cookies.get(COOKIE)?.value))) return json({ fehler: 'Bitte neu anmelden.' }, 401);

  let b: any;
  try { b = await request.json(); } catch { return json({ fehler: 'Ungültige Anfrage.' }, 400); }

  const produktion = String(b?.produktion ?? '');
  const ort = String(b?.ort ?? '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 120);
  const art = b?.art === 'dinner' ? 'dinner' : 'theater';
  const preisRoh = b?.preis;
  const preis = preisRoh === '' || preisRoh == null ? null : Number(preisRoh);
  const liste: any[] = Array.isArray(b?.termine) ? b.termine : [];

  if (!/^[a-z0-9-]{1,60}$/.test(produktion)) return json({ fehler: 'Bitte ein Stück wählen.' }, 400);
  if (!ort) return json({ fehler: 'Bitte einen Spielort eingeben.' }, 400);
  if (preis !== null && (!Number.isFinite(preis) || preis < 0 || preis > 999)) return json({ fehler: 'Bitte einen gültigen Preis eingeben.' }, 400);
  if (!liste.length) return json({ fehler: 'Bitte mindestens ein Datum eintragen.' }, 400);
  if (liste.length > MAX_PRO_MAL) return json({ fehler: `Höchstens ${MAX_PRO_MAL} Termine auf einmal.` }, 400);

  const heute = heuteBerlin();
  const neu: Termin[] = [];
  for (const x of liste) {
    const datum = String(x?.datum ?? '');
    const uhrzeit = String(x?.uhrzeit ?? '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum) || isNaN(Date.parse(datum))) return json({ fehler: `Ungültiges Datum: ${datum || '(leer)'}` }, 400);
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(uhrzeit)) return json({ fehler: `Ungültige Uhrzeit am ${datum}.` }, 400);
    if (datum < heute) return json({ fehler: `Der ${fmt(datum)} liegt in der Vergangenheit.` }, 400);
    if (datum > SPAETESTES_DATUM) return json({ fehler: `Der ${fmt(datum)} kann nicht stimmen – bitte das Jahr prüfen.` }, 400);
    neu.push({ produktion, datum, uhrzeit, ort, art, preis, status: 'verfuegbar', ticketUrl: null });
  }

  try {
    const bekannt = (await getCollection('produktionen')).some((p) => p.id === produktion);
    if (!bekannt && !(await dateiExistiert(env, `${PRODUKTION_DIR}/${produktion}.mdoc`))) {
      return json({ fehler: 'Dieses Stück gibt es nicht. Bitte Seite neu laden.' }, 404);
    }

    for (let versuch = 0; versuch < 3; versuch++) {
      try {
        const { termine, sha, text } = await termineLesen(env);
        const vorhanden = new Set(termine.map(terminKey));
        const gesehen = new Set<string>();
        const wirklichNeu = neu.filter((t) => {
          const k = terminKey(t);
          if (vorhanden.has(k) || gesehen.has(k)) return false;
          gesehen.add(k);
          return true;
        });
        const doppelt = neu.length - wirklichNeu.length;
        if (!wirklichNeu.length) return json({ ok: true, neu: 0, doppelt });

        wirklichNeu.sort((a, c) => (a.datum + a.uhrzeit).localeCompare(c.datum + c.uhrzeit));
        const neuerText = termineAnhaengen(text, termine, wirklichNeu);
        const titel = String(b?.titel ?? produktion).slice(0, 80);
        await termineSchreiben(env, neuerText, sha, `${wirklichNeu.length} neue Termine: ${titel} (via /sinahamala)`);
        return json({ ok: true, neu: wirklichNeu.length, doppelt });
      } catch (e) {
        if (e instanceof SpeicherFehler && e.konflikt) continue;
        throw e;
      }
    }
    return json({ fehler: 'Gerade wurde gleichzeitig etwas geändert. Bitte noch einmal speichern.' }, 409);
  } catch (e) {
    return json({ fehler: e instanceof Error ? e.message : 'Speichern fehlgeschlagen.' }, 500);
  }
};

function fmt(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}
