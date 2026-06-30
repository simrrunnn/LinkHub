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
    <div className="flex min-h-screen">
      <BoardSidebar
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={setActiveBoardId}
        onBoardCreated={handleBoardCreated}
        onBoardDeleted={handleBoardDeleted}
      />

      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeBoard ? activeBoard.name : 'All Links'}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">{links.length} link{links.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowAddLink(true)}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            + Add Link
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">Loading…</div>
        ) : links.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-gray-400 text-lg mb-2">No links here yet</p>
            <p className="text-gray-300 text-sm">Right-click any link in Chrome or use the + button above</p>
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
