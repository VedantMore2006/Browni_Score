# Vitals&Vectors — Leaderboard Rework
## IDE Agent Instructions v1.0

---

## PREREQUISITE

Read `docs/SYSTEM_CONTEXT.md` before touching any file.
This portal is fully public. No personal login. Everyone sees everything.
The leaderboard shows ALL real team members — not fictional placeholder names.

---

## WHAT YOU ARE CHANGING

**File:** `frontend/leaderboard.html` — replace the entire file.

**Core problems with the current file:**
1. Uses fictional names (Riya Sharma, Aarav Singh, Arjun Verma, Pranav Patil, Neha Kulkarni, etc.) — none of these are real team members
2. Podium (top 3) is fully hardcoded HTML — not driven by data
3. Table rows (positions 4+) are hardcoded — not driven by data
4. Tab switching (This Week / This Month) does nothing — data does not change
5. "You" row highlight makes no sense on a public portal — remove it
6. Scoring period date is hardcoded as "12 May – 18 May 2025" — should be current week/month
7. Hero of Month badge hardcoded on position 3 — should be computed (300+ pts threshold)

**Everything to keep:**
- Exact same CSS styles (podium cards, wings, hero badges, table styles, rank hexagons)
- Same sidebar HTML (copy from current file verbatim)
- Same tab bar (This Week / This Month)
- Same legend bar at the bottom
- Same page structure and layout

---

## MEMBERS DATA

Use this single source of truth for all member data across both tabs:

```javascript
const MEMBERS = [
  // name, initials, pts_week, pts_month, streak_weeks, rank
  { name:'Ganesh',    init:'GA', pts_week:70,  pts_month:320, streak:4, rank:'s'  },
  { name:'Debaditya', init:'DE', pts_week:65,  pts_month:298, streak:3, rank:'a'  },
  { name:'Deepavali', init:'DW', pts_week:58,  pts_month:260, streak:3, rank:'a'  },
  { name:'Nandini',   init:'NA', pts_week:55,  pts_month:245, streak:3, rank:'b'  },
  { name:'Swapnil',   init:'SW', pts_week:48,  pts_month:220, streak:2, rank:'b'  },
  { name:'Suraj',     init:'SU', pts_week:45,  pts_month:210, streak:2, rank:'b'  },
  { name:'Santosh',   init:'SA', pts_week:40,  pts_month:195, streak:2, rank:'c'  },
  { name:'Nikita',    init:'NK', pts_week:38,  pts_month:185, streak:2, rank:'c'  },
  { name:'Vedant',    init:'VE', pts_week:35,  pts_month:170, streak:2, rank:'c'  },
  { name:'Nakul',     init:'NC', pts_week:30,  pts_month:155, streak:1, rank:'c'  },
  { name:'Ashutosh',  init:'AS', pts_week:28,  pts_month:140, streak:1, rank:'d'  },
  { name:'Vishal',    init:'VS', pts_week:25,  pts_month:130, streak:1, rank:'d'  },
  { name:'Komal',     init:'KO', pts_week:22,  pts_month:118, streak:1, rank:'d'  },
  { name:'Prerna',    init:'PR', pts_week:20,  pts_month:110, streak:1, rank:'d'  },
  { name:'Shreya',    init:'SH', pts_week:18,  pts_month:100, streak:0, rank:'d'  },
  { name:'Prem',      init:'PM', pts_week:15,  pts_month:88,  streak:0, rank:'e'  },
  { name:'Krishna',   init:'KR', pts_week:12,  pts_month:72,  streak:0, rank:'e'  },
  { name:'Umesh',       init:'UM', pts_week:8,   pts_month:45,  streak:0, rank:'e'  },
];

const RANK_COLORS = {
  ss: '#9A7BFF',
  s:  '#00E5FF',
  a:  '#FFD700',
  b:  '#4FC3F7',
  c:  '#B0B0B0',
  d:  '#CD7F32',
  e:  '#8A93A8',
};

const RANK_LABELS = {
  ss: 'Shadow Monarch',
  s:  'Platinum Hunter',
  a:  'Gold Hunter',
  b:  'Silver Hunter',
  c:  'Iron Hunter',
  d:  'Bronze Hunter',
  e:  'Unranked Hunter',
};
```

