import { Injectable } from '@angular/core';
// PUBLIC_INTERFACE
/**
 * SupabaseService provides a singleton Supabase client instance.
 * Reads NG_APP_SUPABASE_URL and NG_APP_SUPABASE_KEY from environment.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Reads the environment variable from the global context in a universal way.
 */
function getEnvVar(name: string): string | undefined {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-undef
    const w = window as any;
    if (name in w) return w[name];
  }
  if (typeof globalThis !== 'undefined') {
    const g = globalThis as any;
    if (name in g) return g[name];
  }
  return undefined;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private _url: string | undefined;
  private _key: string | undefined;

  constructor() {
    this._url = getEnvVar('NG_APP_SUPABASE_URL');
    this._key = getEnvVar('NG_APP_SUPABASE_KEY');
    if (this._url && this._key) {
      this.supabase = createClient(this._url, this._key);
    } else {
      this.supabase = null;
      if (typeof console !== 'undefined') {
        console.warn('Supabase: environment variables NG_APP_SUPABASE_URL/KEY not set. Supabase client unavailable until runtime.');
      }
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Returns the singleton Supabase client instance, or null if not available.
   * Use SupabaseService.isAvailable() before calling, especially in SSR/prerender, to avoid breaking static build.
   * Example:
   *    if (SupabaseService.isAvailable()) {
   *      const client = supabaseService.getClient();
   *      // ... use client
   *    } else {
   *      // Render fallback or placeholder (SSR/static)
   *    }
   */
  public getClient(): SupabaseClient | null {
    return this.supabase;
  }

  /**
   * Returns true if Supabase environment variables and client are available (safe for use).
   */
  public static isAvailable(): boolean {
    return !!(getEnvVar('NG_APP_SUPABASE_URL') && getEnvVar('NG_APP_SUPABASE_KEY'));
  }
}
