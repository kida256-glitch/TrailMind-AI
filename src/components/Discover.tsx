import React, { useState } from "react";
import { Filter, Search, Heart, ShieldCheck, Flame, Compass, ArrowUpRight } from "lucide-react";
import { Activity } from "../types";

interface DiscoverProps {
  activities: Activity[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectActivity: (activity: Activity) => void;
}

export default function Discover({
  activities,
  favorites,
  onToggleFavorite,
  onSelectActivity,
}: DiscoverProps) {
  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [maxBudget, setMaxBudget] = useState<number>(4000);

  // Filter Logic
  const filteredActivities = activities.filter((act) => {
    const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          act.destinationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "All" || act.difficulty === selectedDifficulty;
    const matchesBudget = act.price <= maxBudget;

    return matchesSearch && matchesDifficulty && matchesBudget;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8" id="discover-page-catalog">
      
      {/* Search and Filters Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-950/45 backdrop-blur-xl flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search treks, camps, or rivers..."
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 font-sans"
            id="discover-search-input"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto" id="discover-filters">
          
          {/* Difficulty */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-white/5">
            {["All", "Easy", "Moderate", "Hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedDifficulty === diff
                    ? "bg-teal-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Budget Slider */}
          <div className="flex items-center gap-3 bg-slate-900/60 px-4 py-2 rounded-xl border border-white/5 shrink-0 w-full sm:w-auto">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Max Cost:</span>
            <input
              type="range"
              min="1000"
              max="5000"
              step="100"
              value={maxBudget}
              onChange={(e) => setMaxBudget(parseInt(e.target.value))}
              className="w-24 accent-teal-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-teal-400 font-mono">₹{maxBudget}</span>
          </div>

        </div>

      </div>

      {/* Grid List */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/20 rounded-2xl border border-slate-900 space-y-2">
          <Compass className="w-10 h-10 text-slate-700 mx-auto" />
          <h3 className="text-white font-display font-semibold">No Adventures Match</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Try resetting your budget slider or searching with broader terms like "Lake" or "Trek".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="discover-grid">
          {filteredActivities.map((act) => {
            const isFav = favorites.includes(act.id);
            return (
              <div
                key={act.id}
                className="group relative flex flex-col justify-between glass-card rounded-2xl overflow-hidden border border-slate-800/80 hover:border-teal-500/30 hover:shadow-xl transition-all duration-300"
                id={`discover-card-${act.id}`}
              >
                {/* Photo Top */}
                <div className="h-52 relative overflow-hidden">
                  <img
                    src={act.image}
                    alt={act.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Rating / Spot Counter overlay */}
                  <span className="absolute top-3 left-3 bg-slate-950/90 border border-slate-800 text-[9px] font-mono text-emerald-400 font-bold px-2.5 py-1 rounded-md">
                    ★ {act.rating} • {act.reviewsCount} REVIEWS
                  </span>

                  {act.spotsLeft <= 5 && (
                    <span className="absolute top-3 right-3 bg-orange-600/90 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-md animate-pulse">
                      {act.spotsLeft} SPOTS LEFT
                    </span>
                  )}

                  {/* Favorite Heart Trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(act.id);
                    }}
                    className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-900/90 border border-slate-800 flex items-center justify-center text-white transition cursor-pointer"
                    id={`fav-btn-${act.id}`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} />
                  </button>

                  <span className="absolute bottom-3 right-3 bg-emerald-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg font-mono">
                    ₹{act.price}
                  </span>
                </div>

                {/* Info Center */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className={`px-2 py-0.5 rounded border ${
                        act.difficulty === "Easy" ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400" :
                        act.difficulty === "Moderate" ? "bg-amber-950/40 border-amber-500/30 text-amber-400" :
                        "bg-rose-950/40 border-rose-500/30 text-rose-400"
                      }`}>
                        {act.difficulty} • {act.duration}
                      </span>
                      <span className="text-orange-400 font-bold">
                        AI SCORE: {act.aiScore}% Match
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {act.title}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
                      <span>By <strong>{act.operatorName}</strong></span>
                      <span className="text-emerald-400 flex items-center gap-1 font-mono">
                        EcoScore {act.ecoScore}%
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectActivity(act)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-teal-700 hover:text-white transition-all text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                      id={`discover-view-btn-${act.id}`}
                    >
                      View Trip Details
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
