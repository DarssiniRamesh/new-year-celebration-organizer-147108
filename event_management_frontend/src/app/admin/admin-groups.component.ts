import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-admin-groups',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="admin-section-card">
    <h3>Manage Groups</h3>
    <div class="placeholder-text">Group management coming soon.</div>
  </div>
  `,
  styleUrls: ['./admin-section-card.scss']
})
export class AdminGroupsComponent {}
