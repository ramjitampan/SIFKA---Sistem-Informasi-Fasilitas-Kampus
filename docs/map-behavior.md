# Map Behavior and Layering

## Overview

<details markdown="1">
<summary>Click to see details</summary>

To ensure a consistent user experience, the Interactive Map component must respect the global application layering and layout rules.

</details>

## Layering Rules (Z-Index Strategy)

<details markdown="1">
<summary>Click to see details</summary>

Maps often contain high-z-index controls or popups that can break application-wide modal or header rendering.

1. **Base Layer:** The map container should exist within the main content area of the `MainLayout`.
2. **Overlay Prevention:**
    - The map **must not** overlap with the `MainLayout` header or the navigation sidebar.
    - Map popups and markers should be rendered using standard relative positioning where possible.
    - Use `z-index` values sparingly:
        - Map UI Controls: `z-10` to `z-20`.
        - Map Markers/Popups: `z-30`.
        - Global Modals/Header: `z-50` and above.
3. **Responsive Behavior:** On mobile devices, the map should transition to a simplified view or utilize a full-screen mode that does not impede navigation.

</details>

## Component Integration

<details markdown="1">
<summary>Click to see details</summary>

When integrating the map component (`MapView.tsx` or similar), wrap it in a container that constraints its height and ensures it does not expand beyond the parent container boundaries.

</details>

