import React from "react";

/**
 * Button — the primary action control. Pill-shaped, warm, theatrical.
 *
 * variant : "primary" (gold) | "secondary" (plum) | "ghost" | "link"
 * size    : "sm" | "md" | "lg"
 * tone    : "light" (default) | "stage" (for use on dark stage surfaces)
 */
export function Button({
  variant = "primary",
  size = "md",
  tone = "light",
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: { height: "var(--control-sm)", padding: "0 var(--space-4)", font: "var(--text-sm)" },
    md: { height: "var(--control-md)", padding: "0 var(--space-6)", font: "var(--text-base)" },
    lg: { height: "var(--control-lg)", padding: "0 var(--space-7)", font: "var(--text-lg)" },
  }[size];

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--space-2)",
    height: sizes.height,
    padding: variant === "link" ? 0 : sizes.padding,
    width: fullWidth ? "100%" : "auto",
    fontFamily: "var(--font-sans)",
    fontSize: sizes.font,
    fontWeight: "var(--fw-semibold)",
    letterSpacing: "var(--tracking-wide)",
    lineHeight: 1,
    borderRadius: "var(--radius-pill)",
    border: "1.5px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "background var(--dur-fast) var(--ease-soft), color var(--dur-fast) var(--ease-soft), border-color var(--dur-fast) var(--ease-soft), transform var(--dur-fast) var(--ease-soft), box-shadow var(--dur-base) var(--ease-soft)",
    whiteSpace: "nowrap",
    textDecoration: "none",
  };

  const variants = {
    primary: {
      background: "var(--gold-500)",
      color: "var(--text-on-brand)",
      borderColor: "var(--gold-500)",
    },
    secondary: {
      background: tone === "stage" ? "var(--plum-600)" : "var(--plum-500)",
      color: "var(--champagne)",
      borderColor: tone === "stage" ? "var(--plum-600)" : "var(--plum-500)",
    },
    ghost: {
      background: "transparent",
      color: tone === "stage" ? "var(--gold-400)" : "var(--gold-700)",
      borderColor: tone === "stage" ? "var(--border-stage)" : "var(--gold-500)",
    },
    link: {
      background: "transparent",
      color: tone === "stage" ? "var(--gold-400)" : "var(--gold-700)",
      borderColor: "transparent",
      borderRadius: 0,
    },
  }[variant];

  const onEnter = (e) => {
    if (disabled) return;
    const el = e.currentTarget;
    if (variant === "primary") { el.style.background = "var(--gold-600)"; el.style.borderColor = "var(--gold-600)"; el.style.boxShadow = "var(--shadow-glow)"; }
    else if (variant === "secondary") { el.style.background = "var(--plum-600)"; el.style.borderColor = "var(--plum-600)"; }
    else if (variant === "ghost") { el.style.background = tone === "stage" ? "rgba(252,235,201,0.08)" : "var(--gold-50)"; el.style.borderColor = "var(--gold-600)"; el.style.color = "var(--gold-600)"; }
    else if (variant === "link") { el.style.color = "var(--gold-600)"; }
  };
  const onLeave = (e) => {
    const el = e.currentTarget;
    el.style.background = variants.background;
    el.style.borderColor = variants.borderColor;
    el.style.color = variants.color;
    el.style.boxShadow = "none";
  };
  const onDown = (e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; };
  const onUp = (e) => { e.currentTarget.style.transform = "scale(1)"; };

  return (
    <button
      type="button"
      disabled={disabled}
      style={{ ...base, ...variants, ...style }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
      onMouseUp={onUp}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
