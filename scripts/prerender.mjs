// Runs after `vite build`. Generates dist/sitemap.xml and static crawler-only
// snapshots of the gated SPA routes under dist/_prerendered/**, so nginx can
// serve real content to search/social bots without touching the client-side
// lead-gate that real visitors go through. See deploy/README.md.
import { build as esbuildBuild } from 'esbuild';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { writeFile, mkdir, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const TMP = path.join(DIST, '.prerender-tmp');
const SITE_URL = 'https://www.anphonic.shop';
const PORT = 4173;

const STATIC_ROUTES = [
  '/about',
  '/how-it-works',
  '/submit-a-brand',
  '/contact',
  '/privacy',
  '/terms',
];

async function compileToModule(relSourcePath, tmpName) {
  const entry = path.join(ROOT, relSourcePath);
  const result = await esbuildBuild({
    entryPoints: [entry],
    bundle: false,
    format: 'esm',
    write: false,
    logLevel: 'silent',
  });
  const outFile = path.join(TMP, tmpName);
  await writeFile(outFile, result.outputFiles[0].text);
  return import(pathToFileURL(outFile).href);
}

function routeToFilePath(route) {
  const clean = route === '/' ? '/index' : `${route}/index`;
  return path.join(DIST, '_prerendered', `${clean}.html`);
}

async function writeSitemap(brandIds) {
  const routes = [
    '/',
    '/brands',
    ...STATIC_ROUTES,
    ...brandIds.map(id => `/brand/${id}`),
  ];
  const urls = routes
    .map(route => `  <url><loc>${SITE_URL}${route}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(path.join(DIST, 'sitemap.xml'), xml);
  console.log(`[prerender] wrote sitemap.xml with ${routes.length} URLs`);
}

function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url);
        if (res.ok || res.status === 404) return resolve();
      } catch {
        // not up yet
      }
      if (Date.now() - start > timeoutMs) {
        return reject(new Error(`Preview server did not come up at ${url}`));
      }
      setTimeout(tick, 300);
    };
    tick();
  });
}

async function main() {
  await mkdir(TMP, { recursive: true });

  const { brands } = await compileToModule('src/app/data/brands.ts', 'brands.mjs');
  const { LEAD_SUBMITTED_KEY } = await compileToModule('src/lib/leadGate.ts', 'leadGate.mjs');

  await writeSitemap(brands.map(b => b.id));

  const previewServer = spawn(
    'npx',
    ['vite', 'preview', '--outDir', 'dist', '--port', String(PORT), '--strictPort'],
    { cwd: ROOT, stdio: 'pipe' }
  );
  previewServer.stderr.on('data', d => process.stderr.write(`[vite preview] ${d}`));

  const baseUrl = `http://localhost:${PORT}`;
  const fallbackHtml = await readFile(path.join(DIST, 'index.html'), 'utf8');

  try {
    await waitForServer(baseUrl);

    const browser = await chromium.launch();
    const context = await browser.newContext();
    await context.addInitScript(
      ([key]) => window.localStorage.setItem(key, '1'),
      [LEAD_SUBMITTED_KEY]
    );

    const snapshot = async (route, { brand } = {}) => {
      const page = await context.newPage();
      try {
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(400);

        if (brand) {
          const url = `${SITE_URL}/brand/${brand.id}`;
          const description = brand.description.slice(0, 155);
          await page.evaluate(
            ({ name, description, url }) => {
              document.title = `${name} Discount Code & Coupon | Anphonic Shop`;
              const setMeta = (sel, attr, val) => {
                const el = document.querySelector(sel);
                if (el) el.setAttribute(attr, val);
              };
              setMeta('meta[name="description"]', 'content', description);
              setMeta('link[rel="canonical"]', 'href', url);
              setMeta('meta[property="og:title"]', 'content', `${name} Discount Code | Anphonic Shop`);
              setMeta('meta[property="og:description"]', 'content', description);
              setMeta('meta[property="og:url"]', 'content', url);
              setMeta('meta[name="twitter:title"]', 'content', `${name} Discount Code | Anphonic Shop`);
              setMeta('meta[name="twitter:description"]', 'content', description);
            },
            { name: brand.name, description, url }
          );
        }

        const html = await page.content();
        const outPath = routeToFilePath(route);
        await mkdir(path.dirname(outPath), { recursive: true });
        await writeFile(outPath, html);
        console.log(`[prerender] snapshot ${route} -> ${path.relative(DIST, outPath)}`);
      } finally {
        await page.close();
      }
    };

    // Required routes — a failure here fails the whole build.
    await snapshot('/');
    await snapshot('/brands');
    for (const route of STATIC_ROUTES) {
      await snapshot(route);
    }

    // Per-brand routes — a single brand failing shouldn't fail the build;
    // fall back to the plain SPA shell so nginx's rewrite target always exists.
    for (const brand of brands) {
      const route = `/brand/${brand.id}`;
      try {
        await snapshot(route, { brand });
      } catch (err) {
        console.warn(`[prerender] snapshot failed for ${route}, falling back to shell:`, err.message);
        const outPath = routeToFilePath(route);
        await mkdir(path.dirname(outPath), { recursive: true });
        await writeFile(outPath, fallbackHtml);
      }
    }

    await context.close();
    await browser.close();
  } finally {
    previewServer.kill();
    await rm(TMP, { recursive: true, force: true });
  }

  console.log('[prerender] done');
  process.exit(0);
}

main().catch(err => {
  console.error('[prerender] fatal error:', err);
  process.exit(1);
});
