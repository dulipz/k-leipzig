// SiteHeader — sticky top nav. Wordmark, links, search + Tickets CTA.
function SiteHeader({ route, onNavigate }) {
  const { Wordmark, Button, IconButton } = window.KL;
  const Ic = window.Ic;
  window.useLucide();
  const [scrolled, setScrolled] = React.useState(false);

  const links = [
    { key: "home", label: "Start" },
    { key: "spielplan", label: "Spielplan" },
    { key: "show", label: "Inszenierungen" },
    { key: "kontakt", label: "Kontakt" },
  ];

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "color-mix(in srgb, var(--ink-950) 92%, transparent)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border-stage)",
      }}
    >
      <div style={{
        maxWidth: "var(--container-max)", margin: "0 auto",
        padding: "var(--space-3) var(--gutter)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-5)",
      }}>
        <button onClick={() => onNavigate("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} aria-label="Zur Startseite">
          <Wordmark layout="horizontal" tone="gold" size="sm" />
        </button>

        <nav style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
          {links.map((l) => (
            <button
              key={l.key}
              onClick={() => onNavigate(l.key)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 600,
                letterSpacing: "var(--tracking-wide)",
                color: route === l.key ? "var(--gold-400)" : "var(--text-stage-body)",
                padding: "var(--space-2) 0",
                borderBottom: route === l.key ? "2px solid var(--gold-500)" : "2px solid transparent",
                transition: "color var(--dur-fast) var(--ease-soft)",
              }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "20px" }}>
          <IconButton label="Suche" variant="stage"><Ic n="search" /></IconButton>
          <Button variant="primary" size="sm" iconRight={<span style={{ fontSize: "18px" }}><Ic n="ticket" /></span>} onClick={() => onNavigate("tickets")}>
            Tickets
          </Button>
        </div>
      </div>
    </header>
  );
}
window.SiteHeader = SiteHeader;
