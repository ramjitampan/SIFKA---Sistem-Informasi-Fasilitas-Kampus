# Component System Documentation

## Overview

<details markdown="1">
<summary>Click to see details</summary>

Components are built using atomic design principles, leveraging Radix UI for accessibility and Tailwind CSS 4 for styling.

</details>

## Core Components

<details markdown="1">
<summary>Click to see details</summary>

- **Button:**
    - Variants: `primary`, `secondary`, `outline`, `ghost`, `destructive`
    - Sizes: `sm`, `md`, `lg`
    - **Loading State:** Must implement a `loading` prop that disables the button and displays a spinner.
- **Input:**
    - Variants: `default`, `error`, `disabled`
- **Card:**
    - Container for grouped content.
- **Modal:**
    - Built on `Radix UI Dialog`.
- **EmptyState:**
    - A flexible, reusable component accepting `icon`, `title`, and `description` props.

</details>

## Guidelines

<details markdown="1">
<summary>Click to see details</summary>

- **Props:** Use TypeScript interfaces for all components.
- **Naming:** Follow `PascalCase`.
- **Accessibility:** Ensure all components support keyboard navigation.
- **Composition:** Compose complex components from smaller atomic components.

</details>

