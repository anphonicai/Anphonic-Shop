import { ContentLayout } from '../components/ContentLayout';

const NAVY = '#0a1f3d';
const TEAL = '#009689';
const CONTACT_EMAIL = 'merchants@anphonic.ai';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-3" style={{ color: NAVY }}>{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#4a5f78' }}>
        {children}
      </div>
    </section>
  );
}

export function TermsPage() {
  return (
    <ContentLayout
      eyebrow="Legal"
      title={<>Terms & <em style={{ color: TEAL }}>Conditions.</em></>}
      subtitle="Last updated: July 2026. The rules for using Anphonic Shop."
    >
      <Section title="Using the site">
        <p>
          Anphonic Shop is a free index of discount codes from independent brands. Access requires
          submitting a few details about yourself via our signup form. You agree to provide
          accurate information and to use the site for personal, non-commercial purposes only.
        </p>
      </Section>

      <Section title="Discount codes">
        <p>
          We verify that each code is live at the time it's added to the index, but codes are
          issued and honoured by the individual brands, not by Anphonic Shop. Expiry dates,
          exclusions, and redemption terms are set by each brand and are outside our control.
        </p>
      </Section>

      <Section title="No warranty">
        <p>
          The site and its contents are provided "as is." We don't guarantee that any given code
          will remain valid, that a brand will honour a discount without exception, or that the
          index is free of errors. We work to keep it accurate, but we can't promise perfection.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p>
          Anphonic Shop is not liable for any loss arising from your use of a brand's discount
          code, your purchase from a listed brand, or your reliance on information in the index.
          Any dispute over a purchase is between you and the brand.
        </p>
      </Section>

      <Section title="Intellectual property">
        <p>
          Brand names, logos, and marks shown in the index belong to their respective owners and
          are used to identify participating brands, not to imply endorsement beyond the listed
          partnership.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          We may update these terms as the site evolves. Continued use after a change means you
          accept the updated terms.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms? Reach us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: TEAL }}>{CONTACT_EMAIL}</a>.
        </p>
      </Section>
    </ContentLayout>
  );
}
