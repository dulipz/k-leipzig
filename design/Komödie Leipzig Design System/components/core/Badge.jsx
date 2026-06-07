import React from "react";

/**
 * Badge — small pill label. The brand's signature genre tag
 * ("Trabi-Komödie", "Märchen-Komödie") plus status uses.
 *
 * variant : "gold" | "plum" | "neutral" | "outline" | "stage"
 * size    : "sm" | "md"
 */
export function Badge({ variant = "gold", size = "md", children, style, ...rest }) {
  const sizes = {
    sm: { padding: "2px 8px", font: "var(--text-2xs)" },
    md: { padding: "4px 12px", font: "var(--text-xs)" },
  }[size];

  const variants = {
    gold:    { background: "var(--gold-100)", color: "var(--gold-800)", border: "1px solid transparent" },
    plum:    { background: "var(--plum-100)", color: "var(--plum-700)", border: "1px solid transparent" },
    neutral: { background: "var(--ink-100)", color: "var(--ink-700)", border: "1px solid transparent" },
    outline: { background: "transparent", color: "var(--gold-700)", border: "1px solid var(--gold-500)" },
    stage:   { background: "rgba(252,235,201,0.10)", color: "var(--gold-400)", border: "1px solid var(--border-stage)" },
  }[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        padding: sizes.padding,
        fontFamily: "var(--font-sans)",
        fontSize: sizes.font,
        fontWeight: "var(--fw-bold)",
        letterSpacing: "var(--tracking-wide)",
        lineHeight: 1.4,
        borderRadius: "var(--radius-pill)",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        ...variants,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
