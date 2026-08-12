# Vitals&Vectors — Dashboard Redesign & CSS Fix Plan
## v3.0

---

## Overview

Two parallel tracks:

1. **Track A — Global CSS fixes** applied to `frontend/css/` (fixes the pale look across ALL pages)
2. **Track B — Dashboard sandbox** at `frontend/dashboard/` — completely isolated HTML + CSS + JS for the dashboard only, iterated independently until you are satisfied, then promoted to replace `frontend/dashboard.html`

---

## Track A: Global CSS Fixes (apply to existing files)

### File: `frontend/css/theme.css`

**Change 1 — Fix border opacity (main culprit of the pale look)**
```css
/* BEFORE */
--border: rgba(79, 195, 247, 0.45);

/* AFTER */
--border: rgba(79, 195, 247, 0.1);
--border-glow: rgba(79, 195, 247, 0.4);
```

**Change 2 — Darken panel background**
```css
/* BEFORE */
--panel: #181826;

/* AFTER */
--panel: #0D0D1A;
--panel-alt: #12121F;
```

**Change 3 — Add Bebas Neue to font import**
```css
/* BEFORE */
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

/* AFTER */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
```

**Change 4 — Update font-display variable to use Bebas Neue first**
```css
/* BEFORE */
--font-display: 'Rajdhani', 'Bebas Neue', sans-serif;

/* AFTER */
--font-display: 'Bebas Neue', 'Rajdhani', sans-serif;
```

**Change 5 — Add radial gradient overlay to background**
```css
/* BEFORE */
body {
  background-image:
    linear-gradient(rgba(79, 195, 247, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(79, 195, 247, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* AFTER */
body {
  background-image:
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(79,195,247,0.05) 0%, transparent 70%),
    linear-gradient(rgba(79, 195, 247, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(79, 195, 247, 0.03) 1px, transparent 1px);
  background-size: auto, 50px 50px, 50px 50px;
  background-attachment: fixed;
}
```

**Change 6 — Add scrollbar style update**
```css
/* AFTER existing scrollbar rules, add: */
::-webkit-scrollbar-thumb:hover {
  background: var(--teal);
}
```

---

### File: `frontend/css/components.css`

**Change 7 — Add card hover effects (top accent line + glow + lift)**
```css
/* REPLACE existing .card rule */
.card {
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 20px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

/* ADD top accent line pseudo-element */
.card::before {
  content: '';
  position: absolute;
  top: 0; left: 10%; right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(79,195,247,0.6), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* ADD card hover */
.card:hover {
  border-color: var(--border-glow);
  box-shadow: 0 0 20px rgba(79,195,247,0.15), 0 4px 24px rgba(0,0,0,0.4);
  transform: translateY(-2px);
}

.card:hover::before {
  opacity: 1;
}
```

**Change 8 — Add left-accent stat card variant**
```css
/* ADD after .card rules */
.card-stat {
  position: relative;
  padding-left: 24px;
}

.card-stat::after {
  content: '';
  position: absolute;
  left: 0; top: 16px; bottom: 16px;
  width: 3px;
  border-radius: 0 2px 2px 0;
}

.card-stat.accent-blue::after  { background: var(--blue); box-shadow: 0 0 8px rgba(79,195,247,0.5); }
.card-stat.accent-teal::after  { background: var(--teal); box-shadow: 0 0 8px rgba(0,229,255,0.5); }
.card-stat.accent-purple::after { background: var(--purple); box-shadow: 0 0 8px rgba(124,77,255,0.5); }
.card-stat.accent-amber::after { background: var(--amber); box-shadow: 0 0 8px rgba(255,179,0,0.5); }
```

**Change 9 — Improve progress bar with shimmer**
```css
/* REPLACE existing .progress-fill */
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--blue), var(--teal));
  box-shadow: 0 0 8px rgba(79,195,247,0.4);
  border-radius: 3px;
  transition: width 0.6s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 20px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3));
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
```

**Change 10 — Add status chip styles (currently missing)**
```css
/* ADD full status chip system */
.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 20px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid;
}

.chip-pending   { background: rgba(255,179,0,0.12);  border-color: rgba(255,179,0,0.3);  color: var(--amber); }
.chip-progress  { background: rgba(79,195,247,0.12); border-color: rgba(79,195,247,0.3); color: var(--blue); }
.chip-completed { background: rgba(0,229,255,0.12);  border-color: rgba(0,229,255,0.3);  color: var(--teal); }
.chip-rated     { background: rgba(124,77,255,0.12); border-color: rgba(124,77,255,0.3); color: var(--purple); }
.chip-suspended { background: rgba(255,23,68,0.12);  border-color: rgba(255,23,68,0.3);  color: var(--red); }
.chip-active    { background: rgba(0,229,255,0.12);  border-color: rgba(0,229,255,0.3);  color: var(--teal); }
```

