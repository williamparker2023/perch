import { X, PlusSquare, LayoutGrid, Sparkles } from "lucide-react";
import { Link } from "react-router";

export function CreateSelection({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/15 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-50 p-4 animate-in slide-in-from-bottom-8 duration-300 pb-24">
        <div className="bg-slate-200 border border-slate-300 p-4 rounded-[32px] flex flex-col gap-3 shadow-2xl">
          <div className="flex items-center justify-between mb-1 px-2">
            <h1 className="text-xl text-gray-900 drop-shadow-sm">Create</h1>
            <button onClick={onClose} className="p-1.5 bg-slate-300 rounded-full transition-transform hover:scale-110 text-gray-700 shadow-sm">
              <X size={20} />
            </button>
          </div>

          <Link 
            to="/board/new" 
            className="bg-white backdrop-blur-3xl p-3.5 rounded-2xl flex items-center gap-3.5 hover:bg-gray-50 transition-all group shadow-sm"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <LayoutGrid size={20} className="text-gray-900" />
            </div>
            <div className="text-left flex-1">
              <h2 className="text-[15px] text-gray-900 leading-tight">Add Board</h2>
              <p className="text-[13px] text-gray-500 mt-0.5">Create a collection for a trip or city</p>
            </div>
          </Link>

          <Link 
            to="/post/select-board" 
            className="bg-white backdrop-blur-3xl p-3.5 rounded-2xl flex items-center gap-3.5 hover:bg-gray-50 transition-all group shadow-sm"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <PlusSquare size={20} className="text-gray-900" />
            </div>
            <div className="text-left flex-1">
              <h2 className="text-[15px] text-gray-900 leading-tight">Add Post</h2>
              <p className="text-[13px] text-gray-500 mt-0.5">Document a new place you visited</p>
            </div>
          </Link>

          <Link 
            to="/inspo/new" 
            className="bg-white backdrop-blur-3xl p-3.5 rounded-2xl flex items-center gap-3.5 hover:bg-gray-50 transition-all group shadow-sm"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Sparkles size={20} className="text-gray-900" />
            </div>
            <div className="text-left flex-1">
              <h2 className="text-[15px] text-gray-900 leading-tight">Get Inspo</h2>
              <p className="text-[13px] text-gray-500 mt-0.5">Get inspiration for your future plans</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
