# Design Guidelines

## Visual Identity

**Aesthetic**: Old-money, understated elegance. Clean lines, muted earth tones, generous whitespace.

**Typography**:
- Headings, labels, buttons: **Cormorant Garamond** (serif) — evokes classic editorial style
- Body text: System font stack for crisp readability

## Color System

All colors defined as CSS custom properties, switched via `data-theme` attribute.

### Light Theme (6am-6pm)
- Background: warm off-white (`#FAF8F5`)
- Cards: pure white (`#FFFFFF`)
- Primary text: deep brown (`#2C2420`)
- Secondary text: muted taupe (`#8B7D6B`)
- Accent: warm gold (`#C9A96E`)
- Borders: soft warm gray (`#E8E0D8`)

### Dark Theme (6pm-6am)
- Background: deep espresso (`#1A1512`)
- Cards: warm dark brown (`#2D2520`)
- Primary text: warm off-white (`#F5F0E8`)
- Secondary text: soft gold-beige (`#D4C5A9`)
- Accent: muted bronze (`#A69070`)
- Borders: warm dark gray (`#3D3530`)

## Component Patterns

### Buttons
- **Pill-shaped** (`border-radius: 100px`)
- **Worn button**: dashed border when inactive, solid accent fill when active, scale animation on toggle
- **Shuffle buttons**: thin solid border, text-left aligned, full-width on mobile
- **Filter chips**: compact pills, accent-filled when active

### Cards
- Rounded corners (`12px`)
- Subtle shadow (`0 2px 12px`)
- Image contained within card with padding
- Info section below image: palette name (serif, accent color) + rationale (italic, secondary color)

### Animations
- `pop`: scales up to 1.15x then settles at 1.05x (wear toggle on)
- `unpop`: scales from 1.05x down to 0.92x then back to 1x (wear toggle off)
- All color/background transitions: 300ms ease

## Layout

- Max-width: `960px`, centered
- Padding: `2rem 1.5rem`
- Mobile-first: single column, controls below content
- Desktop (720px+): sidebar controls left, hero card right
- Grid: 1 column → 2 columns (640px+) → 3 columns (960px+)

## Spacing

- Section gaps: `2.5rem`
- Card grid gap: `1.25rem`
- Filter chip gap: `0.4rem`
- Header bottom border with `1.5rem` padding, `2.5rem` margin to content
