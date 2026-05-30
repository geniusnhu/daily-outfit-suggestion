# Code Standards

## Language & Compatibility

- **HTML5** — semantic markup, `data-*` attributes for state
- **Vanilla JavaScript** (ES5-compatible) — no transpiler, no modules, no `let`/`const`/arrow functions
- **CSS3** — custom properties (CSS variables) for theming, `@media` for responsive breakpoints
- All JS wrapped in IIFEs to avoid global scope pollution

## File Naming

- Kebab-case for all files: `collection.js`, `styles.css`, `all_40_outfit_suggestions.json`
- Outfit images: `outfit_XX.png` (zero-padded two digits)

## CSS Conventions

- **BEM naming** for component classes: `.outfit-card__image-wrap`, `.filter-chip--active`
- **CSS custom properties** for all theme-dependent colors — no hardcoded color values in component styles
- `box-sizing: border-box` applied globally
- Transitions on `background-color`, `color`, `border-color` for smooth theme switching

## JavaScript Conventions

- IIFE pattern: `(function () { ... })();`
- `var` declarations only (ES5 compat)
- DOM helper: `var $ = function (id) { return document.getElementById(id); };`
- Event binding on `DOMContentLoaded`
- Data loaded via `fetch()` — requires HTTP server, no direct file:// access
- `onerror` handlers on images for graceful degradation

## Responsive Breakpoints

| Breakpoint | Layout Change |
|---|---|
| < 640px | Single-column grid, controls below hero |
| 640px+ | 2-column outfit grid |
| 720px+ | Side-by-side hero layout (controls left, card right) |
| 960px+ | 3-column outfit grid, larger header |

## Typography

- **Headings & UI chrome**: Cormorant Garamond (Google Fonts, weights 400/500/600)
- **Body text**: System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)

## Design Language

Old-money aesthetic: muted earth tones, serif headings, generous whitespace, subtle shadows, pill-shaped buttons with thin borders.
