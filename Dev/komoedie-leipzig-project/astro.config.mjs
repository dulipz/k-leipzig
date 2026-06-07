// @ts-check
import { defineConfig } from 'astro/config';

// Statische Ausgabe (ideal für Cloudflare Pages).
// Der @astrojs/cloudflare-Adapter wird ergänzt, sobald wir
// serverseitige Endpunkte brauchen (Kontaktformular via Resend o. Ä.).
export default defineConfig({
  site: 'https://www.komoedie-leipzig.de',
});
