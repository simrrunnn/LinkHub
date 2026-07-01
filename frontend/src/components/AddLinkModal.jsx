import { useState } from 'react';
import { createLink } from '../api/client';

export default function AddLinkModal({ boards, onAdded, onClose }) {
  const [url, setUrl] = useState('');
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function toggleBoard(id) {
    setSelectedBoards(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    try {
      const link = await createLink({ url: url.trim(), boardIds: selectedBoards });
      onAdded(link);
      onClose();
    } catch {
      setError('Failed to save link. Check the URL and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(59,47,110,0.35)', backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" style={{ border: '1px solid #ede9fe' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#3b2f6e' }}>Save a Link</h2>
            <p className="text-xs mt-0.5" style={{ color: '#b8aad8' }}>Paste a URL to save and preview it</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all text-xl leading-none"
            style={{ color: '#c4b5fd' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f2ff'; e.currentTarget.style.color = '#7c3aed'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '#c4b5fd'; }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            autoFocus
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none placeholder-violet-300 transition-all"
            style={{ border: '1px solid #ddd6fe', color: '#3b2f6e', '--tw-ring-color': '#c4b5fd' }}
            onFocus={e => e.target.style.borderColor = '#a78bfa'}
            onBlur={e => e.target.style.borderColor = '#ddd6fe'}
          />

          {boards.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2.5 uppercase tracking-wider" style={{ color: '#c4b5fd' }}>Add to boards</p>
              <div className="flex flex-wrap gap-2">
                {boards.map(board => (
                  <button
                    key={board.id}
                    type="button"
                    onClick={() => toggleBoard(board.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                    style={
                      selectedBoards.includes(board.id)
                        ? { backgroundColor: board.color, borderColor: board.color, color: 'white' }
                        : { backgroundColor: '#faf8ff', borderColor: '#ddd6fe', color: '#9585c8' }
                    }
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: selectedBoards.includes(board.id) ? 'rgba(255,255,255,0.7)' : board.color }}
                    />
                    {board.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-lg" style={{ color: '#ef4444', backgroundColor: '#fff1f2' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="flex gap-2.5 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium transition-colors rounded-xl"
              style={{ color: '#b8aad8' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f2ff'; e.currentTarget.style.color = '#7c3aed'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '#b8aad8'; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-white text-sm rounded-xl disabled:opacity-60 transition-all font-semibold"
              style={{ backgroundColor: '#a78bfa', boxShadow: '0 4px 14px rgba(167,139,250,0.35)' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#8b5cf6'; }}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#a78bfa'}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Fetching…
                </span>
              ) : 'Save Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
