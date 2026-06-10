# Motion & Polish

## Overview
Animations are handled via `framer-motion` to provide a polished, responsive user experience.

## Animation Strategy
- **Page Transitions:** Used in `MainLayout` to create a subtle fade and slide-up effect on route changes.
- **Interactions:** Use `whileHover` and `whileTap` for buttons and interactive elements to provide immediate feedback.

## Guidelines
- **Duration:** Keep animations short (under 0.3s) for perceived performance.
- **Ease:** Use ease-out or ease-in-out curves for natural feel.
- **Accessibility:** Respect `prefers-reduced-motion` settings where appropriate.
