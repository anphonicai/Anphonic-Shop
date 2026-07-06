import type { ReactNode } from 'react';
import { AppNavbar } from './AppNavbar';
import { TapedFooter } from './ui/footer-taped-design';

const NAVY = '#0a1f3d';
const TEAL = '#009689';

export function ContentLayout({
  eyebrow, title, subtitle, children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f6f9', fontFamily: "'DM Sans', sans-serif" }}>
      <AppNavbar />

      <main className="pt-16">
        <div
          className="relative overflow-hidden"
          style={{ backgroundColor: '#fff', borderBottom: '1px solid rgba(10,31,61,0.07)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(10,31,61,0.06) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="relative max-w-3xl mx-auto px-6 md:px-10 py-14 md:py-20">
            <p className="text-[10px] uppercase tracking-[0.35em] font-semibold mb-4" style={{ color: TEAL }}>
              {eyebrow}
            </p>
            <h1
              className="text-4xl md:text-5xl font-light leading-tight mb-4"
              style={{ color: NAVY, fontFamily: "'Fraunces', serif" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-base max-w-xl" style={{ color: '#5a7a9a' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 md:px-10 py-12 md:py-16">
          {children}
        </div>
      </main>

      <TapedFooter />
    </div>
  );
}
