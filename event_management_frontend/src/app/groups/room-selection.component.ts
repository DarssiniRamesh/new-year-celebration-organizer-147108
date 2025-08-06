import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from './room.service';

/**
 * RoomSelectionComponent: Shows a list of rooms, allows a group to select and lock one room,
 * and shows all room assignments if needed.
 */
// PUBLIC_INTERFACE
@Component({
  selector: 'app-room-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-selection.component.html',
  styleUrls: ['./room-selection.component.scss']
})
export class RoomSelectionComponent implements OnInit {
  @Input() groupId: string | null = null;
  @Input() isOrganizer: boolean = false;

  rooms: any[] = [];
  myRoomId: string | null = null;
  myRoomLock: boolean = false;
  allAssignments: any[] = [];
  selectError: string | null = null;
  busy = false;

  // eslint-disable-next-line no-unused-vars
  constructor(private roomService: RoomService) {}

  async ngOnInit() {
    await this.loadRooms();
    await this.loadSelection();
    if (this.isOrganizer) {
      await this.loadAllAssignments();
    }
  }

  async loadRooms() {
    this.busy = true;
    const { rooms, error } = await this.roomService.listRooms();
    if (!error) {
      this.rooms = rooms;
    }
    this.busy = false;
  }

  async loadSelection() {
    if (!this.groupId) return;
    const { roomId, locked } = await this.roomService.getGroupRoomSelection(this.groupId);
    this.myRoomId = roomId;
    this.myRoomLock = locked;
  }

  async loadAllAssignments() {
    const { assignments } = await this.roomService.getAllRoomSelections();
    this.allAssignments = assignments;
  }

  async selectRoom(roomId: string) {
    if (!this.groupId || this.myRoomLock) return;
    this.selectError = null;
    this.busy = true;
    const { error } = await this.roomService.selectRoom(this.groupId, roomId);
    if (error) {
      this.selectError = error;
    }
    await this.loadSelection();
    this.busy = false;
  }

  public isRoomTaken(roomId: string): boolean {
    return !!this.allAssignments?.find(a => a.room_id === roomId && a.group_id !== this.groupId);
  }

  getRoomName(roomId: string): string {
    return this.rooms.find(r => r.id === roomId)?.name || '';
  }

  // For display: which group picked which room. Only for organizer.
  getGroupForRoom(roomId: string): string | null {
    const found = this.allAssignments.find(a => a.room_id === roomId);
    return found?.group_id || null;
  }
}
