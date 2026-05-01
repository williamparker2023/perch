import { Settings, Edit3, Grid, Plus, Menu, LayoutGrid, FileText } from "lucide-react";
import { currentUser, collections, places, users } from "../data";
import { Link, useParams } from "react-router";
import { useState } from "react";
import clsx from "clsx";

export function Profile() {
  const { id } = useParams();
  const profileUser = id ? users.find(u => u.id === id) || currentUser : currentUser;
  const isOwnProfile = profileUser.id === currentUser.id;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [tab, setTab] = useState<"boards" | "posts">("boards");

  // Filter collections - show all if own profile, only public if viewing someone else
  const userCollections = collections.filter(c =>
    c.userId === profileUser.id && (isOwnProfile || c.isPublic)
  );

  // Filter posts - show all if own profile, only posts from public boards if viewing someone else
  const userPosts = places.filter(p => {
    if (p.userId !== profileUser.id) return false;
    if (isOwnProfile) return true;
    const board = collections.find(c => c.id === p.collectionId);
    return board?.isPublic;
  });

  return (
    <div className="min-h-full bg-white pb-20">
      <header className="px-4 py-3 sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-tight">{profileUser.handle}</h1>
        {isOwnProfile && (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center p-1 rounded-full transition-transform hover:scale-110"
            >
              <Menu size={22} className="text-gray-900" />
            </button>

            {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 z-40 py-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 mb-1">
                  <span className="text-xs text-gray-500 tracking-wider">account</span>
                </div>
                <Link
                  to="/profile/edit"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-[15px] hover:bg-gray-50 transition-colors text-gray-800"
                >
                  <Edit3 size={20} className="text-gray-500" />
                  Edit Profile
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[15px] hover:bg-gray-50 transition-colors text-left text-gray-800"
                >
                  <ShareIcon size={20} className="text-gray-500" />
                  Share Profile
                </button>
                <div className="h-px bg-gray-100 my-1 mx-4"></div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[15px] hover:bg-gray-50 transition-colors text-left text-gray-800"
                >
                  <Settings size={20} className="text-gray-500" />
                  Settings
                </button>
              </div>
            </>
            )}
          </div>
        )}
      </header>

      {/* Profile Banner with photo on top */}
      <div className="relative h-36 overflow-hidden border-b border-gray-200">
        <img
          src={profileUser.banner}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20"></div>

        {/* Profile Picture */}
        <div className="absolute bottom-3 left-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-gray-100/40 blur-[2px]"></div>
            <img
              src={profileUser.avatar}
              alt={profileUser.name}
              className="relative w-10 h-10 rounded-full object-cover border-2 border-white shadow-md bg-white"
            />
          </div>
        </div>

        {/* Stats on banner */}
        <div className="absolute bottom-3 right-4 flex gap-4 text-right">
          <div className="flex flex-col">
            <span className="text-sm text-white drop-shadow-md">{profileUser.followers}</span>
            <span className="text-[11px] text-white/90 tracking-wide drop-shadow-md">flock</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white drop-shadow-md">{profileUser.following}</span>
            <span className="text-[11px] text-white/90 tracking-wide drop-shadow-md">following</span>
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="px-4 py-4">
        {/* Name */}
        <div className="mb-1">
          <h2 className="text-lg font-bold leading-tight">{profileUser.name}</h2>
        </div>

        {/* Bio */}
        {profileUser.bio && (
          <div className="mb-4">
            <p className="text-sm text-black whitespace-pre-wrap leading-relaxed">
              {profileUser.bio}
            </p>
          </div>
        )}
      </div>

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
            {userCollections.map((col) => (
              <Link key={col.id} to={`/collection/${col.id}`} className="block relative aspect-[5/3] overflow-hidden group rounded-xl">
                <img src={col.coverImage} alt={col.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-3">
                  <h3 className="text-white text-sm leading-tight truncate w-full">{col.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 px-1">
            {userPosts.map((post) => {
              const board = collections.find(c => c.id === post.collectionId);
              return (
                <Link key={post.id} to={`/post/${post.id}`} className="block relative aspect-square overflow-hidden group rounded-2xl bg-gray-100">
                  <img src={post.image} alt={post.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-2 pointer-events-none">
                    <p className="text-gray-400 text-[10px] leading-tight truncate w-full">{board?.title}</p>
                    <h3 className="text-white text-xs leading-tight truncate w-full">{post.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 left-0 mx-auto max-w-md pointer-events-none z-50">
        <div className="relative w-full h-0">
          <div className="absolute bottom-0 right-4 pointer-events-auto">
            {isCreateMenuOpen && (
              <>
                <div className="fixed inset-0 z-40 pointer-events-auto" onClick={() => setIsCreateMenuOpen(false)} />
                <div className="absolute bottom-full right-0 mb-4 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden flex flex-col w-48 animate-in slide-in-from-bottom-2 fade-in duration-200">
                  <Link to="/collection/new" className="px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-3">
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

function ShareIcon(props: any) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
}
