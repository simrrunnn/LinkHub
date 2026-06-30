import { useState } from 'react';
import { deleteLink, updateLinkBoards } from '../api/client';

export default function LinkCard({ link, boards, onDeleted, onUpdated }) {
  const [showBoards, setShowBoards] = useState(false);

  const domain = (() => { try { return new URL(link.url).hostname.replace('www.', ''); } catch { return ''; } })();
  const assignedIds = link.boards.map(lb => lb.boardId);

  async function handleDelete() {
    if (!confirm('Remove this link?')) return;
    await deleteLink(link.id);
    onDeleted(link.id);
  }

  async function toggleBoard(boardId) {
    const next = assignedIds.includes(boardId)
      ? assignedIds.filter(id => id !== boardId)
      : [...assignedIds, boardId];
    const updated = await updateLinkBoards(link.id, next);
    onUpdated(updated);
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-100">
      {link.image && (
        <a href={link.url} target="_blank" rel="noopener noreferrer">
          <img
            src={link.image}
            alt={link.title || ''}
            className="w-full object-cover max-h-52"
            onError={e => { e.target.style.display = 'none'; }}
          />
        </a>
      )}

      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          {link.favicon && <img src={link.favicon} alt="" className="w-4 h-4 rounded-sm" onError={e => e.target.remove()} />}
          <span className="text-xs text-gray-400 truncate">{domain}</span>
        </div>

        <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
          {link.title && (
            <p className="text-sm font-semibold text-gray-800 leading-snug mb-1 line-clamp-2 hover:text-indigo-600 transition-colors">
              {link.title}
            </p>
          )}
          {link.description && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{link.description}</p>
          )}
          {!link.title && !link.description && (
            <p className="text-xs text-indigo-500 truncate">{link.url}</p>
          )}
        </a>

        {link.boards.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {link.boards.map(lb => (
              <span
                key={lb.boardId}
                className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                style={{ backgroundColor: lb.board?.color || '#6366f1' }}
              >
                {lb.board?.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
          <button
            onClick={() => setShowBoards(!showBoards)}
            className="text-xs text-gray-400 hover:text-indigo-500 transition-colors"
          >
            {showBoards ? 'Close' : 'Add to board'}
          </button>
          <button onClick={handleDelete} className="text-xs text-gray-300 hover:text-red-400 transition-colors">
            Delete
          </button>
        </div>

        {showBoards && (
          <div className="mt-2 flex flex-col gap-1">
            {boards.map(board => (
              <label key={board.id} className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 hover:text-gray-800">
                <input
                  type="checkbox"
                  checked={assignedIds.includes(board.id)}
                  onChange={() => toggleBoard(board.id)}
                  className="accent-indigo-500"
                />
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: board.color }} />
                {board.name}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
