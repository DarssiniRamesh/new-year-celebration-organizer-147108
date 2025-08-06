import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { SignupComponent } from './auth/signup.component';
import { LogoutComponent } from './auth/logout.component';
import { PasswordResetRequestComponent } from './auth/password-reset-request.component';
import { PasswordResetComponent } from './auth/password-reset.component';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/logout', component: LogoutComponent },
  { path: 'auth/reset', component: PasswordResetRequestComponent },
  { path: 'auth/reset-password', component: PasswordResetComponent },
];
