import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { brands, categories as ALL_CATS } from '../data/brands';
import { AppNavbar } from '../components/AppNavbar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { TapedFooter } from '../components/ui/footer-taped-design';
import { Marquee } from '../components/Marquee';

const NAVY = '#0a1f3d';
const TEAL = '#009689';
const USER_KEY = 'anphonic_user';

function BrandCard({ brand, index }: { brand: typeof brands[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/brand/${brand.id}`}
        className="group block bg-white rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          border: '1px solid rgba(10,31,61,0.08)',
          boxShadow: '0 4px 20px rgba(10,31,61,0.06)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(10,31,61,0.14), 0 0 0 1px rgba(0,150,137,0.25)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(10,31,61,0.06)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        {/* Image / logo area */}
        <div
          className="relative overflow-hidden"
          style={{ height: 180, backgroundColor: brand.logo ? '#f4f6f8' : '#edf0f5' }}
        >
          {brand.logo ? (
            <div className="size-full flex items-center justify-center p-10">
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                style={{ maxHeight: 90 }}
              />
            </div>
          ) : (
            <ImageWithFallback
              src={brand.image}
              alt={brand.name}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold text-white"
              style={{ backgroundColor: `${NAVY}dd` }}
            >
              {brand.category}
            </span>
          </div>
          {brand.verified && (
            <div
              className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)' }}
            >
              <CheckCircle2 className="size-3" style={{ color: TEAL }} />
              <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: NAVY }}>Verified</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3
            className="text-base font-semibold mb-1.5 leading-tight"
            style={{ color: NAVY }}
          >
            {brand.name}
          </h3>
          <p
            className="text-xs leading-relaxed mb-5"
            style={{ color: '#5a7a9a', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {brand.description}
          </p>

          {/* Offer teaser (no code shown) */}
          <div
            className="flex items-center justify-between p-3 rounded-xl mb-4"
            style={{ backgroundColor: `${TEAL}0a`, border: `1px dashed ${TEAL}40` }}
          >
            <span className="text-xs font-medium" style={{ color: TEAL }}>Exclusive offer available</span>
            <span
              className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: `${TEAL}15`, color: TEAL }}
            >
              Locked
            </span>
          </div>

          {/* CTA */}
          <div
            className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
            style={{ color: NAVY }}
          >
            <span>Explore brand</span>
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              style={{ color: TEAL }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function BrandsPage() {
  const [activeCategory, setActiveCategory] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      const interests = raw ? (JSON.parse(raw).categories as string[] | undefined) : undefined;
      return interests?.find(c => ALL_CATS.includes(c)) ?? 'All';
    } catch {
      return 'All';
    }
  });
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setFirstName(JSON.parse(raw).name?.split(' ')[0] ?? '');
    } catch { /* ignore */ }
  }, []);

  const filtered = activeCategory === 'All'
    ? brands
    : brands.filter(b => b.category === activeCategory);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f6f9', fontFamily: "'DM Sans', sans-serif" }}>
      <AppNavbar />

      <main className="pt-16">
        {/* ── Page header ── */}
        <div
          className="relative overflow-hidden"
          style={{ backgroundColor: '#fff', borderBottom: '1px solid rgba(10,31,61,0.07)' }}
        >
          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(10,31,61,0.06) 1px, transparent 1px)`,
              backgroundSize: '28px 28px',
            }}
          />
          <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[10px] uppercase tracking-[0.35em] font-semibold mb-4" style={{ color: TEAL }}>
                The Anphonic Index
              </p>
              <h1
                className="text-4xl md:text-6xl font-light leading-tight mb-4"
                style={{ color: NAVY, fontFamily: "'Fraunces', serif" }}
              >
                {firstName ? (
                  <>Welcome back, <em style={{ color: TEAL }}>{firstName}.</em></>
                ) : (
                  <>Every brand <em style={{ color: TEAL }}>worth knowing.</em></>
                )}
              </h1>
              <p className="text-base max-w-lg" style={{ color: '#5a7a9a' }}>
                Hand-picked D2C brands with exclusive codes reserved for Anphonic members.
                Click any brand to reveal your offer.
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-8 mt-10 pt-8 border-t"
              style={{ borderColor: 'rgba(10,31,61,0.07)' }}
            >
              {[
                { value: brands.length, label: 'Partner Brands' },
                { value: ALL_CATS.length - 1, label: 'Categories' },
                { value: '100%', label: 'Verified Codes' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-light tabular-nums mb-0.5" style={{ color: NAVY }}>{value}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#5a7a9a' }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Marquee ── */}
        <Marquee />

        {/* ── Sticky category filter ── */}
        <div
          className="sticky z-40 bg-white"
          style={{ top: 64, borderBottom: '1px solid rgba(10,31,61,0.07)' }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {ALL_CATS.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 whitespace-nowrap"
                  style={
                    activeCategory === cat
                      ? { backgroundColor: NAVY, color: '#fff' }
                      : { backgroundColor: 'transparent', color: '#5a7a9a', border: '1px solid rgba(10,31,61,0.12)' }
                  }
                >
                  {cat}
                  {cat !== 'All' && (
                    <span className="ml-1.5 opacity-60">
                      {brands.filter(b => b.category === cat).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Brand grid ── */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
          {filtered.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm" style={{ color: '#5a7a9a' }}>
                  <span className="font-semibold" style={{ color: NAVY }}>{filtered.length}</span> brand{filtered.length !== 1 ? 's' : ''} in{' '}
                  <span className="font-semibold" style={{ color: NAVY }}>{activeCategory === 'All' ? 'all categories' : activeCategory}</span>
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((brand, i) => (
                  <BrandCard key={brand.id} brand={brand} index={i} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <p className="text-base mb-2" style={{ color: NAVY }}>No brands in this category yet.</p>
              <p className="text-sm mb-6" style={{ color: '#5a7a9a' }}>Check back soon — we add new partners regularly.</p>
              <button
                onClick={() => setActiveCategory('All')}
                className="text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-full text-white"
                style={{ backgroundColor: TEAL }}
              >
                View all brands
              </button>
            </div>
          )}
        </div>
      </main>

      <TapedFooter />
    </div>
  );
}
