## Color Palette

System-defined palettes help ensure actions and responses always feel consistent with the ChatGPT platform. Partners can add branding through accents, icons, or inline imagery, but should not redefine system colors.

### Rules of Thumb

- ✅ Use system colors for text, icons, and spatial elements like dividers
- ✅ Use brand accent colors on primary buttons inside app display modes
- ❌ Partner brand accents (logos/icons) should not override backgrounds or text colors
- ❌ Avoid custom gradients or patterns that break ChatGPT's minimal look

---

### Light Mode

#### Background

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#FFFFFF` | Main content background |
| Secondary | `#E8E8E8` | Cards, elevated surfaces |
| Tertiary | `#F3F3F3` | Subtle backgrounds, dividers |

#### Text

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#0D0D0D` | Headings, body text |
| Secondary | `#5D5D5D` | Supporting text, labels |
| Tertiary | `#8F8F8F` | Placeholders, disabled |
| Inverted | `#FFFFFF` | Text on dark backgrounds |

#### Icon

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#0D0D0D` | Primary icons |
| Secondary | `#5D5D5D` | Secondary icons |
| Tertiary | `#8F8F8F` | Disabled icons |
| Inverted | `#FFFFFF` | Icons on dark backgrounds |

#### Accents

| Token | Hex | Usage |
|-------|-----|-------|
| Blue | `#0285FF` | Primary actions, links |
| Red | `#E82E2A` | Errors, destructive actions |
| Orange | `#E26507` | Warnings |
| Green | `#0B8535` | Success, confirmations |

---

### Dark Mode

#### Background

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#212121` | Main content background |
| Secondary | `#303030` | Cards, elevated surfaces |
| Tertiary | `#414141` | Subtle backgrounds, dividers |

#### Text

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#FFFFFF` | Headings, body text |
| Secondary | `#CDCDCD` | Supporting text, labels |
| Tertiary | `#AFAFAF` | Placeholders, disabled |
| Inverted | `#AFAFAF` | Text on light backgrounds |

#### Icon

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#FFFFFF` | Primary icons |
| Secondary | `#CDCDCD` | Secondary icons |
| Tertiary | `#AFAFAF` | Disabled icons |
| Inverted | `#AFAFAF` | Icons on light backgrounds |

#### Accents

| Token | Hex | Usage |
|-------|-----|-------|
| Blue | `#0285FF` | Primary actions, links |
| Red | `#FF8583` | Errors, destructive actions |
| Orange | `#FF9E6C` | Warnings |
| Green | `#68C977` | Success, confirmations |

---

## Component Guidelines

### Buttons

#### Primary Button
- **Background:** Brand accent color (typically `#0285FF` for blue)
- **Text:** White (`#FFFFFF`)
- **Padding:** 12px vertical, 20px horizontal
- **Corner Radius:** 6px - 8px
- **Font:** 16px, Weight: 500 (Medium)

#### Secondary Button
- **Background:** Transparent
- **Text:** Primary text color
- **Border:** 1px solid, secondary border color
- **Padding:** 12px vertical, 20px horizontal
- **Corner Radius:** 6px - 8px

**Rules:**
- ✅ Use brand accent colors on primary buttons
- ✅ Limit to 2 actions per card (one primary, one secondary)
- ❌ Don't create more than 2 button styles per component

### Cards

**Structure:**
- **Padding:** 16px (standard)
- **Corner Radius:** 8px - 12px
- **Background:** Primary background color
- **Border:** Optional, 1px solid, secondary background color

**Content Hierarchy:**
1. Title (if applicable)
2. Supporting text/metadata
3. Visual content (image, chart, etc.)
4. Actions (bottom)

**Rules:**
- ✅ Maintain consistent padding
- ✅ Use consistent corner radius
- ✅ Clear visual hierarchy
- ❌ Don't use drop shadows
- ❌ Don't create nested scrolling

### Dividers

- **Color:** Secondary background color
- **Weight:** 1px
- **Usage:** Separate sections within cards or between elements

---

## Spacing & Layout

Consistent margins, padding, and alignment keep partner content scannable and predictable inside conversation.

### Rules of Thumb

- ✅ Use system grid spacing for cards, collections, and inspector panels
- ✅ Keep padding consistent and avoid cramming or edge-to-edge text
- ✅ Respect system-specified corner radii to keep shapes consistent
- ✅ Maintain visual hierarchy with headline, supporting text, and CTA in a clear order

---

### Spacing Scale

