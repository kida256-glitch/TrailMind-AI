import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();


const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI Features will fall back to smart local simulations.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Local Database File Setup
const DB_FILE = path.join(process.cwd(), "db.json");

const DEFAULT_DB = {
  destinations: [
    {
      id: "bhandardara",
      name: "Bhandardara Lake",
      region: "Igatpuri, Western Ghats",
      tagline: "Lakeside starry skies & twinkling fireflies",
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
      description: "A tranquil hill station nestled in the Sahyadris, famous for Arthur Lake, Wilson Dam, and the breathtaking pre-monsoon fireflies festival.",
      rating: 4.8,
      reviewsCount: 340,
      bestSeason: "June to September (Waterfalls), May-June (Fireflies)",
      difficulty: "Easy",
      travelTime: "3.5 hrs from Mumbai",
      coordinates: { lat: 19.5397, lng: 73.7663 },
      activities: ["Lakeside Camping", "Boating", "Star Gazing", "Firefly Walk"]
    },
    {
      id: "harishchandragad",
      name: "Harishchandragad Fort",
      region: "Ahmednagar District",
      tagline: "The legendary cliff of Kokankada",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      description: "One of the most challenging and magnificent hill forts in Maharashtra, known for its historic caves, Temple of Harishchandra, and the jaw-dropping circular Kokankada cliff.",
      rating: 4.9,
      reviewsCount: 124,
      bestSeason: "September to February",
      difficulty: "Hard",
      travelTime: "4.5 hrs from Pune",
      coordinates: { lat: 19.3837, lng: 73.7744 },
      activities: ["Night Trekking", "Kokankada Camping", "Cave Exploration", "Rappelling"]
    },
    {
      id: "devkund",
      name: "Devkund Waterfall",
      region: "Tamhini Ghat, Patnus",
      tagline: "The hidden plunge pool of green waters",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
      description: "A magical confluence of three rivers resulting in a breathtaking waterfall that plunges into a crystal clear turquoise pool, deep within the forests of Bhira.",
      rating: 4.7,
      reviewsCount: 210,
      bestSeason: "July to November",
      difficulty: "Moderate",
      travelTime: "3 hrs from Pune",
      coordinates: { lat: 18.4539, lng: 73.3934 },
      activities: ["Forest Trekking", "River Rafting", "Photography", "Local Dining"]
    },
    {
      id: "sandhan-valley",
      name: "Sandhan Valley",
      region: "Samrad, Sahyadris",
      tagline: "The valley of shadows and giants",
      image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80",
      description: "Also known as Maharashtra's Grand Canyon, it is a narrow rock-walled ravine where the sun barely reaches the ground, offering high-adrenaline giant swings and suspension tent camping.",
      rating: 4.9,
      reviewsCount: 85,
      bestSeason: "November to May",
      difficulty: "Hard",
      travelTime: "4 hrs from Mumbai",
      coordinates: { lat: 19.6152, lng: 73.6931 },
      activities: ["Valley Descending", "Hanging Tents", "Giant Swing", "Rock Climbing"]
    }
  ],
  activities: [
    {
      id: "act-1",
      title: "Kokankada Sunset Camping & Harishchandragad Trek",
      destinationId: "harishchandragad",
      operatorId: "op-1",
      operatorName: "Sahyadri Rangers",
      price: 1800,
      difficulty: "Hard",
      duration: "2 Days, 1 Night",
      rating: 4.9,
      reviewsCount: 124,
      spotsLeft: 8,
      weather: "Misty & Windy, 21°C",
      aiScore: 98,
      image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80",
      ecoScore: 95,
      carbonFootprint: "12kg CO2e",
      safetyScore: 97,
      dates: ["2026-07-04", "2026-07-11", "2026-07-18"]
    },
    {
      id: "act-2",
      title: "Bhandardara Lakeside Camping & Fireflies Festival",
      destinationId: "bhandardara",
      operatorId: "op-2",
      operatorName: "Kalsubai Trekkers",
      price: 1500,
      difficulty: "Easy",
      duration: "1 Day, 1 Night",
      rating: 4.8,
      reviewsCount: 340,
      spotsLeft: 15,
      weather: "Clear & Cool, 24°C",
      aiScore: 94,
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
      ecoScore: 92,
      carbonFootprint: "8kg CO2e",
      safetyScore: 99,
      dates: ["2026-07-04", "2026-07-05", "2026-07-11"]
    },
    {
      id: "act-3",
      title: "Devkund Hidden Falls Deep Forest Trek",
      destinationId: "devkund",
      operatorId: "op-3",
      operatorName: "Western Ghats Explorers",
      price: 1200,
      difficulty: "Moderate",
      duration: "1 Day",
      rating: 4.7,
      reviewsCount: 210,
      spotsLeft: 12,
      weather: "Rainy & Humid, 26°C",
      aiScore: 92,
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      ecoScore: 97,
      carbonFootprint: "5kg CO2e",
      safetyScore: 94,
      dates: ["2026-07-04", "2026-07-05", "2026-07-11", "2026-07-12"]
    },
    {
      id: "act-4",
      title: "Sandhan Valley Canyon Descent & Suspended Hanging Tents",
      destinationId: "sandhan-valley",
      operatorId: "op-4",
      operatorName: "Wild Sahyadri Adventures",
      price: 3500,
      difficulty: "Hard",
      duration: "1 Day",
      rating: 4.9,
      reviewsCount: 85,
      spotsLeft: 4,
      weather: "Breezy & Warm, 25°C",
      aiScore: 97,
      image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80",
      ecoScore: 89,
      carbonFootprint: "18kg CO2e",
      safetyScore: 98,
      dates: ["2026-07-11", "2026-07-25"]
    }
  ],
  operators: [
    {
      id: "op-1",
      name: "Sahyadri Rangers",
      logo: "SR",
      rating: 4.9,
      verified: true,
      tripsOrganized: 1420,
      ecoCertified: true,
      description: "A premier Sahyadri adventure guild focused on safety, eco-tourism, and high-altitude treks."
    },
    {
      id: "op-2",
      name: "Kalsubai Trekkers",
      logo: "KT",
      rating: 4.8,
      verified: true,
      tripsOrganized: 2890,
      ecoCertified: true,
      description: "Specialized in Igatpuri region tours, lakeside camping, and high peak exploration."
    },
    {
      id: "op-3",
      name: "Western Ghats Explorers",
      logo: "WE",
      rating: 4.7,
      verified: true,
      tripsOrganized: 950,
      ecoCertified: false,
      description: "Water sport experts and forest guides charting pristine, less-traveled trails."
    },
    {
      id: "op-4",
      name: "Wild Sahyadri Adventures",
      logo: "WS",
      rating: 4.9,
      verified: true,
      tripsOrganized: 1100,
      ecoCertified: true,
      description: "Pioneers of extreme sports, valley rappelling, giant swings, and hanging tents in Maharashtra."
    }
  ],
  bookings: [
    {
      id: "BK-8726",
      activityId: "act-2",
      activityTitle: "Bhandardara Lakeside Camping & Fireflies Festival",
      destinationName: "Bhandardara Lake",
      date: "2026-07-04",
      guests: 2,
      totalPrice: 3000,
      paymentStatus: "Completed",
      bookingStatus: "Confirmed",
      bookingCode: "TMAI-BHD-8726",
      userEmail: "benwaeldon@gmail.com",
      createdDate: "2026-06-28",
      addOns: ["Extra local Maharashtrian dinner", "Barbecue setup"]
    },
    {
      id: "BK-4392",
      activityId: "act-3",
      activityTitle: "Devkund Hidden Falls Deep Forest Trek",
      destinationName: "Devkund Waterfall",
      date: "2026-07-11",
      guests: 4,
      totalPrice: 4800,
      paymentStatus: "Completed",
      bookingStatus: "Confirmed",
      bookingCode: "TMAI-DVK-4392",
      userEmail: "benwaeldon@gmail.com",
      createdDate: "2026-06-29",
      addOns: ["Private pickup from Lonavala Station"]
    }
  ],
  reviews: [
    {
      id: "rev-1",
      activityId: "act-2",
      userName: "Rohan S.",
      rating: 5,
      comment: "Absolutely mesmerizing! The fireflies looked like thousands of tiny fairy lights twinkling by the quiet lake. Sahyadri Rangers organized this flawlessly.",
      date: "2026-06-15"
    },
    {
      id: "rev-2",
      activityId: "act-1",
      userName: "Priya M.",
      rating: 5,
      comment: "Trekking through Nalichi Vat is no joke, but Kokankada is majestic! Worth every bead of sweat. Best camping setup ever.",
      date: "2026-06-20"
    }
  ],
  savedPlans: []
};

