export type WeatherMode = 'stars' | 'rain' | 'snow';

export type ThemeMode = 'night' | 'day';

export interface Milestone {
  id: string;
  date: string;
  title: string;
  category: 'first' | 'travel' | 'anniversary' | 'future';
  location: string;
  shortDescription: string;
  fullStory: string;
  image: string;
  iconName: string;
}

export interface GalleryItem {
  id: string;
  type: 'photo' | 'video';
  title: string;
  date: string;
  location: string;
  caption: string;
  url: string;
  thumbnail?: string;
}

export interface MapPin {
  id: string;
  locationName: string;
  country: string;
  type: 'met' | 'visited' | 'dream';
  coordinates: { x: number; y: number }; // Percentage X/Y on SVG map
  dateOrYear?: string;
  note: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isMemoryMatch?: boolean;
}

export interface MemoryRule {
  keywords: string[];
  response: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

export interface WheelReward {
  id: string;
  title: string;
  color: string;
  icon: string;
  description: string;
  couponCode: string;
}

export interface ClaimedCoupon {
  id: string;
  rewardId: string;
  title: string;
  description: string;
  claimedAt: string;
  couponCode: string;
  redeemed: boolean;
}

export interface MemoryCard {
  id: number;
  icon: string;
  matched: boolean;
}

export interface SecretNote {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
}
