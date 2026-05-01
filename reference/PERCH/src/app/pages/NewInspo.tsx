import { ArrowLeft, Image as ImageIcon, MapPin, AlignLeft, Sparkles, Unlock, Lock } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import clsx from "clsx";

export function NewInspo() {
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className="min-h-full bg-white flex flex-col h-full animate-in slide-in-from-bottom duration-300">
      <header className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white z-10 sticky top-0">
        <div className="flex items-center gap-3 text-lg">
          <Link to={-1 as any} className="p-2 -ml-2 rounded-full transition-transform hover:scale-110 text-black">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-1.5">
            <Sparkles size={20} className="text-gray-900" />
            New Inspo Board
          </div>
        </div>
        <button className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors shadow-sm">
          Create
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Banner Upload Area */}
        <div className="flex items-center gap-4 py-4 cursor-pointer group border-b border-gray-100">
          <div className="text-gray-400 shrink-0 group-hover:text-black transition-colors">
            <ImageIcon size={22} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Add Cover Photo</p>
            <p className="text-xs text-gray-400 mt-0.5">Optional banner image</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-0 divide-y divide-gray-100">
          <InputField icon={<AlignLeft size={22} strokeWidth={1.5} />} placeholder="Name of inspo board (e.g., Dream Tokyo Trip)" />
          <InputField icon={<MapPin size={22} strokeWidth={1.5} />} placeholder="City, Region, or Country" />
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex flex-col">
            <span className="font-medium text-sm text-gray-900 transition-colors duration-300">
              {!isPrivate ? "Public" : "Private"}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">
              {!isPrivate ? "Anyone can see this board" : "Only you can see this board"}
            </span>
          </div>
          <button 
            onClick={() => setIsPrivate(!isPrivate)}
            className={clsx(
              "w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center shadow-inner relative",
              !isPrivate ? "bg-gray-200" : "bg-gray-800"
            )}
          >
            <div 
              className={clsx(
                "w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out flex items-center justify-center",
                !isPrivate ? "translate-x-0" : "translate-x-6"
              )}
            >
              {!isPrivate ? (
                <Unlock size={10} className="text-gray-500" strokeWidth={2} />
              ) : (
                <Lock size={10} className="text-gray-800" strokeWidth={2} />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, placeholder }: { icon: React.ReactNode; placeholder: string }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="text-gray-400 shrink-0">
        {icon}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-transparent border-none p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 font-medium placeholder:font-normal"
      />
    </div>
  );
}