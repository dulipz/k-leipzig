// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

/**
 * Die öffentlichen Seiten werden weiterhin statisch vorgerendert (schnell,
 * kein Server). Nur das Redaktions-Backend (/keystatic und /api/keystatic)
 * läuft als On-Demand-Route über den Cloudflare-Adapter – nötig für den
 * Cloud-Login der Redaktion.
 */
export default defineConfig({
  site: 'https://www.komoedie-leipzig.de',
  adapter: cloudflare({ platformProxy: { enabled: true }, imageService: 'compile' }),
  integrations: [react(), markdoc(), keystatic()],
  vite: {
    resolve: {
      // React 19 auf der Cloudflare-Runtime (workerd): im Build die Edge-Variante
      // des Server-Renderers verwenden. Im Dev nicht nötig.
      ...(process.argv.includes('build')
        ? { alias: { 'react-dom/server': 'react-dom/server.edge' } }
        : {}),
    },
  },
});
