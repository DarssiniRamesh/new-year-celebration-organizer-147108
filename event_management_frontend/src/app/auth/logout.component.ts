import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

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
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.logout();
  }
}
