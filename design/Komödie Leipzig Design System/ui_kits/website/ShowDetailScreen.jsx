// ShowDetailScreen — a single production: poster, details, showtimes.
function ShowDetailScreen({ showId, onNavigate }) {
  const { Button, Badge, Monogram } = window.KL;
  const Ic = window.Ic;
  const data = window.KL_DATA;
  window.useLucide();

  const show = [...data.current, ...data.past].find((s) => s.id === showId) || data.current[0];
  const dates = show.dates || [];

  return (
    <main style={{ background: "var(--surface-page)" }}>
      {/* hero band */}
      <section className="kl-stage">
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-8) var(--gutter)" }}>
          <button onClick={() => onNavigate("spielplan")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-stage-muted)", fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "var(--space-6)", fontWeight: 600 }}>
            <span style={{ fontSize: "16px", transform: "rotate(180deg)" }}><Ic n="chevron-right" /></span> Zurück zum Spielplan
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "var(--space-9)", alignItems: "center" }}>
            <div style={{
              aspectRatio: "3 / 4", borderRadius: "var(--radius-lg)", overflow: "hidden",
              background: "radial-gradient(120% 120% at 50% 0%, var(--plum-600), var(--plum-900))",
              display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--border-stage)",
            }}>
              <div style={{ opacity: 0.6 }}><Monogram size={96} tone="gold" /></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <div><Badge variant="stage">{show.genre}</Badge></div>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-5xl)", lineHeight: 1.04, margin: 0, color: "var(--text-stage-strong)" }}>{show.title}</h1>
              <p style={{ fontSize: "var(--text-lg)", color: "var(--text-stage-body)", lineHeight: "var(--leading-relaxed)", margin: 0, maxWidth: "46ch" }}>{show.blurb}</p>
              <div style={{ display: "flex", gap: "var(--space-5)", marginTop: "var(--space-2)", color: "var(--text-stage-muted)", fontSize: "var(--text-sm)", flexWrap: "wrap" }}>
                <span style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "var(--gold-400)", fontSize: "18px" }}><Ic n="utensils" /></span>4-Gänge-Menü inklusive</span>
                <span style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "var(--gold-400)", fontSize: "18px" }}><Ic n="clock" /></span>ca. 3 Stunden</span>
                <span style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "var(--gold-400)", fontSize: "18px" }}><Ic n="map-pin" /></span>{data.venue.name}</span>
              </div>
              <div style={{ marginTop: "var(--space-3)" }}>
                <Button variant="primary" size="lg" onClick={() => onNavigate("tickets")} iconRight={<span style={{ fontSize: "20px" }}><Ic n="ticket" /></span>}>Tickets sichern</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* showtimes */}
      <section>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-10) var(--gutter)" }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--gold-600)" }}>Termine</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-3xl)", margin: "var(--space-2) 0 var(--space-6)", color: "var(--text-strong)" }}>Wann möchten Sie kommen?</h2>
          {dates.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {dates.map((d, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "var(--space-4) var(--space-5)", background: "var(--surface-card)",
                  border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-xs)",
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "var(--text-lg)", color: "var(--text-strong)", fontWeight: 500 }}>
                    <span style={{ color: "var(--gold-600)", fontSize: "20px" }}><Ic n="calendar-days" /></span>{d}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => onNavigate("tickets")}>Reservieren</Button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "var(--text-lg)" }}>Diese Inszenierung ist bereits abgespielt. Schauen Sie gern in den aktuellen Spielplan.</p>
          )}
        </div>
      </section>
    </main>
  );
}
window.ShowDetailScreen = ShowDetailScreen;
