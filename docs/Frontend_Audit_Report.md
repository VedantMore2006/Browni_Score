# Vitals&Vectors — Frontend Phase 1 Audit Report
## Pre-Backend Integration Review

---

## CRITICAL ISSUES (must fix before backend)

---

### ISSUE 1 — "SAB" vs "Umesh" — Member name mismatch across pages

**Severity: Critical**

The 18th member's correct name is **Umesh**. It is incorrectly written as `SAB` in some files:

| File | Name used | Correct? |
|---|---|---|
| `leaderboard.html` MEMBERS array | `Umesh` (init: 'UM') | ✅ Correct |
| `point-log.html` ALL_MEMBERS array | `Umesh` | ✅ Correct |
| `admin/admin_dashboard.html` MEMBERS array | `SAB` (init: 'SB') | ❌ Wrong |
| `docs/SYSTEM_CONTEXT.md` | `SAB` | ❌ Wrong |
| Task instructions | `SAB` | ❌ Wrong |

**Fix:** Change `SAB` → `Umesh` (init: `UM`) in `admin/admin_dashboard.html`, `docs/SYSTEM_CONTEXT.md`, and all task instruction docs where `SAB` appears.

---

### ISSUE 2 — Sidebar profile shows "Aarav Singh" — a fictional name

**Severity: Critical**

Every page's sidebar bottom section shows:
- Avatar initials: `AS`
- Name: `Aarav Singh`
- Role: `Coordinator`
- Rank badge: `S` / `SILVER HUNTER`

`Aarav Singh` is one of the old fictional placeholder names and is NOT a real team member.

This appears identically in: `dashboard.html`, `tasks.html`, `all-tasks.html`, `point-log.html`, `leaderboard.html`, `attendance.html`, `rules.html`, `settings.html`, `hunter.html`, `project.html`

**Fix:** Since this is a public portal with no personal login, this sidebar profile block has no real purpose. Two options:
- Option A (recommended): Remove the profile-row, profile-badge section entirely. Keep only the logout button and collapse button.
- Option B: Replace with a generic "Vitals&Vectors" identity placeholder — initials `V&V`, name "Lab Portal", role "Public View".

---

### ISSUE 3 — "Logout" button goes nowhere on all public pages

**Severity: Critical**

Every page has a `nav-logout` div with a logout icon and "Logout" label. On a public portal there is no session to log out of. Clicking it does nothing (no `href`, no `onclick`).

**Affected pages:** All 10 public pages.

**Fix:** Either:
- Remove the Logout button from all public pages entirely
- Or change it to an "Admin Login" link pointing to `login.html`

---

### ISSUE 4 — `all-tasks.html` active nav link is wrong

**Severity: Critical**

