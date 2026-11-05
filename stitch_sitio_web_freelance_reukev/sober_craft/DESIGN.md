---
name: Sober Craft
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#006c4e'
  on-secondary: '#ffffff'
  secondary-container: '#97f5cc'
  on-secondary-container: '#007353'
  tertiary: '#9b3e3b'
  on-tertiary: '#ffffff'
  tertiary-container: '#ba5551'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#97f5cc'
  secondary-fixed-dim: '#7bd8b1'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#00513a'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ae'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#7f2928'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.025em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system is tailored for an independent software developer delivering operational systems and digital tools to small-and-medium businesses (PYMEs). The aesthetic direction communicates technical reliability, institutional trust, pragmatic clarity, and approachability without unnecessary ornamentation or visual noise.

The design movement combines **Corporate Modernism** with an understated **Functional Minimalism**:
- **Clarity over visual excess**: Eliminates intense neon tones, decorative blurs, and loud gradients in favor of high-contrast readability and robust structural order.
- **Tone & Mood**: Professional, transparent, durable, and grounded. The interface feels like dependable business tooling built by an artisan who values execution quality and user efficiency.
- **Audience**: Business owners, managers, and administrative personnel seeking pragmatic, uncomplicated digital solutions that streamline everyday operations.

## Colors

The palette is engineered around clean slate neutrals and balanced emerald tones, maintaining strict WCAG AAA/AA readability standards:

- **Surface Primary (`#FFFFFF`)**: Base canvas for cards, core application views, and modal dialogs.
- **Surface Alternate / Section Tint (`#F8FAFC`)**: Applied to alternating rows, page bodies, background sections, and toolbars to introduce structural separation without harsh divisions.
- **Primary Emerald (`#059669`)**: Core interactive accent used for primary actions, progress indicators, active navigation states, and confirmation accents.
- **Primary Emerald Hover (`#047857`)**: Direct interaction state for primary elements, ensuring tactile feedback.
- **Text Primary (`#0F172A`)**: Slate 900 tone delivering deep contrast for headings and primary content.
- **Text Secondary (`#475569`)**: Slate 600 tone for supporting copy, secondary metadata, captions, and table headers.
- **Border Subtle (`#E2E8F0`)**: Slate 200 tone applied consistently to dividers, input strokes, and card containers.
- **Strict Guardrail**: No saturated gradients, decorative drop-shadow glows, or neon hues are permitted.

## Typography

The design system exclusively adopts **Inter** across all typographical scales to guarantee clear information architecture and high legibility across dense dashboard views and public marketing sections:

- **Headlines & Display**: Set at weight `700` with subtle negative tracking (`-0.01em` to `-0.025em`) to produce a confident, solid presence.
- **Body Content**: Employs sizes `16px` and `18px` with regular weight `400` and generous line heights (`1.5` to `1.55`) for prolonged reading comfort.
- **Minimum Threshold Guardrail**: No UI element, hint label, caption, or auxiliary tag may drop below `14px`.

## Layout & Spacing

A structured, predictable 12-column fluid grid system anchors content consistency across all viewports:

- **Desktop (>= 1024px)**: 12-column grid, max content container width of `1200px`, `gutter` of `1.5rem` (24px), outer `margin` of `2rem` (32px).
- **Tablet (768px - 1023px)**: 8-column grid, dynamic container width, `gutter` of `1.25rem` (20px), outer `margin` of `1.5rem` (24px).
- **Mobile (< 768px)**: 4-column grid, single-column reflow for complex data layouts, `gutter` of `1rem` (16px), outer `margin` of `1rem` (16px).
- **Section Rhythm**: Alternating sections alternate strictly between `#FFFFFF` and `#F8FAFC` backgrounds, padded vertically with `space-xl` (40px) or `5rem` (80px) on wide displays to maintain an uncluttered aesthetic.

## Elevation & Depth

Visual hierarchy relies on structural borders and soft ambient diffusion rather than artificial z-axis lifts:

- **Base Line Boundary**: Surfaces leverage a crisp 1px border in `#E2E8F0` as the primary boundary mechanism.
- **Ambient Shadow (Cards & Interactive Elements)**: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`. This soft diffusion prevents visual flatness while retaining extreme sobriety.
- **Floating Surfaces (Dropdowns & Modals)**: `0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.03)` wrapped inside `#E2E8F0` border strokes.
- **No Heavy Outlines or Dark Shadows**: Heavy drop-shadows and saturated dark tints are strictly prohibited.

## Shapes

The geometric framework balances humanized usability with clean industrial precision:

- **Default Component Radius**: Interactive controls, buttons, text inputs, and chips apply a targeted corner radius of `10px` (`0.625rem`) to maintain consistent finger/cursor affinity.
- **Card Containers**: Configured with `12px` (`0.75rem`) border-radius to softly frame inner contents while matching the inner `10px` curvature of child buttons and inputs.
- **Overlays & Dialogs**: Configured with `14px` border-radius for balanced containment.

## Components

### Buttons
- **Primary Button**: Solid `#059669` background, `#FFFFFF` text (Inter 600, 15-16px), corner radius `10px`, horizontal padding `20px`, vertical padding `10px`. Hover state shifts background cleanly to `#047857`. Focus ring displays a 2px offset ring in `#059669`.
- **Secondary Button**: `#FFFFFF` or `transparent` background, 1px solid `#E2E8F0` border, `#0F172A` text (Inter 600, 15-16px), corner radius `10px`. Hover state applies `#F8FAFC` background with a subtle border darkening to `#CBD5E1`.
- **Disabled State**: `#F1F5F9` background, `#94A3B8` text, neutral non-interactive cursor.

### Cards
- **Base Style**: Pure white `#FFFFFF` surface, 1px border stroke `#E2E8F0`, corner radius `12px`, padding of `24px` to `32px` to provide ample breathing room.
- **Card Elevation**: Extremely soft ambient shadow (`0 1px 3px rgba(15, 23, 42, 0.04)`).
- **Interactive Variant**: On cursor hover, border subtly transitions to `#CBD5E1` alongside a minimal shadow increase (`0 4px 6px -1px rgba(15, 23, 42, 0.05)`).

### Input Fields & Selects
- **Base Geometry**: Height `44px`, 1px border `#E2E8F0`, corner radius `10px`, background `#FFFFFF`, typography `16px` text `#0F172A`.
- **Placeholder**: Set to `#94A3B8`.
- **Focus State**: 1px border in `#059669` combined with a soft 3px box-shadow glow in `rgba(5, 150, 105, 0.15)`.

### Chips & Badges
- **Status Badges**: Subdued soft tint backgrounds (e.g., `#ECFDF5` emerald tint for success) with solid `#047857` text, 1px border `rgba(5, 150, 105, 0.2)`, corner radius `8px`, font size `14px`, font weight `500`.

### Checkboxes & Radios
- **Container**: 20px x 20px box, 1px border `#CBD5E1`, corner radius `6px` (radios `50%`), background `#FFFFFF`.
- **Selected State**: Background filled with `#059669`, white checkmark or center pip, zero neon artifacts.

### Data Tables & Lists
- **Header**: `#F8FAFC` background, text `#475569` (Inter 600, 14px uppercase or title case), bottom border 1px `#E2E8F0`.
- **Rows**: Alternating between `#FFFFFF` and `#FAFAFA` on dense sets, or pure `#FFFFFF` separated by 1px `#E2E8F0` horizontal borders, with hover highlight `#F8FAFC`.