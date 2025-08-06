import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-admin-bulk-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="admin-section-card">
    <h3>Bulk Notifications</h3>
    <div class="placeholder-text">Bulk notification tools coming soon.</div>
  </div>
  `,
  styleUrls: ['./admin-section-card.scss']
})
export class AdminBulkNotificationsComponent {}
