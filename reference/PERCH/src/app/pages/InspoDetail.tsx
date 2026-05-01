import { ArrowLeft, Share, MoreHorizontal, MapPin, Plus, Sparkles, Menu, X, FileText } from "lucide-react";
import { useParams, Link } from "react-router";
import { inspoBoards, inspoPlaces, users, currentUser } from "../data";
import { useState } from "react";

export function InspoDetail() {
  const { id } = useParams();
  const board = inspoBoards.find((b) => b.id === id);
  const owner = users.find((u) => u.id === board?.userId);
  
  // If it's the default "All" board, show all places for this user
  const boardPlaces = board?.isDefault 
    ? inspoPlaces.filter((p) => p.userId === board?.userId)
    : inspoPlaces.filter((p) => p.inspoBoardId === id);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  if (!board || !owner) return <div className="p-8 text-center text-gray-500">Inspo board not found.</div>;

  const categories = Array.from(new Set(boardPlaces.map(p => p.category)));

  const filteredPlaces = activeCategory === null
    ? boardPlaces
    : boardPlaces.filter(p => p.category === activeCategory);

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
        <img src={board.coverImage} alt={board.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-3 left-4 flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-gray-100/40 blur-[2px]"></div>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="relative w-10 h-10 rounded-full object-cover border-2 border-white shadow-md bg-white"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl leading-none drop-shadow-md text-white">{board.title}</h1>
            <p className="text-xs font-medium text-white/90 drop-shadow-sm mt-1">{boardPlaces.length} Places</p>
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
        {filteredPlaces.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-gray-400 text-sm">
            <Sparkles size={32} className="mx-auto mb-3 opacity-20" />
            No inspiration saved here yet.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 px-1">
            {filteredPlaces.map((place) => (
              <Link key={place.id} to={`/post/${place.id}`} className="block relative aspect-square overflow-hidden group rounded-2xl bg-gray-100">
                <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-2 pointer-events-none">
                  <h3 className="text-white text-xs leading-tight truncate w-full">{place.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
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
                <span className="text-[15px] text-gray-900">Share Board</span>
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
    </div>
  );
}
