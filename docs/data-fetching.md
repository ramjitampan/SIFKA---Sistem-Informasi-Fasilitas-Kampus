# Data Fetching & State

## Overview
We use `TanStack Query` for server state and `Zustand` for local UI state.

## Patterns
- **Hooks:** Create custom hooks for all API calls (e.g., `useBuildings.js`).
- **Caching:** Configure unique query keys for every request to enable automatic cache invalidation and background refetching.
- **Global State:** Reserve `Zustand` for non-server state (e.g., user session, UI theme, sidebar toggle).
