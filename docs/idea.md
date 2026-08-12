# Vitals&Vectors — Complete Design & Content Specification
## v2.0 — Visual Language, Layout & Interaction Blueprint

---

# PART 1: GLOBAL DESIGN SYSTEM

## 1.1 Color Palette

### Backgrounds
| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#0A0A0F` | Main page background, deepest layer |
| `--bg-panel` | `#0D0D1A` | Card backgrounds, content panels |
| `--bg-elevated` | `#12121F` | Input fields, table headers, hover states |
| `--bg-hover` | `#1A1A2E` | Row hover, button hover backgrounds |

### Accents
| Token | Hex | Glow | Usage |
|---|---|---|---|
| `--accent-blue` | `#4FC3F7` | `rgba(79, 195, 247, 0.3)` | Primary actions, links, streaks, active nav, progress bars |
| `--accent-purple` | `#7C4DFF` | `rgba(124, 77, 255, 0.3)` | Ranks, badges, achievements, SS rank |
| `--accent-teal` | `#00E5FF` | `rgba(0, 229, 255, 0.3)` | Success states, earned points, positive values |
| `--accent-red` | `#FF1744` | `rgba(255, 23, 68, 0.3)` | Danger, deductions, warnings, logout, suspended status |
| `--accent-amber` | `#FFB300` | `rgba(255, 179, 0, 0.3)` | Warning chips, pending status, caution alerts |

### Text
| Token | Hex | Usage |
|---|---|---|
| `--text-primary` | `#E8E8F0` | Headings, primary content, labels |
| `--text-secondary` | `#8A8AA3` | Subtitles, descriptions, metadata |
| `--text-muted` | `#4A4A6A` | Placeholders, disabled text, empty states |

### Borders
| Token | Hex | Usage |
|---|---|---|
| `--border-subtle` | `rgba(79, 195, 247, 0.1)` | Default card borders, table dividers |
| `--border-glow` | `rgba(79, 195, 247, 0.4)` | Focus states, active nav, hover borders |

### Rank Colors
| Rank | Border | Text | Glow |
|---|---|---|---|
| E | `#666666` | `#999999` | `#666666` |
| D | `#CD7F32` | `#CD7F32` | `#CD7F32` |
| C | `#A0A0A0` | `#C0C0C0` | `#A0A0A0` |
| B | `#C0C0C0` | `#E8E8E8` | `#C0C0C0` |
| A | `#FFD700` | `#FFD700` | `#FFD700` |
| S | `#00E5FF` | `#00E5FF` | `#00E5FF` |
| SS | `#7C4DFF` | `#7C4DFF` | `#7C4DFF` |

---

## 1.2 Typography

| Role | Font | Weight | Size | Letter-Spacing | Transform |
|---|---|---|---|---|---|
| Display / Logo | Bebas Neue | 400 | 1.6rem | 0.05em | uppercase |
| Page Titles (h1) | Bebas Neue | 400 | 2.5rem | 0.05em | uppercase |
| Section Titles (h2) | Bebas Neue | 400 | 1.8rem | 0.05em | uppercase |
| Card Titles (h3) | Bebas Neue | 400 | 1.3rem | 0.05em | uppercase |
| Sub-headings (h4) | Bebas Neue | 400 | 1rem | 0.05em | uppercase |
| Body | Inter | 400 | 0.9rem | normal | none |
| Labels / Tags | Inter | 500 | 0.7rem | 0.1em | uppercase |
| Stats / Numbers | Bebas Neue | 700 | 2rem | normal | none |
| Mono / System | Rajdhani | 400 | 0.7rem | 0.2em | uppercase |

---

## 1.3 Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `xs` | 4px | Icon gaps, chip padding-y |
| `sm` | 8px | Button padding-y, inline gaps |
| `md` | 12px | Card padding compact, nav item padding |
| `lg` | 16px | Card padding standard, section gaps |
| `xl` | 20px | Grid gaps, card margins |
| `2xl` | 24px | Page padding, container padding |
| `3xl` | 32px | Section vertical spacing |
| `4xl` | 48px | Login card padding, large sections |

---

## 1.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Buttons, inputs, badges, chips |
| `radius-md` | 8px | Cards, tables, modals |
| `radius-lg` | 12px | Login card, large panels |

