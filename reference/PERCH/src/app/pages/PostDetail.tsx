import { ArrowLeft, MessageCircle, Heart, Share, Sparkles, MapPin, X, Check, Plus, FileText } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useState, useRef } from "react";
import { places, users, collections, inspoBoards, currentUser, inspoPlaces, postDetailStreamPlaces } from "../data";
import clsx from "clsx";

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  let initialPlace = places.find(p => p.id === id);
  let isFromInspo = false;
  
  if (!initialPlace) {
    initialPlace = inspoPlaces.find(p => p.id === id);
    isFromInspo = true;
  }

  if (!initialPlace) {
    initialPlace = postDetailStreamPlaces.find(p => p.id === id);
    if (!initialPlace) {
      return <div className="p-8 text-center">Post not found</div>;
    }
  }

  const otherPlaces = postDetailStreamPlaces.filter(p => p.id !== initialPlace?.id);
  const feedStream = [initialPlace, ...otherPlaces];

  return (
    <div className="min-h-full bg-white pb-20 animate-in slide-in-from-right duration-300">
      <header className="px-4 py-3 flex items-center bg-white z-10 sticky top-0">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 transition-transform hover:scale-110 text-black drop-shadow-sm pointer-events-auto">
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
      </header>

      <div className="w-full">
        {feedStream.map((place, idx) => (
          <PostDetailItem key={`${place.id}-${idx}`} place={place} isFromInspo={isFromInspo && idx === 0} />
        ))}
      </div>
    </div>
  );
}

function PostDetailItem({ place, isFromInspo }: { place: any, isFromInspo: boolean }) {
  const user = users.find(u => u.id === place?.userId)! || currentUser;
  const collection = isFromInspo 
    ? inspoBoards.find(c => c.id === (place as any).inspoBoardId) 
    : collections.find(c => c.id === (place as any).collectionId);
  const item = { ...place, user, collection } as any;

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSaveSheet, setShowSaveSheet] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);

  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const startY = useRef<number>(0);

  const userInspoBoards = inspoBoards.filter(b => b.userId === currentUser.id);
  const isOwnPost = item.user.id === currentUser.id;

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

  const handleDoubleClick = () => {
    setIsLiked(true);
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
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
    }, 600);
  };

  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);

  // Mock comments
  const mockComments = [
    { id: 1, user: users[1], text: "This place is amazing! Added to my list.", time: "2h" },
    { id: 2, user: users[2], text: "The food there is top notch 👌", time: "5h" }
  ];

  return (
    <>
      <article className="pb-8 mb-2 pt-3 relative">
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
                <Link to={isFromInspo ? `/inspo/${item.collection?.id}` : `/collection/${item.collection?.id}`} className="font-normal text-black inline-block transition-transform hover:scale-105">{item.collection?.title}</Link>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-normal capitalize tracking-wider flex items-center gap-1">
              {item.category}
            </div>
          </div>
        </div>

        <div 
          className="relative w-full aspect-[4/5] bg-gray-50 cursor-pointer select-none"
          onPointerDown={handlePointerDown}
          onPointerUp={clearPress}
          onPointerLeave={clearPress}
          onPointerMove={handlePointerMove}
          onDoubleClick={handleDoubleClick}
          style={{ WebkitUserSelect: 'none' }}
        >
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" draggable={false} />
          
          {showHeartAnim && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <Heart size={120} className="text-white fill-white drop-shadow-2xl animate-heart-pop" />
            </div>
          )}

          {showMenu && (
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-6 z-20 animate-in fade-in duration-200"
              onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
            >
              {!isOwnPost && (
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
              )}
              <button
                className="flex flex-col items-center gap-2 group hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
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

        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4 text-gray-800">
              <button onClick={() => setIsLiked(!isLiked)} className="transition-transform hover:scale-110 transform active:scale-95">
                <Heart size={26} className={clsx(isLiked ? "fill-red-500 text-red-500" : "text-black hover:text-gray-600")} />
              </button>
              <button onClick={() => setShowComments(!showComments)} className="transition-transform hover:scale-110 transform active:scale-95">
                <MessageCircle size={26} className={clsx(showComments ? "fill-black text-black" : "text-black hover:text-gray-600")} />
              </button>
              <button className="transition-transform hover:scale-110 transform active:scale-95">
                <Share size={26} className="text-black hover:text-gray-600" />
              </button>
            </div>
            {!isOwnPost && (
              <button
                className="transition-transform hover:scale-110 transform active:scale-95"
                onClick={handleSaveClick}
              >
                <Sparkles size={26} className={clsx(isSaved ? "fill-black text-black" : "text-black hover:text-gray-600")} />
              </button>
            )}
          </div>
          
          <h4 className="text-base text-gray-900 mb-1">{item.name}</h4>

          {item.notes && (
            <div className="text-sm text-gray-800 font-normal leading-relaxed mb-2">
              <span className="font-bold mr-2">{item.user.handle}</span>
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
            className="text-sm text-gray-500 font-medium mt-2 hover:text-gray-700"
          >
            {showComments ? "Hide comments" : "View all 2 comments"}
          </button>
          
          {showComments && (
            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              {mockComments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <img src={comment.user.avatar} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <div>
                    <p className="text-sm">
                      <span className="font-bold mr-2">{comment.user.handle}</span>
                      {comment.text}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{comment.time}</p>
                  </div>
                </div>
              ))}
              
              <div className="flex items-center gap-3 mt-4 pt-2">
                <img src={currentUser.avatar} className="w-8 h-8 rounded-full object-cover shrink-0" />
                <input 
                  type="text" 
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
                <button className="text-sm text-blue-600">Post</button>
              </div>
            </div>
          )}

          <div className="text-[11px] text-gray-500 mt-4 tracking-wide">
            {item.timestamp}
          </div>
        </div>
      </article>

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
          </div>
        </div>
      )}

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
    </>
  );
}