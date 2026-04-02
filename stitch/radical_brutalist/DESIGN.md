# Design System Strategy: High-End Editorial Brutalism

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Manifesto."** 

This is not a template; it is a declaration. We are moving away from the "safe," centered, and sanitized layouts of the modern web toward something raw, impactful, and high-contrast. This system draws inspiration from avant-garde editorial design and early digital brutalism, where information isn't just displayed—it’s staged. 

By utilizing **intentional asymmetry**, **extreme typographic scales**, and a **zero-radius architecture** (0px corners), we create a space that feels engineered yet rebellious. The layout should feel like a physical broadsheet poster where elements might bleed off the edge or overlap, breaking the "standard margin" to demand attention. We prioritize the "Raw" over the "Refined," using stark black, pure white, and high-octane neon green to drive a non-conformist user experience.

---

## 2. Colors
Our color palette is built on high-tension contrast. We utilize a deep-space black and pure white foundation, punctuated by a "Glitch Green" secondary accent.

*   **Primary (`#ffffff`) & Background (`#131313`):** This is our binary foundation. Use `on_background` white text on `surface` black for maximum legibility and impact.
*   **Secondary (`#00e639`):** Reserved for "kinetic" elements—active states, primary CTAs, or critical path markers. It should feel like a laser cutting through the dark.
*   **Tertiary (`#ffdadb` / `#be003d`):** Use sparingly for warnings or "destructive" high-energy alerts.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. In this system, boundaries are created by the collision of masses. Use background shifts (e.g., a `surface_container_low` section sitting against a `surface` background) to define space. If you feel the need to draw a line, use a margin instead.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of industrial metal.
*   **Base:** `surface_dim` (#131313).
*   **Elevated Containers:** Use `surface_container` (#1f1f1f) for standard cards and `surface_container_highest` (#353535) for interactive elements like input fields.
*   **Nesting:** To create depth without shadows, place a `surface_container_lowest` (#0e0e0e) element inside a `surface_container_high` (#2a2a2a) block. The "sunken" look provides focus without adding visual clutter.

### Signature Textures
While the system is brutalist, we avoid "flatness" through:
*   **Subtle Gradients:** Apply a linear gradient from `primary` (#ffffff) to `primary_container` (#d4d4d4) on large display type to give it a metallic, polished feel.
*   **Glassmorphism:** For floating navigation or modal overlays, use `surface` at 70% opacity with a `20px` backdrop-blur. This keeps the edgy, non-conformist vibe while adding a layer of high-end digital sophistication.

---

## 3. Typography
Typography is the lead protagonist. We use **Space Grotesk** for structural impact and **Work Sans** for utilitarian clarity.

*   **Display Large (3.5rem):** This is your "Manifesto" type. Use it for hero statements. **Rule:** These headings should intentionally break standard grid margins, often bleeding into the left or right gutters.
*   **Headline Scale:** Bold and uncompromising. Headlines should be typeset with tight letter-spacing (-0.02em) to feel dense and authoritative.
*   **Body Scale:** **Work Sans** provides a high-readability counterbalance to the aggressive headlines. Keep body copy monochromatic (`on_surface_variant`).
*   **Label Scale:** Monospace-adjacent. Use `label-md` in all-caps for metadata or "tech-spec" style tags.

---

## 4. Elevation & Depth
In a non-conformist system, we reject the "soft" shadows of consumer apps. 

*   **The Layering Principle:** Depth is achieved through **Tonal Layering**. Use the `surface_container` tiers to stack elements. An "active" card should move from `surface_container` to `surface_bright` on hover, creating a "glow" rather than a lift.
*   **Ambient Shadows:** If a floating element (like a custom context menu) requires a shadow, it must be massive and faint. Use a 48px blur at 6% opacity using a tinted color derived from `secondary` (#00e639) to create a radioactive "aura" rather than a traditional drop shadow.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke, use `outline_variant` at **15% opacity**. It should be felt, not seen.
*   **Brutalist Icons:** Icons must be custom-drawn, featuring jagged edges, variable stroke weights, or "hand-drawn" imperfections to contrast with the sharp 0px corners of the containers.

---

## 5. Components

*   **Buttons:** 
    *   **Primary:** Solid `secondary` (#00e639) with `on_secondary` (#002203) text. 0px corner radius.
    *   **Secondary:** Ghost style. `outline` stroke at 100% opacity, but only on the bottom and right sides to create a "faux-3D" brutalist shadow effect.
*   **Input Fields:** Use `surface_container_highest` (#353535) with a bottom-only border of `primary`. No rounded corners. Focus state should trigger a `secondary` (#00e639) glow.
*   **Cards:** Forbid divider lines. Separate content using `spacing-8` (2.75rem) vertical gaps. Card headers should use `display-sm` type that overlaps the card's edge.
*   **Chips:** Minimalist rectangles. Use `surface_container_low` with `label-sm` text. Active chips should flip to `primary` background with `on_primary` text.
*   **Kinetic Scroller (Additional Component):** A horizontal marquee for "Breaking News" or status updates, using `label-md` typography to reinforce the edgy, editorial vibe.

---

## 6. Do's and Don'ts

### Do:
*   **Do** lean into asymmetry. If a grid has three columns, make one 50% width and the others 25%.
*   **Do** overlap elements. Let a headline sit 20px over an image or a card.
*   **Do** use extreme white space. Use `spacing-24` (8.5rem) to separate major thematic shifts.
*   **Do** respect the 0px radius. Any curve in this system is a bug.

### Don't:
*   **Don't** use standard "Material Design" shadows. They feel too "off-the-shelf."
*   **Don't** use 1px dividers. If the hierarchy is unclear, use a tonal background shift.
*   **Don't** center everything. Use left-aligned or even right-aligned "staggered" typography to keep the eye moving.
*   **Don't** use "soft" colors. Stick to the high-contrast tokens provided; pastels have no place in a manifesto.