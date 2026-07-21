import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { brandRegistry } from '../lib/brandRegistry';

const router = Router();

// 1x1 transparent GIF — served in response to the conversion pixel so the
// <img> tag never shows as broken, even though the script hides it anyway.
const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7',
  'base64'
);

// GET /api/track/click?bid=<brandId>
// Outbound "visit brand" links point here so we log the click before
// bouncing the shopper to the brand's real site. Plain navigation — no CORS involved.
router.get('/click', async (req: Request, res: Response) => {
  const bid = String(req.query.bid ?? '');
  const brand = brandRegistry[bid];

  if (!brand) {
    res.status(404).json({ error: 'Unknown brand' });
    return;
  }

  try {
    await prisma.click.create({ data: { brandId: bid } });
  } catch (err) {
    console.error('Click log error:', err);
  }

  res.redirect(302, brand.website);
});

// GET /api/track/conversion?bid=&code=&oid=&total=&cur=
// Fired by the pixel pasted into the brand's Shopify Order Status page once a
// real order completes. Only records a conversion if the code matches the
// brand's known code, and is idempotent per (brandId, orderId) so a page
// refresh on the thank-you page can't double count.
router.get('/conversion', async (req: Request, res: Response) => {
  const bid = String(req.query.bid ?? '');
  const code = String(req.query.code ?? '');
  const orderId = String(req.query.oid ?? '');
  const total = Number(req.query.total);
  const currency = String(req.query.cur ?? '');

  const brand = brandRegistry[bid];
  const valid = brand && code === brand.code && orderId && Number.isFinite(total) && currency;

  if (valid) {
    try {
      await prisma.conversion.create({
        data: { brandId: bid, orderId, discountCode: code, orderTotal: total, currency },
      });
    } catch (err: any) {
      // Unique constraint violation ([brandId, orderId]) just means we already
      // logged this order — not an error worth surfacing.
      if (err?.code !== 'P2002') {
        console.error('Conversion log error:', err);
      }
    }
  }

  res.set('Content-Type', 'image/gif');
  res.set('Cache-Control', 'no-store');
  // Helmet defaults CORP to same-origin, which would make the browser block this
  // <img> from loading on the brand's Shopify domain — this pixel is meant to be
  // embedded cross-origin, so explicitly opt out.
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  res.send(TRANSPARENT_GIF);
});

export default router;