---

## 1.5 Shadows & Glows

| Token | Value |
|---|---|
| `shadow-glow` | `0 0 20px rgba(79, 195, 247, 0.3)` |
| `shadow-purple` | `0 0 20px rgba(124, 77, 255, 0.3)` |
| `shadow-card` | `0 4px 24px rgba(0, 0, 0, 0.4)` |

---

## 1.6 Global Background Effect

The entire app sits on a **fixed background grid**:
- Two overlaid linear gradients at 1px thickness forming a 50px × 50px grid
- Color: `rgba(79, 195, 247, 0.03)` — nearly invisible, subtle texture
- A radial gradient overlay from top-center: `rgba(79, 195, 247, 0.05)` fading to transparent at 70%
- `pointer-events: none`, `z-index: 0`
- All content sits at `z-index: 1` or higher

---

## 1.7 Navigation Bar

**Position:** Sticky top, `z-index: 100`

**Structure (left to right):**
1. **Logo** — `◈` icon inside a 32×32px square with 2px `#4FC3F7` border, `box-shadow: 0 0 10px rgba(79,195,247,0.3)`, followed by "V&V" text in Bebas Neue 1.6rem `#4FC3F7` with text-shadow glow
2. **Nav Links** — Horizontal flex row, gap 8px. Each link: Inter 500, 0.85rem, `#8A8AA3`, padding 8px 16px, border 1px transparent, border-radius 4px. **Active state:** `#4FC3F7`, border `rgba(79,195,247,0.4)`, background `rgba(79,195,247,0.05)`. **Hover:** same as active but without the bottom border emphasis
3. **User Badge** (right side) — Flex row: Rank badge (36×36px, Bebas Neue 1rem) + name text (Inter 0.8rem `#E8E8F0`), wrapped in a pill-shaped container: background `#12121F`, border `rgba(79,195,247,0.1)`, padding 6px 12px, border-radius 4px
4. **Logout Button** — Transparent background, 1px `#FF1744` border, `#FF1744` text, padding 6px 14px, border-radius 4px. **Hover:** background `#FF1744`, text white, `box-shadow: 0 0 15px rgba(255,23,68,0.3)`

**Mobile (< 768px):**
- Logo shrinks to 1.3rem
- User badge hidden
- Nav links become horizontally scrollable, full width below logo
- Padding reduces to 8px vertical

---

## 1.8 Component Specifications

### Card
- Background: `#0D0D1A`
- Border: 1px `rgba(79,195,247,0.1)`
- Border-radius: 8px
- Padding: 20px
- Position: relative, overflow hidden
- **Top accent line:** A 1px gradient line (`transparent → #4FC3F7 → transparent`) at absolute top, opacity 0 default, opacity 1 on hover
- **Hover:** Border color shifts to `rgba(79,195,247,0.4)`, `box-shadow: 0 0 20px rgba(79,195,247,0.3)`, translateY(-2px), transition 0.3s

### Rank Badge
- Size: 48×48px (default), 36×36px (compact), 32×32px (table)
- Border: 2px solid (rank color)
- Border-radius: 4px
- Font: Bebas Neue, 1.4rem (default), 1.1rem (compact), 0.9rem (table)
- Text color: rank color
- **Glow pseudo-element:** `::after` with `inset: -4px`, same border-radius, background: rank color, opacity 0.3, filter: blur(8px), z-index: -1
- **SS rank only:** `animation: pulse-glow 2s infinite`

### Button — Primary
- Background: linear-gradient(135deg, `#4FC3F7`, `#00E5FF`)
- Text: `#0A0A0F` (dark for contrast)
- Border: none
- Padding: 10px 20px
- Border-radius: 4px
- Font: Inter 600, 0.85rem
- **Hover:** `box-shadow: 0 0 20px rgba(79,195,247,0.3)`, translateY(-1px)

### Button — Secondary
- Background: transparent
- Border: 1px `rgba(79,195,247,0.4)`
- Text: `#4FC3F7`
- **Hover:** Background `rgba(79,195,247,0.1)`, `box-shadow: 0 0 15px rgba(79,195,247,0.3)`

### Button — Danger
- Background: transparent
- Border: 1px `#FF1744`
- Text: `#FF1744`
- **Hover:** Background `#FF1744`, text white, `box-shadow: 0 0 15px rgba(255,23,68,0.3)`

