import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lock, ChevronRight } from 'lucide-react';
import { brands, categories } from '../data/brands';
import { BrandCard } from './BrandCard';

gsap.registerPlugin(ScrollTrigger);

const NAVY = '#0a1f3d';
const TEAL = '#009689';

const scrollToForm = () => {
  document.getElementById('get-codes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export function BrandIndex() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? brands
      : brands.filter((b) => b.category === activeCategory);

  const countFor = (cat: string) =>
    (cat === 'All' ? brands.length : brands.filter((b) => b.category === cat).length)
      .toString()
      .padStart(2, '0');

  useEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current!.querySelectorAll('.reveal-line'),
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="index"
      className="relative border-b overflow-hidden"
      style={{ backgroundColor: '#fff', borderColor: 'rgba(10,31,61,0.08)' }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${NAVY}18 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* ── Header ── */}
      <div ref={headerRef} className="relative">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="overflow-hidden">
              <p
                className="reveal-line text-[11px] uppercase tracking-[0.3em] mb-4 font-medium"
                style={{ color: TEAL }}
              >
                The Index
              </p>
              <h2
                className="reveal-line text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05]"
                style={{ color: NAVY, fontFamily: "'Fraunces', serif" }}
              >
                All brands,
                <br />
                <em style={{ color: TEAL }}>sharply</em> filtered.
              </h2>
            </div>
            <div className="reveal-line max-w-xs">
              <div className="w-8 h-0.5 mb-4" style={{ backgroundColor: TEAL }} />
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#5a7a9a' }}>
                We verify every code, every week. If something feels off, the brand gets
                pulled. No exceptions.
              </p>
              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-white px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: TEAL }}
              >
                <Lock className="size-3" /> Unlock your codes <ChevronRight className="size-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category filter ── */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase rounded-full border transition-all duration-200"
              style={
                activeCategory === cat
                  ? { backgroundColor: NAVY, borderColor: NAVY, color: '#fff' }
                  : {
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(10,31,61,0.15)',
                      color: '#5a7a9a',
                    }
              }
              onMouseEnter={(e) => {
                if (activeCategory !== cat) {
                  e.currentTarget.style.borderColor = `${NAVY}40`;
                  e.currentTarget.style.color = NAVY;
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== cat) {
                  e.currentTarget.style.borderColor = 'rgba(10,31,61,0.15)';
                  e.currentTarget.style.color = '#5a7a9a';
                }
              }}
            >
              {cat}
              <span
                className="font-mono text-[10px]"
                style={{ opacity: activeCategory === cat ? 0.5 : 0.4 }}
              >
                {countFor(cat)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Brand grid ── */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pb-24">
        {filtered.length === 0 ? (
          <p className="text-sm py-16 text-center" style={{ color: '#5a7a9a' }}>
            No brands in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((brand, i) => (
              <Link key={brand.id} to={`/brand/${brand.id}`} className="block">
                <BrandCard brand={brand} onClick={() => {}} index={i} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
