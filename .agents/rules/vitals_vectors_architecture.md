# Vitals&Vectors — Architecture & System Rules

This rule enforces the permanent system context and architectural constraints defined in [`docs/SYSTEM_CONTEXT.md`](file:///home/vedant/Browni_Score/docs/SYSTEM_CONTEXT.md).

## Core Principles
1. **Public Read-Only Monitoring Portal**: Vitals&Vectors (`V&V`) is a public transparency scoreboard for a research lab team. All regular pages are open and accessible to anyone without login.
2. **External Data Sources**: Tasks come from Google Classroom (future), Attendance comes from Premises app (future). Data is represented by mock arrays until real integrations are built.
3. **Only 3 Managed Admin Actions**:
   - Adding members (name, role)
   - Manually logging point events (earn/deduct)
   - Confirming Hero of the Week and Hero of the Month
4. **No Personal Member Logins**: No personal logins or "my dashboard" view for regular members. Only a single admin login exists for `/admin/` tools.

## Naming & Domain System
- **Lab Name**: `Vitals&Vectors` (always with `&`). Short form: `V&V`.
- **U5 Coordinators (Task Leads)**: `Deepavali`, `Santosh`, `Debaditya`, `Swapnil`, `Ganesh`, `Nikita`.
- **Team Members**: `Vedant`, `Nakul`, `Ashutosh`, `Nandini`, `Prerna`, `Prem`, `Komal`, `Shreya`, `Vishal`, `Suraj`, `Krishna`, `SAB`.
- **Ranks**:
  - `E`: Unranked Hunter (0–99 pts)
  - `D`: Bronze Hunter (100–149 pts)
  - `C`: Iron Hunter (150–199 pts)
  - `B`: Silver Hunter (200–249 pts)
  - `A`: Gold Hunter (250–299 pts)
  - `S`: Platinum Hunter (300–399 pts)
  - `SS`: Shadow Monarch (400+ pts)

## Strict Directives
- **No Login Walls**: Never block or require authentication on public pages.
- **Vanilla Tech Stack Only**: Use HTML, Vanilla CSS (`css/global.css`), and Vanilla JavaScript. Never use React, Vue, npm, or build tools.
- **Mock Data Placeholders**: Keep placeholder notifications/toasts active for pending external APIs (Google Classroom / Premises app).
- **Fixed Palette & Typography**: Maintain dark sci-fi palette (`#050a14`, `#080f1e`, `#00c8ff`, `#00e5ff`, `#9b59ff`, `#ff3b5c`, `#FFB300`, `#f5a623`) and fonts (`Bebas Neue`, `Inter`, `Rajdhani`).
