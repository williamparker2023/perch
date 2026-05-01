import { MapPin, MessageCircle, Heart, Share, MoreHorizontal, X, Sparkles, Check, Plus, FileText } from "lucide-react";
import { places, users, collections, inspoBoards, currentUser } from "../data";
import { Link, useNavigate } from "react-router";
import { useState, useRef } from "react";
import clsx from "clsx";

export function Feed() {
  // Sort places to simulate a feed of recent activity
  const feedItems = places.map(p => {
    const user = users.find(u => u.id === p.userId)!;
    const collection = collections.find(c => c.id === p.collectionId)!;
    return { ...p, user, collection };
  }).reverse();

  return (
    <div className="min-h-full bg-white pb-20">
      <header className="bg-white px-4 py-3 sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Perch</h1>
        <div className="text-gray-900 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {/* Bird facing left (flipped horizontally) */}
            <g transform="scale(-1, 1) translate(-24, 0)">
              <path d="M16 7h.01" />
              <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
              <path d="m20 7 2 .5-2 .5" />
              <path d="M10 18v3" />
              <path d="M14 17.75V21" />
              <path d="M7 18a6 6 0 0 0 3.84-10.61" />
            </g>
            {/* Branch */}
            <path d="M2 21h20" />
            <path d="M22 21c-2-2-4-2-6 0" />
          </svg>
        </div>
      </header>

      <div className="w-full">
        {feedItems.map((item) => (
          <PostItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function PostItem({ item }: { item: any }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
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
      // Haptic feedback if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms hold for the menu
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Cancel long press if the user scrolls (moves more than 10px)
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
        // Navigation to post detail removed
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
    setTimeout(() => setShowHeartAnim(false), 800); // match animation length
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSaveSheet(true);
  };

  const handleSaveToBoard = (boardId: string) => {
    setSelectedBoardId(boardId);
    setIsSaved(true);
    setTimeout(() => {
      setShowSaveSheet(false);
    }, 600); // Show confirmation checkmark briefly before closing
  };

  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  return (
    <article className="pb-8 mb-2 pt-3 relative">
      {/* Header: User Info */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${item.user.id}`}>
            <img src={item.user.avatar} alt={item.user.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
          </Link>
          <div>
            <Link to={`/profile/${item.user.id}`} className="inline-block transition-transform hover:scale-105">
              <h3 className="text-[13px] font-bold text-gray-900 leading-tight">{item.user.handle}</h3>
            </Link>
            <p className="text-[11px] text-gray-500">
              <Link to={`/collection/${item.collection.id}`} className="font-normal text-black inline-block transition-transform hover:scale-105">{item.collection.title}: {item.name}</Link>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
        </div>
      </div>

      {/* Image: Edge-to-Edge with Interactions */}
      <div 
        className="relative w-full aspect-[4/5] bg-gray-50 cursor-pointer select-none"
        onPointerDown={handlePointerDown}
        onPointerUp={clearPress}
        onPointerLeave={clearPress}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        style={{ WebkitUserSelect: 'none' }} // Prevent text selection on hold
      >
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" draggable={false} />
        
        {/* Double Tap Heart Animation */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <Heart size={120} className="text-white fill-white drop-shadow-2xl animate-heart-pop" />
          </div>
        )}

        {/* Long Press Action Menu (Pinterest Style Bubbles) */}
        {showMenu && (
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-6 z-20 animate-in fade-in duration-200"
            onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} // Tap anywhere to dismiss
          >
            <button 
              className="flex flex-col items-center gap-2 group hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                setShowSaveSheet(true);
              }}
            >
              <div className="w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover:bg-white transition-colors">
                <Sparkles size={24} className="text-black" />
              </div>
              <span className="text-xs text-white tracking-wide drop-shadow-md">Save</span>
            </button>
            <button 
              className="flex flex-col items-center gap-2 group hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                // Trigger share action here
              }}
            >
              <div className="w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover:bg-white transition-colors">
                <Share size={24} className="text-black" />
              </div>
              <span className="text-xs text-white tracking-wide drop-shadow-md">Share</span>
            </button>
          </div>
        )}
      </div>

      {/* Action Bar & Content */}
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4 text-gray-800">
            <button onClick={() => setIsLiked(!isLiked)} className="transition-transform hover:scale-110 transform active:scale-95">
              <Heart size={24} className={clsx(isLiked ? "fill-red-500 text-red-500" : "text-black hover:text-gray-600")} />
            </button>
            <button onClick={() => setShowComments(!showComments)} className="transition-transform hover:scale-110 transform active:scale-95">
              <MessageCircle size={24} className="text-black hover:text-gray-600" />
            </button>
            <button className="transition-transform hover:scale-110 transform active:scale-95">
              <Share size={24} className="text-black hover:text-gray-600" />
            </button>
          </div>
          <button 
            className="transition-transform hover:scale-110 transform active:scale-95"
            onClick={handleSaveClick}
          >
            <Sparkles size={24} className={clsx(isSaved ? "fill-black text-black" : "text-black hover:text-gray-600")} />
          </button>
        </div>
        
        {item.notes && (
          <div className="text-[13px] text-gray-800 font-normal leading-normal mb-1">
            <span className="font-bold mr-1.5 cursor-pointer inline-block transition-transform hover:scale-105" onClick={() => navigate(`/profile/${item.user.id}`)}>{item.user.handle}</span>
            <span>
              {isCaptionExpanded || item.notes.length <= 90
                ? item.notes
                : item.notes.slice(0, 90)}
              {!isCaptionExpanded && item.notes.length > 90 && (
                <span className="text-gray-500 cursor-pointer ml-1" onClick={() => setIsCaptionExpanded(true)}>[...]</span>
              )}
            </span>
          </div>
        )}

        <button
          onClick={() => setShowComments(!showComments)}
          className="text-[12px] text-gray-500 font-normal mt-2 hover:text-gray-700 transition-colors"
        >
          {showComments ? "Hide comments" : "View all 2 comments"}
        </button>

        <div className="text-[12px] text-gray-500 mt-2 tracking-wide">
          {item.timestamp}
        </div>

        {/* Inline Comments Section */}
        {showComments && (
          <div className="mt-3 pt-3 border-t border-gray-100 animate-in fade-in duration-200">
            <div className="space-y-3 mb-3">
              <div className="text-[13px] leading-snug">
                <span className="font-bold mr-1.5 cursor-pointer inline-block transition-transform hover:scale-105" onClick={() => navigate('/profile/2')}>@miatravels</span>
                <span className="text-gray-800">Looks amazing! Need to go there.</span>
              </div>
              <div className="text-[13px] leading-snug">
                <span className="font-bold mr-1.5 cursor-pointer inline-block transition-transform hover:scale-105" onClick={() => navigate('/profile/3')}>@dkim</span>
                <span className="text-gray-800">Added to my saved list 🔥</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <img src={currentUser.avatar} alt="Current User" className="w-6 h-6 rounded-full object-cover border border-gray-200" />
              <input 
                type="text" 
                placeholder="Add a comment..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 text-[13px] bg-transparent outline-none placeholder-gray-400 py-1"
              />
              <button 
                className={clsx("text-[13px] transition-colors", newComment.trim() ? "text-blue-500 hover:text-blue-700" : "text-gray-300")}
                disabled={!newComment.trim()}
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes Modal */}
      {showNotesModal && item.notes && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowNotesModal(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowNotesModal(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-600 transition-transform hover:scale-110"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText size={20} className="text-gray-700" />
              </div>
              <h3 className="text-lg text-gray-900">Notes</h3>
            </div>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              {item.notes}
            </p>
            {item.category && (
              <div className="mt-5 inline-block bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide uppercase">
                {item.category}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveSheet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/15 backdrop-blur-sm"
            onClick={() => setShowSaveSheet(false)}
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
    </article>
  );
}
