# Vitals&Vectors — Task System Rework
## Complete IDE Agent Instructions v1.0

---

## CONTEXT

You are working on the Vitals&Vectors research lab monitoring platform.
The frontend is pure HTML + CSS + Vanilla JavaScript — no React, no build step, no npm.
All pages are self-contained single files with inline `<style>` and `<script>` blocks.
The backend is Python FastAPI running at `http://localhost:8000`.

**For this task:** Do NOT wire any backend API calls yet.
All data must be hardcoded mock data as JavaScript arrays/objects inside `<script>` blocks.
Every form submit, button click, and action must either update the UI locally or show a
placeholder toast message like "This action will connect to the backend in the next phase."

---

## WHAT YOU ARE BUILDING

You will create 3 new HTML files and modify 1 existing file.
The task system is being split from a single flat list into a proper
project-based structure that reflects the real lab hierarchy.

### The real project structure (hardcode this data everywhere)

```javascript
const PROJECTS = [
  {
    id: 'mindspace',
    name: 'MindSpace',
    lead: 'Ganesh',
    members: ['Vedant', 'Nakul', 'Ashutosh', 'Nandini', 'Prerna', 'Swapnil'],
    color: '#4FC3F7',  // blue
  },
  {
    id: 'neurovi',
    name: 'NeuroVisualisAI',
    lead: 'Ganesh',
    members: ['Vedant', 'Nakul', 'Ashutosh', 'Swapnil'],
    color: '#4FC3F7',
  },
  {
    id: 'nutrisure',
    name: 'NutriSure',
    lead: 'Deepavali',
    members: ['Vishal', 'Vedant', 'Prem'],
    color: '#00E5FF',  // teal
  },
  {
    id: 'solobeauty',
    name: 'SoloBeauty',
    lead: 'Santosh',
    members: ['Prem', 'Prerna'],
    color: '#9A7BFF',  // purple
  },
  {
    id: 'skillsense',
    name: 'SkillSense',
    lead: 'Swapnil',
    members: ['Komal', 'Deepavali', 'Ashutosh', 'Shreya', 'Prem'],
    color: '#FFB300',  // amber
  },
  {
    id: 'lms',
    name: 'LMS',
    lead: 'Swapnil',
    members: ['Prem', 'Swapnil', 'Komal', 'Shreya'],
    color: '#FFB300',
  },
  {
    id: 'website',
    name: 'Website',
    lead: 'Debaditya',
    members: ['Suraj', 'Ashutosh'],
    color: '#FF1744',  // red
  },
  {
    id: 'socialmedia',
    name: 'LinkedIn / Social Media',
    lead: 'Debaditya',
    members: ['Ashutosh', 'Suraj'],
    color: '#FF1744',
  },
  {
    id: 'ezest',
    name: 'E-Zest',
    lead: 'Santosh',
    members: ['Ganesh', 'Vedant', 'Nikita', 'Nakul', 'Prerna', 'Ashutosh', 'Swapnil', 'Nandini'],
    color: '#9A7BFF',
  },
  {
    id: 'funday',
    name: 'Fun Day',
    lead: 'Nikita',
    members: ['Deepavali', 'Prerna'],
    color: '#00E5FF',
  },
  {
    id: 'demoday',
    name: 'Demo Day',
    lead: 'Deepavali',
    members: ['Prerna'],
    color: '#00E5FF',
  },
  {
    id: 'learningtime',
    name: 'Learning Time',
    lead: 'Vedant',
    members: [],
    color: '#4FC3F7',
  },
  {
    id: 'premises',
    name: 'Premises',
    lead: 'Deepavali',
    members: ['Prem'],
    color: '#00E5FF',
  },
];
```

### The U5 leads (the 6 responsible coordinators)
```javascript
const U5_LEADS = ['Deepavali', 'Santosh', 'Debaditya', 'Swapnil', 'Ganesh', 'Nikita'];
```

