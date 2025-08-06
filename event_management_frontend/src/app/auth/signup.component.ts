import { Component } from '@angular/core';
// Removed unused import: import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['../app.component.css']
})
export class SignupComponent {
  email = '';
  password = '';
  confirmPassword = '';
  error: string | null = null;
  success: string | null = null;
  loading = false;

  // removed unused constructor

  // If onSubmit is used, provide implementation elsewhere using an injected AuthService
}
