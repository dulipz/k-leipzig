// E-Mail-Versand über den SMTP-Server von one.com (Postfach kontakt@komoedie-leipzig.de).
// Läuft auf Cloudflare Workers über TCP-Sockets (worker-mailer).
//
// Cloudflare → Workers & Pages → k-leipzig → Settings → Variables and Secrets:
//   SMTP_PASSWORD  – Passwort des Postfachs kontakt@komoedie-leipzig.de (als Secret!)
//   SMTP_USER      – optional, Standard kontakt@komoedie-leipzig.de
//   SMTP_HOST      – optional, Standard send.one.com
//   SMTP_PORT      – optional, Standard 465 (SSL)
//   MAIL_TO        – optional, Empfänger der Bestellungen, Standard kontakt@komoedie-leipzig.de
// Lokal (npm run dev) ohne SMTP_PASSWORD werden die Mails nur in der Konsole ausgegeben.

export interface MailEnv {
  SMTP_USER: string;
  SMTP_PASSWORD?: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  MAIL_TO: string;
}

export function mailEnv(locals: any): MailEnv {
  const rt = (locals?.runtime?.env ?? {}) as Record<string, string | undefined>;
  const pick = (k: string) =>
    rt[k] ?? (import.meta.env as any)[k] ?? (typeof process !== 'undefined' ? process.env?.[k] : undefined);
  return {
    SMTP_USER: pick('SMTP_USER') || 'kontakt@komoedie-leipzig.de',
    SMTP_PASSWORD: pick('SMTP_PASSWORD'),
    SMTP_HOST: pick('SMTP_HOST') || 'send.one.com',
    SMTP_PORT: Number(pick('SMTP_PORT') || 465),
    MAIL_TO: pick('MAIL_TO') || 'kontakt@komoedie-leipzig.de',
  };
}

export interface Mail {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

export class MailFehler extends Error {}

/** Verschickt mehrere Mails über eine SMTP-Verbindung. */
export async function mailsSenden(env: MailEnv, mails: Mail[]): Promise<void> {
  if (!env.SMTP_PASSWORD) {
    if (import.meta.env.DEV) {
      for (const m of mails) console.log(`\n[Mail – nur lokal, nicht versendet]\nAn: ${m.to}\nBetreff: ${m.subject}\n\n${m.text}\n`);
      return;
    }
    throw new MailFehler('Der E-Mail-Versand ist noch nicht eingerichtet (SMTP_PASSWORD fehlt).');
  }
  const { WorkerMailer } = await import('worker-mailer');
  const mailer = await WorkerMailer.connect({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    startTls: env.SMTP_PORT !== 465,
    credentials: { username: env.SMTP_USER, password: env.SMTP_PASSWORD },
    authType: ['plain', 'login'],
    name: 'komoedie-leipzig.de',
    socketTimeoutMs: 15000,
    responseTimeoutMs: 15000,
  });
  try {
    for (const m of mails) {
      await mailer.send({
        from: { name: 'Komödie Leipzig', email: env.SMTP_USER },
        to: m.to,
        reply: m.replyTo,
        subject: m.subject,
        text: m.text,
      });
    }
  } finally {
    try { await mailer.close(); } catch { /* egal */ }
  }
}
