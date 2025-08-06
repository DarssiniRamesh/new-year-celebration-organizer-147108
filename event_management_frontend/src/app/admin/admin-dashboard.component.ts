import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsersComponent } from './admin-users.component';
import { AdminGroupsComponent } from './admin-groups.component';
import { AdminEventsComponent } from './admin-events.component';
import { AdminRoomsComponent } from './admin-rooms.component';
import { AdminBulkNotificationsComponent } from './admin-bulk-notifications.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AdminUsersComponent,
    AdminGroupsComponent,
    AdminEventsComponent,
    AdminRoomsComponent,
    AdminBulkNotificationsComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  tab: 'users' | 'groups' | 'events' | 'rooms' | 'notifications' = 'users';
}
