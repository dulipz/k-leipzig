// Shared helpers for the website UI kit.
// DS components live on the compiled namespace; expose them + a Lucide
// icon helper on window so every screen file can use them.
(function () {
  const KL = window.KomDieLeipzigDesignSystem_ce970b;
  window.KL = KL;

  // Lucide icon as a React element. Size via parent font-size (svg is 1.1em).
  window.Ic = function Ic({ n, style }) {
    return React.createElement("i", { "data-lucide": n, className: "kl-ic", style });
  };

  // Call inside a component to (re)hydrate Lucide icons after render.
  window.useLucide = function useLucide() {
    React.useEffect(() => {
      if (window.lucide) window.lucide.createIcons();
    });
  };
})();
