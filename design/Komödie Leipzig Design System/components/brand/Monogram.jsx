import React from "react";

/* build: lo-type v3 */
/**
 * Monogram — the Komödie Leipzig proscenium mark.
 * A minimal stage arch with three footlights. Geometric, ownable,
 * works at favicon size. Renders in `tone`: "gold" (default, for
 * dark stages), "ink" (for light playbill surfaces) or "mono".
 */
export function Monogram({ size = 48, tone = "gold", title = "Komödie Leipzig", style, ...rest }) {
  const palette = {
    gold: { arch: "var(--gold-500)", light: "var(--champagne)", k: "var(--gold-500)" },
    ink:  { arch: "var(--ink-900)",  light: "var(--gold-500)",  k: "var(--ink-900)" },
    mono: { arch: "currentColor",    light: "currentColor",     k: "currentColor" },
  }[tone] || {};

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      style={style}
      {...rest}
    >
      {/* proscenium arch — rounded-top stage opening */}
      <path
        d="M7 41 V20 C7 11.7 14.3 5 24 5 C33.7 5 41 11.7 41 20 V41"
        fill="none"
        stroke={palette.arch}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* the K, set on the stage */}
      <text
        x="24"
        y="33"
        textAnchor="middle"
        fontFamily='"Lo-Type", Georgia, serif'
        fontWeight="400"
        fontSize="22"
        fill={palette.k}
      >
        K
      </text>
      {/* three footlights along the apron */}
      <circle cx="15" cy="44" r="2" fill={palette.light} />
      <circle cx="24" cy="44" r="2" fill={palette.light} />
      <circle cx="33" cy="44" r="2" fill={palette.light} />
    </svg>
  );
}
