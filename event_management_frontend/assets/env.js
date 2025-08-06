/* eslint-disable */
/* global window */
/**
 * assets/env.js - Injects build/runtime environment as global variables to be read by Angular.
 * This file is loaded before main bundle in index.html and sets global vars for SSR/static/server-side rendering.
 * Runtime values are injected here by the build system or replaced during Docker/Node serving.
 * For local/development, these values are replaced by a script or copy of .env.
 */
// BEGIN ENV VARS (Populated automatically or via script)
window.NG_APP_SUPABASE_URL = window.NG_APP_SUPABASE_URL || "REPLACE_ME_SUPABASE_URL";
window.NG_APP_SUPABASE_KEY = window.NG_APP_SUPABASE_KEY || "REPLACE_ME_SUPABASE_KEY";
// Add further runtime env vars below as needed
// END ENV VARS
