import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase.service';

/**
 * EventService manages CRUD and participation logic for events using Supabase.
 */
// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class EventService {
  private EVENTS_TABLE = 'events';
  private PARTICIPANTS_TABLE = 'event_participants';

  constructor(supabaseService: SupabaseService) {
    this.supabaseService = supabaseService;
  }
  private readonly supabaseService: SupabaseService;
  // Parameter is used, keep as is.

  /**
   * Lists all events.
   */
  // PUBLIC_INTERFACE
  async listEvents(): Promise<{ events: any[], error: string | null }> {
    try {
      const client = this.supabaseService.getClient();
      if (!client) return { events: [], error: 'Supabase not initialized' };
      const { data, error } = await client
        .from(this.EVENTS_TABLE)
        .select('*')
        .order('start_time', { ascending: true });
      return { events: data || [], error: error?.message || null };
    } catch (e: any) {
      return { events: [], error: e?.message || 'Error loading events' };
    }
  }

  /**
   * Gets an event by id.
   */
  // PUBLIC_INTERFACE
  async getEvent(eventId: string): Promise<{ event: any, error: string | null }> {
    try {
      const client = this.supabaseService.getClient();
      if (!client) return { event: null, error: 'Supabase not initialized' };
      const { data, error } = await client
        .from(this.EVENTS_TABLE)
        .select('*')
        .eq('id', eventId)
        .maybeSingle();
      return { event: data, error: error?.message || null };
    } catch (e: any) {
      return { event: null, error: e?.message || 'Error loading event' };
    }
  }

  /**
   * Creates or edits an event (upsert).
   * Only for organizers.
   */
  // PUBLIC_INTERFACE
  async upsertEvent(event: any): Promise<{ id?: string, error: string | null }> {
    try {
      const client = this.supabaseService.getClient();
      if (!client) return { error: 'Supabase not initialized' };
      let record = { ...event };
      // Upsert: uses PK 'id' (if exists, update)
      const { data, error } = await client
        .from(this.EVENTS_TABLE)
        .upsert([record])
        .select()
        .maybeSingle();
      return { id: data?.id, error: error?.message || null };
    } catch (e: any) {
      return { error: e?.message || 'Error saving event' };
    }
  }

  /**
   * Deletes an event (organizer only).
   */
  // PUBLIC_INTERFACE
  async deleteEvent(eventId: string): Promise<{ error: string | null }> {
    try {
      const client = this.supabaseService.getClient();
      if (!client) return { error: 'Supabase not initialized' };
      const { error } = await client
        .from(this.EVENTS_TABLE)
        .delete()
        .eq('id', eventId);
      return { error: error?.message || null };
    } catch (e: any) {
      return { error: e?.message || 'Error deleting event' };
    }
  }

  /**
   * Allows a user to join an event.
   */
  // PUBLIC_INTERFACE
  async joinEvent(eventId: string, userId: string): Promise<{ error: string | null }> {
    try {
      const client = this.supabaseService.getClient();
      if (!client) return { error: 'Supabase not initialized' };
      // Check if already joined
      const { data } = await client
        .from(this.PARTICIPANTS_TABLE)
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle();
      if (data) return { error: 'You have already joined this event.' };
      const { error } = await client
        .from(this.PARTICIPANTS_TABLE)
        .insert([{ event_id: eventId, user_id: userId }]);
      return { error: error?.message || null };
    } catch (e: any) {
      return { error: e?.message || 'Error joining event' };
    }
  }

  /**
   * Allows a user to leave an event.
   */
  // PUBLIC_INTERFACE
  async leaveEvent(eventId: string, userId: string): Promise<{ error: string | null }> {
    try {
      const client = this.supabaseService.getClient();
      if (!client) return { error: 'Supabase not initialized' };
      const { error } = await client
        .from(this.PARTICIPANTS_TABLE)
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);
      return { error: error?.message || null };
    } catch (e: any) {
      return { error: e?.message || 'Error leaving event' };
    }
  }

  /**
   * Returns true if the user is a participant of the event.
   */
  // PUBLIC_INTERFACE
  async isUserParticipant(eventId: string, userId: string): Promise<boolean> {
    const client = this.supabaseService.getClient();
    if (!client) return false;
    const { data } = await client
      .from(this.PARTICIPANTS_TABLE)
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();
    return !!data;
  }

  /**
   * Lists participants for an event. Returns list of {user_id}.
   */
  // PUBLIC_INTERFACE
  async listEventParticipants(eventId: string): Promise<{ participants: any[], error: string | null }> {
    try {
      const client = this.supabaseService.getClient();
      if (!client) return { participants: [], error: 'Supabase not initialized' };
      const { data, error } = await client
        .from(this.PARTICIPANTS_TABLE)
        .select('user_id')
        .eq('event_id', eventId);
      return { participants: data || [], error: error?.message || null };
    } catch (e: any) {
      return { participants: [], error: e?.message || 'Error loading participants' };
    }
  }
}

