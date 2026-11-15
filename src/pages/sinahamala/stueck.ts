import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  COOKIE, getEnv, sessionGueltig, SpeicherFehler, slugify, produktionMdoc, dateiExistiert, dateienCommitten,
  textZuBase64, PRODUKTION_DIR, plakatDatei, bildPruefen,
} from '../../lib/sinahamala';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/**
 * Legt ein neues Stück an (optional mit Plakat).
 * Body: { titel, untertitel, typ, preisAb, beschreibung?, startseite?, plakat?: { base64, typ: 'image/jpeg' } }
 */
export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const env = getEnv(locals);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ fehler: 'Nicht erlaubt.' }, 403);
  if (!(await sessionGueltig(env, cookies.get(COOKIE)?.value))) return json({ fehler: 'Bitte neu anmelden.' }, 401);

  let b: any;
  try { b = await request.json(); } catch { return json({ fehler: 'Ungültige Anfrage.' }, 400); }

  const sauber = (v: unknown, max: number) => String(v ?? '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
  const titel = sauber(b?.titel, 80);
  const untertitel = sauber(b?.untertitel, 80);
  const typ = ['theater', 'dinner', 'familie'].includes(b?.typ) ? b.typ : 'theater';
  const preisAb = Math.round(Number(b?.preisAb));
  const beschreibung = String(b?.beschreibung ?? '').slice(0, 6000);
  const slug = slugify(titel);

  if (!titel || !slug) return json({ fehler: 'Bitte einen Titel eingeben.' }, 400);
  if (!untertitel) return json({ fehler: 'Bitte eine Genre-Zeile eingeben (z. B. „Weihnachts-Komödie“).' }, 400);
  if (!Number.isFinite(preisAb) || preisAb < 0 || preisAb > 999) return json({ fehler: 'Bitte einen gültigen Preis eingeben.' }, 400);

  // Plakat prüfen (der Browser hat es bereits auf JPEG verkleinert)
  let bild: string | null = null;
  if (b?.plakat?.base64) {
    try { bild = bildPruefen(b.plakat.base64); } catch (e) { return json({ fehler: (e as Error).message }, 400); }
  }

  const alle = await getCollection('produktionen');
  // Neue Stücke kommen ans Ende des Programms auf der Startseite (Reihenfolge < 20),
  // sonst nur in den Spielplan (wie Gastspiele).
  const programm = alle.map((p) => (p.data as any).reihenfolge as number).filter((r) => r < 20);
  const reihenfolge = b?.startseite === false ? 30 : Math.min(19, (programm.length ? Math.max(...programm) : 0) + 1);

  const mdocPfad = `${PRODUKTION_DIR}/${slug}.mdoc`;
  const plakatPfad = plakatDatei(slug);
  try {
    if (alle.some((p) => p.id === slug) || (await dateiExistiert(env, mdocPfad))) {
      return json({ fehler: `Ein Stück mit dem Titel „${titel}“ gibt es schon.` }, 409);
    }
    const mdoc = produktionMdoc({
      titel, untertitel, typ, preisAb, reihenfolge, beschreibung,
      plakat: bild ? '/' + plakatPfad.replace(/^public\//, '') : null,
    });
    const dateien = [{ pfad: mdocPfad, base64: textZuBase64(mdoc) }];
    if (bild) dateien.push({ pfad: plakatPfad, base64: bild });

    for (let versuch = 0; versuch < 3; versuch++) {
      try {
        await dateienCommitten(env, dateien, `Neues Stück: ${titel}${bild ? ' (mit Plakat)' : ''} (via /sinahamala)`);
        return json({ ok: true, id: slug, titel });
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
