import { useState } from 'react';
import { deleteBoard } from '../api/client';

export default function BoardSidebar({ boards, activeBoardId, onSelectBoard, onBoardCreated, onBoardDeleted }) {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#a78bfa');

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await onBoardCreated({ name, color });
    setName('');
    setColor('#a78bfa');
    setShowInput(false);
  }

  async function handleDelete(e, id) {
    e.stopPropagation();
    if (!confirm('Delete this board? Links saved only here will become unsorted.')) return;
    await deleteBoard(id);
    onBoardDeleted(id);
  }

  return (
    <aside className="w-64 shrink-0 min-h-screen p-4 flex flex-col border-r" style={{ backgroundColor: '#f2effe', borderColor: '#e4ddf8' }}>
      <div className="flex items-center gap-2.5 mb-8 px-1 pt-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ddd6fe' }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h1 className="text-base font-bold tracking-tight" style={{ color: '#4c3a8f' }}>Links Manager</h1>
      </div>

      <button
        onClick={() => onSelectBoard(null)}
        className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 flex items-center gap-2.5"
        style={
          activeBoardId === null
            ? { backgroundColor: '#ede9fe', color: '#6d28d9' }
            : { color: '#9585c8' }
        }
        onMouseEnter={e => { if (activeBoardId !== null) e.currentTarget.style.backgroundColor = '#ede9fe'; }}
        onMouseLeave={e => { if (activeBoardId !== null) e.currentTarget.style.backgroundColor = ''; }}
      >
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        All Links
      </button>

      <div className="mt-5 mb-2 px-3 text-xs font-semibold uppercase tracking-widest" style={{ color: '#b8aad8' }}>Boards</div>

      <div className="flex flex-col gap-0.5 flex-1">
        {boards.map(board => (
          <div
            key={board.id}
            onClick={() => onSelectBoard(board.id)}
            className="group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all"
            style={
              activeBoardId === board.id
                ? { backgroundColor: '#ede9fe', color: '#6d28d9' }
                : { color: '#9585c8' }
            }
            onMouseEnter={e => { if (activeBoardId !== board.id) e.currentTarget.style.backgroundColor = '#ede9fe'; }}
            onMouseLeave={e => { if (activeBoardId !== board.id) e.currentTarget.style.backgroundColor = ''; }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: board.color }}
              />
              <span className="truncate font-medium">{board.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: '#c4b5fd' }}>{board._count?.links ?? ''}</span>
              <button
                onClick={(e) => handleDelete(e, board.id)}
                className="opacity-0 group-hover:opacity-100 transition-all leading-none hover:text-red-400"
                style={{ color: '#c4b5fd' }}
                title="Delete board"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {showInput ? (
          <form onSubmit={handleCreate} className="mt-2 flex flex-col gap-2 px-1">
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Board name"
              className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder-violet-300"
              style={{ backgroundColor: '#ede9fe', border: '1px solid #ddd6fe', color: '#4c3a8f', '--tw-ring-color': '#c4b5fd' }}
            />
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <button
                type="submit"
                className="flex-1 text-white text-sm rounded-xl py-2 font-medium transition-colors"
                style={{ backgroundColor: '#a78bfa' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#8b5cf6'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#a78bfa'}
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowInput(false)}
                className="text-sm px-2 transition-colors"
                style={{ color: '#b8aad8' }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="mt-1 w-full text-left px-3 py-2.5 text-sm rounded-xl transition-all"
            style={{ color: '#b8aad8' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ede9fe'; e.currentTarget.style.color = '#7c3aed'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '#b8aad8'; }}
          >
            + New Board
          </button>
        )}
      </div>

      <div className="pt-4 mt-4" style={{ borderTop: '1px solid #e4ddf8' }}>
        <p className="text-xs px-1" style={{ color: '#c4b5fd' }}>Right-click any link in Chrome to save</p>
      </div>
    </aside>
  );
}
