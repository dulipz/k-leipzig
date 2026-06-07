// HomeScreen — hero, featured programme, venue teaser.
function HomeScreen({ onNavigate, onOpenShow }) {
  const { Button, ShowCard, Badge } = window.KL;
  const Ic = window.Ic;
  const data = window.KL_DATA;
  window.useLucide();

  return (
    <main>
      {/* HERO — dark stage */}
      <section className="kl-stage" style={{ position: "relative", overflow: "hidden" }}>
        <div style={{
          maxWidth: "var(--container-max)", margin: "0 auto",
          padding: "var(--space-12) var(--gutter)",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "var(--space-5)",
        }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--gold-400)" }}>
            Das Original · Dinnertheater
          </span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--text-stage-strong)",
            fontSize: "clamp(2.6rem, 6vw, 4.75rem)", lineHeight: 1.08, letterSpacing: "0.01em",
            margin: 0, width: "100%", textAlign: "center", textWrap: "balance",
          }}>
            Bei uns lachen Sie <span style={{ color: "var(--gold-400)" }}>besser</span>.
          </h1>
          <p style={{ fontSize: "var(--text-lg)", color: "var(--text-stage-body)", maxWidth: "52ch", margin: 0, lineHeight: "var(--leading-relaxed)" }}>
            Vier Gänge, ein Stück, ein unvergesslicher Abend. Erleben Sie die schönsten Komödien
            als Dinner-Theater in unserer neuen Spielstätte in Reuden an der Fuhne.
          </p>
          <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-3)", flexWrap: "wrap", justifyContent: "center" }}>
            <Button variant="primary" size="lg" iconRight={<span style={{ fontSize: "20px" }}><Ic n="ticket" /></span>} onClick={() => onNavigate("tickets")}>
              Tickets sichern
            </Button>
            <Button variant="ghost" size="lg" tone="stage" onClick={() => onNavigate("spielplan")}>
              Zum Spielplan
            </Button>
          </div>
          <div style={{ display: "flex", gap: "var(--space-6)", marginTop: "var(--space-5)", color: "var(--text-stage-muted)", fontSize: "var(--text-sm)", flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "var(--gold-400)", fontSize: "18px" }}><Ic n="calendar-days" /></span>{data.venue.opening}</span>
            <span style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "var(--gold-400)", fontSize: "18px" }}><Ic n="map-pin" /></span>{data.venue.name}</span>
            <span style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "var(--gold-400)", fontSize: "18px" }}><Ic n="utensils" /></span>4-Gänge-Menü inklusive</span>
          </div>
        </div>
      </section>

      {/* AKTUELL IM SPIELPLAN — light */}
      <section style={{ background: "var(--surface-page)" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-11) var(--gutter)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "var(--space-7)", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <div>
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--gold-600)" }}>Aktuell im Spielplan</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-4xl)", margin: "var(--space-2) 0 0", color: "var(--text-strong)" }}>Was bei uns gespielt wird</h2>
            </div>
            <Button variant="link" onClick={() => onNavigate("spielplan")} iconRight={<span style={{ fontSize: "18px" }}><Ic n="chevron-right" /></span>}>Alle Termine</Button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-6)" }}>
            {data.current.slice(0, 6).map((s) => (
              <ShowCard key={s.id} genre={s.genre} title={s.title} date={s.date} blurb={s.blurb} onCta={() => onOpenShow(s.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* VENUE TEASER */}
      <section style={{ background: "var(--ink-50)" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-11) var(--gutter)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-9)", alignItems: "center" }}>
          <div style={{
            aspectRatio: "4 / 3", borderRadius: "var(--radius-xl)", overflow: "hidden",
            background: "radial-gradient(120% 120% at 50% 0%, var(--plum-600), var(--plum-900))",
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-lg)",
            color: "var(--gold-400)", fontSize: "64px",
          }}>
            <Ic n="drama" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--gold-600)" }}>Unsere neue Spielstätte</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-4xl)", margin: 0, color: "var(--text-strong)" }}>Aus einer alten Scheune wird ein Theater</h2>
            <p style={{ fontSize: "var(--text-lg)", color: "var(--text-body)", lineHeight: "var(--leading-relaxed)", margin: 0 }}>
              In Reuden an der Fuhne entsteht unser kleiner Theatersaal mit rund 80–90 Plätzen.
              An der Theater-Bar begrüßen wir Sie auch ohne Dinner — dafür mit Bockwurst und Brezel.
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
              <Badge variant="gold">{data.venue.opening}</Badge>
              <Badge variant="outline">{data.venue.seats}</Badge>
            </div>
            <div style={{ marginTop: "var(--space-3)" }}>
              <Button variant="secondary" onClick={() => onNavigate("kontakt")} iconRight={<span style={{ fontSize: "18px" }}><Ic n="map-pin" /></span>}>So finden Sie uns</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
window.HomeScreen = HomeScreen;
