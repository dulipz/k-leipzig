import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  COOKIE, getEnv, sessionGueltig, SpeicherFehler, termineLesen, termineOhne, dateiExistiert, dateienCommitten,
  aktuellerStand, textZuBase64, heuteBerlin, dateiLesen, fmWert, eigenesPlakat, PRODUKTION_DIR, TERMINE_PFAD, type Aenderung,
} from '../../lib/sinahamala';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/**
 * Löscht ein Stück endgültig – zusammen mit ALLEN seinen Terminen und dem
 * hochgeladenen Plakat – in einem Commit (sonst bricht der Website-Build,
 * weil Termine auf ein fehlendes Stück zeigen würden).
 * Body: { produktion, titel }
 */
export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const env = getEnv(locals);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ fehler: 'Nicht erlaubt.' }, 403);
  if (!(await sessionGueltig(env, cookies.get(COOKIE)?.value))) return json({ fehler: 'Bitte neu anmelden.' }, 401);

  let b: any;
  try { b = await request.json(); } catch { return json({ fehler: 'Ungültige Anfrage.' }, 400); }
  const id = String(b?.produktion ?? '');
  if (!/^[a-z0-9-]{1,60}$/.test(id)) return json({ fehler: 'Ungültige Anfrage.' }, 400);

  const eintrag = (await getCollection('produktionen')).find((p) => p.id === id);
  const titel = String((eintrag?.data as any)?.titel ?? b?.titel ?? id).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
  const mdocPfad = `${PRODUKTION_DIR}/${id}.mdoc`;

  try {
    for (let versuch = 0; versuch < 3; versuch++) {
      try {
        const stand = await aktuellerStand(env);
        const mdoc = await dateiLesen(env, mdocPfad, stand);
        if (mdoc === null) return json({ fehler: 'Dieses Stück gibt es nicht mehr. Bitte Seite neu laden.' }, 404);
        const { termine } = await termineLesen(env, stand ?? undefined);
        const { rest, text } = termineOhne(termine, id);
        const heute = heuteBerlin();
        const entfernt = termine.length - rest.length;
        const kommend = termine.filter((t) => t.produktion === id && t.datum >= heute).length;

        const aenderungen: Aenderung[] = [{ pfad: mdocPfad, loeschen: true }];
        if (entfernt) aenderungen.push({ pfad: TERMINE_PFAD, base64: textZuBase64(text) });
        // Nur ein hochgeladenes Plakat (/images/produktionen/<slug>…) mit löschen – fest verdrahtete bleiben
        const plakatPfad = eigenesPlakat(id, fmWert(mdoc, 'plakat'));
        if (plakatPfad && (await dateiExistiert(env, plakatPfad, stand ?? undefined))) {
          aenderungen.push({ pfad: plakatPfad, loeschen: true });
        }

        await dateienCommitten(
          env, aenderungen,
          `Stück gelöscht: ${titel}${entfernt ? ` (+ ${entfernt} Termine)` : ''} (via /sinahamala)`,
          stand
        );
        return json({ ok: true, titel, entfernt, kommend });
      } catch (e) {
        if (e instanceof SpeicherFehler && e.konflikt) continue;
        throw e;
      }
    }
    return json({ fehler: 'Gerade wurde gleichzeitig etwas geändert. Bitte noch einmal versuchen.' }, 409);
  } catch (e) {
    return json({ fehler: e instanceof Error ? e.message : 'Löschen fehlgeschlagen.' }, 500);
  }
};
