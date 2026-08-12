# Vitals&Vectors — Solo Leveling Monitoring Platform
## Build Plan v2.0 (Updated)
 
---
 
## Vision
 
A dark, immersive web platform inspired by the **Solo Leveling** manhwa aesthetic — black backgrounds, electric blue and purple glows, rank badges, dungeon-style UI — where every member of Vitals&Vectors logs in to see their points, tasks, streaks, and standing. Not just a tracker. A world where showing up consistently makes you level up.
 
---
 
## Locked Decisions
 
| Item | Decision |
|---|---|
| Frontend | HTML + CSS + Vanilla JavaScript |
| Backend | Python + FastAPI |
| Database | SQLite |
| Auth | JWT tokens |
| Hosting | Local machine only for now (VPS later) |
| UI | Desktop website, mobile responsive |
| Language | English only |
| Build approach | Raw skeleton first, features added in phases |
 
---
 
## Placeholders (To Be Decided Later)
 
| Item | Status |
|---|---|
| Who logs daily attendance points | 🔲 Placeholder — decision pending |
| Notification system (WhatsApp / email / in-platform) | 🔲 Placeholder — decision pending |
| Google Classroom integration | 🔲 Placeholder — decision pending |
| Premises app integration (timekeeping) | 🔲 Placeholder — decision pending |
| VPS deployment & domain setup | 🔲 Placeholder — after local testing complete |
 
---
 
## Theme & Design Language
 
| Element | Direction |
|---|---|
| Background | Deep black (`#0A0A0F`) with dark navy panels (`#0D0D1A`) |
| Primary accent | Electric blue (`#4FC3F7`) — active states, streaks, highlights |
| Secondary accent | Purple glow (`#7C4DFF`) — ranks, badges, achievements |
| Danger / deduction | Blood red (`#FF1744`) |
| Success / earn | Neon teal (`#00E5FF`) |
| Warning | Amber (`#FFB300`) |
| Typography display | Rajdhani or Bebas Neue (angular, aggressive) |
| Typography body | Inter (clean, readable) |
| UI elements | Sharp corners, thin glowing borders, dark panels |
| Rank icons | E → D → C → B → A → S → SS (Solo Leveling style) |
 
---
 
## Rank System
 
| Rank | Points | Label |
|---|---|---|
| E | 0 – 99 | Unranked Hunter |
| D | 100 – 149 | Bronze Hunter |
| C | 150 – 199 | Iron Hunter |
| B | 200 – 249 | Silver Hunter |
| A | 250 – 299 | Gold Hunter |
| S | 300 – 399 | Platinum Hunter |
| SS | 400+ | Shadow Monarch |
 
---
 
## User Roles
 
### Member
- View own dashboard (points, rank, streaks, tasks)
- Mark tasks as complete (coordinator rates after)
- View leaderboard
- View rulebook
### U5 Coordinator
- Everything a Member can do
- Assign tasks to any member including lab lead
- Rate completed tasks (+3 / +5 / +8)
- Log point additions and deductions
- View all members' task sheets
### Admin (Lab Lead)
- Full access to everything
- Create / edit / deactivate members
- Override any point rating
- Issue warnings
- Confirm Hero of Week / Month awards
- View full audit log
---
 
## Pages & Features
 
### 1. Login Page
- Full screen dark UI, Solo Leveling "SYSTEM" panel style
- Vitals&Vectors logo top center
- Username + password
- JWT token issued on login, stored in localStorage
- Role auto-detected, redirects to correct dashboard
---
 
### 2. Member Dashboard
- **Rank card** — rank badge (E–SS), total points, points to next rank, progress bar
- **Streak panel** — presence streak (weeks) + task reporting streak (weeks)
- **Point summary** — earned this week, lost this week, net this week, monthly total
- **Today's tasks** — tasks due today with status chips
- **Recent point log** — last 10 point events with reason + timestamp
- **Mini leaderboard** — member's position this week
---
 
### 3. Task Sheet (Member view)
Columns: Sr. No. / Activity / Duration (hrs) / Deadline / Assigned by / Status / Points awarded
 
Actions:
- "Mark Complete" button per task
- Status chips: Pending / In Progress / Completed / Rated
---
 
### 4. Task Assignment Page (Coordinator + Admin)
- Create new task form (title, duration, deadline, priority, assign to)
- View all active tasks across team
- Rate completed tasks dropdown (needs revision / meets expectation / exceeds expectation)
- Points auto-logged on rating
---
 
### 5. Leaderboard
- Two tabs: This Week / This Month
- Ranked list: rank badge, name, points, streak status
- Top 3 highlighted (gold / silver / bronze frames)
- Hero of Week badge on top scorer
- Hero of Month (300+ pts) shown with SS glow
---
 
### 6. Point Log (Member view)
Full history of own point events.
Columns: Date & time / Category / Points / Reason / Logged by
 
---
 