### Mock tasks data (use in all files)
```javascript
const ALL_TASKS = [
  { id:1,  projectId:'mindspace',   title:'Implement user onboarding flow',    lead:'Ganesh',    assignedTo:'Vedant',   duration:3,   deadline:'2026-08-20', priority:1, status:'in_progress', rating:null,          points:0  },
  { id:2,  projectId:'mindspace',   title:'Fix session timeout bug',            lead:'Ganesh',    assignedTo:'Nakul',    duration:1,   deadline:'2026-08-16', priority:1, status:'completed',   rating:null,          points:0  },
  { id:3,  projectId:'mindspace',   title:'Design dashboard wireframes',        lead:'Ganesh',    assignedTo:'Nandini',  duration:4,   deadline:'2026-08-18', priority:2, status:'rated',       rating:'exceeds',     points:8  },
  { id:4,  projectId:'neurovi',     title:'Train classification model v2',      lead:'Ganesh',    assignedTo:'Ashutosh', duration:6,   deadline:'2026-08-22', priority:1, status:'in_progress', rating:null,          points:0  },
  { id:5,  projectId:'neurovi',     title:'Write model evaluation report',      lead:'Ganesh',    assignedTo:'Vedant',   duration:2,   deadline:'2026-08-19', priority:2, status:'pending',     rating:null,          points:0  },
  { id:6,  projectId:'nutrisure',   title:'Build nutrition tracking API',       lead:'Deepavali', assignedTo:'Prem',     duration:5,   deadline:'2026-08-21', priority:1, status:'in_progress', rating:null,          points:0  },
  { id:7,  projectId:'nutrisure',   title:'Create meal recommendation logic',   lead:'Deepavali', assignedTo:'Vishal',   duration:3,   deadline:'2026-08-17', priority:2, status:'rated',       rating:'meets',       points:5  },
  { id:8,  projectId:'solobeauty',  title:'Product catalogue UI',               lead:'Santosh',   assignedTo:'Prem',     duration:4,   deadline:'2026-08-20', priority:2, status:'pending',     rating:null,          points:0  },
  { id:9,  projectId:'skillsense',  title:'Course module drag-and-drop',        lead:'Swapnil',   assignedTo:'Komal',    duration:3,   deadline:'2026-08-18', priority:1, status:'completed',   rating:null,          points:0  },
  { id:10, projectId:'skillsense',  title:'Integrate payment gateway',          lead:'Swapnil',   assignedTo:'Ashutosh', duration:2,   deadline:'2026-08-23', priority:1, status:'pending',     rating:null,          points:0  },
  { id:11, projectId:'lms',         title:'Student progress dashboard',         lead:'Swapnil',   assignedTo:'Shreya',   duration:4,   deadline:'2026-08-19', priority:2, status:'rated',       rating:'needs_revision', points:3 },
  { id:12, projectId:'website',     title:'SEO meta tags for all pages',        lead:'Debaditya', assignedTo:'Suraj',    duration:1,   deadline:'2026-08-16', priority:2, status:'completed',   rating:null,          points:0  },
  { id:13, projectId:'website',     title:'Contact form backend integration',   lead:'Debaditya', assignedTo:'Ashutosh', duration:2,   deadline:'2026-08-20', priority:1, status:'in_progress', rating:null,          points:0  },
  { id:14, projectId:'socialmedia', title:'Draft 4 LinkedIn posts for August',  lead:'Debaditya', assignedTo:'Suraj',    duration:2,   deadline:'2026-08-17', priority:2, status:'rated',       rating:'exceeds',     points:8  },
  { id:15, projectId:'ezest',       title:'Workshop logistics planning',         lead:'Santosh',   assignedTo:'Prerna',   duration:3,   deadline:'2026-08-22', priority:2, status:'pending',     rating:null,          points:0  },
  { id:16, projectId:'funday',      title:'Finalize venue and schedule',        lead:'Nikita',    assignedTo:'Deepavali',duration:1,   deadline:'2026-08-18', priority:1, status:'in_progress', rating:null,          points:0  },
  { id:17, projectId:'demoday',     title:'Prepare stakeholder presentations',  lead:'Deepavali', assignedTo:'Prerna',   duration:5,   deadline:'2026-08-25', priority:1, status:'pending',     rating:null,          points:0  },
  { id:18, projectId:'premises',    title:'Test attendance sync feature',       lead:'Deepavali', assignedTo:'Prem',     duration:2,   deadline:'2026-08-19', priority:1, status:'completed',   rating:null,          points:0  },
];
```

---

## DESIGN SYSTEM (apply to all 3 new files consistently)

