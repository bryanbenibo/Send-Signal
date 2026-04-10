 # Color System Rules

This document defines how color is used across the Send Signal product.

It does not define raw color values.

Raw values belong in:

- `theme.css`

This file defines the **usage rules**, **semantic meaning**, and **application standards** for color across the product.

The color system is influenced by **Material Design 3**, with emphasis on:

- semantic color roles
- accessible contrast
- clear hierarchy
- surface-based layouts
- restrained use of accent colors

All color usage in the product must follow these rules.

---

# 1. Source of Truth

The single source of truth for colors is:

- `theme.css`  

All product colors must be referenced through CSS variables defined there.

Examples:

- `var(--color-primary)`
- `var(--color-on-primary)`
- `var(--color-surface)`
- `var(--color-on-surface)`
- `var(--color-outline)`
- `var(--color-error)`

Direct hex color usage is prohibited.

Do not hardcode values such as:

- `#25D366`
- `#ffffff`
- `#000000`

Do not use raw rgb, hsl, or hex values in components when an approved token exists.

---

# 2. Color Philosophy

Send Signal is a product for:

- outreach
- lead management
- campaign execution
- messaging analytics
- business operations

The color system must therefore communicate:

- trust
- clarity
- control
- signal visibility
- operational safety

The UI should feel:

- clean
- modern
- calm
- structured
- product-focused

Avoid overly playful or loud color application.

Accent colors should be intentional, not excessive.

---

# 3. Material Design 3 Influence

The color system follows a Material Design 3 style of thinking.

That means:

- colors are assigned by **role**, not by decorative impulse
- surfaces matter
- readable contrast matters
- elevation and emphasis should be visually clear
- interactive states should feel consistent


# 4. Semantic Color Roles

All colors used in the UI must map to semantic roles.

Recommended semantic roles include:

## Brand and emphasis
- `--color-primary`
- `--color-on-primary`
- `--color-primary-container`
- `--color-on-primary-container`

## Secondary support
- `--color-secondary`
- `--color-on-secondary`
- `--color-secondary-container`
- `--color-on-secondary-container`

## Accent or tertiary emphasis
- `--color-tertiary`
- `--color-on-tertiary`
- `--color-tertiary-container`
- `--color-on-tertiary-container`

## Surface system
- `--color-background`
- `--color-surface`
- `--color-surface-variant`
- `--color-surface-container`
- `--color-surface-container-high`
- `--color-on-background`
- `--color-on-surface`
- `--color-on-surface-variant`

## Borders and separation
- `--color-outline`
- `--color-outline-variant`



---

# 5. Primary Color Usage

The primary color is the strongest brand signal in the interface.

Use primary color for:

- primary buttons
- active states
- key links
- selected navigation items
- main calls to action
- important charts or highlighted values where appropriate

Do not use primary color everywhere.

Primary color should guide attention, not flood the interface.

Primary color should not be used as the base color for large text bodies or broad surface fills unless explicitly tokenized for that purpose.

---

# 6. Secondary and Tertiary Color Usage

Secondary and tertiary colors exist to support hierarchy.

Use them for:

- supporting actions
- secondary emphasis
- charts
- less dominant highlights
- contextual UI regions where a second accent is needed

They must not compete with primary actions.

If a screen already has clear primary emphasis, secondary and tertiary colors should remain restrained.

---

# 7. Surface and Background Usage

The product is dashboard-heavy and surface-heavy.

This means surface colors are critical.

Use surface roles for:

- page backgrounds
- cards
- tables
- modals
- forms
- sidebars
- dropdowns
- analytics containers

Use separate surface levels to create subtle hierarchy.

Recommended behavior:

- page background uses background token
- main cards use surface token
- raised or emphasized panels use higher surface container tokens
- muted areas use surface variant tokens

Avoid using brand colors as general background fills for dashboard surfaces.

The dashboard should feel operational, not promotional.

---

# 8. Text Color Usage

Text color must always be chosen through semantic color roles.

Use:

- `--color-on-background` for text on page backgrounds
- `--color-on-surface` for text on cards and containers
- `--color-on-surface-variant` for secondary text
- `--color-on-primary` for text on primary surfaces
- `--color-on-error` for text on error surfaces

Do not use low-contrast text.

Muted text should still remain readable.

Text contrast must always prioritize accessibility and clarity.

---

# 9. Border and Divider Usage

Borders and dividers should be subtle.

Use:

- `--color-outline`
- `--color-outline-variant`

Use borders for:

- table cell separation
- card boundaries
- input boundaries
- modal separation
- section dividers

Do not use overly dark or visually heavy borders unless the UI specifically needs stronger emphasis.

Borders should support structure, not dominate the layout.

---

# 10. Status Color Usage

Status colors are extremely important in Send Signal because this product depends on:

