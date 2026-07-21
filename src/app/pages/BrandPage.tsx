import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Copy, Check, ExternalLink, Lock, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { brands } from '../data/brands';
import { AppNavbar } from '../components/AppNavbar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { trackClickUrl } from '../../lib/api';

const NAVY = '#0a1f3d';
const TEAL = '#009689';

function RevealKey(id: string) {
  return `anphonic_revealed_${id}`;
}

// ── Offer Reveal Card ──────────────────────────────────────────────────────────
function OfferRevealCard({ brand }: { brand: typeof brands[0] }) {
  const [revealed, setRevealed] = useState(
    () => localStorage.getItem(RevealKey(brand.id)) === '1'
  );
  const [isRevealing, setIsRevealing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReveal = () => {
    if (isRevealing || revealed) return;
    setIsRevealing(true);
    // Let animation play, then flip state
    setTimeout(() => {
      localStorage.setItem(RevealKey(brand.id), '1');
      setRevealed(true);
      setIsRevealing(false);
    }, 650);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(brand.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="sticky top-24">
      {/* Card shell */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border: `1.5px solid rgba(10,31,61,0.12)`,
          boxShadow: '0 8px 40px rgba(10,31,61,0.12)',
        }}
      >
        {/* Teal header strip */}
        <div
          className="px-6 py-3 flex items-center justify-between"
          style={{ backgroundColor: TEAL }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-white">
            Exclusive Offer
          </span>
          <div className="flex items-center gap-1.5">
            <Shield className="size-3 text-white opacity-80" />
            <span className="text-[9px] uppercase tracking-wider text-white opacity-80">
              Anphonic Verified
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="bg-white">
          <AnimatePresence mode="wait">
            {!revealed ? (
              /* ── LOCKED STATE ── */
              <motion.div
                key="locked"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="p-6"
              >
                <h3
                  className="text-xl font-light mb-2 leading-snug"
                  style={{ color: NAVY, fontFamily: "'Fraunces', serif" }}
                >
                  Your exclusive code awaits.
                </h3>
                <p className="text-sm mb-6" style={{ color: '#5a7a9a' }}>
                  This offer is reserved for Anphonic members only.
                  Verified and ready to use.
                </p>

                {/* Blurred code placeholder */}
                <div
                  className="relative rounded-xl px-5 py-5 mb-6 flex items-center justify-center overflow-hidden"
                  style={{
                    border: `2px dashed rgba(0,150,137,0.3)`,
                    backgroundColor: '#f8fbfb',
                  }}
                >
                  {/* Blurred text behind */}
                  <span
                    className="font-mono text-lg tracking-[0.4em] font-semibold select-none pointer-events-none"
                    style={{ color: NAVY, filter: 'blur(7px)', userSelect: 'none' }}
                  >
                    {brand.code}
                  </span>
                  {/* Lock overlay */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                    style={{ backdropFilter: 'blur(0px)' }}
                  >
                    <motion.div
                      animate={isRevealing
                        ? { scale: [1, 1.3, 0], rotate: [0, -10, 20], opacity: [1, 1, 0] }
                        : { scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.55 }}
                    >
                      <Lock
                        className="size-6"
                        style={{ color: TEAL }}
                      />
                    </motion.div>
                    {!isRevealing && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: TEAL }}>
                        Tap to unlock
                      </span>
                    )}
                  </div>
                </div>

                {/* Reveal CTA */}
                <button
                  onClick={handleReveal}
                  disabled={isRevealing}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-semibold uppercase tracking-widest text-white transition-all duration-200"
                  style={{
                    backgroundColor: isRevealing ? `${NAVY}cc` : NAVY,
                    cursor: isRevealing ? 'wait' : 'pointer',
                  }}
                >
                  {isRevealing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                      />
                      Unlocking…
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Reveal My Exclusive Offer
                    </>
                  )}
                </button>

                <p className="text-center text-xs mt-4 flex items-center justify-center gap-1.5" style={{ color: '#5a7a9a' }}>
                  <Lock className="size-3" />
                  Code remains visible after unlock
                </p>
              </motion.div>
            ) : (
              /* ── REVEALED STATE ── */
              <motion.div
                key="revealed"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="p-6"
              >
                {/* Success badge */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  className="flex items-center gap-2 mb-5"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${TEAL}18` }}
                  >
                    <CheckCircle2 className="size-4" style={{ color: TEAL }} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
                    Offer Unlocked
                  </span>
                </motion.div>

                {/* Discount headline */}
                <p className="text-2xl font-semibold mb-1" style={{ color: NAVY }}>
                  {brand.discount}
                </p>
                <p className="text-sm mb-6" style={{ color: '#5a7a9a' }}>
                  Apply at checkout on {brand.name}'s website.
                </p>

                {/* Code box */}
                <motion.div
                  initial={{ boxShadow: `0 0 0 0px ${TEAL}40` }}
                  animate={{ boxShadow: [`0 0 0 0px ${TEAL}40`, `0 0 0 6px ${TEAL}20`, `0 0 0 0px ${TEAL}00`] }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-5 rounded-xl p-1.5"
                  style={{ backgroundColor: '#f4faf9', border: `2px dashed ${TEAL}55` }}
                >
                  <div className="flex-1 min-w-0 px-4 py-3 text-center">
                    <span
                      className="font-mono text-lg sm:text-xl tracking-[0.25em] sm:tracking-[0.35em] font-bold break-all"
                      style={{ color: NAVY }}
                    >
                      {brand.code}
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 flex items-center justify-center gap-1.5 px-5 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest text-white transition-all duration-200"
                    style={{ backgroundColor: copied ? TEAL : NAVY, minWidth: 90 }}
                  >
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </motion.div>

                {/* Meta info */}
                <div
                  className="flex items-center gap-4 text-xs py-3 px-4 rounded-lg mb-5"
                  style={{ backgroundColor: '#f7f9fc', color: '#5a7a9a' }}
                >
                  <span>✓ Single use</span>
                  <span>✓ New customers</span>
                  <span>✓ Verified Jun 2026</span>
                </div>

                {/* Visit brand */}
                <a
                  href={brand.website ? trackClickUrl(brand.id) : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                  style={{
                    border: `1.5px solid ${NAVY}`,
                    color: NAVY,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = NAVY;
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = NAVY;
                  }}
                >
                  Visit {brand.name} <ExternalLink className="size-3.5" />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Terms */}
      <p className="text-center text-xs mt-4" style={{ color: '#5a7a9a' }}>
        Terms apply · Code verified by Anphonic
      </p>
    </div>
  );
}

// ── Main BrandPage ─────────────────────────────────────────────────────────────
export function BrandPage() {
  const { id } = useParams<{ id: string }>();
  const brand = brands.find(b => b.id === id);

  if (!brand) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium" style={{ color: NAVY }}>Brand not found</p>
        <Link to="/brands" className="text-sm font-medium" style={{ color: TEAL }}>
          ← Back to index
        </Link>
      </div>
    );
  }

  const related = brands.filter(b => b.category === brand.category && b.id !== brand.id).slice(0, 3);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f6f9', fontFamily: "'DM Sans', sans-serif" }}>
      <AppNavbar />

      <main className="pt-16">
        {/* ── Brand hero banner ── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, #0d3060 60%, #0a2a50 100%)`,
            minHeight: 280,
          }}
        >
          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(0,150,137,0.18) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          {/* Teal glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 600, height: 600,
              top: -200, right: -100,
              background: 'radial-gradient(circle, rgba(0,150,137,0.12) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-14 flex flex-col items-start justify-end h-full" style={{ minHeight: 280 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <Link
                to="/brands"
                className="text-xs uppercase tracking-wider font-medium transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                The Index
              </Link>
              <span className="text-xs">›</span>
              <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {brand.category}
              </span>
              <span className="text-xs">›</span>
              <span className="text-xs uppercase tracking-wider font-medium text-white">{brand.name}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end gap-6 w-full">
              {/* Brand logo (if available) */}
              {brand.logo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 p-3"
                  style={{ backgroundColor: '#ffffff', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="max-h-full max-w-full object-contain"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </motion.div>
              )}

              <div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-center gap-2 mb-3"
                >
                  <span
                    className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold"
                    style={{ backgroundColor: `${TEAL}30`, color: TEAL, border: `1px solid ${TEAL}40` }}
                  >
                    {brand.category}
                  </span>
                  {/* Mobile only: Visit Website replaces the Verified Partner badge here */}
                  <a
                    href={brand.website ? trackClickUrl(brand.id) : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex lg:hidden items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-colors duration-200"
                    style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.22)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.12)'; }}
                  >
                    Visit Website <ExternalLink className="size-3" />
                  </a>
                  {/* Desktop only: unchanged Verified Partner badge */}
                  {brand.verified && (
                    <span
                      className="hidden lg:flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold"
                      style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}
                    >
                      <CheckCircle2 className="size-3" /> Verified Partner
                    </span>
                  )}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="text-4xl md:text-6xl font-light text-white leading-tight"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {brand.name}
                </motion.h1>

                {/* Mobile only: description moved up here so it isn't buried below the fold */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:hidden text-sm leading-relaxed mt-4 max-w-xl"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  {brand.description}
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content area ── */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
          {/* Back */}
          <Link
            to="/brands"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors mb-8"
            style={{ color: '#5a7a9a' }}
            onMouseEnter={e => (e.currentTarget.style.color = NAVY)}
            onMouseLeave={e => (e.currentTarget.style.color = '#5a7a9a')}
          >
            <ArrowLeft className="size-4" /> Back to the index
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 xl:gap-16">

            {/* ── LEFT: Brand info (shown after the offer card on mobile so the coupon isn't buried) ── */}
            <div className="order-2 lg:order-1 lg:col-span-3 space-y-8">
              {/* About section — desktop only, removed from mobile entirely */}
              <div
                className="hidden lg:block bg-white rounded-2xl p-8"
                style={{ border: '1px solid rgba(10,31,61,0.07)', boxShadow: '0 4px 20px rgba(10,31,61,0.06)' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: TEAL }}>
                      About this brand
                    </p>
                    <a
                      href={brand.website ? trackClickUrl(brand.id) : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-4 py-2 rounded-full transition-all duration-200"
                      style={{ border: `1.5px solid ${NAVY}`, color: NAVY }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = NAVY;
                        (e.currentTarget as HTMLElement).style.color = '#fff';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = NAVY;
                      }}
                    >
                      Visit Website <ExternalLink className="size-3" />
                    </a>
                  </div>
                  <p
                    className="text-lg font-light leading-relaxed mb-8"
                    style={{ color: NAVY, fontFamily: "'Fraunces', serif" }}
                  >
                    {brand.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {[
                      brand.category,
                      'D2C',
                      'Verified Partner',
                      'Exclusive Code',
                      ...(brand.verified ? ['Anphonic Trusted'] : []),
                    ].map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: 'rgba(10,31,61,0.05)', color: '#5a7a9a', border: '1px solid rgba(10,31,61,0.09)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Brand details grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Category', value: brand.category },
                      { label: 'Offer', value: brand.discount },
                      { label: 'Partner Since', value: '2024' },
                      { label: 'Status', value: brand.verified ? 'Verified ✓' : 'Active' },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: '#f7f9fc' }}
                      >
                        <p className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: '#5a7a9a' }}>{label}</p>
                        <p className="text-sm font-semibold" style={{ color: NAVY }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Brand image showcase */}
              {!brand.logo && (
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ height: 260, border: '1px solid rgba(10,31,61,0.07)' }}
                >
                  <ImageWithFallback
                    src={brand.image}
                    alt={brand.name}
                    className="size-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* ── RIGHT: Offer reveal card (shown first on mobile, right column on desktop) ── */}
            <div className="order-1 lg:order-2 lg:col-span-2">
              <OfferRevealCard brand={brand} />
            </div>
          </div>
        </div>

        {/* ── Related brands ── */}
        {related.length > 0 && (
          <div
            className="border-t"
            style={{ borderColor: 'rgba(10,31,61,0.07)', backgroundColor: '#fff' }}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-1" style={{ color: TEAL }}>
                    More in {brand.category}
                  </p>
                  <h2 className="text-2xl font-light" style={{ color: NAVY, fontFamily: "'Fraunces', serif" }}>
                    You might also like.
                  </h2>
                </div>
                <Link
                  to="/brands"
                  className="text-xs uppercase tracking-widest font-semibold transition-colors"
                  style={{ color: TEAL }}
                >
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map(b => (
                  <Link
                    key={b.id}
                    to={`/brand/${b.id}`}
                    className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 bg-white"
                    style={{ border: '1px solid rgba(10,31,61,0.08)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,150,137,0.3)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(10,31,61,0.1)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,31,61,0.08)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: '#f4f6f8' }}
                    >
                      {b.logo ? (
                        <img src={b.logo} alt={b.name} className="max-h-9 max-w-9 object-contain" />
                      ) : (
                        <ImageWithFallback src={b.image} alt={b.name} className="size-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: NAVY }}>{b.name}</p>
                      <p className="text-xs" style={{ color: TEAL }}>{b.discount}</p>
                    </div>
                    <ArrowLeft
                      className="size-4 rotate-180 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color: '#5a7a9a' }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