⚠ THEME RULE: Every new file must look visually identical to the existing pages.
Open `frontend/tasks.html` (the current file, before you replace it) and
`frontend/attendance.html` as your visual reference. Copy CSS blocks verbatim —
do not invent new styles, do not use different fonts, do not change colors.
The sidebar HTML block must be copied character-for-character from the existing
`frontend/tasks.html` — including the SVG icons, the profile row at the bottom,
and the `collapseBtn` event listener in the script.

**`global.css` is shared** — All existing pages use `<link rel="stylesheet" href="css/global.css">`.
Every new file you create (`tasks.html`, `project.html`, `hunter.html`) MUST include this same link tag.
Only put page-specific CSS (things not already in global.css) inside the page's own `<style>` block.
Do NOT duplicate CSS that is already in global.css.

Copy this CSS variables block into every file's `<style>` (these are already in global.css but
explicitly declaring them ensures consistency):

```css
:root {
  --bg:       #0A0A0F;
  --panel:    #0D0D1A;
  --elevated: #12121F;
  --blue:     #4FC3F7;
  --blue-glow: rgba(79,195,247,0.3);
  --teal:     #00E5FF;
  --purple:   #9A7BFF;
  --red:      #FF1744;
  --amber:    #FFB300;
  --gold:     #FFD700;
  --border:   rgba(79,195,247,0.1);
  --border-h: rgba(79,195,247,0.35);
  --text:     #E8E8F0;
  --text2:    #8A8AA3;
  --text3:    #4A4A6A;
}
```

### Fonts (add to every file's `<head>`)
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet">
```

### Body background (copy to every file)
```css
html, body { height: 100%; font-family: 'Inter', sans-serif; color: var(--text); background: var(--bg); overflow: hidden; }
body::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(79,195,247,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.025) 1px, transparent 1px); background-size: 50px 50px; pointer-events: none; z-index: 0; }
body::after { content: ''; position: fixed; top: -10%; left: 50%; transform: translateX(-50%); width: 900px; height: 500px; background: radial-gradient(ellipse at center top, rgba(79,195,247,0.07) 0%, transparent 65%); pointer-events: none; z-index: 0; }
```

### Shell layout (sidebar + main — same as all existing pages)
```html
<div class="shell">
  <nav class="sidebar" id="sidebar">...</nav>
  <div class="main">...</div>
</div>
```
```css
.shell { display: flex; height: 100vh; position: relative; z-index: 1; }
.main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
```

### Sidebar (copy EXACTLY from `frontend/tasks.html`)
Copy the entire `<nav class="sidebar">` block and its CSS from the existing `frontend/tasks.html`.

The sidebar in `frontend/tasks.html` has this exact structure:
- Logo area: `logo-wordmark` only (text "V&V" + "Vitals&Vectors") — NO hex SVG polygon
- Nav links in order: Dashboard → Tasks → Point Log → Leaderboard → Attendance → Rules → [divider] → Settings → [divider] → Admin panel
- Admin panel href = `admin/admin_dashboard.html` (NOT `admin/dashboard.html`)
- Sidebar bottom: profile-avatar (initials circle) + profile-info + profile-badge + nav-logout + collapse-btn

The active nav link for `tasks.html` and `project.html` = the Tasks link.
Mark nothing active on `hunter.html`.

**Collapse button JS — copy exactly:**
```javascript
document.getElementById('collapseBtn').addEventListener('click', () => {
  const sb = document.getElementById('sidebar');
  const ic = document.getElementById('collapseIcon');
  sb.classList.toggle('collapsed');
  if (sb.classList.contains('collapsed')) {
    ic.innerHTML = '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><polyline points="14 9 17 12 14 15"/>';
  } else {
    ic.innerHTML = '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><polyline points="16 15 13 12 16 9"/>';
  }
});
```

**`<head>` block for every new file — use exactly this:**
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/global.css">
<style>
  /* page-specific CSS only goes here */
</style>
```

For `project.html` and `hunter.html`, since they are in the same `frontend/` directory as `tasks.html`,
the path `css/global.css` and `admin/admin_dashboard.html` are correct as written.

### Status chip colors
```css
.chip-pending    { background:rgba(255,179,0,0.12);  border-color:rgba(255,179,0,0.5);  color:var(--amber); }
.chip-progress   { background:rgba(79,195,247,0.12); border-color:rgba(79,195,247,0.4); color:var(--blue); }
.chip-completed  { background:rgba(0,229,255,0.12);  border-color:rgba(0,229,255,0.4);  color:var(--teal); }
.chip-rated      { background:rgba(154,123,255,0.12);border-color:rgba(154,123,255,0.4);color:var(--purple); }
```

