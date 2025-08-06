import { Component, OnInit, inject } from '@angular/core';
import { EventService } from './event.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss']
})
export class EventEditorComponent implements OnInit {
  isEdit = false;
  eventId: string | null = null;
  event: any = {
    title: '',
    description: '',
    start_time: '',
    location: ''
  };
  userId: string | null = null;
  error: string | null = null;
  loading = false;

  // Use Angular inject() for strictest no-unused-vars linter compliance
  private eventService = inject(EventService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  async ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    this.isEdit = !!this.eventId;
    this.authService.user().subscribe(async user => {
      this.userId = user?.id ?? null;
      if (this.isEdit && this.eventId) {
        const { event, error } = await this.eventService.getEvent(this.eventId);
        if (event) this.event = event;
        if (error) this.error = error;
      }
    });
  }

  async saveEvent() {
    if (!this.userId) {
      this.error = 'User not found';
      return;
    }
    this.loading = true;
    this.error = null;
    let sending = {
      ...this.event,
      created_by: this.event.created_by ?? this.userId, // for new event
    };
    const { id, error } = await this.eventService.upsertEvent(sending);
    if (error) this.error = error;
    else this.router.navigate(['/events', id || this.eventId]);
    this.loading = false;
  }

  async deleteEvent() {
    if (!this.isEdit || !this.eventId) return;
    this.loading = true;
    const { error } = await this.eventService.deleteEvent(this.eventId);
    if (error) this.error = error;
    else this.router.navigate(['/events']);
    this.loading = false;
  }
}
