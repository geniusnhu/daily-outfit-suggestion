# Codebase Summary

## File Inventory

| File | Lines | Purpose |
|---|---|---|
| `index.html` | 65 | Daily suggestion page — hero card, shuffle buttons, worn toggle |
| `collection.html` | 43 | Collection browser — filter bar, grouped outfit grid |
| `app.js` | 141 | Daily page logic — theme, daily pick algorithm, shuffle, worn tracking |
| `collection.js` | 123 | Collection page logic — color grouping, piece-count filtering, card rendering |
| `styles.css` | 202 | Shared styles — theme variables, layout, responsive breakpoints, animations |
| `all_40_outfit_suggestions.json` | 743 | Outfit data — 57 entries with palette, items, rationale, image paths |
| `outfits/` | 57 files | PNG composite images of outfit combinations |

## Module Breakdown

### `app.js` (141 lines)

| Function | Lines | Responsibility |
|---|---|---|
| `getAutoTheme()` | 9-12 | Returns `"light"` or `"dark"` based on hour |
| `applyTheme(theme)` | 14-17 | Sets `data-theme` attribute and updates icon |
| `initTheme()` | 19-27 | Reads localStorage override, binds toggle button |
| `getWornHistory()` | 29-32 | Parses worn history from localStorage |
| `saveWornHistory(history)` | 34-36 | Saves last 5 worn outfit numbers |
| `isWorn(outfitNo)` | 38-40 | Checks if outfit is in worn history |
| `updateWornButton()` | 42-49 | Syncs button text/state with current outfit's worn status |
| `toggleWorn()` | 51-68 | Adds/removes current outfit from worn history, triggers animation |
| `getDailyHash()` | 70-76 | Deterministic hash from current date |
| `pickDailyOutfit()` | 78-87 | Selects daily outfit index from unworn pool |
| `renderHero(index)` | 89-99 | Updates hero card DOM with outfit data |
| `matchesCountFilter()` | 101-104 | Checks if outfit matches piece-count filter |
| `shuffleOutfit(countFilter)` | 106-124 | Random outfit from filtered, unworn pool |

### `collection.js` (123 lines)

| Function | Lines | Responsibility |
|---|---|---|
| `COLOR_MAP` | 7-17 | Keyword-to-group mapping for shirt colors |
| `getAutoTheme()` / `applyTheme()` / `initTheme()` | 19-37 | Theme logic (duplicated from app.js) |
| `extractTopColor(item1)` | 39-44 | Extracts canonical color group from item_1 description |
| `groupByTopColor(list)` | 46-55 | Groups outfits by extracted color, preserves insertion order |
| `createCard(o)` | 57-71 | Creates outfit card DOM element |
| `renderGrouped(list)` | 73-90 | Renders grouped sections with headers and grids |
| `applyFilters()` | 92-98 | Filters by active piece count then re-renders |
| `initCountFilters()` | 100-111 | Binds filter chip click handlers |

### `styles.css` (202 lines)

| Section | Lines | Content |
|---|---|---|
| Reset & theme variables | 1-12 | Box-sizing, light/dark custom properties |
| Body & header | 16-38 | Max-width container, header layout |
| Cards & hero | 46-97 | Outfit card styles, hero layout, image constraints |
| Buttons & interactions | 99-124 | Worn button states, shuffle buttons, pop/unpop animations |
| Collection-specific | 139-173 | Filter bar, color group headers, outfit grid |
| Footer | 176-179 | Centered, muted footer |
| Responsive | 181-201 | Grid column and layout breakpoints |

## Shared State

Theme logic (`getAutoTheme`, `applyTheme`, `initTheme`) is duplicated between `app.js` and `collection.js`. Both files independently read from `localStorage` and bind to `#theme-toggle`.

## Data Flow

```
JSON file ──fetch()──> Array in memory ──filter(exclude #18)──> Working set
                                                                    │
                     ┌──────────────────────────────────────────────┘
                     │
              app.js: pickDailyOutfit() or shuffleOutfit() ──> renderHero()
              collection.js: applyFilters() ──> groupByTopColor() ──> renderGrouped()
```

## External Dependencies

- **Google Fonts**: Cormorant Garamond (loaded via `<link>` tag, non-blocking with `display=swap`)
- No npm packages, no build tools, no runtime dependencies
