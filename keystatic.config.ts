import { config, fields, collection, singleton } from '@keystatic/core';

/**
 * Keystatic-Redaktionssystem für die Komödie Leipzig.
 * Entwicklung: lokaler Modus (Dateien). Produktion: Keystatic Cloud
 * (Login über keystatic.cloud, kein GitHub-Konto für die Redaktion nötig).
 * Backend erreichbar unter /keystatic.
 */
export default config({
  // Lokaler Modus beim Entwickeln (npm run dev), Cloud-Modus in Produktion.
  // Im Cloud-Modus loggt sich die Redaktion über Keystatic Cloud ein
  // (eigene E-Mail/Passwort) – kein GitHub-Konto nötig.
  storage: import.meta.env.DEV ? { kind: 'local' } : { kind: 'cloud' },

  // Projekt-Slug aus Keystatic Cloud.
  cloud: { project: 'codestadt/k-leipzig' },

  ui: {
    brand: { name: 'Komödie Leipzig' },
  },

  collections: {
    // PRODUKTIONEN — Programm / Inszenierungen
    produktionen: collection({
      label: 'Produktionen',
      slugField: 'titel',
      path: 'src/content/produktionen/*',
      format: { contentField: 'beschreibung' },
      schema: {
        titel: fields.slug({
          name: { label: 'Titel' },
          slug: { label: 'URL-Kürzel (Slug)' },
        }),
        untertitel: fields.text({ label: 'Untertitel' }),
        typ: fields.select({
          label: 'Typ',
          options: [
            { label: 'Theaterabend', value: 'theater' },
            { label: 'Dinner-Show', value: 'dinner' },
            { label: 'Familienstück', value: 'familie' },
          ],
          defaultValue: 'theater',
        }),
        preisAb: fields.integer({ label: 'Preis ab (€)', validation: { min: 0 } }),
        reihenfolge: fields.integer({
          label: 'Reihenfolge',
          description: 'Kleinere Zahl = weiter vorne.',
          defaultValue: 99,
        }),
        regie: fields.text({ label: 'Buch, Bühne & Regie' }),
        besetzung: fields.array(
          fields.object({
            rolle: fields.text({ label: 'Rolle(n)' }),
            name: fields.text({ label: 'Darsteller/in' }),
          }),
          {
            label: 'Besetzung',
            itemLabel: (props) => `${props.fields.rolle.value || 'Rolle'} – ${props.fields.name.value || ''}`,
          }
        ),
        hinweise: fields.text({
          label: 'Hinweise',
          description: 'z. B. Aufführungsrechte, Fotograf, Premiere',
          multiline: true,
        }),
        beschreibung: fields.markdoc({ label: 'Beschreibung' }),
      },
    }),

    // ENSEMBLE — Schauspielerinnen und Schauspieler
    ensemble: collection({
      label: 'Ensemble',
      slugField: 'name',
      path: 'src/content/ensemble/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        rolle: fields.text({ label: 'Rolle / Funktion', description: 'z. B. Schauspieler, Regie' }),
        bio: fields.text({ label: 'Kurzbiografie', multiline: true }),
        foto: fields.image({
          label: 'Foto',
          directory: 'public/images/ensemble',
          publicPath: '/images/ensemble/',
        }),
        reihenfolge: fields.integer({
          label: 'Reihenfolge',
          description: 'Kleinere Zahl = weiter vorne.',
          defaultValue: 99,
        }),
        zuSehenIn: fields.array(
          fields.text({ label: 'Produktion' }),
          {
            label: 'Zu sehen in',
            description: 'Stücke, in denen die Person zu sehen ist.',
            itemLabel: (props) => props.value || 'Produktion',
          }
        ),
      },
    }),
  },

  singletons: {
    // TERMINE — Spielplan (eine bearbeitbare Liste von Vorstellungen)
    termine: singleton({
      label: 'Termine (Spielplan)',
      path: 'src/data/termine',
      format: { data: 'json' },
      schema: {
        termine: fields.array(
          fields.object({
            produktion: fields.relationship({
              label: 'Produktion',
              collection: 'produktionen',
            }),
            datum: fields.date({ label: 'Datum' }),
            uhrzeit: fields.text({ label: 'Uhrzeit', defaultValue: '20:00' }),
            ort: fields.text({
              label: 'Spielort',
              defaultValue: 'Kleine Komödie, Reuden an der Fuhne',
            }),
            art: fields.select({
              label: 'Art',
              options: [
                { label: 'Theaterabend', value: 'theater' },
                { label: 'Dinner-Show', value: 'dinner' },
              ],
              defaultValue: 'theater',
            }),
            preis: fields.number({ label: 'Preis pro Person (€)', description: 'Leer lassen = auf Anfrage', step: 0.1 }),
            status: fields.select({
              label: 'Status',
              options: [
                { label: 'Verfügbar', value: 'verfuegbar' },
                { label: 'Ausverkauft', value: 'ausverkauft' },
              ],
              defaultValue: 'verfuegbar',
            }),
            ticketUrl: fields.url({ label: 'Ticket-Link (optional)' }),
          }),
          {
            label: 'Vorstellungen',
            itemLabel: (props) =>
              `${props.fields.datum.value ?? '—'} · ${props.fields.produktion.value ?? ''} · ${props.fields.ort.value ?? ''}`,
          }
        ),
      },
    }),
  },
});
