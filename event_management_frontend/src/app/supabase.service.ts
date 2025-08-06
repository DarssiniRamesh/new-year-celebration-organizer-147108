/* eslint-disable no-undef */

import { Injectable } from '@angular/core';
// PUBLIC_INTERFACE
/**
 * SupabaseService provides a singleton Supabase client instance.
 * Reads NG_APP_SUPABASE_URL and NG_APP_SUPABASE_KEY from environment.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Reads the environment variable from either:
 *   - global "window" (browser-client runtime, injected by env.js)
 *   - process.env (server/SSR/Node)
 *   - globalThis (last resort, if present)
 * Adds explicit debug logging for troubleshooting.
 */
function getEnvVar(name: string): string | undefined {
  // Check window (browser client)
  if (typeof window !== 'undefined' && typeof (window as any) !== 'undefined') {
    const w = window as any;
    if (name in w) {
      if (typeof console !== 'undefined') {
        console.debug(`[SupabaseService:getEnvVar] Resolved "${name}" from window:`, w[name]);
      }
      return w[name];
    } else if (typeof console !== 'undefined') {
      console.debug(`[SupabaseService:getEnvVar] "${name}" not found on window`);
    }
  }

  // Node.js/server environment (SSR)
  if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
    if (name in process.env) {
      if (typeof console !== 'undefined') {
        console.debug(`[SupabaseService:getEnvVar] Resolved "${name}" from process.env:`, process.env[name]);
      }
      return process.env[name];
    } else if (typeof console !== 'undefined') {
      console.debug(`[SupabaseService:getEnvVar] "${name}" not found in process.env`);
    }
  }

  // Fallback: globalThis (covers some edge/cross-context cases)
  if (typeof globalThis !== 'undefined') {
    const g = globalThis as any;
    if (name in g) {
      if (typeof console !== 'undefined') {
        console.debug(`[SupabaseService:getEnvVar] Resolved "${name}" from globalThis:`, g[name]);
      }
      return g[name];
    } else if (typeof console !== 'undefined') {
      console.debug(`[SupabaseService:getEnvVar] "${name}" not found in globalThis`);
    }
  }
  if (typeof console !== 'undefined') {
    console.warn(`[SupabaseService:getEnvVar] "${name}" not found in any runtime context`);
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

    if (typeof console !== 'undefined') {
      console.debug('[SupabaseService] NG_APP_SUPABASE_URL:', this._url);
      console.debug('[SupabaseService] NG_APP_SUPABASE_KEY:', this._key ? '[present]' : '[absent]');
      if (typeof window !== 'undefined') {
        console.debug('[SupabaseService] Environment: running in browser; should read from window.');
      } else if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
        console.debug('[SupabaseService] Environment: running in Node/SSR; should read from process.env.');
      } else {
        console.debug('[SupabaseService] Environment: unknown - fallback env sourcing.');
      }
    }

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