---

## TAB LOGIC

Two tabs: **THIS WEEK** (default active) and **THIS MONTH**.

```javascript
let activeTab = 'week'; // 'week' or 'month'

function getSorted() {
  const key = activeTab === 'week' ? 'pts_week' : 'pts_month';
  return [...MEMBERS].sort((a, b) => b[key] - a[key]);
}

function switchTab(tab) {
  activeTab = tab;
  document.getElementById('tabWeek').classList.toggle('active', tab === 'week');
  document.getElementById('tabMonth').classList.toggle('active', tab === 'month');
  render();
}

function render() {
  const sorted = getSorted();
  renderPodium(sorted);
  renderTable(sorted);
  updateScoringPeriod();
}
```

Call `render()` on page load.

---

## SCORING PERIOD — AUTO-CALCULATED

Replace the hardcoded date with a real computed date:

```javascript
function updateScoringPeriod() {
  const now = new Date();
  if (activeTab === 'week') {
    // Monday to Sunday of current week
    const day = now.getDay(); // 0=Sun
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    document.getElementById('scoringPeriod').textContent =
      `${fmt(monday)} – ${fmt(sunday)}`;
  } else {
    // 1st to last day of current month
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last  = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    document.getElementById('scoringPeriod').textContent =
      `${fmt(first)} – ${fmt(last)}`;
  }
}

function fmt(d) {
  return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}
```

In the HTML, give the scoring period span the id `scoringPeriod`:
```html
<div class="scoring-period" id="scoringPeriod">Loading...</div>
```

---

## PODIUM — FULLY DATA-DRIVEN

Remove all hardcoded podium HTML. Replace with a single empty container:
```html
<div class="podium" id="podium"></div>
```

The podium is rendered by JavaScript from `sorted[0]`, `sorted[1]`, `sorted[2]`.

**Podium order:** `#2` (left), `#1` (center, taller), `#3` (right) — same as current layout.

```javascript
function renderPodium(sorted) {
  const top3 = [sorted[1], sorted[0], sorted[2]]; // left=2nd, center=1st, right=3rd
  const styles = ['second', 'first', 'third'];
  const badgeStyles = ['silver', 'gold', 'bronze'];
  const positions = [2, 1, 3];
  const ptsKey = activeTab === 'week' ? 'pts_week' : 'pts_month';

  document.getElementById('podium').innerHTML = top3.map((m, i) => {
    if (!m) return '';
    const pos = positions[i];
    const style = styles[i];
    const badgeStyle = badgeStyles[i];
    const rc = RANK_COLORS[m.rank];
    const pts = activeTab === 'week' ? m.pts_week : m.pts_month;
    const isHeroWeek = pos === 1;
    const isHeroMonth = activeTab === 'month' && pts >= 300;

    // Wing color class
    const wingClass = badgeStyle + '-wings';

    // Rank hex for podium
    const rl = RANK_LABELS[m.rank];

    return `
    <div class="podium-card ${style}">
      ${isHeroWeek ? `
        <div class="hero-badge-corner week">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l3 6 4-2 4 2 3-6H5z"/></svg>
          <div class="hb-top">HERO</div>
          <div class="hb-bot">OF WEEK</div>
        </div>` : ''}
      ${isHeroMonth ? `
        <div class="hero-badge-corner month">
          <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <div class="hb-top">HERO</div>
          <div class="hb-bot">OF MONTH</div>
        </div>` : ''}
      <div class="pos-badge ${badgeStyle}">${pos}</div>
      <div class="avatar-wrap">
        <svg class="wings ${wingClass}" viewBox="0 0 110 55" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M55,28 C45,20 25,15 5,22 C20,24 35,28 45,35 Z" fill="currentColor" opacity="0.5"/>
          <path d="M55,28 C65,20 85,15 105,22 C90,24 75,28 65,35 Z" fill="currentColor" opacity="0.5"/>
          <path d="M55,28 C42,18 18,12 2,18 C18,21 38,27 48,36 Z" fill="currentColor" opacity="0.3"/>
          <path d="M55,28 C68,18 92,12 108,18 C92,21 72,27 62,36 Z" fill="currentColor" opacity="0.3"/>
        </svg>
        <div class="podium-avatar ${badgeStyle}">${m.init}</div>
      </div>
      <div class="podium-name">${m.name.toUpperCase()}</div>
      <div class="podium-pts ${badgeStyle}">${pts} PTS</div>
      <div class="rank-label-row">
        <div class="rank-hex-sm ${m.rank}" style="border-color:${rc};background:${rc}18;color:${rc}">${m.rank.toUpperCase()}</div>
        <span class="rank-label-text ${m.rank}" style="color:${rc}">${rl}</span>
      </div>
    </div>`;
  }).join('');
}
```

