import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
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

  constructor(private auth: AuthService) {}

  // PUBLIC_INTERFACE
  async onSubmit() {
    this.error = null;
    this.success = null;
    if (this.password !== this.confirmPassword) {
      this.error = "Passwords do not match.";
      return;
    }
    this.loading = true;
    const { error } = await this.auth.signup(this.email, this.password);
    if (error) {
      this.error = error;
    } else {
      this.success = "Registration successful! Please check your email to verify and log in.";
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
    }
    this.loading = false;
  }
}
