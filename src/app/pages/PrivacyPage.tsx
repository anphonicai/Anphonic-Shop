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

export function PrivacyPage() {
  return (
    <ContentLayout
      eyebrow="Legal"
      title={<>Privacy <em style={{ color: TEAL }}>Policy.</em></>}
      subtitle="Last updated: July 2026. This explains what we collect, why, and how you can control it."
    >
      <Section title="What we collect">
        <p>When you sign up for Anphonic Shop, we collect:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Your name, email address, and phone number</li>
          <li>Age group, gender, city, and country</li>
          <li>The brand categories you tell us you're interested in</li>
        </ul>
        <p>
          We also use Microsoft Clarity to understand how the site is used — this records
          anonymized session activity (clicks, scrolling, page views) and does not capture the
          contents of the signup form fields themselves.
        </p>
      </Section>

      <Section title="Why we collect it">
        <p>
          We use your details to unlock the brand index, personalise which offers we surface to
          you, and — only with your explicit consent — to contact you about relevant offers via
          email, SMS, or WhatsApp. We use aggregated, anonymized analytics to understand which
          parts of the site work well and which don't.
        </p>
      </Section>

      <Section title="Consent">
        <p>
          We only contact you about offers if you've explicitly opted in via the checkbox on our
          signup form. You have not agreed to anything by simply browsing the site.
        </p>
      </Section>

      <Section title="How we store it">
        <p>
          Your details are stored in a managed database hosted on Google Cloud, with automated
          daily backups and encryption in transit (HTTPS) and at rest. We do not sell your data to
          third parties.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          You can ask us to access, correct, or delete your data at any time by emailing{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: TEAL }}>{CONTACT_EMAIL}</a>. We'll
          action requests within a reasonable timeframe.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this policy? Reach us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: TEAL }}>{CONTACT_EMAIL}</a>.
        </p>
      </Section>

      <p className="text-xs mt-10" style={{ color: '#8698ad' }}>
        This policy is a plain-language summary of our data practices and is not a substitute for
        formal legal advice specific to your jurisdiction.
      </p>
    </ContentLayout>
  );
}
