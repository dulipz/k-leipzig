// SiteFooter — dark stage footer with contact, venue and links.
function SiteFooter({ onNavigate }) {
  const { Wordmark } = window.KL;
  const Ic = window.Ic;
  const v = window.KL_DATA.venue;
  window.useLucide();

  const col = (title, items) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--gold-400)" }}>{title}</span>
      {items}
    </div>
  );

  const link = (label, key) => (
    <button onClick={() => onNavigate(key)} style={{ background: "none", border: "none", textAlign: "left", padding: 0, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--text-stage-body)" }}>{label}</button>
  );

  return (
    <footer style={{ borderTop: "1px solid var(--border-stage)", background: "var(--ink-950)", color: "var(--text-stage-body)" }}>
      <div style={{
        maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-9) var(--gutter) var(--space-6)",
        display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: "var(--space-8)",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Wordmark layout="stacked" tone="gold" size="sm" tagline />
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-stage-muted)", maxWidth: "34ch", margin: 0, lineHeight: "var(--leading-relaxed)" }}>
            Theater &amp; Erlebnisgastronomie — vier Gänge, ein Stück, ein unvergesslicher Abend.
          </p>
        </div>
        {col("Besuch", <>
          {link("Spielplan & Termine", "spielplan")}
          {link("Inszenierungen", "show")}
          {link("Tickets & Reservierung", "tickets")}
          {link("Gutscheine", "tickets")}
        </>)}
        {col("Kleine Komödie Reuden", <>
          <span style={{ fontSize: "var(--text-sm)", display: "flex", gap: "8px", alignItems: "flex-start" }}><span style={{ color: "var(--gold-400)", fontSize: "18px" }}><Ic n="map-pin" /></span>{v.address}</span>
          <span style={{ fontSize: "var(--text-sm)", display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "var(--gold-400)", fontSize: "18px" }}><Ic n="mail" /></span>{v.email}</span>
          <span style={{ fontSize: "var(--text-sm)", display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "var(--gold-400)", fontSize: "18px" }}><Ic n="users" /></span>{v.seats}</span>
        </>)}
      </div>
      <div style={{ borderTop: "1px solid var(--border-stage)", padding: "var(--space-4) var(--gutter)" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--text-stage-muted)" }}>
          <span>© 2026 Komödie Leipzig · Das Original</span>
          <span style={{ display: "flex", gap: "var(--space-5)" }}>
            <span>Impressum</span><span>Datenschutz</span><span>AGB</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
window.SiteFooter = SiteFooter;
