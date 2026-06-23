import { Itinerary, FormValues, TravelPurpose, DayItinerary, TimelineItem } from './types';
import { ACTIVITIES, DAY_THEMES, RawActivity } from './mockData';

type SlotKey = 'morning' | 'lunch' | 'afternoon' | 'dinner' | 'evening';

const SLOT_CONFIG: Record<
  SlotKey,
  { time: string; preferredPurposes: TravelPurpose[] }
> = {
  morning:   { time: '09:00', preferredPurposes: ['sightseeing', 'culture', 'nature'] },
  lunch:     { time: '12:00', preferredPurposes: ['food'] },
  afternoon: { time: '14:30', preferredPurposes: ['shopping', 'culture', 'sightseeing'] },
  dinner:    { time: '18:30', preferredPurposes: ['food'] },
  evening:   { time: '20:30', preferredPurposes: ['nightlife', 'sightseeing'] },
};

function pickActivity(
  slot: SlotKey,
  purposes: TravelPurpose[],
  usedPlaces: Set<string>,
  seed: number,
): TimelineItem {
  const { time, preferredPurposes } = SLOT_CONFIG[slot];

  // Prefer purposes the user selected; fall back to the slot's defaults
  const matched = preferredPurposes.filter((p) => purposes.includes(p));
  const candidates = matched.length > 0 ? matched : preferredPurposes;

  // Try each candidate purpose (shifted by seed) until we find an unused place
  for (let attempt = 0; attempt < 50; attempt++) {
    const purposeIdx = (seed + attempt) % candidates.length;
    const purpose = candidates[purposeIdx];
    const pool: RawActivity[] = ACTIVITIES[purpose];
    const activityIdx = (seed + Math.floor(attempt / candidates.length)) % pool.length;
    const activity = pool[activityIdx];

    if (!usedPlaces.has(activity.place)) {
      usedPlaces.add(activity.place);
      return {
        time,
        place: activity.place,
        description: activity.description,
        category: purpose,
      };
    }
  }

  // Absolute fallback – pick first unused from any selected purpose
  for (const purpose of purposes) {
    for (const activity of ACTIVITIES[purpose]) {
      if (!usedPlaces.has(activity.place)) {
        usedPlaces.add(activity.place);
        return {
          time,
          place: activity.place,
          description: activity.description,
          category: purpose,
        };
      }
    }
  }

  // Last resort (shouldn't happen with sufficient mock data)
  const fallbackPurpose = purposes[0] ?? 'sightseeing';
  const fallback = ACTIVITIES[fallbackPurpose][0];
  return {
    time,
    place: fallback.place,
    description: fallback.description,
    category: fallbackPurpose,
  };
}

function buildDay(
  dayNumber: number,
  purposes: TravelPurpose[],
  usedPlaces: Set<string>,
): DayItinerary {
  const theme = DAY_THEMES[(dayNumber - 1) % DAY_THEMES.length];
  const seed = dayNumber * 3;

  const slots: SlotKey[] = ['morning', 'lunch', 'afternoon', 'dinner'];

  // Add evening slot if nightlife was chosen, or for trips longer than 2 days
  const wantsEvening =
    purposes.includes('nightlife') ||
    (dayNumber % 2 === 0 && purposes.length >= 2);
  if (wantsEvening) slots.push('evening');

  const items: TimelineItem[] = slots.map((slot, idx) =>
    pickActivity(slot, purposes, usedPlaces, seed + idx),
  );

  return {
    day: dayNumber,
    theme: `${theme.title} · ${theme.subtitle}`,
    items,
  };
}

/**
 * Mock API – simulates a network round-trip with a 1.8-second delay.
 * Replace the body of this function with a real fetch() call later.
 */
export async function generateItinerary(form: FormValues): Promise<Itinerary> {
  await new Promise<void>((resolve) => setTimeout(resolve, 1800));

  const usedPlaces = new Set<string>();
  const days: DayItinerary[] = Array.from({ length: form.duration }, (_, i) =>
    buildDay(i + 1, form.purposes, usedPlaces),
  );

  return {
    duration: form.duration,
    purposes: form.purposes,
    days,
  };
}