// Ensure database file exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
}

function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return DEFAULT_DB;
  }
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ---------------- API ENDPOINTS ----------------

// Get general database context
app.get("/api/db", (req, res) => {
  res.json(readDB());
});

// Create high-fidelity custom booking
app.post("/api/bookings", (req, res) => {
  const { activityId, date, guests, addOns, email, totalPaid } = req.body;
  const db = readDB();
  const activity = db.activities.find((a: any) => a.id === activityId);
  const destination = activity ? db.destinations.find((d: any) => d.id === activity.destinationId) : null;

  if (!activity) {
    return res.status(404).json({ error: "Selected adventure not found." });
  }

  // Deduct available spots
  activity.spotsLeft = Math.max(0, activity.spotsLeft - guests);

  const randId = Math.floor(1000 + Math.random() * 9000);
  const bookingCode = `TMAI-${activity.id.replace("act-", "").toUpperCase()}-${randId}`;
  
  const newBooking = {
    id: `BK-${randId}`,
    activityId,
    activityTitle: activity.title,
    destinationName: destination ? destination.name : "Maharashtra Foothills",
    date,
    guests: parseInt(guests) || 1,
    totalPrice: totalPaid || (activity.price * guests),
    paymentStatus: "Completed",
    bookingStatus: "Confirmed",
    bookingCode,
    userEmail: email || "benwaeldon@gmail.com",
    createdDate: new Date().toISOString().split('T')[0],
    addOns: addOns || []
  };

  db.bookings.unshift(newBooking);
  writeDB(db);

  res.status(201).json({ success: true, booking: newBooking });
});

