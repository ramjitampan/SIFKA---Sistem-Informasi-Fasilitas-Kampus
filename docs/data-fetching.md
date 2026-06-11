# Data Fetching & State

## Overview
We use `TanStack Query` for server state and `Zustand` for local UI state.

## Patterns
- **Hooks:** Create custom hooks for all API calls (e.g., `useBuildings.js`).
- **Caching:** Configure unique query keys for every request to enable automatic cache invalidation and background refetching.
- **Global State:** Reserve `Zustand` for non-server state (e.g., user session, UI theme, sidebar toggle).

## Admin Resource Display Pattern
When creating pages for administrative data (e.g., user/facility/report lists):

1.  **Data Fetching:** Use a custom hook (`use{Resource}s`) that returns `data`, `isLoading`, and `error`.
2.  **Layout:** Implement a standard `ListContainer` organisms component that handles the base padding and heading.
3.  **Table/Grid:** Use a shared table component to maintain consistent styling across all admin views.
4.  **Actions:** Include standard CRUD action buttons in the last column (`edit`, `delete` with confirmation).
5.  **State Synchronization:** After any mutation (create/update/delete), use `queryClient.invalidateQueries` to ensure the list reflects the latest data immediately.

*Example reference: Observe `FE_SIFKA/src/pages/Users.tsx` for the canonical implementation of the admin data management pattern.*
