import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomSelectionComponent } from './room-selection.component';
import { GroupService } from './group.service';
import { AuthService } from '../auth.service';

/**
 * GroupsComponent displays: user's memberships, lists all groups, allows group creation and joining.
 * Festive and professional with red/white theme.
 */
// PUBLIC_INTERFACE
@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FormsModule, RoomSelectionComponent],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  groups: any[] = [];
  myGroups: any[] = [];
  loading = false;
  error: string | null = null;
  createError: string | null = null;
  joinError: string | null = null;
  newGroupName = '';
  currentUserId: string | null = null;

  private groupService = inject(GroupService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.user().subscribe((user: any) => {
      this.currentUserId = user?.id ?? null;
      if (this.currentUserId) {
        this.refresh();
      }
    });
  }

  async refresh() {
    this.loading = true;
    this.error = null;
    if (!this.currentUserId) return;
    const [allRes, myRes] = await Promise.all([
      this.groupService.listGroups(),
      this.groupService.getMyGroups(this.currentUserId),
    ]);
    if (allRes.error) this.error = allRes.error;
    else this.groups = allRes.groups;
    if (myRes.error) this.error = myRes.error;
    else this.myGroups = myRes.groups;
    this.loading = false;
  }

  async createGroup() {
    if (!this.currentUserId || !this.newGroupName.trim()) return;
    this.createError = null;
    const { error } = await this.groupService.createGroup(this.newGroupName.trim(), this.currentUserId);
    if (error) this.createError = error;
    else this.newGroupName = '';
    await this.refresh();
  }

  async joinGroup(groupId: string) {
    if (!this.currentUserId) return;
    this.joinError = null;
    const { error } = await this.groupService.joinGroup(groupId, this.currentUserId);
    if (error) this.joinError = error;
    await this.refresh();
  }

  isMemberOfGroup(groupId: any): boolean {
    return !!this.myGroups?.find?.((gr: any) => gr?.id === groupId);
  }
}
