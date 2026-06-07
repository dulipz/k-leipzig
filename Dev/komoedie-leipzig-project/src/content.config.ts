import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/**
 * PRODUKTIONEN — der Katalog der Inszenierungen ("das Was").
 * Eine Markdown-Datei pro Stück unter src/content/produktionen/.
 * Speist die Programm-Seite und die Show-Detailseiten.
 */
const produktionen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/produktionen' }),
  schema: z.object({
    titel: z.string(),
    untertitel: z.string(),
    // theater = Theaterabend mit Bar · dinner = Dinner-Show · familie = Familienstück
    typ: z.enum(['theater', 'dinner', 'familie']),
    preisAb: z.number(),
    reihenfolge: z.number().default(99),
  }),
});

/**
 * TERMINE — der Spielplan ("das Wann").
 * Eine Datei (src/data/termine.json) mit einer Liste von Vorstellungen,
 * jede verweist per "produktion"-ID auf eine Produktion.
 * Speist Spielplan-Seite und den "Nächste Vorstellungen"-Block der Startseite.
 */
const termine = defineCollection({
  loader: file('src/data/termine.json'),
  schema: z.object({
    produktion: reference('produktionen'),
    datum: z.string(), // ISO: "2026-03-13"
    uhrzeit: z.string(), // "20:00"
    status: z.enum(['verfuegbar', 'ausverkauft']).default('verfuegbar'),
    ticketUrl: z.string().optional(),
  }),
});

export const collections = { produktionen, termine };
