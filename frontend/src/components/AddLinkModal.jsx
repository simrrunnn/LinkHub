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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Save a Link</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            autoFocus
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          {boards.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">Add to boards (optional)</p>
              <div className="flex flex-wrap gap-2">
                {boards.map(board => (
                  <button
                    key={board.id}
                    type="button"
                    onClick={() => toggleBoard(board.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      selectedBoards.includes(board.id)
                        ? 'text-white border-transparent'
                        : 'text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                    style={selectedBoards.includes(board.id) ? { backgroundColor: board.color, borderColor: board.color } : {}}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: board.color }} />
                    {board.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-500 text-white text-sm rounded-xl hover:bg-indigo-600 disabled:opacity-60 transition-colors font-medium"
            >
              {loading ? 'Fetching preview…' : 'Save Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
