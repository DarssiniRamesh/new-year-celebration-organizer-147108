import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;
  loading = false;

  // eslint-disable-next-line no-unused-vars
  constructor(private auth: AuthService) {}

  // PUBLIC_INTERFACE
  async onSubmit() {
    this.loading = true;
    this.error = null;
    const { error } = await this.auth.login(this.email, this.password);
    if (error) {
      this.error = error;
    }
    this.loading = false;
  }
}
