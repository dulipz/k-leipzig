import React from "react";
import { Monogram } from "./Monogram.jsx";

/* build: lo-type v2 */
/**
 * Wordmark — the primary Komödie Leipzig logo lockup.
 *
 * The redesign sets the name in Lo-Type (the self-hosted brand display
 * face) and turns the two dots of the "Ö" umlaut into glowing footlights
 * — the brand's ownable detail. Pair with the proscenium Monogram.
 *
 * layout : "stacked" (mark over name) | "horizontal" | "wordmark-only"
 * tone   : "gold" (for dark stages) | "ink" (for light playbills)
 * tagline: show the "Bei uns lachen Sie besser." line
 */
export function Wordmark({
  layout = "horizontal",
  tone = "gold",
  tagline = false,
  size = "md",
  style,
  ...rest
}) {
  const scale = { sm: 0.72, md: 1, lg: 1.5 }[size] || 1;
  const nameColor = tone === "ink" ? "var(--ink-950)" : "var(--champagne)";
  const lightColor = "var(--gold-500)";
  const markPx = (layout === "stacked" ? 56 : 40) * scale;

  // "KOM[Ö]DIE" — the Ö is rebuilt so its umlaut dots glow as footlights
  const name = (
    <span
      style={{
        fontFamily: '"Lo-Type", Georgia, serif',
        fontWeight: 400,
        fontSize: `${(layout === "stacked" ? 2.5 : 2.1) * scale}rem`,
        lineHeight: 1,
        letterSpacing: "0.03em",
        color: nameColor,
        display: "inline-flex",
        alignItems: "baseline",
        whiteSpace: "nowrap",
      }}
    >
      KOM
      <span style={{ position: "relative", display: "inline-block" }}>
        O
        {/* footlight umlaut */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-0.26em",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.18em",
          }}
        >
          <span style={{ width: "0.14em", height: "0.14em", borderRadius: "50%", background: lightColor, boxShadow: `0 0 0.18em ${lightColor}` }} />
          <span style={{ width: "0.14em", height: "0.14em", borderRadius: "50%", background: lightColor, boxShadow: `0 0 0.18em ${lightColor}` }} />
        </span>
      </span>
      DIE
      <span style={{ width: `${0.5 * scale}em`, display: "inline-block" }} />
      <span style={{ fontWeight: 400 }}>LEIPZIG</span>
    </span>
  );

  const taglineEl = tagline && (
    <span
      style={{
        fontFamily: 'var(--font-sans), sans-serif',
        fontWeight: 700,
        fontSize: `${0.66 * scale}rem`,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: tone === "ink" ? "var(--gold-700)" : "var(--gold-400)",
        marginTop: layout === "stacked" ? "0.6em" : "0.35em",
      }}
    >
      Bei&nbsp;uns&nbsp;lachen&nbsp;Sie&nbsp;besser
    </span>
  );

  if (layout === "wordmark-only") {
    return (
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", ...style }} {...rest}>
        {name}
        {taglineEl}
      </span>
    );
  }

  if (layout === "stacked") {
    return (
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: `${0.5 * scale}rem`, ...style }} {...rest}>
        <Monogram size={markPx} tone={tone} />
        {name}
        {taglineEl}
      </span>
    );
  }

  // horizontal
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: `${0.75 * scale}rem`, ...style }} {...rest}>
      <Monogram size={markPx} tone={tone} />
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
        {name}
        {taglineEl}
      </span>
    </span>
  );
}
