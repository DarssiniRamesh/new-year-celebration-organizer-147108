import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from './event.service';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FoodPreferencesComponent } from './food-preferences.component';
import { EventNotificationPanelComponent } from './event-notification-panel.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FoodPreferencesComponent, EventNotificationPanelComponent],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  event: any;
  error: string | null = null;
  loading = false;
  eventId: string | null = null;
  userId: string | null = null;
  joined = false;
  isOrganizer = false;
  participants: any[] = [];

  // Remove constructor and use inject() for required services
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private authService = inject(AuthService);
  private router = inject(Router);

  async ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    this.authService.user().subscribe(async user => {
      this.userId = user?.id ?? null;
      await this.loadDetail();
    });
  }

  async loadDetail() {
    this.loading = true;
    this.error = null;
    if (!this.eventId) return;
    const { event, error } = await this.eventService.getEvent(this.eventId);
    this.event = event;
    if (error) this.error = error;
    if (this.userId) {
      this.joined = await this.eventService.isUserParticipant(this.eventId, this.userId);
      // If user created event, they are organizer
      this.isOrganizer = this.userId === this.event?.created_by;
    }
    const { participants } = await this.eventService.listEventParticipants(this.eventId);
    this.participants = participants;
    this.loading = false;
  }

  async joinEvent() {
    if (!this.eventId || !this.userId) return;
    const { error } = await this.eventService.joinEvent(this.eventId, this.userId);
    if (error) this.error = error;
    else this.error = null;
    await this.loadDetail();
  }

  async leaveEvent() {
    if (!this.eventId || !this.userId) return;
    const { error } = await this.eventService.leaveEvent(this.eventId, this.userId);
    if (error) this.error = error;
    else this.error = null;
    await this.loadDetail();
  }

  editEvent() {
    this.router.navigate(['/events', this.eventId, 'edit']);
  }
}

import { inject } from '@angular/core';