### Priority chip colors
```css
.chip-high   { background:rgba(255,23,68,0.15);  border-color:rgba(255,23,68,0.5);  color:#FF5252; }
.chip-medium { background:rgba(79,195,247,0.12); border-color:rgba(79,195,247,0.4); color:var(--blue); }
.chip-low    { background:rgba(74,74,106,0.2);   border-color:rgba(74,74,106,0.5);  color:var(--text2); }
```

### Rating display
```css
.rating-exceeds  { color:var(--teal);   font-size:11px; font-weight:700; }
.rating-meets    { color:var(--blue);   font-size:11px; font-weight:700; }
.rating-revision { color:var(--amber);  font-size:11px; font-weight:700; }
```

### Toast function (add to every file's script)
```javascript
function showToast(msg, type = 'info') {
  let c = document.getElementById('toast-container');
  if (!c) { c = document.createElement('div'); c.id = 'toast-container'; c.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;'; document.body.appendChild(c); }
  const colors = { success:'#00E5FF', error:'#FF1744', info:'#4FC3F7', warning:'#FFB300' };
  const t = document.createElement('div');
  t.style.cssText = `padding:12px 20px;border-radius:6px;font-family:'Inter',sans-serif;font-size:13px;border:1px solid ${colors[type]};color:${colors[type]};background:${colors[type]}18;animation:fadeIn 0.3s ease;max-width:340px;`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
```

---

## FILE 1: `frontend/tasks.html` (REPLACE THE ENTIRE FILE)

This replaces the current tasks.html completely.

### Page title
`TASK OVERVIEW` in the topbar.

### Topbar right side
A "// SYSTEM ONLINE" status pill (same as other pages).
No assign button here — assignment happens in the admin panel only.

### Layout: two-column
Left column (260px fixed width): filter sidebar
Right column (flex 1): main content area

### LEFT FILTER SIDEBAR

This is NOT the navigation sidebar. This is a secondary filter panel inside the main content area.

```
[Search box]
  placeholder: "Search tasks or members..."
  Full-width input, dark bg, blue border on focus

[FILTER BY STATUS]
  □ All          (default active)
  □ Pending
  □ In Progress
  □ Completed
  □ Awaiting Rating   ← status = 'completed' with no rating
  □ Rated

[FILTER BY PROJECT]
  List all 13 projects as clickable items
  Each has a small colored dot (project color) and the project name
  Clicking filters the table to that project only
  "All Projects" option at top

[FILTER BY LEAD]
  □ All
  □ Ganesh
  □ Deepavali
  □ Santosh
  □ Swapnil
  □ Debaditya
  □ Nikita

[FILTER BY PRIORITY]
  □ All
  □ High
  □ Medium
  □ Low
```

Style the filter sidebar:
- Background: `var(--panel)`
- Border-right: `1px solid var(--border)`
- Padding: 20px 16px
- Section labels: Rajdhani, 10px, uppercase, letter-spacing 1.5px, color `var(--text2)`, margin-top 20px
- Filter items: small rows with checkbox-style dot indicator, hover teal highlight, active = blue tint bg + blue text
- Scrollable if content overflows

### RIGHT MAIN CONTENT

#### Stats bar (above the table, 4 cards in a row)
```
Total Tasks | In Progress | Completed | Awaiting Rating
```
Each is a small stat card matching the style of other pages (dark panel bg, blue left accent bar).
Compute counts dynamically from ALL_TASKS array using JavaScript.

#### Table
Columns:
```
# | TASK | PROJECT | ASSIGNED TO | LEAD | DEADLINE | PRIORITY | STATUS | POINTS
```

