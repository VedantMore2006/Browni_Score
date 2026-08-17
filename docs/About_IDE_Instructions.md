# Vitals&Vectors — About Page
## IDE Agent Instructions v1.0

---

## PREREQUISITE

Read `docs/SYSTEM_CONTEXT.md` before touching any file.

---

## WHAT YOU ARE DOING

**Rename and replace:** `frontend/settings.html` → becomes the "About" page.

- The file stays named `settings.html` (do not rename the file)
- The page title changes to "ABOUT" everywhere (topbar, browser tab)
- The sidebar nav label for this link changes from "Settings" to "About"
- Update this label in ALL other pages' sidebars too (see list at bottom)

---

## PAGE LAYOUT

Same shell as all other pages: left sidebar + main content area.
Same topbar style. Same card style. No new CSS patterns.

Content area: `flex-direction: column`, `gap: 16px`, `padding: 16px 24px`.

---

## SECTION 1: TOPBAR

```
Left:  "ABOUT"  (Bebas Neue, page-title class)
       "Public information portal for Vitals&Vectors Research Lab"
       (13px, color: var(--text2), margin-top: 2px)

Right: "// SYSTEM ONLINE" pill (same as all other pages)
```

---

## SECTION 2: ABOUT THIS SYSTEM (card)

One full-width card. Top accent line: blue gradient (same as other cards on hover — make it permanent here, always visible).

Content inside:

```
[Header row]
Logo text: "V&V"  (Bebas Neue, 2rem, var(--blue), text-shadow glow)
Separator: thin vertical line (1px, var(--border), height 32px)
Lab name: "Vitals&Vectors Research Lab"  (Bebas Neue, 1.4rem, var(--text))

[Body — two columns, gap 32px]

LEFT COLUMN:
  Label: "WHAT IS THIS"  (Rajdhani, 10px, uppercase, letter-spacing, var(--text2))
  Text: "Vitals&Vectors is a research lab monitoring portal. It provides full
         transparency into team activity — tasks, points, attendance, and rankings
         are visible to everyone. No login required."
  (Inter, 13px, var(--text2), line-height 1.6, margin-top 8px)

RIGHT COLUMN:
  Label: "HOW IT WORKS"  (same label style)
  Text: "Team members earn Brownie Points through task completion, attendance,
         learning hours, and content contributions. Points determine weekly and
         monthly rankings. The top scorer each week wins Hero of the Week.
         Members who cross 300 points in a month earn Hero of the Month."
  (same text style)
```

---

## SECTION 3: SCORING PERIOD (card)

Full-width card. Top accent: teal gradient.

```
Card label: "CURRENT SCORING PERIOD"  (Rajdhani, uppercase)

[4-column stat strip inside the card]

Col 1 — accent: blue
  Label: "WEEK START"
  Value: Monday of current week  (computed from JS, format: "18 Aug 2026")

Col 2 — accent: blue
  Label: "WEEK END"
  Value: Sunday of current week  (computed from JS)

Col 3 — accent: purple
  Label: "MONTH"
  Value: Current month + year  (e.g. "August 2026")

Col 4 — accent: amber
  Label: "HERO THRESHOLD"
  Value: "300 pts"
```

Each column: same stat-card style as dashboard (dark panel, left accent bar 3px, label in muted text, value in Bebas Neue).

JS to compute dates:
```javascript
function getScoringPeriod() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = d => d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
  const month = now.toLocaleDateString('en-IN', { month:'long', year:'numeric' });

  return { weekStart: fmt(monday), weekEnd: fmt(sunday), month };
}

function init() {
  const { weekStart, weekEnd, month } = getScoringPeriod();
  document.getElementById('sp-week-start').textContent = weekStart;
  document.getElementById('sp-week-end').textContent   = weekEnd;
  document.getElementById('sp-month').textContent      = month;
}

init();
```

Give the value elements ids: `sp-week-start`, `sp-week-end`, `sp-month`.
Hero threshold is always static: "300 pts".

---

## SECTION 4: POINT SYSTEM QUICK REFERENCE (card)

Full-width card. Top accent: green gradient (use `rgba(0,229,255,0.5)` for teal).

```
Card label: "POINT SYSTEM — QUICK REFERENCE"
```

Two columns inside, gap 24px:

**LEFT COLUMN — Earning Points**

Small section header: "+ EARNING"  (Rajdhani, 10px, var(--teal), uppercase)