// Create/Update Activity (for Operators)
app.post("/api/activities", (req, res) => {
  const { title, destinationId, price, difficulty, duration, dates, operatorId } = req.body;
  const db = readDB();
  const operator = db.operators.find((o: any) => o.id === operatorId) || db.operators[0];

  const newActivity = {
    id: `act-${db.activities.length + 1}`,
    title,
    destinationId: destinationId || "bhandardara",
    operatorId: operator.id,
    operatorName: operator.name,
    price: parseInt(price) || 1500,
    difficulty: difficulty || "Moderate",
    duration: duration || "1 Day",
    rating: 5.0,
    reviewsCount: 1,
    spotsLeft: 12,
    weather: "Pleasant, 23°C",
    aiScore: 95,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
    ecoScore: 94,
    carbonFootprint: "6kg CO2e",
    safetyScore: 98,
    dates: dates || ["2026-07-04", "2026-07-11"]
  };

  db.activities.unshift(newActivity);
  writeDB(db);

  res.status(201).json({ success: true, activity: newActivity });
});

// Admin endpoint to delete booking
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.bookings.findIndex((b: any) => b.id === id);
  if (index !== -1) {
    db.bookings.splice(index, 1);
    writeDB(db);
    return res.json({ success: true });
  }
  res.status(404).json({ error: "Booking not found." });
});

