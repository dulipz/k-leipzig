import React from "react";

/**
 * IconButton — a square, pill-rounded icon-only control for toolbars,
 * nav, close affordances. Pass a Lucide icon as children.
 *
 * variant : "solid" (gold) | "ghost" | "stage"
 * size    : "sm" | "md" | "lg"
 */
export function IconButton({
  variant = "ghost",
  size = "md",
  tone = "light",
  label,
  disabled = false,
  children,
  style,
  ...rest
}) {
  const dim = { sm: "2rem", md: "2.75rem", lg: "3.25rem" }[size];

  const variants = {
    solid: { background: "var(--gold-500)", color: "var(--text-on-brand)", border: "1.5px solid var(--gold-500)" },
    ghost: { background: "transparent", color: tone === "stage" ? "var(--text-stage-body)" : "var(--ink-700)", border: "1.5px solid transparent" },
    stage: { background: "rgba(252,235,201,0.08)", color: "var(--gold-400)", border: "1.5px solid var(--border-stage)" },
  }[variant];

  const onEnter = (e) => {
    if (disabled) return;
    const el = e.currentTarget;
    if (variant === "solid") { el.style.background = "var(--gold-600)"; el.style.borderColor = "var(--gold-600)"; }
    else { el.style.background = tone === "stage" ? "rgba(252,235,201,0.16)" : "var(--gold-50)"; el.style.color = tone === "stage" ? "var(--gold-300)" : "var(--gold-700)"; }
  };
  const onLeave = (e) => {
    const el = e.currentTarget;
    el.style.background = variants.background;
    el.style.color = variants.color;
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dim,
        height: dim,
        flex: "0 0 auto",
        borderRadius: "var(--radius-pill)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background var(--dur-fast) var(--ease-soft), color var(--dur-fast) var(--ease-soft), border-color var(--dur-fast) var(--ease-soft)",
        ...variants,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
