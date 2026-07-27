// Server-side allowlist for the tracking pixel/redirect — mirrors src/app/data/brands.ts.
// Keep in sync manually: frontend and backend are separate deployables with no shared package.
// The redirect destination and expected coupon code are only ever read from here, never from
// the request, so /api/track/click can't be used as an open redirect and /api/track/conversion
// can't be spoofed with an arbitrary code.
export const brandRegistry: Record<string, { code: string; website: string }> = {
  caramelly: {
    code: 'LATTE2K',
    website: 'https://caramelly.in/products/caramelly-latte-touch-coffee-machine-with-precision-grinding-and-touchscreen',
  },
  'dhaaga-life': {
    code: 'DLJULY20',
    website: 'https://dhaagalife.com/',
  },
  'nabhi-sutra': {
    code: 'APS20',
    website: 'https://nabhisutra.com/',
  },
  nipura: {
    code: 'FIRSTSHOP10',
    website: 'https://nipura.in/',
  },
  oregion: {
    code: 'ORIGIN',
    website: 'https://oregion.in/',
  },
  'urban-platter': {
    code: 'ANPHONIC',
    website: 'https://urbanplatter.com/',
  },
  'dhampur-green': {
    code: 'MS10',
    website: 'https://www.dhampurgreen.com/',
  },
  kekaa: {
    code: 'KEKAABOGO',
    website: 'https://www.kekaa.co/',
  },
  'little-rituals': {
    code: 'LRANPHONIC20',
    website: 'https://littlerituals.in/',
  },
  bubz: {
    code: 'BUBZZIN10',
    website: 'https://drinkbubz.com/',
  },
  keos: {
    code: 'KEOSFLASH20',
    website: 'https://keos.life/',
  },
};
