// TicketsScreen — reservation / booking form with live summary.
function TicketsScreen({ onNavigate }) {
  const { Button, Input, Select, Badge } = window.KL;
  const Ic = window.Ic;
  const data = window.KL_DATA;
  window.useLucide();

  const shows = data.current;
  const [showId, setShowId] = React.useState(shows[0].id);
  const [dateIdx, setDateIdx] = React.useState(0);
  const [guests, setGuests] = React.useState("2");
  const [submitted, setSubmitted] = React.useState(false);

  const show = shows.find((s) => s.id === showId);
  const dates = show.dates || [show.date];
  const pricePer = 64.5;
  const total = (pricePer * Number(guests || 0)).toFixed(2).replace(".", ",");

  if (submitted) {
    return (
      <main style={{ background: "var(--surface-page)", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-9) var(--gutter)" }}>
        <div style={{ textAlign: "center", maxWidth: "44ch", display: "flex", flexDirection: "column", gap: "var(--space-4)", alignItems: "center" }}>
          <span style={{ color: "var(--applause-500)", fontSize: "56px" }}><Ic n="check-circle-2" /></span>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-4xl)", margin: 0, color: "var(--text-strong)" }}>Wir freuen uns auf Sie!</h1>
          <p style={{ fontSize: "var(--text-lg)", color: "var(--text-body)", lineHeight: "var(--leading-relaxed)", margin: 0 }}>
            Ihre Reservierung für <strong>{show.title}</strong> am {dates[dateIdx]} ist eingegangen.
            Eine Bestätigung senden wir Ihnen per E-Mail. Mit freundlichen Grüßen, Ihr Komödie-Team.
          </p>
          <Button variant="primary" onClick={() => onNavigate("home")}>Zur Startseite</Button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "var(--surface-page)" }}>
      <section className="kl-stage" style={{ padding: "var(--space-9) var(--gutter)" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--gold-400)" }}>Reservierung</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-5xl)", margin: "var(--space-2) 0 0", color: "var(--text-stage-strong)" }}>Tisch & Tickets</h1>
        </div>
      </section>

      <div style={{ maxWidth: "920px", margin: "0 auto", padding: "var(--space-9) var(--gutter)", display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "var(--space-8)", alignItems: "start" }}>
        {/* form */}
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          <Select label="Inszenierung" value={showId} onChange={(e) => { setShowId(e.target.value); setDateIdx(0); }}
            options={shows.map((s) => ({ value: s.id, label: s.title }))} />
          <Select label="Termin" value={String(dateIdx)} onChange={(e) => setDateIdx(Number(e.target.value))}
            options={dates.map((d, i) => ({ value: String(i), label: d }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <Select label="Gäste" value={guests} onChange={(e) => setGuests(e.target.value)}
              options={[2, 3, 4, 5, 6, 8].map((n) => ({ value: String(n), label: `${n} Personen` }))} />
            <Input label="Telefon" type="tel" placeholder="0163 …" />
          </div>
          <Input label="Name" placeholder="Vor- und Nachname" required />
          <Input label="E-Mail" type="email" placeholder="ihre@email.de" helper="Für die Reservierungsbestätigung." required
            iconLeft={<span style={{ color: "var(--gold-600)", fontSize: "18px" }}><Ic n="mail" /></span>} />
          <Button variant="primary" size="lg" type="submit" fullWidth iconRight={<span style={{ fontSize: "20px" }}><Ic n="ticket" /></span>}>
            Reservierung absenden
          </Button>
        </form>

        {/* summary */}
        <aside style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", boxShadow: "var(--shadow-md)", position: "sticky", top: "90px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Badge variant="gold">{show.genre}</Badge>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-2xl)", margin: 0, color: "var(--text-strong)" }}>{show.title}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
            <span style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "var(--gold-600)", fontSize: "16px" }}><Ic n="calendar-days" /></span>{dates[dateIdx]}</span>
            <span style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "var(--gold-600)", fontSize: "16px" }}><Ic n="utensils" /></span>4-Gänge-Menü inklusive</span>
            <span style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "var(--gold-600)", fontSize: "16px" }}><Ic n="users" /></span>{guests} Personen</span>
          </div>
          <div style={{ borderTop: "1px solid var(--border-default)", paddingTop: "var(--space-4)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{guests} × 64,50 €</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", color: "var(--text-strong)" }}>{total} €</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
window.TicketsScreen = TicketsScreen;
