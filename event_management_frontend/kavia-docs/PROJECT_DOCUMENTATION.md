# Event Management Angular Frontend — Comprehensive Documentation

## Overview

This Angular web application facilitates a New Year celebration event, supporting:
- User registration and authentication.
- Group creation and selection.
- Stay/room selection (one per group).
- Event participation and viewing.
- Food preference recording.
- Event scheduling and notifications.
- Responsive dashboard and admin interface.

**Supabase** is used for authentication, data storage, and as the notification trigger backend.

---

## 1. Supabase Schema & Tables

### Required Tables (with Example Structure)

**users** (managed by Supabase Auth)
- id (UUID, PK)
- email
- user_metadata (role, name, etc.)

**groups**
- id (PK, UUID or serial)
- name (text)
- created_by (FK: users.id)
- created_at (timestamp)

**group_members**
- id (PK)
- group_id (FK: groups.id)
- user_id (FK: users.id)
- created_at (timestamp)

**rooms**
- id (PK)
- name (text)
- created_by (FK: users.id or null for organizer system rooms)
- created_at (timestamp)

**room_selections**
- id (PK)
- group_id (FK)
- room_id (FK)
- locked (boolean: true=locked/final)
- created_at (timestamp)

**events**
- id (PK)
- title (text)
- description (text)
- start_time (timestamp)
- location (text)
- created_by (FK: users.id)
- created_at (timestamp)

**event_participants**
- id (PK)
- event_id (FK)
- user_id (FK)
- joined_at (timestamp)

**food_preferences**
- id (PK)
- event_id (FK)
- user_id (FK)
- preferences (JSON or text)
- created_at (timestamp)

**notifications**
- id (PK)
- user_id (FK)
- event_id (FK)
- sent (boolean)
- created_at (timestamp)

#### Notification Triggers

Set up Supabase trigger (`AFTER INSERT OR UPDATE ON events`) to call a function that creates notification entries in the `notifications` table. A Supabase Edge Function or built-in email feature will send emails based on these entries.

See [`assets/supabase.md`](../../assets/supabase.md) for further detail and sample SQL.

---

## 2. Application Architecture

### High-Level Outline

- **UI Framework:** Angular 19+
- **Backend:** Supabase (Database + Auth + Edge Functions + SMTP)
- **State management:** Angular services (singleton, e.g. `SupabaseService`, `AuthService`)
- **Theming:** Modern, festive—red (`#ad0101`), white (`#e9e7e2`), accent (`#eed8d8`); see `src/styles.scss`
- **Responsive Navigation:** Navbar/sidebar, main content panel, mobile support

#### Major Features/Components

- **Authentication** (`/auth/...`)
  - Signup/Login/Logout/Password Reset flows (`auth/`)
  - Uses Supabase Auth via `AuthService` and `SupabaseService`
- **Groups** (`/groups`)
  - User’s group memberships, all groups, create/join group (`groups/`)
  - Room selection for each group
- **Rooms**
  - List of rooms, select/lock one per group, see all assignments (organizer)
- **Events** (`/events`)
  - List, detail, join/leave, organize (`events/`)
  - Event editor for organizers
  - Food preferences per user/event
  - Notification panel for organizers
- **Admin Organizer Dashboard** (`/admin`)
  - Manage users, groups, rooms, events
  - View and trigger bulk notifications
  - Guarded by role (`adminGuard` checks Supabase user_metadata)
- **Food Preferences**
  - Per-event, per-user form, with vegetarian/vegan/allergy notes.

#### Architecture Diagram (Mermaid)

```mermaid
flowchart TD
  subgraph Browser[Browser (Angular App)]
    A1["Login/Register (Auth)"]
    A2["Groups & Rooms"]
    A3["Events"]
    A4["Food Preferences"]
    A5["Admin Dashboard"]
  end
  subgraph Supabase[Supabase Backend]
    B1["Auth"]
    B2["Database (tables)"]
    B3["Edge Functions / SMTP"]
  end
  A1 -- email/password, session --> B1
  A2 -- CRUD Groups, Group Memberships, Rooms, Selections --> B2
  A3 -- Events, Participants, Notifications --> B2
  A4 -- Food Prefs --> B2
  A5 -- Organizer/Admin CRUD, Triggers --> B2
  B2 -- "Trigger on INSERT/UPDATE events" --> B3
  B3 -- "Send Emails to Participants" --> Browser
```

