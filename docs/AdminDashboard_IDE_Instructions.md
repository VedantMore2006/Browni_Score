# Vitals&Vectors — Admin Dashboard Rework
## IDE Agent Instructions v1.0

---

## PREREQUISITE

Read `docs/SYSTEM_CONTEXT.md` before touching any file.

Key facts for this page:
- This is the ONLY page where admin actions happen
- The admin can: log points (add/deduct), confirm heroes, view team overview
- No personal login system yet — admin panel is accessible directly
- All data is mock — no backend calls
- Fictional names must be replaced with real team members

---

## FILE

`frontend/admin/admin_dashboard.html` — replace the entire file.

**CSS path:** `../css/global.css` (admin pages are one folder deep)
**Admin panel nav link** must be `.active` and use `.nav-admin` class.

---

## PROBLEMS TO FIX

1. **Fictional names everywhere** — "Riya Sharma", "Aarav Singh", "Arjun Verma", "Pranav Patil", "Neha Kulkarni" must ALL be replaced with real team members
2. **Hero of Week** hardcoded as "Riya Sharma" — must come from MEMBERS data (highest `pts_week`)
3. **Hero of Month** hardcoded list of fictional names — must be computed (members with `pts_month >= 300`)
4. **Alert items** reference fictional members — replace with real names
5. **Team overview table** uses fictional data — replace with real MEMBERS array
6. **Stat counts** (3 alerts, 2 warnings, 8 overdue) are hardcoded — compute from data
7. **Right panel member dropdowns** (add/deduct points, issue warning) use fictional names — populate from MEMBERS array

---

## SHARED DATA ARRAYS

Add these at the top of the `<script>` block.
These are the same arrays used across all other pages — copy them exactly.

