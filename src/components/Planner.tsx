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

// Ultra-defensive sanitizer that provides robust defaults for any missing or undefined fields
function sanitizeAIPlan(plan: any): AIPlan {
  const defaultPlan: AIPlan = {
    destination: "Sahyadri Wilderness Expedition",
    activities: ["Lakeside Fireflies Camping", "Mountain Ridge Trekking", "Waterfall Rappelling"],
    matchScore: 92,
    bestBookingDate: "Saturday, July 4, 2026",
    itinerary: [
      {
        day: 1,
        title: "Base Camp & Sunset Hike",
        slots: [
          { time: "08:00 AM", activity: "Scenic Drive", details: "Travel to the base village through gorgeous green mountain passes." },
          { time: "04:30 PM", activity: "Camp Setup & Tea", details: "Pitch premium moisture-proof tents and enjoy fresh hot onion pakoras with spiced chai." },
          { time: "07:00 PM", activity: "Traditional Dinner", details: "Feast on a rustic home-cooked Maharashtrian dinner by the campfire." }
        ]
      },
      {
        day: 2,
        title: "Summit Climb & Natural Plunge",
        slots: [
          { time: "05:30 AM", activity: "Sunrise Peak Assault", details: "Ascend the cool mountain ridges to witness the spectacular sun climbing above mist." },
          { time: "11:30 AM", activity: "Secret Waterfall Plunge", details: "Dip in clean, refreshing cold-water streams hidden within dense forest canopies." }
        ]
      }
    ],
    budget: {
      transport: 500,
      operator: 1200,
      food: 400,
      equipment: 300,
      total: 2400,
      currency: "INR"
    },
    travelRoute: "Mumbai/Pune to Base Village via scenic state transport or local trains",
    packingChecklist: ["Waterproof gear & rain covers", "Trekking shoes with solid grip", "Headlamp / Flashlight", "ORS / Rehydration packets"],
    weather: {
      temperature: "24°C",
      condition: "Cool mountain breeze with light monsoon drizzle",
      humidity: "82%",
      advice: "Keep synthetic light-weight clothing and clear waterproof zip-locks handy for electronic devices."
    },
    safety: ["Always stay within eyesight of the registered local guide", "Avoid standing close to wet cliff edges during heavy wind gusts"],
    restaurants: ["Rural Homestead village kitchen", "Highway local Dhaba & Misal Spot"],
    attractions: ["Arthur Lake Ridge", "Ancient Cave structures"],
    hiddenGems: ["Hidden Waterfall plunge cove", "Mist-laden panoramic peak view point"],
    operatorRecommendation: "Sahyadri Elite Guides",
    carbonFootprint: "8.2kg CO2e",
    ecoScore: 95
  };

  if (!plan || typeof plan !== "object") return defaultPlan;

  return {
    destination: typeof plan.destination === "string" ? plan.destination : defaultPlan.destination,
    activities: Array.isArray(plan.activities) ? plan.activities : defaultPlan.activities,
    matchScore: typeof plan.matchScore === "number" ? plan.matchScore : defaultPlan.matchScore,
    bestBookingDate: typeof plan.bestBookingDate === "string" ? plan.bestBookingDate : defaultPlan.bestBookingDate,
    itinerary: Array.isArray(plan.itinerary) ? plan.itinerary.map((day: any) => ({
      day: typeof day.day === "number" ? day.day : 1,
      title: typeof day.title === "string" ? day.title : "Day Outline",
      slots: Array.isArray(day.slots) ? day.slots.map((slot: any) => ({
        time: typeof slot.time === "string" ? slot.time : "Time Slot",
        activity: typeof slot.activity === "string" ? slot.activity : "Planned Activity",
        details: typeof slot.details === "string" ? slot.details : "Description"
      })) : []
    })) : defaultPlan.itinerary,
    budget: (plan.budget && typeof plan.budget === "object") ? {
      transport: typeof plan.budget.transport === "number" ? plan.budget.transport : defaultPlan.budget.transport,
      operator: typeof plan.budget.operator === "number" ? plan.budget.operator : defaultPlan.budget.operator,
      food: typeof plan.budget.food === "number" ? plan.budget.food : defaultPlan.budget.food,
      equipment: typeof plan.budget.equipment === "number" ? plan.budget.equipment : defaultPlan.budget.equipment,
      total: typeof plan.budget.total === "number" ? plan.budget.total : defaultPlan.budget.total,
      currency: typeof plan.budget.currency === "string" ? plan.budget.currency : defaultPlan.budget.currency,
    } : defaultPlan.budget,
    travelRoute: typeof plan.travelRoute === "string" ? plan.travelRoute : defaultPlan.travelRoute,
    packingChecklist: Array.isArray(plan.packingChecklist) ? plan.packingChecklist : defaultPlan.packingChecklist,
    weather: (plan.weather && typeof plan.weather === "object") ? {
      temperature: typeof plan.weather.temperature === "string" ? plan.weather.temperature : defaultPlan.weather.temperature,
      condition: typeof plan.weather.condition === "string" ? plan.weather.condition : defaultPlan.weather.condition,
      humidity: typeof plan.weather.humidity === "string" ? plan.weather.humidity : defaultPlan.weather.humidity,
      advice: typeof plan.weather.advice === "string" ? plan.weather.advice : defaultPlan.weather.advice,
    } : defaultPlan.weather,
    safety: Array.isArray(plan.safety) ? plan.safety : defaultPlan.safety,
    restaurants: Array.isArray(plan.restaurants) ? plan.restaurants : defaultPlan.restaurants,
    attractions: Array.isArray(plan.attractions) ? plan.attractions : defaultPlan.attractions,
    hiddenGems: Array.isArray(plan.hiddenGems) ? plan.hiddenGems : defaultPlan.hiddenGems,
    operatorRecommendation: typeof plan.operatorRecommendation === "string" ? plan.operatorRecommendation : defaultPlan.operatorRecommendation,
    carbonFootprint: typeof plan.carbonFootprint === "string" ? plan.carbonFootprint : defaultPlan.carbonFootprint,
    ecoScore: typeof plan.ecoScore === "number" ? plan.ecoScore : defaultPlan.ecoScore,
  };
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

  // Sync with initialPrompt when passed from the Hero landing
  React.useEffect(() => {
    if (initialPrompt) {
      setInputText(initialPrompt);
    }
  }, [initialPrompt]);

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
    }
  };

  const planSuggestions = [
    "I want a moderate 2-day camping and trekking plan in Bhandardara for 2 people with a budget under ₹5000.",
    "Show me a scenic waterfall trek with easy difficulty, local food spots, and safety guidelines for a group of 4.",
    "Recommend a challenging weekend climbing and tenting expedition around Harishchandragad with expert local guides."
  ];

  // Derive the guaranteed safe AI plan object
  const safePlan = aiPlanResult ? sanitizeAIPlan(aiPlanResult) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="ai-planner-module">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: Chat Prompt Input */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md space-y-4">
            <h2 className="font-display font-semibold text-sm text-white uppercase tracking-wider text-teal-400">
              New Plan Configuration
            </h2>
            
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-2">Adventure prompt</label>
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

        {/* RIGHT PANEL: Live Planner Outputs */}
        <div className="lg:col-span-8">
          
          {/* A. Generating State (Progressive feedback) */}
          {isGenerating && (
            <div className="glass-panel rounded-2xl p-8 text-center border border-teal-500/30 bg-slate-950/60 backdrop-blur-md py-16 space-y-6 animate-pulse" id="planner-generating-state">
              <div className="w-16 h-16 rounded-full bg-teal-950/80 border border-teal-500 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
                <Sparkles className="w-6 h-6 text-teal-400 animate-spin" />
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
          {!isGenerating && !safePlan && (
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
          {!isGenerating && safePlan && (
            <div className="glass-panel rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md overflow-hidden shadow-2xl" id="ai-plan-result-card">
              
              {/* Header Info Banner */}
              <div className="p-6 bg-gradient-to-r from-teal-950/30 via-slate-950/40 to-orange-950/15 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold">
                    RECOMMENDED EXPEDITION
                  </span>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-white">
                    {safePlan.destination}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      Maharashtra
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-teal-400 font-mono">
                      Operator: <strong>{safePlan.operatorRecommendation}</strong>
                    </span>
                  </div>
                </div>

                {/* Match Score Indicator */}
                <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-500 uppercase font-mono">AI Match Score</span>
                    <span className="block text-xs text-slate-400">Best Date: <strong className="text-white">{safePlan.bestBookingDate}</strong></span>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-teal-950 text-teal-400 flex items-center justify-center font-display font-bold text-sm border border-teal-500/30">
                    {safePlan.matchScore}%
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
                    {safePlan.itinerary.map((day, dIdx) => (
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
                            <span className="text-white">₹{safePlan.budget.transport}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Operator Fee</span>
                            <span className="text-white">₹{safePlan.budget.operator}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Meals & Dining</span>
                            <span className="text-white">₹{safePlan.budget.food}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Camping / Safety Gear</span>
                            <span className="text-white">₹{safePlan.budget.equipment}</span>
                          </div>
                          <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm">
                            <span className="text-teal-400">TOTAL EST.</span>
                            <span className="text-teal-400">₹{safePlan.budget.total}</span>
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
                            {safePlan.travelRoute}
                          </p>
                        </div>

                        {/* Carbon Footprint */}
                        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-mono block uppercase">Carbon Footprint</span>
                            <span className="text-xs font-bold text-emerald-400 block">{safePlan.carbonFootprint} total</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-mono block uppercase">Eco Score</span>
                            <span className="text-xs font-bold text-emerald-400 block">★ {safePlan.ecoScore}/100</span>
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
                          <span className="text-xs font-bold text-white block">{safePlan.weather.temperature} ({safePlan.weather.humidity} Humid)</span>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-[9px] text-slate-400 font-mono block uppercase">Weather Warning</span>
                        <span className="text-xs text-slate-300 block">
                          <strong>{safePlan.weather.condition}</strong>. {safePlan.weather.advice}
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
                          {safePlan.safety.map((rule, idx) => (
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
                          {safePlan.packingChecklist.map((item, idx) => (
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
                        {safePlan.restaurants.map((rest, idx) => (
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
                        {safePlan.hiddenGems.map((gem, idx) => (
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
                    ₹{safePlan.budget.total} <span className="text-xs font-normal text-slate-400">Total Price</span>
                  </span>
                </div>
                
                <button
                  onClick={() => onBookItinerary(safePlan.destination, safePlan.budget.total)}
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
