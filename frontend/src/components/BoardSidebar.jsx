import { useState } from 'react';
import { deleteBoard } from '../api/client';

export default function BoardSidebar({ boards, activeBoardId, onSelectBoard, onBoardCreated, onBoardDeleted }) {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await onBoardCreated({ name, color });
    setName('');
    setColor('#6366f1');
    setShowInput(false);
  }

  async function handleDelete(e, id) {
    e.stopPropagation();
    if (!confirm('Delete this board? Links saved only here will become unsorted.')) return;
    await deleteBoard(id);
    onBoardDeleted(id);
  }

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col gap-1">
      <h1 className="text-xl font-bold text-gray-800 mb-4 px-2">Links Manager</h1>

      <button
        onClick={() => onSelectBoard(null)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeBoardId === null ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        All Links
      </button>

      <div className="mt-3 mb-1 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Boards</div>

      {boards.map(board => (
        <div
          key={board.id}
          onClick={() => onSelectBoard(board.id)}
          className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
            activeBoardId === board.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: board.color }} />
            <span className="truncate font-medium">{board.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">{board._count?.links ?? ''}</span>
            <button
              onClick={(e) => handleDelete(e, board.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all ml-1"
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
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <div className="flex items-center gap-2">
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
            <button type="submit" className="flex-1 bg-indigo-500 text-white text-sm rounded-lg py-1.5 hover:bg-indigo-600 transition-colors">
              Create
            </button>
            <button type="button" onClick={() => setShowInput(false)} className="text-gray-400 hover:text-gray-600 text-sm px-2">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="mt-2 w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          + New Board
        </button>
      )}
    </aside>
  );
}