### 7. Admin Dashboard
- Team overview table (all members, points, rank, streak, tasks due)
- Alerts panel (below 100 pts, 2 warnings, overdue tasks)
- Quick actions (add points, deduct points, issue warning)
- Hero of Week confirmation
- Hero of Month confirmation (300+ threshold)
---
 
### 8. Member Management (Admin only)
- Add / edit / deactivate members
- Reset password
- Full audit log per member
---
 
### 9. Rules Page
Full rulebook embedded — styled as a Solo Leveling "System Quest Board."
 
Sections:
- Working hours & daily schedule
- Reporting & attendance
- Task management
- Point earning criteria (with all new rules)
- Point deduction criteria
- Streak bonuses
- Rewards (Hero of Week / Month)
- Violations & consequences
- Dress code
---
 
## Data Models (SQLite)
 
### members
```
id, name, username, password_hash, role,
points_total, points_this_week, points_this_month,
streak_presence, streak_task_reporting,
warnings, rank, status, joined_date
```
 
### tasks
```
id, title, duration_hrs, deadline, priority,
assigned_to (member_id), assigned_by (user_id),
status, rating, points_awarded,
created_at, completed_at
```
 
### point_logs
```
id, member_id, event_type, category,
points, reason, logged_by, timestamp
```
 
### warnings
```
id, member_id, warning_number, reason,
issued_by, date, valid_reason_accepted
```
 
---
 
## Project Folder Structure (Skeleton)
 
```
vitals-vectors/
│
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── database.py           # SQLite connection + setup
│   ├── models.py             # SQLAlchemy table models
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── auth.py               # JWT login / token logic
│   ├── routes/
│   │   ├── auth.py           # /login /logout
│   │   ├── members.py        # /members CRUD
│   │   ├── tasks.py          # /tasks CRUD + rating
│   │   ├── points.py         # /points log + add/deduct
│   │   ├── leaderboard.py    # /leaderboard weekly/monthly
│   │   └── warnings.py       # /warnings issue/view
│   ├── requirements.txt
│   └── vitals_vectors.db     # SQLite file (auto-created)
│
├── frontend/
│   ├── index.html            # Login page
│   ├── dashboard.html        # Member dashboard
│   ├── tasks.html            # Task sheet
│   ├── leaderboard.html      # Leaderboard
│   ├── point-log.html        # Point history
│   ├── rules.html            # Rulebook page
│   ├── admin/
│   │   ├── dashboard.html    # Admin overview
│   │   ├── members.html      # Member management
│   │   └── assign-tasks.html # Task assignment + rating
│   ├── css/
│   │   ├── theme.css         # Solo Leveling colors, fonts, base
│   │   ├── components.css    # Cards, badges, tables, buttons
│   │   └── responsive.css    # Mobile breakpoints
│   └── js/
│       ├── auth.js           # Login, token storage, logout
│       ├── api.js            # All fetch() calls to backend
│       ├── dashboard.js      # Member dashboard logic
│       ├── tasks.js          # Task sheet logic
│       ├── leaderboard.js    # Leaderboard logic
│       ├── admin.js          # Admin dashboard logic
│       └── utils.js          # Shared helpers (rank calc, date format)
│
└── README.md                 # How to run locally
```
 
---
 
## How to Run Locally (Phase 1)
 
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
 
# Frontend
# Just open frontend/index.html in browser
# Or run a simple server:
cd frontend
python -m http.server 3000
```
 
FastAPI auto-generates API docs at:
`http://localhost:8000/docs`
 
---
 
## Point System Rules Baked Into Platform Logic
 
| Rule | Implementation |
|---|---|
| Start at 100 pts | Default on member creation |
| Minimum 100 pts to stay active | Auto-flag in admin dashboard |
| Presence streak +10/week | 🔲 Placeholder — attendance logging pending |
| Task reporting streak +10/week | Calculated from daily task completions |
| Task rating: +3/+5/+8 | Coordinator rating dropdown → auto points |
| 85% weekly completion +20 | Auto-calculated every Sunday |
| 3 warnings → suspension | Auto status change on 3rd warning |
| Violations reset monthly if compliant | 🔲 Placeholder — manual for now |
| Points carry forward monthly | Running total, never reset |
| Hero of Week | Highest points that week, admin confirms |
| Hero of Month | 300+ pts threshold, admin confirms |
| 3 flex days/month | 🔲 Placeholder — attendance pending |
 
---
 
## Build Order (Skeleton Phase)
 
1. Backend database setup + models
2. Auth (login endpoint + JWT)
3. Member CRUD endpoints
4. Points log endpoint
5. Task CRUD + rating endpoint
6. Login page (HTML/CSS/JS)
7. Member dashboard (HTML/CSS/JS — static data first)
8. Admin dashboard (HTML/CSS/JS — static data first)
9. Connect frontend to backend via fetch()
10. Leaderboard + Rules page
---
 
*Build Plan v2.0 — Skeleton phase. All placeholder items to be revisited in Phase 2.*
 