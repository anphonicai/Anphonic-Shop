import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { AnphonicLogo } from './AnphonicLogo';

export function AppNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
        scrolled ? 'bg-white/96 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}
      style={{ borderBottom: '1px solid rgba(10,31,61,0.07)' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center h-16">
        {/* Logo */}
        <Link to="/brands" className="flex items-center gap-3">
          <AnphonicLogo className="h-9 w-auto" />
        </Link>
      </div>
    </motion.header>
  );
}
