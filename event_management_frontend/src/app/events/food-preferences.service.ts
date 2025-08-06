import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase.service';

/**
 * Manages food preferences CRUD for each event/user on Supabase.
 * Table: food_preferences (id [PK], event_id, user_id, preferences [JSON|string], created_at)
 */
// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class FoodPreferencesService {
  private FOOD_PREFERENCES_TABLE = 'food_preferences';

  constructor(supabaseService: SupabaseService) {
    this.supabaseService = supabaseService;
  }
  private readonly supabaseService: SupabaseService;

  /**
   * Get the food preferences for a user at a specific event.
   */
  // PUBLIC_INTERFACE
  async getPreferences(eventId: string, userId: string): Promise<{ preferences: any, id?: string, error: string|null }> {
    try {
      const client = this.supabaseService.getClient();
      if (!client) return { preferences: {}, error: 'Supabase not initialized' };
      const { data, error } = await client
        .from(this.FOOD_PREFERENCES_TABLE)
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle();
      return { preferences: data?.preferences || {}, id: data?.id, error: error?.message || null };
    } catch (e: any) {
      return { preferences: {}, error: e?.message || 'Error loading preferences' };
    }
  }

  /**
   * Upsert (insert or update) food preferences for a user/event.
   */
  // PUBLIC_INTERFACE
  async savePreferences(eventId: string, userId: string, prefs: any): Promise<{ error: string|null }> {
    try {
      const client = this.supabaseService.getClient();
      if (!client) return { error: 'Supabase not initialized' };
      const { error } = await client
        .from(this.FOOD_PREFERENCES_TABLE)
        .upsert([{ event_id: eventId, user_id: userId, preferences: prefs }], { onConflict: 'event_id,user_id' });
      return { error: error?.message || null };
    } catch (e: any) {
      return { error: e?.message || 'Error saving preferences' };
    }
  }

  /**
   * Delete preferences for a user/event.
   */
  // PUBLIC_INTERFACE
  async deletePreferences(eventId: string, userId: string): Promise<{ error: string|null }> {
    try {
      const client = this.supabaseService.getClient();
      if (!client) return { error: 'Supabase not initialized' };
      const { error } = await client
        .from(this.FOOD_PREFERENCES_TABLE)
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);
      return { error: error?.message || null };
    } catch (e: any) {
      return { error: e?.message || 'Error deleting preferences' };
    }
  }
}
