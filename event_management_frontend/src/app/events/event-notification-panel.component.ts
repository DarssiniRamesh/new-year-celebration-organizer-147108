import { Component, Input, OnInit, inject } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { CommonModule } from '@angular/common';

/**
 * Organizer UI panel for sending and monitoring event notification emails.
 * Reads from Supabase "notifications" table to get status; allows "Send"/"Bulk Notify" with festive styling.
 */
// PUBLIC_INTERFACE
@Component({
  selector: 'app-event-notification-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-notification-panel.component.html',
  styleUrls: ['./event-notification-panel.component.scss']
})
export class EventNotificationPanelComponent implements OnInit {
  @Input() eventId: string | null = null;
  @Input() isOrganizer: boolean = false;

  pendingCount = 0;
  sentCount = 0;
  loading = false;
  error: string | null = null;
  info: string | null = null;

  // No longer take supabaseService in constructor; use inject()
  private supabaseService = inject(SupabaseService);

  async ngOnInit() {
    await this.reloadStatus();
  }

  /** Checks notification status for the event. */
  async reloadStatus() {
    if (!this.eventId) return;
    this.loading = true;
    this.error = null;
    // Query the notifications status in Supabase
    try {
      const client = this.supabaseService.getClient();
      // Get sent and pending counts
      const { count: sentCount } = await client
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', this.eventId)
        .eq('sent', true);
      const { count: pendingCount } = await client
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', this.eventId)
        .eq('sent', false);

      this.sentCount = sentCount || 0;
      this.pendingCount = pendingCount || 0;
    } catch (e: any) {
      this.error = e?.message || 'Error loading notification status';
    } finally {
      this.loading = false;
    }
  }

  /** Organizer action: Insert notification records for each event participant. */
  async sendNotifications() {
    if (!this.isOrganizer || !this.eventId) return;
    this.loading = true; this.error = null; this.info = null;
    try {
      const client = this.supabaseService.getClient();
      // Find participants; for each, insert into notifications if not exists and not sent
      const { data: parts, error: findErr } = await client
        .from('event_participants')
        .select('user_id')
        .eq('event_id', this.eventId);

      if (findErr) {
        this.error = findErr.message; this.loading = false; return;
      }
      if (!parts || !parts.length) {
        this.error = 'No event participants found to notify.';
        this.loading = false; return;
      }
      // Get already notified (sent or still pending)
      const { data: existing } = await client
        .from('notifications')
        .select('user_id')
        .eq('event_id', this.eventId);

      const alreadyNotified = new Set(
        (existing || []).map((n: any) => n.user_id)
      );
      // Insert new for all participants not yet in notifications
      const inserts = parts
        .filter((p: any) => !alreadyNotified.has(p.user_id))
        .map((p: any) => ({ user_id: p.user_id, event_id: this.eventId, sent: false }));

      if (inserts.length > 0) {
        const { error: insErr } = await client
          .from('notifications')
          .insert(inserts);
        if (insErr) {
          this.error = insErr.message;
          this.loading = false; return;
        }
        this.info = `Queued ${inserts.length} notification(s)!`;
      } else {
        this.info = 'All participants already notified or pending notification.';
      }
      await this.reloadStatus();
    } catch (e: any) {
      this.error = e?.message || 'Error sending notifications';
    } finally {
      this.loading = false;
    }
  }
}
