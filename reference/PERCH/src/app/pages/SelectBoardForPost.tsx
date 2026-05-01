import { ArrowLeft, ChevronRight, Plus, ArrowUpDown, Check } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { collections, currentUser } from "../data";
import { useState } from "react";
import clsx from "clsx";

type SortOrder = "alphabetical" | "date_added" | "last_accessed";

export function SelectBoardForPost() {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<SortOrder>("last_accessed");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const userCollections = collections.filter((c) => c.userId === currentUser.id);

  const sortedCollections = [...userCollections].sort((a, b) => {
    if (sortOrder === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    if (sortOrder === "date_added") {
      return a.id.localeCompare(b.id);
    }
    // Simulate "last accessed" with reverse ID order for mock data
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="min-h-full bg-white flex flex-col h-full animate-in slide-in-from-bottom duration-300 relative">
      <header className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white z-20 sticky top-0">
        <div className="flex items-center gap-3 text-lg">
          <Link to={-1 as any} className="p-2 -ml-2 rounded-full transition-transform hover:scale-110 text-black">
            <ArrowLeft size={24} />
          </Link>
          Select Board
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            className="p-2 -mr-2 rounded-full transition-transform hover:scale-110 text-black flex items-center justify-center"
          >
            <ArrowUpDown size={20} />
          </button>

          {isSortMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-30"
                onClick={() => setIsSortMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 z-40 py-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 mb-1">
                  <span className="text-xs text-gray-500 tracking-wider">sort by</span>
                </div>
                {[
                  { id: "last_accessed", label: "Last Accessed" },
                  { id: "date_added", label: "Date Added" },
                  { id: "alphabetical", label: "Alphabetical" }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortOrder(option.id as SortOrder);
                      setIsSortMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-[15px] font-medium hover:bg-gray-50 transition-colors text-left text-gray-800"
                  >
                    {option.label}
                    {sortOrder === option.id && <Check size={18} className="text-black" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-gray-500 mb-4 px-2">Choose a board to add your new post to:</p>
        
        <div className="flex flex-col gap-3">
          <Link 
            to="/board/new" 
            className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200 group-hover:scale-105 transition-transform shadow-sm">
                <Plus size={20} className="text-black" />
              </div>
              <span className="text-gray-900">Create New Board</span>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-black transition-colors" />
          </Link>

          {sortedCollections.map(collection => (
            <button
              key={collection.id}
              onClick={() => navigate(`/post/new?boardId=${collection.id}`)}
              className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={collection.coverImage} 
                  alt={collection.title} 
                  className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" 
                />
                <div className="text-left">
                  <h3 className="text-gray-900">{collection.title}</h3>
                  <p className="text-xs text-gray-500">{collection.isPublic ? "Public" : "Private"}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400 group-hover:text-black transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}