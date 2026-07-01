import { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import BoardSidebar from '../components/BoardSidebar';
import LinkCard from '../components/LinkCard';
import AddLinkModal from '../components/AddLinkModal';
import { getBoards, getLinks, createBoard } from '../api/client';

const breakpoints = { default: 4, 1280: 3, 1024: 2, 640: 1 };

export default function Home() {
  const [boards, setBoards] = useState([]);
  const [links, setLinks] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [showAddLink, setShowAddLink] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBoards().then(setBoards);
  }, []);

  useEffect(() => {
    setLoading(true);
    getLinks(activeBoardId).then(data => {
      setLinks(data);
      setLoading(false);
    });
  }, [activeBoardId]);

  async function handleBoardCreated(data) {
    const board = await createBoard(data);
    setBoards(prev => [board, ...prev]);
  }

  function handleBoardDeleted(id) {
    setBoards(prev => prev.filter(b => b.id !== id));
    if (activeBoardId === id) setActiveBoardId(null);
  }

  function handleLinkAdded(link) {
    setLinks(prev => [link, ...prev]);
    setBoards(prev => prev.map(b => {
      const isLinked = link.boards.some(lb => lb.boardId === b.id);
      return isLinked ? { ...b, _count: { links: (b._count?.links || 0) + 1 } } : b;
    }));
  }

  function handleLinkDeleted(id) {
    setLinks(prev => prev.filter(l => l.id !== id));
  }

  function handleLinkUpdated(updated) {
    setLinks(prev => prev.map(l => l.id === updated.id ? updated : l));
  }

  const activeBoard = boards.find(b => b.id === activeBoardId);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#faf8ff' }}>
      <BoardSidebar
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={setActiveBoardId}
        onBoardCreated={handleBoardCreated}
        onBoardDeleted={handleBoardDeleted}
      />

      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#3b2f6e' }}>
              {activeBoard ? activeBoard.name : 'All Links'}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#b8aad8' }}>
              {links.length} {links.length !== 1 ? 'links' : 'link'}
            </p>
          </div>
          <button
            onClick={() => setShowAddLink(true)}
            className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: '#a78bfa', boxShadow: '0 4px 14px rgba(167,139,250,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#8b5cf6'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#a78bfa'}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Link
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid #ede9fe', borderTopColor: '#a78bfa' }} />
          </div>
        ) : links.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#ede9fe' }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#a78bfa" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <p className="font-semibold mb-1" style={{ color: '#6d4fc0' }}>No links here yet</p>
            <p className="text-sm" style={{ color: '#b8aad8' }}>Right-click any link in Chrome or use the + button above</p>
          </div>
        ) : (
          <Masonry breakpointCols={breakpoints} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
            {links.map(link => (
              <LinkCard
                key={link.id}
                link={link}
                boards={boards}
                onDeleted={handleLinkDeleted}
                onUpdated={handleLinkUpdated}
              />
            ))}
          </Masonry>
        )}
      </main>

      {showAddLink && (
        <AddLinkModal
          boards={boards}
          onAdded={handleLinkAdded}
          onClose={() => setShowAddLink(false)}
        />
      )}
    </div>
  );
}
