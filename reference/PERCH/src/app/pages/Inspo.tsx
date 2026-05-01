import { Plus, Sparkles, LayoutGrid, Grid, Info, X } from "lucide-react";
import { currentUser, inspoBoards, inspoPlaces } from "../data";
import { Link } from "react-router";
import { useState } from "react";
import clsx from "clsx";

export function Inspo() {
  const [tab, setTab] = useState<"boards" | "posts">("boards");
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const userInspoBoards = inspoBoards.filter(b => b.userId === currentUser.id && !b.isDefault);
  const userInspoPosts = inspoPlaces.filter(p => {
    const board = inspoBoards.find(b => b.id === p.inspoBoardId);
    return p.userId === currentUser.id && board && !board.isDefault;
  });

  return (
    <div className="min-h-full bg-white pb-20">
      <header className="px-4 py-3 sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-gray-900" size={24} />
          <h1 className="text-xl tracking-tight">Inspo</h1>
        </div>
        <button
          onClick={() => setShowInfoModal(true)}
          className="p-2 rounded-full transition-transform hover:scale-110"
        >
          <Info size={20} className="text-gray-600" />
        </button>
      </header>

      <div className="flex border-t border-gray-100 mb-1 sticky top-[46px] bg-white z-10">
        <button
          onClick={() => setTab("boards")}
          className="flex-1 py-3 flex justify-center text-sm transition-colors relative"
        >
          <span className={clsx(
            "relative pb-0.5 transition-colors",
            tab === "boards" ? "text-black" : "text-gray-400 hover:text-gray-600"
          )}>
            Boards
            {tab === "boards" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></span>
            )}
          </span>
        </button>
        <button
          onClick={() => setTab("posts")}
          className="flex-1 py-3 flex justify-center text-sm transition-colors relative"
        >
          <span className={clsx(
            "relative pb-0.5 transition-colors",
            tab === "posts" ? "text-black" : "text-gray-400 hover:text-gray-600"
          )}>
            Posts
            {tab === "posts" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></span>
            )}
          </span>
        </button>
      </div>

      <div className="p-1">
        {tab === "boards" ? (
          <div className="grid grid-cols-2 gap-2 px-1">
            {userInspoBoards.map((board) => (
              <Link key={board.id} to={`/inspo/${board.id}`} className="block relative aspect-[5/3] overflow-hidden group rounded-xl">
                <img src={board.coverImage} alt={board.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-3">
                  <h3 className="text-white text-sm leading-tight truncate w-full">{board.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 px-1">
            {userInspoPosts.map((post) => {
              const board = inspoBoards.find(b => b.id === post.inspoBoardId);
              return (
                <Link key={post.id} to={`/post/${post.id}`} className="block relative aspect-square overflow-hidden group rounded-md bg-gray-100">
                  <img src={post.image} alt={post.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-2">
                    <p className="text-gray-400 text-[10px] leading-tight truncate w-full">{board?.title}</p>
                    <h3 className="text-white text-xs leading-tight truncate w-full">{post.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowInfoModal(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-600 transition-transform hover:scale-110"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Sparkles size={20} className="text-gray-700" />
              </div>
              <h3 className="text-lg text-gray-900">About Inspo</h3>
            </div>
            <div className="text-[15px] text-gray-700 leading-relaxed space-y-3">
              <p>
                <strong>Inspo</strong> is your personal inspiration collection for places and trips you want to experience.
              </p>
              <p>
                Save posts from your feed or search to custom boards. Organize your dream destinations, favorite spots, and travel plans all in one place.
              </p>
              <p className="text-sm text-gray-600 mt-4">
                Tap the <strong>+</strong> button to create a new board or add a post to your collection.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 left-0 mx-auto max-w-md pointer-events-none z-50">
        <div className="relative w-full h-0">
          <div className="absolute bottom-0 right-4 pointer-events-auto">
            {isCreateMenuOpen && (
              <>
                <div className="fixed inset-0 z-40 pointer-events-auto" onClick={() => setIsCreateMenuOpen(false)} />
                <div className="absolute bottom-full right-0 mb-4 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden flex flex-col w-48 animate-in slide-in-from-bottom-2 fade-in duration-200">
                  <Link to="/inspo/new" className="px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                    <LayoutGrid size={18} className="text-gray-500" /> New Board
                  </Link>
                  <Link to="/post/select-board" className="px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 flex items-center gap-3">
                    <Grid size={18} className="text-gray-500" /> New Post
                  </Link>
                </div>
              </>
            )}
            <button
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className="w-10 h-10 bg-black/80 backdrop-blur-md text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95 relative z-50"
            >
              <Plus size={20} className={clsx("transition-transform duration-200", isCreateMenuOpen ? "rotate-45" : "rotate-0")} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
