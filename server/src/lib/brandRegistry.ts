// Server-side allowlist for the tracking pixel/redirect — mirrors src/app/data/brands.ts.
// Keep in sync manually: frontend and backend are separate deployables with no shared package.
// The redirect destination and expected coupon code are only ever read from here, never from
// the request, so /api/track/click can't be used as an open redirect and /api/track/conversion
// can't be spoofed with an arbitrary code.
export const brandRegistry: Record<string, { code: string; website: string }> = {
  caramelly: {
    code: 'Anphonic2K',
    website: 'https://caramelly.in/products/caramelly-latte-touch-coffee-machine-with-precision-grinding-and-touchscreen',
  },
  'dhaaga-life': {
    code: 'DLJULY20',
    website: 'https://dhaagalife.com/',
  },
  'nabhi-sutra': {
    code: 'APS20',
    website: 'https://nabhisutra.com/pages/copper-stem-water-enhancer-a-gift-of-wellness',
  },
  nipura: {
    code: 'FIRSTSHOP10',
    website: 'https://nipura.in/collections/b2g2sale',
  },
  oregion: {
    code: 'ORIGIN',
    website: 'https://oregion.in/collections/bestseller-products',
  },
  'urban-platter': {
    code: 'ANPHONIC',
    website: 'https://urbanplatter.com/',
  },
  'dhampur-green': {
    code: 'MS10',
    website: 'https://www.dhampurgreen.com/collections/mocktails-syrups?srsltid=AfmBOoqkIWQeJ3quo_tAt2zhQDYYWM8_5LtENhCJlLC4rIkN_HY31ksU',
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
    code: 'BUBZZIN15',
    website: 'https://drinkbubz.com/products/bubz-singles-pack-multi-flavor',
  },
  keos: {
    code: 'HELLO20',
    website: 'https://keos.life/collections/new-arrivals',
  },
  relow: {
    code: '3W31D',
    website: 'https://www.drinkrelow.com/',
  },
  // Elver has two selectable offers (see src/app/data/brands.ts `offers`) —
  // each gets its own tracking key so clicks/conversions can be attributed
  // to the right one. "elver" itself is only used by the generic "visit
  // site" links on the brand page, not the offer-reveal flow.
  elver: {
    code: 'ANPN499',
    website: 'https://elver.in/',
  },
  'elver-499': {
    code: 'ANPN499',
    website: 'https://elver.in/products/elver-buds-nova-tws-earbuds-with-upto-40h-playback?utm_source=anphonic&utm_campaign=anp_aug_499',
  },
  'elver-75': {
    code: 'ANPEL75',
    website: 'https://elver.in/pages/elver75?utm_source=anphonic&utm_campaign=anp_aug_75',
  },
};
