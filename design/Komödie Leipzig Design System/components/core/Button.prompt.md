**Button** — the primary action control; use for ticket purchases, reservations, form submits, and any committed action.

```jsx
<Button variant="primary" size="lg" iconRight={<ChevronRight size={18} />}>
  Tickets sichern
</Button>
```

- `variant`: `primary` (gold — the main CTA, one per view), `secondary` (plum), `ghost` (gold outline — secondary actions), `link` (inline).
- `tone="stage"` when placed on a dark `.kl-stage` / plum surface.
- Hover deepens the fill and adds the gold glow; press shrinks slightly. Pair with a single Lucide chevron for "weiter / mehr" actions.
