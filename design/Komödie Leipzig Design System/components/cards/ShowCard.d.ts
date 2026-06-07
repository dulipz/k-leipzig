import * as React from "react";

/**
 * Props for the Spielplan production tile.
 *
 * @startingPoint section="Cards" subtitle="Programme / show tile with poster, genre & date" viewport="380x440"
 */
export interface ShowCardProps extends React.HTMLAttributes<HTMLElement> {
  /** Production title (rendered in Lo-Type). */
  title: string;
  /** Genre tag, e.g. "Trabi-Komödie". */
  genre?: string;
  /** Short teaser line. */
  blurb?: string;
  /** Date / showtime line, e.g. "Fr · 13.03.2026 · 19:30 Uhr". */
  date?: string;
  /** Poster image URL; falls back to a warm proscenium placeholder. */
  image?: string;
  /** CTA label. @default "Mehr & Tickets" */
  ctaLabel?: string;
  /** CTA click handler. */
  onCta?: () => void;
}

/**
 * A production tile for the Spielplan — poster, genre Badge, title,
 * date and CTA. Lifts with a warm glow on hover.
 */
export function ShowCard(props: ShowCardProps): React.JSX.Element;
