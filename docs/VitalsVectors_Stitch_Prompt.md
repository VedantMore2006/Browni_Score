# Vitals&Vectors — Google Stitch Frontend Prompt
## Complete UI Design Brief v1.0

---

## GLOBAL DESIGN SYSTEM

### Theme
Dark system UI inspired by Solo Leveling manhwa. The UI must feel like a futuristic monitoring system — dark navy/black backgrounds, electric blue as the primary accent, purple as the secondary accent, glowing borders, sharp edges. It should feel alive and slightly dangerous, not corporate.

### Color Palette
```
Background (deepest):   #0A0A0F
Panel / card bg:        #0D0D1A
Elevated panel:         #12121F
Hover state:            #1A1A2E

Primary accent (blue):  #4FC3F7  — glow: rgba(79,195,247,0.3)
Secondary accent (purple): #9A7BFF — glow: rgba(124,77,255,0.3)
Success / earn:         #00E5FF  — neon teal
Danger / deduct:        #FF1744  — blood red
Warning:                #FFB300  — amber
Gold (hero):            #FFD700

Text primary:           #E8E8F0
Text secondary:         #8A8AA3
Text muted:             #4A4A6A

Border default:         rgba(79,195,247,0.1)
Border hover/glow:      rgba(79,195,247,0.4)
```

### Typography
```
Display / headings:     Bebas Neue — uppercase, letter-spacing 0.05em
Body text:              Inter — clean, readable
System labels:          Rajdhani — mono feel, uppercase, letter-spacing 0.15em
```

