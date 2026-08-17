import { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { api } from '../../lib/api';
import { LEAD_SUBMITTED_KEY } from '../../lib/leadGate';

const NAVY = '#0a1f3d';
const TEAL = '#009689';
const USER_KEY = 'anphonic_user';

const AGE_SEGMENTS = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'];

interface RevealCodeGateProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function RevealCodeGate({ onSuccess, onClose }: RevealCodeGateProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'Required';
    if (!phone.trim()) nextErrors.phone = 'Required';
    if (!ageGroup) nextErrors.ageGroup = 'Select one';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const { lead } = await api.submitLead({ name: name.trim(), phone: phone.trim(), ageGroup });
      localStorage.setItem(LEAD_SUBMITTED_KEY, '1');
      localStorage.setItem(USER_KEY, JSON.stringify({ name: lead.name }));
      onSuccess();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(10,31,61,0.6)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm rounded-2xl p-6"
        style={{ backgroundColor: '#F5F3EF', boxShadow: '0 32px 80px rgba(10,31,61,0.35)' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full"
          style={{ color: 'rgba(10,31,61,0.4)' }}
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <p className="text-[9px] uppercase tracking-[0.3em] font-semibold mb-1.5" style={{ color: TEAL }}>
          Quick unlock
        </p>
        <h2 className="text-xl font-light leading-snug mb-5" style={{ color: NAVY, fontFamily: "'Fraunces', serif" }}>
          Tell us who you are to reveal your code.
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Full name"
              autoComplete="name"
              className="w-full px-3.5 py-2.5 text-sm outline-none rounded-lg"
              style={{ border: `1.5px solid ${errors.name ? '#e53e3e' : 'rgba(10,31,61,0.12)'}`, backgroundColor: '#fff', color: NAVY }}
              autoFocus
            />
            {errors.name && <p className="text-[11px] mt-1" style={{ color: '#e53e3e' }}>{errors.name}</p>}
          </div>

          <div>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Phone number"
              autoComplete="tel"
              className="w-full px-3.5 py-2.5 text-sm outline-none rounded-lg"
              style={{ border: `1.5px solid ${errors.phone ? '#e53e3e' : 'rgba(10,31,61,0.12)'}`, backgroundColor: '#fff', color: NAVY }}
            />
            {errors.phone && <p className="text-[11px] mt-1" style={{ color: '#e53e3e' }}>{errors.phone}</p>}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: 'rgba(10,31,61,0.5)' }}>
              Age group
            </p>
            <div className="flex flex-wrap gap-1.5">
              {AGE_SEGMENTS.map(seg => (
                <button
                  key={seg}
                  type="button"
                  onClick={() => setAgeGroup(seg)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all duration-200"
                  style={
                    ageGroup === seg
                      ? { backgroundColor: NAVY, color: '#fff', border: `1.5px solid ${NAVY}` }
                      : { backgroundColor: 'transparent', color: 'rgba(10,31,61,0.45)', border: '1.5px solid rgba(10,31,61,0.12)' }
                  }
                >
                  {seg}
                </button>
              ))}
            </div>
            {errors.ageGroup && <p className="text-[11px] mt-2" style={{ color: '#e53e3e' }}>{errors.ageGroup}</p>}
          </div>

          {submitError && (
            <p className="text-center text-[11px] px-2 py-2 rounded-lg" style={{ color: '#e53e3e', backgroundColor: '#fff0f0', border: '1px solid #fecaca' }}>
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-widest text-white disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: TEAL }}
          >
            {submitting ? 'Unlocking…' : 'Unlock my code'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
