import React from "react";

/**
 * Input — text field with optional label, helper/error text and
 * leading/trailing adornments. Warm, generous, 44px tall.
 */
export function Input({
  label,
  helper,
  error,
  iconLeft = null,
  iconRight = null,
  tone = "light",
  id,
  style,
  ...rest
}) {
  const fieldId = id || `kl-input-${Math.random().toString(36).slice(2, 8)}`;
  const onStage = tone === "stage";
  const [focused, setFocused] = React.useState(false);

  const borderColor = error
    ? "var(--rouge-500)"
    : focused
    ? "var(--gold-500)"
    : onStage ? "var(--border-stage)" : "var(--border-default)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", ...style }}>
      {label && (
        <label htmlFor={fieldId} style={{
          fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--fw-semibold)",
          color: onStage ? "var(--text-stage-body)" : "var(--text-strong)",
        }}>{label}</label>
      )}
      <div style={{
        display: "flex", alignItems: "center", gap: "var(--space-3)",
        height: "var(--control-md)", padding: "0 var(--space-4)",
        background: onStage ? "rgba(252,235,201,0.04)" : "var(--surface-raised)",
        border: `1.5px solid ${borderColor}`,
        borderRadius: "var(--radius-md)",
        boxShadow: focused ? "0 0 0 3px color-mix(in srgb, var(--gold-500) 22%, transparent)" : "none",
        transition: "border-color var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft)",
        color: onStage ? "var(--text-stage-muted)" : "var(--text-muted)",
      }}>
        {iconLeft}
        <input
          id={fieldId}
          onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
          {...rest}
          style={{
            flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent",
            fontFamily: "var(--font-sans)", fontSize: "var(--text-base)",
            color: onStage ? "var(--text-stage-strong)" : "var(--text-body)",
          }}
        />
        {iconRight}
      </div>
      {(helper || error) && (
        <span style={{
          fontSize: "var(--text-xs)",
          color: error ? "var(--rouge-500)" : onStage ? "var(--text-stage-muted)" : "var(--text-muted)",
        }}>{error || helper}</span>
      )}
    </div>
  );
}
