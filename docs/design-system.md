Here is your fully updated, comprehensive Design System. I have merged your layout, typography, and spacing with our refined, production-ready theme-aware colors to give you a clean, cohesive blueprint.

---

# Design System

## 1. Typography

<details markdown="1">
<summary>Click to see details</summary>

* **Font Family:** Inter (Primary sans-serif)
* **Scale:**
* **Small:** `0.875rem` (14px) | Captions, metadata, helper text
* **Base:** `1rem` (16px) | Body copy, form inputs, button text
* **Large:** `1.125rem` (18px) | Subheadings, card titles, intro text
* **Heading:** `1.5rem` to `3rem` (24px–48px) | Page titles, hero sections



---

</details>

## 2. Colors (Theme-Aware)

<details markdown="1">
<summary>Click to see details</summary>

### Base Setup

* **Primary / Accent Scale:** Indigo (Brand actions, links, primary buttons)
* **Neutral Scale:** Slate (App structure, canvas, text colors)

### Core Tokens

| Token | Light Mode | Dark Mode | Application |
| --- | --- | --- | --- |
| **Background** | `#ffffff` | `#0f172a` (Slate 900) | Main app canvas / background |
| **Surface** | `#f1f5f9` (Slate 100) | `#1e293b` (Slate 800) | Cards, sidebars, modals, form inputs |
| **Text Primary** | `#0f172a` (Slate 900) | `#f8fafc` (Slate 50) | High-contrast body text and headings |
| **Text Secondary** | `#475569` (Slate 600) | `#94a3b8` (Slate 400) | Subtitles, captions, placeholder text |
| **Primary (Brand)** | `#4f46e5` (Indigo 600) | `#6366f1` (Indigo 500) | Interactive elements, primary buttons |
| **Primary Hover** | `#4338ca` (Indigo 700) | `#4f46e5` (Indigo 600) | Button hover/focus states |
| **Border** | `#e2e8f0` (Slate 200) | `#334155` (Slate 700) | Subtle lines, form outlines, dividers |

### Semantic / Status Tokens

* **Success:** `#10b981` (Emerald 500) | Confirmed actions, success alerts
* **Warning:** `#f59e0b` (Amber 500) | Pending states, warnings
* **Error:** `#ef4444` (Red 500) | Destructive actions, error states

---

</details>

## 3. Spacing & Layout

<details markdown="1">
<summary>Click to see details</summary>

Built on a standardized **4px grid** to ensure strict mathematical spacing across the interface.

| Token | Value | Equivalent | Common Use Case |
| --- | --- | --- | --- |
| `space-1` | `4px` | `0.25rem` | Element padding adjustments, tight icon pairings |
| `space-2` | `8px` | `0.5rem` | Inline spacing between related elements (label to input) |
| `space-4` | `16px` | `1rem` | Standard container padding, gap between small elements |
| `space-6` | `24px` | `1.5rem` | Card layout padding, standard vertical grid rhythm |
| `space-8` | `32px` | `2rem` | Page section gaps, large outer margins |
| `space-12` | `48px` | `3rem` | Hero component padding, drastic section breaks |
| `space-16` | `64px` | `4rem` | Maximum wrapper spacing |

---

</details>

## 4. Components & Elevation

<details markdown="1">
<summary>Click to see details</summary>

### Shape (Border Radius)

* **Interactive Elements:** `rounded-lg` (`8px`) — Optimized for buttons, form inputs, and badges.
* **Containers:** `rounded-xl` (`12px`) — Optimized for cards, modals, and dropdown panels.

### Elevation (Shadows)

* **Light Mode:**
* Cards: `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)` (Soft, clean offset)
* Modals: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` (Deeper focus)


* **Dark Mode:**
* *Avoid heavy black shadows.* Instead, rely on **color-based elevation** by placing your `Surface` color (`#1e293b`) directly on top of your `Background` canvas (`#0f172a`). If depth is still required, use a very faint light border or a subtle dark shadow opacity: `rgb(0 0 0 / 0.5)`.

</details>

