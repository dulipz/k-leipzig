// Plakate und Szenenfoto-Galerien je Produktion.
// Plakate liegen in /public/images/produktionen, Szenenfotos in
// /public/images/galerie/<ordner>/{thumb,full}.
// Neue Produktion mit Plakat oder Fotos? Einfach hier eine Zeile ergänzen.

export const plakate: Record<string, string> = {
  'go-trabi-go': '/images/produktionen/gotrabigo.jpg',
  'die-olsenbande-2': '/images/produktionen/olsenbande2.jpg',
  'die-feuerzangenbowle': '/images/produktionen/feuerzangenbowle.jpg',
  'drei-haselnuesse': '/images/produktionen/aschen.jpg',
  'mit-66-jahren': '/images/produktionen/Mit66Jahren.png',
  'hasch-mich': '/images/produktionen/haschmich.png',
  'die-hexe-baba-jaga': '/images/produktionen/babajaga.jpg',
  'eine-weihnachtsgeschichte': '/images/produktionen/weihnachtsgeschichte.jpg',
};

export const galerien: Record<string, string> = {
  'mit-66-jahren': 'mit-66-jahren',
  'go-trabi-go': 'go-trabi-go',
  'drei-haselnuesse': 'aschenbroedel',
  'die-olsenbande-2': 'olsenbande-2',
  'eine-weihnachtsgeschichte': 'weihnachtsgeschichte',
};
