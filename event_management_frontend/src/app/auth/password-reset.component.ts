import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-reset.component.html',
  styleUrls: ['../app.component.css']
})
export class PasswordResetComponent {
  newPassword = '';
  confirmPassword = '';
  error: string | null = null;
  success: string | null = null;
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  // PUBLIC_INTERFACE
  async onSubmit() {
    this.error = null;
    this.success = null;
    if (this.newPassword !== this.confirmPassword) {
      this.error = "Passwords do not match.";
      return;
    }
    this.loading = true;
    const { error } = await this.auth.resetPassword(this.newPassword);
    if (error) {
      this.error = error;
    } else {
      this.success = "Password updated successfully! Please login.";
      // Optional: Redirect after short delay, SSR-safe
      let setTimeoutFn: any = undefined;
      if (typeof globalThis !== 'undefined') {
        setTimeoutFn = (globalThis as any).window?.setTimeout || (globalThis as any).setTimeout;
      }
      if (setTimeoutFn) {
        setTimeoutFn(() => this.router.navigateByUrl('/auth/login'), 3000);
      }
      // SSR fallback: no redirect
    }
    this.loading = false;
  }
}