### Cards
- Background: `#0D0D1A`
- Border: `1px solid rgba(79,195,247,0.1)`
- Border-radius: `8px`
- On hover: border brightens to `rgba(79,195,247,0.4)`, subtle glow `box-shadow: 0 0 20px rgba(79,195,247,0.15)`, translateY(-2px)
- Top accent line: 1px gradient line (transparent → #4FC3F7 → transparent) appears on hover at card top

### Buttons
- Primary: gradient fill `linear-gradient(135deg, #4FC3F7, #00E5FF)`, dark text `#0A0A0F`
- Secondary: transparent bg, `1px solid rgba(79,195,247,0.4)`, text `#4FC3F7`
- Danger: transparent bg, `1px solid #FF1744`, text `#FF1744`. Hover: fills red
- Small variant: same rules, padding 4px 12px, font-size 0.75rem

### Rank System (for badges throughout the app)
```
E  — Unranked Hunter   — color #8A93A8 (gray)
D  — Bronze Hunter     — color #CD7F32 (bronze)
C  — Iron Hunter       — color #B0B0B0 (silver-gray)
B  — Silver Hunter     — color #4FC3F7 (blue)
A  — Gold Hunter       — color #FFD700 (gold)
S  — Platinum Hunter   — color #00E5FF (teal)
SS — Shadow Monarch    — color #9A7BFF (purple), pulsing glow animation
```
Rank badge shape: hexagonal clip-path polygon, border = rank color, glow = rank color at 40% opacity

### Status Chips
- Pending:    amber tint bg + amber border
- In Progress: blue tint + blue border
- Completed:  teal tint + teal border
- Rated:      purple tint + purple border
- Suspended:  red tint + red border
- Present:    teal fill, white text (matching Premises app style)
- Late:       amber fill, dark text
- Absent:     red tint + red border

### Background texture
Body background: deep black `#0A0A0F` with a 50px grid of faint blue lines `rgba(79,195,247,0.025)` and a radial gradient from top-center `rgba(79,195,247,0.06)` fading to transparent at 65%. Fixed attachment.

---

## GLOBAL LAYOUT

### Shell
Two-column layout: collapsible left sidebar + scrollable main content area.

### Sidebar — COLLAPSIBLE
- **Expanded width:** 220px
- **Collapsed width:** 56px (icon-only mode)
- **Toggle:** a small chevron button at the bottom of the sidebar. Clicking it collapses/expands.
- **Collapsed state:** only Nerd Font icons are visible, no text labels, icons centered
- **Expanded state:** icon + text label side by side
- Background: `#0D0D1A`
- Right border: `1px solid rgba(79,195,247,0.1)`
- Transition: `width 0.25s ease`, content fades

#### Sidebar structure (top to bottom):
```
[LOGO AREA]
◈  V&V  (expanded) / ◈ (collapsed)
Logo uses Bebas Neue, blue glow

[NAV LINKS] — uses Nerd Font icons
  nf-md-view_dashboard      Dashboard
  nf-md-checkbox_multiple   Tasks
  nf-md-history             Point log
  nf-md-trophy              Leaderboard
  nf-md-calendar_clock      Attendance    ← coord + admin only
  nf-md-book_open_variant   Rules

[DIVIDER]

  nf-md-cog                 Settings

[DIVIDER — admin only]

  nf-md-shield_crown        Admin panel   ← admin only, red tint

[BOTTOM SECTION]
User avatar circle (initials), name, role, rank badge
Logout icon button (nf-md-logout)
```

#### Active nav link style:
- Background: `rgba(79,195,247,0.08)`
- Left border: `3px solid #4FC3F7`
- Text/icon color: `#4FC3F7`
- Collapsed: only the left border + icon color changes

#### Hover nav link:
- Background: `rgba(79,195,247,0.04)`
- Icon/text → `#E8E8F0`

---

## PAGE 1: LOGIN (`index.html`)

### Layout
Full-viewport centered. No sidebar. Dark background with grid texture.

### Login card
- Max-width: 420px, centered
- Background: `#0D0D1A`
- Border: `1px solid rgba(79,195,247,0.1)`
- Border-radius: 12px
- Padding: 48px 40px
- Top: 2px gradient accent line (transparent → #4FC3F7 → #9A7BFF → transparent)
- Fade-in animation on load

### Content inside card (top to bottom)
1. Logo: "VITALS&VECTORS" — Bebas Neue 2rem, `#4FC3F7`, text-glow `0 0 20px rgba(79,195,247,0.3)`. Centered.
2. Subtitle: "// MONITORING SYSTEM ONLINE" — Rajdhani 0.7rem, `#4FC3F7`, uppercase, letter-spacing 0.2em, centered
3. System tag pill: "SYSTEM AUTHENTICATION REQUIRED" — same Rajdhani style, `rgba(79,195,247,0.1)` bg, blue border, border-radius 20px, centered, margin-bottom 24px
4. Username field — label "Username", placeholder "Enter hunter ID"
5. Password field — label "Password", placeholder "Enter access key"
6. Submit button — full width, primary gradient style, text "INITIALIZE SESSION", padding 14px
7. Error message area below button (red text, hidden by default)

---

## PAGE 2: DASHBOARD (`dashboard.html`)

### Layout
Sidebar + main content. Main content scrollable.

### Page header
- Left: "Command Centre" — Bebas Neue 2.8rem, uppercase
- Right: small system tag "// SYSTEM ONLINE" in teal pill

### Section 1: 4-stat strip
4 equal-width cards in a row, gap 16px.
Each card has a 3px vertical left accent bar.

```
Card 1 — "Weekly Position"   — accent: blue   — value: #1 (or —)
Card 2 — "Points This Week"  — accent: teal   — value: +70 (teal color)
Card 3 — "Points This Month" — accent: purple — value: 320
Card 4 — "Streaks"           — accent: amber  — value: 4w (presence + task, stacked)
```

Value uses Bebas Neue 2.2rem. Label uses Inter 0.7rem uppercase muted.

### Section 2: Rank card (full width)
A single wide card showing the logged-in user's rank status.

Layout inside: flex row
- LEFT: Rank hexagon badge (72px), rank title, rank label, progress bar to next rank, pts-to-next text
- RIGHT: "Total Points" label + large teal number (Bebas Neue 2.8rem)

Progress bar: gradient fill (blue → teal), shimmer animation, 6px height.

### Section 3: Team Hunter Chart (full width)
A bar chart of ALL team members ranked by total points.

Specifications:
- Y axis: Points (0 to max+50). Faint dashed threshold lines at 100 (D), 200 (B), 300 (S/Hero), 400 (SS) with tiny labels
- X axis: First name of each member
- Bars: colored by each member's rank color (E=gray, D=bronze, C=silver-gray, B=blue, A=gold, S=teal, SS=purple)
- Bar top-radius: 6px
- Above each bar: circular avatar (28px diameter) showing member initials in Bebas Neue, filled with rank color at 20% opacity, bordered with rank color
- Hover tooltip: dark panel showing member name, total points, rank label — appears near the bar
- Chart height: 320px
- No legend needed (rank colors explained in the rank section)
- Background grid lines: `rgba(79,195,247,0.04)` horizontal only

### Section 4 (bottom row, 2 columns)
#### Left: Today's Tasks card
- Header: "Today's Quests" + "View all" small secondary button
- List of tasks due today: title, duration, deadline, status chip
- Empty state: "No quests due today"

#### Right: Recent Point Activity card
- Header: "Recent Activity" + "View all" small secondary button
- List of last 8 point events: reason, time-ago, +/- points (teal for earn, red for deduct)
- Empty state: "No recent activity"

---

## PAGE 3: TASK MANAGER (`tasks.html`)

### Layout
Sidebar + main. Full-width table.

### Page header
"Task Manager" + for coordinators/admin: "Assign Task" primary button top right

### Tab bar (below header)
Two tabs: "My Tasks" | "All Tasks" (all tasks tab — coordinator/admin only)

### Table columns
```
Sr. No. | Task Title | Duration | Deadline | Assigned By | Priority | Status | Points | Action
```

- Priority chips: High = red, Medium = blue, Low = muted
- Status chips: standard chip system
- Action column:
  - If pending/in_progress → "Mark Complete" success small button
  - If completed → "Awaiting rating" muted italic text
  - If rated → points awarded shown in teal

### Assign Task modal (coordinator/admin)
Slides in from right or appears as centered modal.
Fields: Title, Duration (hrs), Deadline (datetime), Priority (select), Assign To (member dropdown)
Submit: "Assign task" primary button

### Rate Task (coordinator/admin, in All Tasks tab)
Each completed task row shows a rating dropdown:
- "Rate task..." (default)
- "Needs revision (+3 pts)"
- "Meets expectation (+5 pts)"
- "Exceeds expectation (+8 pts)"
On select: auto-submits, shows toast, row updates

---

## PAGE 4: POINT LOG (`point-log.html`)

### Layout
Sidebar + main. Full-width.

### Page header
"Point History"

### Filter bar
Row of filter chips: All | Attendance | Task | Learning | Content | Streak | Conduct

### Table columns
```
Date & Time | Category | Points | Reason | Logged By
```

- Category: chip with category color (task=blue, attendance=amber, learning=purple, content=teal, conduct=red)
- Points: Bebas Neue, +N in teal or −N in red
- Logged By: member name

### Summary row (above table)
Three small stat cards: Total Earned This Month | Total Deducted This Month | Net Balance

---

## PAGE 5: LEADERBOARD (`leaderboard.html`)

### Layout
Sidebar + main.

### Page header
"Hunter Rankings"

### Tab bar
"This Week" | "This Month"

### Top 3 podium (above the list)
Three large cards side by side for #1, #2, #3.
- #1 center, slightly taller
- Gold/Silver/Bronze border and glow
- Shows: rank badge, name, points, hero badge if applicable

### Leaderboard list (below podium, ranks 4+)
Each row: position number | rank badge | name | points this period | streak | hero badge (if any)
- Top 3 rows highlighted (gold/silver/bronze tint)
- Current user row: blue tint highlight + "You" label

### Hero badges
- Hero of Week: gold badge on highest scorer
- Hero of Month: purple badge on anyone with 300+ pts

---

## PAGE 6: ATTENDANCE (`attendance.html`)

### Access
Visible to all members. Coordinators and admins can also log/override.

### Layout
Sidebar + main. Two sections stacked.

### Section 1: Today's Summary card (full width)
Shows today's date prominently.
A row of member presence cards — one per member:
```
[Avatar circle] [Name] [Check-in time or —] [Status chip: Present / Absent / Late]
```
Chips:
- PRESENT: teal fill, white text (matching Premises app style)
- LATE: amber fill, dark text (reported after 11:30 AM without using a flex day)
- ABSENT: red tint + border
- NOT RECORDED: muted gray

Coordinator/Admin: each card has a small "Log" button to manually record attendance.

### Section 2: Member Attendance Detail (click to open)
When a member card in Section 1 is clicked:
A **modal overlay** slides up or appears centered.

#### Modal header
- Member name (Bebas Neue, large)
- Role + rank badge
- Close button (×, top right)

#### Modal content: Attendance History
Matches Premises app data format exactly:

**Filter bar inside modal:**
- Pills/tabs: Today | Past Week | Past Month | Custom Range

**Table inside modal:**
```
Date | Check-In | Check-Out | Duration | Status
```
Matching the Premises app screenshot:
- Date format: YYYY-MM-DD
- Check-In: HH:MM (24h)
- Check-Out: HH:MM or --:-- if not yet checked out
- Duration: XXh XXm format (e.g. 13h 55m, 07h 47m, 00h 00m)
- Status: PRESENT chip (teal fill, white text, rounded pill — exact style from Premises app screenshots)
- If overridden by admin: OVERRIDE badge shown alongside PRESENT (purple tint, white text — matching Premises app screenshot)

**Pagination row at bottom of modal table:**
```
Total Records: N     <  Page X of Y  >
```
Matching Premises app style: left-aligned total, right-aligned pagination controls.

**Mock data to fill in for UI:**
```
Member: Debaditya
2026-08-15 | 10:21 | --:-- | 00h 00m | PRESENT
2026-08-14 | 10:27 | --:-- | 00h 00m | PRESENT
2026-08-13 | 09:49 | 23:45 | 13h 55m | PRESENT
2026-08-12 | 11:00 | 22:22 | 11h 06m | PRESENT + OVERRIDE
2026-08-11 | 15:58 | 23:45 | 07h 47m | PRESENT
Total Records: 6 | Page 1 of 1
```

---

## PAGE 7: RULES (`rules.html`)

### Layout
Sidebar + main.

### Page header
"System Rules" — subtitle: "The rules that govern Vitals&Vectors. Violations have consequences."

### Content: 2-column card grid
Each card = one rules category. Cards use the standard card style.

Card headers use Bebas Neue + blue text + bottom border.

Categories:
1. Working Hours & Schedule — icon: nf-md-clock-outline
2. Reporting & Attendance — icon: nf-md-calendar-check
3. Task Management — icon: nf-md-clipboard-check
4. Point Earning — icon: nf-md-plus-circle
5. Point Deductions — icon: nf-md-minus-circle
6. Streak Bonuses — icon: nf-md-fire
7. Rewards — icon: nf-md-trophy
8. Violations & Consequences — icon: nf-md-alert
9. Dress Code — icon: nf-md-tshirt-crew

Each rule listed as: ▸ bullet in blue, rule text in muted, key values bolded in white.

---

## PAGE 8: ADMIN PANEL (`admin/dashboard.html`)

### Layout
Sidebar (admin variant) + main.

### Page header
"Admin Panel"

### Section 1: Alert Banner
If any alerts: red tint banner across top with count. "X active alerts — view below"

### Section 2: Quick Stats (3 cards)
Members below 100 pts | Members with 2 warnings | Overdue tasks

### Section 3: Team Overview table (full width)
```
Rank | Name | Total Pts | This Week | Streak | Status | Actions
```
Actions per row: "+ Points" (secondary) | "- Points" (danger) | "Warn" (secondary) | overflow menu for more

### Section 4: Alerts & Heroes (2-column)
Left: Alerts list (red icon + description per alert)
Right: Heroes panel
- "Hero of the Week" — top scorer name + points
- "Hero of the Month" — members above 300 pts listed with purple crown badge

### Modals
Add/Deduct Points modal:
- Fields: Member (readonly), Category (select), Points (number), Reason (text)
- Buttons: Confirm (primary) | Cancel (danger outline)

Warn modal:
- Fields: Member (readonly), Reason (textarea)
- Button: Issue Warning (danger fill)

---

## PAGE 9: MEMBER MANAGEMENT (`admin/members.html`)

### Layout
Sidebar + main. 2-column: 300px left form | remaining right table.

### Left: Add Hunter form
Card header: "Add Hunter"
Fields: Full Name, Username, Password, Role (select: Member / U5 Coordinator / Admin)
Button: "Create Hunter" primary full-width

### Right: All Hunters table
```
Name | Username | Role | Rank | Points | Status | Actions
```
Actions: "Edit" (secondary small) | "Deactivate" (danger small) | "Reset Password" (muted small)

---

## PAGE 10: TASK ASSIGNMENT (`admin/assign-tasks.html`)

### Layout
Sidebar + main. 2-column: 300px left form | remaining right table.

### Left: Assign Quest form
Card header: "Assign Quest"
Fields: Title, Duration (hrs), Deadline (datetime), Priority (select: High / Medium / Low), Assign To (member select)
Button: "Assign task" primary full-width

### Right: Active Quests table
```
# | Title | Assigned To | Deadline | Priority | Status | Rate
```
Rate column: dropdown for completed tasks only (Needs revision +3 / Meets expectation +5 / Exceeds expectation +8)

---

## PAGE 11: SETTINGS (`settings.html`)

### Layout
Sidebar + main. Single centered card, max-width 500px.

### Sections

#### Profile section
Avatar circle (large, 72px, initials)
Name, username, role, rank badge, join date
"Your rank label" below the badge

#### Change Password section
Fields: Current Password, New Password, Confirm New Password
Button: "Update password" primary

#### Admin-only section (if role = admin)
"Reset member password" — member select + new password field + button

---

## GLOBAL COMPONENTS

### Toast notifications
Fixed bottom-right. Auto-dismiss 3.5s.
- Success: teal border + teal text + teal tint bg
- Error: red border + red text + red tint bg
- Info: blue border + blue text + blue tint bg
Slide-up animation on appear.

### Loading state
Full-page overlay: "SYSTEM INITIALIZING..." in Bebas Neue, blue text, pulsing glow.
Animated gradient bar below text.

### Empty states
Centered icon (muted, 2.5rem) + muted text. Clean, no boxes.

### Scrollbar
Width: 6px. Track: `#0A0A0F`. Thumb: `#4FC3F7` border-radius 3px. Hover: `#00E5FF`.

---

## ANIMATIONS

| Name | Description |
|---|---|
| pulse-glow | Box-shadow oscillates 15px → 30px. For SS rank badge. 2s infinite. |
| shimmer | Right edge glow sweeps left to right on progress bars. 1.8s infinite. |
| fadeIn | opacity 0→1, translateY 8px→0. 0.4s ease. Used on page load, modals. |
| cardHover | translateY(-2px), border glow, top accent line fades in. 0.3s. |
| sidebarCollapse | width 220px→56px, text opacity 1→0. 0.25s ease. |

---

## RESPONSIVE BREAKPOINTS

| Breakpoint | Behavior |
|---|---|
| > 1280px | Full layout, 4-col stat strips, 2-col sections |
| ≤ 1024px | Sidebar auto-collapses to icon mode, stats 2-col |
| ≤ 768px | Sidebar becomes bottom nav bar, single column layout |
| ≤ 480px | Stat values smaller, buttons full-width, tables scroll horizontally |

---

## FILE STRUCTURE TO GENERATE

```
frontend/
├── index.html              ← Login
├── dashboard.html          ← Dashboard
├── tasks.html              ← Task manager
├── point-log.html          ← Points history
├── leaderboard.html        ← Rankings
├── attendance.html         ← Attendance (new)
├── rules.html              ← Rulebook
├── settings.html           ← Settings (new)
├── admin/
│   ├── dashboard.html      ← Admin panel
│   ├── members.html        ← Member management
│   └── assign-tasks.html   ← Task assignment
├── css/
│   ├── theme.css           ← Variables, body, fonts, scrollbar, animations
│   ├── components.css      ← Sidebar, cards, buttons, chips, badges, tables, modals, toasts
│   └── responsive.css      ← All breakpoint overrides
└── js/
    ├── api.js              ← All fetch() calls to FastAPI backend
    ├── auth.js             ← JWT login, token storage, requireAuth(), logout
    ├── utils.js            ← rankFor(), chipHtml(), timeAgo(), buildSidebar(), showToast()
    ├── dashboard.js        ← Dashboard page logic + Chart.js team bar chart
    ├── tasks.js            ← Task sheet + assign modal + rating
    ├── point-log.js        ← Point log + filters
    ├── leaderboard.js      ← Leaderboard + podium
    ├── attendance.js       ← Attendance today view + member modal
    ├── rules.js            ← Rules page (mostly static, no API needed)
    ├── settings.js         ← Settings + password change
    └── admin.js            ← All admin pages (dashboard, members, assign-tasks)
```

---

## BACKEND API REFERENCE (FastAPI — already built)

```
POST /auth/login                → { access_token, role, member_id, name }
GET  /members/                  → list of all members
GET  /members/me                → current logged-in member
GET  /members/{id}              → specific member
POST /members/                  → create member (admin)
PUT  /members/{id}              → update member (admin)
DELETE /members/{id}            → deactivate (admin)

GET  /tasks/                    → all tasks (admin/coordinator)
GET  /tasks/my                  → tasks assigned to me
POST /tasks/                    → create task (coordinator/admin)
PUT  /tasks/{id}                → update/rate task

GET  /points/logs               → my point logs
GET  /points/logs/{member_id}   → specific member logs (admin)
POST /points/add                → add points (admin/coordinator)
POST /points/deduct             → deduct points (admin/coordinator)

GET  /leaderboard/weekly        → weekly ranking array
GET  /leaderboard/monthly       → monthly ranking + hero of month
GET  /leaderboard/hero-week     → hero of week
GET  /leaderboard/hero-month    → members above 300 pts

GET  /admin/alerts              → { low_points, two_warnings, overdue_tasks }

POST /warnings/                 → issue warning
GET  /warnings/{member_id}      → member warnings

GET  /health                    → { status: "ok" }
```

**Attendance API:** Not yet built in backend. Attendance page uses mock data for now. The data will later come from the Premises app (external service). Placeholder: attendance.js should have a `fetchAttendance(memberId, filter)` function that currently returns mock data and will later be replaced with a real API call.

---

## ATTENDANCE MOCK DATA FORMAT

```javascript
// Format matching Premises app screenshots
const MOCK_ATTENDANCE = {
  "debaditya": [
    { date: "2026-08-15", checkIn: "10:21", checkOut: "--:--", duration: "00h 00m", status: "PRESENT", override: false },
    { date: "2026-08-14", checkIn: "10:27", checkOut: "--:--", duration: "00h 00m", status: "PRESENT", override: false },
    { date: "2026-08-13", checkIn: "09:49", checkOut: "23:45", duration: "13h 55m", status: "PRESENT", override: false },
    { date: "2026-08-12", checkIn: "11:00", checkOut: "22:22", duration: "11h 06m", status: "PRESENT", override: true },
    { date: "2026-08-11", checkIn: "15:58", checkOut: "23:45", duration: "07h 47m", status: "PRESENT", override: false },
  ]
}
// Total Records: 6, Page 1 of 1
```

Status chips styling (match Premises app exactly):
- PRESENT: `background: #1D9E75`, `color: white`, `border-radius: 20px`, `font-weight: 700`, `padding: 4px 14px`
- OVERRIDE: `background: transparent`, `border: 1px solid #9A7BFF`, `color: #9A7BFF`, `border-radius: 20px`, `font-size: 0.75rem`

---

## NERD FONTS REFERENCE (icons to use in sidebar)

```
nf-md-view_dashboard       \udb81\udf63   Dashboard
nf-md-checkbox_multiple    \udb81\udebf   Tasks
nf-md-history              \udb80\udc57   Point Log
nf-md-trophy               \udb80\udef4   Leaderboard
nf-md-calendar_clock       \udb81\udc24   Attendance
nf-md-book_open_variant    \udb80\udf94   Rules
nf-md-cog                  \udb80\udee2   Settings
nf-md-shield_crown         \udb81\udee8   Admin
nf-md-logout               \udb80\udc11   Logout
nf-md-chevron_left         \udb80\udc35   Collapse sidebar
nf-md-chevron_right        \udb80\udc36   Expand sidebar
```

Font import: use `https://www.nerdfonts.com/font-downloads` or load via a CDN that hosts the Nerd Fonts webfont. Alternatively use inline SVG icons or Tabler Icons as fallback since Nerd Fonts may not load from CDN.

**If Nerd Fonts CDN is unavailable in Stitch:** Use Tabler Icons webfont instead (loaded from `https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css`). Tabler uses class `ti ti-{name}`. Equivalent mapping:
```
Dashboard    → ti ti-layout-dashboard
Tasks        → ti ti-checklist
Point Log    → ti ti-history
Leaderboard  → ti ti-trophy
Attendance   → ti ti-calendar-time
Rules        → ti ti-book
Settings     → ti ti-settings
Admin        → ti ti-shield
Logout       → ti ti-logout
Collapse     → ti ti-chevron-left
```

---

## IMPORTANT NOTES FOR STITCH

1. **No landing page.** Login → Dashboard directly. No marketing pages.
2. **JWT stored in localStorage** as `vv_token`, `vv_role`, `vv_id`, `vv_name`.
3. **requireAuth(allowedRoles)** function in auth.js must redirect to `index.html` if token is missing or role not allowed.
4. **buildSidebar(currentPath, role)** in utils.js generates the sidebar HTML including hiding admin/coord-only links based on role.
5. **Solo Leveling naming convention** — keep these names in the UI:
   - Tasks → "Quests"
   - Achievements → "Titles"
   - Dashboard header → "Command Centre"
   - Login subtitle → "System Authentication Required"
   - Rules page → "System Rules"
   - Admin panel header → "Command Center — Admin"
   - Members → "Hunters" (in labels/headings only, not in URLs/filenames)
6. **Chart.js** for the team bar chart — load from `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js`
7. **Attendance page** — mock data only for now. Future API endpoint will be connected later.
8. **Backend runs at** `http://localhost:8000` — all API calls prefix with this base URL.
9. **All pages must be mobile responsive.** Sidebar collapses to icon mode at ≤1024px, becomes bottom bar at ≤768px.
10. **No React, no Vue, no npm build step.** Pure HTML + CSS + Vanilla JavaScript. Everything must work by opening the HTML file in a browser against the local FastAPI server.

---

*End of Stitch Prompt — Vitals&Vectors Frontend v1.0*
