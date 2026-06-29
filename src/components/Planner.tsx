import React, { useState } from "react";
import { Sparkles, Send, ShieldAlert, Thermometer, MapPin, ClipboardList, TrendingUp, Leaf, Plus, Coffee, Info, Check } from "lucide-react";
import { AIPlan } from "../types";

interface PlannerProps {
  initialPrompt: string;
  isGenerating: boolean;
  onPlanRequest: (promptText: string) => void;
  aiPlanResult: AIPlan | null;
  onBookItinerary: (destination: string, price: number) => void;
}

export default function Planner({
  initialPrompt,
  isGenerating,
  onPlanRequest,
  aiPlanResult,
  onBookItinerary,
}: PlannerProps) {
  const [inputText, setInputText] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"itinerary" | "logistics" | "safety" | "food-gems">("itinerary");

  const [loadingStep, setLoadingStep] = useState(0);

  // Cycle loading steps if generating
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 4 ? prev + 1 : 0));
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const loadingMessages = [
    "Consulting Western Ghats geographic database...",
    "Querying local weather sensors & flash flood warnings...",
    "Filtering active slots from verified eco-certified operators...",
    "Compiling safety ratings and leech hazard indices...",
    "Optimizing transportation logistics & pricing..."
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onPlanRequest(inputText);
      setInputText("");
    }
  };

  const planSuggestions = [
    "We are 4 friends, we want camping near Bhandardara, budget is ₹5000",
    "Waterfall trek with high safety rating, moderate difficulty",
    "Eco-certified operator with carbon footprint below 10kg"
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8" id="ai-planner-module">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-orange-400 animate-pulse" />
          AI Adventure Planner
        </h1>
        <p className="text-slate-400 text-xs md:text-sm">
          Discuss your team size, budget, or preferred sights. Our AI compiles verified travel packages instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: Chat Prompt Input */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md space-y-4">
            <h2 className="font-display font-semibold text-sm text-white uppercase tracking-wider text-teal-400">
              New Plan Configuration
            </h2>
            
            <form onSubmit={handleSend} className="space-y-3" id="planner-form">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 uppercase">Describe your dream weekend</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g., We love waterfalls, want camping, only have ₹4000, two days, and moderate level..."
                  className="w-full h-32 bg-slate-950 border border-white/10 focus:border-teal-500 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !inputText.trim()}
                className="w-full py-3 px-4 rounded-xl text-xs bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-600/10"
              >
                <Send className="w-3.5 h-3.5" />
                Generate Plan
              </button>
            </form>

            <div className="pt-3 border-t border-white/5 space-y-2">
              <span className="block text-[10px] font-mono text-slate-500 uppercase">Suggested parameters:</span>
              <div className="space-y-1.5">
                {planSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInputText(s)}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-[11px] text-slate-300 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: AI Generation Output Card */}
        <div className="lg:col-span-8">
          
          {/* A. If Loading State */}
          {isGenerating && (
            <div className="glass-panel rounded-2xl p-8 text-center space-y-6 border border-teal-500/30 glow-forest py-20">
              <div className="relative w-16 h-16 mx-auto">
                {/* Custom glowing spinner */}
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                <div className="absolute inset-0 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-orange-400 absolute inset-0 m-auto animate-pulse" />
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="font-display font-semibold text-white">Synthesizing Adventure Pack...</h3>
                <p className="text-xs text-emerald-400 font-mono animate-pulse min-h-[20px]">
                  {loadingMessages[loadingStep]}
                </p>
                <p className="text-[10px] text-slate-500">
                  This takes 2-3 seconds using Gemini Flash intelligence.
                </p>
              </div>

              {/* Fake lines animation */}
              <div className="max-w-md mx-auto space-y-2.5 pt-4">
                <div className="h-2 bg-slate-800 rounded-full w-full animate-pulse" />
                <div className="h-2 bg-slate-800 rounded-full w-4/5 mx-auto animate-pulse" />
                <div className="h-2 bg-slate-800 rounded-full w-3/4 mx-auto animate-pulse" />
              </div>
            </div>
          )}

          {/* B. Default Welcome State (When no plan is active and not generating) */}
          {!isGenerating && !aiPlanResult && (
            <div className="glass-panel rounded-2xl p-8 text-center space-y-4 border border-white/10 bg-slate-950/40 backdrop-blur-md py-16">
              <Sparkles className="w-12 h-12 text-teal-500/40 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-white">No Active Plan</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Type a custom budget, travel companions count, and terrain preference on the left and see the magic unfold.
                </p>
              </div>
              <div className="text-[11px] font-mono text-teal-400 border border-teal-500/20 bg-teal-500/10 max-w-xs mx-auto py-1 px-3 rounded-md font-semibold">
                ⚡ Powered by Gemini-3.5-Flash API
              </div>
            </div>
          )}

          {/* C. Complete High-Fidelity Output Board */}
          {!isGenerating && aiPlanResult && (
            <div className="glass-panel rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md overflow-hidden shadow-2xl" id="ai-plan-result-card">
              
              {/* Header Info Banner */}
              <div className="p-6 bg-gradient-to-r from-teal-950/30 via-slate-950/40 to-orange-950/15 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold">
                    RECOMMENDED EXPEDITION
                  </span>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-white">
                    {aiPlanResult.destination}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      Maharashtra
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-teal-400 font-mono">
                      Operator: <strong>{aiPlanResult.operatorRecommendation}</strong>
                    </span>
                  </div>
                </div>

                {/* Match Score Indicator */}
                <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-500 uppercase font-mono">AI Match Score</span>
                    <span className="block text-xs text-slate-400">Best Date: <strong className="text-white">{aiPlanResult.bestBookingDate}</strong></span>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-teal-950 text-teal-400 flex items-center justify-center font-display font-bold text-sm border border-teal-500/30">
                    {aiPlanResult.matchScore}%
                  </div>
                </div>
              </div>

              {/* Sub-tabs Panel */}
              <div className="flex border-b border-white/10 overflow-x-auto bg-slate-900/30">
                {[
                  { id: "itinerary", label: "Itinerary Timeline", icon: ClipboardList },
                  { id: "logistics", label: "Route & Budget", icon: TrendingUp },
                  { id: "safety", label: "Safety & Packing", icon: ShieldAlert },
                  { id: "food-gems", label: "Local Food & Gems", icon: Coffee }
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeSubTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveSubTab(t.id as any)}
                      className={`flex items-center gap-2 px-5 py-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? "border-teal-500 text-teal-400 bg-teal-950/10"
                          : "border-transparent text-slate-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Sub-tab Contents */}
              <div className="p-6">
                
                {/* 1. Itinerary */}
                {activeSubTab === "itinerary" && (
                  <div className="space-y-6">
                    {aiPlanResult.itinerary.map((day, dIdx) => (
                      <div key={dIdx} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-teal-700 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                            DAY {day.day}
                          </span>
                          <h4 className="font-display font-bold text-sm text-white">
                            {day.title}
                          </h4>
                        </div>
                        
                        <div className="pl-4 border-l-2 border-white/10 space-y-4">
                          {day.slots.map((slot, sIdx) => (
                            <div key={sIdx} className="relative group">
                              <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-teal-500 group-hover:scale-125 transition-transform" />
                              <div className="text-xs">
                                <span className="font-mono text-[10px] text-orange-400 font-bold block">
                                  {slot.time} • {slot.activity}
                                </span>
                                <p className="text-slate-300 mt-1 leading-relaxed">
                                  {slot.details}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Logistics & Budget */}
                {activeSubTab === "logistics" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Budget Optimization */}
                      <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 space-y-3">
                        <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider text-teal-400">
                          Budget Optimizer (INR)
                        </h4>
                        <div className="space-y-2 text-xs text-slate-400 font-mono">
                          <div className="flex justify-between">
                            <span>Local Transport</span>
                            <span className="text-white">₹{aiPlanResult.budget.transport}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Operator Fee</span>
                            <span className="text-white">₹{aiPlanResult.budget.operator}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Meals & Dining</span>
                            <span className="text-white">₹{aiPlanResult.budget.food}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Camping / Safety Gear</span>
                            <span className="text-white">₹{aiPlanResult.budget.equipment}</span>
                          </div>
                          <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm">
                            <span className="text-teal-400">TOTAL EST.</span>
                            <span className="text-teal-400">₹{aiPlanResult.budget.total}</span>
                          </div>
                        </div>
                        <div className="text-[10px] bg-teal-950/20 text-teal-400 p-2 rounded border border-teal-500/20 text-center font-sans">
                          💡 <strong>TrailMind Savings:</strong> Verified local bulk rates saved you ~15% relative to retail bookings.
                        </div>
                      </div>

                      {/* Travel Route */}
                      <div className="space-y-4">
                        <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 space-y-2">
                          <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider text-orange-400">
                            Transportation Routing
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {aiPlanResult.travelRoute}
                          </p>
                        </div>

                        {/* Carbon Footprint */}
                        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-mono block uppercase">Carbon Footprint</span>
                            <span className="text-xs font-bold text-emerald-400 block">{aiPlanResult.carbonFootprint} total</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-mono block uppercase">Eco Score</span>
                            <span className="text-xs font-bold text-emerald-400 block">★ {aiPlanResult.ecoScore}/100</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 3. Safety & Packing */}
                {activeSubTab === "safety" && (
                  <div className="space-y-6">
                    
                    {/* Weather Intelligence widget */}
                    <div className="p-4 bg-teal-950/20 border border-teal-900/30 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-teal-400" />
                        <div>
                          <span className="text-[9px] text-slate-400 font-mono block uppercase">Estimated Temp</span>
                          <span className="text-xs font-bold text-white block">{aiPlanResult.weather.temperature} ({aiPlanResult.weather.humidity} Humid)</span>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-[9px] text-slate-400 font-mono block uppercase">Weather Warning</span>
                        <span className="text-xs text-slate-300 block">
                          <strong>{aiPlanResult.weather.condition}</strong>. {aiPlanResult.weather.advice}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Safety Rules */}
                      <div className="space-y-3">
                        <h4 className="font-display font-bold text-xs text-rose-400 uppercase tracking-wider flex items-center gap-1">
                          <ShieldAlert className="w-4 h-4" />
                          Safety Advisor Warnings
                        </h4>
                        <ul className="space-y-2">
                          {aiPlanResult.safety.map((rule, idx) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="text-rose-500 font-bold shrink-0">!</span>
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Packing Checklist */}
                      <div className="space-y-3">
                        <h4 className="font-display font-bold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <ClipboardList className="w-4 h-4" />
                          Recommended Packing Checklist
                        </h4>
                        <ul className="space-y-2">
                          {aiPlanResult.packingChecklist.map((item, idx) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>
                )}

                {/* 4. Food & Gems */}
                {activeSubTab === "food-gems" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Restaurants */}
                    <div className="space-y-3">
                      <h4 className="font-display font-bold text-xs text-amber-400 uppercase tracking-wider">
                        Rustic Maharashtrian Dining
                      </h4>
                      <ul className="space-y-2">
                        {aiPlanResult.restaurants.map((rest, idx) => (
                          <li key={idx} className="text-xs text-slate-300 p-2.5 bg-slate-900/40 rounded-lg border border-white/5">
                            🍽️ {rest}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hidden Gems & Attractions */}
                    <div className="space-y-3">
                      <h4 className="font-display font-bold text-xs text-teal-400 uppercase tracking-wider">
                        Nearby Attractions & Hidden Gems
                      </h4>
                      <div className="space-y-2">
                        {aiPlanResult.hiddenGems.map((gem, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-900/40 rounded-lg border border-white/5">
                            <span className="text-[10px] font-mono text-teal-400 block uppercase font-bold">Secret Lookout</span>
                            <span className="text-xs text-white font-medium">{gem}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Book Now Bottom CTA */}
              <div className="p-6 bg-slate-950 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Complete Package Deal</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono">
                    ₹{aiPlanResult.budget.total} <span className="text-xs font-normal text-slate-400">Total Price</span>
                  </span>
                </div>
                
                <button
                  onClick={() => onBookItinerary(aiPlanResult.destination, aiPlanResult.budget.total)}
                  className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-8 py-3.5 rounded-xl cursor-pointer transition-all shadow-lg glow-orange"
                  id="ai-plan-book-btn"
                >
                  Book AI Planned Adventure Now
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
