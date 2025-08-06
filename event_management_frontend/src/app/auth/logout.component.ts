import { Component, OnInit } from '@angular/core';
// Removed unused import: import { AuthService } from '../auth.service';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-logout',
  standalone: true,
  template: `
    <div class="auth-form" style="text-align:center;">
      <h2>Logging out...</h2>
    </div>
  `,
  styleUrls: ['../app.component.css']
})
export class LogoutComponent implements OnInit {
  ngOnInit() {
    // This component only displays, logout is handled elsewhere or within parent logic
  }
}
