import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnphonicLogo } from './AnphonicLogo';

gsap.registerPlugin(ScrollTrigger);

const NAVY = '#0a1f3d';
const TEAL = '#009689';

export function Footer() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current!.querySelectorAll('.footer-col'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 88%', once: true },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer id="about" ref={rootRef} style={{ backgroundColor: NAVY }}>
      {/* Teal top accent */}
      <div className="h-0.5" style={{ backgroundColor: TEAL }} />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand col */}
          <div className="footer-col md:col-span-2">
            <AnphonicLogo className="h-12 w-auto mb-6" inkColor="#ffffff" />
            <p className="text-sm leading-relaxed max-w-xs mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
              A quiet index of D2C brands worth your money. Curated, verified, and re-verified every week.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full block" style={{ backgroundColor: TEAL }} />
              <span className="text-xs uppercase tracking-wider font-medium" style={{ color: TEAL }}>
                All codes verified · June 2026
              </span>
            </div>
          </div>

          {/* Index links */}
          <div className="footer-col">
            <h4 className="text-[11px] uppercase tracking-[0.25em] font-medium mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Index
            </h4>
            <ul className="space-y-3">
              {['All Brands', 'Skincare', 'Fashion', 'Wellness', 'Coffee', 'Footwear'].map(link => (
                <li key={link}>
                  <a
                    href="#index"
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Anphonic links */}
          <div className="footer-col">
            <h4 className="text-[11px] uppercase tracking-[0.25em] font-medium mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Anphonic
            </h4>
            <ul className="space-y-3">
              {['About', 'How It Works', 'Submit a Brand', 'Contact', 'Privacy'].map(link => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="pt-8 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <span className="text-xs uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Anphonic Shop · Vol. 01 / 2026
          </span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Updated weekly. Codes verified at time of publication.
          </span>
        </div>
      </div>
    </footer>
  );
}
