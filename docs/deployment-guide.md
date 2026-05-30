# Deployment Guide

## Prerequisites

- Any HTTP server (Python, Node.js, PHP, or static hosting service)
- No build step required — deploy files as-is

## Local Development

The app uses `fetch()` to load JSON data, so it must be served over HTTP (not `file://`).

### Python 3 (recommended)
```bash
cd /path/to/daily_outfit
python3 -m http.server 8080
```

### Python 2
```bash
cd /path/to/daily_outfit
python -m SimpleHTTPServer 8080
```

### Node.js (npx, no install)
```bash
cd /path/to/daily_outfit
npx serve -p 8080
```

### PHP
```bash
cd /path/to/daily_outfit
php -S localhost:8080
```

Then open `http://localhost:8080`.

## GitHub Pages

1. Push the repository to GitHub
2. Go to **Settings > Pages**
3. Set source branch (e.g., `main`) and root directory (`/`)
4. Site will be live at `https://<username>.github.io/<repo-name>/`

No GitHub Actions workflow needed — GitHub Pages serves static files directly.

## Other Static Hosts

Works on any static file host without configuration:

- **Netlify**: drag-and-drop the project folder, or connect the GitHub repo
- **Vercel**: import the repo, no framework preset needed
- **Cloudflare Pages**: connect GitHub repo, no build command, output directory `/`
- **Surge**: `npx surge /path/to/daily_outfit`

## File Structure Required for Deployment

```
daily_outfit/
  index.html                       # Entry point
  collection.html                  # Collection page
  app.js                           # Daily page logic
  collection.js                    # Collection page logic
  styles.css                       # Shared styles
  all_40_outfit_suggestions.json   # Outfit data (57 entries)
  outfits/                         # 57 PNG images
    outfit_01.png
    ...
    outfit_60.png
```

All paths are relative — no absolute URLs, no environment variables, no config files.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Blank page, console shows CORS error | Opened `index.html` as `file://` | Serve via HTTP server |
| Missing outfit images | Image file not in `outfits/` | Verify all PNGs present; `onerror` handler hides broken images gracefully |
| Wrong theme on load | Stale `theme-override` in localStorage | Clear localStorage or let auto-theme take over |
| Same outfit every day | Working as intended | Daily pick is deterministic per date; use shuffle for alternatives |
