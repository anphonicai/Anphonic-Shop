import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Check, ChevronRight, ArrowLeft, Copy, CheckCircle2, Tag } from 'lucide-react';
import { brands } from '../data/brands';
import { ImageWithFallback } from './figma/ImageWithFallback';

const NAVY = '#0a1f3d';
const TEAL = '#009689';

interface FormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  city: string;
  state: string;
  country: string;
  categories: string[];
}

const INITIAL: FormData = {
  name: '', email: '', phone: '',
  age: '', gender: '',
  city: '', state: '', country: '',
  categories: [],
};

const AGE_SEGMENTS = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'];
const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const COUNTRIES = ['United Kingdom', 'United States', 'India', 'Australia', 'Canada', 'Singapore', 'UAE', 'Other'];

const CATEGORIES = [
  { id: 'Skincare', label: 'Skincare', emoji: '✨' },
  { id: 'Wellness', label: 'Wellness', emoji: '🌿' },
  { id: 'Fashion', label: 'Fashion', emoji: '👗' },
  { id: 'Home', label: 'Home', emoji: '🏠' },
  { id: 'Footwear', label: 'Footwear', emoji: '👟' },
  { id: 'Coffee', label: 'Coffee', emoji: '☕' },
  { id: 'Accessories', label: 'Accessories', emoji: '💼' },
];

