import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, ArrowLeft, Lock, Sparkles } from 'lucide-react';
import { AnphonicLogo } from '../components/AnphonicLogo';
import { BrandsPage } from './BrandsPage';
import { api } from '../../lib/api';
import { LEAD_SUBMITTED_KEY } from '../../lib/leadGate';

const NAVY = '#0a1f3d';
const TEAL = '#14b8a6';
const CREAM = '#F5F3EF';
const USER_KEY = 'anphonic_user';

const CATEGORIES = [
  { id: 'Skincare', label: 'Skincare', emoji: '✨' },
  { id: 'Wellness', label: 'Wellness', emoji: '🌿' },
  { id: 'Fashion', label: 'Fashion', emoji: '👗' },
  { id: 'Food & Drinks', label: 'Food & Drinks', emoji: '🍃' },
  { id: 'Home', label: 'Home', emoji: '🏠' },
  { id: 'Accessories', label: 'Accessories', emoji: '💼' },
  { id: 'Footwear', label: 'Footwear', emoji: '👟' },
  { id: 'Grooming', label: 'Grooming', emoji: '💈' },
  { id: 'Kids & Baby', label: 'Kids & Baby', emoji: '🧸' },
  { id: 'Pets', label: 'Pets', emoji: '🐾' },
];

const AGE_SEGMENTS = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'];
const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const COUNTRIES = ['India', 'United Kingdom', 'United States', 'Australia', 'Canada', 'Singapore', 'UAE', 'Other'];
const STEPS = ['Details', 'Location', 'Interests'];

function FieldInput({
  label, type = 'text', value, onChange, placeholder, error, required,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  error?: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        className="block text-[10px] uppercase tracking-[0.18em] font-semibold mb-1.5"
        style={{ color: focused ? TEAL : 'rgba(10,31,61,0.5)' }}
      >
        {label}{required && <span style={{ color: TEAL }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-3.5 py-2.5 text-sm outline-none transition-all duration-200 rounded-lg"
        style={{
          border: `1.5px solid ${error ? '#e53e3e' : focused ? TEAL : 'rgba(10,31,61,0.12)'}`,
          color: NAVY,
          backgroundColor: focused ? '#fff' : '#f8f7f5',
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: focused ? `0 0 0 3px ${TEAL}18` : 'none',
        }}
      />
      {error && (
        <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: '#e53e3e' }}>
          <span className="w-3 h-3 rounded-full bg-red-100 flex items-center justify-center text-[8px] font-bold inline-flex">!</span>
          {error}
        </p>
      )}
    </div>
  );
}