```javascript
const MEMBERS = [
  { name:'Ganesh',    init:'GA', pts_week:70,  pts_month:320, streak:4, rank:'s',  warnings:0, status:'active'    },
  { name:'Debaditya', init:'DE', pts_week:65,  pts_month:298, streak:3, rank:'a',  warnings:0, status:'active'    },
  { name:'Deepavali', init:'DW', pts_week:58,  pts_month:260, streak:3, rank:'a',  warnings:0, status:'active'    },
  { name:'Nandini',   init:'NA', pts_week:55,  pts_month:245, streak:3, rank:'b',  warnings:0, status:'active'    },
  { name:'Swapnil',   init:'SW', pts_week:48,  pts_month:220, streak:2, rank:'b',  warnings:0, status:'active'    },
  { name:'Suraj',     init:'SU', pts_week:45,  pts_month:210, streak:2, rank:'b',  warnings:0, status:'active'    },
  { name:'Santosh',   init:'SA', pts_week:40,  pts_month:195, streak:2, rank:'c',  warnings:1, status:'active'    },
  { name:'Nikita',    init:'NK', pts_week:38,  pts_month:185, streak:2, rank:'c',  warnings:0, status:'active'    },
  { name:'Vedant',    init:'VE', pts_week:35,  pts_month:170, streak:2, rank:'c',  warnings:0, status:'active'    },
  { name:'Nakul',     init:'NC', pts_week:30,  pts_month:155, streak:1, rank:'c',  warnings:0, status:'active'    },
  { name:'Ashutosh',  init:'AS', pts_week:28,  pts_month:140, streak:1, rank:'d',  warnings:1, status:'active'    },
  { name:'Vishal',    init:'VS', pts_week:25,  pts_month:130, streak:1, rank:'d',  warnings:0, status:'active'    },
  { name:'Komal',     init:'KO', pts_week:22,  pts_month:118, streak:1, rank:'d',  warnings:0, status:'active'    },
  { name:'Prerna',    init:'PR', pts_week:20,  pts_month:110, streak:1, rank:'d',  warnings:2, status:'active'    },
  { name:'Shreya',    init:'SH', pts_week:18,  pts_month:100, streak:0, rank:'d',  warnings:0, status:'active'    },
  { name:'Prem',      init:'PM', pts_week:15,  pts_month:88,  streak:0, rank:'e',  warnings:0, status:'active'    },
  { name:'Krishna',   init:'KR', pts_week:12,  pts_month:72,  streak:0, rank:'e',  warnings:2, status:'active'    },
  { name:'SAB',       init:'SB', pts_week:8,   pts_month:45,  streak:0, rank:'e',  warnings:0, status:'active'    },
];

const RANK_COLORS = {
  ss:'#9A7BFF', s:'#00E5FF', a:'#FFD700',
  b:'#4FC3F7',  c:'#B0B0B0', d:'#CD7F32', e:'#8A93A8'
};

const RANK_LABELS = {
  ss:'Shadow Monarch', s:'Platinum Hunter', a:'Gold Hunter',
  b:'Silver Hunter',   c:'Iron Hunter',     d:'Bronze Hunter', e:'Unranked Hunter'
};

const ALL_TASKS = [
  { id:1,  projectId:'mindspace',   title:'Implement user onboarding flow',      lead:'Ganesh',    assignedTo:'Vedant',    deadline:'2026-08-20', priority:1, status:'in_progress', rating:null,             points:0 },
  { id:2,  projectId:'mindspace',   title:'Fix session timeout bug',              lead:'Ganesh',    assignedTo:'Nakul',     deadline:'2026-08-16', priority:1, status:'completed',   rating:null,             points:0 },
  { id:3,  projectId:'mindspace',   title:'Design dashboard wireframes',          lead:'Ganesh',    assignedTo:'Nandini',   deadline:'2026-08-18', priority:2, status:'rated',       rating:'exceeds',        points:8 },
  { id:4,  projectId:'neurovi',     title:'Train classification model v2',        lead:'Ganesh',    assignedTo:'Ashutosh',  deadline:'2026-08-22', priority:1, status:'in_progress', rating:null,             points:0 },
  { id:5,  projectId:'neurovi',     title:'Write model evaluation report',        lead:'Ganesh',    assignedTo:'Vedant',    deadline:'2026-08-19', priority:2, status:'pending',     rating:null,             points:0 },
  { id:6,  projectId:'nutrisure',   title:'Build nutrition tracking API',         lead:'Deepavali', assignedTo:'Prem',      deadline:'2026-08-21', priority:1, status:'in_progress', rating:null,             points:0 },
  { id:7,  projectId:'nutrisure',   title:'Create meal recommendation logic',     lead:'Deepavali', assignedTo:'Vishal',    deadline:'2026-08-17', priority:2, status:'rated',       rating:'meets',          points:5 },
  { id:8,  projectId:'solobeauty',  title:'Product catalogue UI',                 lead:'Santosh',   assignedTo:'Prem',      deadline:'2026-08-20', priority:2, status:'pending',     rating:null,             points:0 },
  { id:9,  projectId:'skillsense',  title:'Course module drag-and-drop',          lead:'Swapnil',   assignedTo:'Komal',     deadline:'2026-08-18', priority:1, status:'completed',   rating:null,             points:0 },
  { id:10, projectId:'skillsense',  title:'Integrate payment gateway',            lead:'Swapnil',   assignedTo:'Ashutosh',  deadline:'2026-08-23', priority:1, status:'pending',     rating:null,             points:0 },
  { id:11, projectId:'lms',         title:'Student progress dashboard',           lead:'Swapnil',   assignedTo:'Shreya',    deadline:'2026-08-19', priority:2, status:'rated',       rating:'needs_revision', points:3 },
  { id:12, projectId:'website',     title:'SEO meta tags for all pages',          lead:'Debaditya', assignedTo:'Suraj',     deadline:'2026-08-16', priority:2, status:'completed',   rating:null,             points:0 },
  { id:13, projectId:'website',     title:'Contact form backend integration',     lead:'Debaditya', assignedTo:'Ashutosh',  deadline:'2026-08-20', priority:1, status:'in_progress', rating:null,             points:0 },
  { id:14, projectId:'socialmedia', title:'Draft 4 LinkedIn posts for August',    lead:'Debaditya', assignedTo:'Suraj',     deadline:'2026-08-17', priority:2, status:'rated',       rating:'exceeds',        points:8 },
  { id:15, projectId:'ezest',       title:'Workshop logistics planning',           lead:'Santosh',   assignedTo:'Prerna',    deadline:'2026-08-22', priority:2, status:'pending',     rating:null,             points:0 },
  { id:16, projectId:'funday',      title:'Finalize venue and schedule',          lead:'Nikita',    assignedTo:'Deepavali', deadline:'2026-08-18', priority:1, status:'in_progress', rating:null,             points:0 },
  { id:17, projectId:'demoday',     title:'Prepare stakeholder presentations',    lead:'Deepavali', assignedTo:'Prerna',    deadline:'2026-08-25', priority:1, status:'pending',     rating:null,             points:0 },
  { id:18, projectId:'premises',    title:'Test attendance sync feature',         lead:'Deepavali', assignedTo:'Prem',      deadline:'2026-08-19', priority:1, status:'completed',   rating:null,             points:0 },
];

const PROJECTS = [
  { id:'mindspace',   name:'MindSpace',             lead:'Ganesh',    members:['Vedant','Nakul','Ashutosh','Nandini','Prerna','Swapnil'], color:'#4FC3F7' },
  { id:'neurovi',     name:'NeuroVisualisAI',        lead:'Ganesh',    members:['Vedant','Nakul','Ashutosh','Swapnil'],                   color:'#4FC3F7' },
  { id:'nutrisure',   name:'NutriSure',              lead:'Deepavali', members:['Vishal','Vedant','Prem'],                               color:'#00E5FF' },
  { id:'solobeauty',  name:'SoloBeauty',             lead:'Santosh',   members:['Prem','Prerna'],                                        color:'#9A7BFF' },
  { id:'skillsense',  name:'SkillSense',             lead:'Swapnil',   members:['Komal','Deepavali','Ashutosh','Shreya','Prem'],          color:'#FFB300' },
  { id:'lms',         name:'LMS',                    lead:'Swapnil',   members:['Prem','Swapnil','Komal','Shreya'],                       color:'#FFB300' },
  { id:'website',     name:'Website',                lead:'Debaditya', members:['Suraj','Ashutosh'],                                     color:'#FF1744' },
  { id:'socialmedia', name:'LinkedIn / Social Media',lead:'Debaditya', members:['Ashutosh','Suraj'],                                     color:'#FF1744' },
  { id:'ezest',       name:'E-Zest',                 lead:'Santosh',   members:['Ganesh','Vedant','Nikita','Nakul','Prerna','Ashutosh','Swapnil','Nandini'], color:'#9A7BFF' },
  { id:'funday',      name:'Fun Day',                lead:'Nikita',    members:['Deepavali','Prerna'],                                   color:'#00E5FF' },
  { id:'demoday',     name:'Demo Day',               lead:'Deepavali', members:['Prerna'],                                               color:'#00E5FF' },
  { id:'learningtime',name:'Learning Time',          lead:'Vedant',    members:[],                                                       color:'#4FC3F7' },
  { id:'premises',    name:'Premises',               lead:'Deepavali', members:['Prem'],                                                 color:'#00E5FF' },
];
```

