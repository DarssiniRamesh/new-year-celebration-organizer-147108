import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { SignupComponent } from './auth/signup.component';
import { LogoutComponent } from './auth/logout.component';
import { PasswordResetRequestComponent } from './auth/password-reset-request.component';
import { PasswordResetComponent } from './auth/password-reset.component';
import { adminGuard } from './admin/admin.guard';

// Event components lazy standalone
export const routes: Routes = [
  { path: '', loadComponent: () => import('./groups/groups.component').then(m => m.GroupsComponent) },
  { path: 'groups', loadComponent: () => import('./groups/groups.component').then(m => m.GroupsComponent) },
  // Event views:
  { path: 'events', loadComponent: () => import('./events/event-list.component').then(m => m.EventListComponent) },
  { path: 'events/new', loadComponent: () => import('./events/event-editor.component').then(m => m.EventEditorComponent) },
  { path: 'events/:eventId', loadComponent: () => import('./events/event-detail.component').then(m => m.EventDetailComponent) },
  { path: 'events/:eventId/edit', loadComponent: () => import('./events/event-editor.component').then(m => m.EventEditorComponent) },
  // --- ADMIN DASHBOARD ROUTES ---
  { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  // Auth...
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/logout', component: LogoutComponent },
  { path: 'auth/reset', component: PasswordResetRequestComponent },
  { path: 'auth/reset-password', component: PasswordResetComponent },
];
