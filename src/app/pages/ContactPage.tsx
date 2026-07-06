import { Link } from 'react-router';
import { Mail, Building2 } from 'lucide-react';
import { ContentLayout } from '../components/ContentLayout';

const NAVY = '#0a1f3d';
const TEAL = '#009689';
const SUPPORT_EMAIL = 'merchants@anphonic.ai';

export function ContactPage() {
  return (
    <ContentLayout
      eyebrow="Contact"
      title={<>We'd love to <em style={{ color: TEAL }}>hear from you.</em></>}
      subtitle="Questions about an offer, a partnership, or something else entirely — here's how to reach us."
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="flex flex-col gap-3 p-6 rounded-2xl bg-white border transition-all duration-200"
          style={{ borderColor: 'rgba(10,31,61,0.08)', boxShadow: '0 4px 20px rgba(10,31,61,0.05)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(10,31,61,0.1)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(10,31,61,0.05)'; }}
        >
          <div className="size-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${TEAL}12` }}>
            <Mail className="size-5" style={{ color: TEAL }} />
          </div>
          <div>
            <h3 className="text-base font-semibold mb-1" style={{ color: NAVY }}>General enquiries</h3>
            <p className="text-sm" style={{ color: '#5a7a9a' }}>{SUPPORT_EMAIL}</p>
          </div>
        </a>

        <Link
          to="/submit-a-brand"
          className="flex flex-col gap-3 p-6 rounded-2xl bg-white border transition-all duration-200"
          style={{ borderColor: 'rgba(10,31,61,0.08)', boxShadow: '0 4px 20px rgba(10,31,61,0.05)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(10,31,61,0.1)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(10,31,61,0.05)'; }}
        >
          <div className="size-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${TEAL}12` }}>
            <Building2 className="size-5" style={{ color: TEAL }} />
          </div>
          <div>
            <h3 className="text-base font-semibold mb-1" style={{ color: NAVY }}>Are you a brand?</h3>
            <p className="text-sm" style={{ color: '#5a7a9a' }}>Submit your brand for consideration →</p>
          </div>
        </Link>
      </div>

      <p className="text-sm mt-8" style={{ color: '#5a7a9a' }}>
        We typically reply within 2-3 business days.
      </p>
    </ContentLayout>
  );
}