Column details:
- `#`: row number, centered, muted color
- `TASK`: task title in white bold, below it in muted smaller text: duration e.g. "3h"
- `PROJECT`: clickable project name — clicking navigates to `project.html?id={projectId}`. Style as a colored pill/badge using the project's color at 15% opacity bg + full color text + colored border
- `ASSIGNED TO`: member name as clickable text — clicking navigates to `hunter.html?name={memberName}`. Style as a small avatar circle (initials, 28px) + name beside it. Avatar bg = project color at 20% opacity, border = project color, text = project color
- `LEAD`: plain text, muted color
- `DEADLINE`: date formatted as "20 Aug" — if past today highlight in red
- `PRIORITY`: chip (High/Medium/Low)
- `STATUS`: chip (Pending/In Progress/Completed/Rated)
- `POINTS`: if rated, show points awarded (+3/+5/+8) in teal. If not rated, show `—` in muted. If status = 'completed' (awaiting rating), show `⏳` in amber

#### Pagination
Below the table: "Showing X to Y of Z tasks" on left, prev/next page buttons on right.
Show 10 tasks per page. Implement client-side pagination in JavaScript.

#### Empty state
If filters result in zero tasks:
```
[icon: clipboard with X]
No tasks match your filters.
Clear filters to see all tasks.
[Clear filters button]
```

### JavaScript
- All filtering is client-side using the ALL_TASKS and PROJECTS arrays
- Filters combine (AND logic): a task must match ALL active filters
- Active filter state stored in JS variables
- Re-render table on every filter change
- Search filters by task title and assigned member name (case-insensitive)
- Clicking project name → `window.location.href = 'project.html?id=' + projectId`
- Clicking member name → `window.location.href = 'hunter.html?name=' + encodeURIComponent(name)`
- Pagination: 10 items per page, recalculate on filter change, reset to page 1 on filter change

---

## FILE 2: `frontend/project.html` (NEW FILE)

### Purpose
Shows all tasks and details for a single project.
Opened when user clicks a project name anywhere in the app.
URL: `project.html?id=mindspace` (reads the `id` from URL params)

### Page title
`[PROJECT NAME]` — dynamically set from URL param

### Topbar
Left: back button (`←  All Tasks` link back to tasks.html) + page title
Right: "// SYSTEM ONLINE" pill

### Section 1: Project info card (full width, below topbar)
A horizontal card showing:
```
[Left: project color accent bar 4px]
[Project colored hex badge with lead initial]  PROJECT NAME
                                               Lead: Ganesh
                                               [member avatar chips row]
                                               [Stats: X total | Y in progress | Z completed]
```

- Project colored hex badge: same hexagon clip-path style as rank badges, filled with project color at 15% opacity, border in project color, text = lead's initial letter, font Bebas Neue
- Member chips: small circular avatars for each member (28px, initials, border = project color), displayed in a row. If more than 6 members, show "+N more"
- Stats computed from ALL_TASKS filtered to this project

### Section 2: Progress bar
Full-width card with a label "PROJECT PROGRESS" and a progress bar.
Progress = (completed + rated tasks) / total tasks × 100
Bar style: gradient fill (blue → teal), glow, 8px height, shimmer animation
Show percentage on the right of the bar

### Section 3: Kanban board (3 columns)

Three columns side by side, equal width:

```
PENDING          |    IN PROGRESS    |    COMPLETED / RATED
──────────────   |   ──────────────  |   ──────────────────
[task card]      |   [task card]     |   [task card]
[task card]      |   [task card]     |   [task card]
```

Each task card in the kanban:
```
┌─────────────────────────────┐
│ PRIORITY chip               │
│ Task title (bold, white)    │
│ Assigned to: [avatar] Name  │
│ Due: 20 Aug  · 3h           │
│ ──────────────────────────  │
│ [STATUS chip]  POINTS badge │
└─────────────────────────────┘
```

- Card bg: `var(--elevated)`
- Card border: `1px solid var(--border)` → on hover: `1px solid var(--border-h)` + translateY(-2px)
- Top border: 2px solid in project color (left top to right top — the colored accent line)
- If status = 'completed' (awaiting rating): show amber "⏳ Awaiting Rating" below status chip
- If status = 'rated': show rating label below (Exceeds Expectation / Meets Expectation / Needs Revision) + points in teal

Column headers:
- "PENDING" — amber color
- "IN PROGRESS" — blue color
- "COMPLETED / RATED" — teal color
- Each header shows count in parentheses e.g. "IN PROGRESS (3)"

### JavaScript
```javascript
const params = new URLSearchParams(window.location.search);
const projectId = params.get('id');
const project = PROJECTS.find(p => p.id === projectId);
const projectTasks = ALL_TASKS.filter(t => t.projectId === projectId);
```
Populate all UI from these computed values.
If `projectId` is invalid or not found: show "Project not found" message with a back link.

