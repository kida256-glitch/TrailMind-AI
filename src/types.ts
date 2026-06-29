export interface Destination {
  id: string;
  name: string;
  region: string;
  tagline: string;
  image: string;
  description: string;
  rating: number;
  reviewsCount: number;
  bestSeason: string;
  difficulty: "Easy" | "Moderate" | "Hard";
  travelTime: string;
  coordinates: { lat: number; lng: number };
  activities: string[];
}

export interface Activity {
  id: string;
  title: string;
  destinationId: string;
  operatorId: string;
  operatorName: string;
  price: number;
  difficulty: "Easy" | "Moderate" | "Hard";
  duration: string;
  rating: number;
  reviewsCount: number;
  spotsLeft: number;
  weather: string;
  aiScore: number;
  image: string;
  ecoScore: number;
  carbonFootprint: string;
  safetyScore: number;
  dates: string[];
}

export interface Operator {
  id: string;
  name: string;
  logo: string;
  rating: number;
  verified: boolean;
  tripsOrganized: number;
  ecoCertified: boolean;
  description: string;
}

export interface Booking {
  id: string;
  activityId: string;
  activityTitle: string;
  destinationName: string;
  date: string;
  guests: number;
  totalPrice: number;
  paymentStatus: "Completed" | "Pending" | "Refunded";
  bookingStatus: "Confirmed" | "Pending" | "Cancelled";
  bookingCode: string;
  userEmail: string;
  createdDate: string;
  addOns: string[];
}

export interface Review {
  id: string;
  activityId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AIPlan {
  destination: string;
  activities: string[];
  matchScore: number;
  bestBookingDate: string;
  itinerary: {
    day: number;
    title: string;
    slots: {
      time: string;
      activity: string;
      details: string;
    }[];
  }[];
  budget: {
    transport: number;
    operator: number;
    food: number;
    equipment: number;
    total: number;
    currency: string;
  };
  travelRoute: string;
  packingChecklist: string[];
  weather: {
    temperature: string;
    condition: string;
    humidity: string;
    advice: string;
  };
  safety: string[];
  restaurants: string[];
  attractions: string[];
  hiddenGems: string[];
  operatorRecommendation: string;
  carbonFootprint: string;
  ecoScore: number;
}