Table-style rows (no actual `<table>` tag — use flex rows):
```
On-time reporting (per week)          +5 pts
Full week presence streak bonus       +10 pts
Full week task reporting streak       +10 pts
Task: needs revision                  +3 pts
Task: meets expectation               +5 pts
Task: exceeds expectation             +8 pts
85% weekly task completion            +20 pts
Attended learning hour (per session)  +5 pts
Content post published                +5 pts
Led a learning session                +5 pts
Helped a teammate (verified)          +5 pts
```

Each row: flex space-between, border-bottom 1px solid rgba(79,195,247,0.05), padding 6px 0.
Label: Inter 12px, var(--text2).
Points: Bebas Neue 13px, var(--teal), letter-spacing 0.5px.

**RIGHT COLUMN — Deductions**

Small section header: "− DEDUCTIONS"  (Rajdhani, 10px, var(--red), uppercase)

```
Late arrival (outside window)         −10 pts
Absent without notice (per day)       −10 pts
Missed task sync (4–4:30 PM)          −10 pts
Task missed without flagging          −20 pts
Task sheet not updated                −15 pts
Task delayed, no renegotiation        −15 pts
Missed learning hour                  −15 pts
Content posts < 2 in month            −10 pts
Non-compliance after 3rd warning      −20 pts
```

Same row style. Points: var(--red).

---

## SECTION 5: RANK SYSTEM (card)

Full-width card. Top accent: purple gradient.

```
Card label: "RANK SYSTEM"
```

A horizontal row of 7 rank cards, equal width, gap 10px.
Each rank card:

```css
.rank-ref-card {
  flex: 1;
  background: var(--elevated);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px 8px;
  text-align: center;
  transition: border-color 0.2s, transform 0.2s;
}
.rank-ref-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-glow);
}
```

Inside each card (top to bottom):
1. Rank hexagon badge (same clip-path style as sidebar — 36px, rank color border + bg tint)
2. Rank code letter (Bebas Neue, 1.1rem, rank color)
3. Rank label (Rajdhani, 9px, uppercase, letter-spacing, var(--text2), margin-top 4px)
4. Points range (Inter, 11px, var(--text2), margin-top 2px)

```javascript
const RANKS = [
  { code:'E',  label:'Unranked Hunter',  range:'0 – 99',    color:'#8A93A8' },
  { code:'D',  label:'Bronze Hunter',    range:'100 – 149', color:'#CD7F32' },
  { code:'C',  label:'Iron Hunter',      range:'150 – 199', color:'#B0B0B0' },
  { code:'B',  label:'Silver Hunter',    range:'200 – 249', color:'#4FC3F7' },
  { code:'A',  label:'Gold Hunter',      range:'250 – 299', color:'#FFD700' },
  { code:'S',  label:'Platinum Hunter',  range:'300 – 399', color:'#00E5FF' },
  { code:'SS', label:'Shadow Monarch',   range:'400+',      color:'#9A7BFF' },
];
```

Render from JS into `id="rankRefRow"` container:
```javascript
document.getElementById('rankRefRow').innerHTML = RANKS.map(r => `
  <div class="rank-ref-card">
    <div style="width:36px;height:36px;margin:0 auto 6px;
      clip-path:polygon(50% 0%,95% 25%,95% 75%,50% 100%,5% 75%,5% 25%);
      background:${r.color}18;border:1.5px solid ${r.color};
      display:flex;align-items:center;justify-content:center;
      font-family:'Bebas Neue',sans-serif;font-size:14px;color:${r.color};
      ${r.code==='SS' ? `box-shadow:0 0 12px ${r.color}66;` : ''}">
      ${r.code}
    </div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:${r.color};letter-spacing:0.05em;">${r.code}</div>
    <div style="font-family:'Rajdhani',sans-serif;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text2);margin-top:4px;line-height:1.3;">${r.label}</div>
    <div style="font-size:11px;color:var(--text2);margin-top:3px;">${r.range} pts</div>
  </div>
`).join('');
```

SS rank badge gets pulsing glow: `animation: pulse-glow 2s infinite;`

---

## SECTION 6: ADMIN QUICK ACCESS (card)

Full-width card. Top accent: red gradient. Only shows admin links.

```
Card label: "ADMIN ACCESS"
Subtitle: "Admin-only actions for managing the portal."
(13px, var(--text2), margin-bottom 16px)
```

Two buttons side by side:

```html
<div style="display:flex; gap:12px;">
  <a href="admin/admin_dashboard.html" class="btn-admin-link">
    <svg><!-- shield icon --></svg>
    Admin Panel
  </a>
  <a href="admin/members.html" class="btn-admin-link secondary">
    <svg><!-- users icon --></svg>
    Manage Members
  </a>
</div>
```

```css
.btn-admin-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 6px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid rgba(255,23,68,0.4);
  color: var(--red);
  background: rgba(255,23,68,0.06);
}
.btn-admin-link:hover {
  background: rgba(255,23,68,0.12);
  box-shadow: 0 0 16px rgba(255,23,68,0.2);
}
.btn-admin-link.secondary {
  border-color: rgba(79,195,247,0.3);
  color: var(--blue);
  background: rgba(79,195,247,0.06);
}
.btn-admin-link.secondary:hover {
  background: rgba(79,195,247,0.1);
  box-shadow: 0 0 16px rgba(79,195,247,0.15);
}
.btn-admin-link svg { width:16px; height:16px; }
```

---

## SECTION 7: SYSTEM INFO (card)

Full-width card. Small, minimal. Bottom of page.

```
Card label: "SYSTEM INFO"

[Two-column flex row, gap 32px]

LEFT:
  Label: "PORTAL VERSION"   value: "v1.0.0"
  Label: "LAST UPDATED"     value: current date computed from JS
  Label: "ENVIRONMENT"      value: "Local Development"

RIGHT:
  Label: "BACKEND"          value: "⚠ Connection Pending"  (amber color)
  Label: "ATTENDANCE DATA"  value: "⚠ Premises App — Not Connected"  (amber)
  Label: "TASK DATA"        value: "⚠ Google Classroom — Not Connected"  (amber)
```

Each info row: flex row, label in Rajdhani 10px muted uppercase, value in Inter 12px var(--text), gap 8px, padding 5px 0, border-bottom rgba(79,195,247,0.05).

The pending items use amber color: `color: var(--amber)`.

JS for last updated:
```javascript
document.getElementById('sysDate').textContent =
  new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
```

---

## SIDEBAR UPDATE — RENAME "Settings" to "About" IN ALL PAGES

The sidebar nav link for settings.html currently shows "Settings" in every page.
Change the label to "About" in these files:

```
frontend/dashboard.html
frontend/all-tasks.html
frontend/tasks.html
frontend/project.html
frontend/hunter.html
frontend/point-log.html
frontend/leaderboard.html
frontend/attendance.html
frontend/rules.html
frontend/settings.html         ← active link on this page
frontend/admin/admin_dashboard.html
frontend/admin/members.html
frontend/admin/assign-tasks.html
```

In each file, find the nav item that links to `settings.html` (or `../settings.html` in admin pages) and change the label:
```html
<!-- BEFORE -->
<span class="nav-label">Settings</span>

<!-- AFTER -->
<span class="nav-label">About</span>
```

The href stays the same (`settings.html` or `../settings.html`). Only the visible label changes.
Mark the link `.active` only in `settings.html` itself.

---

## WHAT NOT TO CHANGE

- Do NOT rename `settings.html` — the filename stays as-is
- Do NOT change `css/global.css`
- Do NOT change any other page's content, layout, or data
- Do NOT add any `fetch()` calls
- Keep the sidebar HTML copied exactly from the current `settings.html`

---

## QUALITY CHECKLIST

- [ ] `<link rel="stylesheet" href="css/global.css">` in `<head>`
- [ ] Browser tab title: "Vitals&Vectors — About"
- [ ] Topbar shows "ABOUT" as page title with subtitle
- [ ] Sidebar nav label shows "About" (not "Settings") — About link is `.active`
- [ ] Section 2: About card — two columns, lab description correct
- [ ] Section 3: Scoring period — week start/end computed from real current date
- [ ] Section 4: Point quick reference — all earning + deduction rows present with correct values
- [ ] Section 5: Rank system — all 7 ranks rendered from JS, SS has pulse animation
- [ ] Section 6: Admin access — two buttons linking to admin pages correctly
- [ ] Section 7: System info — backend/attendance/task statuses show amber warning
- [ ] "Settings" → "About" label updated in ALL 13 page sidebars listed above
- [ ] No fictional data anywhere
- [ ] No `fetch()` calls

---

*End of instructions. Primary file: `frontend/settings.html`. Sidebar label update in 12 other files.*