### Button — Success
- Background: transparent
- Border: 1px `#00E5FF`
- Text: `#00E5FF`
- **Hover:** Background `#00E5FF`, text `#0A0A0F`

### Status Chips
- Display: inline-flex, align-items center, gap 4px
- Padding: 4px 10px
- Border-radius: 20px
- Font: Inter 600, 0.7rem, uppercase, letter-spacing 0.05em
- **Pending:** bg `rgba(255,179,0,0.15)`, border `rgba(255,179,0,0.3)`, text `#FFB300`
- **In Progress:** bg `rgba(79,195,247,0.15)`, border `rgba(79,195,247,0.3)`, text `#4FC3F7`
- **Completed:** bg `rgba(0,229,255,0.15)`, border `rgba(0,229,255,0.3)`, text `#00E5FF`
- **Rated:** bg `rgba(124,77,255,0.15)`, border `rgba(124,77,255,0.3)`, text `#7C4DFF`
- **Active:** same as Completed
- **Suspended:** bg `rgba(255,23,68,0.15)`, border `rgba(255,23,68,0.3)`, text `#FF1744`
- **Inactive:** bg `rgba(100,100,120,0.15)`, border `rgba(100,100,120,0.3)`, text `#4A4A6A`

### Progress Bar
- Track: 100% width, 6px height, `#12121F`, border-radius 3px
- Fill: linear-gradient(90deg, `#4FC3F7`, `#00E5FF`), border-radius 3px
- **Shimmer effect:** `::after` pseudo-element at right edge, 20px wide, linear-gradient(90deg, transparent, `rgba(255,255,255,0.3)`)
- Transition: width 0.6s ease

### Data Table
- Container: `overflow-x: auto`, border-radius 8px, border 1px `rgba(79,195,247,0.1)`
- Table: width 100%, border-collapse collapse, font-size 0.85rem
- **Header row:** Background `#12121F`, padding 12px 16px, text left, font-weight 600, color `#8A8AA3`, font-size 0.75rem, uppercase, letter-spacing 0.05em, border-bottom 1px `rgba(79,195,247,0.1)`
- **Body cells:** Padding 12px 16px, border-bottom 1px `rgba(79,195,247,0.05)`, color `#E8E8F0`
- **Row hover:** Background `rgba(79,195,247,0.03)`, transition 0.2s
- **Last row:** No bottom border

### Form Inputs
- Width: 100%
- Padding: 10px 14px
- Background: `#12121F`
- Border: 1px `rgba(79,195,247,0.1)`
- Border-radius: 4px
- Color: `#E8E8F0`
- Font: Inter 0.9rem
- **Focus:** Border `#4FC3F7`, `box-shadow: 0 0 10px rgba(79,195,247,0.3)`, outline none
- **Placeholder:** `#4A4A6A`

### Modal
- Overlay: fixed, inset 0, background `rgba(0,0,0,0.8)`, backdrop-filter blur(4px), z-index 1000
- Content: background `#0D0D1A`, border 1px `rgba(79,195,247,0.4)`, border-radius 12px, padding 24px, max-width 500px, width 90%, max-height 80vh, overflow-y auto
- **Open animation:** Overlay opacity 0→1, content scale 0.9→1, transition 0.3s
- **Close button:** Top right, × symbol, `#8A8AA3`, 1.5rem, no background. **Hover:** `#FF1744`

### Toast Notification
- Position: fixed, bottom 24px, right 24px, z-index 9999
- Padding: 12px 20px, border-radius 8px, max-width 320px
- **Success:** bg `rgba(0,229,255,0.15)`, border `#00E5FF`, text `#00E5FF`
- **Error:** bg `rgba(255,23,68,0.15)`, border `#FF1744`, text `#FF1744`
- **Info:** bg `rgba(79,195,247,0.15)`, border `#4FC3F7`, text `#4FC3F7`
- Animation: fadeIn 0.3s ease, auto-dismiss after 3s with fade-out