---

## SECTION 1: COMPUTED STATS — REPLACE HARDCODED NUMBERS

Compute these from data, not hardcoded:

```javascript
function computeAlerts() {
  const today = new Date(); today.setHours(0,0,0,0);

  const belowMin   = MEMBERS.filter(m => m.pts_month < 100);
  const twoWarns   = MEMBERS.filter(m => m.warnings >= 2);
  const overdue    = ALL_TASKS.filter(t => {
    if (t.status === 'rated' || t.status === 'completed') return false;
    return new Date(t.deadline) < today;
  });

  return { belowMin, twoWarns, overdue };
}
```

Update the 3 stat cards dynamically:
```javascript
function renderStats() {
  const { belowMin, twoWarns, overdue } = computeAlerts();
  document.getElementById('statBelowMin').textContent  = belowMin.length;
  document.getElementById('statTwoWarns').textContent  = twoWarns.length;
  document.getElementById('statOverdue').textContent   = overdue.length;

  // Alert banner count
  const totalAlerts = belowMin.length + twoWarns.length + overdue.length;
  document.getElementById('alertBannerCount').textContent = totalAlerts;
  document.getElementById('alertBanner').style.display = totalAlerts > 0 ? 'flex' : 'none';
}
```

Give each stat number element the correct id:
- `id="statBelowMin"` — members below 100 pts
- `id="statTwoWarns"` — members with 2+ warnings
- `id="statOverdue"`  — overdue tasks count
- `id="alertBannerCount"` — total alert count in the top banner
- `id="alertBanner"` — the red banner div

---

## SECTION 2: TEAM OVERVIEW TABLE — DATA-DRIVEN

Replace the hardcoded table with a rendered version from MEMBERS array.
Sort by `pts_month` descending.

