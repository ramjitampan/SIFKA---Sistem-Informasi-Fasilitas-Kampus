# Component System Documentation

## Overview
Components are built using atomic design principles, leveraging Radix UI for accessibility and Tailwind CSS 4 for styling.

## Core Components
- **Button:**
    - Variants: `primary`, `secondary`, `outline`, `ghost`, `destructive`
    - Sizes: `sm`, `md`, `lg`
- **Input:**
    - Variants: `default`, `error`, `disabled`
- **Card:**
    - Container for grouped content.
- **Modal:**
    - Built on `Radix UI Dialog`.

## Guidelines
- **Props:** Use TypeScript interfaces for all components.
- **Naming:** Follow `PascalCase`.
- **Accessibility:** Ensure all components support keyboard navigation.
- **Composition:** Compose complex components from smaller atomic components.
