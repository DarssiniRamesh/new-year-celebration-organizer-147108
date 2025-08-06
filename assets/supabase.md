# Supabase Integration for Angular Event Management Frontend

## Usage Summary

This frontend reads two environment variables for Supabase:
- `NG_APP_SUPABASE_URL`: The Supabase project URL.
- `NG_APP_SUPABASE_KEY`: The public anon API key.

Both should be set in the environment (see `.env` file or build environment), and available at runtime as global variables (handled by Angular build setup).

The Angular service `SupabaseService` (see `src/app/supabase.service.ts`) provides a singleton client instance via `@supabase/supabase-js`. The app expects these variables to be available on both browser and server (for SSR, inject appropriately).

## Setup requirements
- At runtime, ensure `NG_APP_SUPABASE_URL` and `NG_APP_SUPABASE_KEY` are available. 
- When building for different environments (development, production), these should be injected using Angular environment files or a custom script.
- All Supabase interactions in the application should use `SupabaseService.getClient()`.

## Example (for future reference)

To use the Supabase client in a component:

```typescript
import { SupabaseService } from './supabase.service';

constructor(private supabaseService: SupabaseService) {}

async fetchData() {
  const { data, error } = await this.supabaseService.getClient().from('tablename').select('*');
}
```

---

## Automated Event Email Notification Integration

**Event notification emails are sent when organizers schedule (insert) or update an event. This is handled via Supabase's Database Functions/Triggers (server-side) and integrated with the frontend.**

### Database Setup

- When an event is created or updated in the `events` table, a trigger (`AFTER INSERT OR UPDATE`) on that table will call a PostgreSQL function that enqueues or sends emails (using Supabase's SMTP mail setup).
  - The function should construct the message based on event details and target all participants or a subset as appropriate.

#### Example PostgreSQL Function/Trigger (to be set up in Supabase SQL Editor)
```sql
-- Example: notify on event change (pseudo-code)
CREATE OR REPLACE FUNCTION notify_event_participants()
RETURNS TRIGGER AS $$
DECLARE
  r RECORD;
  email TEXT;
BEGIN
  FOR r IN
      SELECT user_id FROM event_participants WHERE event_id = NEW.id
  LOOP
    -- Use extensions or edge functions for actual email.
    -- record notification request, or enqueue to "notifications" table for backend/edge
    INSERT INTO notifications (user_id, event_id, sent, created_at)
      VALUES (r.user_id, NEW.id, FALSE, NOW());
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach to INSERT/UPDATE events
CREATE TRIGGER after_event_upsert
AFTER INSERT OR UPDATE ON events
FOR EACH ROW EXECUTE PROCEDURE notify_event_participants();
```

#### Email Sending
- Set up a Supabase Edge Function (Node/TypeScript or Deno) or use Supabase's built-in SMTP features to pick up unsent notifications from the `notifications` table and send emails to users.
- The frontend will **not** send emails directly; it will only update event records and, for manual sends, insert into the `notifications` table (see UI below).

### Email Status Monitoring from Frontend

- To show notification status for events, query the `notifications` table (or via a Supabase view) for counts of pending/sent for a given event.
- The UI can allow the organizer to trigger/bulk notify by inserting records into the same table.

### Frontend Developer Notes

- Use `GET / SELECT` from `notifications` to track event notification delivery status.
- To manually send or retry, allow organizers to `insert` or call a Supabase Edge Function (see backend setup).
- UI/Components should use festive red/white styling. See `styles.scss` and `.event-notification-panel` class.

## Theming

Main color variables are set in `src/styles.scss`:
- Primary: #ad0101 (festive red)
- Accent: #eed8d8 (soft)
- Secondary: #e9e7e2 (ivory/white)

Modify SCSS variables as needed for future page/component theming.
