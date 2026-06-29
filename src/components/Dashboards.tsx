import React, { useState } from "react";
import { User, Award, ShieldCheck, Trash2, Plus, Calendar, Compass, TrendingUp, Users, DollarSign, FileText, CheckCircle, MapPin } from "lucide-react";
import { Booking, Activity, Destination } from "../types";

interface DashboardsProps {
  portalType: "user-dashboard" | "operator-dashboard" | "admin-dashboard";
  bookings: Booking[];
  activities: Activity[];
  destinations: Destination[];
  onDeleteBooking: (id: string) => void;
  onRefreshDB: () => void;
}

export default function Dashboards({
  portalType,
  bookings,
  activities,
  destinations,
  onDeleteBooking,
  onRefreshDB,
}: DashboardsProps) {
  
  // Operator states
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("1500");
  const [newDifficulty, setNewDifficulty] = useState<"Easy" | "Moderate" | "Hard">("Moderate");
  const [newDuration, setNewDuration] = useState("1 Day");
  const [newDestId, setNewDestId] = useState("bhandardara");
  const [postingLoading, setPostingLoading] = useState(false);

  // Operator add activity
  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setPostingLoading(true);
    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          price: parseInt(newPrice),
          difficulty: newDifficulty,
          duration: newDuration,
          destinationId: newDestId,
          operatorId: "op-1", // Sahyadri Rangers default
          dates: ["2026-07-04", "2026-07-11", "2026-07-18"]
        })
      });
      const data = await response.json();
      if (data.success) {
        alert("Expedition created and published successfully!");
        setNewTitle("");
        setNewPrice("1500");
        onRefreshDB();
      }
    } catch (err) {
      alert("Error posting activity.");
    } finally {
      setPostingLoading(false);
    }
  };

  // Calculations for Operator / Admin
  const totalSystemRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalUserBookings = bookings.filter((b) => b.userEmail === "benwaeldon@gmail.com");

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8" id="dashboards-hub-module">
      
      {/* 1. USER PORTAL */}
      {portalType === "user-dashboard" && (
        <div className="space-y-8" id="user-portal-view">
          
          {/* Header */}
          <div className="flex items-center gap-4 bg-slate-950/45 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-teal-950 text-teal-400 font-bold flex items-center justify-center font-display text-lg border border-teal-500/30">
              BW
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">Welcome Back, Ben Waeldon</h2>
              <p className="text-xs text-slate-400 font-mono">Profile Level 3 Explorer • benwaeldon@gmail.com</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Booking Logs */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-display font-bold text-base text-white uppercase tracking-wider text-emerald-400">
                My Booked Expeditions ({totalUserBookings.length})
              </h3>

              {totalUserBookings.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800 space-y-2">
                  <Compass className="w-8 h-8 text-slate-600 mx-auto" />
                  <span className="block text-slate-400 text-xs font-semibold">No Booked Trips</span>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Choose one of our trending packages or use the AI Planner to make your first secure travel booking.
                  </p>
                </div>
              ) : (
                <div className="space-y-4" id="user-booking-logs">
                  {totalUserBookings.map((b) => (
                    <div key={b.id} className="glass-panel p-5 rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                      <div>
                        <span className="text-[9px] font-mono text-orange-400 font-bold block uppercase tracking-wider">
                          VOUCHER CODE: {b.bookingCode}
                        </span>
                        <h4 className="font-display font-bold text-white text-sm mt-0.5">
                          {b.activityTitle}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-teal-400 animate-pulse" />
                            {b.date}
                          </span>
                          <span>•</span>
                          <span>{b.guests} Guests</span>
                        </div>
                        {b.addOns && b.addOns.length > 0 && (
                          <div className="mt-2 text-[10px] text-slate-500 max-w-sm">
                            <strong>Add-ons:</strong> {b.addOns.join(", ")}
                          </div>
                        )}
                      </div>

                      <div className="text-right sm:border-l sm:border-white/5 sm:pl-4 shrink-0 flex sm:flex-col justify-between items-center sm:items-end gap-2">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase block font-mono">Paid</span>
                          <span className="text-xs font-bold font-mono text-emerald-400">₹{b.totalPrice}</span>
                        </div>
                        
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to cancel this booking and request a full refund?")) {
                              onDeleteBooking(b.id);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-900 text-[10px] font-bold text-rose-300 cursor-pointer transition flex items-center gap-1 shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                          Cancel Trip
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Adventure Passport */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="font-display font-bold text-base text-white uppercase tracking-wider text-orange-400">
                Adventure Passport & Seals
              </h3>

              <div className="glass-panel p-5 rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md space-y-6 shadow-2xl" id="passport-and-badges">
                
                {/* Passport Seals Stamps */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Earned Seals & Stamps</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { stamp: "Conqueror", desc: "Harishchandragad", date: "June '26", color: "text-amber-400 border-amber-500/30 bg-amber-950/20" },
                      { stamp: "Firefly Watch", desc: "Bhandardara", date: "May '26", color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20" },
                      { stamp: "Wet Plunge", desc: "Devkund Forest", date: "Locked", color: "text-slate-500 border-slate-800 bg-slate-950/40" }
                    ].map((st, i) => (
                      <div key={i} className={`p-2.5 rounded-xl text-center border font-mono text-[10px] space-y-1 ${st.color}`}>
                        <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center mx-auto text-xs font-bold">
                          ★
                        </div>
                        <span className="block font-bold text-white leading-none truncate">{st.stamp}</span>
                        <span className="block text-[8px] text-slate-400 truncate">{st.desc}</span>
                        <span className="block text-[7px] text-slate-500">{st.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements progress check */}
                <div className="space-y-3 pt-4 border-t border-slate-800/60">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Achievements Tracker</span>
                  <div className="space-y-2 text-xs">
                    {[
                      { title: "Carbon Neutral Pioneer", desc: "Completed a weekend trip under 10kg CO2", completed: true },
                      { title: "Peak Summit Stormer", desc: "Ascend Kalsubai Peak above clouds", completed: false },
                      { title: "Valley Descender Mastery", desc: "Traversed Sandhan Canyon", completed: false }
                    ].map((ach, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-slate-950/40 rounded-lg border border-slate-800/60">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          ach.completed ? "bg-emerald-950 text-emerald-400 border-emerald-500/30" : "bg-slate-900 border-slate-800 text-slate-600"
                        }`}>
                          {ach.completed ? "✓" : "○"}
                        </div>
                        <div>
                          <span className="block font-semibold text-white text-[11px] leading-tight">{ach.title}</span>
                          <span className="block text-[9px] text-slate-400 leading-none mt-0.5">{ach.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. OPERATOR PORTAL */}
      {portalType === "operator-dashboard" && (
        <div className="space-y-8" id="operator-portal-view">
          
          {/* Header Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="operator-kpis">
            <div className="glass-panel p-5 rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Operator Revenue</span>
                <span className="text-xl font-bold font-mono text-white block">₹{totalSystemRevenue}</span>
              </div>
              <DollarSign className="w-8 h-8 text-teal-500/30 animate-pulse" />
            </div>
            <div className="glass-panel p-5 rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Expeditions Listed</span>
                <span className="text-xl font-bold font-mono text-white block">{activities.length} slots</span>
              </div>
              <Compass className="w-8 h-8 text-teal-500/30 animate-spin" style={{ animationDuration: '12s' }} />
            </div>
            <div className="glass-panel p-5 rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Guild Rating</span>
                <span className="text-xl font-bold font-mono text-white block">★ 4.9 Verified</span>
              </div>
              <ShieldCheck className="w-8 h-8 text-orange-500/30 animate-bounce" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md space-y-4 shadow-xl">
              <div>
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">OPERATOR OPERATIONS</span>
                <h3 className="font-display font-bold text-base text-white">
                  Publish New Expedition
                </h3>
              </div>

              <form onSubmit={handleCreateActivity} className="space-y-4 text-xs font-sans" id="operator-publish-form">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Expedition Package Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Vasota Fort Lake Trek & Backwater Camping"
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Duration</label>
                    <input
                      type="text"
                      required
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Difficulty</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none text-white cursor-pointer"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Target Destination</label>
                    <select
                      value={newDestId}
                      onChange={(e) => setNewDestId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none text-white cursor-pointer"
                    >
                      {destinations.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={postingLoading}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-55 rounded-xl font-bold text-white transition cursor-pointer text-center flex items-center justify-center gap-1.5"
                  id="operator-submit-btn"
                >
                  <Plus className="w-4 h-4" />
                  {postingLoading ? "Publishing..." : "Publish Expedition to Discover"}
                </button>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-display font-bold text-base text-white uppercase tracking-wider text-teal-400">
                Active Listed Packages ({activities.length})
              </h3>
              
              <div className="space-y-3" id="operator-active-listings">
                {activities.map((act) => (
                  <div key={act.id} className="glass-panel p-4 rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md flex items-center justify-between gap-4 shadow-lg">
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/5">
                        <img src={act.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate">
                        <span className="block text-xs font-bold text-white truncate">{act.title}</span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                          {act.difficulty} • {act.duration} • EcoScore: {act.ecoScore}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-xs font-bold font-mono text-emerald-400">₹{act.price}</span>
                      <span className="block text-[9px] text-slate-500 font-mono">Spots: {act.spotsLeft} left</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. ADMIN PORTAL */}
      {portalType === "admin-dashboard" && (
        <div className="space-y-8" id="admin-portal-view">
          
          {/* Metrics summary row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="admin-stats">
            {[
              { label: "Active Transactions", value: `₹${totalSystemRevenue}`, icon: DollarSign, color: "text-emerald-400" },
              { label: "Total Bookings", value: `${bookings.length} logs`, icon: FileText, color: "text-orange-400" },
              { label: "Active Packages", value: `${activities.length} listings`, icon: Compass, color: "text-teal-400" },
              { label: "Eco Affiliation", value: "85% Rated", icon: ShieldCheck, color: "text-indigo-400" }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="glass-card p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase">{stat.label}</span>
                    <span className={`block font-display font-bold text-lg ${stat.color} mt-0.5`}>{stat.value}</span>
                  </div>
                  <Icon className="w-6 h-6 text-slate-700 shrink-0" />
                </div>
              );
            })}
          </div>

          {/* Bookings Database Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl" id="admin-bookings-table">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white uppercase">System Bookings Register</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Durable Cloud State</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/40 text-slate-500 border-b border-slate-800/80">
                  <tr>
                    <th className="p-4 uppercase">Voucher ID</th>
                    <th className="p-4 uppercase">Explorer Email</th>
                    <th className="p-4 uppercase">Package Title</th>
                    <th className="p-4 uppercase">Date Slot</th>
                    <th className="p-4 uppercase">Grand Paid</th>
                    <th className="p-4 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-950/20">
                      <td className="p-4 font-bold text-white">{b.bookingCode}</td>
                      <td className="p-4 text-slate-400">{b.userEmail}</td>
                      <td className="p-4 font-sans max-w-xs truncate">{b.activityTitle}</td>
                      <td className="p-4 whitespace-nowrap">{b.date}</td>
                      <td className="p-4 text-emerald-400 font-bold">₹{b.totalPrice}</td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            if (confirm(`ADMIN: Proceed with immediate full refund and revocation of ${b.bookingCode}?`)) {
                              onDeleteBooking(b.id);
                            }
                          }}
                          className="px-2 py-1 bg-rose-950/50 hover:bg-rose-900 border border-rose-900 text-rose-300 font-bold rounded cursor-pointer transition text-[10px] flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Log
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
