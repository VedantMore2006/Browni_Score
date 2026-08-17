# Vitals&Vectors — Point Log Rework
## IDE Agent Instructions v1.0

---

## CONTEXT

You are working on the Vitals&Vectors research lab monitoring platform.
The platform is now a **fully public portal** — no login required to view any page.
Anyone can open any page and see all data. There is no "my points" or personal view.
The point log must show points for ALL team members, not just one person.

Frontend: pure HTML + CSS + Vanilla JavaScript.
All pages share `css/global.css` for common styles (sidebar, shell, body bg, fonts).
All data is hardcoded mock data — no backend API calls yet.

---

## WHAT YOU ARE CHANGING

**File to modify:** `frontend/point-log.html`

**Replace the entire file.** The new version is a completely redesigned page that:

1. Shows point logs for ALL members (not one person)
2. Adds a member filter so you can view one member's history specifically
3. Adds a "MEMBER" column to the table
4. Updates summary stats to show team-wide totals by default
5. When a member is selected, stats update to show that member's totals
6. All other structure (sidebar, topbar, categories, pagination) stays the same theme

---

## MOCK DATA

Replace the existing `ALL_LOGS` array with this expanded dataset covering all real team members:

```javascript
const ALL_MEMBERS = [
  'Deepavali', 'Santosh', 'Debaditya', 'Swapnil', 'Ganesh', 'Nikita',
  'Vedant', 'Nakul', 'Ashutosh', 'Nandini', 'Prerna', 'Prem',
  'Komal', 'Shreya', 'Vishal', 'Suraj', 'Krishna', 'Umesh'
];

const ALL_LOGS = [
  // Ganesh
  { id:1,  member:'Ganesh',    datetime:'2026-08-16, 09:30 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting — full week streak',          by:'System'    },
  { id:2,  member:'Ganesh',    datetime:'2026-08-15, 06:00 PM', cat:'task',       type:'earn',   pts:8,   reason:'Task rated: Exceeds expectation — MindSpace UI', by:'Deepavali' },
  { id:3,  member:'Ganesh',    datetime:'2026-08-15, 02:30 PM', cat:'learning',   type:'earn',   pts:5,   reason:'Attended learning hour',                         by:'System'    },
  { id:4,  member:'Ganesh',    datetime:'2026-08-14, 04:30 PM', cat:'streak',     type:'earn',   pts:10,  reason:'Full week presence streak bonus',                by:'System'    },

  // Deepavali
  { id:5,  member:'Deepavali', datetime:'2026-08-16, 10:00 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting',                              by:'System'    },
  { id:6,  member:'Deepavali', datetime:'2026-08-15, 05:45 PM', cat:'task',       type:'earn',   pts:5,   reason:'Task rated: Meets expectation — NutriSure API',  by:'Santosh'   },
  { id:7,  member:'Deepavali', datetime:'2026-08-14, 11:30 AM', cat:'attendance', type:'deduct', pts:-10, reason:'Late arrival — outside 9:30–11:30 AM window',    by:'System'    },
  { id:8,  member:'Deepavali', datetime:'2026-08-13, 04:30 PM', cat:'streak',     type:'earn',   pts:10,  reason:'Full week task reporting streak bonus',          by:'System'    },

  // Santosh
  { id:9,  member:'Santosh',   datetime:'2026-08-16, 09:45 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting',                              by:'System'    },
  { id:10, member:'Santosh',   datetime:'2026-08-15, 03:00 PM', cat:'task',       type:'earn',   pts:8,   reason:'Task rated: Exceeds expectation — SoloBeauty',   by:'Ganesh'    },
  { id:11, member:'Santosh',   datetime:'2026-08-14, 02:30 PM', cat:'learning',   type:'earn',   pts:5,   reason:'Led learning session — Technical',               by:'System'    },
  { id:12, member:'Santosh',   datetime:'2026-08-13, 04:00 PM', cat:'conduct',    type:'deduct', pts:-20, reason:'Non-compliance after 3rd warning',               by:'Admin'     },

  // Debaditya
  { id:13, member:'Debaditya', datetime:'2026-08-16, 10:10 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting',                              by:'System'    },
  { id:14, member:'Debaditya', datetime:'2026-08-15, 06:15 PM', cat:'task',       type:'earn',   pts:8,   reason:'Task rated: Exceeds expectation — LinkedIn posts',by:'Swapnil'   },
  { id:15, member:'Debaditya', datetime:'2026-08-15, 02:30 PM', cat:'content',    type:'earn',   pts:5,   reason:'Content post published — LinkedIn',              by:'System'    },
  { id:16, member:'Debaditya', datetime:'2026-08-14, 04:30 PM', cat:'streak',     type:'earn',   pts:20,  reason:'85% weekly task completion bonus',               by:'System'    },

  // Swapnil
  { id:17, member:'Swapnil',   datetime:'2026-08-16, 09:55 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting',                              by:'System'    },
  { id:18, member:'Swapnil',   datetime:'2026-08-15, 05:00 PM', cat:'task',       type:'earn',   pts:5,   reason:'Task rated: Meets expectation — SkillSense',     by:'Nikita'    },
  { id:19, member:'Swapnil',   datetime:'2026-08-14, 02:30 PM', cat:'learning',   type:'earn',   pts:5,   reason:'Attended learning hour',                         by:'System'    },
  { id:20, member:'Swapnil',   datetime:'2026-08-13, 09:00 AM', cat:'attendance', type:'deduct', pts:-5,  reason:'Missed alternate-day task sync (4:00–4:30 PM)',   by:'System'    },

  // Nikita
  { id:21, member:'Nikita',    datetime:'2026-08-16, 10:20 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting',                              by:'System'    },
  { id:22, member:'Nikita',    datetime:'2026-08-15, 04:30 PM', cat:'task',       type:'earn',   pts:5,   reason:'Task rated: Meets expectation — Fun Day logistics',by:'Deepavali'},
  { id:23, member:'Nikita',    datetime:'2026-08-14, 02:30 PM', cat:'learning',   type:'earn',   pts:5,   reason:'Attended learning hour',                         by:'System'    },
  { id:24, member:'Nikita',    datetime:'2026-08-14, 04:30 PM', cat:'streak',     type:'earn',   pts:10,  reason:'Full week presence streak bonus',                by:'System'    },

  // Vedant
  { id:25, member:'Vedant',    datetime:'2026-08-16, 10:30 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting',                              by:'System'    },
  { id:26, member:'Vedant',    datetime:'2026-08-15, 05:30 PM', cat:'task',       type:'earn',   pts:8,   reason:'Task rated: Exceeds expectation — MindSpace onboarding',by:'Ganesh'},
  { id:27, member:'Vedant',    datetime:'2026-08-14, 02:30 PM', cat:'learning',   type:'earn',   pts:5,   reason:'Attended learning hour',                         by:'System'    },
  { id:28, member:'Vedant',    datetime:'2026-08-13, 11:45 AM', cat:'attendance', type:'deduct', pts:-10, reason:'Late arrival — outside reporting window',        by:'System'    },

  // Nakul
  { id:29, member:'Nakul',     datetime:'2026-08-16, 10:05 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting',                              by:'System'    },
  { id:30, member:'Nakul',     datetime:'2026-08-15, 04:00 PM', cat:'task',       type:'earn',   pts:3,   reason:'Task rated: Needs revision — Session timeout fix',by:'Ganesh'   },
  { id:31, member:'Nakul',     datetime:'2026-08-14, 02:30 PM', cat:'learning',   type:'earn',   pts:5,   reason:'Attended learning hour',                         by:'System'    },
  { id:32, member:'Nakul',     datetime:'2026-08-13, 04:30 PM', cat:'streak',     type:'earn',   pts:10,  reason:'Full week task reporting streak bonus',          by:'System'    },

  // Ashutosh
  { id:33, member:'Ashutosh',  datetime:'2026-08-16, 09:40 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting',                              by:'System'    },
  { id:34, member:'Ashutosh',  datetime:'2026-08-15, 06:00 PM', cat:'task',       type:'earn',   pts:5,   reason:'Task rated: Meets expectation — Website backend', by:'Debaditya' },
  { id:35, member:'Ashutosh',  datetime:'2026-08-14, 02:30 PM', cat:'content',    type:'earn',   pts:5,   reason:'Content post published — Instagram',             by:'System'    },
  { id:36, member:'Ashutosh',  datetime:'2026-08-13, 05:00 PM', cat:'learning',   type:'deduct', pts:-15, reason:'Missed learning hour (2:00–2:30 PM)',            by:'System'    },

  // Prerna
  { id:37, member:'Prerna',    datetime:'2026-08-16, 10:45 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting',                              by:'System'    },
  { id:38, member:'Prerna',    datetime:'2026-08-15, 03:30 PM', cat:'task',       type:'earn',   pts:5,   reason:'Task rated: Meets expectation — E-Zest logistics',by:'Santosh'  },
  { id:39, member:'Prerna',    datetime:'2026-08-14, 02:30 PM', cat:'learning',   type:'earn',   pts:5,   reason:'Attended learning hour',                         by:'System'    },
  { id:40, member:'Prerna',    datetime:'2026-08-14, 04:30 PM', cat:'streak',     type:'earn',   pts:10,  reason:'Full week presence streak bonus',                by:'System'    },

  // Prem
  { id:41, member:'Prem',      datetime:'2026-08-16, 11:00 AM', cat:'attendance', type:'deduct', pts:-10, reason:'Late arrival — outside 9:30–11:30 AM window',    by:'System'    },
  { id:42, member:'Prem',      datetime:'2026-08-15, 05:15 PM', cat:'task',       type:'earn',   pts:5,   reason:'Task rated: Meets expectation — NutriSure tracking',by:'Deepavali'},
  { id:43, member:'Prem',      datetime:'2026-08-14, 02:30 PM', cat:'learning',   type:'earn',   pts:5,   reason:'Attended learning hour',                         by:'System'    },
  { id:44, member:'Prem',      datetime:'2026-08-13, 04:30 PM', cat:'task',       type:'earn',   pts:5,   reason:'Daily check-in completed',                       by:'Deepavali' },

  // Komal
  { id:45, member:'Komal',     datetime:'2026-08-16, 09:50 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting',                              by:'System'    },
  { id:46, member:'Komal',     datetime:'2026-08-15, 04:45 PM', cat:'task',       type:'earn',   pts:3,   reason:'Task rated: Needs revision — Course drag-and-drop',by:'Swapnil' },
  { id:47, member:'Komal',     datetime:'2026-08-14, 02:30 PM', cat:'learning',   type:'earn',   pts:5,   reason:'Attended learning hour',                         by:'System'    },
  { id:48, member:'Komal',     datetime:'2026-08-13, 04:30 PM', cat:'streak',     type:'earn',   pts:10,  reason:'Full week task reporting streak bonus',          by:'System'    },

  // Shreya
  { id:49, member:'Shreya',    datetime:'2026-08-16, 10:15 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting',                              by:'System'    },
  { id:50, member:'Shreya',    datetime:'2026-08-15, 05:00 PM', cat:'task',       type:'earn',   pts:3,   reason:'Task rated: Needs revision — LMS progress dashboard',by:'Swapnil'},
  { id:51, member:'Shreya',    datetime:'2026-08-14, 04:30 PM', cat:'attendance', type:'deduct', pts:-5,  reason:'Missed alternate-day task sync',                 by:'System'    },
  { id:52, member:'Shreya',    datetime:'2026-08-13, 02:30 PM', cat:'learning',   type:'earn',   pts:5,   reason:'Attended learning hour',                         by:'System'    },

  // Vishal
  { id:53, member:'Vishal',    datetime:'2026-08-16, 09:35 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting',                              by:'System'    },
  { id:54, member:'Vishal',    datetime:'2026-08-15, 04:00 PM', cat:'task',       type:'earn',   pts:5,   reason:'Task rated: Meets expectation — Meal recommendation',by:'Deepavali'},
  { id:55, member:'Vishal',    datetime:'2026-08-14, 02:30 PM', cat:'learning',   type:'earn',   pts:5,   reason:'Attended learning hour',                         by:'System'    },
  { id:56, member:'Vishal',    datetime:'2026-08-14, 04:30 PM', cat:'streak',     type:'earn',   pts:10,  reason:'Full week presence streak bonus',                by:'System'    },

  // Suraj
  { id:57, member:'Suraj',     datetime:'2026-08-16, 10:00 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting',                              by:'System'    },
  { id:58, member:'Suraj',     datetime:'2026-08-15, 05:30 PM', cat:'task',       type:'earn',   pts:8,   reason:'Task rated: Exceeds expectation — LinkedIn posts', by:'Debaditya' },
  { id:59, member:'Suraj',     datetime:'2026-08-15, 02:30 PM', cat:'content',    type:'earn',   pts:5,   reason:'Content post published — X / Twitter',           by:'System'    },
  { id:60, member:'Suraj',     datetime:'2026-08-14, 11:00 AM', cat:'attendance', type:'deduct', pts:-10, reason:'Absent without prior notice',                    by:'System'    },

  // Nandini
  { id:61, member:'Nandini',   datetime:'2026-08-16, 09:55 AM', cat:'attendance', type:'earn',   pts:5,   reason:'On-time reporting',                              by:'System'    },
  { id:62, member:'Nandini',   datetime:'2026-08-15, 04:30 PM', cat:'task',       type:'earn',   pts:8,   reason:'Task rated: Exceeds expectation — Dashboard wireframes',by:'Ganesh'},
  { id:63, member:'Nandini',   datetime:'2026-08-14, 02:30 PM', cat:'learning',   type:'earn',   pts:5,   reason:'Attended learning hour',                         by:'System'    },
  { id:64, member:'Nandini',   datetime:'2026-08-14, 04:30 PM', cat:'streak',     type:'earn',   pts:20,  reason:'85% weekly task completion bonus',               by:'System'    },
];
```

