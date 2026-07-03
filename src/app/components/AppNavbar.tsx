import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { LogOut, LayoutGrid, Tag } from 'lucide-react';
import { AnphonicLogo } from './AnphonicLogo';
import { LEAD_SUBMITTED_KEY } from '../../lib/leadGate';

const NAVY = '#0a1f3d';
const TEAL = '#009689';
const USER_KEY = 'anphonic_user';

export function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) {
        const { name } = JSON.parse(raw);
        setFirstName(name?.split(' ')[0] ?? '');
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem(LEAD_SUBMITTED_KEY);
    localStorage.removeItem(USER_KEY);
    navigate('/');
  };

  const NAV_LINKS = [
    { label: 'Browse Index', to: '/brands', icon: LayoutGrid },
    { label: 'Categories', to: '/brands?filter=all', icon: Tag },
  ];

  const isActive = (to: string) => location.pathname === to.split('?')[0];

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
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/brands" className="flex items-center gap-3">
          <AnphonicLogo className="h-9 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.label}
              to={link.to}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-200"
              style={{
                color: isActive(link.to) ? NAVY : '#5a7a9a',
                backgroundColor: isActive(link.to) ? 'rgba(10,31,61,0.06)' : 'transparent',
              }}
              onMouseEnter={e => { if (!isActive(link.to)) (e.currentTarget as HTMLElement).style.color = NAVY; }}
              onMouseLeave={e => { if (!isActive(link.to)) (e.currentTarget as HTMLElement).style.color = '#5a7a9a'; }}
            >
              <link.icon className="size-3.5" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          {firstName && (
            <span className="text-sm" style={{ color: '#5a7a9a' }}>
              Hi, <span className="font-medium" style={{ color: NAVY }}>{firstName}</span>
            </span>
          )}
          <div className="w-px h-5" style={{ backgroundColor: 'rgba(10,31,61,0.12)' }} />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium transition-colors"
            style={{ color: '#5a7a9a' }}
            onMouseEnter={e => (e.currentTarget.style.color = NAVY)}
            onMouseLeave={e => (e.currentTarget.style.color = '#5a7a9a')}
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden relative z-50 flex flex-col gap-1.5 p-2 -mr-2"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <motion.span
            className="w-5 h-px block"
            style={{ backgroundColor: NAVY }}
            animate={menuOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="w-5 h-px block"
            style={{ backgroundColor: NAVY }}
            animate={menuOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: menuOpen ? 'auto' : 'none', borderColor: 'rgba(10,31,61,0.07)' }}
        className="md:hidden absolute top-full inset-x-0 bg-white border-t shadow-lg"
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col px-6 py-4 gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
              className="flex items-center gap-2 text-sm font-medium py-3 tracking-wide"
              style={{ color: NAVY }}
            >
              <link.icon className="size-4" style={{ color: TEAL }} />
              {link.label}
            </Link>
          ))}
          <div className="border-t my-2" style={{ borderColor: 'rgba(10,31,61,0.07)' }} />
          {firstName && (
            <p className="text-xs py-1 mb-1" style={{ color: '#5a7a9a' }}>
              Signed in as <strong style={{ color: NAVY }}>{firstName}</strong>
            </p>
          )}
          <button
            onClick={handleLogout}
            tabIndex={menuOpen ? 0 : -1}
            className="flex items-center gap-2 text-sm font-medium py-2 text-left"
            style={{ color: '#5a7a9a' }}
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </nav>
      </motion.div>
    </motion.header>
  );
}
