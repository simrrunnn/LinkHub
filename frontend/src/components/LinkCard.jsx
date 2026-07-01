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
    <div
      className="bg-white rounded-2xl overflow-hidden transition-all duration-200 group hover:-translate-y-0.5"
      style={{ border: '1px solid #ede9fe', boxShadow: '0 1px 4px rgba(167,139,250,0.08)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(167,139,250,0.18)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(167,139,250,0.08)'}
    >
      {link.image && (
        <a href={link.url} target="_blank" rel="noopener noreferrer">
          <div className="overflow-hidden" style={{ backgroundColor: '#f5f2ff' }}>
            <img
              src={link.image}
              alt={link.title || ''}
              loading="lazy"
              className="w-full object-cover max-h-52 group-hover:scale-[1.02] transition-transform duration-300"
              onError={e => { e.target.parentElement.style.display = 'none'; }}
            />
          </div>
        </a>
      )}

      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          {link.favicon && (
            <img src={link.favicon} alt="" loading="lazy" className="w-4 h-4 rounded-sm shrink-0" onError={e => e.target.remove()} />
          )}
          <span className="text-xs truncate font-medium" style={{ color: '#c4b5fd' }}>{domain}</span>
        </div>

        <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
          {link.title && (
            <p className="text-sm font-semibold leading-snug mb-1.5 line-clamp-2 transition-colors" style={{ color: '#3b2f6e' }}
              onMouseEnter={e => e.currentTarget.style.color = '#7c3aed'}
              onMouseLeave={e => e.currentTarget.style.color = '#3b2f6e'}
            >
              {link.title}
            </p>
          )}
          {link.description && (
            <p className="text-xs line-clamp-3 leading-relaxed" style={{ color: '#9d91c0' }}>{link.description}</p>
          )}
          {!link.title && !link.description && (
            <p className="text-xs truncate font-medium" style={{ color: '#a78bfa' }}>{link.url}</p>
          )}
        </a>

        {link.boards.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {link.boards.map(lb => (
              <span
                key={lb.boardId}
                className="text-xs px-2.5 py-0.5 rounded-full text-white font-medium opacity-85"
                style={{ backgroundColor: lb.board?.color || '#a78bfa' }}
              >
                {lb.board?.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #f5f2ff' }}>
          <button
            onClick={() => setShowBoards(!showBoards)}
            className="text-xs font-medium transition-colors"
            style={{ color: '#c4b5fd' }}
            onMouseEnter={e => e.currentTarget.style.color = '#7c3aed'}
            onMouseLeave={e => e.currentTarget.style.color = '#c4b5fd'}
          >
            {showBoards ? 'Close' : '+ Board'}
          </button>
          <button
            onClick={handleDelete}
            className="text-xs transition-colors"
            style={{ color: '#ddd6fe' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = '#ddd6fe'}
          >
            Delete
          </button>
        </div>

        {showBoards && (
          <div className="mt-2.5 flex flex-col gap-1.5 rounded-xl p-2.5" style={{ backgroundColor: '#faf8ff' }}>
            {boards.map(board => (
              <label key={board.id} className="flex items-center gap-2.5 cursor-pointer text-xs transition-colors" style={{ color: '#9585c8' }}>
                <input
                  type="checkbox"
                  checked={assignedIds.includes(board.id)}
                  onChange={() => toggleBoard(board.id)}
                  className="w-3.5 h-3.5 accent-violet-400"
                />
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: board.color }} />
                <span className="font-medium">{board.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
