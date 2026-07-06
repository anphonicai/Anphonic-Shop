import { ContentLayout } from '../components/ContentLayout';

const NAVY = '#0a1f3d';
const TEAL = '#009689';

export function AboutPage() {
  return (
    <ContentLayout
      eyebrow="About Anphonic"
      title={<>Brands worth <em style={{ color: TEAL }}>knowing.</em></>}
      subtitle="Anphonic Shop is a curated index of independent D2C brands, built for buyers who are tired of sifting through fake discount codes."
    >
      <div className="space-y-8 text-sm md:text-base leading-relaxed" style={{ color: '#4a5f78' }}>
        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: NAVY }}>What we do</h2>
          <p>
            Most "discount code" sites are noise — expired codes, affiliate spam, and brands that
            never agreed to the offer in the first place. Anphonic Shop only lists brands we've
            personally vetted, with codes we've verified are live. If it's on the index, it works.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: NAVY }}>Why it's free to join</h2>
          <p>
            We partner directly with independent brands who want to reach a smaller, more engaged
            audience instead of running broad discount campaigns. You get verified savings, brands
            get customers who actually convert — no ad spend wasted on codes that don't work.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: NAVY }}>Who it's for</h2>
          <p>
            Anphonic Shop is built for people who buy from independent brands on purpose — not
            because an ad followed them around the internet, but because they care about who
            they're buying from and want a fair deal for it.
          </p>
        </section>
      </div>
    </ContentLayout>
  );
}
