const { Button, IconButton, Badge, Input, Select, ShowCard, Wordmark, Monogram } = window;
const Ic = ({ n, c }) => React.createElement("i", { "data-lucide": n, style: c ? { color: c } : undefined });

function Demo() {
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  return (
    <div>
      <div className="sec"><h4>Buttons</h4>
        <div className="row">
          <Button variant="primary">Tickets sichern</Button>
          <Button variant="secondary">Tisch reservieren</Button>
          <Button variant="ghost">Mehr erfahren</Button>
          <Button variant="link" iconRight={<Ic n="chevron-right" />}>Spielplan</Button>
          <Button variant="primary" disabled>Ausverkauft</Button>
        </div>
        <div className="row stage">
          <Button variant="primary" iconRight={<Ic n="ticket" />}>Tickets</Button>
          <Button variant="secondary" tone="stage">Reservieren</Button>
          <Button variant="ghost" tone="stage">Spielplan</Button>
          <IconButton label="Menü" variant="stage"><Ic n="menu" /></IconButton>
          <IconButton label="Konto" variant="stage"><Ic n="user" /></IconButton>
        </div>
      </div>
      <div className="sec"><h4>Badges</h4>
        <div className="row">
          <Badge variant="gold">Trabi-Komödie</Badge>
          <Badge variant="plum">Märchen-Komödie</Badge>
          <Badge variant="outline">Kult-Komödie</Badge>
          <Badge variant="neutral">Premiere</Badge>
        </div>
      </div>
      <div className="sec"><h4>Form fields</h4>
        <div className="grid2">
          <Input label="Name" placeholder="Vor- und Nachname" />
          <Select label="Vorstellung" options={[{value:"1",label:"Fr · 13.03.2026 · 19:30 Uhr"},{value:"2",label:"Sa · 14.03.2026"}]} />
          <Input label="E-Mail" type="email" placeholder="ihre@email.de" helper="Für die Bestätigung." iconLeft={<Ic n="mail" c="var(--gold-600)" />} />
          <Input label="Gäste" defaultValue="0" error="Bitte Anzahl angeben." />
        </div>
      </div>
      <div className="sec"><h4>ShowCard</h4>
        <div className="grid3">
          <ShowCard genre="Trabi-Komödie" title="Go Trabi Go" date="Fr · 13.03.2026 · 19:30 Uhr" blurb="Die DDR-Kult-Komödie als Dinner-Theater mit 4-Gänge-Menü." />
          <ShowCard genre="Märchen-Komödie" title="3 Haselnüsse für Aschenbrödel" date="So · 22.12.2026 · 16:00 Uhr" blurb="Der Märchenfilm-Klassiker als heiteres Weihnachts-Dinner." />
          <ShowCard genre="Kult-Komödie" title="Die Olsenbande" date="Sa · 11.04.2026 · 19:30 Uhr" blurb="Egon Olsen hat einen Plan — Gauner-Komödie zum Mitfiebern." />
        </div>
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<Demo />);
