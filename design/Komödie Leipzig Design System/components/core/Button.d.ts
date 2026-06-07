import * as React from "react";

/**
 * Props for the primary action control.
 *
 * @startingPoint section="Core" subtitle="Buttons — primary, secondary, ghost & link" viewport="700x180"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "primary" */
  variant?: "primary" | "secondary" | "ghost" | "link";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Surface context — "stage" tunes colours for dark backgrounds. @default "light" */
  tone?: "light" | "stage";
  /** Stretch to fill the container width. @default false */
  fullWidth?: boolean;
  /** Element rendered before the label (e.g. a Lucide icon). */
  iconLeft?: React.ReactNode;
  /** Element rendered after the label. */
  iconRight?: React.ReactNode;
}

/**
 * The primary action control — pill-shaped, warm, theatrical.
 * Gold primary, plum secondary, gold-outline ghost, inline link.
 */
export function Button(props: ButtonProps): React.JSX.Element;
