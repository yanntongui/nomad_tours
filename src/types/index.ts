export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  region?: string;
  description: string;
  highlights: string[];
  images: string[];
  climate: string;
  bestPeriod: string;
  isInternational: boolean;
  isFeatured?: boolean;
  latitude?: number;
  longitude?: number;
  startingPriceXOF: number;
  rating: number;
  reviewsCount: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  accommodation?: string;
  meals?: string;
}

export interface Circuit {
  id: string;
  slug: string;
  title: string;
  destinationId: string;
  destinationName: string;
  durationDays: number;
  priceXOF: number;
  priceEUR: number;
  theme: "Culture" | "Safari" | "Plage" | "Aventure" | "Événement";
  isFeatured?: boolean;
  images: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
}

export interface Testimonial {
  id: string;
  userName: string;
  userAvatar?: string;
  tripTitle: string;
  rating: number;
  content: string;
  date: string;
}

export interface GalleryPhoto {
  id: string;
  image: string;
  caption: string;
  location: string;
  tripTitle: string;
  date: string;
}

export interface QuoteFormData {
  destinationId?: string;
  circuitId?: string;
  fullName: string;
  email: string;
  phone: string;
  startDate: string;
  durationDays: number;
  passengersCount: number;
  budgetPerPersonXOF?: number;
  notes?: string;
}
