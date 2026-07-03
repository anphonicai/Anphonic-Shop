import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { CheckCircle2, Copy, Check, Tag, ArrowLeft } from 'lucide-react';
import { brands } from '../data/brands';
import { Navbar } from '../components/Navbar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const NAVY = '#0a1f3d';
const TEAL = '#009689';
const STORAGE_KEY = 'anphonic_offers_data';

interface OffersData {
  name: string;
  categories: string[];
}

function OfferCard({ brand, index }: { brand: typeof brands[0]; index: number }) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, delay: index * 0.08, ease: 'power3.out' }
    );
  }, [index]);

  const copy = () => {
    navigator.clipboard.writeText(brand.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl overflow-hidden border flex flex-col"
      style={{ borderColor: 'rgba(10,31,61,0.09)', boxShadow: '0 4px 24px rgba(10,31,61,0.07)' }}
    >
      {/* Image / Logo */}
      <div
        className="aspect-[4/3] overflow-hidden relative"
        style={{ backgroundColor: brand.logo ? '#f5f8fa' : '#eef2f7' }}
      >
        {brand.logo ? (
          <div className="size-full flex items-center justify-center p-8">
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              className="max-h-full max-w-full object-contain"
              style={{ maxHeight: '120px' }}
            />
          </div>
        ) : (
          <ImageWithFallback src={brand.image} alt={brand.name} className="size-full object-cover" />
        )}

        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)' }}
        >
          <CheckCircle2 className="size-3" style={{ color: TEAL }} />
          <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: NAVY }}>
            Verified
          </span>
        </div>
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium text-white"
          style={{ backgroundColor: `${NAVY}dd` }}
        >
          {brand.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-semibold mb-1" style={{ color: NAVY }}>
          {brand.name}
        </h3>
        <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: '#5a7a9a' }}>
          {brand.description}
        </p>

        <div
          className="rounded-lg p-3 mb-3"
          style={{ backgroundColor: `${TEAL}0f`, border: `1px dashed ${TEAL}55` }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Tag className="size-3" style={{ color: TEAL }} />
            <span
              className="text-[10px] uppercase tracking-wider font-medium"
              style={{ color: TEAL }}
            >
              Exclusive offer
            </span>
          </div>
          <p className="text-sm font-medium" style={{ color: NAVY }}>
            {brand.discount}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex-1 rounded-lg px-3 py-2.5 text-center border-2 border-dashed"
            style={{ borderColor: `${TEAL}45` }}
          >
            <span
              className="font-mono text-sm tracking-[0.22em] font-semibold"
              style={{ color: NAVY }}
            >
              {brand.code}
            </span>
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-white transition-all duration-200"
            style={{
              backgroundColor: copied ? TEAL : NAVY,
              minWidth: '80px',
              justifyContent: 'center',
            }}
          >
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function OffersPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<OffersData | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  // Animate header in
  useEffect(() => {
    if (!headerRef.current || !data) return;
    gsap.fromTo(
      headerRef.current.querySelectorAll('.reveal'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
    );
  }, [data]);

  const matchedBrands = data
    ? brands.filter((b) => data.categories.includes(b.category))
    : [];

  const firstName = data?.name.split(' ')[0] ?? '';

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#f7f8fa', fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navbar />

      <main className="pt-16">
        {/* ── Hero strip ── */}
        <div
          className="border-b"
          style={{ backgroundColor: '#fff', borderColor: 'rgba(10,31,61,0.08)' }}
        >
          <div
            ref={headerRef}
            className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20"
          >
            {/* Back */}
            <Link
              to="/"
              className="reveal inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors"
              style={{ color: '#5a7a9a' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = NAVY)}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#5a7a9a')}
            >
              <ArrowLeft className="size-4" /> Back to index
            </Link>

            {/* Unlocked badge */}
            <div
              className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium mb-6"
              style={{ backgroundColor: `${TEAL}12`, color: TEAL }}
            >
              <CheckCircle2 className="size-4" />
              Offers unlocked{firstName ? ` for ${firstName}` : ''}
            </div>

            <h1
              className="reveal text-4xl md:text-6xl font-light leading-tight mb-4"
              style={{ color: NAVY, fontFamily: "'Fraunces', serif" }}
            >
              Your personalised{' '}
              <em style={{ color: TEAL }}>exclusive codes.</em>
            </h1>

            {data && (
              <p className="reveal text-sm max-w-lg" style={{ color: '#5a7a9a' }}>
                Based on your preferences —{' '}
                <span className="font-medium" style={{ color: NAVY }}>
                  {data.categories.join(', ')}
                </span>
                . All codes are verified and active.
              </p>
            )}
          </div>
        </div>

        {/* ── Offers grid ── */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
          {matchedBrands.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedBrands.map((brand, i) => (
                <OfferCard key={brand.id} brand={brand} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-base mb-6" style={{ color: '#5a7a9a' }}>
                No brands matched your selection yet — more coming soon.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-white px-6 py-3 rounded-full transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: TEAL }}
              >
                Browse all brands
              </Link>
            </div>
          )}

          {/* Footer CTA */}
          {matchedBrands.length > 0 && (
            <div
              className="mt-14 pt-10 border-t flex flex-col sm:flex-row items-center justify-center gap-4"
              style={{ borderColor: 'rgba(10,31,61,0.07)' }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-white px-7 py-3.5 rounded-full transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: TEAL }}
              >
                Browse all brands →
              </Link>
              <Link
                to="/"
                onClick={() => sessionStorage.removeItem(STORAGE_KEY)}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium px-7 py-3.5 rounded-full border-2 transition-all duration-200"
                style={{ borderColor: NAVY, color: NAVY }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = NAVY;
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = NAVY;
                }}
              >
                <ArrowLeft className="size-3" /> Change preferences
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
