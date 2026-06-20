import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import fs from 'node:fs';

// Keystatic legt die Termine als JSON ab. Je nach Speicherform kann das eine
// einzelne Datei oder eine index-Datei im Ordner sein – wir lesen automatisch
// die vorhandene Quelle (mit Fallback auf den bisherigen Altbestand).
const termineQuelle = fs.existsSync('src/data/termine/index.json')
  ? 'src/data/termine/index.json'
  : 'src/data/termine.json';

/**
 * PRODUKTIONEN — der Katalog der Inszenierungen ("das Was").
 * Eine Markdoc-Datei pro Stück unter src/content/produktionen/ (von Keystatic gepflegt).
 * Speist die Programm-Karten und die Show-Detailseiten.
 */
const produktionen = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/produktionen' }),
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
 * Liegt in src/data/termine.json und wird von Keystatic als bearbeitbare Liste gepflegt.
 * Der Parser akzeptiert sowohl ein einfaches Array (Altbestand) als auch das
 * Keystatic-Format { "termine": [ ... ] } und vergibt je Eintrag eine stabile id.
 */
const termine = defineCollection({
  loader: file(termineQuelle, {
    parser: (text) => {
      const data = JSON.parse(text);
      const list = Array.isArray(data) ? data : (data?.termine ?? []);
      return list.map((t: any, i: number) => ({
        id: t.id ?? `${t.datum}-${t.produktion}-${i}`,
        ...t,
      }));
    },
  }),
  schema: z.object({
    produktion: reference('produktionen'),
    datum: z.string(), // ISO: "2026-03-13"
    uhrzeit: z.string(), // "20:00"
    status: z.enum(['verfuegbar', 'ausverkauft']).default('verfuegbar'),
    ticketUrl: z.string().nullish(),
  }),
});

/**
 * ENSEMBLE — die Schauspielerinnen und Schauspieler.
 * Eine YAML-Datei pro Person unter src/content/ensemble/ (von Keystatic gepflegt).
 * Fotos liegen unter /public/images/ensemble.
 */
const ensemble = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/ensemble' }),
  schema: z.object({
    name: z.string(),
    rolle: z.string().optional(),
    bio: z.string().optional(),
    // Keystatic speichert je nach Version nur den Dateinamen oder den vollen
    // Pfad – wir normalisieren auf einen öffentlichen Pfad unter /images/ensemble.
    foto: z
      .string()
      .optional()
      .transform((v) =>
        !v ? v : v.startsWith('/') || v.startsWith('http') ? v : `/images/ensemble/${v}`
      ),
    reihenfolge: z.number().default(99),
    zuSehenIn: z.array(z.string()).default([]),
  }),
});

export const collections = { produktionen, termine, ensemble };
