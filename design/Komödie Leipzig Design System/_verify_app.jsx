function ContactScreen({ onNavigate }) {
  const Ic = window.Ic; const v = window.KL_DATA.venue; window.useLucide();
  return (
    <main style={{ background: "var(--surface-page)", minHeight: "60vh" }}>
      <section className="kl-stage" style={{ padding: "var(--space-9) var(--gutter)" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--gold-400)" }}>Kontakt & Anfahrt</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-5xl)", margin: "var(--space-2) 0 0", color: "var(--text-stage-strong)" }}>So finden Sie uns</h1>
        </div>
      </section>
    </main>
  );
}
function App() {
  const [route, setRoute] = React.useState("home");
  const [showId, setShowId] = React.useState(window.KL_DATA.current[0].id);
  const navigate = (r) => { setRoute(r); window.scrollTo({ top: 0 }); };
  const openShow = (id) => { setShowId(id); navigate("show"); };
  let screen;
  if (route === "spielplan") screen = <window.SpielplanScreen onOpenShow={openShow} />;
  else if (route === "show") screen = <window.ShowDetailScreen showId={showId} onNavigate={navigate} />;
  else if (route === "tickets") screen = <window.TicketsScreen onNavigate={navigate} />;
  else if (route === "kontakt") screen = <ContactScreen onNavigate={navigate} />;
  else screen = <window.HomeScreen onNavigate={navigate} onOpenShow={openShow} />;
  return (<React.Fragment>
    <window.SiteHeader route={route} onNavigate={navigate} />
    {screen}
    <window.SiteFooter onNavigate={navigate} />
  </React.Fragment>);
}
ReactDOM.createRoot(document.getElementById("app")).render(<App />);
