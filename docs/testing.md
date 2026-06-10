# Testing Strategy

## Overview
We use Vitest and React Testing Library (RTL).

## Guidelines
- **Unit Tests:** Business logic, utility functions, and stores.
- **Component Tests:** Focused on user interactions (buttons, forms) using RTL.
- **E2E Tests:** Critical paths (auth, reporting flows) should be covered by E2E tests (e.g., Playwright).

## Running Tests
- `npm test`: Run unit/component tests in watch mode.
- `npm run test:run`: Run tests once (useful for CI).
- `npm run test:ui`: Start Vitest UI mode.
