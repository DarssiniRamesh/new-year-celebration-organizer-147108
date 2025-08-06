import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Inject env.js script at runtime for SSR/static and browser builds.
 * This ensures Supabase env vars (NG_APP_SUPABASE_URL, NG_APP_SUPABASE_KEY) are accessible for Angular in all modes.
 */
app.get('/assets/env.js', (req, res) => {
  const SUPABASE_URL = process.env['NG_APP_SUPABASE_URL'] || 'REPLACE_ME_SUPABASE_URL';
  const SUPABASE_KEY = process.env['NG_APP_SUPABASE_KEY'] || 'REPLACE_ME_SUPABASE_KEY';
  res.type('application/javascript').send(
    `window.NG_APP_SUPABASE_URL = "${SUPABASE_URL}";\nwindow.NG_APP_SUPABASE_KEY = "${SUPABASE_KEY}";\n`
  );
});

/**
 * Serve static files from /browser
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 3000.
 * To override, set process.env.PORT.
 * This file is the main entry point for SSR when running "npm start" (see package.json).
 */
if (isMainModule(import.meta.url)) {
  // Always bind to 0.0.0.0 so container system can access, using PORT or 3000 as fallback.
  // Parse port as integer to avoid "string | number" type error.
  const port = process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