**Note on rank-hex-sm CSS:** The current file only has `.rank-hex-sm.s`, `.rank-hex-sm.a`, `.rank-hex-sm.c` defined. Add the missing variants inline via `style` attribute as shown above — this covers all ranks without changing global.css.

---

## TABLE — FULLY DATA-DRIVEN

Remove all hardcoded `ROWS` array. Keep the empty `<tbody id="lbBody">`.
Remove the `you-row` highlight and `you-tag` — not applicable on a public portal.

```javascript
function renderTable(sorted) {
  const ptsKey = activeTab === 'week' ? 'pts_week' : 'pts_month';
  const body = document.getElementById('lbBody');

  // Show positions 4+ in the table (top 3 are in the podium)
  const tableRows = sorted.slice(3);

  if (tableRows.length === 0) {
    body.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text2);padding:32px;">No data available</td></tr>`;
    return;
  }

  body.innerHTML = tableRows.map((m, i) => {
    const pos = i + 4;
    const rc = RANK_COLORS[m.rank];
    const pts = activeTab === 'week' ? m.pts_week : m.pts_month;
    const isHeroMonth = activeTab === 'month' && pts >= 300;
    const heroCell = isHeroMonth
      ? `<span style="font-size:11px;font-weight:700;font-family:'Rajdhani',sans-serif;letter-spacing:0.5px;color:var(--purple);background:rgba(154,123,255,0.12);border:1px solid rgba(154,123,255,0.4);padding:2px 8px;border-radius:3px;">⭐ HERO</span>`
      : `<span style="color:var(--text3)">–</span>`;

    return `
    <tr>
      <td class="td-pos">
        <div class="pos-bar" style="background:${rc}"></div>
        ${pos}
      </td>
      <td>
        <div class="rank-hex-tbl ${m.rank}" style="border-color:${rc}88;background:${rc}18;color:${rc}">
          ${m.rank.toUpperCase()}
        </div>
      </td>
      <td>
        <div class="hunter-cell">
          <div class="hunter-avatar" style="background:${rc}18;border-color:${rc};color:${rc}">${m.init}</div>
          <span class="hunter-name">${m.name}</span>
        </div>
      </td>
      <td class="td-pts">${pts} PTS</td>
      <td class="td-streak"><span class="flame">🔥</span> ${m.streak}w</td>
      <td class="td-hero">${heroCell}</td>
    </tr>`;
  }).join('');
}
```

---

## HERO OF MONTH LOGIC

Hero of Month = any member with `pts_month >= 300` in the **THIS MONTH** tab.
- In the podium: show the `hero-badge-corner month` badge on any top-3 member who qualifies
- In the table: show the purple "⭐ HERO" chip in the HERO BADGE column
- In the THIS WEEK tab: never show Hero of Month badges (week tab only shows weekly hero)
- Hero of Week = always position #1, always shown in THIS WEEK tab only

---

## TOPBAR SUBTITLE

Add a subtitle line below the page title:

```html
<div class="topbar">
  <div>
    <h1 class="page-title">HUNTER RANKINGS</h1>
    <p style="font-size:13px;color:var(--text2);margin-top:2px;">
      Public ranking of all Vitals&amp;Vectors team members
    </p>
  </div>
  <div class="scoring-badge">
    <div class="scoring-icon">...</div>
    <div class="scoring-text">
      <div class="scoring-label">Scoring Period</div>
      <div class="scoring-period" id="scoringPeriod">Loading...</div>
    </div>
    <div class="scoring-cal">...</div>
  </div>
