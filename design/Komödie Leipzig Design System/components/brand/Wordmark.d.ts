import * as React from "react";

/**
 * Props for the primary Komödie Leipzig logo lockup.
 *
 * @startingPoint section="Brand" subtitle="Primary logo lockup — stacked, horizontal & wordmark-only" viewport="700x260"
 */
export interface WordmarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Lockup arrangement. @default "horizontal" */
  layout?: "stacked" | "horizontal" | "wordmark-only";
  /** "gold" for dark stages, "ink" for light playbill surfaces. @default "gold" */
  tone?: "gold" | "ink";
  /** Show the "Bei uns lachen Sie besser" strapline. @default false */
  tagline?: boolean;
  /** Overall size. @default "md" */
  size?: "sm" | "md" | "lg";
}

/**
 * The primary Komödie Leipzig logo lockup. Sets the name in Lo-Type
 * with the "Ö" umlaut rebuilt as glowing footlights, optionally
 * paired with the proscenium Monogram.
 */
export function Wordmark(props: WordmarkProps): React.JSX.Element;
