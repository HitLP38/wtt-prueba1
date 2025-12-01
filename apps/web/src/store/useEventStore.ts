import { create } from 'zustand';

interface Event {
  id: string;
  name: string;
  description: string;
  bannerUrl?: string;
  startDate: string;
  endDate: string;
  basesUrl?: string;
  isActive: boolean;
}

interface EventStore {
  events: Event[];
  selectedEvent: Event | null;
  setEvents: (events: Event[]) => void;
  setSelectedEvent: (event: Event | null) => void;
  fetchEvents: () => Promise<void>;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  selectedEvent: null,
  setEvents: (events) => set({ events }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  fetchEvents: async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
      );
      const data = await response.json();
      set({ events: data });
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  },
}));


