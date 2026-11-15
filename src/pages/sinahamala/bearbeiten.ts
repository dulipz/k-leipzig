import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  COOKIE, getEnv, sessionGueltig, SpeicherFehler, dateiLesen, dateiExistiert, dateienCommitten, aktuellerStand,
  mdocBearbeiten, fmWert, plakatDatei, eigenesPlakat, bildPruefen, textZuBase64, PRODUKTION_DIR, type Aenderung,
} from '../../lib/sinahamala';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/**
 * Ändert ein bestehendes Stück. Nur Titel, Genre-Zeile, Art, Preis, Startseite,
 * Beschreibung und Plakat – Regie, Besetzung und Hinweise bleiben unverändert.
 * Die Adresse (/programm/<id>) bleibt gleich, auch wenn sich der Titel ändert.
 * Body: { produktion, titel, untertitel, typ, preisAb, beschreibung, startseite, plakat?: { base64 } }
 */
export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const env = getEnv(locals);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ fehler: 'Nicht erlaubt.' }, 403);
  if (!(await sessionGueltig(env, cookies.get(COOKIE)?.value))) return json({ fehler: 'Bitte neu anmelden.' }, 401);

  let b: any;
  try { b = await request.json(); } catch { return json({ fehler: 'Ungültige Anfrage.' }, 400); }

  const id = String(b?.produktion ?? '');
  const sauber = (v: unknown, max: number) => String(v ?? '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
  const titel = sauber(b?.titel, 80);
  const untertitel = sauber(b?.untertitel, 80);
  const typ = ['theater', 'dinner', 'familie'].includes(b?.typ) ? b.typ : 'theater';
  const preisAb = Math.round(Number(b?.preisAb));
  const beschreibung = String(b?.beschreibung ?? '').slice(0, 6000);

  if (!/^[a-z0-9-]{1,60}$/.test(id)) return json({ fehler: 'Ungültige Anfrage.' }, 400);
  if (!titel) return json({ fehler: 'Bitte einen Titel eingeben.' }, 400);
  if (!untertitel) return json({ fehler: 'Bitte eine Genre-Zeile eingeben.' }, 400);
  if (!Number.isFinite(preisAb) || preisAb < 0 || preisAb > 999) return json({ fehler: 'Bitte einen gültigen Preis eingeben.' }, 400);

  let bild: string | null = null;
  if (b?.plakat?.base64) {
    try { bild = bildPruefen(b.plakat.base64); } catch (e) { return json({ fehler: (e as Error).message }, 400); }
  }

  const alle = await getCollection('produktionen');
  const programm = alle.filter((p) => p.id !== id).map((p) => (p.data as any).reihenfolge as number).filter((r) => r < 20);
  const mdocPfad = `${PRODUKTION_DIR}/${id}.mdoc`;

  try {
    for (let versuch = 0; versuch < 3; versuch++) {
      try {
        const stand = await aktuellerStand(env);
        const alt = await dateiLesen(env, mdocPfad, stand);
        if (alt === null) return json({ fehler: 'Dieses Stück gibt es nicht mehr. Bitte Seite neu laden.' }, 404);

        // Startseite an/aus: nur ändern, wenn sich die Auswahl wirklich ändert
        const r = Number(fmWert(alt, 'reihenfolge') ?? 99);
        let reihenfolge = r;
        if (b?.startseite === true && r >= 20) reihenfolge = Math.min(19, (programm.length ? Math.max(...programm) : 0) + 1);
        if (b?.startseite === false && r < 20) reihenfolge = 30;

        const felder: Record<string, string | number | null> = { titel, untertitel, typ, preisAb, reihenfolge };
        const aenderungen: Aenderung[] = [];
        if (bild) {
          const neuerPfad = plakatDatei(id);
          felder.plakat = '/' + neuerPfad.replace(/^public\//, '');
          aenderungen.push({ pfad: neuerPfad, base64: bild });
          const altesPlakat = eigenesPlakat(id, fmWert(alt, 'plakat'));
          if (altesPlakat && (await dateiExistiert(env, altesPlakat, stand ?? undefined))) {
            aenderungen.push({ pfad: altesPlakat, loeschen: true });
          }
        }
        const neu = mdocBearbeiten(alt, felder, beschreibung);
        if (neu === alt && !bild) return json({ ok: true, id, titel, unveraendert: true });
        aenderungen.unshift({ pfad: mdocPfad, base64: textZuBase64(neu) });

        await dateienCommitten(env, aenderungen, `Stück bearbeitet: ${titel}${bild ? ' (neues Plakat)' : ''} (via /sinahamala)`, stand);
        return json({ ok: true, id, titel });
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
