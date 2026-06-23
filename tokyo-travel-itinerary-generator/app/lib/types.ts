export type TravelPurpose =
  | 'sightseeing'
  | 'food'
  | 'shopping'
  | 'culture'
  | 'nature'
  | 'nightlife';

export const PURPOSE_LABELS: Record<TravelPurpose, string> = {
  sightseeing: '관광',
  food: '맛집 탐방',
  shopping: '쇼핑',
  culture: '문화/역사',
  nature: '자연',
  nightlife: '나이트라이프',
};

export const PURPOSE_EMOJIS: Record<TravelPurpose, string> = {
  sightseeing: '🗼',
  food: '🍜',
  shopping: '🛍️',
  culture: '⛩️',
  nature: '🌸',
  nightlife: '🌃',
};

export interface TimelineItem {
  time: string;
  place: string;
  description: string;
  category: TravelPurpose;
}

export interface DayItinerary {
  day: number;
  theme: string;
  items: TimelineItem[];
}

export interface Itinerary {
  duration: number;
  purposes: TravelPurpose[];
  days: DayItinerary[];
}

export interface FormValues {
  duration: number;
  purposes: TravelPurpose[];
}
