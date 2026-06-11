# Digital Verdance — Design System

> A design system built on the intersection of technical precision and organic energy.  
> Deep forest darkness. Piercing bioluminescent green. Zero compromise.

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color Tokens](#2-color-tokens)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Elevation & Depth](#5-elevation--depth)
6. [Shape Language](#6-shape-language)
7. [Component Specs](#7-component-specs)
8. [Motion](#8-motion)
9. [Usage Rules](#9-usage-rules)

---

## 1. Brand Identity

### Personality

**Digital Verdance** merges raw computational precision with the latent energy of nature. The aesthetic is authoritative, focused, and unapologetically technical — built for developer-centric platforms, data visualization tools, and high-stakes interfaces where clarity is non-negotiable.

| Axis       | Direction             |
|------------|-----------------------|
| Density    | High-information      |
| Tone       | Authoritative, sharp  |
| Energy     | Focused, urgent       |
| Feel       | Digital × Organic     |

### The Core Visual Hook

The contrast between **rigid, zero-radius geometry** and the **organic, pulsing green accent** is the identity. The geometry implies mathematical precision; the green implies life, growth, and signal. Neither works without the other. Do not soften either pole.

---

## 2. Color Tokens

### Design Principle

The palette is anchored by a single vivid accent — **Verdance Green** — used exclusively to communicate action, progress, and critical state. Everything else is muted, dark, and layered to let that signal breathe.

---

### 2.1 Primitive Palette (Reference Only)

These are raw hex values. **Use semantic tokens in production**, not these directly.

| Name              | Hex       | Usage hint                    |
|-------------------|-----------|-------------------------------|
| Verdance-400      | `#6bfb9a` | Brightest green — sparingly   |
| Verdance-300      | `#4de082` | Primary interactive            |
| Verdance-200      | `#4ade80` | Container / filled state       |
| Forest-950        | `#09100a` | Lowest surface                 |
| Forest-900        | `#0e150f` | Base background                |
| Forest-800        | `#161d17` | Container low                  |
| Forest-750        | `#1a211b` | Container default              |
| Forest-700        | `#242c25` | Container high                 |
| Forest-600        | `#2f372f` | Container highest / variant    |
| Forest-500        | `#333b34` | Surface bright                 |
| Moss-400          | `#3d4a3e` | Outline variant                |
| Moss-300          | `#869486` | Outline default                |
| Cream-100         | `#dde5da` | On-surface text                |
| Cream-200         | `#bccabb` | On-surface variant text        |
| Amber-300         | `#ffd9c1` | Tertiary                       |
| Amber-200         | `#ffb47f` | Tertiary container             |
| Sand-300          | `#d4c3b9` | Secondary                      |
| Error-400         | `#ffb4ab` | Error text                     |
| Error-700         | `#93000a` | Error container                |

---

### 2.2 Semantic Color Tokens

```
theme: digital-verdance
```

#### Surface

| Token                        | Value     | Role                              |
|------------------------------|-----------|-----------------------------------|
| `surface`                    | `#0e150f` | Page background                   |
| `surface-dim`                | `#0e150f` | Dimmed overlay background         |
| `surface-bright`             | `#333b34` | Highlighted surface region        |
| `surface-container-lowest`   | `#09100a` | Deepest nested container          |
| `surface-container-low`      | `#161d17` | Low-emphasis container            |
| `surface-container`          | `#1a211b` | Default container                 |
| `surface-container-high`     | `#242c25` | High-emphasis container           |
| `surface-container-highest`  | `#2f372f` | Topmost container layer           |
| `surface-variant`            | `#2f372f` | Alternative surface               |
| `surface-tint`               | `#4de082` | Tint color for elevated surfaces  |
| `background`                 | `#0e150f` | Root background (same as surface) |

#### On-Surface (Text & Icons)

| Token                   | Value     | Role                            |
|-------------------------|-----------|---------------------------------|
| `on-surface`            | `#dde5da` | Primary text on any surface     |
| `on-surface-variant`    | `#bccabb` | Secondary/muted text            |
| `on-background`         | `#dde5da` | Text on root background         |
| `inverse-surface`       | `#dde5da` | Surface in inverse contexts     |
| `inverse-on-surface`    | `#2b322b` | Text on inverse surface         |

#### Outline

| Token               | Value     | Role                         |
|---------------------|-----------|------------------------------|
| `outline`           | `#869486` | Default border / divider     |
| `outline-variant`   | `#3d4a3e` | Subtle border / inactive     |

#### Primary (Verdance Green)

| Token                    | Value     | Role                                    |
|--------------------------|-----------|-----------------------------------------|
| `primary`                | `#6bfb9a` | Highest-signal green; links, active     |
| `on-primary`             | `#003919` | Text/icon on primary background         |
| `primary-container`      | `#4ade80` | Filled button / chip / toggle bg        |
| `on-primary-container`   | `#005e2d` | Text/icon on primary-container          |
| `inverse-primary`        | `#006d36` | Primary on light inverse surfaces       |
| `primary-fixed`          | `#6dfe9c` | Fixed primary (no state change)         |
| `primary-fixed-dim`      | `#4de082` | Dimmed fixed primary                    |
| `on-primary-fixed`       | `#00210c` | Text on primary-fixed                   |
| `on-primary-fixed-variant` | `#005227` | Muted text on primary-fixed            |

#### Secondary (Warm Sand)

| Token                      | Value     | Role                          |
|----------------------------|-----------|-------------------------------|
| `secondary`                | `#d4c3b9` | Secondary text / labels       |
| `on-secondary`             | `#382e27` | Text on secondary bg          |
| `secondary-container`      | `#50453d` | Secondary chip / tag bg       |
| `on-secondary-container`   | `#c2b2a8` | Text on secondary-container   |
| `secondary-fixed`          | `#f1dfd5` | Fixed secondary               |
| `secondary-fixed-dim`      | `#d4c3b9` | Dimmed fixed secondary        |
| `on-secondary-fixed`       | `#221a14` | Text on secondary-fixed       |
| `on-secondary-fixed-variant` | `#50453d` | Muted on secondary-fixed    |

#### Tertiary (Amber)

| Token                     | Value     | Role                         |
|---------------------------|-----------|------------------------------|
| `tertiary`                | `#ffd9c1` | Highlight / warm accent      |
| `on-tertiary`             | `#4f2500` | Text on tertiary             |
| `tertiary-container`      | `#ffb47f` | Tertiary chip / badge bg     |
| `on-tertiary-container`   | `#794418` | Text on tertiary-container   |
| `tertiary-fixed`          | `#ffdcc6` | Fixed tertiary               |
| `tertiary-fixed-dim`      | `#ffb784` | Dimmed fixed tertiary        |
| `on-tertiary-fixed`       | `#301400` | Text on tertiary-fixed       |
| `on-tertiary-fixed-variant` | `#6c3a0f` | Muted on tertiary-fixed    |

#### Error

| Token                | Value     | Role                     |
|----------------------|-----------|--------------------------|
| `error`              | `#ffb4ab` | Error text / icon        |
| `on-error`           | `#690005` | Text on error background |
| `error-container`    | `#93000a` | Error chip / alert bg    |
| `on-error-container` | `#ffdad6` | Text on error-container  |

---

### 2.3 Color Usage Rules

- **Primary green is reserved for signal.** Never use it for decoration. Every green pixel should mean something: active, interactive, in-progress, or success.
- **Avoid gradients** except for very specific ambient/glow effects. Flat color maintains the brutalist precision.
- **Opacity-based colors** (`rgba` with alpha) are only acceptable for overlays, separators, and subtle glow effects. Do not create new palette entries this way.
- **Never use white** (`#ffffff`) for text. Use `on-surface` (`#dde5da`) instead.

---

## 3. Typography

### Design Principle

**Outfit** is the sole typeface across the entire system. Its geometric construction — open counters, consistent stroke weights, monolinear forms — reads cleanly against dark backgrounds and reinforces the sharp, systematic nature of the UI.

No secondary typeface. No serif. No mixing.

---

### 3.1 Type Scale

| Token                 | Family | Size   | Weight | Line Height | Letter Spacing | Usage                        |
|-----------------------|--------|--------|--------|-------------|----------------|------------------------------|
| `headline-xl`         | Outfit | 48px   | 700    | 1.1         | −0.02em        | Hero / page titles           |
| `headline-lg`         | Outfit | 32px   | 700    | 1.2         | −0.01em        | Section headings (desktop)   |
| `headline-lg-mobile`  | Outfit | 28px   | 700    | 1.2         | —              | Section headings (mobile)    |
| `headline-md`         | Outfit | 24px   | 600    | 1.3         | —              | Card titles / sub-headings   |
| `body-lg`             | Outfit | 18px   | 400    | 1.6         | —              | Lead paragraphs              |
| `body-md`             | Outfit | 16px   | 400    | 1.6         | —              | Default body text            |
| `label-md`            | Outfit | 14px   | 600    | 1.0         | +0.05em        | Buttons, tags, category keys |

---

### 3.2 Typography Rules

- **Headlines** use negative letter-spacing to increase perceived weight and brand impact.
- **Labels** (`label-md`) must always be rendered in **uppercase** with the specified letter-spacing. This creates a visual distinction between labels and running text — the systematic feel depends on it.
- **Never mix weights** within a single text block unless applying inline emphasis to a specific word.
- **Line lengths** should be kept to a maximum of **72 characters** for body text to preserve readability.

---

## 4. Spacing & Layout

### 4.1 Base Grid

All spacing derives from a **4px base unit**. Never use arbitrary values.

| Token             | Value  | Notes                            |
|-------------------|--------|----------------------------------|
| `spacing-base`    | 4px    | Atomic unit                      |
| `spacing-xs`      | 4px    | Icon padding, tight inlines      |
| `spacing-sm`      | 8px    | Internal component padding       |
| `spacing-md`      | 16px   | Standard padding, gap            |
| `spacing-lg`      | 24px   | Section internal spacing         |
| `spacing-xl`      | 48px   | Section-to-section gap           |
| `gutter`          | 20px   | Column gutter (grid)             |
| `margin-mobile`   | 16px   | Page edge margin on mobile       |
| `margin-desktop`  | 64px   | Page edge margin on desktop      |

---

### 4.2 Grid System

| Breakpoint | Columns | Gutter | Margin        |
|------------|---------|--------|---------------|
| Mobile     | 4       | 20px   | 16px          |
| Tablet     | 8       | 20px   | 32px          |
| Desktop    | 12      | 20px   | 64px          |

---

### 4.3 Layout Rules

- **Left-align by default.** Centered layouts are reserved for isolated hero sections only. Data, labels, and structured content must align to the left grid edge.
- **Strict grid adherence.** All component edges snap to column boundaries. No organic or free-floating elements.
- **Compact over spacious.** Prefer tighter vertical rhythm that conveys density and information-richness. Generous whitespace reads as consumer; this is professional and technical.

---

## 5. Elevation & Depth

### Design Principle

No drop shadows. Depth is created through **tonal layering** (darker = deeper) and **precise 1px borders**. This keeps the aesthetic hard-edged and computationally precise.

---

### 5.1 Elevation Levels

| Level | Surface Token              | Border                              | Usage                           |
|-------|----------------------------|-------------------------------------|---------------------------------|
| 0     | `background` (`#0e150f`)   | None                                | Root page background            |
| 1     | `surface-container`        | 1px solid `rgba(255,255,255,0.07)`  | Cards, panels, default sections |
| 2     | `surface-container-high`   | 1px solid `rgba(255,255,255,0.10)`  | Hover / active card states      |
| 3     | `surface-container-highest`| 1px solid `primary` (`#6bfb9a`)     | Modals, focused popovers        |

---

### 5.2 Separators

Use `1px solid rgba(255, 255, 255, 0.05)` for horizontal dividers. Never use `outline-variant` for separators — reserve that token for component borders.

---

## 6. Shape Language

### Design Principle

**Border radius: 0px across the entire system.** No exceptions.

This applies to: buttons, input fields, cards, chips, badges, modals, tooltips, dropdowns, dialogs, checkboxes, toggles, avatars, and images.

The absence of rounding is a deliberate statement. The contrast between the organic Verdance Green and the unyielding rectangular geometry is the core visual identity of this system. Introducing border-radius — even 2px — dissolves that tension. Do not do it.

---

## 7. Component Specs

### 7.1 Buttons

| Variant   | Background            | Border                  | Text                         | Text weight |
|-----------|-----------------------|-------------------------|------------------------------|-------------|
| Primary   | `primary-container`   | None                    | `on-primary-container`       | 700         |
| Secondary | Transparent           | 1px solid `primary`     | `primary`                    | 600         |
| Ghost     | Transparent           | None                    | `on-surface`                 | 400         |
| Danger    | `error-container`     | None                    | `on-error-container`         | 700         |

**States:**
- **Hover (Primary):** Brightness +10% on background, or add a 0 4px 12px `rgba(75, 222, 128, 0.25)` outer glow.
- **Focus:** 2px solid `primary` outline, offset 2px.
- **Disabled:** Opacity 0.38 on entire element. No interaction changes.
- **Active/Pressed:** Brightness −10%.

---

### 7.2 Input Fields

| State   | Background              | Border                         | Label color        |
|---------|-------------------------|--------------------------------|--------------------|
| Default | `surface-container`     | 1px solid `outline-variant`    | `on-surface-variant` |
| Hover   | `surface-container`     | 1px solid `outline`            | `on-surface-variant` |
| Focus   | `surface-container`     | 1px solid `primary`            | `primary`          |
| Error   | `surface-container`     | 1px solid `error`              | `error`            |
| Filled  | `surface-container`     | 1px solid `outline-variant`    | `primary` (shrunk) |

- Text color: `on-surface`
- Placeholder: `on-surface-variant` at 60% opacity
- Label transitions from inline to top-position on focus/fill (standard float label pattern)

---

### 7.3 Chips & Badges

**Status Chip:**
```
background: rgba(75, 222, 128, 0.12)
border: 1px solid primary (#6bfb9a)
text: primary (#6bfb9a)
padding: 4px 10px
font: label-md (uppercase, 0.05em tracking)
border-radius: 0px
```

**Secondary Chip:**
```
background: secondary-container (#50453d)
border: none
text: on-secondary-container (#c2b2a8)
```

**Error Badge:**
```
background: error-container (#93000a)
text: on-error-container (#ffdad6)
```

---

### 7.4 Cards

| State     | Background              | Border                              |
|-----------|-------------------------|-------------------------------------|
| Default   | `surface-container`     | 1px solid `rgba(255,255,255,0.05)`  |
| Hover     | `surface-container-high`| 1px solid `primary` (`#6bfb9a`)     |
| Active    | `surface-container-high`| 1px solid `primary`, inner 4px glow |
| Disabled  | `surface-container`     | 1px solid `outline-variant`        |

Hover border transition: `border-color 150ms ease-out`.

---

### 7.5 Selection Controls

**Checkboxes and Radio Buttons — both are square (0px radius).**

| State     | Background              | Border                     | Icon                |
|-----------|-------------------------|----------------------------|---------------------|
| Unchecked | `surface-container`     | 1px solid `outline`        | —                   |
| Checked   | `primary-container`     | 1px solid `primary-container` | Checkmark `on-primary-container` |
| Indeterminate | `primary-container` | 1px solid `primary-container` | Dash `on-primary-container` |
| Disabled  | `surface-container`     | 1px solid `outline-variant`| — (opacity 0.38)    |

Radio buttons deliberately stay square to maintain brutalist aesthetic consistency.

---

### 7.6 Navigation & Tabs

- Active tab: `primary` text + 2px bottom border `primary`
- Inactive tab: `on-surface-variant` text, no border
- Hover: `on-surface` text

---

### 7.7 Tooltips

```
background: surface-container-highest (#2f372f)
border: 1px solid outline-variant (#3d4a3e)
text: on-surface (#dde5da)
font: body-md, 14px
padding: 8px 12px
border-radius: 0px
max-width: 240px
```

---

## 8. Motion

### Design Principle

Motion is functional, not decorative. Every animation must either communicate a state transition or orient the user within a spatial change. Animations that exist only to feel "polished" are cut.

---

### 8.1 Duration Scale

| Token            | Value  | Usage                                     |
|------------------|--------|-------------------------------------------|
| `duration-xs`    | 75ms   | Micro feedback (button press, checkbox)   |
| `duration-sm`    | 150ms  | Border/color state transitions            |
| `duration-md`    | 250ms  | Panel slide-in, dropdown open             |
| `duration-lg`    | 400ms  | Modal enter, page section reveal          |

---

### 8.2 Easing

| Token           | Value                        | Usage                       |
|-----------------|------------------------------|-----------------------------|
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Most UI transitions         |
| `ease-enter`    | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the screen|
| `ease-exit`     | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving the screen |

---

### 8.3 Rules

- **Respect `prefers-reduced-motion`.** Wrap all animations in the appropriate media query. Transitions that convey state (color, opacity) may remain; positional/transform animations must be removed.
- **No looping ambient animations** on static content. Pulse/glow effects are reserved for real-time active indicators (live data, processing states).
- **Glow effect** (for primary interactive elements): `box-shadow: 0 0 0 0 rgba(75, 222, 128, 0.4)` expanding to `0 0 12px 4px rgba(75, 222, 128, 0)` over 600ms — for active/processing states only.

---

## 9. Usage Rules

### Do

- Use `primary` green to communicate **one thing at a time**. The moment it appears in two unrelated places simultaneously, it loses meaning.
- Keep all container borders at exactly **1px**. Never 2px unless signaling focus.
- Apply `label-md` with uppercase transform via CSS (`text-transform: uppercase`), not by writing text in caps in the source.
- Use `surface-container-lowest` for code blocks and deeply nested data structures to push them visually behind the content.

### Don't

- Don't use `primary` or `primary-container` as background for large surface areas. It's a signal color, not a background color.
- Don't introduce a second typeface. Outfit handles every role in this system.
- Don't add border-radius anywhere, ever. Not `2px`. Not `4px`. Not `9999px` for "pill" shapes.
- Don't create new color values outside of the token system. If you need a variation, derive it using opacity against an existing surface token.
- Don't use centered text alignment for data tables, code, or structured lists.
- Don't use shadows of any kind. If you need to imply depth, use a darker surface token.

---

*Digital Verdance Design System — maintained as a living document.*  
*When in doubt: darker surface, sharper edge, greener signal.*

