import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase.service';

/**
 * RoomService provides methods to list rooms, select a room for a group,
 * and to get the locked selection for a group. All data is stored/retrieved from Supabase.
 */
// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class RoomService {
  private ROOMS_TABLE = 'rooms';
  private SELECTIONS_TABLE = 'room_selections';

  // eslint-disable-next-line no-unused-vars
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Fetches list of available rooms. Each room has { id, name }.
   */
  // PUBLIC_INTERFACE
  async listRooms(): Promise<{ rooms: any[], error: string | null }> {
    try {
      const client = this.supabaseService.getClient();
      if (!client) return { rooms: [], error: 'Supabase not initialized' };
      const { data, error } = await client
        .from(this.ROOMS_TABLE)
        .select('*')
        .order('name', { ascending: true });
      return { rooms: data || [], error: error?.message || null };
    } catch (e: any) {
      return { rooms: [], error: e?.message || 'Error loading rooms' };
    }
  }

  /**
   * Gets the room selection for the given group.
   */
  // PUBLIC_INTERFACE
  async getGroupRoomSelection(groupId: string): Promise<{ roomId: string | null, locked: boolean, error: string | null }> {
    try {
      const client = this.supabaseService.getClient();
      if (!client) return { roomId: null, locked: false, error: 'Supabase not initialized' };
      const { data, error } = await client
        .from(this.SELECTIONS_TABLE)
        .select('*')
        .eq('group_id', groupId)
        .maybeSingle();
      if (error && error.details && error.details.includes('0 rows')) {
        return { roomId: null, locked: false, error: null };
      }
      return {
        roomId: data ? data.room_id : null,
        locked: data ? !!data.locked : false,
        error: error?.message || null
      };
    } catch (e: any) {
      return { roomId: null, locked: false, error: e?.message || 'Error fetching selection' };
    }
  }

  /**
   * Makes a room selection for the group and locks it.
   * Only allows if not already locked.
   */
  // PUBLIC_INTERFACE
  async selectRoom(groupId: string, roomId: string): Promise<{ error: string | null }> {
    try {
      const client = this.supabaseService.getClient();
      if (!client) return { error: 'Supabase not initialized' };
      // check if already locked
      const { data: existing } = await client
        .from(this.SELECTIONS_TABLE)
        .select('*').eq('group_id', groupId).maybeSingle();
      if (existing?.locked) {
        return { error: 'Room selection is locked for your group.' };
      }
      // Upsert or insert new selection (lock)
      const { error } = await client
        .from(this.SELECTIONS_TABLE)
        .upsert(
          [{ group_id: groupId, room_id: roomId, locked: true }],
          { onConflict: 'group_id' }
        );
      return { error: error?.message || null };
    } catch (e: any) {
      return { error: e?.message || 'Error locking room selection' };
    }
  }

  /**
   * Fetches all room assignments (which group picked which room).
   */
  // PUBLIC_INTERFACE
  async getAllRoomSelections(): Promise<{ assignments: any[], error: string | null }> {
    try {
      const client = this.supabaseService.getClient();
      if (!client) return { assignments: [], error: 'Supabase not initialized' };
      const { data, error } = await client
        .from(this.SELECTIONS_TABLE)
        .select('group_id, room_id, locked');
      return { assignments: data || [], error: error?.message || null };
    } catch (e: any) {
      return { assignments: [], error: e?.message || 'Error fetching assignments' };
    }
  }
}
