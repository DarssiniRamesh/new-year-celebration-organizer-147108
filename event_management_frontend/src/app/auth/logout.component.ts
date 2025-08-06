import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.logout().then(() => {
      this.router.navigateByUrl('/auth/login');
    });
  }
}