function PillGroup({
  label, options, value, onChange, error,
}: {
  label: string; options: string[]; value: string;
  onChange: (v: string) => void; error?: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: 'rgba(10,31,61,0.5)' }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all duration-200"
            style={
              value === opt
                ? { backgroundColor: NAVY, color: '#fff', border: `1.5px solid ${NAVY}`, boxShadow: `0 2px 8px ${NAVY}30` }
                : { backgroundColor: 'transparent', color: 'rgba(10,31,61,0.45)', border: '1.5px solid rgba(10,31,61,0.12)' }
            }
          >
            {opt}
          </button>
        ))}
      </div>
      {error && <p className="text-[11px] mt-2" style={{ color: '#e53e3e' }}>{error}</p>}
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(LEAD_SUBMITTED_KEY) === '1') navigate('/brands', { replace: true });
  }, [navigate]);

  // Lock background scroll while the gate modal is up
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!name.trim()) e.name = 'Required';
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required';
      if (!phone.trim()) e.phone = 'Required';
    }
    if (step === 1) {
      if (!age) e.age = 'Select one';
      if (!gender) e.gender = 'Select one';
      if (!city.trim()) e.city = 'Required';
      if (!country) e.country = 'Select one';
    }
    if (step === 2) {
      if (categories.length === 0) e.categories = 'Select at least one';
      if (!consent) e.consent = 'Please accept to continue';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    if (step < 2) {
      setStep(s => s + 1);
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const { lead } = await api.submitLead({
        name, email, phone, ageGroup: age, gender, city, country, categories, consent,
      });
      localStorage.setItem(LEAD_SUBMITTED_KEY, '1');
      localStorage.setItem(USER_KEY, JSON.stringify({ name: lead.name, email: lead.email, categories: lead.categories }));
      navigate('/brands');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCat = (id: string) =>
    setCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const stepHeadlines = [
    { eyebrow: 'Step 1 of 3', title: ['Tell us a little', 'about yourself.'] },
    { eyebrow: 'Step 2 of 3', title: ['Where are', 'you based?'] },
    { eyebrow: 'Step 3 of 3', title: ['What are', 'you into?'] },
  ];

  return (
    <div className="min-h-screen relative" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── BACKGROUND: the brand index, dimmed and inert until unlocked ── */}
      <div aria-hidden="true" className="pointer-events-none select-none" style={{ filter: 'blur(3px) brightness(0.92)' }}>
        <BrandsPage />
      </div>

      {/* Tint overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'linear-gradient(135deg, rgba(10,31,61,0.72) 0%, rgba(20,184,166,0.35) 100%)' }}
      />

      {/* ── GATE MODAL ── */}
      <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-3 md:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md my-4 max-h-[94vh] overflow-y-auto rounded-2xl"
          style={{ backgroundColor: CREAM, boxShadow: '0 32px 80px rgba(10,31,61,0.35)' }}
        >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 md:px-7 pt-5 pb-1"
        >
          <AnphonicLogo className="h-6 w-auto" />
          <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: TEAL }}>
            Exclusive Access
          </span>
        </div>

        <div className="px-6 md:px-7 pb-6 pt-2">

          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-5">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-400"
                    style={{
                      backgroundColor: i < step ? TEAL : i === step ? NAVY : 'rgba(10,31,61,0.07)',
                      color: i <= step ? '#fff' : 'rgba(10,31,61,0.3)',
                      boxShadow: i === step ? `0 2px 12px ${NAVY}30` : i < step ? `0 2px 8px ${TEAL}40` : 'none',
                    }}
                  >
                    {i < step ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span
                    className="text-[8px] uppercase tracking-[0.18em] font-semibold hidden sm:block"
                    style={{ color: i === step ? NAVY : 'rgba(10,31,61,0.3)' }}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="h-px w-8 md:w-10 mx-1 mb-3.5 transition-all duration-500"
                    style={{ backgroundColor: i < step ? TEAL : 'rgba(10,31,61,0.1)' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`heading-${step}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4"
            >
              <p className="text-[9px] uppercase tracking-[0.3em] font-semibold mb-1.5" style={{ color: TEAL }}>
                {stepHeadlines[step].eyebrow}
              </p>
              <h1
                className="text-xl md:text-2xl font-light leading-[1.15]"
                style={{ color: NAVY, fontFamily: "'Fraunces', serif" }}
              >
                {stepHeadlines[step].title.join(' ')}
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* Form body */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`form-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <div className="space-y-3">
                  <FieldInput label="Full Name" value={name} onChange={setName} placeholder="Alex Johnson" error={errors.name} required />
                  <FieldInput label="Email Address" type="email" value={email} onChange={setEmail} placeholder="alex@example.com" error={errors.email} required />
                  <FieldInput label="Phone Number" type="tel" value={phone} onChange={setPhone} placeholder="+91 98765 43210" error={errors.phone} required />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <PillGroup label="Age Group *" options={AGE_SEGMENTS} value={age} onChange={setAge} error={errors.age} />
                  <PillGroup label="Gender *" options={GENDERS} value={gender} onChange={setGender} error={errors.gender} />
                  <div className="grid grid-cols-2 gap-3">
                    <FieldInput label="City" value={city} onChange={setCity} placeholder="Mumbai" error={errors.city} required />
                    <div>
                      <label
                        className="block text-[10px] uppercase tracking-[0.18em] font-semibold mb-1.5"
                        style={{ color: 'rgba(10,31,61,0.5)' }}
                      >
                        Country <span style={{ color: TEAL }}>*</span>
                      </label>
                      <select
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
                        style={{
                          border: `1.5px solid ${errors.country ? '#e53e3e' : 'rgba(10,31,61,0.12)'}`,
                          color: country ? NAVY : 'rgba(10,31,61,0.35)',
                          backgroundColor: '#f8f7f5',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                        onFocus={e => {
                          e.currentTarget.style.borderColor = TEAL;
                          e.currentTarget.style.backgroundColor = '#fff';
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${TEAL}18`;
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor = errors.country ? '#e53e3e' : 'rgba(10,31,61,0.12)';
                          e.currentTarget.style.backgroundColor = '#f8f7f5';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <option value="">Select country…</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.country && <p className="text-[11px] mt-1.5" style={{ color: '#e53e3e' }}>{errors.country}</p>}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(10,31,61,0.45)', fontWeight: 300 }}>
                    We'll surface the best exclusive codes for your taste. Pick as many as you like.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(cat => {
                      const active = categories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCat(cat.id)}
                          className="relative flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all duration-200"
                          style={
                            active
                              ? {
                                  backgroundColor: `${TEAL}10`,
                                  border: `1.5px solid ${TEAL}`,
                                  color: NAVY,
                                  boxShadow: `0 2px 12px ${TEAL}18`,
                                }
                              : {
                                  backgroundColor: 'rgba(255,255,255,0.6)',
                                  border: '1.5px solid rgba(10,31,61,0.08)',
                                  color: 'rgba(10,31,61,0.45)',
                                }
                          }
                        >
                          <div
                            className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200"
                            style={{
                              backgroundColor: active ? TEAL : 'transparent',
                              border: active ? 'none' : '1.5px solid rgba(10,31,61,0.12)',
                              opacity: active ? 1 : 0.4,
                            }}
                          >
                            {active && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-base leading-none">{cat.emoji}</span>
                          <span
                            className="text-[11px] font-semibold uppercase tracking-wider"
                            style={{ color: active ? NAVY : 'rgba(10,31,61,0.45)' }}
                          >
                            {cat.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.categories && <p className="text-[11px]" style={{ color: '#e53e3e' }}>{errors.categories}</p>}

                  <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={e => setConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 shrink-0 rounded cursor-pointer accent-current"
                      style={{ accentColor: TEAL }}
                    />
                    <span className="text-[11px] leading-relaxed" style={{ color: 'rgba(10,31,61,0.55)' }}>
                      I agree to be contacted by Anphonic Shop via email, SMS or WhatsApp about offers and consent to my details being stored for this purpose. <span style={{ color: TEAL }}>*</span>
                    </span>
                  </label>
                  {errors.consent && <p className="text-[11px]" style={{ color: '#e53e3e' }}>{errors.consent}</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div
            className="flex items-center justify-between mt-5 pt-4 border-t"
            style={{ borderColor: 'rgba(10,31,61,0.07)' }}
          >
            {step > 0 ? (
              <button
                onClick={() => { setErrors({}); setStep(s => s - 1); }}
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold transition-all duration-200"
                style={{ color: 'rgba(10,31,61,0.35)' }}
                onMouseEnter={e => (e.currentTarget.style.color = NAVY)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(10,31,61,0.35)')}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <span />
            )}

            <button
              onClick={handleNext}
              disabled={submitting}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold text-white px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: step === 2 ? TEAL : NAVY,
                boxShadow: step === 2 ? `0 4px 16px ${TEAL}40` : `0 4px 16px ${NAVY}30`,
              }}
            >
              {step === 2 ? (
                submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving…
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Get My Codes
                  </>
                )
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {submitError && (
            <p className="text-center text-[11px] mt-3 px-2 py-2 rounded-lg" style={{ color: '#e53e3e', backgroundColor: '#fff0f0', border: '1px solid #fecaca' }}>
              {submitError}
            </p>
          )}

          <p className="text-center text-[10px] mt-3 flex items-center justify-center gap-1.5" style={{ color: 'rgba(10,31,61,0.3)' }}>
            <Lock className="w-3 h-3" />
            Your details are private and never shared.
          </p>
        </div>
        </motion.div>
      </div>
    </div>
  );
}
