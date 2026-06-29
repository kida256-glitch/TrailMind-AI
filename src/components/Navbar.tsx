import React from "react";
import { Compass, Sparkles, Map, User, Briefcase, Settings, MapPin } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userEmail: string;
}

export default function Navbar({ activeTab, setActiveTab, userEmail }: NavbarProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Compass },
    { id: "ai-planner", label: "AI Planner", icon: Sparkles },
    { id: "discover", label: "Discover", icon: MapPin },
    { id: "destinations", label: "Interactive Map", icon: Map },
  ];

  const dashboardItems = [
    { id: "user-dashboard", label: "My Trips", icon: User },
    { id: "operator-dashboard", label: "Operator Portal", icon: Briefcase },
    { id: "admin-dashboard", label: "Admin Hub", icon: Settings },
  ];

  return (
    <nav className="sticky top-4 z-40 mx-auto w-full max-w-7xl px-4" id="trailmind-navbar">
      <div className="glass-panel rounded-2xl px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md">
        {/* Logo and Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setActiveTab("home")}
          id="brand-logo"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-900/20">
            {/* Mountain SVG from Immersive UI theme */}
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5">
              <path d="M3 20L12 4L21 20H3Z" strokeLinejoin="round"/>
              <path d="M12 4V7M10 5.5L11 6.5M14 5.5L13 6.5" strokeLinecap="round"/>
            </svg>
            {/* AI Spark Overlay */}
            <Sparkles className="w-3.5 h-3.5 text-orange-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white italic block">
              TrailMind<span className="text-teal-400">AI</span>
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block -mt-1 font-bold">
              Maharashtra Adventures
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2" id="nav-routes">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border cursor-pointer ${
                  isActive 
                    ? "bg-teal-500/15 text-teal-400 border-teal-500/30 shadow-lg shadow-teal-500/5 font-semibold" 
                    : "text-slate-400 border-transparent hover:text-white hover:bg-white/5"
                }`}
                id={`nav-${item.id}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-teal-400 animate-pulse" : "text-slate-500"}`} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard Portals */}
        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-4" id="nav-dashboards">
          {dashboardItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                  isActive
                    ? "bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-md"
                    : "text-slate-400 border-transparent hover:text-white hover:bg-white/5"
                }`}
                id={`nav-dash-${item.id}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-orange-400" : "text-slate-500"}`} />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