```javascript
function renderTeamTable() {
  const sorted = [...MEMBERS].sort((a,b) => b.pts_month - a.pts_month);
  const body = document.getElementById('teamBody');
  body.innerHTML = sorted.map((m, i) => {
    const rc = RANK_COLORS[m.rank];
    const posStyle = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'plain';
    const statusChip = m.status === 'active'
      ? `<span class="chip-active">ACTIVE</span>`
      : `<span class="chip-suspended">SUSPENDED</span>`;
    const warnDisplay = m.warnings > 0
      ? `<span style="color:${m.warnings >= 2 ? 'var(--red)' : 'var(--amber)'}; font-weight:700;">${m.warnings} ⚠</span>`
      : `<span style="color:var(--text3)">—</span>`;

    return `
    <tr>
      <td><div class="rank-pos ${posStyle}">${i+1}</div></td>
      <td>
        <div class="hunter-cell">
          <div class="h-avatar" style="background:${rc}18;border-color:${rc};color:${rc}">${m.init}</div>
          <a href="../hunter.html?name=${encodeURIComponent(m.name)}"
             style="color:var(--text);text-decoration:none;font-weight:600;font-size:12.5px;"
             onmouseover="this.style.color='var(--blue)'"
             onmouseout="this.style.color='var(--text)'">${m.name}</a>
        </div>
      </td>
      <td class="td-pts">${m.pts_month}</td>
      <td class="td-week">+${m.pts_week}</td>
      <td class="td-streak">🔥 ${m.streak}w</td>
      <td>${statusChip}</td>
      <td>${warnDisplay}</td>
      <td>
        <div style="display:flex;gap:6px;align-items:center;">
          <button class="btn-plus" onclick="openPoints('${m.name}','earn')">+ Pts</button>
          <button class="btn-minus" onclick="openPoints('${m.name}','deduct')">− Pts</button>
          <button class="btn-warn" onclick="openWarn('${m.name}')">Warn</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}