---

## FILE 3: `frontend/hunter.html` (NEW FILE)

⚠ This file is named `hunter.html`, NOT `member.html` and NOT `members.html`.
`admin/members.html` already exists — do not touch it. This is a separate file.

### Purpose
Shows all tasks and points info for a single team member.
Opened when user clicks a member's name anywhere in the app.
URL: `hunter.html?name=Vedant`

### Page title
`[MEMBER NAME]` — dynamically set from URL param

### Topbar
Left: back button (`← All Tasks` link back to `tasks.html`) + member name as page title
Right: "// SYSTEM ONLINE" pill

### Section 1: Member profile card (full width)
Horizontal card:
```
[Large avatar circle 72px, initials, blue border + glow]
Name (Bebas Neue, large)
Role label: "Team Member" or "U5 Coordinator" (check if name is in U5_LEADS)
────────────────────────────────────────────────────────
[Stats row: 4 items]
  Tasks Assigned | Completed | Rated | Total Points from Tasks
```

Stats computed from ALL_TASKS filtered to this member.
Total Points from Tasks = sum of `points` field where task is rated.

### Section 2: Projects this member works on
A row of project pills — one for each unique project where this member appears.
Each pill: colored bg (project color 15% opacity) + project color border + project name text + "Lead: X" below.
Clicking a pill navigates to `project.html?id={projectId}`.

### Section 3: Task history table (full width)

Columns:
```
# | TASK TITLE | PROJECT | LEAD | DEADLINE | PRIORITY | STATUS | RATING | POINTS
```

- PROJECT column: clickable colored pill → navigates to `project.html?id={projectId}`
- RATING column: shows "Exceeds Expectation" / "Meets Expectation" / "Needs Revision" / `—` if not rated
- POINTS column: `+8` in teal if rated, `—` if not

Filter tabs above the table:
```
All | Pending | In Progress | Completed | Rated
```

Client-side filter on status. Default: All.

### Section 4: Points summary card
Small card below the table:
```
Points earned from tasks this member: [total]
Breakdown: Exceeds ×N (+8 each) | Meets ×N (+5 each) | Needs Revision ×N (+3 each)
```

### JavaScript
```javascript
const params = new URLSearchParams(window.location.search);
const memberName = decodeURIComponent(params.get('name'));
const memberTasks = ALL_TASKS.filter(t => t.assignedTo === memberName);
const isU5 = U5_LEADS.includes(memberName);
```
If member not found (no tasks): show "Hunter not found or has no tasks assigned yet."

---

## FILE 4: `frontend/admin/assign-tasks.html` (MODIFY EXISTING)

The current file has a simple 2-column layout: left form + right table.
Keep the overall layout but significantly update the assign task form.

### LEFT SIDE — Assign Task form

Change from a generic form to a project-aware form:

**Step 1: Select Project (dropdown)**
```
Label: PROJECT
Dropdown options: All 13 projects listed
On select: auto-populate the LEAD field below and update the ASSIGN TO dropdown
           to show only members of that project
```

**Step 2: Lead (auto-filled, read-only)**
```
Label: TASK LEAD (AUTO-ASSIGNED)
Input: disabled/readonly, filled automatically when project is selected
Style: dark bg, blue border, slightly muted — shows it's auto-filled not editable
```

**Step 3: Task title**
```
Label: TASK TITLE
Input: text, placeholder "Describe the task clearly"
```

**Step 4: Assign to (filtered by project)**
```
Label: ASSIGN TO
Dropdown: shows only members of the selected project
Default: "Select project first" — disabled until project is chosen
```

**Step 5: Duration**
```
Label: DURATION (HOURS)
Input: number, min 0.5, step 0.5, placeholder "e.g. 3"
```

**Step 6: Deadline**
```
Label: DEADLINE
Input: datetime-local
```

**Step 7: Priority**
```
Label: PRIORITY
Select: High / Medium / Low
```

**Step 8: Submit**
```
Button: "ASSIGN TASK"
Style: full-width, gradient fill (same style as other primary buttons in the project)
On click: show toast "Task assignment will connect to backend in the next phase."
          Reset form fields after toast.
```

### RIGHT SIDE — Active Quests table

