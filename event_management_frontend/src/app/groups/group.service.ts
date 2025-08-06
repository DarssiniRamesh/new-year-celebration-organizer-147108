import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase.service';

/**
 * GroupService provides methods to create, list, and join groups via Supabase.
 * Each group has { id, name, created_by (user id), created_at }.
 */
// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class GroupService {
  private GROUPS_TABLE = 'groups';
  private MEMBERS_TABLE = 'group_members';

  constructor(private supabaseService: SupabaseService) {}

  /**
   * Creates a new group with the given name. Associates current user as creator/member.
   */
  // PUBLIC_INTERFACE
  async createGroup(name: string, userId: string): Promise<{ error: string | null }> {
    try {
      const supabase = this.supabaseService.getClient();
      const { data, error } = await supabase
        .from(this.GROUPS_TABLE)
        .insert([{ name, created_by: userId }])
        .select()
        .single();
      if (error) return { error: error.message };
      const groupId = data.id;
      await supabase.from(this.MEMBERS_TABLE).insert([{ group_id: groupId, user_id: userId }]);
      return { error: null };
    } catch (e: any) {
      return { error: e?.message || 'Error creating group' };
    }
  }

  /**
   * Lists all groups, sorted by created_at descending.
   */
  // PUBLIC_INTERFACE
  async listGroups(): Promise<{ error: string | null, groups: any[] }> {
    try {
      const supabase = this.supabaseService.getClient();
      const { data, error } = await supabase
        .from(this.GROUPS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });
      return { error: error?.message || null, groups: data || [] };
    } catch (e: any) {
      return { error: e?.message || 'Error loading groups', groups: [] };
    }
  }

  /**
   * Join the current user to a group (by group id).
   */
  // PUBLIC_INTERFACE
  async joinGroup(groupId: string, userId: string): Promise<{ error: string | null }> {
    try {
      const supabase = this.supabaseService.getClient();
      const { data } = await supabase
        .from(this.MEMBERS_TABLE)
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', userId)
        .single();
      if (data) {
        return { error: 'Already a member of this group' };
      }
      await supabase.from(this.MEMBERS_TABLE).insert([{ group_id: groupId, user_id: userId }]);
      return { error: null };
    } catch (e: any) {
      return { error: e?.message || 'Error joining group' };
    }
  }

  /**
   * Lists group memberships for user.
   */
  // PUBLIC_INTERFACE
  async getMyGroups(userId: string): Promise<{ error: string | null, groups: any[] }> {
    try {
      const supabase = this.supabaseService.getClient();
      const { data, error } = await supabase
        .from(this.MEMBERS_TABLE)
        .select('group:groups(*)')
        .eq('user_id', userId);
      const groups = ((data as any[]) || []).map(r => r.group).filter(Boolean);
      return { error: error?.message || null, groups };
    } catch (e: any) {
      return { error: e?.message || 'Error fetching memberships', groups: [] };
    }
  }
}