```

Update table column headers to match:
```
POS | HUNTER | TOTAL PTS | THIS WEEK | STREAK | STATUS | WARNINGS | ACTIONS
```

---

## SECTION 3: ALERTS PANEL — DATA-DRIVEN

Replace hardcoded alert items with dynamically rendered ones:

```javascript
function renderAlerts() {
  const { belowMin, twoWarns, overdue } = computeAlerts();
  const list = document.getElementById('alertList');
  const items = [];

  twoWarns.forEach(m => {
    items.push({
      icon: 'user-warning',
      name: `${m.name} has ${m.warnings} warnings`,
      desc: 'Further violations may lead to suspension.',
      time: 'Active',
      color: 'var(--red)'
    });
  });

  belowMin.forEach(m => {
    items.push({
      icon: 'pts-low',
      name: `${m.name} is below 100 points (${m.pts_month} pts)`,
      desc: 'Encourage task completion and attendance.',
      time: 'Active',
      color: 'var(--amber)'
    });
  });

  if (overdue.length > 0) {
    items.push({
      icon: 'overdue',
      name: `${overdue.length} task${overdue.length > 1 ? 's are' : ' is'} overdue`,
      desc: overdue.slice(0,2).map(t => t.title).join(', ') + (overdue.length > 2 ? '...' : ''),
      time: 'Active',
      color: 'var(--blue)'
    });
  }

  if (items.length === 0) {
    list.innerHTML = `<div style="text-align:center;color:var(--text2);padding:24px;font-size:13px;">No active alerts. All systems normal.</div>`;
    return;
  }

  // Reuse existing alert-item HTML structure — keep same CSS classes
  // icon SVGs: keep existing warning/calendar/arrow-down SVGs from current file
  list.innerHTML = items.map(item => `
    <div class="alert-item">
      <div class="alert-icon-wrap" style="border-color:${item.color}33;background:${item.color}10;">
        <svg viewBox="0 0 24 24" fill="none" stroke="${item.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div class="alert-body">
        <div class="alert-title-row">
          <span class="alert-name">${item.name}</span>
          <span class="alert-time" style="color:${item.color}">${item.time}</span>
        </div>
        <div class="alert-desc">${item.desc}</div>
      </div>
    </div>
  `).join('');
}
```

---

## SECTION 4: HEROES PANEL — DATA-DRIVEN

Replace hardcoded hero names:

```javascript
function renderHeroes() {
  // Hero of Week = highest pts_week
  const heroWeek = [...MEMBERS].sort((a,b) => b.pts_week - a.pts_week)[0];
  document.getElementById('heroWeekName').textContent = heroWeek.name.toUpperCase();
  document.getElementById('heroWeekPts').textContent  = `${heroWeek.pts_week} PTS THIS WEEK`;

  // Hero of Month = all members with pts_month >= 300
  const heroMonth = MEMBERS.filter(m => m.pts_month >= 300)
                            .sort((a,b) => b.pts_month - a.pts_month);

  const hmList = document.getElementById('heroMonthList');
  if (heroMonth.length === 0) {
    hmList.innerHTML = `<div style="color:var(--text2);font-size:12px;padding:8px 0;">No members have reached 300 pts yet this month.</div>`;
  } else {
    hmList.innerHTML = heroMonth.map(m => `
      <div class="hm-row">
        <span class="hm-name">${m.name}</span>
        <span class="hm-pts">${m.pts_month} PTS</span>
      </div>
    `).join('');
  }
}
```

In the HTML, give the hero elements these ids:
- `id="heroWeekName"` — the `.hw-name` div
- `id="heroWeekPts"` — the `.hw-pts` div
- `id="heroMonthList"` — the container holding `.hm-row` items

---

## SECTION 5: RIGHT PANEL — POINTS FORM

The "Add / Deduct Points" form must populate its member dropdown from MEMBERS:

```javascript
function populateMemberDropdowns() {
  const selectors = ['#fMember', '#fWarnMember'];
  const options = '<option value="" disabled selected>Select member</option>' +
    MEMBERS.map(m => `<option value="${m.name}">${m.name}</option>`).join('');
  selectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.innerHTML = options;
  });
}
```

Keep all existing form fields, labels, and button styles exactly as they are.
Only the dropdown options change — populated from MEMBERS instead of fictional names.

**Points form submit** (keep existing toast behavior):
```javascript
function logPoints() {
  const member   = document.getElementById('fMember').value;
  const type     = document.getElementById('fType').value;
  const category = document.getElementById('fCategory').value;
  const pts      = document.getElementById('fPoints').value;
  const reason   = document.getElementById('fReason').value;

  if (!member || !type || !category || !pts || !reason) {
    showToast('Please fill all fields before logging points.', 'error');
    return;
  }
  showToast(`Points logged for ${member}. Will save to backend in next phase.`, 'success');
  // reset form
  document.getElementById('fMember').selectedIndex = 0;
  document.getElementById('fPoints').value = '';
  document.getElementById('fReason').value = '';
}
```

**Warning form submit:**
```javascript
function issueWarning() {
  const member = document.getElementById('fWarnMember').value;
  const reason = document.getElementById('fWarnReason').value;
  if (!member || !reason) {
    showToast('Please select a member and enter a reason.', 'error');
    return;
  }
  showToast(`Warning issued to ${member}. Will save to backend in next phase.`, 'warning');
  document.getElementById('fWarnMember').selectedIndex = 0;
  document.getElementById('fWarnReason').value = '';
}
```

---

## SECTION 6: ACTION BUTTONS IN TABLE

When "± Pts" is clicked from the team overview table, open the right panel and pre-select that member:

```javascript
function openPoints(memberName, type) {
  // Pre-select member in the points form
  const sel = document.getElementById('fMember');
  if (sel) sel.value = memberName;

  // Pre-select type (earn/deduct)
  const typeEl = document.getElementById('fType');
  if (typeEl) typeEl.value = type;

  // Scroll right panel to points section
  document.getElementById('rpPoints').scrollIntoView({ behavior: 'smooth' });
}

function openWarn(memberName) {
  const sel = document.getElementById('fWarnMember');
  if (sel) sel.value = memberName;
  document.getElementById('rpWarn').scrollIntoView({ behavior: 'smooth' });
}
```

Give the right panel sections these ids:
- `id="rpPoints"` — the add/deduct points section header
- `id="rpWarn"` — the issue warning section header

---

## SECTION 7: ACTIVE QUESTS TABLE — KEEP AS-IS

The active quests table (right side, with tabs All / Awaiting Rating / Rated) already works correctly with the ALL_TASKS array. Keep all existing logic unchanged. Only ensure the ALL_TASKS array at the top uses the real data above (not fictional data).

---

## SECTION 8: HERO CONFIRM BUTTONS (NEW)

Add two confirm buttons to the Heroes panel — one for each hero type.
These are admin-only actions:

```html
<!-- Below hero-week div -->
<button class="btn-confirm-hero week" onclick="confirmHero('week')">
  👑 Confirm Hero of Week
