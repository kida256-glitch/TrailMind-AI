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

  // Client-side fail-safe simulation in case the API encounters rate-limits or key issues
  const getFrontendSimulatedPlan = (prompt: string): AIPlan => {
    const query = prompt.toLowerCase();
    let destination = "Bhandardara Lake & Kalsubai Peak";
    let activities = ["Lakeside Fireflies Camping", "Kalsubai Sunrise Ascent", "Arthur Lake Kayaking"];
    let price = 2400;
    let weatherTemp = "23°C";
    let weatherCondition = "Overcast with light monsoon drizzle";
    let route = "Mumbai Central to Kasara via Local Train -> Shared Jeep to Bhandardara (Total 3.5 Hours)";
    let safetyAdvice = [
      "Carry headlamps and extra batteries for night treks.",
      "Do not enter the lake at night without local life-jacket guides.",
      "High winds at the peak summit; wear a windcheater."
    ];
    let packing = ["Rainproof backpack cover", "Trekking shoes with high grip", "ORS/Hydration packs", "Insect repellent"];
    let hiddenGems = ["Sandhan Valley Viewpoint", "Reverse Waterfall near Bari village", "Ghatghar Kokan Kada"];

    if (query.includes("harishchandragad") || query.includes("kokankada") || query.includes("hard")) {
      destination = "Harishchandragad Fort & Kokankada Cliff";
      activities = ["Kokankada Sunset Tenting", "Nalichi Vat Ascending", "Kedareshwar Cave Exploration"];
      price = 3200;
      weatherTemp = "20°C";
      weatherCondition = "Extremely misty with fast-blowing winds";
      route = "Pune/Mumbai to Khubi Phata via State Transport Bus -> Local jeep to Samrad/Bari (4.5 Hours)";
      safetyAdvice = [
        "Kokankada has sudden gusts of wind; never stand too close to the edge.",
        "Caves get waterlogged during heavy rains. Avoid staying inside Kedareshwar.",
        "Ropes are highly recommended for the Nalichi Vat rock patches."
      ];
      packing = ["Windcheater/Warm layers", "High-ankle grip shoes", "Whistle & basic first aid", "Headlamp for cave paths"];
      hiddenGems = ["Taramati Peak (Highest point of fort)", "Saptatirtha Pushkarni pond", "Semi-circular rainbow phenomenon on fog"];
    } else if (query.includes("devkund") || query.includes("waterfall") || query.includes("rafting")) {
      destination = "Devkund Secret Waterfall & Bhira Plunge";
      activities = ["Forest Canopy Trekking", "Devkund Plunge Pool Swimming", "Tamhini Valley River Rafting"];
      price = 1800;
      weatherTemp = "25°C";
      weatherCondition = "Heavy rain showers and dramatic forest fog";
      route = "Pune to Bhira Dam via ST Bus or private vehicle (3 Hours from Pune, 4 Hours from Mumbai)";
      safetyAdvice = [
        "The waterfall has highly dangerous undercurrents; swimming near the main cascade is strictly banned.",
        "The forest path gets muddy and slippery. Avoid step-cutting.",
        "Carry waterproof bags for your electronic equipment."
      ];
      packing = ["Dry bags for essentials", "Quick-dry shorts & t-shirt", "Leech protection socks", "Salt packets (for leeches)"];
      hiddenGems = ["Kundalika River source lookout", "Bhira Lake backwater viewpoint", "Gharat local dining homesteads"];
    }

    return {
      destination,
      activities,
      matchScore: 95,
      bestBookingDate: "Saturday, July 4, 2026",
      itinerary: [
        {
          day: 1,
          title: "Journey to Wilderness & Lakeside Tenting",
          slots: [
            { time: "07:30 AM", activity: "Depart from City", details: "Board the morning scenic train or private vehicle heading deep into the Sahyadri ranges." },
            { time: "11:30 AM", activity: "Basecamp Arrival & Welcome", details: "Reach the beautiful mountain village basecamp. Relish an authentic hot local Maharashtrian breakfast of Poha and steaming Chai." },
            { time: "03:00 PM", activity: "Guided Trail Walking", details: "Hike along high ridges covered in wild mist and green shrubs. Capture breathtaking waterfalls slicing the dark basalt rocks." },
            { time: "06:30 PM", activity: "Setting Camps & Sunset Glow", details: "Pitch premium moisture-proof tents by the lakeside or scenic high-point. Watch the sky turn a deep adventure-orange." },
            { time: "08:30 PM", activity: "Tribal Barbecue & Stargazing", details: "Gather around a warm campfire, listen to local folklore, and feast on hand-roasted paneer/chicken skewers under the dark sky." }
          ]
        },
        {
          day: 2,
          title: "Peak Assault & Plunge Pool Relaxation",
          slots: [
            { time: "05:30 AM", activity: "Sunrise Peak Summit Ascent", details: "Hike the final ridge in cool mountain air to catch the sun climbing above a vast sea of milky clouds." },
            { time: "09:00 AM", activity: "Rustic Homestead Breakfast", details: "Feast on local wood-fired 'Chulha' Pithla Bhakri and rich groundnut chutney prepared by host villagers." },
            { time: "12:00 PM", activity: "Secret Plunge Pool Splash", details: "Walk down into a shaded deep-forest gorge. Dip your feet in pristine, mineral-rich cold stream waters." },
            { time: "04:00 PM", activity: "Packing Camps & Departure", details: "Collect your sustainable footprint badge, thank your local guides, and commence the scenic drive back home." }
          ]
        }
      ],
      budget: {
        transport: 600,
        operator: price - 1200,
        food: 400,
        equipment: 200,
        total: price,
        currency: "INR"
      },
      travelRoute: route,
      packingChecklist: packing,
      weather: {
        temperature: weatherTemp,
        condition: weatherCondition,
        humidity: "88%",
        advice: "Highly humid and wet. Pack full waterproof gear, extra ziplocks, and synthetic fabrics that dry in under 1 hour."
      },
      safety: safetyAdvice,
      restaurants: [
        "Kalsubai Dhaba (Famous for spicy Shev Bhaji & hot Bhakri)",
        "Hotel Sahyadri Pushpa (Rustic wood-fire slow cooked chicken)",
        "Mauli Misal House (Authentic fiery double-tarri Kolhapuri Misal)"
      ],
      attractions: [
        "Sandhan Canyon View",
        "Wilson Dam Spillway",
        "Ghatghar Kokan Kada Lookout"
      ],
      hiddenGems,
      operatorRecommendation: "Sahyadri Rangers (Verified Elite Grade)",
      carbonFootprint: "8.5kg CO2e (75% lower than flying)",
      ecoScore: 94
    };
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
        setAiPlanResult(getFrontendSimulatedPlan(promptText));
      }
    } catch (error) {
      console.error("AI Planner fetch failure. Displaying local simulated plan as fallback:", error);
      setAiPlanResult(getFrontendSimulatedPlan(promptText));
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
