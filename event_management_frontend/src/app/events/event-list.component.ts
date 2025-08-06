import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor() {}
}
