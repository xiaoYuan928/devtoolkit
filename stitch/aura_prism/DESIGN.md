# Design System Strategy: The Luminous Layer

## 1. Overview & Creative North Star
**Creative North Star: The Luminous Layer**
This design system moves away from the rigid, boxed-in layouts of traditional SaaS interfaces, instead embracing a "Luminous Layer" philosophy. The UI is treated as a series of physical, translucent objects floating within a vibrant, fluid environment. By prioritizing refraction, soft light, and organic depth over hard lines and flat colors, we create an experience that feels alive and premium.

The system breaks the "template" look through intentional asymmetry. For instance, hero headers should use overlapping glass cards that break the container boundaries, while typography scales are used aggressively—pairing massive, airy display type with compact, highly-legible functional labels to create an editorial rhythm.

## 2. Colors & Textures
The palette is rooted in a high-energy transition between deep purples, electric pinks, and serene blues.

*   **The "No-Line" Rule:** To maintain the high-end editorial feel, designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through background shifts. For example, a `surface-container-low` card sitting on a `surface` background provides all the definition needed.
*   **Surface Hierarchy & Nesting:** Depth is created by stacking `surface-container` tiers (Lowest to Highest). An inner search bar within a card should use `surface-container-highest` to appear "recessed" or `surface-container-lowest` to appear "elevated" relative to the card’s base.
*   **The "Glass & Gradient" Rule:** The "soul" of this system lies in the background. Use a multi-colored fluid gradient (using `primary`, `secondary`, and `tertiary` tokens) as the foundation. Foreground cards must utilize Glassmorphism: `surface-container-lowest` at 60-80% opacity with a `backdrop-filter: blur(24px)`.
*   **Signature Textures:** Main CTAs and Hero accents should not be flat. Apply a linear gradient transitioning from `primary` (#6a37d4) to `primary_container` (#ae8dff) at a 135-degree angle to give elements a "lit from within" glow.

## 3. Typography
The typography system relies on the interplay between the geometric confidence of **Plus Jakarta Sans** and the functional warmth of **Manrope**.

*   **Display & Headlines (Plus Jakarta Sans):** Used for "moments of impact." These should have generous tracking (-0.02em) and be treated as a visual element. The `display-lg` (3.5rem) should be used sparingly to anchor major sections.
*   **Body & Labels (Manrope):** The workhorse of the system. `body-md` (0.875rem) is the standard for information density. 
*   **Editorial Contrast:** Create hierarchy by pairing a `headline-sm` title in `primary` color with a `label-md` uppercase subtitle in `on_surface_variant`. This creates a sophisticated, magazine-like structure.

## 4. Elevation & Depth
In this design system, shadows are light, and surfaces are layers of frosted glass.

*   **The Layering Principle:** Avoid "flat" layouts. If a piece of content is secondary, nest it. A `surface-container-low` section on a `surface` background creates a natural architectural "step" without needing a single pixel of stroke.
*   **Ambient Shadows:** When an element must float (like a Modal or a Hovering Card), use "Ambient Shadows." These must be extra-diffused. 
    *   *Specification:* `box-shadow: 0 20px 40px rgba(44, 47, 49, 0.06)`. 
    *   The shadow should never be pure black; it must be a tinted version of `on-surface` at a very low (4-8%) opacity.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in high-contrast modes), use a "Ghost Border." Apply the `outline_variant` token at 15% opacity. Never use 100% opaque, high-contrast borders.
*   **Refractive Depth:** Glass cards should have a subtle top-down inner highlight (1px white at 20% opacity) to simulate the edge of a glass pane catching the light.

## 5. Components

### Buttons
*   **Primary:** A gradient fill (from `primary` to `primary_container`). Roundedness: `full` or `xl`. Text is `on_primary`.
*   **Secondary:** Glassmorphic fill (`surface-container-lowest` at 40% opacity) with a `Ghost Border`.
*   **States:** On hover, the backdrop-blur should increase, and the shadow should expand by 4px with a slight lift (Y-axis -2px).

### Input Fields & Search
*   **Structure:** Use `surface-container-lowest` with a 40% opacity and a backdrop blur of 12px.
*   **Interaction:** On focus, the `Ghost Border` transitions to a 1px `primary` border with a soft `primary_dim` outer glow.
*   **Spacing:** Use `spacing-3` (1rem) for internal padding to maintain the "airy" feel.

### Cards & Lists
*   **The Divider Ban:** Vertical divider lines are strictly forbidden. Use `spacing-6` (2rem) of vertical white space or subtle background shifts between `surface-container` tiers to separate items.
*   **Icons:** Use vibrant, multi-colored icons that utilize the `primary`, `secondary`, and `tertiary` palettes. Place icons on a `surface-container-high` circular base for legibility.

### Tooltips
*   **Style:** Small-scale glassmorphism. `surface-container-highest` background at 90% opacity. `label-sm` typography.

### Selection Controls (Checkboxes/Radios)
*   **Style:** When active, these should "glow." Use `primary` for the fill and a small ambient shadow of the same color to make them feel like active light sources.

## 6. Do's and Don'ts

### Do:
*   **DO** use whitespace as a structural tool. Let the background gradients "breathe" through the gaps between cards.
*   **DO** overlap elements. Having a glass card partially cover a gradient blur adds immense depth.
*   **DO** use the `roundedness-xl` (1.5rem) for main cards to emphasize the modern, energetic vibe.

### Don't:
*   **DON'T** use solid `#000000` for shadows. It "muddies" the vibrant background.
*   **DON'T** use 1px solid borders to define the edges of the screen or major sections.
*   **DON'T** stack more than three layers of glass; it kills the "Luminous" effect and reduces legibility.
*   **DON'T** use standard grey icons. Every icon should feel like a custom piece of the brand’s energetic personality.