In `all-tasks.html` sidebar, the active nav link is `tasks.html` (the Tasks nav item is marked `.active`). But `all-tasks.html` is a separate page — it should either mark the Tasks link active (acceptable since it's the same section) OR have its own nav entry.

Currently `all-tasks.html` is NOT in the sidebar navigation at all. There is no way to navigate to it from the sidebar. The only way to reach it is:
- From `dashboard.html` "View All Projects" button → `all-tasks.html` ✅
- From `dashboard.html` "View all" link on Upcoming Deadlines → `all-tasks.html` ✅
- From `tasks.html` itself via buttons → needs verification

**Fix:** Either add `all-tasks.html` to the sidebar (as a sub-item under Tasks), or keep it as a drill-down page (not in nav) and ensure the "Tasks" nav link always goes to `tasks.html` as the entry point.

---

### ISSUE 5 — `project.html` and `hunter.html` are not in the sidebar

**Severity: High**

`project.html` and `hunter.html` are drill-down pages accessed by clicking project names or member names elsewhere. They correctly have no sidebar nav entry. However their sidebars still show Tasks as `.active` which is acceptable since they are part of the task system.

**But:** The back button in both pages reads `← All Tasks` and links to `tasks.html`. This is correct and consistent.

No fix needed — just confirming this is intentional.

---

## DESIGN / THEME INCONSISTENCIES

---

### ISSUE 6 — Two different CSS variable systems running in parallel

**Severity: High**

There are two different sets of CSS variables being used across the project:

**System A** (used in `dashboard.html`, `tasks.html` via `dashboard.css`):
```css
--bg-card, --border-dim, --cyan, --green, --text-primary, --text-secondary, --text-muted
```

**System B** (used in all other pages via inline `:root` blocks):
```css
--panel, --elevated, --border, --border-h, --text, --text2, --text3, --blue, --teal
```

This means `dashboard.html` and `tasks.html` use completely different variable names from every other page. When backend wiring begins, any shared component code will break because the variables won't resolve.

`dashboard.html` loads `css/dashboard.css` in addition to `css/global.css`. `tasks.html` also loads `css/dashboard.css`. No other page does.

**Fix:** Either:
- Move all System A variables into `global.css` as aliases, OR
- Strip `dashboard.css` from `tasks.html` since `tasks.html` is now a task dashboard and should match the other pages

---

### ISSUE 7 — `project.html`, `all-tasks.html`, `hunter.html` redefine `:root` variables inline

**Severity: Medium**

These three pages define a full `:root {}` block inside their `<style>` tags that duplicates what `global.css` already provides. This is redundant and creates a risk: if `global.css` variables change, these inline overrides will silently shadow them.

**Affected files:** `project.html`, `all-tasks.html`, `hunter.html`, `tasks.html`

**Fix:** Remove the inline `:root` blocks from these pages. They all link `global.css` which already defines these variables.

---

### ISSUE 8 — `Orbitron` font loaded on dashboard and tasks but nowhere else

**Severity: Low**

`dashboard.html` and `tasks.html` load the `Orbitron` font in addition to Bebas Neue, Inter, and Rajdhani. No other page uses Orbitron. This creates a subtle visual inconsistency — number values on the dashboard look different from number values on the leaderboard or point-log.

**Fix:** Either add Orbitron to all pages that show large numeric values, or remove it from dashboard and tasks and use Bebas Neue consistently everywhere (which is the established display font).

---

### ISSUE 9 — Status pill style inconsistency: "// SYSTEM ONLINE"

**Severity: Low**

The System Online status pill has two different styles:

- `tasks.html`, `hunter.html`: inline-styled with `background:rgba(0,229,255,0.1)`, teal color, `border-radius:12px`, teal pulsing dot — this is your own custom addition
- All other pages: uses `.status-badge` / `.status-pill` class from `global.css`

Both look similar but are different HTML structures. When backend wiring adds dynamic status detection, only one style should be used.

**Fix:** Standardise to the `global.css` `.status-badge` class on all pages.

---

## DATA INCONSISTENCIES

---

### ISSUE 10 — Point Log shows "Krishna" but has no tasks assigned to Krishna in ALL_TASKS

**Severity: Medium**

`point-log.html` has point log entries for `Krishna` (ids 65-68 in ALL_LOGS if present). But `ALL_TASKS` in every page has NO tasks assigned to `Krishna`. If a user clicks Krishna's name in the point-log table → opens `hunter.html?name=Krishna` → they see "Hunter not found or has no tasks assigned yet."

Same applies to `Umesh` — no tasks assigned, logs exist.

**Fix:** Either add at least 1-2 tasks for Krishna and SAB in the `ALL_TASKS` array across all pages, or accept that hunter.html will show the empty state for these members (the error state UI is already built).

---

### ISSUE 11 — Leaderboard rank badge has missing CSS variants

**Severity: Medium**

`leaderboard.html` uses `.rank-hex-sm.{rank}` classes but only defines CSS for `.rank-hex-sm.s`, `.rank-hex-sm.a`, `.rank-hex-sm.c`. The variants for `e`, `d`, `b`, `ss` are missing. Members with these ranks (Swapnil=b, Nakul/Santosh=c, Ashutosh/Vishal=d, Prem/SAB=e) will have unstyled rank badges in the podium.

The `renderPodium()` function handles this via inline `style` attributes on the hex element, so it works — but the CSS classes are dead declarations.

**Fix:** Either add the missing CSS classes (`.rank-hex-sm.e`, `.rank-hex-sm.d`, `.rank-hex-sm.b`, `.rank-hex-sm.ss`) or remove the three existing classes and rely entirely on inline styles — which is already what the JS does.

---

### ISSUE 12 — `tasks.html` ("Task Dashboard") links to `all-tasks.html` but nav marks `tasks.html` as active

**Severity: Low**

`tasks.html` is now a visual dashboard for task stats (with charts, team activity, project overview). It is NOT the full task list. The full task list is `all-tasks.html`. But:
- The sidebar nav link "Tasks" points to `tasks.html`
- `all-tasks.html` sidebar marks the "Tasks" link as active (pointing to `tasks.html`)

So clicking "Tasks" in the nav takes you to the dashboard view, not the list. Users who want the task list must find a button inside `tasks.html` that says "View All Tasks" → `all-tasks.html`.

This is actually fine UX-wise, but needs to be documented as intentional.

---

### ISSUE 13 — Admin dashboard MEMBERS array has `warnings:2` for Prerna and Krishna but point-log shows no conduct deduction for Krishna

**Severity: Low**

The admin dashboard flags Prerna (2 warnings) and Krishna (2 warnings) in alerts. But `point-log.html` has no conduct deductions for Krishna. Only Santosh has a conduct deduction in the logs. Minor data inconsistency — not critical but visible when comparing pages.

**Fix:** Add a conduct deduction log entry for Krishna and Prerna to make the data consistent.

---

## BROKEN / UNLINKED BUTTONS & ELEMENTS

---

### ISSUE 14 — "Export CSV" button in `all-tasks.html` does nothing

**Severity: Medium**

`all-tasks.html` has a toolbar with filter buttons and an "Export CSV" button. The button has no `onclick` handler. Clicking it silently does nothing.

**Fix:** Add a `showToast()` call: `"CSV export will be available after backend integration."` Or add a simple client-side CSV export from the current filtered data.

---

### ISSUE 15 — Filter modal in `all-tasks.html` has "Apply Filters" and "Clear" buttons with no handlers

**Severity: Medium**

The advanced filter modal in `all-tasks.html` has:
- "Apply Filters" button
- "Clear" / "Reset" button

Neither has an `onclick`. The modal can be opened but filters cannot be applied through it.

**Fix:** Wire both buttons with `showToast("Filter functionality will connect to backend.")` as placeholder, or implement client-side filter application from the modal checkboxes.

---

### ISSUE 16 — Action icon buttons in `all-tasks.html` table rows are unlinked

**Severity: Medium**

Each row in `all-tasks.html` has `.action-icon-btn` buttons (eye icon / edit icon). These have no `onclick` handlers. They do nothing when clicked.

**Fix:** Wire the eye icon to open the task detail popover (which is already built in the CSS as `.task-popover`). Wire the edit icon to `showToast("Task editing will be available in the admin panel.")`.

---

### ISSUE 17 — Task detail popover (`.task-popover`) exists in CSS but is never triggered

**Severity: Low**

`all-tasks.html` has full CSS for a `.task-popover` element (a detail card that shows task info). But there is no JS code that creates or shows this popover. The CSS is dead.

**Fix:** Wire the eye icon button (Issue 16) to populate and show this popover near the click position.

---

### ISSUE 18 — `admin/members.html` "Edit", "Deactivate", "Reset Password" buttons

**Severity: Medium**

The members table action buttons (`Edit`, `Deactivate`, `Reset Password`) need to be verified — they should call `showToast()` as placeholders. Need to confirm these are wired.

---

## NAVIGATION ISSUES

---

### ISSUE 19 — `tasks.html` "View All Tasks →" button links to `all-tasks.html` — correct, but button label inconsistency

**Severity: Low**

Some "view all" buttons say "View All Tasks", some say "View All Projects", some say "View all". The label should match the destination. Specifically on `dashboard.html`, the Project Overview card says "View All Projects" but links to `all-tasks.html` — that page shows tasks, not just projects.

**Fix:** Change "View All Projects" → "View All Tasks" on the dashboard Project Overview card.

---

### ISSUE 20 — `admin/assign-tasks.html` back navigation

**Severity: Low**

`admin/assign-tasks.html` has no back button or breadcrumb to return to the admin dashboard. User must use browser back or the sidebar.

**Fix:** Add a small back link: `← Admin Panel` linking to `admin_dashboard.html` in the topbar.

---

## FILE & STRUCTURE NOTES

---

### ISSUE 21 — Two versions of every file in the extraction

**Note (not a bug):** The extraction file contains every file twice — the project appears to have been extracted twice in one file. This is just an extraction artifact. Only the second set (line 24636+) is the latest version.

---

### ISSUE 22 — `learning_hour_select.py` and `project_extraction.py` in root

**Severity: Low**

Two Python utility scripts are sitting at the project root (`learning_hour_select.py`, `project_extraction.py`). These are development tools and should be moved to a `tools/` or `scripts/` folder before the project is cleaned up for backend integration.

---

### ISSUE 23 — `DASHBOARD_UPDATE_PLAN.md` at root is outdated

**Severity: Low**

`DASHBOARD_UPDATE_PLAN.md` at the project root is an old planning document from an early iteration. The dashboard has since been fully rebuilt. This file is now stale and misleading.

**Fix:** Delete it or move it to `docs/archive/`.

---

## SUMMARY TABLE

| # | Issue | Severity | File(s) | Fix Type |
|---|---|---|---|---|
| 1 | Umesh vs SAB member name — correct name is Umesh | Critical | admin_dashboard, SYSTEM_CONTEXT, task docs | Data fix |
| 2 | "Aarav Singh" fictional sidebar profile | Critical | All 10 public pages | Remove or replace |
| 3 | Logout button goes nowhere | Critical | All 10 public pages | Remove or link to login.html |
| 4 | all-tasks.html not in sidebar nav | High | all-tasks.html | Navigation decision |
| 5 | project.html/hunter.html not in nav | High | Both pages | Intentional — no fix needed |
| 6 | Two CSS variable systems (A+B) | High | dashboard.html, tasks.html | CSS consolidation |
| 7 | Inline :root blocks duplicating global.css | Medium | project, all-tasks, hunter, tasks | Remove inline :root |
| 8 | Orbitron font on 2 pages only | Low | dashboard, tasks | Standardise fonts |
| 9 | "// SYSTEM ONLINE" two different styles | Low | tasks, hunter | Standardise to global.css class |
| 10 | Krishna/SAB have logs but no tasks | Medium | point-log, all task files | Add tasks or accept empty state |
| 11 | Missing rank-hex-sm CSS variants | Medium | leaderboard.html | Add missing CSS classes |
| 12 | tasks.html vs all-tasks.html entry point | Low | Navigation | Document as intentional |
| 13 | Krishna conduct deduction missing from logs | Low | point-log data | Add log entry |
| 14 | Export CSV button unlinked | Medium | all-tasks.html | Add toast or implement |
| 15 | Filter modal buttons unlinked | Medium | all-tasks.html | Wire with toast |
| 16 | Action icon buttons unlinked | Medium | all-tasks.html | Wire with popover/toast |
| 17 | .task-popover CSS exists but never triggered | Low | all-tasks.html | Wire to eye button |
| 18 | admin/members.html action buttons | Medium | admin/members.html | Verify toast wiring |
| 19 | "View All Projects" links to tasks page | Low | dashboard.html | Label fix |
| 20 | admin/assign-tasks.html no back button | Low | admin/assign-tasks.html | Add back link |
| 21 | Extraction file has everything twice | Note | extraction file | Not a bug |
| 22 | Dev scripts at root level | Low | Root | Move to scripts/ |
| 23 | DASHBOARD_UPDATE_PLAN.md stale | Low | Root | Delete or archive |

---

## RECOMMENDED FIX ORDER BEFORE BACKEND

**Round 1 — Critical (do these first):**
1. Standardise SAB → `Umesh` (init: `UM`) in `admin/admin_dashboard.html`, `SYSTEM_CONTEXT.md`, and all instruction docs
2. Remove or replace "Aarav Singh" sidebar profile from all public pages
3. Fix or remove Logout button on all public pages

**Round 2 — High:**
4. Resolve the two CSS variable systems (System A vs B)
5. Remove inline `:root` blocks from project, all-tasks, hunter, tasks pages

**Round 3 — Medium (broken interactions):**
6. Wire Export CSV, filter modal buttons, action icon buttons in `all-tasks.html` with toasts
7. Add 1-2 tasks for Krishna and SAB in ALL_TASKS
8. Add missing `rank-hex-sm` CSS variants in leaderboard
9. Verify admin/members.html action button wiring

**Round 4 — Low (cleanup):**
10. Standardise "// SYSTEM ONLINE" pill style
11. Standardise Orbitron font usage
12. Fix "View All Projects" label
13. Add back button to admin/assign-tasks.html
14. Move dev scripts to scripts/ folder
15. Delete/archive stale DASHBOARD_UPDATE_PLAN.md

---

*Audit complete. 23 issues identified across all frontend files. 3 critical, 2 high, 9 medium, 9 low.*
