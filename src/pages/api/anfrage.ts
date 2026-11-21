import type { APIRoute } from 'astro';
import { mailEnv, mailsSenden, type Mail } from '../../lib/mail';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });


/** Text bereinigen und kürzen (keine Zeilenumbrüche in einzeiligen Feldern) */
const f = (v: unknown, max = 120) => String(v ?? '').replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const lang = (v: unknown, max = 1000) => String(v ?? '').replace(/\r\n?/g, '\n').trim().slice(0, max);
const mailOk = (m: string) => /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[a-z]{2,}$/i.test(m);

/**
 * Kartenbestellung und Gutschein-Anfrage.
 * Schickt die Anfrage nur an kontakt@ („Antworten“ geht direkt an den Kunden).
 * Die Bestätigung an den Kunden verschickt die Komödie selbst.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ fehler: 'Nicht erlaubt.' }, 403);

  let b: any;
  try { b = await request.json(); } catch { return json({ fehler: 'Ungültige Anfrage.' }, 400); }

  // Spam-Falle: unsichtbares Feld, das nur Bots ausfüllen
  if (f(b?.website)) return json({ ok: true });

  const name = f(b?.name, 80);
  const email = f(b?.email, 120);
  const tel = f(b?.tel, 40);
  if (!name) return json({ fehler: 'Bitte geben Sie Ihren Namen an.' }, 400);
  if (!mailOk(email)) return json({ fehler: 'Bitte geben Sie eine gültige E-Mail-Adresse an.' }, 400);

  const env = mailEnv(locals);
  let anUns: Mail;

  if (b?.typ === 'karten') {
    const stueck = f(b.stueck), datum = f(b.datum, 60), uhrzeit = f(b.uhrzeit, 10), ort = f(b.ort, 120);
    const anzahl = f(b.anzahl, 20), strasse = f(b.strasse), plz = f(b.plz, 10), stadt = f(b.stadt, 80);
    const msg = lang(b.msg, 1000);
    if (!stueck || !datum) return json({ fehler: 'Bitte wählen Sie eine Vorstellung aus.' }, 400);
    if (!strasse || !plz || !stadt) return json({ fehler: 'Bitte geben Sie Ihre vollständige Anschrift an.' }, 400);

    const details =
      `Stück: ${stueck}\nDatum: ${datum}\nUhrzeit: ${uhrzeit} Uhr\nSpielort: ${ort || '-'}\nAnzahl Tickets: ${anzahl}\n\n` +
      `Name: ${name}\nE-Mail: ${email}\nTelefon: ${tel || '-'}\n\n` +
      `Anschrift für den Ticketversand:\n${name}\n${strasse}\n${plz} ${stadt}\n\nNachricht: ${msg || '-'}`;

    anUns = {
      to: env.MAIL_TO,
      replyTo: email,
      subject: `Kartenbestellung: ${stueck} am ${datum} (${anzahl} × ${name})`,
      text: `Neue Kartenbestellung über die Website:\n\n${details}\n\n– „Antworten“ geht direkt an ${email}.`,
    };
  } else if (b?.typ === 'gutschein') {
    const betrag = f(b.betrag, 20), anzahl = f(b.anzahl, 10), gesamt = f(b.gesamt, 30), zustellung = f(b.zustellung, 80);
    const fuer = f(b.fuer, 80), von = f(b.von, 80), text = lang(b.text, 300);
    const strasse = f(b.strasse), ortZeile = f(b.ort, 100);
    if (!betrag) return json({ fehler: 'Bitte wählen Sie einen Gutscheinwert.' }, 400);

    const details =
      `Gutscheinwert: ${betrag}\nAnzahl: ${anzahl}\nGesamtbetrag: ${gesamt}\nZustellung: ${zustellung}\n\n` +
      `Für: ${fuer || '-'}\nVon: ${von || '-'}\nWunsch-/Glückwunschtext:\n${text || '-'}\n\n` +
      `Name: ${name}\nE-Mail: ${email}\nTelefon: ${tel || '-'}` +
      (strasse || ortZeile ? `\nAnschrift: ${strasse}, ${ortZeile}` : '');

    anUns = {
      to: env.MAIL_TO,
      replyTo: email,
      subject: `Gutschein-Anfrage: ${anzahl} × ${betrag} (${name})`,
      text: `Neue Gutschein-Anfrage über die Website:\n\n${details}\n\n– „Antworten“ geht direkt an ${email}.`,
    };
  } else {
    return json({ fehler: 'Ungültige Anfrage.' }, 400);
  }

  try {
    await mailsSenden(env, [anUns]);
    return json({ ok: true });
  } catch (e) {
    console.error('Mailversand fehlgeschlagen:', e);
    return json({ fehler: 'Die Anfrage konnte gerade nicht gesendet werden.' }, 502);
  }
};
