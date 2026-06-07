// SpielplanScreen — full programme with Aktuell / Abgespielt tabs.
function SpielplanScreen({ onOpenShow }) {
  const { ShowCard } = window.KL;
  const data = window.KL_DATA;
  const [tab, setTab] = React.useState("current");
  window.useLucide();

  const tabs = [
    { key: "current", label: "Aktuell im Spielplan" },
    { key: "past", label: "Abgespielt" },
  ];
  const shows = tab === "current" ? data.current : data.past;

  return (
    <main style={{ background: "var(--surface-page)", minHeight: "70vh" }}>
      {/* page head — small stage band */}
      <section className="kl-stage" style={{ padding: "var(--space-9) var(--gutter)" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--gold-400)" }}>Tickets & Termine</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-5xl)", margin: "var(--space-2) 0 0", color: "var(--text-stage-strong)" }}>Spielplan</h1>
        </div>
      </section>

      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-8) var(--gutter)" }}>
        {/* tabs */}
        <div style={{ display: "flex", gap: "var(--space-2)", borderBottom: "1px solid var(--border-default)", marginBottom: "var(--space-7)" }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "var(--space-3) var(--space-4)",
              fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", fontWeight: 600,
              color: tab === t.key ? "var(--gold-700)" : "var(--text-muted)",
              borderBottom: tab === t.key ? "2px solid var(--gold-500)" : "2px solid transparent",
              marginBottom: "-1px", transition: "color var(--dur-fast) var(--ease-soft)",
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-6)" }}>
          {shows.map((s) => (
            <ShowCard key={s.id} genre={s.genre} title={s.title} date={s.date} blurb={s.blurb}
              ctaLabel={tab === "current" ? "Mehr & Tickets" : "Zur Inszenierung"}
              onCta={() => onOpenShow(s.id)} />
          ))}
        </div>
      </div>
    </main>
  );
}
window.SpielplanScreen = SpielplanScreen;
