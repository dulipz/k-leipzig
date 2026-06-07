**ShowCard** — the production tile used across the Spielplan and home page.

```jsx
<ShowCard
  genre="Trabi-Komödie"
  title="Go Trabi Go"
  date="Fr · 13.03.2026 · 19:30 Uhr"
  blurb="Die Kult-Komödie als Dinner-Theater — mit 4-Gänge-Menü."
  image="/assets/shows/trabi.jpg"
  onCta={() => {}}
/>
```

Omit `image` to get the warm proscenium placeholder (good for shows without artwork yet). Always supply a `genre` tag and a German-formatted `date`.
