import { ArrowLeft, Share, MoreHorizontal, MapPin, Plus, Sparkles, Menu, X, FileText, Check } from "lucide-react";
import { useParams, Link } from "react-router";
import { collections, places, users, currentUser, inspoBoards } from "../data";
import { useState } from "react";

export function CollectionDetail() {
  const { id } = useParams();
  const collection = collections.find((c) => c.id === id);
  const collectionPlaces = places.filter((p) => p.collectionId === id);
  const owner = users.find((u) => u.id === collection?.userId);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showSaveSheet, setShowSaveSheet] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [savingPlaceId, setSavingPlaceId] = useState<string | null>(null);
  const isOwnBoard = owner?.id === currentUser.id;

  const userInspoBoards = inspoBoards.filter(b => b.userId === currentUser.id);

  const handleSaveClick = (e: React.MouseEvent, placeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSavingPlaceId(placeId);
    setShowSaveSheet(true);
  };

  const handleSaveToBoard = (boardId: string) => {
    setSelectedBoardId(boardId);
    setTimeout(() => {
      setShowSaveSheet(false);
      setSavingPlaceId(null);
    }, 600);
  };

  if (!collection || !owner) return <div className="p-8 text-center text-gray-500">Collection not found.</div>;

  const categories = Array.from(new Set(collectionPlaces.map(p => p.category)));

  const filteredPlaces = activeCategory === null
    ? collectionPlaces
    : collectionPlaces.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-full bg-white pb-20 flex flex-col">
      {/* Header Sticky */}
      <header className="px-4 py-3 sticky top-0 bg-white/90 backdrop-blur-md z-20 flex items-center justify-between border-b border-gray-100">
        <Link to={-1 as any} className="p-2 -ml-2 rounded-full transition-transform hover:scale-110 text-black">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex gap-2 text-gray-800">
          <button 
            className="p-2 rounded-full transition-transform hover:scale-110"
            onClick={() => setShowMenu(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-40 overflow-hidden mb-6 flex-shrink-0 border-b border-gray-100">
        <img src={collection.coverImage} alt={collection.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-3 left-4 flex items-center gap-3">
          <Link to={`/profile/${owner.id}`} className="hover:scale-105 transition-transform shrink-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-gray-100/40 blur-[2px]"></div>
              <img src={owner.avatar} alt="Profile" className="relative w-10 h-10 rounded-full object-cover border-2 border-white shadow-md bg-white" />
            </div>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-2xl leading-none drop-shadow-md text-white">{collection.title}</h1>
            <p className="text-xs font-medium text-white/90 drop-shadow-sm mt-1">{collectionPlaces.length} Posts</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      {categories.length > 0 && (
        <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide py-1 sticky top-[46px] bg-white z-10 border-b border-gray-50">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors border ${
                activeCategory === cat ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Content Grid */}
      <div className="p-1">
        <div className="grid grid-cols-3 gap-2 px-1">
          {filteredPlaces.map((place) => (
            <Link key={place.id} to={`/post/${place.id}`} className="block relative aspect-square overflow-hidden group rounded-2xl bg-gray-100">
              <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

              {!isOwnBoard && (
                <button
                  onClick={(e) => handleSaveClick(e, place.id)}
                  className="absolute top-2 right-2 bg-black/50 backdrop-blur-md p-1.5 rounded-full text-white cursor-pointer hover:bg-black/80 transition-colors z-10"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-2 pointer-events-none">
                <h3 className="text-white text-xs leading-tight truncate w-full">{place.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Action Button for New Post */}
      <div className="fixed bottom-[88px] left-0 right-0 max-w-md mx-auto pointer-events-none z-50 flex justify-end px-4">
        <Link 
          to={`/post/new?boardId=${collection.id}`} 
          className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-xl hover:bg-gray-800 hover:scale-105 transition-all pointer-events-auto"
        >
          <Plus size={28} />
        </Link>
      </div>

      {showMenu && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowMenu(false)}
          />
          <div className="relative bg-white rounded-t-3xl pb-10 overflow-hidden flex flex-col animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-center pt-3 pb-2 w-full absolute top-0 bg-white z-10">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-6 pt-8 pb-4 flex justify-between items-center border-b border-gray-100 bg-white shrink-0">
              <h2 className="text-xl tracking-tight">Options</h2>
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 bg-gray-100 rounded-full text-gray-600 transition-transform hover:scale-110"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left group">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
                  <Share size={20} className="text-gray-900" />
                </div>
                <span className="text-[15px] text-gray-900">Share Collection</span>
              </button>
              <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left group">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
                  <MoreHorizontal size={20} className="text-gray-900" />
                </div>
                <span className="text-[15px] text-gray-900">More Options</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveSheet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/15 backdrop-blur-sm"
            onClick={() => { setShowSaveSheet(false); setSavingPlaceId(null); }}
          />
          <div className="relative z-50 w-full max-w-[380px] animate-in zoom-in-95 duration-200">
            <div className="bg-slate-200 border border-slate-300 p-4 rounded-[32px] flex flex-col gap-3 shadow-2xl max-h-[70vh] overflow-hidden">
              <div className="flex items-center justify-between mb-1 px-2 shrink-0">
                <h1 className="text-xl text-gray-900 drop-shadow-sm">Save to Inspo</h1>
                <button
                  onClick={() => { setShowSaveSheet(false); setSavingPlaceId(null); }}
                  className="p-1.5 bg-slate-300 rounded-full transition-transform hover:scale-110 text-gray-700 shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Boards List */}
              <div className="overflow-y-auto flex flex-col gap-3">
                {/* Create new inspo - always first */}
                <Link
                  to="/inspo/new"
                  className="bg-white backdrop-blur-3xl p-3.5 rounded-2xl flex items-center gap-3.5 hover:bg-gray-50 transition-all group shadow-sm"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                    <Plus size={20} className="text-gray-900" />
                  </div>
                  <div className="text-left flex-1">
                    <h2 className="text-[15px] text-gray-900 leading-tight">Create new inspo</h2>
                  </div>
                </Link>

                {/* Custom boards */}
                {userInspoBoards.filter(board => !board.isDefault).map(board => (
                  <button
                    key={board.id}
                    onClick={() => handleSaveToBoard(board.id)}
                    className="bg-white backdrop-blur-3xl p-3.5 rounded-2xl flex items-center gap-3.5 hover:bg-gray-50 transition-all group shadow-sm text-left"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <img src={board.coverImage} alt={board.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-[15px] text-gray-900 leading-tight">{board.title}</h2>
                      <p className="text-[13px] text-gray-500 mt-0.5">Custom Board</p>
                    </div>
                    {selectedBoardId === board.id ? (
                      <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center animate-in zoom-in duration-200 shrink-0">
                        <Check size={14} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-gray-400 transition-colors shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
