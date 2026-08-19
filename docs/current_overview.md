# Vitals&Vectors — Current System Overview
## Reference Document for System Architect

This document provides a complete overview of the currently implemented Vitals&Vectors system. It is designed to serve as a reference for System Architects to understand the existing architecture, technology stack, data flow, and role-based access before planning future transformations.

> [!WARNING]
> **Important Remark / Future Transformation**
> This particular system is currently built as a **single-admin based system** (a public transparency board) where everyone can see all activities without logging in. The required next step is to **transform it into a multi-user system where everyone has their own personal login** and personal dashboard.

---

## 1. Background & Purpose

**Why are we creating this?**
Vitals&Vectors is a monitoring portal for a research lab team. Originally conceived as a public "transparency board" (like a public scoreboard), its purpose is to visualize the team's work, points, and attendance. It integrates with external data sources (like Google Classroom for tasks and a Premises app for attendance) to compute points and rank members. 

**Roles & Access (Current State)**
- **Admin (1 Single Admin):** The only role with login access. The admin can add members, manually log points, confirm heroes of the week/month, and assign tasks.
- **U5 Coordinators (6 members):** Task leads.
- **Regular Members (12 members):** Team members who complete tasks.
- *Note:* Currently, regular members and coordinators do NOT log in. The portal is completely open to the public to view.

---

## 2. Technology Stack

The system is built using a lightweight, no-build-tool approach for the frontend, and a standard Python micro-framework for the backend.

### Frontend
- **Core:** Vanilla HTML5, CSS3, and JavaScript (ES6+).
- **Frameworks:** None (No React, Vue, or npm build steps).
- **Styling:** Custom CSS (`global.css`) utilizing CSS variables for theme consistency (dark mode, neon accents).
- **Architecture:** Multiple HTML pages (`dashboard.html`, `tasks.html`, `leaderboard.html`) communicating with the backend via a centralized `api.js` fetch wrapper.

### Backend
- **Core:** Python 3.11+
- **Framework:** FastAPI (RESTful API, automatic OpenAPI docs).
- **Database:** SQLite (Phase 1, easily migratable to PostgreSQL) using SQLAlchemy ORM.
- **Authentication:** JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Server:** Uvicorn ASGI server.

---

## 3. Endpoints & Data Flow

The backend endpoints are divided into two categories: **Public** (no authentication required) and **Admin-Only** (JWT Bearer token required).

### Public Endpoints (Read-Only)
These endpoints are used by the public UI to display data. They receive no body payloads and send JSON arrays/objects.

| Endpoint | Method | Receives | Sends (Response) |
|---|---|---|---|
| `/members` | `GET` | *(None)* | Array of all active and suspended members with points and ranks. |
| `/members/{id}` | `GET` | `member_id` (path param) | Single member profile data. |
| `/projects` | `GET` | *(None)* | Array of static project configurations. |
| `/tasks` | `GET` | Optional filters (`project_id`, `assigned_to`, `status`) | Array of tasks with resolved assignee/assigner names. |
| `/tasks/{id}` | `GET` | `task_id` (path param) | Single task details. |
| `/points/all` | `GET` | Optional filters (`member_id`, `category`, `limit`) | Paginated array of point history logs. |
| `/leaderboard/weekly` | `GET` | *(None)* | Array of members sorted by weekly points. |
| `/leaderboard/monthly`| `GET` | *(None)* | Array of members sorted by monthly points. |

### Admin-Only Endpoints (Write/Modify)
These endpoints require an `Authorization: Bearer <token>` header. They are used by the Admin Panel to modify system state.

| Endpoint | Method | Receives (Payload) | Sends (Response) |
|---|---|---|---|
| `/auth/login` | `POST` | `username`, `password` | JWT `access_token` and token type. |
| `/members` | `POST` | `name`, `username`, `password`, `role` | Created member object. |
| `/tasks` | `POST` | `title`, `duration_hrs`, `deadline`, `assigned_to`, `project_id` | Created task object. |
| `/tasks/{id}/complete`| `POST` | *(None)* | Updated task object (status: completed). |
| `/tasks/{id}/rate` | `POST` | `rating` ("needs_revision", "meets", "exceeds") | Updated task and calculated `earned_points`. |
| `/points` | `POST` | `member_id`, `event_type`, `category`, `points`, `reason` | Created point log object. |
| `/admin/reset-weekly` | `POST` | *(None)* | Status of weekly points reset. |
| `/admin/confirm-hero-week`| `POST` | `member_id`, `note` | Confirmation object & triggers point event. |
