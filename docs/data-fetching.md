# Data Fetching & State

## Overview

<details markdown="1">
<summary>Click to see details</summary>

We use `TanStack Query` for server state and `Zustand` for local UI state.

</details>

## Patterns

<details markdown="1">
<summary>Click to see details</summary>

- **Hooks:** Create custom hooks for all API calls (e.g., `useBuildings.js`).
- **Caching:** Configure unique query keys for every request to enable automatic cache invalidation and background refetching.
- **Global State:** Reserve `Zustand` for non-server state (e.g., user session, UI theme, sidebar toggle).

</details>

## Data Fetching Wrapper (`QueryStateHandler`)

<details markdown="1">
<summary>Click to see details</summary>

To ensure consistency across pages, use the `<QueryStateHandler />` wrapper for all data fetching:
- **Loading:** Automatically display a skeleton loader or a spinner.
- **Error:** Automatically display user-friendly error messages from the API.
- **Empty State:** Handle empty API responses (e.g., `[]` or `null`) using a consistent `EmptyState` UI component.

</details>

## Mutation & Interaction Feedback

<details markdown="1">
<summary>Click to see details</summary>

- **Notifications:** Use `react-hot-toast` for feedback. Ensure the `<Toaster />` component is mounted at the app root.
- **Mutation Pattern:** Use `toast.promise()` for all `useMutation` hooks (submissions, deletions, updates) to standardize loading/success/error handlers.

</details>

