import { ContentLayout } from '../components/ContentLayout';
import { UserPlus, LayoutGrid, KeyRound, ShoppingBag } from 'lucide-react';

const NAVY = '#0a1f3d';
const TEAL = '#009689';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Tell us a little about yourself',
    body: "A few quick details — your name, contact info, and the categories you're into. It takes under a minute and unlocks the full index.",
  },
  {
    icon: LayoutGrid,
    title: 'Browse the index',
    body: 'Explore hand-picked D2C brands across food, wellness, accessories, and more — every one of them checked before it goes live.',
  },
  {
    icon: KeyRound,
    title: 'Reveal your code',
    body: "Click into any brand to reveal its exclusive discount code — no clipping, no expired coupons, no catch.",
  },
  {
    icon: ShoppingBag,
    title: 'Shop and save',
    body: 'Use the code directly at checkout on the brand’s own site. Simple as that.',
  },
];

export function HowItWorksPage() {
  return (
    <ContentLayout
      eyebrow="How it works"
      title={<>Four steps to <em style={{ color: TEAL }}>verified savings.</em></>}
      subtitle="No subscriptions, no browser extensions, no spam. Just a curated list of brands and codes that actually work."
    >
      <div className="space-y-6">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="flex gap-5 p-6 rounded-2xl bg-white border"
            style={{ borderColor: 'rgba(10,31,61,0.08)', boxShadow: '0 4px 20px rgba(10,31,61,0.05)' }}
          >
            <div
              className="shrink-0 size-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${TEAL}12` }}
            >
              <step.icon className="size-5" style={{ color: TEAL }} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: TEAL }}>
                Step {i + 1}
              </p>
              <h3 className="text-lg font-semibold mb-1.5" style={{ color: NAVY }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5a7a9a' }}>{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </ContentLayout>
  );
}