---

## PAGE LAYOUT

Keep the exact same layout as the current `point-log.html`:
- Left nav sidebar (copy exactly from current file — do not change)
- Topbar: "POINT HISTORY" title + "// SYSTEM ONLINE" pill
- Content area: filter bar → member selector → stat cards → table → pagination

The only structural additions are:
1. A **member selector row** between the filter bar and stat cards
2. A **MEMBER column** added to the table (between DATE/TIME and CATEGORY)
3. Stats dynamically recalculate based on selected member

---

## SECTION 1: CATEGORY FILTER BAR

Keep exactly the same as the current file. Same chips, same colors, same logic.

```
[All] [Attendance] [Task] [Learning] [Content] [Streak] [Conduct]
```

Active chip: blue border + blue tint bg + blue text.
Clicking any chip filters the table. Combine with member filter (AND logic).

---

## SECTION 2: MEMBER SELECTOR (NEW)

Add this between the filter bar and the stat cards.

A horizontal row of member avatar pills. Includes an "ALL MEMBERS" option first.

```
[ALL MEMBERS] [Deepavali] [Santosh] [Debaditya] [Swapnil] [Ganesh] [Nikita]
[Vedant] [Nakul] [Ashutosh] [Nandini] [Prerna] [Prem] [Komal] [Shreya] [Vishal] [Suraj]
```

