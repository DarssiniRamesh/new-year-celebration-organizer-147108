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
  private supabase: SupabaseClient;

  constructor() {
    const url = getEnvVar('NG_APP_SUPABASE_URL') || '';
    const key = getEnvVar('NG_APP_SUPABASE_KEY') || '';
    if (!url || !key) {
      throw new Error('Supabase environment variables not set');
    }
    this.supabase = createClient(url, key);
  }

  // PUBLIC_INTERFACE
  /**
   * Returns the singleton Supabase client instance.
   */
  public getClient(): SupabaseClient {
    return this.supabase;
  }
}
