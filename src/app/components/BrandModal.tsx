import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Brand } from '../data/brands';

const NAVY = '#0a1f3d';
const TEAL = '#009689';

interface BrandModalProps {
  brand: Brand | null;
  onClose: () => void;
}

export function BrandModal({ brand, onClose }: BrandModalProps) {
  const [copied, setCopied] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = brand ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [brand]);

  // GSAP open/close
  useEffect(() => {
    if (brand && backdropRef.current && panelRef.current) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(panelRef.current, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' });
    }
  }, [brand]);

  const handleClose = () => {
    if (backdropRef.current && panelRef.current) {
      gsap.to(panelRef.current, { opacity: 0, y: 30, scale: 0.97, duration: 0.25, ease: 'power2.in' });
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, onComplete: onClose });
    } else {
      onClose();
    }
  };

  const handleCopy = () => {
    if (!brand) return;
    navigator.clipboard.writeText(brand.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!brand) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="absolute inset-0"
        style={{ backgroundColor: `${NAVY}99`, backdropFilter: 'blur(6px)' }}
      />

      {/* Panel */}
      <div className="absolute inset-0 flex items-end md:items-center justify-center p-0 md:p-6">
        <div
          ref={panelRef}
          className="relative w-full md:max-w-2xl bg-white overflow-hidden flex flex-col max-h-[96vh] rounded-t-2xl md:rounded-2xl shadow-2xl"
        >
          {/* Mobile handle */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'rgba(10,31,61,0.15)' }} />
          </div>

          {/* Header bar */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b shrink-0"
            style={{ borderColor: 'rgba(10,31,61,0.08)' }}
          >
            <div className="flex items-center gap-2">
              {brand.verified && (
                <span
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium px-2.5 py-1 rounded-full"
                  style={{ color: TEAL, backgroundColor: `${TEAL}12` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full block" style={{ backgroundColor: TEAL }} />
                  Verified
                </span>
              )}
              <span className="text-xs uppercase tracking-wider font-medium" style={{ color: '#5a7a9a' }}>
                {brand.category}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: 'rgba(10,31,61,0.06)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(10,31,61,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(10,31,61,0.06)')}
            >
              <X className="size-4" style={{ color: NAVY }} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1">
            {/* Image / Logo */}
            <div
              className="aspect-video overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: brand.logo ? '#f5f8fa' : '#eef2f7' }}
            >
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="object-contain"
                  style={{ maxHeight: '140px', maxWidth: '70%' }}
                />
              ) : (
                <ImageWithFallback
                  src={brand.image}
                  alt={brand.name}
                  className="size-full object-cover"
                />
              )}
            </div>

            <div className="px-6 py-8">
              {/* Brand name */}
              <h2
                className="text-3xl md:text-4xl font-light mb-2 leading-tight"
                style={{ color: NAVY, fontFamily: "'Fraunces', serif" }}
              >
                {brand.name}
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#5a7a9a' }}>
                {brand.description}
              </p>

              {/* Offer block */}
              <div
                className="rounded-xl p-5 mb-5 border"
                style={{ backgroundColor: 'rgba(10,31,61,0.025)', borderColor: 'rgba(10,31,61,0.08)' }}
              >
                <p className="text-[10px] uppercase tracking-[0.25em] mb-1 font-medium" style={{ color: TEAL }}>
                  Exclusive offer
                </p>
                <p className="text-lg font-medium mb-5" style={{ color: NAVY }}>
                  {brand.discount}
                </p>

                {/* Code row */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 rounded-lg px-4 py-3.5 text-center border-2 border-dashed"
                    style={{ borderColor: `${TEAL}40`, backgroundColor: '#fff' }}
                  >
                    <span className="font-mono text-base tracking-[0.28em] font-medium" style={{ color: NAVY }}>
                      {brand.code}
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 flex items-center gap-2 px-5 py-3.5 rounded-lg text-sm font-medium text-white transition-all duration-200"
                    style={{ backgroundColor: copied ? TEAL : NAVY }}
                  >
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: '#5a7a9a' }}>
                  Verified June 2026 · Terms apply
                </p>
                <button
                  className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
                  style={{ color: TEAL }}
                >
                  Visit brand <ExternalLink className="size-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