</button>

<!-- Below hero-month div -->
<button class="btn-confirm-hero month" onclick="confirmHero('month')">
  ⭐ Confirm Hero of Month
</button>
```

```css
.btn-confirm-hero {
  width: 100%;
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 5px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;
}
.btn-confirm-hero.week {
  background: rgba(255,215,0,0.08);
  border-color: rgba(255,215,0,0.35);
  color: var(--gold);
}
.btn-confirm-hero.week:hover {
  background: rgba(255,215,0,0.14);
  box-shadow: 0 0 12px rgba(255,215,0,0.2);
}
.btn-confirm-hero.month {
  background: rgba(154,123,255,0.08);
  border-color: rgba(154,123,255,0.35);
  color: var(--purple);
}
.btn-confirm-hero.month:hover {
  background: rgba(154,123,255,0.14);
  box-shadow: 0 0 12px rgba(154,123,255,0.2);
}
```

```javascript
function confirmHero(type) {
  if (type === 'week') {
    const hw = [...MEMBERS].sort((a,b) => b.pts_week - a.pts_week)[0];
    showToast(`Hero of Week confirmed: ${hw.name} (${hw.pts_week} pts). Will notify in next phase.`, 'success');
  } else {
    const hm = MEMBERS.filter(m => m.pts_month >= 300);
    if (hm.length === 0) {
      showToast('No members have reached 300 pts this month yet.', 'info');
    } else {
      showToast(`Hero of Month confirmed: ${hm.map(m=>m.name).join(', ')}. Will notify in next phase.`, 'success');
    }
  }
}
```

---

## INIT FUNCTION

Call all render functions on page load:

```javascript
function init() {
  renderStats();
  renderTeamTable();
  renderAlerts();
  renderHeroes();
  populateMemberDropdowns();
  populateProjectDropdown(); // existing function — keep as-is
  renderQuests();            // existing function — keep as-is
}

init();
```

---

## SIDEBAR

Copy the sidebar HTML **exactly** from the current `frontend/admin/admin_dashboard.html`.
- Admin panel nav link = `.active` with `.nav-admin` class
- All nav links use `../` prefix (admin pages are one folder deep):
  - `href="../dashboard.html"`
  - `href="../all-tasks.html"`
  - `href="../point-log.html"`
  - `href="../leaderboard.html"`
  - `href="../attendance.html"`
  - `href="../rules.html"`
  - `href="admin_dashboard.html"` ← active, no `../`
- Collapse JS: panel-icon SVG (rect + line + polyline) — copy exactly from current file

---

## WHAT NOT TO CHANGE

- Do NOT change any CSS classes or styles (keep all existing CSS)
- Do NOT change the layout structure (3-col stat strip, team table, bottom row, right panels)
- Do NOT change the active quests section logic or its CSS
- Do NOT change `../css/global.css`
- Do NOT add any `fetch()` calls
- Do NOT change any other page

---

## QUALITY CHECKLIST

- [ ] `<link rel="stylesheet" href="../css/global.css">` in `<head>`
- [ ] Sidebar copied exactly — Admin panel nav link is `.active`
- [ ] All nav links use `../` prefix correctly
- [ ] MEMBERS array has all 18 real team members — no fictional names
- [ ] Stat cards compute counts from data (not hardcoded 3/2/8)
- [ ] Alert banner hidden if zero alerts, shown with correct count if alerts exist
- [ ] Alert items list real member names from data
- [ ] Team overview table rendered from MEMBERS array sorted by pts_month desc
- [ ] Hero of Week = highest pts_week member (currently Ganesh, 70 pts)
- [ ] Hero of Month = members with pts_month >= 300 (currently only Ganesh, 320 pts)
- [ ] Hero confirm buttons present and show toast on click
- [ ] Points form member dropdown populated from MEMBERS array
- [ ] Warning form member dropdown populated from MEMBERS array
- [ ] Clicking "+ Pts" or "- Pts" in table pre-selects that member in points form
- [ ] Clicking "Warn" in table pre-selects that member in warning form
- [ ] Member names in team table link to `../hunter.html?name=X`
- [ ] showToast() accepts a type argument ('success'/'error'/'info'/'warning') and colors accordingly
- [ ] init() calls all render functions on page load
- [ ] No fictional names anywhere in the file

---

*End of instructions. Only one file changes: `frontend/admin/admin_dashboard.html`*
