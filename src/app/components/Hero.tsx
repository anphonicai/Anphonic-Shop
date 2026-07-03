import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import anphonicLogo from '../../imports/Anphonic-logo_with_bg_-_black.png';

export function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (statsRef.current) {
      const stats = statsRef.current.querySelectorAll('.stat-number');
      
      stats.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target') || '0');
        const isPercentage = stat.textContent?.includes('%');
        
        gsap.to(stat, {
          duration: 2,
          innerHTML: target,
          snap: { innerHTML: 1 },
          ease: 'power2.out',
          delay: 0.5,
          onUpdate: function() {
            const value = Math.ceil(parseFloat(this.targets()[0].innerHTML));
            this.targets()[0].innerHTML = isPercentage ? `${value}%` : value.toString().padStart(2, '0');
          }
        });
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 -z-10" />
      
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12"
      >
        <img 
          src={anphonicLogo} 
          alt="Anphonic" 
          className="h-12 w-auto"
        />
      </motion.div>

      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-4xl"
      >
        <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-6">
          Curated D2C Index
        </h1>
        <p className="text-xl md:text-2xl text-zinc-600 mb-4 font-light">
          Quietly discover the brands
          <br />
          everyone else will find next season.
        </p>
        <p className="text-base md:text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          A hand-picked index of verified offers from 19 independent D2C labels. 
          No noise. No spam. Just the good ones, with codes that actually work.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        ref={statsRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-3 gap-12 md:gap-20 mt-20"
      >
        <div className="text-center">
          <div className="stat-number text-5xl md:text-6xl font-light mb-2" data-target="19">
            00
          </div>
          <div className="text-sm text-zinc-500 uppercase tracking-wider">Brands</div>
        </div>
        <div className="text-center">
          <div className="stat-number text-5xl md:text-6xl font-light mb-2" data-target="7">
            00
          </div>
          <div className="text-sm text-zinc-500 uppercase tracking-wider">Categories</div>
        </div>
        <div className="text-center">
          <div className="stat-number text-5xl md:text-6xl font-light mb-2" data-target="100">
            0%
          </div>
          <div className="text-sm text-zinc-500 uppercase tracking-wider">Verified Codes</div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-16"
      >
        <button 
          onClick={() => {
            document.getElementById('index')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-8 py-4 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors duration-300 text-sm uppercase tracking-wider"
        >
          Browse the index
        </button>
      </motion.div>
    </div>
  );
}
