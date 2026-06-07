import * as React from "react";

export interface SelectOption { value: string; label: string; }

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helper?: string;
  /** Options as data; alternatively pass <option> children. */
  options?: SelectOption[];
  /** Surface context. @default "light" */
  tone?: "light" | "stage";
}

/** Native select styled to match Input, with a gold caret. */
export function Select(props: SelectProps): React.JSX.Element;
