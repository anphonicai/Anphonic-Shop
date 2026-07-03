import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import { Navbar } from './components/Navbar';
import { ParticleHero } from './components/ParticleHero';
import { Marquee } from './components/Marquee';
import { BrandIndex } from './components/BrandIndex';
import { LeadCaptureForm } from './components/LeadCaptureForm';
import { TapedFooter } from './components/ui/footer-taped-design';

const GATE_KEY = 'anphonic_unlocked';
const OFFERS_KEY = 'anphonic_offers_data';

function GateModal({ onComplete }: { onComplete: (data: { name: string; categories: string[] }) => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!backdropRef.current || !panelRef.current) return;
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    gsap.fromTo(panelRef.current,
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.1, ease: 'power3.out' }
    );
  }, []);

  const handleComplete = (data: { name: string; categories: string[] }) => {
    if (!backdropRef.current || !panelRef.current) { onComplete(data); return; }
    gsap.to(panelRef.current, { opacity: 0, y: -24, scale: 0.97, duration: 0.35, ease: 'power2.in' });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.45, delay: 0.15, onComplete: () => onComplete(data) });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop — semi-transparent so particle hero shows through */}
      <div
        ref={backdropRef}
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(10,31,61,0.72) 0%, rgba(0,150,137,0.45) 100%)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
        }}
      />

      {/* Modal panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: '#fff', boxShadow: '0 32px 80px rgba(10,31,61,0.25)' }}
      >
        <LeadCaptureForm onComplete={handleComplete} />
      </div>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [unlocked] = useState<boolean>(() => localStorage.getItem(GATE_KEY) === '1');
  const [showGate, setShowGate] = useState(false);

  // Delay the gate so the particle hero is seen first (~1.5 s)
  useEffect(() => {
    if (unlocked) return;
    const t = setTimeout(() => setShowGate(true), 1500);
    return () => clearTimeout(t);
  }, [unlocked]);

  const handleComplete = (data: { name: string; categories: string[] }) => {
    localStorage.setItem(GATE_KEY, '1');
    sessionStorage.setItem(OFFERS_KEY, JSON.stringify(data));
    setShowGate(false);
    navigate('/offers');
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <ParticleHero />
      <Marquee />
      <BrandIndex />
      <LeadCaptureForm />
      <TapedFooter />

      {showGate && <GateModal onComplete={handleComplete} />}
    </div>
  );
}