**Change 11 — Hero badge styles**
```css
/* ADD */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 4px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  animation: pulse-glow 3s infinite;
}

.hero-badge-week  { background: rgba(255,215,0,0.1);  border: 1px solid rgba(255,215,0,0.4); color: #FFD700; }
.hero-badge-month { background: rgba(124,77,255,0.1); border: 1px solid rgba(124,77,255,0.4); color: var(--purple); }
```

**Change 12 — Toast notification system**
```css
/* ADD */
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast {
  padding: 12px 20px;
  border-radius: 8px;
  max-width: 320px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  border: 1px solid;
  animation: fadeIn 0.3s ease;
}

.toast-success { background: rgba(0,229,255,0.1);  border-color: var(--teal);   color: var(--teal); }
.toast-error   { background: rgba(255,23,68,0.1);  border-color: var(--red);    color: var(--red); }
.toast-info    { background: rgba(79,195,247,0.1); border-color: var(--blue);   color: var(--blue); }
```

---

## Track B: Dashboard Sandbox

### Directory structure to create

```
frontend/
└── dashboard/               ← NEW FOLDER — isolated sandbox
    ├── index.html           ← The redesigned dashboard (standalone)
    ├── dashboard.css        ← Completely separate CSS — does NOT import theme.css
    └── dashboard.js         ← Completely separate JS — has its own API calls
```

### Rules for the sandbox

- `dashboard/index.html` imports ONLY `dashboard.css` and `dashboard.js`
- It does NOT import `../css/theme.css`, `../css/components.css`, or `../css/responsive.css`
- It shares `../js/api.js` and `../js/utils.js` (backend calls, no need to duplicate)
- It can be opened directly as `http://localhost:3000/dashboard/index.html`
- When you are satisfied, copy `index.html` → `../dashboard.html`, `dashboard.css` → `../css/`, `dashboard.js` → `../js/dashboard.js` and update import paths
- Until then, it is completely isolated — changes here do not affect any other page

### Promotion checklist (when satisfied)
- [ ] Copy `frontend/dashboard/index.html` content → `frontend/dashboard.html`
- [ ] Update CSS import path from `./dashboard.css` → `css/dashboard.css`
- [ ] Copy `frontend/dashboard/dashboard.css` → `frontend/css/dashboard.css`
- [ ] Update JS import path from `./dashboard.js` → `js/dashboard.js`
- [ ] Copy `frontend/dashboard/dashboard.js` → `frontend/js/dashboard.js`
- [ ] Delete the `frontend/dashboard/` sandbox folder

---

## New Dashboard Elements (Redesign v3)

The redesigned dashboard includes these sections in order:

1. **Topbar** — sticky nav with logo, links, user rank chip, logout
2. **Page header** — "Command Centre" + timestamp
3. **4-stat strip** — Position / Week Earned / Month Total / Net Week (left accent bars)
4. **Main row** — Rank card (left) + Streak boxes (right)
5. **Team Hunter Chart** — Full-width bar chart of ALL members
   - Y axis: Points
   - X axis: Member names
   - Each bar top: circular avatar / initials
   - Hover tooltip: name + current points + rank
   - Bars colored by rank (E=gray, D=bronze, C=silver, B=blue, A=gold, S=teal, SS=purple pulse)
6. **Bottom row** — Today's quests (left) + Recent point log (right)
7. **Trophy cabinet** — unlocked achievements row

---

## Team Hunter Chart — Technical Spec

```
Library: Chart.js (loaded from CDN)
Type: Bar chart
Plugin: chartjs-plugin-annotation (for rank threshold lines)

Config:
- backgroundColor: rank-based color per bar (semi-transparent)
- borderColor: rank-based color (full opacity, 2px)
- borderRadius: 4px top corners
- hoverBackgroundColor: brighter version of bar color
- Tooltip: custom HTML tooltip showing name + points + rank label

Y-axis:
- min: 0
- suggestedMax: 400 (SS threshold)
- gridColor: rgba(79,195,247,0.05)
- tickColor: #4A4A6A
- Annotation lines: 100 (D), 200 (B), 300 (S threshold / Hero) in faint colors

X-axis:
- Labels: member names
- tickColor: #8A8AA3
- No grid

Avatar on bar top:
- Custom chartjs plugin that draws a circle above each bar
- Circle: 28px diameter, filled with rank color, initials text in white Bebas Neue
- Positioned at bar center X, bar top Y - 18px

Responsive: true
maintainAspectRatio: false (container is 100% width, fixed 320px height)
```

---

## Files to create (Track B)

| File | What it is |
|---|---|
| `frontend/dashboard/index.html` | Full redesigned dashboard HTML |
| `frontend/dashboard/dashboard.css` | Standalone CSS — Solo Leveling theme, all dashboard-specific styles |
| `frontend/dashboard/dashboard.js` | Dashboard JS — API calls, chart render, DOM population |

All three files are provided in this update package.

---

*Plan v3.0 — Dashboard sandbox approach. Track A fixes global CSS. Track B iterates dashboard independently.*
