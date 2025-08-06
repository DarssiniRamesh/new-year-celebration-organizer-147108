# Supabase Integration for Angular Event Management Frontend

## Usage Summary

This frontend reads two environment variables for Supabase:
- `NG_APP_SUPABASE_URL`: The Supabase project URL.
- `NG_APP_SUPABASE_KEY`: The public anon API key.

Both should be set in the environment (see `.env` file or build environment), and available at runtime as global variables (handled by Angular build setup).

The Angular service `SupabaseService` (see `src/app/supabase.service.ts`) provides a singleton client instance via `@supabase/supabase-js`. The app expects these variables to be available on both browser and server (for SSR, inject appropriately).

## Setup requirements
- At runtime, ensure `NG_APP_SUPABASE_URL` and `NG_APP_SUPABASE_KEY` are available. 
- When building for different environments (development, production), these should be injected using Angular environment files or a custom script.
- All Supabase interactions in the application should use `SupabaseService.getClient()`.

## Example (for future reference)

To use the Supabase client in a component:

```typescript
import { SupabaseService } from './supabase.service';

constructor(private supabaseService: SupabaseService) {}

async fetchData() {
  const { data, error } = await this.supabaseService.getClient().from('tablename').select('*');
}
```

## Theming

Main color variables are set in `src/styles.scss`:
- Primary: #ad0101 (festive red)
- Accent: #eed8d8 (soft)
- Secondary: #e9e7e2 (ivory/white)

Modify SCSS variables as needed for future page/component theming.
