// Prints the Shopify Order Status page snippet for a given brand id.
// Usage: npx tsx scripts/generate-pixel-snippet.ts <brand-id>
import { brandRegistry } from '../src/lib/brandRegistry';

const brandId = process.argv[2];
const apiDomain = process.argv[3] ?? '<your-api-domain>';

if (!brandId || !brandRegistry[brandId]) {
  console.error(`Unknown brand id "${brandId}". Known ids: ${Object.keys(brandRegistry).join(', ')}`);
  process.exit(1);
}

const { code } = brandRegistry[brandId];

const snippet = `<script>
  (function() {
    var codes = {{ order.discount_codes | map: 'code' | json }};
    var expectedCode = "${code}";
    if (codes.indexOf(expectedCode) === -1) return;
    var params = new URLSearchParams({
      bid: "${brandId}",
      code: expectedCode,
      oid: "{{ order.order_number }}",
      total: "{{ order.total_price | money_without_currency | remove: ',' }}",
      cur: "{{ order.currency }}"
    });
    new Image().src = "https://${apiDomain}/api/track/conversion?" + params.toString();
  })();
</script>`;

console.log(`\nPaste into Shopify Admin → Settings → Checkout → Order status page → Additional scripts:\n`);
console.log(snippet);
console.log('');