</div>
```

---

## SIDEBAR

Copy the sidebar HTML **exactly** from the current `frontend/leaderboard.html`.
- Leaderboard nav link = `.active`
- Admin panel link = `admin/admin_dashboard.html`
- Collapse button JS uses panel-icon SVG (rect + line + polyline) — already correct in current file

---

## WHAT NOT TO CHANGE

- Do NOT change `css/global.css`
- Do NOT change any other page
- Do NOT add fetch() calls
- Do NOT keep fictional names (Riya Sharma, Aarav Singh, Arjun Verma, Pranav Patil, Neha Kulkarni, Aniket Kamble, Siddhant More, Sneha Pawar, Ritik Kadam, Mayur Bhosale)
- Do NOT keep the `you-row` class or `you-tag` — remove entirely
- Do NOT hardcode podium or table HTML — all rendered from MEMBERS array via JS

---

## QUALITY CHECKLIST

- [ ] `<link rel="stylesheet" href="css/global.css">` in `<head>`
- [ ] Google Fonts link in `<head>`
- [ ] Sidebar copied exactly — Leaderboard nav link is `.active`
- [ ] Collapse JS uses panel-icon SVG — copy from current file
- [ ] `MEMBERS` array contains all 18 real team members — no fictional names
- [ ] Podium is fully rendered by `renderPodium()` — no hardcoded HTML
- [ ] Table rows 4+ rendered by `renderTable()` — no hardcoded ROWS array
- [ ] THIS WEEK tab shows `pts_week`, sorted descending
- [ ] THIS MONTH tab shows `pts_month`, sorted descending
- [ ] Tab switch re-renders both podium AND table AND scoring period
- [ ] Scoring period auto-calculated from current date — not hardcoded
- [ ] Hero of Week badge shown on #1 in THIS WEEK tab only
- [ ] Hero of Month badge shown on any member with 300+ pts in THIS MONTH tab only
- [ ] All rank colors applied correctly per RANK_COLORS map
- [ ] No `you-row` or `you-tag` anywhere in the file
- [ ] Legend bar at bottom kept exactly as current file
- [ ] Member names link to `hunter.html?name={name}` when clicked

---

## BONUS — MEMBER NAME CLICKABLE

Make each member's name in the table (and podium name) clickable:
- Clicking navigates to `hunter.html?name=Ganesh` etc.
- In the table: wrap `<span class="hunter-name">` in an `<a>` tag
- Style: `color:var(--text); text-decoration:none;` — on hover: `color:var(--blue)`
- In the podium: wrap `.podium-name` text in a link with same styling

```javascript
// In renderTable():
<a href="hunter.html?name=${encodeURIComponent(m.name)}"
   style="color:var(--text);text-decoration:none;"
   onmouseover="this.style.color='var(--blue)'"
   onmouseout="this.style.color='var(--text)'">
  <span class="hunter-name">${m.name}</span>
</a>

// In renderPodium():
<a href="hunter.html?name=${encodeURIComponent(m.name)}"
   style="color:inherit;text-decoration:none;"
   class="podium-name">${m.name.toUpperCase()}</a>
```

---

*End of instructions. Only one file changes: `frontend/leaderboard.html`*
