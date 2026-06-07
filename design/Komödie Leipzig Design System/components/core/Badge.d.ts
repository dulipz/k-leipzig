import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "gold" */
  variant?: "gold" | "plum" | "neutral" | "outline" | "stage";
  /** @default "md" */
  size?: "sm" | "md";
}

/**
 * Small uppercase pill label. Primary use is the brand's genre tag
 * ("Trabi-Komödie", "Kult-Komödie"); also status/meta.
 */
export function Badge(props: BadgeProps): React.JSX.Element;
