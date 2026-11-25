import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  COOKIE, getEnv, sessionGueltig, termineLesen, termineSchreiben, terminKey, terminAendern, terminLoeschen,
  dateiExistiert, heuteBerlin, SPAETESTES_DATUM, PRODUKTION_DIR, SpeicherFehler,
} from '../../lib/sinahamala';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const fmt = (iso: string) => { const [y, m, d] = iso.split('-'); return `${d}.${m}.${y}`; };

/**
 * Einen Termin bearbeiten oder löschen.
 * Body: { aktion: 'bearbeiten' | 'loeschen', key, idx, produktion?, datum?, uhrzeit?, ort?, art?, preis? }
 */
export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const env = getEnv(locals);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ fehler: 'Nicht erlaubt.' }, 403);
  if (!(await sessionGueltig(env, cookies.get(COOKIE)?.value))) return json({ fehler: 'Bitte neu anmelden.' }, 401);

  let b: any;
  try { b = await request.json(); } catch { return json({ fehler: 'Ungültige Anfrage.' }, 400); }
  const aktion = b?.aktion;
  const key = String(b?.key ?? '');
  const idx = Number(b?.idx);
  if (!key || (aktion !== 'bearbeiten' && aktion !== 'loeschen')) return json({ fehler: 'Ungültige Anfrage.' }, 400);

  // Neue Werte prüfen (nur beim Bearbeiten)
  let neu: { produktion: string; datum: string; uhrzeit: string; ort: string; art: string; preis: number | null } | null = null;
  if (aktion === 'bearbeiten') {
    const produktion = String(b.produktion ?? '');
    const datum = String(b.datum ?? '');
    const uhrzeit = String(b.uhrzeit ?? '');
    const ort = String(b.ort ?? '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 120);
    const art = b.art === 'dinner' ? 'dinner' : 'theater';
    const preis = b.preis === '' || b.preis == null ? null : Number(b.preis);
    if (!/^[a-z0-9-]{1,60}$/.test(produktion)) return json({ fehler: 'Bitte ein Stück wählen.' }, 400);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum) || isNaN(Date.parse(datum))) return json({ fehler: 'Bitte ein gültiges Datum eingeben.' }, 400);
    if (datum < heuteBerlin()) return json({ fehler: `Der ${fmt(datum)} liegt in der Vergangenheit.` }, 400);
    if (datum > SPAETESTES_DATUM) return json({ fehler: `Der ${fmt(datum)} kann nicht stimmen – bitte das Jahr prüfen.` }, 400);
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(uhrzeit)) return json({ fehler: 'Bitte eine gültige Uhrzeit eingeben.' }, 400);
    if (!ort) return json({ fehler: 'Bitte einen Spielort eingeben.' }, 400);
    if (preis !== null && (!Number.isFinite(preis) || preis < 0 || preis > 999)) return json({ fehler: 'Bitte einen gültigen Preis eingeben.' }, 400);
    neu = { produktion, datum, uhrzeit, ort, art, preis };
  }

  try {
    if (neu) {
      const bekannt = (await getCollection('produktionen')).some((p) => p.id === neu!.produktion);
      if (!bekannt && !(await dateiExistiert(env, `${PRODUKTION_DIR}/${neu.produktion}.mdoc`))) {
        return json({ fehler: 'Dieses Stück gibt es nicht. Bitte Seite neu laden.' }, 404);
      }
    }
    const titelVon = async (id: string) =>
      ((await getCollection('produktionen')).find((p) => p.id === id)?.data as any)?.titel ?? id;

    for (let versuch = 0; versuch < 3; versuch++) {
      try {
        const { termine, sha } = await termineLesen(env);
        const i = Number.isInteger(idx) && termine[idx] && terminKey(termine[idx]) === key ? idx : termine.findIndex((t) => terminKey(t) === key);
        if (i < 0) return json({ fehler: 'Diese Vorstellung gibt es nicht mehr. Bitte Seite neu laden.' }, 404);
        const alt = termine[i];
        const altText = `${await titelVon(alt.produktion)}, ${fmt(alt.datum)} ${alt.uhrzeit}`;

        if (aktion === 'loeschen') {
          await termineSchreiben(env, terminLoeschen(termine, i), sha, `Termin gelöscht: ${altText} (via /sinahamala)`);
          return json({ ok: true });
        }

        const neuerKey = terminKey({ ...alt, ...neu! });
        if (neuerKey !== key && termine.some((t, j) => j !== i && terminKey(t) === neuerKey)) {
          return json({ fehler: 'Diese Vorstellung (gleiches Stück, Datum, Uhrzeit und Ort) gibt es schon.' }, 409);
        }
        await termineSchreiben(env, terminAendern(termine, i, neu!), sha, `Termin geändert: ${altText} → ${fmt(neu!.datum)} ${neu!.uhrzeit} (via /sinahamala)`);
        return json({ ok: true, key: neuerKey, titel: await titelVon(neu!.produktion) });
      } catch (e) {
        if (e instanceof SpeicherFehler && e.konflikt) continue;
        throw e;
      }
    }
    return json({ fehler: 'Gerade wurde gleichzeitig etwas geändert. Bitte noch einmal versuchen.' }, 409);
  } catch (e) {
    return json({ fehler: e instanceof Error ? e.message : 'Speichern fehlgeschlagen.' }, 500);
  }
};
