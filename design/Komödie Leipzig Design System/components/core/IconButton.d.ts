import * as React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default "ghost" */
  variant?: "solid" | "ghost" | "stage";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Surface context. @default "light" */
  tone?: "light" | "stage";
  /** Accessible label (also the title tooltip) — required, icon-only. */
  label: string;
}

/**
 * Square, pill-rounded icon-only control for nav, toolbars and close
 * affordances. Pass a Lucide icon as children.
 */
export function IconButton(props: IconButtonProps): React.JSX.Element;
