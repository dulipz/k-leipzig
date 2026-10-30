import type { APIRoute } from 'astro';
import { COOKIE, getEnv, passwortOk, sessionErstellen, cookieOptionen } from '../../lib/sinahamala';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, cookies, redirect }) => {
  const env = getEnv(locals);
  const form = await request.formData();
  const pw = String(form.get('passwort') ?? '');

  if (!env.SINAHAMALA_PASSWORD) return redirect('/sinahamala?fehler=setup', 303);

  if (!(await passwortOk(env, pw))) {
    // kleine Bremse gegen Durchprobieren
    await new Promise((r) => setTimeout(r, 1200));
    return redirect('/sinahamala?fehler=1', 303);
  }
  const s = await sessionErstellen(env);
  cookies.set(COOKIE, s.value, cookieOptionen(s.maxAge));
  return redirect('/sinahamala', 303);
};
