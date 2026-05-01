import { Search, MapPin, Hash, Users, X, Heart, Sparkles, Share, Check, Plus, FileText } from "lucide-react";
import { collections, places, users, inspoBoards, currentUser } from "../data";
import { Link, useNavigate } from "react-router";
import { useState, useRef } from "react";
import clsx from "clsx";

export function Explore() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fixed categories matching the New Post screen
  const CATEGORIES = ["Do Local", "Fitness", "Food", "Museum", "Shops", "Sights", "Other"];
  const allTags = [...CATEGORIES];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const showAll = selectedTags.length === 0;

  const filteredPlaces = places.filter(place => {
    const isNotOwnPost = place.userId !== currentUser.id;
    const matchesCategory = showAll || selectedTags.includes(place.category);
    const matchesSearch = searchQuery.trim() === "" ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (place.description && place.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return isNotOwnPost && matchesCategory && matchesSearch;
  });

  const searchedUsers = searchQuery.trim() !== "" 
    ? users.filter(u => u.handle.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="min-h-full bg-white pb-20">
      <header className="px-4 py-3 sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-100 flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Perch"
            className="w-full bg-gray-100 border border-transparent rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {allTags.map(tag => (
            <TabButton 
              key={tag}
              active={selectedTags.includes(tag)} 
              onClick={() => toggleTag(tag)} 
              label={tag} 
            />
          ))}
        </div>
      </header>

      <div className="p-4 columns-2 gap-4 space-y-4">
        {searchedUsers.map(user => (
          <Link key={user.id} to={`/profile/${user.id}`} className="block break-inside-avoid mb-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm text-center flex flex-col items-center gap-2 group">
            <img src={user.avatar} className="w-16 h-16 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"/>
            <div>
              <div className="text-sm text-gray-900">{user.name}</div>
              <div className="text-xs text-gray-500">{user.handle}</div>
            </div>
          </Link>
        ))}

        {filteredPlaces.map((place) => (
          <ExplorePostItem key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
}

function ExplorePostItem({ place }: { place: typeof places[0] }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSaveSheet, setShowSaveSheet] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const startY = useRef<number>(0);

  const userInspoBoards = inspoBoards.filter(b => b.userId === currentUser.id);

  const clearPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY;
    pressTimer.current = setTimeout(() => {
      setShowMenu(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (Math.abs(e.clientY - startY.current) > 10) {
      clearPress();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (showMenu) return; // Don't navigate if menu is open
    
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      handleDoubleClick();
    } else {
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
        navigate(`/post/${place.id}`);
      }, 250);
    }
  };

  const handleDoubleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    setIsLiked(true);
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const handleSaveToBoard = (boardId: string) => {
    setSelectedBoardId(boardId);
    setTimeout(() => {
      setShowSaveSheet(false);
    }, 600);
  };

  return (
    <div className="block break-inside-avoid mb-4 group cursor-pointer relative select-none">
      <div 
        className="relative rounded-xl overflow-hidden bg-gray-100 shadow-sm mb-2"
        onPointerDown={handlePointerDown}
        onPointerUp={clearPress}
        onPointerLeave={clearPress}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        style={{ WebkitUserSelect: 'none' }}
      >
        <img src={place.image} alt={place.name} className="w-full h-auto object-cover group-hover:opacity-90 transition-opacity" draggable={false} />

        <div className="absolute top-2 right-2 p-1.5 z-10">
          <Heart size={16} strokeWidth={2.5} className={clsx("transition-colors drop-shadow-md", isLiked ? "text-red-500 fill-red-500" : "text-white")} />
        </div>

        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <Heart size={80} className="text-white fill-white drop-shadow-2xl animate-heart-pop" />
          </div>
        )}

        {showMenu && (
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-4 z-20 animate-in fade-in duration-200"
            onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
          >
            <button 
              className="flex flex-col items-center gap-1.5 group/btn hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                setShowSaveSheet(true);
              }}
            >
              <div className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover/btn:bg-white transition-colors">
                <Sparkles size={18} className="text-black" />
              </div>
              <span className="text-[10px] text-white tracking-wide drop-shadow-md">Save</span>
            </button>
            <button 
              className="flex flex-col items-center gap-1.5 group/btn hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                // Trigger share action here
              }}
            >
              <div className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover/btn:bg-white transition-colors">
                <Share size={18} className="text-black" />
              </div>
              <span className="text-[10px] text-white tracking-wide drop-shadow-md">Share</span>
            </button>
          </div>
        )}
      </div>
      <h4 className="text-xs line-clamp-1">{place.name}</h4>
      <p className="text-[10px] text-gray-500 font-normal capitalize tracking-wider">{place.category}</p>

      {/* Save Modal */}
      {showSaveSheet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/15 backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); setShowSaveSheet(false); }}
          />
          <div className="relative z-50 w-full max-w-[380px] animate-in zoom-in-95 duration-200">
            <div className="bg-slate-200 border border-slate-300 p-4 rounded-[32px] flex flex-col gap-3 shadow-2xl max-h-[70vh] overflow-hidden">
              <div className="flex items-center justify-between mb-1 px-2 shrink-0">
                <h1 className="text-xl text-gray-900 drop-shadow-sm">Save to Inspo</h1>
                <button
                  onClick={() => setShowSaveSheet(false)}
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

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors border ${
        active ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
      }`}
    >
      {label}
      {active && <X size={12} className="ml-0.5 opacity-60 hover:opacity-100" />}
    </button>
  );
}

function HeartIcon(props: any) {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
}