Style for each pill:
```css
.member-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px 5px 6px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text2);
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.member-pill:hover {
  border-color: rgba(79,195,247,0.4);
  color: var(--text);
}

.member-pill.active {
  border-color: var(--blue);
  background: rgba(79,195,247,0.08);
  color: var(--blue);
}

.member-avatar-sm {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(79,195,247,0.12);
  border: 1px solid rgba(79,195,247,0.3);
  color: var(--blue);
  font-family: 'Rajdhani', sans-serif;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

The "ALL MEMBERS" pill has no avatar — just the text. It is active by default.

Wrap the pills in a scrollable row if they overflow:
```css
.member-selector {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 4px 0;
}
```

Generate pills from `ALL_MEMBERS` array in JavaScript.
Clicking a member pill: sets `activeMember` variable, recalculates stats and re-renders table.
Clicking "ALL MEMBERS": resets `activeMember` to `null`.

---

## SECTION 3: STAT CARDS

Keep the 3-card layout exactly (Earned / Deducted / Net). Same icons, same sparklines.

**Change:** values are now computed dynamically from filtered data.

```javascript
// When activeMember = null: use ALL_LOGS
// When activeMember = 'Ganesh': use ALL_LOGS.filter(l => l.member === 'Ganesh')

function computeStats(logs) {
  const earned  = logs.filter(l => l.type === 'earn').reduce((s,l) => s + l.pts, 0);
  const deducted= logs.filter(l => l.type === 'deduct').reduce((s,l) => s + Math.abs(l.pts), 0);
  const net     = earned - deducted;
  return { earned, deducted, net };
}
```

Update the displayed values every time member or category filter changes.

Stat card labels:
- When ALL MEMBERS: "Total Earned (All Members)" / "Total Deducted (All Members)" / "Net (All Members)"
- When a member is selected: "Total Earned (Ganesh)" / etc.

---

## SECTION 4: TABLE

Keep the same table style. Add one new column: **MEMBER**.

Updated column order:
```
DATE & TIME | MEMBER | CATEGORY | POINTS | REASON | LOGGED BY
```

**MEMBER column style:**
```css
.td-member {
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-avatar-tbl {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(79,195,247,0.1);
  border: 1px solid rgba(79,195,247,0.3);
  color: var(--blue);
  font-family: 'Rajdhani', sans-serif;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.member-name-tbl {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
}

.member-name-tbl:hover {
  color: var(--blue);
  text-decoration: underline;
}
```

Clicking a member name in the table activates that member's pill filter
(same as clicking the pill in the member selector row).

Member initials: take first letter of each word. E.g. "Deepavali" → "DP" (first 2 chars).
For single-word names: first 2 characters uppercase.

```javascript
function initials(name) {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
```

**POINTS column:**
- Earn: `+N` in teal color, Bebas Neue font
- Deduct: `−N` in red color, Bebas Neue font

```javascript
function ptsCell(log) {
  if (log.type === 'earn')
    return `<span style="font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:0.5px;color:var(--teal)">+${log.pts}</span>`;
  return `<span style="font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:0.5px;color:var(--red)">${log.pts}</span>`;
}
```

**CATEGORY chips** — keep exactly the same colors as the current file:
```javascript
function catChip(cat) {
  const map = {
    attendance: ['cat-attendance', 'ATTENDANCE'],
    task:       ['cat-task',       'TASK'],
    learning:   ['cat-learning',   'LEARNING'],
    content:    ['cat-content',    'CONTENT'],
    streak:     ['cat-streak',     'STREAK'],
    conduct:    ['cat-conduct',    'CONDUCT'],
  };
  const [cls, label] = map[cat] || ['cat-task', cat.toUpperCase()];
  return `<span class="cat-chip ${cls}">${label}</span>`;
}
```

---

## SECTION 5: FILTERING LOGIC

All filtering is client-side. Two active filters at all times:
- `activeCategory` — string: 'all' / 'attendance' / 'task' / 'learning' / 'content' / 'streak' / 'conduct'
- `activeMember` — string or null: member name or null for all

```javascript
let activeCategory = 'all';
let activeMember = null;
let currentPage = 1;
const PER_PAGE = 10;

function getFiltered() {
  return ALL_LOGS.filter(l => {
    const catMatch = activeCategory === 'all' || l.cat === activeCategory;
    const memMatch = activeMember === null || l.member === activeMember;
    return catMatch && memMatch;
  });
}

function render() {
  const filtered = getFiltered();
  const stats = computeStats(filtered);
  updateStats(stats);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  renderTable(paginated);
  updatePagination(filtered.length);
}
```

Call `render()` on:
- Page load
- Category chip click
- Member pill click

Reset `currentPage = 1` whenever a filter changes.

---

## SECTION 6: PAGINATION

Keep exactly the same pagination style as the current file (pg-btn, pagination-row, etc).

Update `pageInfo` text dynamically:
```javascript
function updatePagination(total) {
  const start = (currentPage - 1) * PER_PAGE + 1;
  const end = Math.min(currentPage * PER_PAGE, total);
  document.getElementById('pageInfo').textContent =
    total === 0 ? 'No entries found' : `Showing ${start} to ${end} of ${total} entries`;
  // rebuild page buttons based on Math.ceil(total / PER_PAGE)
}
```

---

## TOPBAR CHANGE

Update the topbar subtitle from nothing to:
```
POINT HISTORY
Public record of all team point activity
```

Subtitle style: `font-size: 13px; color: var(--text2);` — same as other pages' subtitles.

---

## WHAT NOT TO CHANGE

- Do NOT change the sidebar HTML — copy it exactly from the current `point-log.html`
- Do NOT change `css/global.css`
- Do NOT add any backend fetch() calls
- Do NOT change any other page
- Do NOT change the category chip styles or colors
- Do NOT remove the sparkline canvases (keep them, populate with dummy data)
- The file stays at `frontend/point-log.html`

---

## QUALITY CHECKLIST

- [ ] `<link rel="stylesheet" href="css/global.css">` in `<head>`
- [ ] Google Fonts link in `<head>`
- [ ] Sidebar copied exactly from current `point-log.html` — Point Log nav link is `.active`
- [ ] Admin panel link = `admin/admin_dashboard.html`
- [ ] Collapse button JS uses the panel-icon SVG (rect+line+polyline)
- [ ] "ALL MEMBERS" pill is active by default on page load
- [ ] MEMBER column present in table between DATE/TIME and CATEGORY
- [ ] Clicking member name in table activates that member's pill
- [ ] Stats recalculate when member or category filter changes
- [ ] Stat card labels update to show selected member name or "All Members"
- [ ] +N in teal, −N in red using Bebas Neue font
- [ ] Category + member filters combine (AND logic)
- [ ] Pagination recalculates on filter change, resets to page 1
- [ ] Empty state shown when filter returns zero results
- [ ] All 64 mock log entries present in ALL_LOGS array
- [ ] ALL_MEMBERS array used to generate member pills from JS (not hardcoded HTML)

---

*End of instructions. Only one file changes: `frontend/point-log.html`*
