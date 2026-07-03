import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { brands, categories } from '../data/brands';

const items = [
  'Verified Offers',
  '✦',
  'Independent Brands',
  '✦',
  'No Pop-ups',
  '✦',
  'Curated Weekly',
  '✦',
  'Made for the Discerning Buyer',
  '✦',
  `${brands.length} Brands · ${categories.length - 1} Categories`,
  '✦',
  '100% Verified Codes',
  '✦',
];

export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const half = trackRef.current.scrollWidth / 2;
    gsap.to(trackRef.current, { x: -half, duration: 30, ease: 'none', repeat: -1 });
  }, []);

  const all = [...items, ...items, ...items, ...items];

  return (
    <div className="overflow-hidden border-y" style={{ borderColor: 'rgba(10,31,61,0.08)', backgroundColor: '#f0f6ff' }}>
      <div ref={trackRef} className="flex items-center gap-10 whitespace-nowrap py-4">
        {all.map((item, i) => (
          <span
            key={i}
            className="text-[11px] uppercase tracking-[0.22em] select-none font-medium"
            style={{ color: item === '✦' ? '#009689' : '#0a1f3d', opacity: item === '✦' ? 1 : 0.65 }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