### Hero Badge
- Display: inline-flex, gap 6px, padding 6px 12px
- Background: linear-gradient(135deg, `rgba(255,215,0,0.15)`, `rgba(255,179,0,0.15)`)
- Border: 1px `rgba(255,215,0,0.4)`
- Border-radius: 4px
- Color: `#FFD700`
- Font: Inter 600, 0.75rem, uppercase, letter-spacing 0.05em
- **Monthly variant:** bg linear-gradient(135deg, `rgba(124,77,255,0.15)`, `rgba(79,195,247,0.15)`), border `#7C4DFF`, color `#7C4DFF`
- Animation: pulse-glow 3s infinite

### Alert Panel
- Background: `rgba(255,23,68,0.05)`
- Border: 1px `rgba(255,23,68,0.2)`
- Border-radius: 8px
- Padding: 16px
- Flex row, gap 12px, align-items center
- Icon: `#FF1744`, 1.2rem
- Text: Inter 0.85rem, `#8A8AA3`. Strong text: `#FF1744`

---

## 1.9 Animations

| Name | Behavior | Duration |
|---|---|---|
| `pulse-glow` | Box-shadow oscillates between 15px and 25px+40px glow | 2s infinite |
| `float` | translateY 0 → -6px → 0 | 3s infinite ease-in-out |
| `fadeIn` | opacity 0→1, translateY 10px→0 | 0.4s ease-out |
| `loading` | Bar width 0→100%→0 with margin shift | 1.5s ease-in-out infinite |

---

## 1.10 Scrollbar

- Width: 6px
- Track: `#0A0A0F`
- Thumb: `#4FC3F7`, border-radius 3px
- Thumb hover: `#00E5FF`

---

## 1.11 Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| > 1024px | Full layout, 4-column stat grids, side-by-side admin panels |
| ≤ 1024px | Container padding 16px, nav wraps, stats 2-column, h1→2rem |
| ≤ 768px | Single column everything, nav links scroll horizontally, user badge hidden, tables font-size 0.8rem, modals padding 16px, dashboard grid→1fr, rules grid→1fr |
| ≤ 480px | Buttons smaller (8px 14px), stat values 1.6rem, tabs scrollable, nav links 0.75rem |

---

# PART 2: PAGE-BY-PAGE SPECIFICATION

---

## PAGE 1: LOGIN (`index.html`)

### Overall Layout
- Full viewport height, flex center (both axes)
- Background: `#0A0A0F` with grid overlay
- Padding: 24px (prevents card touching edges on mobile)

### Login Card
- Width: 100%, max-width 420px
- Background: `#0D0D1A`
- Border: 1px `rgba(79,195,247,0.1)`
- Border-radius: 12px
- Padding: 48px 40px (desktop), 32px 24px (mobile)
- **Top accent:** 2px gradient line (`transparent → #4FC3F7 → #7C4DFF → transparent`) at absolute top
- Animation: `fadeIn` on load

### Logo Section (inside card, top)
- Text: "VITALS & VECTORS" — Bebas Neue, 2rem, `#4FC3F7`, text-shadow `0 0 20px rgba(79,195,247,0.3)`
- Subtitle: "Solo Leveling Monitoring Platform" — Inter 0.8rem, `#8A8AA3`, uppercase, letter-spacing 0.2em
- Alignment: center
- Margin-bottom: 32px

### System Tag
- Text: "SYSTEM AUTHENTICATION REQUIRED"
- Font: Rajdhani, 0.7rem, `#4FC3F7`, letter-spacing 0.2em, uppercase
- Background: `rgba(79,195,247,0.1)`
- Border: 1px `rgba(79,195,247,0.4)`
- Border-radius: 20px
- Padding: 4px 12px
- Width: 100%, text-align center
- Margin-bottom: 24px

### Form Fields
- 2 fields stacked vertically, gap 16px
- **Username label:** "Username" — Inter 500, 0.8rem, `#8A8AA3`, uppercase, letter-spacing 0.05em, margin-bottom 6px
- **Username input:** placeholder "Enter hunter ID"
- **Password label:** "Password" — same style
- **Password input:** placeholder "Enter access key", type password

### Submit Button
- Text: "INITIALIZE SESSION"
- Style: Primary button (gradient), full width
- Padding: 14px vertical
- Font: Inter 600, 1rem, uppercase, letter-spacing 0.1em
- Margin-top: 8px

### Loading State
- On submit: button text changes to "AUTHENTICATING...", disabled state
- If error: button reverts, toast appears (error style)

