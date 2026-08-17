# Vitals&Vectors — System Context & Architecture
## READ THIS BEFORE TOUCHING ANY FILE
## Version 1.0 — Permanent Reference

---

## WHAT THIS PORTAL IS

Vitals&Vectors is a **public read-only monitoring portal** for a research lab team.
It is NOT a personal dashboard. It is NOT a login-protected member portal.
It is a transparency board — like a public scoreboard — where anyone can open
the URL and see the full picture of the team's work, points, and attendance.

---

## THE THREE REALITIES

### Reality 1 — Data comes from outside, not from this portal

This portal does NOT create data. All data originates from external sources:

| Data type | Source | Integration status |
|---|---|---|
| Tasks | Google Classroom | 🔲 Future — placeholder for now |
| Attendance / check-in times | Premises app | 🔲 Future — placeholder for now |
| Points (earned from tasks) | Computed from task ratings | 🔲 Future |
| Points (earned from attendance) | Computed from Premises data | 🔲 Future |
| Member list | Admin adds manually on this portal | ✅ This portal does this |

For now: ALL data is hardcoded mock data in JavaScript arrays.
When real integrations are built later, the mock arrays will be replaced
with API fetch calls. Until then, every page shows realistic mock data.

### Reality 2 — Only ONE thing is managed on this portal

**The only admin action this portal handles is:**
- Adding members (name, role)
- Manually logging point events (earn or deduct) when automation is not yet ready
- Confirming Hero of the Week and Hero of the Month

Everything else — tasks, attendance, point calculations — comes from
external sources and is only displayed here, never created here.

### Reality 3 — No personal login for regular members

Regular team members do NOT log in. There is no "my dashboard" or "my tasks."
The portal is open. Anyone — a team member, a guest, a lab visitor — can
open any page and see everything.

The ONLY login that exists is a single admin login that unlocks the admin panel.
Even the admin login is a future feature. For now, the admin panel is accessible
directly (no auth gate yet — placeholder only).

---

## WHO SEES WHAT

| Page | Who can access | What they see |
|---|---|---|
| Dashboard | Everyone (public) | Team chart, all members' points, rank, streaks |
| Tasks (all-tasks.html) | Everyone (public) | All tasks across all projects — fetched from Google Classroom in future |
| Project view (project.html) | Everyone (public) | All tasks for one project, kanban board |
| Hunter view (hunter.html) | Everyone (public) | One member's tasks + point history |
| Point Log (point-log.html) | Everyone (public) | Full team point history — all members |
| Leaderboard | Everyone (public) | Weekly + monthly rankings |
| Attendance | Everyone (public) | Team attendance — fetched from Premises app in future |
| Rules | Everyone (public) | Static rulebook |
| Settings | Everyone (public) | Basic info — no sensitive actions yet |
| Admin panel | Admin only (single login) | Add members, log points, confirm heroes |

---

## WHAT THE ADMIN CAN DO (and ONLY the admin)

1. **Add a member** — name, role (U5 Coordinator / Member)
2. **Log a point event** — select member, category, earn/deduct, amount, reason
3. **Confirm Hero of the Week** — select the top scorer for the week, trigger recognition
4. **Confirm Hero of the Month** — select member(s) who crossed 300 pts threshold

That is the complete list. The admin does NOT create tasks (Google Classroom does).
The admin does NOT log attendance (Premises app does).

---

## WHAT PLACEHOLDER MEANS IN THIS PROJECT

Whenever a feature requires an external data source not yet connected, the UI must:

1. Show realistic mock data so the page looks complete
2. Show a small amber/yellow banner: `⚠ Data shown is mock. Live data from [Source] pending.`
3. Any button that would trigger a real action shows a toast:
   `"This will connect to [Google Classroom / Premises app] in a future update."`

Do NOT hide the placeholder sections or mark them as "coming soon" in a way
that breaks the visual layout. The page must look fully functional at all times.

---

## NAMING CONVENTIONS — USE EXACTLY AS WRITTEN

### The 6 U5 Coordinators (task leads)
```
Deepavali, Santosh, Debaditya, Swapnil, Ganesh, Nikita
```

