# Daily Outfit

A curated daily outfit suggestion app with an elegant old-money aesthetic. Switch between Women's and Men's wardrobes, get a daily pick, shuffle for alternatives, and track what you've worn.

## Features

- **Two Wardrobes** — separate Women's and Men's collections via a wardrobe switcher; selection persisted in localStorage (`wardrobe-gender`)
- **Daily Suggestion** — deterministic daily outfit pick based on the date
- **Shuffle** — randomize to a different outfit, skipping recently worn
- **Wear Today** — mark an outfit as worn; last 5 worn outfits are excluded from suggestions (worn history is tracked per wardrobe)
- **Collection** — browse all outfits grouped by shirt color, filter by piece count (2-piece / 3-piece)
- **Dual Theme** — light (6am-6pm) / dark (6pm-6am) auto-switch with manual toggle, persisted in localStorage

Each outfit declares a `wardrobe_gender` (`female` / `male`) in `all_40_outfit_suggestions.json`, and images live under a per-wardrobe folder (`outfits/women/`, `outfits/men/`). The Men's wardrobe shows an empty-state until male outfits are added.

## Run Locally

No build step, no dependencies. Just serve the files with any static HTTP server:

```bash
# Python 3
cd daily_outfit
python3 -m http.server 8080

# Python 2
cd daily_outfit
python -m SimpleHTTPServer 8080

# Node.js (npx, no install needed)
cd daily_outfit
npx serve -p 8080

# PHP
cd daily_outfit
php -S localhost:8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

> **Note:** Opening `index.html` directly as a file won't work because the app uses `fetch()` to load outfit data, which requires an HTTP server.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings > Pages**
3. Set source to the branch containing the files (e.g. `main`)
4. The site will be live at `https://<username>.github.io/<repo-name>/`

## File Structure

```
daily_outfit/
  index.html              # Daily suggestion page
  collection.html         # Full collection browser
  app.js                  # Daily page logic (theme, shuffle, worn tracking)
  collection.js           # Collection page logic (grouping, filters)
  styles.css              # Shared styles, dual theme via CSS custom properties
  all_40_outfit_suggestions.json   # Outfit data, tagged by wardrobe_gender
  outfit_source_clothing_catalog.json  # Source garment catalog, tagged by wardrobe_gender
  outfits/
    women/                # Women's outfit images (outfit_01.png ...)
    men/                  # Men's outfit images (added as the wardrobe grows)
```
