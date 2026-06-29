import React, { useState } from "react";
import { MapPin, Thermometer, Clock, Sparkles, Navigation, Compass, Star, ChevronRight } from "lucide-react";
import { Destination, Activity } from "../types";

interface MapExplorerProps {
  destinations: Destination[];
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
}

export default function MapExplorer({
  destinations,
  activities,
  onSelectActivity,
}: MapExplorerProps) {
  const [selectedDestId, setSelectedDestId] = useState<string>("bhandardara");

  const selectedDest = destinations.find((d) => d.id === selectedDestId) || destinations[0];
  const relatedActivities = activities.filter((a) => a.destinationId === selectedDestId);

  // SVG Pins Coordinates relative to an 800x400 map
  const mapPins = [
    { id: "bhandardara", x: 420, y: 150, label: "Bhandardara Lake" },
    { id: "harishchandragad", x: 400, y: 220, label: "Harishchandragad Fort" },
    { id: "devkund", x: 310, y: 310, label: "Devkund Waterfall" },
    { id: "sandhan-valley", x: 460, y: 110, label: "Sandhan Valley" }
  ];

  // Mock nearby hotel / restaurant info based on destination
  const regionalAmenities = {
    bhandardara: {
      hotels: ["Bhandardara MTDC Lakeside Resort", "Anandvan Resort (Wooden Cottages)"],
      food: ["Samadhan Woodfire Misal", "Hotel Kalsubai Village Kitchen"]
    },
    harishchandragad: {
      hotels: ["Samrad Villager Homestays", "Bari Basecamp Tents"],
      food: ["Mauli Rustic Chulha Pithla House", "Sahyadri Bhakri Point"]
    },
    devkund: {
      hotels: ["Bhira Lakeside Tenting Camp", "Tamhini Forest Echo Villas"],
      food: ["Hotel Wild Konkan Seafood", "Patnus Village Agri-Misal"]
    },
    "sandhan-valley": {
      hotels: ["Samrad Valley Suspended Tents", "Ghatghar Lookout Lodging"],
      food: ["Canyon Edge Barbecue Hub", "Deccan Plateau Homestead Dining"]
    }
  }[selectedDestId as "bhandardara" | "harishchandragad" | "devkund" | "sandhan-valley"] || {
    hotels: ["Village Homestays"],
    food: ["Local Chulha Dining"]
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8" id="interactive-map-page">
      
      {/* Header Info */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight flex items-center justify-center gap-2">
          <Navigation className="w-8 h-8 text-teal-400 rotate-45 animate-bounce" />
          Interactive Maharashtra Atlas
        </h1>
        <p className="text-slate-400 text-xs md:text-sm">
          Click on a geographic pin on the vector map to retrieve live weather statistics, transportation, and operator guides.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Visual Vector Map Card */}
        <div className="lg:col-span-7 glass-panel rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">
              SAHYADRI TRAIL CHART
            </span>
            <span className="text-xs text-slate-400">
              Interactive Vectors • 4 Core Anchors
            </span>
          </div>

          {/* Styled SVG Map Container */}
          <div className="relative w-full aspect-[2/1] bg-slate-950 rounded-xl overflow-hidden border border-white/5 shadow-inner p-4" id="maharashtra-svg-container">
            {/* Background topographic lines grid */}
            <svg className="absolute inset-0 w-full h-full text-slate-900/40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Fake contour paths */}
              <path d="M 100 150 Q 250 80 400 150 T 700 150" fill="none" stroke="rgba(16,185,129,0.03)" strokeWidth="2" />
              <path d="M 50 300 Q 300 200 500 300 T 750 250" fill="none" stroke="rgba(16,185,129,0.03)" strokeWidth="2" />
            </svg>

            {/* Stylized Western Ghats Mountain Range Vector Line */}
            <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Western Ghats Spine */}
              <path
                d="M 460 20 C 430 100, 420 180, 390 240 C 360 300, 310 350, 300 390"
                fill="none"
                stroke="rgba(16,185,129,0.15)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 460 20 C 430 100, 420 180, 390 240 C 360 300, 310 350, 300 390"
                fill="none"
                stroke="rgba(16,185,129,0.3)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <text x="340" y="270" fill="rgba(16,185,129,0.25)" className="text-[12px] font-mono tracking-widest uppercase font-bold transform -rotate-45">
                Western Ghats Range
              </text>
            </svg>

            {/* Render Map Pins */}
            {mapPins.map((pin) => {
              const isSelected = selectedDestId === pin.id;
              return (
                <button
                  key={pin.id}
                  onClick={() => setSelectedDestId(pin.id)}
                  style={{ left: `${(pin.x / 800) * 100}%`, top: `${(pin.y / 400) * 100}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 cursor-pointer"
                  id={`map-pin-${pin.id}`}
                >
                  {/* Glowing Pulse Ring */}
                  <span className={`absolute -inset-2.5 rounded-full transition-all duration-300 ${
                    isSelected ? "bg-orange-500/30 scale-125 animate-ping" : "bg-teal-500/10 group-hover:bg-teal-500/20"
                  }`} />

                  {/* Pin Mark */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? "bg-orange-500 text-white border-orange-400 shadow-lg scale-110"
                      : "bg-slate-900 text-emerald-400 border-emerald-500/50 hover:border-emerald-400"
                  }`}>
                    <MapPin className="w-3 h-3" />
                  </div>

                  {/* Label tooltip */}
                  <span className={`absolute left-6 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow border transition-all ${
                    isSelected
                      ? "bg-orange-950/90 text-orange-300 border-orange-500/40"
                      : "bg-slate-900/90 text-slate-300 border-slate-800 group-hover:text-white"
                  }`}>
                    {pin.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 font-mono text-center">
            📍 Custom vector represents coordinates near Igatpuri, Ahmednagar, and Tamhini regions.
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Destination Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-950/45 backdrop-blur-xl space-y-4" id="destination-detail-panel">
            <div className="relative h-44 rounded-xl overflow-hidden border border-white/5">
              <img
                src={selectedDest.image}
                alt={selectedDest.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-[9px] font-mono uppercase bg-teal-950/80 text-teal-400 border border-teal-900 px-2 py-0.5 rounded">
                  {selectedDest.difficulty} Difficulty
                </span>
                <h3 className="font-display font-bold text-lg text-white mt-1">
                  {selectedDest.name}
                </h3>
              </div>
            </div>

            {/* Details and stats */}
            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedDest.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-800/60 font-mono">
                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[10px] uppercase block">Best Season</span>
                  <span className="text-white text-[11px] block font-bold truncate">{selectedDest.bestSeason}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[10px] uppercase block">Travel Time</span>
                  <span className="text-white text-[11px] block font-bold truncate">{selectedDest.travelTime}</span>
                </div>
                <div className="space-y-0.5 col-span-2">
                  <span className="text-slate-500 text-[10px] uppercase block">Geographical Coordinates</span>
                  <span className="text-teal-400 text-[11px] block font-bold">
                    Lat {selectedDest.coordinates.lat.toFixed(4)}° N • Lng {selectedDest.coordinates.lng.toFixed(4)}° E
                  </span>
                </div>
              </div>
            </div>

            {/* Hotels & Restaurants recommendations */}
            <div className="pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">🏨 Rustic Wooden Stays</span>
                {regionalAmenities.hotels.map((h, i) => (
                  <span key={i} className="block text-[11px] text-slate-300 truncate">• {h}</span>
                ))}
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider block font-bold">🍲 Chulha Kitchens</span>
                {regionalAmenities.food.map((f, i) => (
                  <span key={i} className="block text-[11px] text-slate-300 truncate">• {f}</span>
                ))}
              </div>
            </div>

            {/* Related Active Packages */}
            <div className="pt-3 border-t border-slate-800/60 space-y-2">
              <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                Available Operator Packages ({relatedActivities.length})
              </span>
              <div className="space-y-2">
                {relatedActivities.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => onSelectActivity(act)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/30 transition cursor-pointer"
                  >
                    <div className="truncate">
                      <span className="block text-xs text-white font-semibold truncate">{act.title}</span>
                      <span className="block text-[10px] text-slate-500 font-mono">By {act.operatorName} • {act.duration}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-xs font-bold text-emerald-400 font-mono">₹{act.price}</span>
                      <span className="block text-[9px] text-slate-500 font-mono">★ {act.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