// Helper to call Gemini with retry and fallback model
async function generateWithFallback(ai: GoogleGenAI, contents: any, baseConfig: any) {
  const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  let lastError = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[AI Plan] Attempting to generate plan using ${model} (attempt ${attempt}/2)`);
        const response = await ai.models.generateContent({
          model,
          contents,
          config: baseConfig
        });
        
        if (response && response.text) {
          console.log(`[AI Plan] Success using model ${model}`);
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const errStr = String(err.message || err);
        console.warn(`[AI Plan] Error with model ${model} (attempt ${attempt}/2):`, errStr);
        
        if (errStr.includes("400") || errStr.includes("INVALID_ARGUMENT") || errStr.includes("INVALID_ARGUMENT_ERROR")) {
          // Bad configuration/schema error - do not retry this model or next models
          break;
        }

        if (attempt < 2) {
          const delay = attempt * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  }
  
  throw lastError || new Error("All Gemini models failed to generate content.");
}

// AI Travel Planner via Gemini API
app.post("/api/plan", async (req, res) => {
  const { prompt, chatHistory } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "User prompt is required." });
  }

  const ai = getAIClient();

  if (!ai) {
    // If Gemini key is missing, return a high-fidelity mock adventure matching user queries
    console.log("No Gemini API key. Providing smart local response.");
    const simulatedResponse = getSimulatedAIResponse(prompt);
    return res.json(simulatedResponse);
  }

  try {
    const systemInstruction = `You are the premium core AI Planner for TrailMind AI, an award-winning travel tech startup in Maharashtra, India.
    Your objective is to turn the user's dream adventure into an incredibly detailed, premium, structured travel plan.
    Strictly focus on actual geographical places in Maharashtra (e.g., Kalsubai, Bhandardara, Harishchandragad, Devkund, Rajmachi, Andharban, Tamhini Ghat, Lohagad, Kolad, Vasota, Sandhan Valley).
    Customize the itinerary, budget, travel routing, packing recommendations, safety guidelines, and local food spots based on the user's specific text.
    Return the response as a valid JSON object matching the requested schema.`;

    const chatContent = [
      {
        role: 'user',
        parts: [{ text: `Generate a premium, full-scale adventure package for the user query: "${prompt}". Make sure it is located in Maharashtra, India, and includes specific prices in INR. Determine a custom matching score (0-100) based on their budget and preference.` }]
      }
    ];

    const response = await generateWithFallback(ai, chatContent, {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING, description: "Name of the Maharashtrian destination" },
          activities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific adventures, e.g. Rappelling, Lakeside camping, cliff jumping" },
          matchScore: { type: Type.INTEGER, description: "Match percentage (0 to 100)" },
          bestBookingDate: { type: Type.STRING, description: "Recommended trip date, e.g., July 4, 2026" },
          itinerary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                title: { type: Type.STRING, description: "Title of the day, e.g. Trail Ascend & Sunset Peaks" },
                slots: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING, description: "e.g., 08:00 AM" },
                      activity: { type: Type.STRING, description: "Short heading of slot" },
                      details: { type: Type.STRING, description: "Fascinating description of the slot" },
                    }
                  }
                }
              }
            }
          },
          budget: {
            type: Type.OBJECT,
            properties: {
              transport: { type: Type.NUMBER, description: "Cost in INR" },
              operator: { type: Type.NUMBER, description: "Cost in INR" },
              food: { type: Type.NUMBER, description: "Cost in INR" },
              equipment: { type: Type.NUMBER, description: "Cost in INR" },
              total: { type: Type.NUMBER, description: "Total cost in INR" },
              currency: { type: Type.STRING, description: "Always INR" }
            },
            required: ["transport", "operator", "food", "equipment", "total", "currency"]
          },
          travelRoute: { type: Type.STRING, description: "Optimized route from Mumbai/Pune with mode of transport" },
          packingChecklist: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Required items specifically tailored to weather and terrain" },
          weather: {
            type: Type.OBJECT,
            properties: {
              temperature: { type: Type.STRING, description: "e.g., 22°C" },
              condition: { type: Type.STRING, description: "e.g., Heavy monsoon showers, mist-laden winds" },
              humidity: { type: Type.STRING, description: "e.g., 85%" },
              advice: { type: Type.STRING, description: "Weather-specific clothing or gear advice" }
            },
            required: ["temperature", "condition", "humidity", "advice"]
          },
          safety: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific precautions (e.g. flash flood warnings, landslide zones)" },
          restaurants: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Best local places to try authentic Maharashtrian dishes (Pithla Bhakri, Misal Pav)" },
          attractions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Nearby points of interest" },
          hiddenGems: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lesser-known local lookouts or beautiful secret clearings" },
          operatorRecommendation: { type: Type.STRING, description: "Recommended verified operator name (e.g. Sahyadri Rangers)" },
          carbonFootprint: { type: Type.STRING, description: "Estimate of Carbon Footprint, e.g., 8kg CO2e" },
          ecoScore: { type: Type.INTEGER, description: "Eco/Sustainability score out of 100" }
        },
        required: ["destination", "activities", "matchScore", "bestBookingDate", "itinerary", "budget", "travelRoute", "packingChecklist", "weather", "safety", "restaurants", "attractions", "hiddenGems", "operatorRecommendation", "carbonFootprint", "ecoScore"]
      }
    });

    const outputText = response.text || "{}";
    const data = JSON.parse(outputText.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Gemini API Error with all models:", error);
    // Graceful fallback to rich simulated data so the UX is NEVER broken
    res.json(getSimulatedAIResponse(prompt));
  }
});

// Local simulated travel generation in case API key is missing/limit reached
function getSimulatedAIResponse(prompt: string) {
  const query = prompt.toLowerCase();
  
  let destination = "Bhandardara Lake & Kalsubai Peak";
  let activities = ["Lakeside Fireflies Camping", "Kalsubai Sunrise Ascent", "Arthur Lake Kayaking"];
  let matchScore = 96;
  let price = 2400;
  let weatherTemp = "23°C";
  let weatherCondition = "Overcast with light monsoon drizzle";
  let route = "Mumbai Central to Kasara via Local Train -> Shared Jeep to Bhandardara (Total 3.5 Hours)";
  let safetyAdvice = [
    "Carry headlamps and extra batteries for night treks.",
    "Do not enter the lake at night without local life-jacket guides.",
    "High winds at the peak summit; wear an windcheater."
  ];
  let packing = ["Rainproof backpack cover", "Trekking shoes with high grip", "ORS/Hydration packs", "Insect repellent"];
  let hiddenGems = ["Sandhan Valley Viewpoint", "Reverse Waterfall near Bari village", "Ghatghar Kokan Kada"];

  if (query.includes("harishchandragad") || query.includes("kokankada") || query.includes("hard")) {
    destination = "Harishchandragad Fort & Kokankada Cliff";
    activities = ["Kokankada Sunset Tenting", "Nalichi Vat Ascending", "Kedareshwar Cave Exploration"];
    matchScore = 98;
    price = 3200;
    weatherTemp = "20°C";
    weatherCondition = "Extremely misty with fast-blowing winds";
    route = "Pune/Mumbai to Khubi Phata via State Transport Bus -> Local jeep to Samrad/Bari (4.5 Hours)";
    safetyAdvice = [
      " Kokankada has sudden gusts of wind; never stand too close to the edge.",
      "Caves get waterlogged during heavy rains. Avoid staying inside Kedareshwar.",
      "Ropes are highly recommended for the Nalichi Vat rock patches."
    ];
    packing = ["Windcheater/Warm layers", "High-ankle grip shoes", "Whistle & basic first aid", "Headlamp for cave paths"];
    hiddenGems = ["Taramati Peak (Highest point of fort)", "Saptatirtha Pushkarni pond", "Semi-circular rainbow phenomenon on fog"];
  } else if (query.includes("devkund") || query.includes("waterfall") || query.includes("rafting")) {
    destination = "Devkund Secret Waterfall & Bhira Plunge";
    activities = ["Forest Canopy Trekking", "Devkund Plunge Pool Swimming", "Tamhini Valley River Rafting"];
    matchScore = 94;
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
    matchScore,
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
}

// ---------------- VITE MIDDLEWARE SETUP ----------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TrailMind AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
