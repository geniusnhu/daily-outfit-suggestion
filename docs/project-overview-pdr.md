# Project Overview — Daily Outfit

## Summary

Daily Outfit is a static, client-side web application that serves curated outfit suggestions. It presents one outfit per day from a collection of 57 combinations, supports shuffle/filter, tracks recently worn outfits via localStorage, and ships with an automatic light/dark theme.

## Problem Statement

Deciding what to wear daily is a low-stakes but high-frequency decision. This app eliminates that friction by surfacing a deterministic daily pick from a pre-curated wardrobe, with the ability to shuffle and track wear history.

## Target Users

Single user — the wardrobe owner. No accounts, no backend, no multi-user state.

## Core Requirements

| Requirement | Status |
|---|---|
| Deterministic daily outfit pick based on date | Done |
| Shuffle within 2-piece, 3-piece, or all outfits | Done |
| "Wear Today" toggle with 5-item history exclusion | Done |
| Collection browser grouped by shirt color | Done |
| Filter collection by piece count (2/3) | Done |
| Auto light/dark theme (6am-6pm) with manual toggle | Done |
| No build step, no dependencies, static hosting | Done |

## Non-Goals

- User authentication or multi-user support
- Backend / database / API
- Build tooling (bundler, transpiler, framework)
- Outfit creation or editing within the app
