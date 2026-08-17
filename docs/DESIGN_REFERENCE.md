# Vitals&Vectors — Design Reference Document
## For Image Generation & Visual Design Agents
### Read this before generating any UI mockup or page design

---

## WHAT THIS PORTAL IS (IN ONE SENTENCE)

A dark, futuristic team monitoring dashboard for a research lab — inspired by the visual language of the Solo Leveling manhwa — where anyone can publicly view team members' points, tasks, ranks, and progress in real time.

---

## THE OVERALL FEELING

Imagine a system that looks like it was designed inside a video game. Dark, moody, high-contrast. Every element glows faintly. The interface feels alive — like a sci-fi command terminal crossed with a game HUD. It is clean and minimal but never flat. There is always a subtle sense of depth, energy, and importance.

Think: a military operations monitor, or the ranking screen from an RPG game, running on a high-end gaming PC at night.

---

## COLOR PALETTE — DESCRIBED VISUALLY

**Background:** Near-black with a very slight navy tint. Not pure black — there is a faint blue undertone. Imagine the deep darkness of outer space with a distant blue star.

**Surface / Cards:** Slightly lighter than the background. Dark navy-black panels that appear to float above the background. Cards have a visible edge — a thin line of electric blue at very low opacity.

**Primary glow — Electric Blue:** A bright, vivid cyan-blue (#4FC3F7). This is the main accent color. It appears on active links, borders on hover, selected items, chart bars, and highlighted values. It has a glow effect — like a neon sign — subtle but present.

**Secondary glow — Purple:** A rich violet-purple (#9A7BFF). Used for rank badges (especially top ranks), special achievements, and secondary highlights. When electric blue is the primary energy, purple is the mystical power behind it.

**Success / Earn — Neon Teal:** A bright aqua-teal (#00E5FF). Used exclusively for positive values — points earned, completed tasks, upward trends. It is brighter and more saturated than the electric blue.

**Danger / Deduct — Blood Red:** A vivid red (#FF1744). Used for point deductions, violations, danger states. It does not appear often — when it does, it demands attention.

**Warning — Amber:** A warm amber-gold (#FFB300). Used for pending states, caution, flex days, warnings.

**Hero Gold:** A rich metallic gold (#FFD700). Only used for the #1 position, Hero of Week badges, and top-rank highlights. It should feel like an award, not a warning.

**Text:** Bright off-white (not pure white) for primary content. Muted blue-gray for secondary labels. Very dark blue-gray for timestamps and tertiary info.

---

## BACKGROUND TEXTURE

The background is not a flat color. It has two layers on top of the dark base:

1. **Grid lines:** An extremely faint grid of thin lines — like graph paper — in a very dark electric blue. The grid squares are about 50px. You can barely see them. They give the impression of a technical schematic or a radar screen.

2. **Radial glow from top-center:** A large, soft radial gradient centered at the very top-center of the screen. It radiates a faint electric blue light downward, like a light source far away. It creates depth — the top feels energized, the bottom fades to darkness.

Together these create the feeling of a technical monitoring station — like you are looking at a live control room display.

---

## TYPOGRAPHY — DESCRIBED VISUALLY

**Display / Page Titles:** Large, bold, condensed uppercase letters. Wide letter-spacing. The kind of text you see on a movie poster or a game title screen. Sharp, angular, confident. Examples: "COMMAND CENTRE", "HUNTER RANKINGS", "TASK OVERVIEW".

**Body text:** Clean, modern sans-serif. Small, highly readable. Used for descriptions, table content, labels. No decorative features — purely functional.

**System labels / Category tags:** A technical-looking font, slightly condensed, uppercase, with wide letter-spacing. Used for small labels like "WEEKLY POSITION", "POINTS THIS WEEK", navigation items. Feels like a military readout or a radar label.

---

## SIDEBAR — LEFT NAVIGATION

A tall, narrow vertical strip on the left side of every page. Dark navy background, slightly lighter than the main background. A faint electric blue line runs along its right edge.

**Collapsed state (narrow):** Only icons visible, centered in the strip. About 56px wide.

**Expanded state:** Icons on the left, text labels beside them. About 220px wide.

**Logo area (top):** "V&V" in electric blue display font. "Vitals&Vectors" in small muted text below. Simple, no embellishment.

**Navigation items:** Listed vertically. Each item has a small icon (line art, minimal) and a text label. Active item has a vivid electric blue left border (3px), blue-tinted background, and blue text. Inactive items are muted gray. Hover state brightens them slightly.

**Bottom section:** A circular avatar with the user's initials, their name, role label, and a small hexagonal rank badge. Below that, a logout link. Below that, a small collapse/expand button.

**Admin panel link:** Appears at the very bottom of the nav list, slightly separated by a divider line. Styled in a muted red to indicate elevated access.

---

## CARDS

The fundamental building block of every page. Rectangular panels with:
- Dark navy-black background
- Very thin electric blue border at very low opacity (barely visible)
- Slightly rounded corners (8px radius)
- On hover: border brightens to a more visible electric blue, card lifts slightly upward (2px), a faint blue glow appears around the edges, and a thin gradient line appears along the top edge of the card (transparent → electric blue → transparent)

Cards feel like panels on a spaceship dashboard — functional, slightly luminous, elevated.

---

## STAT CARDS (small summary metrics)

Short, wide cards arranged in a horizontal row, usually 4 across. Each has:
- A 3px vertical colored bar on the far left edge (each card has a different accent color: blue, teal, purple, amber)
- A small label in muted uppercase text ("WEEKLY POSITION", "POINTS THIS WEEK")
- A large number below in the display font
- The number color matches the card's accent color

---

## RANK BADGE (hexagon shape)

A hexagonal shape — six sides, like a honeycomb cell. Used everywhere to show a member's rank. The hexagon has:
- A colored border matching the rank
- A very low opacity fill of the same color
- The rank letter(s) inside in the display font

**Rank color guide (visual description):**
- E rank: Gray. Muted. Unremarkable. The color of concrete.
- D rank: Bronze-brown. Warm but dull. A starting achievement.
- C rank: Silver-gray. Cooler tone. Getting serious.
- B rank: Electric blue. Bright, confident. Clearly capable.
- A rank: Gold. Warm, prestigious. Close to the top.
- S rank: Bright teal/cyan. Glowing. Elite level.
- SS rank: Purple. Pulsing glow animation. The highest possible. Feels almost supernatural.

---

## TEAM BAR CHART (appears on dashboard)

A horizontal bar chart showing all team members' points side by side.

- Each bar is colored according to the member's rank color
- The bars have a gradient fill (slightly lighter at the top, darker at the bottom)
- Above each bar: a small circular avatar showing the member's initials, bordered in the rank color
- Inside each bar (or above it): the point value in white text
- The chart background has very faint horizontal grid lines in the darkest possible blue
- Dashed horizontal lines mark the rank thresholds (D rank at 100, B rank at 200, S rank at 300, SS rank at 400) with tiny labels on the right
- Y-axis: point values, muted text
- X-axis: member first names, muted text

The overall effect is like a game's "top players" screen — competitive, colorful, clear.

---

## PODIUM (appears on leaderboard)

Three large cards arranged side by side — #2 on the left, #1 in the center (taller), #3 on the right.

**#1 card (gold):**
- Gold border with a faint gold glow
- Gold gradient from top fading to dark
- A thin gold line runs across the very top edge
- A decorative wing/feather SVG pattern behind the avatar (very faint, gold-colored)
- Large circular avatar with gold border and glow
- "HERO OF WEEK" badge in the top-right corner — gold background, crown icon
- Member name in large display font
- Points in large gold display font

**#2 card (blue/silver):**
- Blue border, blue wings, blue avatar
- Similar layout but slightly smaller than #1
- No hero badge unless they qualify

**#3 card (bronze):**
- Bronze/amber border, bronze wings, bronze avatar
- Smallest of the three
- "HERO OF MONTH" badge if member has 300+ pts — purple star badge in top-right corner

The podium feels like a game's victory screen — dramatic, celebratory, glowing.

---

## TABLES

Clean, dark tables. No zebra striping. Rows separated by an extremely faint blue line.

**Header row:** Slightly elevated dark background. Uppercase muted text in the technical label font. Wide letter spacing. Small text.

**Data rows:** On hover, a very faint blue tint covers the row.

**Position column:** Large display font number. A 3px colored vertical bar on the far left of the cell, color-coded by rank.

**Member name cell:** Small circular avatar (initials) + name beside it. The avatar has a colored border matching rank.

**Points column:** Display font, teal color, glowing.

**Status chips (inline badges in tables):**
Small pill-shaped labels. Each has a colored background at very low opacity, a colored border, and colored text — all matching:
- Pending: amber
- In Progress: electric blue
- Completed: teal
- Rated: purple
- Late: amber
- Absent: red

---

## KANBAN BOARD (appears on project page)

Three columns side by side: Pending (left), In Progress (center), Completed/Rated (right).

Each column has:
- A colored header label matching status color
- A count in parentheses
- Task cards stacked vertically below

**Task card:**
- Dark elevated panel
- A 2px colored line across the very top edge (the project's color)
- Priority chip in top-left (High = red, Medium = blue, Low = muted)
- Task title in bold white
- "Assigned to: [avatar] Name" row
- Due date and duration in small muted text
- Status chip at the bottom

---

## MODALS (pop-up forms)

When an admin takes an action (add member, log points, issue warning), a modal appears:

- Dark overlay behind (semi-transparent black)
- Modal card centered on screen, same card style as the rest of the UI
- A thin colored line at the very top of the modal
- Title in display font
- Form fields: dark input backgrounds, electric blue border on focus, glow effect on focus
- Buttons: primary = gradient fill (blue to teal), text is near-black. Secondary = transparent with blue border.

---

## TOAST NOTIFICATIONS (bottom-right corner)

Small, wide pill-shaped notifications that appear in the bottom-right of the screen and disappear after a few seconds. Slide up on appear.

- Success: teal border + teal text + very dark teal tint background
- Error: red border + red text + very dark red tint background
- Info: blue border + blue text + very dark blue tint background
- Warning: amber border + amber text + very dark amber tint background

---

## MEMBER AVATAR STYLE

Used in tables, filter rows, sidebar bottom, and above chart bars.

- Circle shape
- Background: rank color at very low opacity (~10%)
- Border: rank color at medium opacity
- Content: member initials in the display font, colored to match rank
- Sizes: 22px (tiny filter pills), 28px (tables), 30px (table hunter cell), 64px (podium), 72px (profile page)

---

## ATTENDANCE PAGE

Displays team members' daily check-in records in a style matching the Premises app format.

**Today's summary:** A grid of member cards — one per member — showing name, check-in time, and a status chip (PRESENT = solid teal fill, white text; LATE = amber; ABSENT = red outline).

**Member detail modal:** Opens when you click a member card. Shows a table with columns: Date / Check-In / Check-Out / Duration / Status. Status chips are solid filled (PRESENT = teal, OVERRIDE = purple outline). Pagination at the bottom: "Total Records: N | Page X of Y".

---

## HERO BADGES

Two special badges that appear on the leaderboard and dashboard:

**Hero of Week:**
- Gold colored
- Crown icon
- Text: "HERO" (large) + "OF WEEK" (small below)
- Appears as a corner badge on the #1 podium card
- Gold glow

**Hero of Month:**
- Purple colored
- Star icon
- Text: "HERO" (large) + "OF MONTH" (small below)
- Appears on any member with 300+ points in the monthly view
- Purple glow, subtle pulse animation

---

## PLACEHOLDER BANNERS

When a feature is not yet connected to a live data source, an amber/yellow banner appears at the top of the relevant section:

- Amber background at very low opacity
- Amber border on the left side (3px vertical line)
- Warning icon (⚠)
- Text: "Data shown is mock. Live data from [Source Name] pending."
- Full width of the content area
- Does not block or overlap any content

---

## PAGE-BY-PAGE LAYOUT SUMMARY

### Login page
Full viewport. No sidebar. Dark background with grid texture and radial glow. A single card centered on screen (max 520px wide). Inside: lab name at top, subtitle, a system tag pill, username + password fields, submit button. Corner cut decorators (thin L-shaped lines) at all four corners of the card.

### Dashboard
Sidebar left + scrollable main content right.
Top: Page title "COMMAND CENTRE" + system online pill (top right).
Then: 4 stat cards in a row.
Then: Wide rank card (hexagon badge + rank title + progress bar + total points).
Then: Full-width team bar chart.
Bottom: Two columns — today's tasks (left) + recent point activity (right).

### All Tasks
Sidebar left + split layout.
Left panel (narrow): Filter sidebar with search box and filter groups.
Right panel (wide): 4 stat cards + full-width table with all tasks.

### Project page
Sidebar left + scrollable main.
Top: Back button + project name.
Then: Project info card (colored accent, lead info, member avatars, progress bar).
Then: 3-column kanban board.

### Hunter (member profile) page
Sidebar left + scrollable main.
Top: Back button + member name.
Then: Profile card (large avatar, name, role, 4 stat numbers).
Then: Row of project pills this member belongs to.
Then: Full-width task table with tab filters.
Then: Points summary card.

### Point Log
Sidebar left + scrollable main.
Top: Page title + subtitle.
Then: Category filter chips.
Then: Member selector row (scrollable pills, one per member).
Then: 3 stat cards.
Then: Full-width table with all point events (all members visible).
Then: Pagination.

### Leaderboard
Sidebar left + scrollable main.
Top: Page title + scoring period badge.
Then: Two tabs (This Week / This Month).
Then: 3-card podium (#2 left, #1 center tall, #3 right).
Then: Full-width table (positions 4 and below).
Then: Legend bar at bottom.

### Attendance
Sidebar left + scrollable main.
Top: Page title + placeholder amber banner.
Then: Today's date + grid of member presence cards.
When member card clicked: modal overlay with attendance history table.

### Admin Dashboard
Sidebar left + scrollable main.
Top: Page title + alert count banner (if any alerts).
Then: 3 quick-stat alert cards.
Then: Full-width team overview table.
Then: Two-column section — alerts list (left) + heroes panel (right).

### Admin Members
Sidebar left + two-column layout.
Left (narrow): Add Hunter form.
Right (wide): All members table with edit/deactivate actions.

### Admin Assign Tasks / Rate Tasks
Sidebar left + two-column layout.
Left (narrow): Assign task form (project → lead auto-fill → member).
Right (wide): Active tasks table with rating dropdowns for completed tasks.

---

## WHEN GENERATING AN IMAGE FOR A SPECIFIC PAGE

1. Apply the dark background with grid texture and top radial glow — always.
2. Include the left sidebar in its expanded state (220px wide).
3. Mark the correct nav item as active (blue left border + blue text).
4. Apply all card styles (dark panels, faint borders, subtle hover glow).
5. Use real team member names: Ganesh, Deepavali, Debaditya, Swapnil, Nikita, Santosh, Vedant, Nakul, Ashutosh, Nandini, Prerna, Prem, Komal, Shreya, Vishal, Suraj, Krishna, SAB.
6. Use real project names: MindSpace, NeuroVisualisAI, NutriSure, SoloBeauty, SkillSense, LMS, Website, LinkedIn/Social Media, E-Zest, Fun Day, Demo Day, Learning Time, Premises.
7. Never show fictional names. Never show placeholder "Lorem ipsum" text.
8. Show realistic point values — members range from ~45 pts to ~320 pts total.
9. The portal name is always "Vitals&Vectors" (with & symbol, not "and").
10. Short name is "V&V" — always with & symbol.

---

*This document is for design and image generation use only.*
*For coding and architecture, refer to SYSTEM_CONTEXT.md.*
