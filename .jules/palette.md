## 2024-06-06 - Accessible Icon Buttons and Form Inputs

**Learning:** Icon-only buttons (like Edit, Delete, Favorite, Copy) rely solely on the `title` attribute, which is insufficient for screen readers and touch users. Form inputs like the Search bar lack proper label associations. Furthermore, buttons lack distinct visual indicators for keyboard navigation (`focus-visible`).

**Action:** Always add explicit `aria-label`s to icon-only buttons. Add `aria-hidden="true"` to SVG icons so screen readers don't attempt to announce them redundantly. Always include `aria-label` on form inputs that don't have a visible `<label>`. Enhance keyboard navigation by adding `focus-visible:ring-2 focus-visible:ring-red-500` to interactive elements.
