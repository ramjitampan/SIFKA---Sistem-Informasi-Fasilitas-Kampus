# Adaptive Layout

## Overview
The application utilizes a responsive main shell structure to ensure consistent navigation and content display across devices.

## Components
- **`Header`**: Provides branding and global controls (e.g., language switching).
- **`MainLayout`**: The wrapper component for pages that includes the header and responsive content container.

## Responsive Strategy
- Uses mobile-first Tailwind utility classes.
- Padding adapts based on screen size (`p-6` for mobile, `p-8` for tablets/desktops).
- Flexbox for column-based structural layout.