### Other team members
```
Vedant, Nakul, Ashutosh, Nandini, Prerna, Prem, Komal, Shreya, Vishal, Suraj, Krishna, Umesh
```

### Lab name
```
Vitals&Vectors   ← always with & not "and", not "VitalVectors", not "Vital Vectors"
```

### Portal short name
```
V&V
```

### Rank system
```
E — Unranked Hunter   (0–99 pts)
D — Bronze Hunter     (100–149 pts)
C — Iron Hunter       (150–199 pts)
B — Silver Hunter     (200–249 pts)
A — Gold Hunter       (250–299 pts)
S — Platinum Hunter   (300–399 pts)
SS — Shadow Monarch   (400+ pts)
```

---

## FILE STRUCTURE — DO NOT DEVIATE

```
frontend/
├── login.html              ← Admin login only (future). Currently a placeholder.
├── dashboard.html          ← Public. Team overview.
├── all-tasks.html          ← Public. All tasks from all projects.
├── tasks.html              ← Public. Task dashboard with project cards.
├── project.html            ← Public. Single project kanban view.
├── hunter.html             ← Public. Single member profile + point history.
├── point-log.html          ← Public. All members' point history.
├── leaderboard.html        ← Public. Weekly + monthly rankings.
├── attendance.html         ← Public. Team attendance (Premises placeholder).
├── rules.html              ← Public. Static rulebook.
├── settings.html           ← Public. Basic info.
├── admin/
│   ├── admin_dashboard.html← Admin only. Overview + hero confirmation.
│   ├── members.html        ← Admin only. Add/manage members.
│   └── assign-tasks.html   ← Admin only. Log points + rate tasks.
├── css/
│   └── global.css          ← Shared styles. Never duplicate in page files.
└── js/
    └── dashboard.js        ← Dashboard chart logic.
```

---

## THEME — DO NOT CHANGE

The visual theme is fixed. Do not introduce new colors, fonts, or component styles.

```
Background:       #0A0A0F
Panel:            #0D0D1A
Elevated:         #12121F
Blue (primary):   #4FC3F7
Teal (success):   #00E5FF
Purple (rank/SS): #9A7BFF
Red (danger):     #FF1744
Amber (warning):  #FFB300
Gold (hero):      #FFD700
Border:           rgba(79,195,247,0.1)
Text primary:     #E8E8F0
Text secondary:   #8A8AA3

Fonts:
  Display/headings: Bebas Neue
  Body/UI:          Inter
  Labels/system:    Rajdhani
```

All pages use `css/global.css` for shared styles.
Only page-specific CSS goes in each page's own `<style>` block.

---

## THINGS THE AGENT MUST NEVER DO

- Never add a login wall to any public page
- Never show "You must log in to view this" on public pages
- Never build a "personal dashboard" that shows only one member's data
- Never remove the admin panel link from the sidebar
- Never rename files — use exact filenames from the file structure above
- Never create a `members.html` at the root level (it exists only inside `admin/`)
- Never create `index.html` — the login page is `login.html`
- Never use localStorage for anything except admin session (future)
- Never fetch from any API — all data is mock arrays for now
- Never change `css/global.css`
- Never use React, Vue, npm, or any build tool

---

## HOW EACH PAGE SHOULD THINK ABOUT DATA

```
Dashboard:      MEMBERS array → show all, sorted by points_total
all-tasks.html: ALL_TASKS array → filter/search client-side
project.html:   ALL_TASKS filtered by projectId (from URL param)
hunter.html:    ALL_TASKS + ALL_LOGS filtered by member name (from URL param)
point-log.html: ALL_LOGS → all members visible, member filter pill available
leaderboard.html: MEMBERS sorted by points_this_week / points_this_month
attendance.html: ATTENDANCE mock data (Premises format) — placeholder banner
admin panel:    Same MEMBERS + ALL_LOGS data, plus action forms
```

---

*This document is permanent project context. Read it at the start of every task.*
*If any instruction in a task conflicts with this document, this document wins.*
