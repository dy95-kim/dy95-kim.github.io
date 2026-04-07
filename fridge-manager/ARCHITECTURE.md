# Fridge Manager Architecture

## Overview
- Single-page React + TypeScript application built with Vite.
- Styling is handled with Tailwind CSS and a small global stylesheet in `src/index.css`.
- All persistent data lives in `localStorage`; there is no backend, routing layer, or external API.
- The Vite `base` option is set to `./` so the generated app can be deployed to GitHub Pages without route rewrites.
- Deployment is automated through a root GitHub Actions workflow that builds `fridge-manager` and publishes `fridge-manager/dist` to GitHub Pages.

## Structure
- `src/App.tsx`: Composes the dashboard shell, search/sort controls, fridge/freezer sections, and the add/edit modal.
- `src/components/`: Small presentational components for toolbar, modal form, error banner, section panels, and food cards.
- `src/hooks/useFoodItems.ts`: Owns application state hydration, persistence, save error handling, and CRUD actions.
- `src/lib/date.ts`: Date formatting and date-only comparison helpers.
- `src/lib/food.ts`: Domain logic for filtering, sorting, remaining days, and status badges.
- `src/lib/storage.ts`: `localStorage` read/write utilities plus recovery for malformed persisted data.
- `src/types/food.ts`: Shared TypeScript types for food items, sort options, storage location, and form values.

## Data Flow
1. On first render, `useFoodItems` reads persisted items through `loadItemsWithMeta()`.
2. If storage is missing or malformed, the hook exposes a user-facing error banner and falls back to an empty list.
3. Search and sort controls are applied in `App.tsx` through `filterAndSortItems()`, then the results are split into fridge/freezer groups for display.
4. Add and edit actions share the same modal form component. The form returns normalized values, and the hook persists the updated list to `localStorage`.
5. Delete actions are confirmed in the UI and then persisted through the same hook.

## UI Behavior
- The main screen is responsive and keeps fridge/freezer sections side by side on large screens, stacked on smaller screens.
- The form auto-fills `createdAt` with the current date in `yyyy-mm-dd` format and allows users to adjust it.
- Card status presentation is derived from `expiresAt`:
  - `expired`: expiry date is before today.
  - `warning`: 0 to 3 days remaining.
  - `fresh`: more than 3 days remaining.
  - `no-expiry`: expiry date not provided.

## Testing
- Vitest is configured for core logic tests only.
- Current automated coverage focuses on:
  - date validation and day-difference helpers
  - status, search, and sorting behavior
  - `localStorage` save/load and malformed data recovery
