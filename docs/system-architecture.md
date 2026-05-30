# System Architecture

## Architecture Type

Static single-page application (SPA-like). No framework, no build step, no server-side logic. Two HTML pages share a single CSS file and each load their own JS module.

## High-Level Diagram

```
Browser
  ├── index.html ──── app.js ──────────┐
  │                                     ├── fetch() ── all_40_outfit_suggestions.json
  ├── collection.html ── collection.js ─┘
  ├── styles.css (shared)
  └── localStorage (theme + worn history)
```

## Pages

### `index.html` — Daily Suggestion

Entry point. Displays a single hero outfit card with shuffle controls and a "Wear Today" button. Served by `app.js`.

### `collection.html` — Collection Browser

Gallery of all 57 outfits grouped by shirt color with piece-count filter chips. Served by `collection.js`.

## Data Layer

### `all_40_outfit_suggestions.json`

JSON array of 57 outfit objects (legacy filename from initial 40-outfit set). Each object:

```json
{
  "outfit_no": 1,
  "set": 1,
  "palette": "Cream + Charcoal/Taupe",
  "item_count": 2,
  "item_1": "IMG_2662 — light beige/cream short-sleeve button-up shirt",
  "item_2": "IMG_2664 — charcoal taupe pleated trousers",
  "item_3": "",
  "why_it_works": "Soft neutral top with darker elegant trousers",
  "image_path": "outfits/outfit_01.png"
}
```

Key fields:
- `outfit_no` — unique identifier (1-60, with gaps; outfit 18 is excluded at load time)
- `item_count` — 2 or 3, determines piece-count filter behavior
- `item_1` / `item_2` / `item_3` — clothing item descriptions, `item_1` is always the shirt/top
- `image_path` — relative path to outfit composite image in `outfits/`

### `outfits/`

57 PNG images (`outfit_01.png` through `outfit_60.png`, excluding `outfit_18.png` and `outfit_51.png`). Each is a composite photo of the outfit pieces.

### localStorage Keys

| Key | Type | Purpose |
|---|---|---|
| `theme-override` | `"light"` or `"dark"` | Persists manual theme choice across sessions |
| `worn-history` | JSON array of `outfit_no` integers | Tracks last 5 worn outfits for exclusion from daily pick |

## Theme System

CSS custom properties on `[data-theme]` attribute:

| Property | Light | Dark |
|---|---|---|
| `--bg` | `#FAF8F5` | `#1A1512` |
| `--bg-card` | `#FFFFFF` | `#2D2520` |
| `--text` | `#2C2420` | `#F5F0E8` |
| `--text-sec` | `#8B7D6B` | `#D4C5A9` |
| `--accent` | `#C9A96E` | `#A69070` |
| `--border` | `#E8E0D8` | `#3D3530` |

Auto-switch: light between 6:00-18:00, dark otherwise. User override saved to localStorage and takes precedence.

## Key Algorithms

### Daily Outfit Selection (`getDailyHash` + `pickDailyOutfit`)

1. Build date string: `YYYY-M-D`
2. Compute hash via `(hash * 31 + charCode) >>> 0` for each character
3. Filter out worn outfits from candidate pool
4. Pick `hash % pool.length`

Deterministic per day — same outfit every reload within the same day. Worn outfits shift the pool.

### Shuffle (`shuffleOutfit`)

1. Filter by piece count (2-piece / 3-piece / all)
2. Exclude current outfit and worn history
3. Random pick from remaining pool via `Math.random()`
4. Falls back to all matching outfits if exclusion empties the pool

### Collection Grouping (`extractTopColor`)

Maps `item_1` descriptions to canonical color groups via a priority-ordered keyword lookup table (`COLOR_MAP`). Groups like "Taupe", "Cream", "Navy", "Black", etc.
