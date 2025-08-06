import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Session, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * AuthService encapsulates user authentication flows using Supabase.
 * Provides methods for signup, login, logout, session recovery, and password reset.
 */
// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class AuthService {
  private session$ = new BehaviorSubject<Session | null>(null);
  private user$ = new BehaviorSubject<User | null>(null);

  // eslint-disable-next-line no-unused-vars
  constructor(private supabaseService: SupabaseService) {
    // SSR/static: Only set up listener if client available.
    const client = this.supabaseService.getClient();
    if (client) {
      client.auth.onAuthStateChange((event, session) => {
        this.session$.next(session);
        this.user$.next(session?.user ?? null);
      });
      // Try to get current session on load.
      client.auth.getSession().then(({ data: { session } }) => {
        this.session$.next(session);
        this.user$.next(session?.user ?? null);
      });
    }
  }

  /**
   * Observable of current session.
   */
  // PUBLIC_INTERFACE
  session(): Observable<Session | null> {
    return this.session$.asObservable();
  }

  /**
   * Observable of current user.
   */
  // PUBLIC_INTERFACE
  user(): Observable<User | null> {
    return this.user$.asObservable();
  }

  /**
   * Signs up the user using email and password.
   */
  // PUBLIC_INTERFACE
  async signup(email: string, password: string): Promise<{ error: string | null }> {
    // SSR safety: get location in a lint-compatible way
    let emailRedirectTo = '/auth/callback';
    let getLocation: any = undefined;
    if (typeof globalThis !== 'undefined') {
      getLocation = (globalThis as any).window?.location || (globalThis as any).location;
      if (getLocation) {
        emailRedirectTo = getLocation.origin + '/auth/callback';
      }
    }
    const client = this.supabaseService.getClient();
    if (!client) {
      return { error: 'Supabase not initialized' };
    }
    const { error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo
      },
    });
    return { error: error?.message || null };
  }

  /**
   * Logs in user using email and password.
   */
  // PUBLIC_INTERFACE
  async login(email: string, password: string): Promise<{ error: string | null }> {
    const client = this.supabaseService.getClient();
    if (!client) return { error: 'Supabase not initialized' };
    const { error } = await client.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  }

  /**
   * Logs out the user.
   */
  // PUBLIC_INTERFACE
  async logout(): Promise<void> {
    const client = this.supabaseService.getClient();
    if (!client) return;
    await client.auth.signOut();
  }

  /**
   * Requests a password reset email.
   */
  // PUBLIC_INTERFACE
  async requestPasswordReset(email: string): Promise<{ error: string | null }> {
    let redirectTo = '/auth/callback';
    let getLocation: any = undefined;
    if (typeof globalThis !== 'undefined') {
      getLocation = (globalThis as any).window?.location || (globalThis as any).location;
      if (getLocation) {
        redirectTo = getLocation.origin + '/auth/callback';
      }
    }
    const client = this.supabaseService.getClient();
    if (!client) return { error: 'Supabase not initialized' };
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo
    });
    return { error: error?.message || null };
  }

  /**
   * Updates the user's password using the code from the password reset link.
   */
  // PUBLIC_INTERFACE
  async resetPassword(newPassword: string): Promise<{ error: string | null }> {
    const client = this.supabaseService.getClient();
    if (!client) return { error: 'Supabase not initialized' };
    const { error } = await client.auth.updateUser({
      password: newPassword
    });
    return { error: error?.message || null };
  }
}
