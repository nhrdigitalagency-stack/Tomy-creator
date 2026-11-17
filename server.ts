import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { INITIAL_SITE_DATA, type SiteData } from './src/data/siteContent.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || 'c5o9hb8v';
const SANITY_ORG_ID = process.env.SANITY_ORG_ID || 'oh314dkvd';
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN || '';
const SANITY_API_VERSION = '2024-01-01';
const SANITY_DOC_ID = 'tomy-creator-site-data';

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'tomycreator').trim().toLowerCase();
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'tomycreator@gmail.com').trim().toLowerCase();
const ADMIN_SECONDARY_EMAIL = (
  process.env.ADMIN_SECONDARY_EMAIL || 'nhrdigitalagency@gmail.com'
)
  .trim()
  .toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  crypto.createHash('sha256').update(`${SANITY_PROJECT_ID}:${SANITY_ORG_ID}:session`).digest('hex');

const SESSION_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

interface SessionPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

function signSessionToken(payload: SessionPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_SESSION_SECRET)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

function verifySessionToken(token: string): SessionPayload | null {
  if (!token || !token.includes('.')) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, providedSig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', ADMIN_SESSION_SECRET)
    .update(encoded)
    .digest('base64url');

  const providedBuf = Buffer.from(providedSig, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (
    providedBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!parsed.exp || Date.now() > parsed.exp) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function extractBearerToken(req: express.Request): string {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }
  return '';
}

function addSanityKeys<T extends Record<string, unknown>>(items: T[], prefix: string): T[] {
  if (!Array.isArray(items)) return [];
  return items.map((item, idx) => ({
    ...item,
    _key: typeof item._key === 'string' && item._key ? item._key : String(item.id || `${prefix}-${idx}`)
  }));
}

function stripSanityMeta(doc: Record<string, unknown>): SiteData {
  return {
    ...INITIAL_SITE_DATA,
    brand: {
      ...INITIAL_SITE_DATA.brand,
      ...((doc.brand as Record<string, unknown>) || {})
    },
    partnerCompanies: Array.isArray(doc.partnerCompanies)
      ? (doc.partnerCompanies as SiteData['partnerCompanies'])
      : INITIAL_SITE_DATA.partnerCompanies,
    episodes: Array.isArray(doc.episodes)
      ? (doc.episodes as SiteData['episodes'])
      : INITIAL_SITE_DATA.episodes,
    portfolio: Array.isArray(doc.portfolio)
      ? (doc.portfolio as SiteData['portfolio'])
      : INITIAL_SITE_DATA.portfolio,
    services: Array.isArray(doc.services)
      ? (doc.services as SiteData['services'])
      : INITIAL_SITE_DATA.services,
    references: Array.isArray(doc.references)
      ? (doc.references as SiteData['references'])
      : INITIAL_SITE_DATA.references,
    news: Array.isArray(doc.news) ? (doc.news as SiteData['news']) : INITIAL_SITE_DATA.news,
    testimonials: Array.isArray(doc.testimonials)
      ? (doc.testimonials as SiteData['testimonials'])
      : INITIAL_SITE_DATA.testimonials,
    faqs: Array.isArray(doc.faqs) ? (doc.faqs as SiteData['faqs']) : INITIAL_SITE_DATA.faqs,
    shootingRequests: Array.isArray(doc.shootingRequests)
      ? (doc.shootingRequests as SiteData['shootingRequests'])
      : [],
    appointments: Array.isArray(doc.appointments)
      ? (doc.appointments as SiteData['appointments'])
      : []
  };
}

async function fetchSiteDataFromSanity(): Promise<{
  found: boolean;
  updatedAt?: string;
  data: SiteData;
}> {
  const groqQuery = encodeURIComponent(`*[_id == "${SANITY_DOC_ID}"][0]`);
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${groqQuery}`;
  const headers: Record<string, string> = {};
  if (SANITY_API_TOKEN) {
    headers.Authorization = `Bearer ${SANITY_API_TOKEN}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Sanity query error (${response.status}): ${errText}`);
  }
  const payload = (await response.json()) as {
    result: (Record<string, unknown> & { _updatedAt?: string }) | null;
  };
  if (!payload.result) {
    return { found: false, data: INITIAL_SITE_DATA };
  }
  return {
    found: true,
    updatedAt: payload.result._updatedAt || (payload.result.updatedAt as string | undefined),
    data: stripSanityMeta(payload.result)
  };
}

async function saveSiteDataToSanity(
  siteData: SiteData
): Promise<{ transactionId?: string; updatedAt: string }> {
  if (!SANITY_API_TOKEN) {
    throw new Error('SANITY_API_TOKEN is missing on the server.');
  }

  const nowIso = new Date().toISOString();
  const sanityDoc = {
    _id: SANITY_DOC_ID,
    _type: 'tomySiteConfig',
    updatedAt: nowIso,
    brand: siteData.brand,
    partnerCompanies: addSanityKeys(siteData.partnerCompanies as unknown as Record<string, unknown>[], 'partner'),
    episodes: addSanityKeys(siteData.episodes as unknown as Record<string, unknown>[], 'ep'),
    portfolio: addSanityKeys(siteData.portfolio as unknown as Record<string, unknown>[], 'pf'),
    services: addSanityKeys(siteData.services as unknown as Record<string, unknown>[], 'srv'),
    references: addSanityKeys(siteData.references as unknown as Record<string, unknown>[], 'ref'),
    news: addSanityKeys(siteData.news as unknown as Record<string, unknown>[], 'news'),
    testimonials: addSanityKeys(siteData.testimonials as unknown as Record<string, unknown>[], 'testi'),
    faqs: addSanityKeys(siteData.faqs as unknown as Record<string, unknown>[], 'faq'),
    shootingRequests: addSanityKeys(
      (siteData.shootingRequests || []) as unknown as Record<string, unknown>[],
      'req'
    ),
    appointments: addSanityKeys(
      (siteData.appointments || []) as unknown as Record<string, unknown>[],
      'apt'
    )
  };

  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SANITY_API_TOKEN}`
    },
    body: JSON.stringify({
      mutations: [{ createOrReplace: sanityDoc }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Sanity mutate error (${response.status}): ${errText}`);
  }

  const result = (await response.json()) as { transactionId?: string };
  return {
    transactionId: result.transactionId,
    updatedAt: nowIso
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      sanityConfigured: Boolean(SANITY_PROJECT_ID && SANITY_API_TOKEN),
      projectId: SANITY_PROJECT_ID,
      orgId: SANITY_ORG_ID,
      dataset: SANITY_DATASET,
      adminConfigured: Boolean(ADMIN_PASSWORD)
    });
  });

  // Load site data from Sanity (auto-seeds on first run if Sanity document does not exist yet)
  app.get('/api/sanity/site-data', async (_req, res) => {
    try {
      const fetched = await fetchSiteDataFromSanity();
      if (!fetched.found && SANITY_API_TOKEN) {
        const seeded = await saveSiteDataToSanity(INITIAL_SITE_DATA);
        res.json({
          source: 'sanity-seeded',
          projectId: SANITY_PROJECT_ID,
          dataset: SANITY_DATASET,
          updatedAt: seeded.updatedAt,
          data: INITIAL_SITE_DATA
        });
        return;
      }
      res.json({
        source: fetched.found ? 'sanity' : 'fallback',
        projectId: SANITY_PROJECT_ID,
        dataset: SANITY_DATASET,
        updatedAt: fetched.updatedAt || new Date().toISOString(),
        data: fetched.data
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sanity read failed';
      console.error('[Sanity GET error]', message);
      res.json({
        source: 'fallback',
        projectId: SANITY_PROJECT_ID,
        dataset: SANITY_DATASET,
        error: message,
        data: INITIAL_SITE_DATA
      });
    }
  });

  // Admin authentication endpoint
  app.post('/api/admin/login', (req, res) => {
    if (!ADMIN_PASSWORD) {
      res.status(503).json({
        ok: false,
        error: 'Authentification administrateur non configurée sur le serveur (ADMIN_PASSWORD manquant).'
      });
      return;
    }

    const body = req.body as { identifier?: string; password?: string };
    const identifier = String(body.identifier || '').trim().toLowerCase();
    const password = String(body.password || '');

    const validIdentifiers = [ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_SECONDARY_EMAIL].filter(Boolean);
    const identifierMatches = validIdentifiers.includes(identifier);

    const passwordBuf = Buffer.from(password, 'utf8');
    const expectedBuf = Buffer.from(ADMIN_PASSWORD, 'utf8');
    const passwordMatches =
      passwordBuf.length === expectedBuf.length &&
      crypto.timingSafeEqual(passwordBuf, expectedBuf);

    if (!identifierMatches || !passwordMatches) {
      res.status(401).json({
        ok: false,
        error: 'Identifiant (username/email) ou mot de passe incorrect.'
      });
      return;
    }

    const expiresAt = Date.now() + SESSION_TTL_MS;
    const token = signSessionToken({
      sub: ADMIN_USERNAME,
      email: identifier.includes('@') ? identifier : ADMIN_EMAIL,
      role: 'admin',
      exp: expiresAt
    });

    res.json({
      ok: true,
      token,
      expiresAt,
      user: {
        username: ADMIN_USERNAME,
        email: identifier.includes('@') ? identifier : ADMIN_EMAIL,
        role: 'admin'
      }
    });
  });

  app.get('/api/admin/session', (req, res) => {
    const token = extractBearerToken(req);
    const session = verifySessionToken(token);
    if (!session) {
      res.status(401).json({ authenticated: false });
      return;
    }
    res.json({
      authenticated: true,
      user: {
        username: session.sub,
        email: session.email,
        role: session.role
      }
    });
  });

  // Save updated SiteData to Sanity (Protected)
  app.put('/api/sanity/site-data', async (req, res) => {
    const token = extractBearerToken(req);
    const session = verifySessionToken(token);
    if (!session) {
      res.status(401).json({ ok: false, error: 'Session expirée ou non autorisée.' });
      return;
    }

    try {
      const payload = req.body as { data?: SiteData };
      if (!payload?.data || !payload.data.brand) {
        res.status(400).json({ ok: false, error: 'Données du site invalides.' });
        return;
      }

      const result = await saveSiteDataToSanity(payload.data);
      res.json({
        ok: true,
        projectId: SANITY_PROJECT_ID,
        dataset: SANITY_DATASET,
        updatedAt: result.updatedAt,
        transactionId: result.transactionId
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de sauvegarde Sanity';
      console.error('[Sanity PUT error]', message);
      res.status(500).json({ ok: false, error: message });
    }
  });

  // Upload Image or Video binary directly to Sanity Assets CDN (Protected)
  app.post('/api/sanity/upload-media', async (req, res) => {
    const token = extractBearerToken(req);
    const session = verifySessionToken(token);
    if (!session) {
      res.status(401).json({ ok: false, error: 'Session expirée ou non autorisée.' });
      return;
    }

    if (!SANITY_API_TOKEN) {
      res.status(503).json({ ok: false, error: 'Token Sanity manquant sur le serveur.' });
      return;
    }

    try {
      const body = req.body as {
        filename?: string;
        mimeType?: string;
        base64Data?: string;
        mediaKind?: 'image' | 'file';
      };

      if (!body.base64Data) {
        res.status(400).json({ ok: false, error: 'Fichier manquant.' });
        return;
      }

      const rawBase64 = body.base64Data.includes(',')
        ? body.base64Data.split(',')[1]
        : body.base64Data;
      const buffer = Buffer.from(rawBase64, 'base64');
      const mimeType = body.mimeType || 'application/octet-stream';
      const assetKind =
        body.mediaKind === 'image' || mimeType.startsWith('image/') ? 'images' : 'files';
      const safeName = encodeURIComponent(body.filename || `media-${Date.now()}`);

      const uploadUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/assets/${assetKind}/${SANITY_DATASET}?filename=${safeName}`;
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': mimeType,
          Authorization: `Bearer ${SANITY_API_TOKEN}`
        },
        body: buffer
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`Sanity asset upload error (${uploadRes.status}): ${errText}`);
      }

      const uploadJson = (await uploadRes.json()) as {
        document?: {
          _id?: string;
          url?: string;
          originalFilename?: string;
          size?: number;
        };
      };

      res.json({
        ok: true,
        url: uploadJson.document?.url || '',
        assetId: uploadJson.document?._id || '',
        originalFilename: uploadJson.document?.originalFilename || body.filename,
        size: uploadJson.document?.size || buffer.length
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Échec de téléversement vers Sanity';
      console.error('[Sanity Upload error]', message);
      res.status(500).json({ ok: false, error: message });
    }
  });

  // Public endpoint to persist client Shooting Requests & Appointment Bookings into Sanity
  app.post('/api/public/inquiry', async (req, res) => {
    try {
      const body = req.body as {
        type: 'shootingRequest' | 'appointment';
        entry: Record<string, unknown>;
      };

      if (!body?.type || !body?.entry) {
        res.status(400).json({ ok: false, error: 'Requête incomplète.' });
        return;
      }

      const current = await fetchSiteDataFromSanity();
      const updated: SiteData = {
        ...current.data,
        shootingRequests:
          body.type === 'shootingRequest'
            ? [body.entry as unknown as SiteData['shootingRequests'][number], ...(current.data.shootingRequests || [])]
            : current.data.shootingRequests || [],
        appointments:
          body.type === 'appointment'
            ? [body.entry as unknown as SiteData['appointments'][number], ...(current.data.appointments || [])]
            : current.data.appointments || []
      };

      if (SANITY_API_TOKEN) {
        const saved = await saveSiteDataToSanity(updated);
        res.json({ ok: true, updatedAt: saved.updatedAt });
        return;
      }

      res.json({ ok: true, localOnly: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur d’enregistrement';
      console.error('[Public Inquiry error]', message);
      res.status(500).json({ ok: false, error: message });
    }
  });

  // Dynamic SEO endpoints (robots.txt & sitemap.xml resolved to live origin / APP_URL)
  const resolveOrigin = (req: express.Request): string => {
    const envUrl = (process.env.APP_URL || '').trim().replace(/\/+$/, '');
    if (envUrl && !envUrl.includes('MY_APP_URL')) return envUrl;
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
    const host = req.headers.host || 'localhost:3000';
    return `${proto}://${host}`;
  };

  app.get('/robots.txt', (req, res) => {
    const origin = resolveOrigin(req);
    res.type('text/plain');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`);
  });

  app.get('/sitemap.xml', (req, res) => {
    const origin = resolveOrigin(req);
    const today = new Date().toISOString().split('T')[0];
    const routes = [
      { path: '/', priority: '1.0', changefreq: 'weekly' },
      { path: '/237-cinematique', priority: '0.9', changefreq: 'weekly' },
      { path: '/portfolio', priority: '0.9', changefreq: 'weekly' },
      { path: '/prestations', priority: '0.8', changefreq: 'monthly' },
      { path: '/tournage', priority: '0.8', changefreq: 'monthly' },
      { path: '/actualites', priority: '0.7', changefreq: 'weekly' }
    ];
    const urlsXml = routes
      .map(
        (r) =>
          `  <url>\n    <loc>${origin}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
      )
      .join('\n');

    res.type('application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>\n`
    );
  });

  // Rewrites OpenGraph / WhatsApp preview tags in raw SSR HTML so non-JS crawlers (WhatsApp, X, Facebook)
  // always receive the live HTTPS host, crisp TC logo (/og-logo-tc.jpg), and up-to-date description.
  const injectDynamicHtmlSeo = async (rawHtml: string, req: express.Request): Promise<string> => {
    const origin = resolveOrigin(req);
    const reqPath = (req.originalUrl || '/').split('?')[0] || '/';
    const canonicalUrl = `${origin}${reqPath === '/' ? '/' : reqPath}`;
    let ogImageUrl = `${origin}/og-logo-tc.jpg`;

    try {
      const cached = await fetchSiteDataFromSanity();
      const customLogo = cached?.data?.brand?.logoUrl;
      if (customLogo && customLogo.startsWith('http')) {
        ogImageUrl = customLogo;
      }
    } catch {
      // Keep default optimized /og-logo-tc.jpg
    }

    return rawHtml
      .replaceAll('https://ais-pre-xjilhi3dvoeq4piieichav-323022168140.europe-west2.run.app/og-logo-tc.jpg', ogImageUrl)
      .replace(
        /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
        `<link rel="canonical" href="${canonicalUrl}" />`
      )
      .replace(
        /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:url" content="${canonicalUrl}" />`
      );
  };

  // Vite dev middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });

    app.use(async (req, res, next) => {
      const url = req.originalUrl || '/';
      const cleanPath = url.split('?')[0];
      const isViteOrStatic =
        cleanPath.startsWith('/api/') ||
        cleanPath.startsWith('/@') ||
        cleanPath.startsWith('/src/') ||
        cleanPath.startsWith('/node_modules/') ||
        cleanPath.startsWith('/assets/') ||
        /\.[a-zA-Z0-9]+$/.test(cleanPath);

      if (req.method !== 'GET' || isViteOrStatic) {
        next();
        return;
      }

      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await injectDynamicHtmlSeo(template, req);
        const transformed = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformed);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(
      express.static(distPath, {
        index: false,
        maxAge: '7d',
        etag: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          }
        }
      })
    );
    app.get('*', async (req, res) => {
      const indexHtml = path.join(distPath, 'index.html');
      if (fs.existsSync(indexHtml)) {
        const raw = fs.readFileSync(indexHtml, 'utf-8');
        const hydrated = await injectDynamicHtmlSeo(raw, req);
        res.status(200).set({ 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' }).send(hydrated);
      } else {
        res.status(404).send('Build not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Tomy Creator server running on http://0.0.0.0:${PORT} (Sanity project: ${SANITY_PROJECT_ID}/${SANITY_DATASET})`
    );
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
