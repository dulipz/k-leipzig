import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import {
  COOKIE, getEnv, sessionGueltig, termineLesen, termineSchreiben, terminKey, statusImText, SpeicherFehler, type Status,
} from '../../lib/sinahamala';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** Setzt den Status einer Vorstellung. Body: { key, idx, status } */
export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const env = getEnv(locals);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ fehler: 'Nicht erlaubt.' }, 403);
  if (!(await sessionGueltig(env, cookies.get(COOKIE)?.value))) {
    return json({ fehler: 'Bitte neu anmelden.' }, 401);
  }

  let body: any;
  try { body = await request.json(); } catch { return json({ fehler: 'Ungültige Anfrage.' }, 400); }
  const key = String(body?.key ?? '');
  const idx = Number(body?.idx);
  const status = body?.status as Status;
  if (!key || (status !== 'ausverkauft' && status !== 'verfuegbar')) {
    return json({ fehler: 'Ungültige Anfrage.' }, 400);
  }

  // Bis zu 3 Versuche, falls gleichzeitig jemand in Keystatic speichert
  for (let versuch = 0; versuch < 3; versuch++) {
    try {
      const { termine, sha, text } = await termineLesen(env);
      let i = Number.isInteger(idx) && termine[idx] && terminKey(termine[idx]) === key ? idx : termine.findIndex((t) => terminKey(t) === key);
      if (i < 0) return json({ fehler: 'Diese Vorstellung gibt es nicht mehr. Bitte Seite neu laden.' }, 404);

      const t = termine[i];
      if ((t.status ?? 'verfuegbar') === status) return json({ ok: true, status });
      const neuerText = statusImText(text, termine, i, status);

      const prod = await getEntry('produktionen', t.produktion).catch(() => undefined);
      const titel = (prod?.data as any)?.titel ?? t.produktion;
      const [y, m, d] = t.datum.split('-');
      const msg = `${status === 'ausverkauft' ? 'Ausverkauft' : 'Wieder buchbar'}: ${titel}, ${d}.${m}.${y} ${t.uhrzeit} (via /sinahamala)`;

      await termineSchreiben(env, neuerText, sha, msg);
      return json({ ok: true, status });
    } catch (e) {
      if (e instanceof SpeicherFehler && e.konflikt) continue;
      return json({ fehler: e instanceof Error ? e.message : 'Speichern fehlgeschlagen.' }, 500);
    }
  }
  return json({ fehler: 'Gerade wurde gleichzeitig etwas geändert. Bitte noch einmal tippen.' }, 409);
};