const STEPS = ['Your Info', 'Location', 'Preferences', 'Your Offers'];

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-10 overflow-hidden">
      <div className="flex items-center mb-3">
        {STEPS.map((label, i) => (
          <div key={label} className={`flex items-center gap-1.5 ${i < total - 1 ? 'flex-1' : 'shrink-0'}`}>
            <div
              className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-400"
              style={{
                backgroundColor: i < step ? TEAL : i === step ? NAVY : 'rgba(10,31,61,0.08)',
                color: i <= step ? '#fff' : '#5a7a9a',
              }}
            >
              {i < step ? <Check className="size-3" /> : i + 1}
            </div>
            <span
              className="text-[11px] uppercase tracking-wider font-medium hidden sm:block truncate"
              style={{ color: i === step ? NAVY : '#5a7a9a', opacity: i === step ? 1 : 0.6 }}
            >
              {label}
            </span>
            {i < total - 1 && (
              <div
                className="flex-1 h-px mx-2 min-w-[16px]"
                style={{ backgroundColor: i < step ? TEAL : 'rgba(10,31,61,0.1)' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({
  label, id, type = 'text', value, onChange, placeholder, required,
}: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-wider font-medium mb-2" style={{ color: NAVY }}>
        {label}{required && <span style={{ color: TEAL }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
        style={{
          border: `1.5px solid rgba(10,31,61,0.14)`,
          color: NAVY,
          backgroundColor: '#fafbfd',
          fontFamily: "'DM Sans', sans-serif",
        }}
        onFocus={e => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.backgroundColor = '#fff'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(10,31,61,0.14)'; e.currentTarget.style.backgroundColor = '#fafbfd'; }}
      />
    </div>
  );
}

function PillSelect({
  label, options, value, onChange,
}: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider font-medium mb-3" style={{ color: NAVY }}>{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200"
            style={
              value === opt
                ? { backgroundColor: NAVY, color: '#fff', border: `1.5px solid ${NAVY}` }
                : { backgroundColor: 'transparent', color: '#5a7a9a', border: '1.5px solid rgba(10,31,61,0.14)' }
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function OfferCard({ brand, index }: { brand: typeof brands[0]; index: number }) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, delay: index * 0.1, ease: 'power3.out' }
    );
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(brand.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl overflow-hidden border flex flex-col"
      style={{ borderColor: 'rgba(10,31,61,0.09)', boxShadow: '0 4px 24px rgba(10,31,61,0.07)' }}
    >
      <div className="aspect-[4/3] overflow-hidden relative" style={{ backgroundColor: brand.logo ? '#f5f8fa' : '#eef2f7' }}>
        {brand.logo ? (
          <div className="size-full flex items-center justify-center p-8">
            <img src={brand.logo} alt={`${brand.name} logo`} className="max-h-full max-w-full object-contain" style={{ maxHeight: '120px' }} />
          </div>
        ) : (
          <ImageWithFallback src={brand.image} alt={brand.name} className="size-full object-cover" />
        )}
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)' }}
        >
          <CheckCircle2 className="size-3" style={{ color: TEAL }} />
          <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: NAVY }}>Verified</span>
        </div>
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium text-white"
          style={{ backgroundColor: `${NAVY}dd` }}
        >
          {brand.category}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-semibold mb-1" style={{ color: NAVY }}>{brand.name}</h3>
        <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: '#5a7a9a' }}>{brand.description}</p>

        <div className="rounded-lg p-3 mb-3" style={{ backgroundColor: `${TEAL}0f`, border: `1px dashed ${TEAL}55` }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Tag className="size-3" style={{ color: TEAL }} />
            <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: TEAL }}>Exclusive offer</span>
          </div>
          <p className="text-sm font-medium" style={{ color: NAVY }}>{brand.discount}</p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex-1 rounded-lg px-3 py-2.5 text-center border-2 border-dashed"
            style={{ borderColor: `${TEAL}45` }}
          >
            <span className="font-mono text-sm tracking-[0.22em] font-semibold" style={{ color: NAVY }}>
              {brand.code}
            </span>
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-white transition-all duration-200"
            style={{ backgroundColor: copied ? TEAL : NAVY, minWidth: '80px', justifyContent: 'center' }}
          >
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface LeadCaptureFormProps {
  /**
   * When provided the form skips the in-form done screen and instead calls
   * this with the submitted data so the parent can navigate to a full page.
   */
  onComplete?: (data: { name: string; categories: string[] }) => void;
  /** Legacy prop kept for standalone section usage */
  onDismiss?: () => void;
}

export function LeadCaptureForm({ onComplete, onDismiss }: LeadCaptureFormProps = {}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [done, setDone] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const set = (key: keyof FormData) => (val: string) => setForm(f => ({ ...f, [key]: val }));
  const toggleCat = (cat: string) =>
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat],
    }));

  const slideOut = (dir: 1 | -1, cb: () => void) => {
    if (!panelRef.current) { cb(); return; }
    gsap.to(panelRef.current, {
      opacity: 0, x: dir * -60, duration: 0.28, ease: 'power2.in',
      onComplete: () => {
        cb();
        gsap.fromTo(panelRef.current, { opacity: 0, x: dir * 60 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' });
      },
    });
  };

  const validateStep0 = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep1 = () => {
    const e: Partial<FormData> = {};
    if (!form.age) e.age = 'Required';
    if (!form.gender) e.gender = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.country) e.country = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && form.categories.length === 0) { setErrors({ categories: ['Pick at least one'] }); return; }
    setErrors({});
    if (step < 3) slideOut(1, () => setStep(s => s + 1));
  };

  const back = () => {
    setErrors({});
    slideOut(-1, () => setStep(s => s - 1));
  };

  const submit = () => {
    if (form.categories.length === 0) { setErrors({ categories: ['Pick at least one'] }); return; }
    setErrors({});
    if (onComplete) {
      // Hand off to parent — parent navigates to full offers page
      slideOut(1, () => onComplete({ name: form.name, categories: form.categories }));
    } else {
      slideOut(1, () => { setStep(3); setDone(true); });
    }
  };

  useEffect(() => {
    if (done && sectionRef.current) {
      setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [done]);

  const matchedBrands = brands.filter(b => form.categories.includes(b.category));

  const renderStep = () => {
    if (step === 0) return (
      <div className="space-y-5">
        <Input label="Full Name" id="name" value={form.name} onChange={set('name')} placeholder="Alex Johnson" required />
        {errors.name && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{errors.name}</p>}
        <Input label="Email Address" id="email" type="email" value={form.email} onChange={set('email')} placeholder="alex@example.com" required />
        {errors.email && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{errors.email}</p>}
        <Input label="Phone Number" id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+44 7700 000000" required />
        {errors.phone && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{errors.phone}</p>}
      </div>
    );

    if (step === 1) return (
      <div className="space-y-6">
        <PillSelect label="Age Segment *" options={AGE_SEGMENTS} value={form.age} onChange={set('age')} />
        {errors.age && <p className="text-xs" style={{ color: '#e53e3e' }}>Required</p>}
        <PillSelect label="Gender *" options={GENDERS} value={form.gender} onChange={set('gender')} />
        {errors.gender && <p className="text-xs" style={{ color: '#e53e3e' }}>Required</p>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input label="City" id="city" value={form.city} onChange={set('city')} placeholder="London" required />
            {errors.city && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>Required</p>}
          </div>
          <div>
            <Input label="State / Region" id="state" value={form.state} onChange={set('state')} placeholder="England" />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider font-medium mb-2" style={{ color: NAVY }}>
            Country <span style={{ color: TEAL }}>*</span>
          </label>
          <select
            value={form.country}
            onChange={e => set('country')(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
            style={{ border: '1.5px solid rgba(10,31,61,0.14)', color: form.country ? NAVY : '#5a7a9a', backgroundColor: '#fafbfd', fontFamily: "'DM Sans', sans-serif" }}
            onFocus={e => { e.currentTarget.style.borderColor = TEAL; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(10,31,61,0.14)'; }}
          >
            <option value="">Select country…</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.country && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>Required</p>}
        </div>
      </div>
    );

    if (step === 2) return (
      <div className="space-y-5">
        <p className="text-sm" style={{ color: '#5a7a9a' }}>
          Select the categories you're interested in. We'll reveal exclusive codes tailored for you.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.map(cat => {
            const active = form.categories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCat(cat.id)}
                className="relative flex flex-col items-center gap-2 px-3 py-4 rounded-xl border-2 transition-all duration-200"
                style={
                  active
                    ? { backgroundColor: `${NAVY}0c`, borderColor: TEAL, color: NAVY }
                    : { backgroundColor: 'transparent', borderColor: 'rgba(10,31,61,0.12)', color: '#5a7a9a' }
                }
              >
                {active && (
                  <span
                    className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: TEAL }}
                  >
                    <Check className="size-2.5 text-white" />
                  </span>
                )}
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium uppercase tracking-wider">{cat.label}</span>
              </button>
            );
          })}
        </div>
        {(errors as any).categories && (
          <p className="text-xs" style={{ color: '#e53e3e' }}>Please select at least one category.</p>
        )}
      </div>
    );

    return null;
  };

  if (done) {
    return (
      <section ref={sectionRef} id="offers" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: 'rgba(10,31,61,0.08)', boxShadow: '0 8px 48px rgba(10,31,61,0.07)' }}
          >
            {/* Header strip */}
            <div
              className="px-8 md:px-14 py-12 text-center border-b"
              style={{ backgroundColor: '#f8fafd', borderColor: 'rgba(10,31,61,0.07)' }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium mb-5"
                style={{ backgroundColor: `${TEAL}12`, color: TEAL }}
              >
                <CheckCircle2 className="size-4" />
                Offers unlocked for {form.name.split(' ')[0]}
              </div>
              <h2
                className="text-4xl md:text-5xl font-light leading-tight mb-3"
                style={{ color: NAVY, fontFamily: "'Fraunces', serif" }}
              >
                Your personalised{' '}
                <em style={{ color: TEAL }}>exclusive codes.</em>
              </h2>
              <p className="text-sm max-w-md mx-auto" style={{ color: '#5a7a9a' }}>
                Based on your preferences — {form.categories.join(', ')}. All codes are verified and active.
              </p>
            </div>

            {/* Offer grid */}
            <div className="p-8 md:p-12 bg-white">
              {matchedBrands.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedBrands.map((brand, i) => (
                    <OfferCard key={brand.id} brand={brand} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-sm" style={{ color: '#5a7a9a' }}>
                  No brands matched your selection yet — check back soon.
                </div>
              )}

              {/* CTA */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 pt-8 border-t"
                style={{ borderColor: 'rgba(10,31,61,0.07)' }}
              >
                <button
                  onClick={() => { setDone(false); setStep(2); setForm(f => ({ ...f, categories: [] })); }}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium px-6 py-3 rounded-full border-2 transition-all duration-200"
                  style={{ borderColor: NAVY, color: NAVY }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = NAVY; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = NAVY; }}
                >
                  <ArrowLeft className="size-3" /> Change preferences
                </button>
                {onDismiss && (
                  <button
                    onClick={onDismiss}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-white px-6 py-3 rounded-full transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: TEAL }}
                  >
                    Browse all brands →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="get-codes" className="py-24 px-6 bg-white">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: TEAL }}>
            Get your codes
          </p>
          <h2
            className="text-3xl md:text-4xl font-light leading-tight"
            style={{ color: NAVY, fontFamily: "'Fraunces', serif" }}
          >
            {step === 0 && 'Tell us a little about yourself.'}
            {step === 1 && 'Where are you based?'}
            {step === 2 && 'What are you into?'}
          </h2>
        </div>

        <div
          className="rounded-2xl p-8 md:p-10 border"
          style={{ backgroundColor: '#fff', borderColor: 'rgba(10,31,61,0.07)', boxShadow: '0 8px 40px rgba(10,31,61,0.07)' }}
        >
          <ProgressBar step={step} total={STEPS.length} />

          <div ref={panelRef}>
            {renderStep()}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: 'rgba(10,31,61,0.07)' }}>
            {step > 0 ? (
              <button
                onClick={back}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-medium transition-opacity"
                style={{ color: '#5a7a9a' }}
              >
                <ArrowLeft className="size-3.5" /> Back
              </button>
            ) : (
              <span />
            )}

            {step < 2 ? (
              <button
                onClick={next}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-white px-7 py-3 rounded-full transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: NAVY }}
              >
                Continue <ChevronRight className="size-3.5" />
              </button>
            ) : (
              <button
                onClick={submit}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-white px-7 py-3 rounded-full transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: TEAL }}
              >
                Reveal my offers <ChevronRight className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: '#5a7a9a' }}>
          🔒 Your details are kept private and never sold.
        </p>
      </div>
    </section>
  );
}
