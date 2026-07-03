import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import anphonicLogo from '../../imports/Anphonic-logo_with_bg_-_black.png';

const NAVY = '#0a1f3d';
const TEAL = '#009689';

const CATEGORIES = ['Fashion', 'Beauty', 'Wellness', 'Home', 'Tech', 'Food', 'Pets'];

function Orbit({
  radius,
  duration,
  reverse = false,
  items,
}: {
  radius: number;
  duration: number;
  reverse?: boolean;
  items: ReactNode[];
}) {
  return (
    <div
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        left: '50%',
        top: '50%',
        pointerEvents: 'none',
      }}
    >
      {/* Ring border */}
      <div
        style={{
          position: 'absolute',
          width: radius * 2,
          height: radius * 2,
          left: -radius,
          top: -radius,
          borderRadius: '50%',
          border: '1px solid rgba(0,150,137,0.18)',
        }}
      />
      {/* Rotating wrapper */}
      <motion.div
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', width: 0, height: 0 }}
      >
        {items.map((item, i) => {
          const rad = (i / items.length) * 2 * Math.PI;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          return (
            <motion.div
              key={i}
              style={{ position: 'absolute', left: x, top: y }}
              animate={{ rotate: reverse ? 360 : -360 }}
              transition={{ duration, repeat: Infinity, ease: 'linear' }}
            >
              {/* Inner centering wrapper */}
              <div style={{ transform: 'translate(-50%, -50%)' }}>{item}</div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export function ParticleHero() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statsRef.current) return;
    const ctx = gsap.context(() => {
      statsRef.current!.querySelectorAll('.stat-num').forEach((el) => {
        const target = parseInt(el.getAttribute('data-target') || '0');
        gsap.fromTo(
          el,
          { innerHTML: 0 },
          {
            innerHTML: target,
            duration: 2.2,
            snap: { innerHTML: 1 },
            ease: 'power3.out',
            delay: 1.2,
            onUpdate() {
              const v = Math.ceil(parseFloat((this as any).targets()[0].innerHTML));
              (this as any).targets()[0].innerHTML = v.toString();
            },
          }
        );
      });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  const innerDots: ReactNode[] = [
    { color: TEAL, size: 10, glow: true },
    { color: NAVY, size: 7, glow: false },
    { color: TEAL, size: 8, glow: true },
    { color: '#5a7a9a', size: 6, glow: false },
  ].map(({ color, size, glow }, i) => (
    <div
      key={i}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: glow ? `0 0 12px ${color}, 0 0 24px ${color}55` : undefined,
      }}
    />
  ));

  const categoryPills: ReactNode[] = CATEGORIES.map((cat) => (
    <div
      key={cat}
      style={{
        padding: '5px 13px',
        borderRadius: 20,
        border: '1px solid rgba(0,150,137,0.28)',
        backgroundColor: 'rgba(255,255,255,0.96)',
        fontSize: 10,
        fontWeight: 600,
        color: NAVY,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        whiteSpace: 'nowrap' as const,
        boxShadow: '0 2px 12px rgba(10,31,61,0.1), 0 0 0 1px rgba(255,255,255,0.6)',
      }}
    >
      {cat}
    </div>
  ));

  const outerAccents: ReactNode[] = Array.from({ length: 8 }).map((_, i) => {
    const isBig = i % 3 === 0;
    return (
      <div
        key={i}
        style={{
          width: isBig ? 8 : 4,
          height: isBig ? 8 : 4,
          backgroundColor:
            i % 2 === 0 ? 'rgba(0,150,137,0.6)' : 'rgba(10,31,61,0.22)',
          transform: 'rotate(45deg)',
          boxShadow: isBig ? '0 0 8px rgba(0,150,137,0.55)' : undefined,
        }}
      />
    );
  });

  return (
    <section className="relative min-h-screen flex flex-col bg-white pt-16 overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${NAVY}13 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />
      {/* Center radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 900,
          height: 900,
          top: '44%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(0,150,137,0.09) 0%, rgba(0,150,137,0.03) 40%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
      {/* Teal accent bar */}
      <div className="absolute top-0 inset-x-0 h-0.5" style={{ backgroundColor: TEAL }} />

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs uppercase tracking-[0.35em] mb-4 font-medium"
          style={{ color: TEAL }}
        >
          Welcome to
        </motion.p>

        {/* Orbital system */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.35 }}
          style={{ position: 'relative', width: 620, height: 620 }}
          className="mx-auto"
        >
          {/* Center logo */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 216,
              zIndex: 10,
            }}
          >
            {/* Pulsing glow behind logo */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.28, 0.6, 0.28] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: -24,
                borderRadius: 30,
                background:
                  'radial-gradient(circle, rgba(0,150,137,0.28) 0%, transparent 70%)',
                filter: 'blur(20px)',
                zIndex: -1,
              }}
            />
            <img
              src={anphonicLogo}
              alt="Anphonic"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: 16,
                boxShadow: [
                  '0 0 0 1px rgba(0,150,137,0.4)',
                  '0 0 0 4px rgba(0,150,137,0.08)',
                  '0 0 32px rgba(0,150,137,0.14)',
                  '0 20px 60px rgba(10,31,61,0.3)',
                ].join(', '),
              }}
            />
          </div>

          {/* Ring 1 – glowing dots, fast CW */}
          <Orbit radius={108} duration={9} items={innerDots} />

          {/* Ring 2 – category pills, medium CCW */}
          <Orbit radius={200} duration={26} reverse items={categoryPills} />

          {/* Ring 3 – diamond accents, slow CW */}
          <Orbit radius={282} duration={40} items={outerAccents} />
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="text-center mt-6 max-w-xl"
        >
          <p
            className="text-3xl md:text-[2.4rem] font-light leading-tight"
            style={{ color: NAVY, fontFamily: "'Fraunces', serif" }}
          >
            Discovery before the algorithm{' '}
            <em style={{ color: TEAL }}>catches up.</em>
          </p>
          <p
            className="mt-3 text-[10px] uppercase tracking-[0.3em]"
            style={{ color: '#5a7a9a' }}
          >
            — Anphonic Shop
          </p>
        </motion.div>

        {/* CTA + Stats */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="mt-10 flex flex-col md:flex-row items-center gap-8"
        >
          <button
            onClick={() =>
              document.getElementById('index')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="inline-flex items-center gap-3 text-xs uppercase tracking-widest text-white px-7 py-3.5 rounded-full transition-all duration-200 hover:opacity-90 hover:gap-4"
            style={{ backgroundColor: NAVY }}
          >
            Browse the index
            <span style={{ color: TEAL }}>→</span>
          </button>

          <div
            className="hidden md:block w-px h-8"
            style={{ backgroundColor: 'rgba(10,31,61,0.12)' }}
          />

          <div ref={statsRef} className="flex items-end gap-10">
            {[
              { value: 20, label: 'Brands' },
              { value: 7, label: 'Categories' },
              { value: 100, label: 'Verified', suffix: '%' },
            ].map(({ value, label, suffix }) => (
              <div key={label} className="text-center">
                <div
                  className="text-4xl font-light tabular-nums leading-none"
                  style={{ color: NAVY }}
                >
                  <span className="stat-num" data-target={value}>
                    0
                  </span>
                  {suffix && <span style={{ color: TEAL }}>{suffix}</span>}
                </div>
                <div
                  className="text-[10px] uppercase tracking-[0.25em] mt-1.5"
                  style={{ color: '#5a7a9a' }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ color: '#5a7a9a' }}
        >
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-[#009689] to-transparent" />
      </motion.div>
    </section>
  );
}
