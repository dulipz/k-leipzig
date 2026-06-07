import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Field label rendered above the control. */
  label?: string;
  /** Helper text below the field. */
  helper?: string;
  /** Error message — turns the field red and replaces the helper. */
  error?: string;
  /** Leading adornment (icon/prefix). */
  iconLeft?: React.ReactNode;
  /** Trailing adornment. */
  iconRight?: React.ReactNode;
  /** Surface context. @default "light" */
  tone?: "light" | "stage";
}

/** Text field with label, helper/error and optional adornments. */
export function Input(props: InputProps): React.JSX.Element;
