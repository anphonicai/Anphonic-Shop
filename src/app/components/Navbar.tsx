import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AnphonicLogo } from './AnphonicLogo';

const NAV_LINKS = [
  { label: 'The Index', id: 'index' },
  { label: 'About', id: 'about' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on resize-to-desktop, and lock body scroll while open
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.body.style.overflow = '';
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#0a1f3d]/8'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        {/* Logo — full-color mark (teal + ink), reads fine on white/transparent */}
        <a href="#" className="flex items-center gap-3 group">
          <AnphonicLogo className="h-10 w-auto" />
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.id)}
              className="text-sm font-light tracking-wide transition-colors duration-200"
              style={{ color: scrolled ? '#0a1f3d' : '#0a1f3d', opacity: 0.7 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <button
          onClick={() => scrollTo('index')}
          className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: '#009689' }}
        >
          Browse codes
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden relative z-50 flex flex-col gap-1.5 p-2 -mr-2"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <motion.span
            className="w-5 h-px block"
            style={{ backgroundColor: '#0a1f3d' }}
            animate={menuOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="w-5 h-px block"
            style={{ backgroundColor: '#0a1f3d' }}
            animate={menuOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* Mobile menu panel — always mounted; animates opacity/transform only
          (never height/layout) so it can never compete with a smooth scroll
          kicked off by the same tap that closes it. */}
      <motion.div
        initial={false}
        animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}
        aria-hidden={!menuOpen}
        className="md:hidden absolute top-full inset-x-0 bg-white border-t border-[#0a1f3d]/8 shadow-lg"
      >
        <nav className="flex flex-col px-6 py-4 gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.id)}
              tabIndex={menuOpen ? 0 : -1}
              className="text-left text-base font-light tracking-wide py-3"
              style={{ color: '#0a1f3d' }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('index')}
            tabIndex={menuOpen ? 0 : -1}
            className="mt-3 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-white px-5 py-3 rounded-full"
            style={{ backgroundColor: '#009689' }}
          >
            Browse codes
          </button>
        </nav>
      </motion.div>
    </motion.header>
  );
}
