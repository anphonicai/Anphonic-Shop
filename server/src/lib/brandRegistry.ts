// Server-side allowlist for the tracking pixel/redirect — mirrors src/app/data/brands.ts.
// Keep in sync manually: frontend and backend are separate deployables with no shared package.
// The redirect destination and expected coupon code are only ever read from here, never from
// the request, so /api/track/click can't be used as an open redirect and /api/track/conversion
// can't be spoofed with an arbitrary code.
export const brandRegistry: Record<string, { code: string; website: string }> = {
  'nabhi-sutra': {
    code: 'APS20',
    website: 'https://nabhisutra.com/pages/copper-stem-water-enhancer-a-gift-of-wellness',
  },
};
