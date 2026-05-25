import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
const require = createRequire(import.meta.url);
const svgCaptcha = require('svg-captcha') as {
  create: (options: {
    size: number;
    noise: number;
    width: number;
    height: number;
    color: boolean;
    ignoreChars: string;
  }) => { data: string; text: string };
};
const captchaStore = new Map<string, { text: string; expiresAt: number }>();
const CAPTCHA_TTL_MS = 3 * 60 * 1000;

app.use(express.json());

app.get('/api/captcha/generate', (_req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 3,
    width: 130,
    height: 44,
    color: true,
    ignoreChars: '0oO1ilI',
  });

  const captchaId = randomUUID();
  captchaStore.set(captchaId, {
    text: captcha.text.toLowerCase(),
    expiresAt: Date.now() + CAPTCHA_TTL_MS,
  });

  const imageData = `data:image/svg+xml;base64,${Buffer.from(captcha.data).toString('base64')}`;
  res.status(200).json({ captchaId, imageData, expiresIn: CAPTCHA_TTL_MS });
});

app.post('/api/captcha/verify', (req, res) => {
  const { captchaId, input } = req.body as { captchaId?: string; input?: string };

  if (!captchaId || !input) {
    res.status(400).json({ success: false, reason: 'invalid_payload' });
    return;
  }

  const challenge = captchaStore.get(captchaId);
  if (!challenge) {
    res.status(200).json({ success: false, reason: 'not_found' });
    return;
  }

  if (Date.now() > challenge.expiresAt) {
    captchaStore.delete(captchaId);
    res.status(200).json({ success: false, reason: 'expired' });
    return;
  }

  const success = challenge.text === input.trim().toLowerCase();
  if (success) {
    captchaStore.delete(captchaId);
  }

  res.status(200).json({ success });
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
