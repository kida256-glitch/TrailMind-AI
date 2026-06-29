import React, { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Star, Users, Flame, Compass, ChevronRight } from "lucide-react";
import { Activity, Destination, Operator } from "../types";

interface HeroProps {
  onPlanRequest: (promptText: string) => void;
  activities: Activity[];
  destinations: Destination[];
  operators: Operator[];
  setActiveTab: (tab: string) => void;
  onSelectActivity: (activity: Activity) => void;
}

export default function Hero({
  onPlanRequest,
  activities,
  destinations,
  operators,
  setActiveTab,
  onSelectActivity,
}: HeroProps) {
  const [prompt, setPrompt] = useState("");

  const samplePrompts = [
    "I have ₹6000, two days, and want an easy waterfall trek near Mumbai.",
    "Hard night trek with beautiful mountain sunset camping for 4 friends.",
    "Easy lakeside camping near Igatpuri for families under ₹3000."
  ];

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onPlanRequest(prompt);
    }
  };

  const trendingAdventures = activities.slice(0, 3);
  const popularDestinations = destinations.slice(0, 4);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-20" id="trailmind-hero-section">
      
      {/* 1. Immersive Hero Block */}
      <header className="relative rounded-3xl overflow-hidden bg-slate-900/45 backdrop-blur-xl py-20 px-8 md:px-16 text-center shadow-2xl border border-white/10" id="hero-banner">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-800/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[450px] h-[450px] bg-orange-600/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Next-Gen Adventure Engine
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white">
            Plan Your Perfect <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-200">
              Adventure with AI
            </span>
          </h1>

          <p className="text-slate-400 text-sm md:text-lg max-w-lg leading-relaxed mx-auto">
            Describe your dream weekend in Maharashtra and our AI instantly crafts a verified itinerary with weather and safety intelligence.
          </p>

          {/* AI Prompt Box */}
          <div className="relative group mt-8 max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-orange-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <form onSubmit={handlePromptSubmit} className="relative bg-slate-900 border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-4">
              <div className="flex gap-3 items-center text-slate-500 italic">
                <Sparkles className="w-5 h-5 text-teal-400 shrink-0" />
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder='Try: "I have ₹6000, two days, and want an easy waterfall trek near Mumbai."'
                  className="w-full bg-transparent border-none text-white text-xs md:text-sm focus:outline-none placeholder:text-slate-500 font-sans"
                  id="hero-ai-prompt-input"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 border-t border-white/5">
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700 uppercase font-semibold">Budget Optimized</span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700 uppercase font-semibold">Weather Safe</span>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-600/20 cursor-pointer text-xs flex items-center justify-center gap-2"
                  id="hero-ai-prompt-btn"
                >
                  Build My Adventure
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>

            {/* Suggestions */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs" id="quick-prompt-suggestions">
              <span className="text-slate-500 font-medium">Examples:</span>
              {samplePrompts.map((p, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    setPrompt(p);
                    onPlanRequest(p);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5 hover:text-white transition cursor-pointer text-left truncate max-w-xs"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Statistics Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2" id="landing-stats">
        {[
          { value: "4,500+", label: "Happy Explorers", desc: "Eco-certified hikers" },
          { value: "24+", label: "Verified Guilds", desc: "Elite local operators" },
          { value: "99.8%", label: "Safety Score", desc: "Live weather telemetry" },
          { value: "14.2 Tons", label: "CO2 Compensated", desc: "Local afforestation" }
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 text-center border border-slate-800">
            <span className="block font-display font-bold text-2xl md:text-3xl text-emerald-400 tracking-tight">
              {stat.value}
            </span>
            <span className="block font-medium text-xs text-white mt-1">{stat.label}</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">{stat.desc}</span>
          </div>
        ))}
      </section>

      {/* 3. Trending Adventures */}
      <section className="space-y-6" id="trending-adventures-section">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">
              Trending Adventures
            </h2>
            <p className="text-slate-400 text-sm">
              Highly-rated trips compiled and executed by top local operators.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("discover")}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
          >
            Explore All Activities
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingAdventures.map((act) => (
            <div
              key={act.id}
              onClick={() => onSelectActivity(act)}
              className="group glass-card rounded-2xl overflow-hidden border border-slate-800/80 hover:border-teal-500/40 transition-all duration-300 shadow-lg cursor-pointer"
              id={`trending-${act.id}`}
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={act.image}
                  alt={act.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 border border-slate-700/80 text-[10px] font-mono text-emerald-400 px-2 py-1 rounded-md">
                  ★ {act.rating} ({act.reviewsCount})
                </span>
                <span className="absolute bottom-3 right-3 bg-emerald-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-md">
                  ₹{act.price}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    act.difficulty === "Easy" ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400" :
                    act.difficulty === "Moderate" ? "bg-amber-950/40 border-amber-500/30 text-amber-400" :
                    "bg-rose-950/40 border-rose-500/30 text-rose-400"
                  }`}>
                    {act.difficulty} • {act.duration}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Score: <span className="text-orange-400 font-bold">{act.aiScore}% Match</span>
                  </span>
                </div>
                <h3 className="font-display font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {act.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>By <strong className="text-slate-300">{act.operatorName}</strong></span>
                  <span className="text-[10px] bg-emerald-950/30 text-emerald-400 border border-emerald-900/40 px-1.5 py-0.5 rounded">
                    EcoScore {act.ecoScore}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Popular Destinations */}
      <section className="space-y-6" id="popular-destinations-section">
        <div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">
            Popular Destinations
          </h2>
          <p className="text-slate-400 text-sm">
            Discover Maharashtra's rugged mountains, deep canyons, and mystical waterfalls.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {popularDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => setActiveTab("destinations")}
              className="group relative h-60 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition cursor-pointer"
            >
              <img
                src={dest.image}
                alt={dest.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider uppercase">
                  {dest.region}
                </span>
                <h3 className="font-display font-bold text-white text-lg group-hover:text-emerald-300 transition-colors">
                  {dest.name}
                </h3>
                <span className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
                  {dest.tagline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="glass-panel rounded-3xl p-8 md:p-12 space-y-8" id="how-it-works">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">
            The Future of Adventure Planning
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Forget 10 tabs of planning. Let TrailMind AI arrange your escape in 3 simple clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Describe Your Vision",
              desc: "Type naturally in Marathi or English. Tell us your budget, fitness constraints, team size, and what triggers your excitement (e.g. fireflies, night climbs)."
            },
            {
              step: "02",
              title: "AI Synthesis",
              desc: "TrailMind evaluates live weather alerts, calculates the safety index of rock patches, builds a custom budget breakdown, and selects optimal local operators."
            },
            {
              step: "03",
              title: "Secure Instant Booking",
              desc: "Customize available packages with extra safety gear or rustic meals. Finalize through a simulated secure Razorpay gateway and fetch your digital pass."
            }
          ].map((item, index) => (
            <div key={index} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
              <span className="block text-3xl font-display font-bold text-orange-500 font-mono">
                {item.step}
              </span>
              <h3 className="font-display font-semibold text-lg text-white">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Featured Operators & Testimonials */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="operators-testimonials">
        {/* Operators */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-white tracking-tight">
            Verified Local Guilds
          </h2>
          <div className="space-y-3">
            {operators.map((op) => (
              <div key={op.id} className="glass-card p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-950/60 text-emerald-400 border border-teal-800/40 font-bold flex items-center justify-center font-display">
                    {op.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-sm text-white">{op.name}</span>
                      {op.verified && (
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                          VERIFIED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{op.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-bold text-white">★ {op.rating}</span>
                  <span className="block text-[9px] text-slate-500 font-mono">{op.tripsOrganized} Trips</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-white tracking-tight">
            Loved by Sahyadri Hikers
          </h2>
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4 relative h-[256px] flex flex-col justify-center">
            <div className="absolute top-4 right-4 text-emerald-500/10 text-7xl font-serif">“</div>
            <p className="text-sm italic text-slate-300 leading-relaxed relative z-10">
              "We asked TrailMind AI for a secluded, budget-friendly waterfall trip. It recommended Devkund, optimized our route from Pune using local buses, and mapped a gorgeous tribal lunch. The match score was spot-on!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400">
                SD
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Shantanu Deshmukh</span>
                <span className="block text-[10px] text-slate-500">Regular Trekker, Pune</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Newsletter Signup */}
      <section className="glass-panel p-8 rounded-3xl text-center max-w-3xl mx-auto space-y-6" id="newsletter">
        <div className="space-y-2">
          <h3 className="font-display font-bold text-xl text-white">
            Get Weekly Weather & Safety Reports
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Subscribe to receive real-time Sahyadri monsoon rain forecasts, trail landslide warnings, and special operator discounts directly in your inbox.
          </p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); alert("Subscription successful! Welcome to the TrailMind crew."); }} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="w-full bg-slate-950 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-teal-500 placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer shrink-0"
          >
            Stay Alert
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono" id="hero-footer">
        <div>
          <span>© 2026 TrailMind AI Technologies Private Limited. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white transition">Terms of Service</a>
          <a href="#" className="hover:text-white transition">Privacy Protocol</a>
          <a href="#" className="hover:text-white transition">Responsible Hiking Policy</a>
        </div>
      </footer>

    </div>
  );
}
