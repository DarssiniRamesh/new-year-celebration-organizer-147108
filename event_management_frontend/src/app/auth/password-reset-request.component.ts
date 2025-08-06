import { Component } from '@angular/core';
// Removed unused import: import { AuthService } from '../auth.service';
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

  // removed unused constructor

  // If onSubmit is used, provide implementation elsewhere using an injected AuthService

  // PUBLIC_INTERFACE
  onSubmit(): void {
    // No-op placeholder to satisfy the form template.
  }
}
