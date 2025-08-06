import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="admin-section-card">
    <h3>Manage Users</h3>
    <div class="placeholder-text">User management coming soon.</div>
  </div>
  `,
  styleUrls: ['./admin-section-card.scss']
})
export class AdminUsersComponent {}
