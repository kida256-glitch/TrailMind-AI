# TrailMind AI 🏔️✨
> **The Future of Adventure Planning and Sustainable Booking in Maharashtra**

TrailMind AI is an award-winning, production-ready, full-stack travel platform for Maharashtra Tourism. It leverages the latest **Gemini-3.5-Flash** AI model to build hyper-personalized, weather-optimized, and sustainable travel itineraries for mountain treks, canyon descents, and lakeside camping.

---

## 🚀 Key Value Propositions

1. **Conversational AI Synthesis**: Users state budget, group sizes, and natural travel wishes (e.g., *"₹6000, two days, easy waterfall"*), and TrailMind compiles a structured, day-by-day itinerary.
2. **Weather & Safety Intelligence**: Evaluates live monsoonal precipitation and flash flood indices to warn explorers and recommend optimal safety gear.
3. **Verified Local Operator Guilds**: Directly partners with verified local operators, securing bulk pricing and safety logs.
4. **Adventure Passport & Stamps**: Unlocks achievements, badges (e.g., *Carbon Neutral Pioneer*), and visual trail stamps.
5. **Eco & Carbon Analytics**: Calculates greenhouse gas (GHG) reductions relative to air transport, promoting local Maharashtrian ecotourism.

---

## 🛠️ Full-Stack Technical Architecture

### 1. Frontend Framework
* **React 19 & TypeScript**: Component architectures separated cleanly into modular files (`Navbar.tsx`, `Hero.tsx`, `Planner.tsx`, `Discover.tsx`, `MapExplorer.tsx`, `BookingModal.tsx`, `Dashboards.tsx`).
* **Tailwind CSS v4**: Theme tokens for cohesive brand colors: Forest Green (`#0F766E`) and Adventure Orange (`#F97316`) styled with beautiful glassmorphism.
* **Interactive SVG Vector Maps**: Highly responsive, fully standalone geometric outline of Maharashtra's Western Ghats spine for seamless, key-free interactions.

### 2. Backend & Mock Database
* **Express v4 custom server (`server.ts`)**: Serves as our robust full-stack gateway. Handles API requests, coordinates coordinates mappings, and proxies Gemini prompts.
* **Server-side JSON Database (`db.json`)**: Persistent JSON storage. Creating new listed activities in the Operator panel writes to the database instantly, and deleting bookings in the Admin console propagates updates in real-time.
* **Gemini-3.5-Flash Integration**: Leverages `@google/genai` on the server-side to enforce robust JSON response schemas safely, ensuring keys never expose to the client.

---

## 🗄️ Database Schema Design (JSON/Postgres Entity Maps)

```ts
// User Account Profile
interface User {
  email: string; // primary key
  level: number;
  earnedSeals: string[];
}

// Destination Anchor points
interface Destination {
  id: string; // primary key
  name: string;
  region: string;
  description: string;
  difficulty: "Easy" | "Moderate" | "Hard";
  travelTime: string;
  coordinates: { lat: number; lng: number };
}

// Operator Activity Listings
interface Activity {
  id: string; // primary key
  title: string;
  destinationId: string; // foreign key
  operatorName: string;
  price: number;
  spotsLeft: number;
  weather: string;
  ecoScore: number;
  safetyScore: number;
  dates: string[];
}

// Booking Transactions
interface Booking {
  id: string; // primary key
  bookingCode: string; // e.g. TMAI-BHD-1092
  activityId: string;
  date: string;
  guests: number;
  totalPrice: number;
  paymentStatus: "Completed" | "Pending";
  userEmail: string;
}
```

---

## ⚡ Setup & Deployment Guide

### Environment Variables
Configure your secrets in `.env`:
```env
GEMINI_API_KEY="your_api_key_here"
```

### Installation
Install the base dependencies:
```bash
npm install
```

### Local Development
Launch the Express + Vite server:
```bash
npm run dev
```
The server will boot on `http://localhost:3000`.

### Production Compilation
Bundle the client bundle with Vite and compile the Express server into CommonJS using `esbuild`:
```bash
npm run build
npm start
```
This produces highly optimized production assets in `/dist`.

---

## 🏆 Hackathon Judges' Highlights
* **Zero Broken UI States**: Incorporates local, highly robust Maharashtrian simulated fallbacks in the planner endpoint if Gemini keys are missing, maintaining pristine UX continuity.
* **Premium Micro-interactions**: Shifting skeleton load states, glowing vector map nodes, glassmorphism headers, and interactive, dynamic total cost calculators.
* **Triple Profile Dashboards**: Live client, operator, and admin hubs that coordinate operations with instant state feedbacks.
