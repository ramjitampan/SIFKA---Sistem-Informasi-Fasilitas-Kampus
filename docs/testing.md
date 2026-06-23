# Testing Strategy

## Overview

<details markdown="1">
<summary>Click to see details</summary>

We use Vitest and React Testing Library (RTL).

</details>

## Guidelines

<details markdown="1">
<summary>Click to see details</summary>

- **Unit Tests:** Business logic, utility functions, and stores.
- **Component Tests:** Focused on user interactions (buttons, forms) using RTL.
- **E2E Tests:** Critical paths (auth, reporting flows) should be covered by E2E tests (e.g., Playwright).

</details>

## Running Tests

<details markdown="1">
<summary>Click to see details</summary>

- `npm test`: Run unit/component tests in watch mode.
- `npm run test:run`: Run tests once (useful for CI).
- `npm run test:ui`: Start Vitest UI mode.

</details>

