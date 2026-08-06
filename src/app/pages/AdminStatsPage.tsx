import { useEffect, useState } from 'react';
import { api, type BrandStat } from '../../lib/api';
import { brands } from '../data/brands';

const NAVY = '#0a1f3d';
const TEAL = '#009689';
const ADMIN_KEY_STORAGE = 'anphonic_admin_key';

const brandNames = new Map(brands.map(b => [b.id, b.name]));

export function AdminStatsPage() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem(ADMIN_KEY_STORAGE) ?? '');
  const [keyInput, setKeyInput] = useState('');
  const [stats, setStats] = useState<BrandStat[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const downloadLeads = async () => {
    setExporting(true);
    setError('');
    try {
      const blob = await api.exportLeadsCsv(adminKey);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not export leads');
    } finally {
      setExporting(false);
    }
  };

  const load = (key: string) => {
    setLoading(true);
    setError('');
    api
      .getStats(key)
      .then(res => {
        setStats(res.stats);
        localStorage.setItem(ADMIN_KEY_STORAGE, key);
        setAdminKey(key);
      })
      .catch(err => {
        localStorage.removeItem(ADMIN_KEY_STORAGE);
        setAdminKey('');
        setError(err instanceof Error ? err.message : 'Could not load stats');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (adminKey) load(adminKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!adminKey) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (keyInput.trim()) load(keyInput.trim());
          }}
          className="w-full max-w-sm space-y-3 p-6 rounded-xl border"
          style={{ borderColor: 'rgba(10,31,61,0.12)' }}
        >
          <h1 className="text-lg font-medium" style={{ color: NAVY }}>Admin key required</h1>
          <input
            type="password"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            placeholder="Admin key"
            className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none"
            style={{ border: '1.5px solid rgba(10,31,61,0.12)' }}
            autoFocus
          />
          {error && <p className="text-xs" style={{ color: '#e53e3e' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: NAVY }}
          >
            {loading ? 'Checking…' : 'View stats'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium" style={{ color: NAVY }}>Click & conversion stats</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={downloadLeads}
              disabled={exporting}
              className="text-xs font-semibold uppercase tracking-wider disabled:opacity-60"
              style={{ color: TEAL }}
            >
              {exporting ? 'Exporting…' : 'Download leads (CSV)'}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem(ADMIN_KEY_STORAGE);
                setAdminKey('');
                setStats(null);
              }}
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'rgba(10,31,61,0.4)' }}
            >
              Sign out
            </button>
          </div>
        </div>

        {loading && <p className="text-sm" style={{ color: 'rgba(10,31,61,0.5)' }}>Loading…</p>}
        {error && <p className="text-sm" style={{ color: '#e53e3e' }}>{error}</p>}

        {stats && (
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'rgba(10,31,61,0.1)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left" style={{ backgroundColor: 'rgba(10,31,61,0.03)' }}>
                  <th className="px-4 py-3 font-medium" style={{ color: NAVY }}>Brand</th>
                  <th className="px-4 py-3 font-medium text-right" style={{ color: NAVY }}>Total clicks</th>
                  <th className="px-4 py-3 font-medium text-right" style={{ color: NAVY }}>Monthly clicks</th>
                </tr>
              </thead>
              <tbody>
                {stats.map(row => (
                  <tr key={row.brandId} className="border-t" style={{ borderColor: 'rgba(10,31,61,0.06)' }}>
                    <td className="px-4 py-3" style={{ color: NAVY }}>
                      {brandNames.get(row.brandId) ?? row.brandId}
                    </td>
                    <td className="px-4 py-3 text-right">{row.totalClicks}</td>
                    <td className="px-4 py-3 text-right" style={{ color: TEAL }}>{row.monthlyClicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
