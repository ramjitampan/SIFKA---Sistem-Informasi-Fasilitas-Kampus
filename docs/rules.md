# Frontend Development Rules

## 1. Code Standards
- **Language:** TypeScript for all new development.
- **Component Style:** Functional components with Hooks.
- **Naming Conventions:**
    - Components: PascalCase (e.g., `Header.jsx`, `UserCard.jsx`)
    - Hooks: camelCase starting with `use` (e.g., `useAuth.js`)
    - Files/Folders: kebab-case.
- **Imports:** Absolute imports (if supported by Vite config) or clean relative paths.

## 2. Component Design
- **Architecture:** Atomic Design principles (Atoms, Molecules, Organisms).
- **Styling:** Tailwind CSS 4 only. Use utility classes; avoid inline styles unless strictly necessary for dynamic values (e.g., `style={{ ... }}`).
- **Accessibility:** Use Radix UI primitives as the base for all complex components to ensure keyboard navigation and screen reader support.

## 3. State Management
- **Zustand:** Use for global state. Keep stores focused and modular (e.g., `useThemeStore`, `useAuthStore`).
- **Props:** Prefer props over global state where component reuse is prioritized.

## 4. Internationalization
- **Translation:** All user-facing strings must be defined in `FE_SIFKA/src/locales/{lang}.json`. Do not hardcode strings.
- **Keys:** Use flat, hierarchical keys (e.g., `header.nav.home`, `auth.login.submit`).

## 5. Theming & Motion
- **Theme:** Respect system theme by default, providing a manual toggle. Use CSS variables for colors where possible.
- **Animation:** Use `framer-motion` for transitions. Avoid complex CSS animations when `framer-motion` can handle them more elegantly.

## 6. Documentation
- All new features or components MUST have associated documentation in `FE_SIFKA/docs/`.
