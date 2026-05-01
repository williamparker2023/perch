import { ArrowLeft, Image as ImageIcon, MapPin, AlignLeft, Link as LinkIcon, ChevronDown, Check, UserPlus, Search, Star, Trash2, Plus, X } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useState } from "react";
import clsx from "clsx";
import { collections, users } from "../data";

const CATEGORIES = ["Do Local", "Fitness", "Food", "Lodging", "Museum", "Shops", "Sights", "Other"];
const PRICES = ["Free/NA", "$", "$$", "$$$"];

const SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1639506394494-bd45abfe3f91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHRhYmxlfGVufDF8fHx8MTc3NjAxNzc5OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwbWVhbHxlbnwxfHx8fDE3NzYwMTg5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHBsYXRlfGVufDF8fHx8MTc3NTkxNzc0NXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50fGVufDF8fHx8MTc3NjAxODk5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50fGVufDF8fHx8MTc3NjAxODk5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
];

export function NewPost() {
  const [searchParams] = useSearchParams();
  const preselectedBoardId = searchParams.get("boardId") || "";
  const board = collections.find(c => c.id === preselectedBoardId);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("Free/NA");
  const [rating, setRating] = useState(0);

  // Image Upload and Tagging State
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [hoveredTrashIndex, setHoveredTrashIndex] = useState<number | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<typeof users[0][]>([]);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");

  const handleImageUpload = () => {
    if (uploadedImages.length >= 5) return;
    setUploadedImages([...uploadedImages, SAMPLE_PHOTOS[uploadedImages.length]]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    setHoveredTrashIndex(null);
  };

  const toggleTagUser = (user: typeof users[0]) => {
    if (taggedUsers.find(t => t.id === user.id)) {
      setTaggedUsers(taggedUsers.filter(t => t.id !== user.id));
    } else {
      setTaggedUsers([...taggedUsers, user]);
    }
  };

  const removeTag = (id: string) => {
    setTaggedUsers(taggedUsers.filter(t => t.id !== id));
  };

  const filteredUsers = users.filter(u => 
    u.handle.toLowerCase().includes(tagSearchQuery.toLowerCase()) || 
    u.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full bg-white flex flex-col h-full animate-in slide-in-from-bottom duration-300">
      <header className="px-4 py-3 flex flex-col gap-3 border-b border-gray-100 bg-white z-10 sticky top-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg">
            <Link to={-1 as any} className="p-2 -ml-2 rounded-full transition-transform hover:scale-110 text-black">
              <ArrowLeft size={24} />
            </Link>
            New Post{board ? `: ${board.title}` : ""}
          </div>
          <button className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors shadow-sm">
            Post
          </button>
        </div>
      </header>

      {/* Horizontal Category Scroll */}
      <div className="flex w-full overflow-x-auto snap-x snap-mandatory py-3 px-4 gap-3 border-b border-gray-100 shrink-0 sticky top-[65px] bg-white z-10" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={clsx(
              "whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] transition-colors snap-center border",
              selectedCategory === cat 
                ? "bg-black text-white border-black" 
                : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-300"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20 relative">
        {/* Image Upload Area with Tagging */}
        <div className="relative group">
          {uploadedImages.length > 0 ? (
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 -mx-4 px-4 pb-2" style={{ scrollbarWidth: 'none' }}>
              {uploadedImages.map((imgUrl, idx) => (
                <div key={idx} className="aspect-[4/3] w-[85vw] max-w-[400px] shrink-0 snap-center relative rounded-2xl bg-gray-900 overflow-hidden shadow-sm">
                  <img 
                    src={imgUrl} 
                    alt={`Uploaded ${idx + 1}`} 
                    className={`w-full h-full object-cover transition-opacity duration-200 ${hoveredTrashIndex === idx ? 'opacity-40' : 'opacity-100'}`} 
                  />
                  
                  {/* Image Controls */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsTagModalOpen(true); }}
                      className="p-2.5 bg-black/70 hover:bg-black/90 backdrop-blur-md rounded-full text-white shadow-lg transition-transform hover:scale-105"
                    >
                      <UserPlus size={20} />
                    </button>
                    <button
                      onMouseEnter={() => setHoveredTrashIndex(idx)}
                      onMouseLeave={() => setHoveredTrashIndex(null)}
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      className="p-2.5 bg-black/70 hover:bg-red-600/90 backdrop-blur-md rounded-full text-white shadow-lg transition-colors hover:scale-105"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              
              {uploadedImages.length < 5 && (
                <div 
                  onClick={handleImageUpload}
                  className="aspect-[4/3] w-[85vw] max-w-[400px] shrink-0 snap-center bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-all"
                >
                  <Plus size={24} strokeWidth={1.5} className="text-gray-500 mb-2" />
                  <p className="font-medium text-sm text-gray-600">Add More</p>
                  <p className="text-xs text-gray-400 mt-1">{uploadedImages.length} of 5</p>
                </div>
              )}
            </div>
          ) : (
            <div 
              onClick={handleImageUpload}
              className="flex items-center gap-4 py-4 cursor-pointer group"
            >
              <div className="text-gray-400 shrink-0 group-hover:text-black transition-colors mt-0.5">
                <ImageIcon size={22} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Add Photo or Video</p>
                <p className="text-xs text-gray-400 mt-0.5">Up to 5 photos</p>
              </div>
            </div>
          )}
        </div>

        {/* User Selection Modal when Tagging */}
        {isTagModalOpen && (
          <div className="absolute inset-x-4 top-4 bottom-24 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-20 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <span className="text-gray-900">Tag People</span>
              <button 
                onClick={() => setIsTagModalOpen(false)}
                className="p-1 rounded-full transition-transform hover:scale-110 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-3 border-b border-gray-100 relative">
              <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                autoFocus
                value={tagSearchQuery}
                onChange={(e) => setTagSearchQuery(e.target.value)}
                placeholder="Search users..." 
                className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredUsers.map(user => {
                const isTagged = taggedUsers.some(t => t.id === user.id);
                return (
                  <button
                    key={user.id}
                    onClick={() => toggleTagUser(user)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left overflow-hidden"
                  >
                    <div className="flex items-center gap-3 overflow-hidden pr-2">
                      <img src={user.avatar} alt={user.handle} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div className="overflow-hidden min-w-0">
                        <p className="text-sm text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">@{user.handle}</p>
                      </div>
                    </div>
                    {isTagged && (
                      <Check size={18} strokeWidth={3} className="text-black shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
              {filteredUsers.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-8">No users found.</p>
              )}
            </div>
          </div>
        )}

        {/* Form Fields Reordered */}
        <div className="space-y-0 divide-y divide-gray-100">
          <InputField icon={<MapPin size={22} strokeWidth={1.5} />} placeholder="Where did you go? (e.g., L'Artusi)" />

          <div className="flex items-start gap-4 py-4">
            <div className="text-gray-400 mt-0.5 shrink-0">
              <AlignLeft size={22} strokeWidth={1.5} />
            </div>
            <textarea 
              rows={3} 
              placeholder="Add your notes... What did you order? Any tips?" 
              className="w-full bg-transparent border-none p-0 text-sm text-gray-900 outline-none resize-none placeholder:text-gray-400 font-medium placeholder:font-normal"
            />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4 py-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setRating(rating === star ? 0 : star)} 
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    size={24} 
                    strokeWidth={1.5}
                    className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                  />
                </button>
              ))}
            </div>
          </div>

          <InputField icon={<LinkIcon size={22} strokeWidth={1.5} />} placeholder="Add a link (optional)" />

          {/* Price Selector */}
          <div className="flex items-center gap-4 py-4">
            <div className="text-gray-400 shrink-0 font-medium text-lg w-[22px] flex justify-center">
              $
            </div>
            <div className="flex gap-2">
              {PRICES.map(price => (
                <button 
                  key={price} 
                  onClick={() => setSelectedPrice(price)}
                  className={clsx(
                    "px-4 py-1.5 text-xs rounded-full transition-all border",
                    selectedPrice === price 
                      ? "bg-black text-white border-black" 
                      : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-300"
                  )}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>
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
