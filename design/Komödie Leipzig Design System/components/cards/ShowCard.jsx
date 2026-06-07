import React from "react";
import { Badge } from "../core/Badge.jsx";
import { Monogram } from "../brand/Monogram.jsx";

/**
 * ShowCard — a production tile for the Spielplan (programme).
 * Poster area (real image or a warm proscenium placeholder), genre
 * Badge, Lo-Type title, date line and a CTA. Lifts with a warm glow
 * on hover.
 */
export function ShowCard({
  title,
  genre,
  blurb,
  date,
  image = null,
  ctaLabel = "Mehr & Tickets",
  onCta,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column",
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: hover ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition: "box-shadow var(--dur-base) var(--ease-soft), transform var(--dur-base) var(--ease-curtain)",
        ...style,
      }}
      {...rest}
    >
      {/* poster */}
      <div style={{
        position: "relative", aspectRatio: "3 / 2", overflow: "hidden",
        background: "radial-gradient(120% 120% at 50% 0%, var(--plum-700), var(--plum-900))",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {image ? (
          <img src={image} alt={title} style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hover ? "scale(1.04)" : "scale(1)",
            transition: "transform var(--dur-slow) var(--ease-curtain)",
          }} />
        ) : (
          <div style={{ opacity: 0.5 }}><Monogram size={64} tone="gold" /></div>
        )}
        {genre && (
          <div style={{ position: "absolute", top: "var(--space-3)", left: "var(--space-3)" }}>
            <Badge variant={image ? "stage" : "gold"}>{genre}</Badge>
          </div>
        )}
      </div>

      {/* body */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", padding: "var(--space-5)", flex: 1 }}>
        {date && (
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", fontWeight: "var(--fw-bold)",
            letterSpacing: "var(--tracking-wide)", textTransform: "uppercase", color: "var(--gold-700)",
          }}>{date}</span>
        )}
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: "var(--text-2xl)",
          lineHeight: "var(--leading-tight)", color: "var(--text-strong)", margin: 0,
        }}>{title}</h3>
        {blurb && (
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)",
            color: "var(--text-muted)", margin: 0,
          }}>{blurb}</p>
        )}
        <div style={{ marginTop: "auto", paddingTop: "var(--space-3)" }}>
          <button
            type="button"
            onClick={onCta}
            style={{
              display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
              background: "transparent", border: "none", padding: 0, cursor: "pointer",
              fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--fw-bold)",
              letterSpacing: "var(--tracking-wide)",
              color: hover ? "var(--gold-600)" : "var(--gold-700)",
              whiteSpace: "nowrap",
            }}
          >
            {ctaLabel}
            <span style={{ transform: hover ? "translateX(3px)" : "none", transition: "transform var(--dur-fast) var(--ease-soft)" }}>▸</span>
          </button>
        </div>
      </div>
    </article>
  );
}