- message delivery states
- lead states
- campaign states
- system feedback

Status color usage must be consistent across the application.

---






# 11. Color Usage by Product Area

## 11.1 Marketing pages

Marketing pages can use a slightly more expressive use of color than the dashboard.

Allowed emphasis:
- primary color for hero CTA
- primary container or secondary container for feature highlights
- restrained accent usage for illustrations or stat cards

The marketing page should still feel credible and product-led, not overly flashy.

Do not turn the marketing site into a gradient-heavy promotional page unless such gradients are explicitly tokenized and approved.

---

## 11.2 Dashboard pages

Dashboard pages should use a more restrained palette.

The dashboard should rely primarily on:

- background
- surface
- surface variants
- outline
- semantic status colors
- primary only where emphasis is needed

This keeps operational screens readable over long sessions.

---

## 11.3 Forms

Forms should use color carefully.

Inputs should use:
- surface or container tokens for fill if applicable
- outline tokens for borders
- on-surface tokens for text
- error tokens only when validation fails

Focus states should use an approved primary or outline-related token, not arbitrary colors.

Do not over-color forms.

---

## 11.4 Tables

Tables are critical in Send Signal.

Table color rules:

- table background should use surface tokens
- row separators should use outline or outline-variant
- header areas may use surface container tokens
- status indicators should use semantic status colors
- selected rows may use a subtle primary container or surface emphasis token

Do not use strong saturated backgrounds for entire rows unless the state is truly critical.

---

## 11.5 Conversation and messaging views

Conversation views should be clean and readable.

Recommended behavior:

- page background uses surface/background tokens
- message bubbles use tokenized container colors
- outbound and inbound bubbles should be distinct but subtle
- timestamps and metadata use on-surface-variant
- unread or important state indicators may use primary or info tokens

Chat UI must remain calm and legible.

---

## 11.6 Analytics

Analytics views should use restrained colors.

Rules:

- use primary, secondary, tertiary, success, warning, and error meaningfully
- charts should not use random decorative colors
- chart palettes must come from approved semantic tokens
- negative metrics should not automatically use red unless the meaning is truly negative
- neutral operational metrics can use surface, outline, info, or primary variants

Analytics color should help interpretation, not create noise.

---

# 12. Status Mapping Guidance

The following product states should map consistently to semantic colors.

## Lead status suggestions
- New → info or neutral
- Contacted → primary or neutral emphasis
- Replied → secondary or info
- Interested → tertiary or success-container depending on system
- Not Interested → warning or neutral-muted
- Converted → success
- Bounced → error or warning depending on severity
- Unsubscribed → error-container or muted-error treatment

## Message status suggestions
- Queued → neutral or info
- Sending → primary or info
- Sent → primary-container or neutral-confirmed
- Delivered → success or success-container
- Read → success or secondary-success treatment
- Replied → tertiary or info-success blend depending on token system
- Failed → error
- Bounced → error
- Unsubscribed → warning-error hybrid treatment if tokenized

## Campaign status suggestions
- Draft → neutral
- Scheduled → info
- Running → primary
- Paused → warning
- Completed → success
- Cancelled → outline-muted or warning-muted
- Failed → error

These mappings should remain consistent across badges, tables, charts, and detail views.

---

# 13. Accessibility Rules

Color usage must support accessibility.

Requirements:

- sufficient contrast between foreground and background
- no critical information communicated by color alone
- status indicators should include text labels or icons where needed
- interactive states must remain visible in both normal and focused conditions

Color should support meaning, not carry meaning alone.

---

# 14. Prohibited Color Practices

The following practices are prohibited:

- direct hex color usage in components
- arbitrary color classes that bypass tokens
- mixing tokenized typography with non-tokenized colors
- using color only for decoration with no semantic role
- using overly saturated status colors across large surfaces
- using primary color for every actionable element on a page
- inventing new color roles at component level when a semantic token already exists

---

# 15. Implementation Rules

All components must consume color from token variables defined in `design-tokens.css`.

Preferred usage example:

- background-color: `var(--color-surface)`
- color: `var(--color-on-surface)`
- border-color: `var(--color-outline)`

If Tailwind is used for layout and spacing, color decisions must still come from token variables.

Do not replace tokenized colors with Tailwind palette utilities.

Examples of prohibited implementation patterns:

- `bg-green-500`
- `text-red-600`
- `border-gray-300`

unless those utilities are explicitly mapped to your own token system through configuration.

---

# 16. Final Rule

The Send Signal color system must feel:

- trustworthy
- structured
- modern
- readable
- operational
- calm under scale

Color is a communication tool in this product.

It must guide users through:

- onboarding
- lead management
- campaign setup
- delivery monitoring
- reply handling
- analytics review

Every color choice must reinforce meaning, hierarchy, and clarity.