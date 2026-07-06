import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ContentLayout } from '../components/ContentLayout';
import { categories } from '../data/brands';
import { api } from '../../lib/api';

const NAVY = '#0a1f3d';
const TEAL = '#009689';
const CATEGORY_OPTIONS = categories.filter(c => c !== 'All');

function Field({
  label, id, type = 'text', value, onChange, placeholder, error, required,
}: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; error?: string; required?: boolean;
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
        style={{ border: `1.5px solid ${error ? '#e53e3e' : 'rgba(10,31,61,0.14)'}`, color: NAVY, backgroundColor: '#fafbfd' }}
        onFocus={e => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.backgroundColor = '#fff'; }}
        onBlur={e => { e.currentTarget.style.borderColor = error ? '#e53e3e' : 'rgba(10,31,61,0.14)'; e.currentTarget.style.backgroundColor = '#fafbfd'; }}
      />
      {error && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{error}</p>}
    </div>
  );
}

function TextArea({
  label, id, value, onChange, placeholder, error, required, rows = 4,
}: {
  label: string; id: string; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; required?: boolean; rows?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-wider font-medium mb-2" style={{ color: NAVY }}>
        {label}{required && <span style={{ color: TEAL }}>*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 resize-none"
        style={{ border: `1.5px solid ${error ? '#e53e3e' : 'rgba(10,31,61,0.14)'}`, color: NAVY, backgroundColor: '#fafbfd' }}
        onFocus={e => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.backgroundColor = '#fff'; }}
        onBlur={e => { e.currentTarget.style.borderColor = error ? '#e53e3e' : 'rgba(10,31,61,0.14)'; e.currentTarget.style.backgroundColor = '#fafbfd'; }}
      />
      {error && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{error}</p>}
    </div>
  );
}

export function SubmitBrandPage() {
  const [brandName, setBrandName] = useState('');
  const [website, setWebsite] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [offerDetails, setOfferDetails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [done, setDone] = useState(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!brandName.trim()) e.brandName = 'Required';
    if (!website.trim() || !/^https?:\/\/.+\..+/.test(website.trim())) e.website = 'Enter a full URL, e.g. https://yourbrand.com';
    if (!contactName.trim()) e.contactName = 'Required';
    if (!contactEmail.trim() || !/\S+@\S+\.\S+/.test(contactEmail)) e.contactEmail = 'Valid email required';
    if (!category) e.category = 'Select a category';
    if (!description.trim()) e.description = 'Required';
    if (!offerDetails.trim()) e.offerDetails = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await api.submitBrand({
        brandName, website, contactName, contactEmail,
        contactPhone: contactPhone.trim() || undefined,
        category, description, offerDetails,
      });
      setDone(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <ContentLayout eyebrow="Submit a brand" title={<>Thanks for <em style={{ color: TEAL }}>reaching out.</em></>}>
        <div
          className="flex flex-col items-center text-center gap-4 py-12 px-6 rounded-2xl bg-white border"
          style={{ borderColor: 'rgba(10,31,61,0.08)', boxShadow: '0 4px 20px rgba(10,31,61,0.05)' }}
        >
          <div className="size-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${TEAL}12` }}>
            <CheckCircle2 className="size-7" style={{ color: TEAL }} />
          </div>
          <h2 className="text-xl font-semibold" style={{ color: NAVY }}>We've got your submission</h2>
          <p className="text-sm max-w-md" style={{ color: '#5a7a9a' }}>
            Our team reviews every brand by hand before it goes live on the index. If it's a fit,
            we'll follow up at the email you gave us.
          </p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      eyebrow="Submit a brand"
      title={<>Get listed on the <em style={{ color: TEAL }}>index.</em></>}
      subtitle="Run a D2C brand with a genuine offer for our members? Tell us about it below — every submission is reviewed by hand."
    >
      <div
        className="rounded-2xl p-6 md:p-8 bg-white border space-y-5"
        style={{ borderColor: 'rgba(10,31,61,0.08)', boxShadow: '0 4px 20px rgba(10,31,61,0.05)' }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Brand Name" id="brandName" value={brandName} onChange={setBrandName} placeholder="Caramelly" error={errors.brandName} required />
          <Field label="Website" id="website" value={website} onChange={setWebsite} placeholder="https://yourbrand.com" error={errors.website} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Contact Name" id="contactName" value={contactName} onChange={setContactName} placeholder="Your name" error={errors.contactName} required />
          <Field label="Contact Email" id="contactEmail" type="email" value={contactEmail} onChange={setContactEmail} placeholder="you@yourbrand.com" error={errors.contactEmail} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Contact Phone" id="contactPhone" type="tel" value={contactPhone} onChange={setContactPhone} placeholder="+91 98765 43210 (optional)" />
          <div>
            <label htmlFor="category" className="block text-xs uppercase tracking-wider font-medium mb-2" style={{ color: NAVY }}>
              Category<span style={{ color: TEAL }}>*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
              style={{ border: `1.5px solid ${errors.category ? '#e53e3e' : 'rgba(10,31,61,0.14)'}`, color: category ? NAVY : '#5a7a9a', backgroundColor: '#fafbfd' }}
            >
              <option value="">Select category…</option>
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{errors.category}</p>}
          </div>
        </div>
        <TextArea label="Tell us about your brand" id="description" value={description} onChange={setDescription} placeholder="What you make, who it's for, what makes it different." error={errors.description} required />
        <TextArea label="Your proposed offer" id="offerDetails" value={offerDetails} onChange={setOfferDetails} placeholder="e.g. 20% off storewide with code ANPHONIC20" error={errors.offerDetails} required rows={3} />

        {submitError && (
          <p className="text-sm px-4 py-3 rounded-lg" style={{ color: '#e53e3e', backgroundColor: '#fff0f0', border: '1px solid #fecaca' }}>
            {submitError}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold text-white px-7 py-3.5 rounded-full transition-all duration-200 hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: TEAL }}
        >
          {submitting ? 'Submitting…' : 'Submit for review'}
        </button>
      </div>
    </ContentLayout>
  );
}
