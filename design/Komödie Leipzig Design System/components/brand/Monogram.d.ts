import * as React from "react";

export interface MonogramProps extends React.SVGAttributes<SVGSVGElement> {
  /** Pixel size of the square mark. @default 48 */
  size?: number;
  /** Color treatment. "gold" for dark stages, "ink" for light. @default "gold" */
  tone?: "gold" | "ink" | "mono";
  /** Accessible label. @default "Komödie Leipzig" */
  title?: string;
}

/**
 * The Komödie Leipzig proscenium mark — a stage arch with three
 * footlights and a serif "K". Use as favicon, avatar, app icon, or
 * paired with the Wordmark.
 */
export function Monogram(props: MonogramProps): React.JSX.Element;