---

## PAGE 2: MEMBER DASHBOARD (`dashboard.html`)

### Layout Structure
- Nav bar (sticky)
- Page wrapper: padding 24px 0, container max-width 1400px centered
- Content stacks vertically:
  1. Stats grid (4 cards)
  2. Dashboard grid (2 columns: Rank Card | Streaks Card)
  3. Bottom grid (2 columns: Today's Tasks | Recent Activity)

### Section 1: Stats Grid
- 4-column grid, gap 16px, margin-bottom 24px
- Each stat card: background `#0D0D1A`, border 1px `rgba(79,195,247,0.1)`, border-radius 8px, padding 20px
- **Left accent bar:** 3px wide vertical line at left edge (absolute positioning)
  - Card 1 (Position): accent `#4FC3F7`
  - Card 2 (Week Earned): accent `#00E5FF`
  - Card 3 (Month Total): accent `#7C4DFF`
  - Card 4 (Net Week): accent `#FFB300`
- **Label:** Inter 500, 0.7rem, `#8A8AA3`, uppercase, letter-spacing 0.1em, margin-bottom 4px
- **Value:** Bebas Neue, 2rem, `#E8E8F0` (or `#00E5FF` for positive, `#FF1744` for negative)
- Content:
  - Weekly Position: `#${position}` or `-`
  - Points This Week: `+${points_this_week}`
  - Points This Month: `${points_this_month}`
  - Net This Week: `+${net}` (same as week earned for now)

### Section 2: Dashboard Grid (2 columns, gap 20px)

#### Left: Rank Card
- Flex row, align-items center, gap 20px, padding 24px
- **Rank Badge:** 48×48px, rank color, left side
- **Rank Info (flex:1):**
  - Label: "Current Rank" — Inter 0.85rem, `#8A8AA3`, uppercase
  - Title: `${rankLabel}` — Bebas Neue, 2.5rem, `#E8E8F0`
  - Progress bar below (6px height, gradient fill)
  - Subtext: `${ptsToNext} pts to ${nextRank}` or "MAX RANK ACHIEVED" — Inter 0.75rem, `#8A8AA3`
- **Total Points (right side, text-align right):**
  - Label: "Total Points" — Inter 0.85rem, `#8A8AA3`, uppercase
  - Value: Bebas Neue, 2.5rem, `#00E5FF`

#### Right: Streaks Card
- Card header: "🔥 Streaks" with card-title styling
- Inside: 2-column grid, gap 12px
- Each streak box:
  - Background: `#12121F`
  - Border: 1px `rgba(79,195,247,0.1)`
  - Border-radius: 4px
  - Padding: 16px
  - Text-align: center
  - Number: Bebas Neue, 2rem, `#00E5FF`
  - Label: Inter 0.7rem, `#8A8AA3`, uppercase
- Content:
  - Presence: `${streak_presence}w`
  - Task Reporting: `${streak_task_reporting}w`

### Section 3: Bottom Grid (2 columns, gap 20px, margin-top 20px)

#### Left: Today's Tasks Card
- Card header: "📋 Today's Tasks" + "View All" secondary button (right-aligned)
- Task items stacked vertically:
  - Each item: flex row, space-between, align-center, padding 12px 0, border-bottom 1px `rgba(79,195,247,0.05)`
  - Left: Title (Inter 500, 0.9rem, `#E8E8F0`) + subtitle (duration + deadline, Inter 0.75rem, `#8A8AA3`)
  - Right: Status chip
- Last item: no border-bottom
- Empty state: centered, icon 📋, text "No tasks due today", `#4A4A6A`

#### Right: Recent Activity Card
- Card header: "📜 Recent Activity" + "View All" secondary button
- Log items stacked:
  - Each: flex row, space-between, padding 10px 0, border-bottom 1px `rgba(79,195,247,0.05)`
  - Left: Reason (Inter 0.85rem, `#E8E8F0`) + timestamp (Inter 0.7rem, `#4A4A6A`)
  - Right: Points value, Bebas Neue 1.1rem, `#00E5FF` (positive) or `#FF1744` (negative), with +/- prefix
- Empty state: "No recent activity"

---

## PAGE 3: TASK SHEET (`tasks.html`)

### Layout
- Nav bar
- Page title: "Task Sheet" — h2, Bebas Neue 1.8rem, margin-bottom 20px
- Single full-width table container

### Table Structure
- 8 columns: Sr. No. | Activity | Duration | Deadline | Assigned By | Status | Points | Action
- Header: `#12121F` background, uppercase labels, `#8A8AA3`
- Rows: alternating subtle hover, last row no border
- **Sr. No.:** Sequential number, Inter 0.85rem
- **Activity:** Task title, Inter 0.85rem, `#E8E8F0`
- **Duration:** `${duration_hrs}h`, Inter 0.85rem
- **Deadline:** Formatted date (short month + day), Inter 0.85rem
- **Assigned By:** Member name or `-`, Inter 0.85rem
- **Status:** Status chip (pending/in-progress/completed/rated)
- **Points:** `+${points}` or `-`, Inter 0.85rem, `#00E5FF` if > 0
- **Action:**
  - If pending/in-progress: Success button "Mark Complete", small size
  - If completed: Muted text "Awaiting rating", Inter 0.8rem, `#4A4A6A`
  - If rated: Empty or checkmark

### Empty State
- Single row spanning all columns
- Centered text: "No tasks found", `#4A4A6A`, padding 32px

---

## PAGE 4: LEADERBOARD (`leaderboard.html`)

### Layout
- Nav bar
- Page title: "Hunter Rankings" — h2, margin-bottom 20px
- Tab bar below title (margin-bottom 20px)
- Leaderboard list below

### Tabs
- 2 tabs: "This Week" | "This Month"
- Active tab: `#4FC3F7` text, bottom border 2px `#4FC3F7` with glow shadow
- Inactive: `#8A8AA3`
- Font: Inter 500, 0.85rem
- Padding: 10px 20px

### Leaderboard Rows
Each row is a card-like container:
- Display: flex, align-items center, gap 16px
- Padding: 16px
- Border-radius: 8px
- Margin-bottom: 8px

**Top 3 Styling:**
- Background: `#12121F`
- Border: 1px with rank color at 30% opacity
  - #1: Gold `#FFD700`
  - #2: Silver `#C0C0C0`
  - #3: Bronze `#CD7F32`
- Box-shadow: `0 4px 20px rgba(0,0,0,0.3)`

**Non-top rows:**
- Background: `#0D0D1A`
- Border: 1px `rgba(79,195,247,0.1)`

**Row Content (left to right):**
1. **Position number:** Bebas Neue, 1.5rem, width 40px, text-align center. Top 3 get their medal color, others `#4A4A6A`
2. **Rank badge:** 36×36px compact version
3. **Name block (flex:1):**
   - Name: Inter 600, 0.95rem, `#E8E8F0`
   - Username: Inter 0.75rem, `#8A8AA3`
4. **Points block (text-align right):**
   - Value: Bebas Neue, 1.4rem, `#00E5FF`
   - Label: Inter 0.7rem, `#4A4A6A`, "pts"
5. **Hero badge** (if applicable): Inline, right of points

---

## PAGE 5: POINT LOG (`point-log.html`)

### Layout
- Nav bar
- Page title: "Point History" — h2, margin-bottom 20px
- Full-width table container

### Table Structure
- 5 columns: Date & Time | Category | Points | Reason | Logged By
- Header: standard data-table header style
- Rows:
  - Date: Formatted full datetime, Inter 0.85rem
  - Category: Chip with event_type color (earn = teal style, deduct = red style)
  - Points: Bebas Neue 1.1rem, `#00E5FF` (positive) or `#FF1744` (negative), with +/- prefix
  - Reason: Inter 0.85rem, `#E8E8F0`
  - Logged By: `ID:${logged_by}`, Inter 0.85rem, `#8A8AA3`

### Empty State
- Centered: "No point history found", `#4A4A6A`, padding 32px

---

## PAGE 6: RULES (`rules.html`)

### Layout
- Nav bar
- Title: "System Quest Board" — h2, margin-bottom 8px
- Subtitle: "The rules that govern the Vitals&Vectors world. Violations have consequences." — Inter 0.9rem, `#8A8AA3`, margin-bottom 24px
- Content: 2-column grid, gap 20px

### Rule Section Cards
Each card contains one rules category:
- Card header: Icon + Category name — h3, Bebas Neue, `#4FC3F7`, margin-bottom 12px, border-bottom 1px `rgba(79,195,247,0.1)`, padding-bottom 8px
- List: no bullets, padding 0
- Each list item:
  - Padding: 8px 0
  - Border-bottom: 1px `rgba(79,195,247,0.05)`
  - Font: Inter 0.9rem, `#8A8AA3`
  - **Bullet:** `▸ ` prefix in `#4FC3F7`
  - **Bold text:** Inter 600, `#E8E8F0` (used for numbers and key terms)

### Categories (6 cards):
1. **⚡ Point Earning** — Start at 100, task ratings, streaks, weekly bonus
2. **⚠️ Deductions** — Late submissions, missed deadlines, absences, dress code, behavior
3. **🏆 Ranks & Titles** — E through SS with point thresholds and titles
4. **🔥 Streaks & Rewards** — Hero of Week/Month, warnings, monthly reset, carry forward
5. **📋 Task Management** — Assignment flow, completion, rating process
6. **⏰ Attendance** — Working hours, flex days, attendance logging placeholder

### Mobile
- Grid collapses to single column

---

## PAGE 7: ADMIN DASHBOARD (`admin/dashboard.html`)

### Layout
- Nav bar (admin variant: Dashboard | Admin | Members | Tasks)
- Page title: "Command Center" — h2, margin-bottom 20px
- Two sections stacked:
  1. Alerts panel card
  2. Team overview card

### Alerts Panel Card
- Card header: "⚠ Active Alerts"
- Content: Stack of alert-panel components
- Each alert:
  - Icon: `⚠` in `#FF1744`, 1.2rem
  - Text: Inter 0.85rem, `#8A8AA3`
  - Examples: "X is below 100 pts", "X has 2 warnings"
- If no alerts: "No active alerts" in `#4A4A6A`

### Team Overview Card
- Card header: "👥 Team Overview" + "Manage Members" secondary button (right)
- Full-width data table
- Columns: Rank | Name | Total | Week | Streaks | Status | Actions
- **Rank:** Compact rank badge (32×32px)
- **Name:** Inter 0.85rem
- **Total / Week:** Inter 0.85rem, centered-ish
- **Streaks:** `${presence}w / ${reporting}w`, Inter 0.85rem
- **Status:** Status chip
- **Actions:** Three buttons inline with 4px gaps:
  - "+Points" — Secondary button, small
  - "-Points" — Danger button, small
  - "Warn" — Secondary button, small

### Modals (shared across admin pages)

#### Points Modal
- Title: "Add Points" or "Deduct Points" depending on context
- Fields:
  - Member name (read-only display box, `#12121F` background)
  - Points (number input, required, min 1)
  - Category (select: Bonus, Streak, Adjustment, Penalty)
  - Reason (text input, required)
- Submit: Primary button, full width, "Confirm"

#### Warning Modal
- Title: "Issue Warning"
- Fields:
  - Member name (read-only)
  - Reason (textarea, 3 rows, required)
- Submit: Danger button, full width, "Issue Warning"

---

## PAGE 8: MEMBER MANAGEMENT (`admin/members.html`)

### Layout
- Nav bar (admin variant)
- 2-column grid: 320px sidebar | 1fr main content, gap 20px

### Left Sidebar: Add Hunter Card
- Card header: "➕ Add Hunter"
- Form fields stacked:
  - Full Name (text input)
  - Username (text input)
  - Password (text input — note: shown as plain text for admin creation ease, or use password type)
  - Role (select: Member, U5 Coordinator, Admin)
- Submit: Primary button, full width, "Create Hunter"

### Right: All Hunters Card
- Card header: "👥 All Hunters"
- Full-width data table
- Columns: Name | Username | Role | Rank | Points | Status | Actions
- **Role:** Inter 0.85rem, `#E8E8F0`
- **Actions:** "Edit" (secondary small) + "Deactivate" (danger small)
- Empty state: "No members found"

---

## PAGE 9: TASK ASSIGNMENT (`admin/assign-tasks.html`)

### Layout
- Nav bar (admin variant)
- 2-column grid: 320px sidebar | 1fr main content, gap 20px

### Left Sidebar: Assign Quest Card
- Card header: "➕ Assign Quest"
- Form fields:
  - Title (text input, required)
  - Duration in hours (number input, step 0.5, min 0)
  - Deadline (datetime-local input)
  - Priority (select: Low, Medium, High)
  - Assign To (select dropdown, populated with member list: "Name (username)")
- Submit: Primary button, full width, "Assign Task"

### Right: Active Quests Card
- Card header: "📋 Active Quests"
- Full-width data table
- Columns: # | Title | Assigned To | Deadline | Priority | Status | Rate
- **Priority:** Chip (low=muted, medium=blue, high=red)
- **Rate column:**
  - If status === completed: Dropdown select with options:
    - "Rate..." (default)
    - "Needs Revision (+3)"
    - "Meets Expectation (+5)"
    - "Exceeds Expectation (+8)"
  - Otherwise: `-`
- On select change: Auto-submits rating, shows toast, refreshes page

---

# PART 3: INTERACTION & STATE SPECIFICATIONS

## Hover States
- **Cards:** Border brightens to `rgba(79,195,247,0.4)`, glow shadow appears, translateY(-2px), top accent line fades in
- **Table rows:** Background shifts to `rgba(79,195,247,0.03)`
- **Nav links:** Color → `#4FC3F7`, border appears, subtle background
- **Buttons:** See component section above
- **Rank badges:** Glow intensifies slightly

## Focus States
- **Inputs:** Border `#4FC3F7`, blue glow shadow, outline removed
- **Buttons:** Same as hover plus subtle inner shadow

## Active / Pressed States
- **Buttons:** Scale 0.98, slightly darker
- **Nav links:** Background `rgba(79,195,247,0.1)`

## Loading States
- **Buttons:** Text changes to action + "...", opacity 0.7, disabled cursor
- **Pages:** Full-screen overlay with "SYSTEM INITIALIZING..." text (Bebas Neue, `#4FC3F7`, pulse-glow animation) + animated gradient bar

## Empty States
- Centered vertically and horizontally within container
- Icon: 3rem, `#4A4A6A`, opacity 0.5
- Text: Inter 0.9rem, `#4A4A6A`
- No borders or backgrounds — clean negative space

## Disabled States
- Opacity: 0.5
- Cursor: not-allowed
- No hover effects

---

# PART 4: CONTENT DATA MAPPING

## Member Dashboard Content Sources
| UI Element | API Endpoint | Field |
|---|---|---|
| Rank badge | `GET /members/{id}` | `rank` |
| Rank label | Derived | `getRankLabel(rank)` |
| Total points | `GET /members/{id}` | `points_total` |
| Progress bar | Derived | `getRankProgress(points, rank)` |
| Next rank text | Derived | `getNextRankThreshold(rank)` |
| Presence streak | `GET /members/{id}` | `streak_presence` |
| Reporting streak | `GET /members/{id}` | `streak_task_reporting` |
| Week earned | `GET /members/{id}` | `points_this_week` |
| Month total | `GET /members/{id}` | `points_this_month` |
| Today's tasks | `GET /tasks/today` | Array |
| Recent logs | `GET /points/logs` | Last 10 |
| Position | `GET /leaderboard/weekly` | Index of member |

## Admin Dashboard Content Sources
| UI Element | API Endpoint |
|---|---|
| Team table | `GET /members/` |
| Alerts | Derived from member list (points < 100, warnings >= 2) |
| Add points | `POST /points/add` |
| Deduct points | `POST /points/deduct` |
| Issue warning | `POST /warnings/` |

## Task Assignment Content Sources
| UI Element | API Endpoint |
|---|---|
| Assignee dropdown | `GET /members/` |
| Task list | `GET /tasks/` |
| Create task | `POST /tasks/` |
| Rate task | `PUT /tasks/{id}` |

---

# PART 5: ACCESSIBILITY & CONSIDERATIONS

- All interactive elements have visible focus states (blue glow)
- Color is not the sole indicator — icons and text accompany status chips
- Tables are wrapped in scrollable containers for mobile
- Modals trap focus while open
- Toast notifications are screen-reader friendly (single live region)
- Sufficient contrast ratios maintained (text `#E8E8F0` on `#0D0D1A` ≈ 12:1)

---

*End of Design Specification v2.0*
