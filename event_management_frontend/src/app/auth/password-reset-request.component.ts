import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-password-reset-request',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['../app.component.css']
})
export class PasswordResetRequestComponent {
  email = '';
  error: string | null = null;
  success: string | null = null;
  loading = false;

  constructor(private auth: AuthService) {}

  // PUBLIC_INTERFACE
  async onSubmit() {
    this.loading = true;
    this.error = null;
    this.success = null;
    const { error } = await this.auth.requestPasswordReset(this.email);
    if (error) {
      this.error = error;
    } else {
      this.success = "Password reset email sent! Please check your inbox.";
      this.email = '';
    }
    this.loading = false;
  }
}
