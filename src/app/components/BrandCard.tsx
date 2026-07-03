import { useRef } from 'react';
import gsap from 'gsap';
import { Lock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Brand } from '../data/brands';

const NAVY = '#0a1f3d';
const TEAL = '#009689';

interface BrandCardProps {
  brand: Brand;
  onClick?: () => void;
  index: number;
}

export function BrandCard({ brand }: BrandCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { y: -6, boxShadow: '0 20px 48px rgba(10,31,61,0.12)', duration: 0.35, ease: 'power2.out' });
    gsap.to(imgRef.current, { scale: 1.04, duration: 0.5, ease: 'power2.out' });
  };

  const handleLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { y: 0, boxShadow: '0 2px 12px rgba(10,31,61,0.06)', duration: 0.4, ease: 'power2.inOut' });
    gsap.to(imgRef.current, { scale: 1, duration: 0.5, ease: 'power2.inOut' });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="brand-card cursor-pointer rounded-xl overflow-hidden border"
      style={{
        borderColor: 'rgba(10,31,61,0.08)',
        boxShadow: '0 2px 12px rgba(10,31,61,0.06)',
        backgroundColor: '#fff',
      }}
    >
      {/* Image / Logo */}
      <div className="aspect-[4/3] overflow-hidden relative" style={{ backgroundColor: brand.logo ? '#f5f8fa' : '#eef2f7' }}>
        <div ref={imgRef} className="size-full">
          {brand.logo ? (
            /* Logo mode — centred, contained, no cropping */
            <div className="size-full flex items-center justify-center p-8">
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="max-h-full max-w-full object-contain"
                style={{ maxHeight: '120px' }}
              />
            </div>
          ) : (
            /* Photo mode — full-bleed lifestyle image */
            <ImageWithFallback
              src={brand.image}
              alt={brand.name}
              className="size-full object-cover"
            />
          )}
        </div>
        {/* Overlay */}
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
          style={{ background: `linear-gradient(to top, ${NAVY}cc 0%, transparent 60%)` }}
        />
        {/* Verified */}
        {brand.verified && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full block" style={{ backgroundColor: TEAL }} />
            <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: NAVY }}>Verified</span>
          </div>
        )}
        {/* Category pill */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium text-white"
          style={{ backgroundColor: `${NAVY}cc`, backdropFilter: 'blur(4px)' }}
        >
          {brand.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-medium leading-tight" style={{ color: NAVY }}>
            {brand.name}
          </h3>
          <span
            className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${TEAL}15`, color: TEAL }}
          >
            {brand.discount.split(' ')[0]}
          </span>
        </div>

        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: '#5a7a9a' }}>
          {brand.description}
        </p>

        <div
          className="flex items-center justify-between pt-4 border-t"
          style={{ borderColor: 'rgba(10,31,61,0.07)' }}
        >
          <div className="flex items-center gap-1.5">
            <Lock className="size-3" style={{ color: '#5a7a9a' }} />
            <span
              className="font-mono text-xs tracking-widest px-2.5 py-1 rounded select-none"
              style={{
                backgroundColor: 'rgba(10,31,61,0.04)',
                color: 'transparent',
                textShadow: '0 0 7px rgba(10,31,61,0.45)',
                userSelect: 'none',
              }}
            >
              {brand.code}
            </span>
          </div>
          <span
            className="text-xs font-medium flex items-center gap-1 transition-opacity group-hover:opacity-100 opacity-70"
            style={{ color: TEAL }}
          >
            View offer →
          </span>
        </div>
      </div>
    </div>
  );
}
