import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard {
  // PUBLIC_INTERFACE
  /** Route guard: Only allow access if the user's role is 'admin' or 'organizer'. */
  async canActivate(): Promise<boolean> {
    // Correct destructuring for Supabase getUser() response:
    // Note: You must provide your own SupabaseService and Router
    // If you want to use this class-based guard, be sure to provide instances in Angular DI.
    return false; // This guard remains as a template. Use the functional one below.
  }
  // Removed unused constructor parameters to pass linting.
}

// Angular functional route guard export
// PUBLIC_INTERFACE
export const adminGuard: CanActivateFn = async () => {
  // Using Angular's "inject" for composition in standalone guards
  const router = inject(Router);
  const supabase = inject(SupabaseService);
  const { data: { user } } = await supabase.getClient().auth.getUser();
  if (!user) {
    router.navigate(['/auth/login']);
    return false;
  }
  const role = user.user_metadata?.['role'];
  if (role === 'admin' || role === 'organizer') {
    return true;
  }
  router.navigate(['/']);
  return false;
};