Keep the same table columns as the current file.
Replace the hardcoded dummy data with ALL_TASKS array rendered via JavaScript.

Add a filter bar above the table with tabs:
```
All | Awaiting Rating | Rated
```

For rows where status = 'completed' (awaiting rating):
Show a rating dropdown in the ACTIONS column:
```
[Select rating ▾]
  → Needs revision (+3 pts)
  → Meets expectation (+5 pts)
  → Exceeds expectation (+8 pts)
```
On selecting a rating: show toast "Rating will be saved to backend in the next phase."
Update the row status to 'rated' locally in the displayed data.

---

## NAVIGATION LINKS TO ADD

In ALL existing pages (`frontend/dashboard.html`, `frontend/leaderboard.html`,
`frontend/attendance.html`, `frontend/point-log.html`, `frontend/rules.html`,
`frontend/settings.html`, `frontend/admin/admin_dashboard.html`, `frontend/admin/members.html`):

The sidebar Tasks nav link already points to `tasks.html` — no change needed there.

In `frontend/dashboard.html` only:
- In the "Today's Quests" section, make each task title clickable.
  Task title → navigates to `project.html?id={projectId}` (use the task's project id from mock data)
- Member names in the dashboard chart → navigates to `hunter.html?name={name}`

---

## WHAT TO NOT CHANGE

- Do NOT touch `frontend/login.html` — this is the login page
- Do NOT touch `frontend/leaderboard.html`
- Do NOT touch `frontend/attendance.html`
- Do NOT touch `frontend/point-log.html`
- Do NOT touch `frontend/rules.html`
- Do NOT touch `frontend/settings.html`
- Do NOT touch `frontend/dashboard.html` (except the two clickable link additions noted above)
- Do NOT touch `frontend/admin/admin_dashboard.html`
- Do NOT touch `frontend/admin/members.html`
- Do NOT touch `frontend/css/global.css`
- Do NOT touch any backend Python files
- Do NOT add any npm packages, build tools, or external dependencies
  other than the Google Fonts link already used in the project

---

## FILE LOCATIONS SUMMARY

```
frontend/
├── tasks.html              ← REPLACE ENTIRE FILE
├── project.html            ← CREATE NEW
├── hunter.html             ← CREATE NEW  (DO NOT confuse with admin/members.html — that is a different file)
└── admin/
    └── assign-tasks.html   ← MODIFY (form + table updates only)
```

⚠ IMPORTANT — filename collision warning:
`frontend/hunter.html` is a brand-new file at the root of frontend/.
`frontend/admin/members.html` already exists and must NOT be touched.
These are two completely different files. Do not overwrite admin/members.html.

---

## QUALITY CHECKLIST

Before finishing, verify each file:

- [ ] `<link rel="stylesheet" href="css/global.css">` present in `<head>` of every new file
- [ ] Google Fonts link in `<head>` of every new file
- [ ] Body background (grid + radial glow) is NOT added inline — it comes from global.css
- [ ] Sidebar HTML copied exactly from `frontend/tasks.html` — logo is text-only (V&V wordmark, no hex SVG), admin link = `admin/admin_dashboard.html`
- [ ] Correct nav link marked `.active` (Tasks for tasks.html + project.html; none for hunter.html)
- [ ] Collapse JS uses panel-style icon (rect+line+polyline), not chevrons — copy exactly from tasks.html
- [ ] All data comes from hardcoded JS arrays (PROJECTS, ALL_TASKS, U5_LEADS)
- [ ] No `fetch()` calls to any API
- [ ] All button/form actions show toast instead of backend call
- [ ] Project names are clickable → `project.html?id=X`
- [ ] Member names are clickable → `hunter.html?name=X`
- [ ] Back button on project.html and hunter.html works (links to tasks.html)
- [ ] hunter.html is at `frontend/hunter.html` — NOT inside admin/ folder, NOT named members.html
- [ ] Page renders correctly on a 1440px wide screen
- [ ] No horizontal scrollbar on the main content area
- [ ] Empty state shown when filters return zero results
- [ ] Toast disappears after 3.5 seconds
- [ ] URL param parsing works correctly (test with `?id=mindspace` and `?name=Vedant`)

---

*End of instructions. Build all 4 files in order: tasks.html → project.html → hunter.html → assign-tasks.html*