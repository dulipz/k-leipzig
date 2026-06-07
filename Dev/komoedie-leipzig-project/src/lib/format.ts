// Hilfsfunktionen für Badges und deutsche Datumsformatierung.

export type Typ = 'theater' | 'dinner' | 'familie';

// Volles Label für Termin-Zeilen (Spielplan / nächste Vorstellungen)
export function typLabel(typ: Typ): { label: string; cls: 'theater' | 'dinner' } {
  switch (typ) {
    case 'dinner':
      return { label: 'Dinner-Show', cls: 'dinner' };
    case 'familie':
      return { label: 'Familienstück', cls: 'theater' };
    default:
      return { label: 'Theaterabend', cls: 'theater' };
  }
}

// Kurzes Label für Programm-Karten
export function typBadge(typ: Typ): { label: string; cls: 'theater' | 'dinner' } {
  switch (typ) {
    case 'dinner':
      return { label: 'Dinner', cls: 'dinner' };
    case 'familie':
      return { label: 'Familienstück', cls: 'theater' };
    default:
      return { label: 'Theater', cls: 'theater' };
  }
}

export function zusatz(typ: Typ): string {
  return typ === 'dinner' ? 'inkl. 4-Gänge-Menü' : 'mit Theater-Bar';
}

const wdFmt = new Intl.DateTimeFormat('de-DE', { weekday: 'short' });
const mFmt = new Intl.DateTimeFormat('de-DE', { month: 'short' });

export function dateParts(iso: string): { wd: string; day: string; month: string } {
  const d = new Date(iso + 'T00:00:00');
  return {
    wd: wdFmt.format(d).replace('.', ''),
    day: String(d.getDate()).padStart(2, '0'),
    month: mFmt.format(d).replace('.', ''),
  };
}