| Pixels | Token | Common Usage |
|--------|-------|--------------|
| `128px` | `space-64` | Large section gaps |
| `64px` | `space-32` | Section spacing |
| `48px` | `space-24` | Large component gaps |
| `40px` | `space-20` | Component spacing |
| `32px` | `space-16` | Card padding (large) |
| `24px` | `space-12` | Card padding (standard) |
| `16px` | `space-8` | Element spacing, standard padding |
| `12px` | `space-6` | Compact padding |
| `8px` | `space-4` | Small gaps, icon spacing |
| `4px` | `space-2` | Tight spacing |
| `2px` | `space-1` | Minimal spacing |
| `0` | `space-0` | No spacing |

---

## Icons & Imagery

System iconography provides visual clarity, while partner logos and images help users recognize brand context.

### Rules of Thumb

- ✅ Use either system icons or custom iconography that fits within ChatGPT's visual world — monochromatic and outlined
- ✅ All imagery must follow enforced aspect ratios to avoid distortion
- ✅ Icons are typically placed in circular containers — refer to color palette for proper contrast
- ❌ Do not include your logo as part of the response — ChatGPT will always append your logo and app name before the widget is rendered

---

### Icon Library

This repository includes a curated icon set in `agent-resources/Iconography/`. Prioritize these icons for ChatGPT Apps when a relevant icon can be found. Each filename describes the icon's purpose.

#### Critical Icons

| Icon | File | Usage |
|------|------|-------|
| Expand (large) | `expand-lg.svg` | Fullscreen or Picture-in-Picture toggle |
| Expand (medium) | `expand-md.svg` | Fullscreen or Picture-in-Picture toggle |
| Expand (small) | `expand-sm.svg` | Compact expand button |
| Close | `x-circle, crossed, close.svg` | Close/dismiss actions |
| Close (filled) | `x-circle-filled, crossed, close.svg` | Close on dark backgrounds |
| Collapse | `collapse-lg.svg`, `collapse-sm.svg` | Minimize/collapse panels |
| PiP | `picture-in-picture.svg` | Picture-in-Picture mode |

#### Navigation Icons

| Icon | File | Usage |
|------|------|-------|
| Chevrons | `chevron-up-*.svg`, `chevron-down-*.svg`, etc. | Directional navigation |
| Arrows | `arrow-up-*.svg`, `arrow-down-*.svg`, etc. | Navigation, back/forward |
| Menu | `dots-horizontal, more, menu.svg` | More options menu |
| Sidebar | `sidebar.svg`, `menu-sidebar.svg` | Toggle sidebar |

#### Action Icons

| Icon | File | Usage |
|------|------|-------|
| Plus | `plus-circle, +, add.svg`, `plus-lg, 18px, add.svg` | Add/create actions |
| Search | `search.svg`, `magnifying-glass-sm,search.svg` | Search functionality |
| Regenerate | `regenerate.svg`, `regenerate-star.svg` | Retry/refresh actions |
| Undo/Redo | `undo.svg`, `redo.svg` | History actions |
| Link | `link.svg`, `unlink.svg` | Link management |

#### Content Icons

| Icon | File | Usage |
|------|------|-------|
| Chat | `chat.svg`, `chats.svg` | Messaging features |
| Calendar | `calendar-today.svg` | Date/scheduling |
| Globe | `globe, real-time, search.svg` | Web/world features |
| Book | `book.svg`, `book-bookmark.svg` | Documentation/reading |
| Images | `images.svg` | Image galleries |
| Analytics | `analytics.svg`, `bar-chart.svg` | Data visualization |

#### Utility Icons

| Icon | File | Usage |
|------|------|-------|
| Clock | `clock.svg`, `clock-off.svg` | Time-related features |
| Pin | `pin.svg`, `pin-filled.svg`, `unpin.svg` | Pin/save items |
| Archive | `archive.svg`, `unarchive.svg` | Archive actions |
| History | `history-on.svg`, `history-off.svg` | History features |
| Tools | `tools, skills.svg`, `stuff, tools.svg` | Settings/tools |

---

## Accessibility

### Contrast Requirements

- **Text and Background:** Minimum WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text) Don’t apply colors to backgrounds in text areas.
- **Interactive Elements:** Minimum 3:1 contrast ratio
- **Focus States:** Clearly visible focus indicators

### Text Accessibility

- ✅ Support text resizing without breaking layouts
- ✅ Provide alt text for all images
- ✅ Use semantic HTML structure
- ✅ Ensure sufficient color contrast

### Interaction Accessibility

- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Focus management
- ✅ Clear focus indicators
