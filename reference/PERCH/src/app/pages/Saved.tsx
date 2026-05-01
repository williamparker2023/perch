import { Bookmark, MapPin, FileText } from "lucide-react";
import { savedItems, places, collections } from "../data";
import { Link } from "react-router";
import { useState } from "react";
import clsx from "clsx";

export function Saved() {
  const [filter, setFilter] = useState<"all" | "places" | "collections">("all");

  const items = savedItems.map(item => {
    if (item.type === "place") {
      return { ...item, data: places.find(p => p.id === item.placeId)! };
    }
    return { ...item, data: collections.find(c => c.id === item.collectionId)! };
  });

  const filteredItems = filter === "all" ? items : items.filter(i => i.type === filter.slice(0, -1));

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <header className="bg-white px-4 py-3 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between shadow-sm">
        <h1 className="text-xl tracking-tight">Saved</h1>
      </header>

      <div className="p-4 flex gap-2 overflow-x-auto scrollbar-hide py-3 sticky top-[52px] bg-white z-10 border-b border-gray-100 shadow-sm">
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")} label="All Saves" />
        <FilterButton active={filter === "places"} onClick={() => setFilter("places")} label="Places" />
        <FilterButton active={filter === "collections"} onClick={() => setFilter("collections")} label="Collections" />
      </div>

      <div className="p-4 columns-2 gap-4">
        {filteredItems.map(item => {
          if (item.type === "place") {
            const place = item.data as typeof places[0];
            return (
              <div key={item.id} className="break-inside-avoid mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {place.notes && (
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="absolute top-2 right-10 bg-black/50 backdrop-blur-md p-1.5 rounded-full text-white cursor-pointer hover:bg-black/80 transition-colors z-10"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  )}

                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md p-1.5 rounded-full text-white cursor-pointer hover:bg-red-500 transition-colors z-10">
                    <BookmarkIcon className="w-4 h-4 fill-white" />
                  </div>
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-normal text-gray-800 capitalize tracking-widest flex items-center shadow-sm">
                    {place.category}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm leading-tight text-gray-900">{place.name}</h3>
                </div>
              </div>
            );
          } else {
            const col = item.data as typeof collections[0];
            return (
              <Link key={item.id} to={`/collection/${col.id}`} className="break-inside-avoid block relative aspect-square overflow-hidden rounded-2xl group shadow-sm hover:shadow-md transition-shadow border border-gray-100 mb-6">
                <img src={col.coverImage} alt={col.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur p-2 rounded-full text-white cursor-pointer hover:bg-red-500 transition-colors">
                  <BookmarkIcon className="w-4 h-4 fill-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white text-lg leading-tight drop-shadow-md">{col.title}</h3>
                  <p className="text-white/80 text-xs font-medium uppercase tracking-widest mt-1">Collection</p>
                </div>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors border",
        active ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
      )}
    >
      {label}
    </button>
  );
}

function BookmarkIcon(props: any) {
  return <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
}
