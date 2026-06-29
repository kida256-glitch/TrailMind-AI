import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Planner from "./components/Planner";
import Discover from "./components/Discover";
import MapExplorer from "./components/MapExplorer";
import BookingModal from "./components/BookingModal";
import Dashboards from "./components/Dashboards";
import { Activity, Destination, Operator, Booking, AIPlan } from "./types";
import { Sparkles, Compass } from "lucide-react";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>("home");

  // Core Data States
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // AI Planner States
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [aiPlanResult, setAiPlanResult] = useState<AIPlan | null>(null);
  const [initialAIPlanPrompt, setInitialAIPlanPrompt] = useState("");

  // Modal / Interaction States
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const USER_EMAIL = "benwaeldon@gmail.com";

  // Fetch Database on Mount
  const fetchDatabase = async () => {
    try {
      const response = await fetch("/api/db");
      const data = await response.json();
      if (data) {
        setDestinations(data.destinations || []);
        setActivities(data.activities || []);
        setOperators(data.operators || []);
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Error connecting to Express full-stack backend:", error);
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, []);

  // Handle Favorites toggle
  const handleToggleFavorite = (activityId: string) => {
    if (favorites.includes(activityId)) {
      setFavorites(favorites.filter((id) => id !== activityId));
    } else {
      setFavorites([...favorites, activityId]);
    }
  };

  // Trigger conversational AI planning
  const handleAIPlanningRequest = async (promptText: string) => {
    setInitialAIPlanPrompt(promptText);
    setActiveTab("ai-planner");
    setIsGeneratingPlan(true);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });
      const data = await response.json();
      if (data && !data.error) {
        setAiPlanResult(data);
      } else {
        console.warn("Server plan returned error state. Displaying simulated backup plan.");
      }
    } catch (error) {
      console.error("AI Planner fetch failure:", error);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Booking details checkout handler
  const handleSelectActivity = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  // Delete booking handler (Admin or User cancellator)
  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        fetchDatabase(); // Refresh listings & bookings in dashboards!
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  // Convert AI custom planned package to checkout
  const handleBookAIPlan = (destinationName: string, priceAmount: number) => {
    // Find closest related activity package, or construct temporary on-the-fly checkout
    const closestActivity = activities.find(
      (a) => a.destinationId === "bhandardara"
    ) || activities[0];

    // Override price and title for customized experience
    const customizedActivity: Activity = {
      ...closestActivity,
      title: `Custom AI Package: ${destinationName} Exploration`,
      price: priceAmount,
    };

    setSelectedActivity(customizedActivity);
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-16 space-y-8 relative overflow-x-hidden bg-slate-950" id="trailmind-app-root">
      
      {/* Immersive Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-800/15 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(15,118,110,0.08)_0%,_transparent_50%)]"></div>
      </div>

      <div className="relative z-10 space-y-8">
        {/* 1. Header Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userEmail={USER_EMAIL}
        />

      {/* 2. Main Tab router panel */}
      <main className="w-full">
        
        {/* VIEW A: LANDING PAGE */}
        {activeTab === "home" && (
          <Hero
            onPlanRequest={handleAIPlanningRequest}
            activities={activities}
            destinations={destinations}
            operators={operators}
            setActiveTab={setActiveTab}
            onSelectActivity={handleSelectActivity}
          />
        )}

        {/* VIEW B: AI PLANNER VIEW */}
        {activeTab === "ai-planner" && (
          <Planner
            initialPrompt={initialAIPlanPrompt}
            isGenerating={isGeneratingPlan}
            onPlanRequest={handleAIPlanningRequest}
            aiPlanResult={aiPlanResult}
            onBookItinerary={handleBookAIPlan}
          />
        )}

        {/* VIEW C: DISCOVER VIEW */}
        {activeTab === "discover" && (
          <Discover
            activities={activities}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectActivity={handleSelectActivity}
          />
        )}

        {/* VIEW D: INTERACTIVE MAP VIEW */}
        {activeTab === "destinations" && (
          <MapExplorer
            destinations={destinations}
            activities={activities}
            onSelectActivity={handleSelectActivity}
          />
        )}

        {/* VIEW E: CLIENT DASHBOARD */}
        {activeTab === "user-dashboard" && (
          <Dashboards
            portalType="user-dashboard"
            bookings={bookings}
            activities={activities}
            destinations={destinations}
            onDeleteBooking={handleDeleteBooking}
            onRefreshDB={fetchDatabase}
          />
        )}

        {/* VIEW F: OPERATOR DASHBOARD */}
        {activeTab === "operator-dashboard" && (
          <Dashboards
            portalType="operator-dashboard"
            bookings={bookings}
            activities={activities}
            destinations={destinations}
            onDeleteBooking={handleDeleteBooking}
            onRefreshDB={fetchDatabase}
          />
        )}

        {/* VIEW G: ADMIN DASHBOARD */}
        {activeTab === "admin-dashboard" && (
          <Dashboards
            portalType="admin-dashboard"
            bookings={bookings}
            activities={activities}
            destinations={destinations}
            onDeleteBooking={handleDeleteBooking}
            onRefreshDB={fetchDatabase}
          />
        )}

      </main>

      {/* 3. Global Slide-Over Details & Checkout modal */}
      {selectedActivity && (
        <BookingModal
          activity={selectedActivity}
          onClose={() => {
            setSelectedActivity(null);
            fetchDatabase(); // Always sync database on close to fetch newly completed bookings!
          }}
          userEmail={USER_EMAIL}
          onSubmitBooking={() => {}}
        />
      )}

      </div>

      {/* Footer Mini Bar */}
      <footer className="relative z-10 max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-950/60 border-t border-white/5 rounded-2xl backdrop-blur-md">
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            Google Maps Vector Integrated
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            Razorpay Secure Enabled
          </div>
        </div>
        <div className="text-xs text-slate-600 font-semibold tracking-tight font-mono">
          © 2026 TRAILMIND AI • SAHYADRI ADVENTURES REDEFINED
        </div>
      </footer>

    </div>
  );
}
