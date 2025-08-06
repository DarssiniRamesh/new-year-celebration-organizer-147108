import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from './event.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  loading = false;
  error: string | null = null;
  userId: string | null = null;
  eventMemberships: { [eventId: string]: boolean } = {};

  private eventService = inject(EventService);
  private authService = inject(AuthService);
  private router = inject(Router);

  async ngOnInit() {
    this.loading = true;
    // Get current user
    this.authService.user().subscribe(async user => {
      this.userId = user?.id ?? null;
      await this.loadEvents();
    });
  }

  async loadEvents() {
    this.loading = true;
    const { events, error } = await this.eventService.listEvents();
    this.events = events;
    if (error) this.error = error;
    if (this.userId) {
      // Load membership for each event for current user
      for (const ev of this.events) {
        this.eventMemberships[ev.id] = await this.eventService.isUserParticipant(ev.id, this.userId);
      }
    }
    this.loading = false;
  }

  goToDetail(eventId: string) {
    this.router.navigate(['/events', eventId]);
  }
}
