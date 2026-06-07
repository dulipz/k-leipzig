import React from "react";

/**
 * Select — native select styled to match Input. Pass options as
 * [{value,label}] or children <option>s.
 */
export function Select({
  label,
  helper,
  options = null,
  tone = "light",
  id,
  children,
  style,
  ...rest
}) {
  const fieldId = id || `kl-select-${Math.random().toString(36).slice(2, 8)}`;
  const onStage = tone === "stage";
  const [focused, setFocused] = React.useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", ...style }}>
      {label && (
        <label htmlFor={fieldId} style={{
          fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--fw-semibold)",
          color: onStage ? "var(--text-stage-body)" : "var(--text-strong)",
        }}>{label}</label>
      )}
      <div style={{
        position: "relative",
        height: "var(--control-md)",
        background: onStage ? "rgba(252,235,201,0.04)" : "var(--surface-raised)",
        border: `1.5px solid ${focused ? "var(--gold-500)" : (onStage ? "var(--border-stage)" : "var(--border-default)")}`,
        borderRadius: "var(--radius-md)",
        boxShadow: focused ? "0 0 0 3px color-mix(in srgb, var(--gold-500) 22%, transparent)" : "none",
        transition: "border-color var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft)",
      }}>
        <select
          id={fieldId}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
          style={{
            width: "100%", height: "100%", border: "none", outline: "none",
            background: "transparent", appearance: "none", WebkitAppearance: "none",
            padding: "0 var(--space-7) 0 var(--space-4)", cursor: "pointer",
            fontFamily: "var(--font-sans)", fontSize: "var(--text-base)",
            color: onStage ? "var(--text-stage-strong)" : "var(--text-body)",
          }}
        >
          {options ? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>) : children}
        </select>
        <span aria-hidden="true" style={{
          position: "absolute", right: "var(--space-4)", top: "50%", transform: "translateY(-50%)",
          pointerEvents: "none", color: "var(--gold-600)", fontSize: "0.8em",
        }}>▾</span>
      </div>
      {helper && (
        <span style={{ fontSize: "var(--text-xs)", color: onStage ? "var(--text-stage-muted)" : "var(--text-muted)" }}>{helper}</span>
      )}
    </div>
  );
}
