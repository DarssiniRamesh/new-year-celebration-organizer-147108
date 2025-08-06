import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'New Year Celebration Organizer!';
  sidebarOpen: boolean = false;

  userLoggedIn: boolean = false;
  showAdmin: boolean = false;
  supabaseAvailable = true;

  // For demonstration, auth/role states managed reactively
  private authService = inject(AuthService);

  constructor() {
    // SSR/static: Only subscribe to user if Supabase env is available.
    this.supabaseAvailable = SupabaseService.isAvailable();
    if (this.supabaseAvailable) {
      this.authService.user().subscribe(user => {
        this.userLoggedIn = !!user;
        const role = user?.user_metadata?.['role'] || '';
        this.showAdmin = ['admin', 'organizer'].includes(role);
      });
    } else {
      this.userLoggedIn = false;
      this.showAdmin = false;
    }
  }
}
