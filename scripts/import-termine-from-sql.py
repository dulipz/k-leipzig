"""Importiert den Spielplan aus dem alten one.com-MySQL-Dump nach src/data/termine.json.
Aufruf: python3 -I scripts/import-termine-from-sql.py <dump.sql> src/data/termine.json"""
import re, sys, json, datetime
from zoneinfo import ZoneInfo
TZ = ZoneInfo('Europe/Berlin')
# Das alte PHP-Admin (strtotime/strftime) lief in UTC: die Zeitstempel sind
# Ortszeit "als UTC" gespeichert -> als UTC lesen, nicht umrechnen.
STORED = datetime.timezone.utc
sql = open(sys.argv[1], encoding='utf-8').read()
def rows(tbl):
    m = re.search(r"INSERT INTO `%s`[^;]*?VALUES\n(.*?);\n" % tbl, sql, re.S)
    out = []
    for line in re.findall(r"^\((.*)\)[,;]?$", m.group(1), re.M):
        out.append([v.strip().strip("'").replace('\\"', '"') for v in re.findall(r"'(?:[^'\\]|\\.)*'|[^,]+", line)])
    return out
ORTE = {  # hid -> Anzeigename (bereinigt)
 '6':'Insel Stein – Restaurant Zum Stein, Wörlitz', '17':'Hotel „Zur Henne“, Naumburg',
 '18':'Eichenkranz – Restaurant Zum Stein, Wörlitz', '36':'Bürgerhaus, Geithain',
 '43':'Gasthof und Hotel zur Kastanie, Gerichshain', '61':'Kleine Komödie, Reuden an der Fuhne',
 '66':'Restaurant Auszeit, Neukieritzsch', '84':'Theater Crimmitschau', '87':'Hotel Hallescher Anger, Naumburg',
 '92':'Flair Hotel Deutsches Haus, Kloster Arendsee', '96':'Flair Hotel Deutsches Haus – Kulturscheune',
 '100':'Flair Hotel Deutsches Haus – Kulturscheune', '102':'Hotel Kalkhütte, Urbach',
 '108':'Hotel Hallescher Anger, Naumburg', '112':'Schlossrestaurant Hundisburg', '115':'Central Kabarett, Leipzig',
 '133':'Hotel Schloss Tangermünde', '142':'Hotel Schloss Apolda',
}
STUECK = {'1':'hasch-mich','3':'drei-haselnuesse','103':'drei-haselnuesse','5':'eine-weihnachtsgeschichte',
 '10':'gastspiel-lesung-wechseljahre','16':'mit-66-jahren','19':'die-olsenbande-2','100':'die-feuerzangenbowle',
 '118':'gastspiel-ludger-k','120':'die-hexe-baba-jaga','123':'die-hexe-baba-jaga','124':'go-trabi-go',
 '125':'gastspiel-kay-ray','126':'gastspiel-gunter-boehnke'}  # 122 Jugendweihefeier = privat, nicht importiert
now = datetime.datetime.now(TZ)
out, skipped = [], []
for tid, hid, sid, ts, kont, ausv, art, preis in rows('termine'):
    dt = datetime.datetime.fromtimestamp(int(ts), STORED)
    if dt.date() < now.date(): continue
    if sid not in STUECK or hid not in ORTE: skipped.append(tid); continue
    a = {'1':'dinner','2':'theater'}.get(art, 'theater' if hid == '61' else 'dinner')
    out.append({'produktion': STUECK[sid], 'datum': dt.strftime('%Y-%m-%d'), 'uhrzeit': dt.strftime('%H:%M'),
        'ort': ORTE[hid], 'art': a, 'preis': float(preis) if float(preis) > 0 else None,
        'status': 'ausverkauft' if ausv == '1' else 'verfuegbar', 'ticketUrl': None})
out.sort(key=lambda t: (t['datum'], t['uhrzeit'], t['ort']))
json.dump({'termine': out}, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'{len(out)} Termine importiert, übersprungen: {skipped}')