---

## 3. Environment Variables

The frontend expects **two** environment variables (see `.env`, and injected at build-time or server runtime):

- `NG_APP_SUPABASE_URL`: Supabase project URL
- `NG_APP_SUPABASE_KEY`: Supabase public anon key

**Angular expects these to be globally available at runtime** (handled by Angular builder or server for SSR).

**How they're used:**
- Read by `SupabaseService` in `src/app/supabase.service.ts` to create the singleton client instance for all database/auth operations.
- Required for both developer and production environments.

Example Angular environment snippet:
```shell
NG_APP_SUPABASE_URL=https://xxxx.supabase.co
NG_APP_SUPABASE_KEY=eyJh...
```

---

## 4. Feature & Component Roles

### Auth (`auth/`)

- **login/signup/logout/password reset** — full flow using Supabase Auth
- Accessed as `/auth/login`, `/auth/signup`, `/auth/reset` etc.

### Groups (`groups/`)

- **groups.component.ts**: Lists user’s groups, all available groups, create/join interface.
- **group.service.ts**: Handles group CRUD, join, and list operations via Supabase.
- **room-selection.component.ts**: Room picker for a given group, allows organizer view of all assignments.

### Rooms (`rooms/`)

- **room.service.ts**: CRUD and selection lock for rooms per group. Ensures only one group can pick a room and locks it.

### Events (`events/`)

- **event-list.component.ts**: List events, allows “join”/”not joined” indicator.
- **event-detail.component.ts**: Details, participants, join/leave, and notification status.
- **event-editor.component.ts**: Organizer-only; create or edit event.
- **event-notification-panel.component.ts**: For organizers; tracks notification delivery, allows bulk resending.

### Food Preferences

- **food-preferences.component.ts**: Per-user food preference form for events (veg, non-veg, allergies, notes).
- **food-preferences.service.ts**: CRUD for preferences on Supabase.

### Admin/Organizer (`admin/`)

- **admin-dashboard.component.ts** and other `admin-*.component.ts` — Tabbed dashboard for users, groups, events, rooms, notifications. Role-protected (see `admin.guard.ts`).

---

## 5. Deployment & Setup Instructions

### For Developers

1. **Install Node.js, Angular CLI, and dependencies:**
   ```bash
   npm install -g @angular/cli
   cd event_management_frontend
   npm install
   ```

2. **Set Supabase environment variables:**
   - For local dev, add to `.env` or your shell environment:
     ```
     NG_APP_SUPABASE_URL=your_supabase_url
     NG_APP_SUPABASE_KEY=your_public_anon_key
     ```
   - Ensure these are injected for SSR/server builds.

3. **Run the development server:**
   ```bash
   ng serve
   ```
   - Access at http://localhost:4200/.

4. **Supabase Setup:**
   - Use the SQL IDE to create tables described above.
   - Add event notification triggers (see `assets/supabase.md` for examples).
   - Add SMTP settings for outgoing email, or deploy an Edge Function for notification processing.

5. **Test and build:**
   ```bash
   ng test    # Unit tests
   ng build   # Build for production
   ```

6. **SSR / Production deployment:**
   - Build and deploy as a static site or with server-side rendering.
   - Ensure environment variables are injected at runtime on server builds.

### For Organizers

- **Admin Dashboard:** Organizer/admin must be assigned the correct role in Supabase user_metadata (`role: 'admin'` or `role: 'organizer'`).
- **Adding Rooms/Events/Groups:** Use admin dashboard tab to create/manage.
- **Sending Notifications:** Trigger via the dashboard (event detail).
- **Monitor status:** Use notification panels to monitor delivery and exclusions.

---

## 6. Additional Information & Theming

- **Styling:** See `src/styles.scss` (primary: #ad0101, accent: #eed8d8, secondary: #e9e7e2).
- **Accessibility:** Responsive layout, good contrast and focus styles for navigation/forms.
- **Extending:** Use Angular CLI to generate new standalone components.

---

## 7. References

- [Supabase Docs](https://supabase.com/docs)
- [Angular CLI Docs](https://angular.io/cli)
- Sample SQL and trigger setup: see [`assets/supabase.md`](../../assets/supabase.md)
- Application README: see [`../README.md`](../README.md)
