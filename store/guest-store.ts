import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GuestSession {
  isGuest: boolean;
  guestEmail?: string;
  guestName?: string;
  sessionExpiry?: number; // Timestamp when session expires
}

interface GuestStore {
  session: GuestSession | null;
  setGuestSession: (email?: string, name?: string) => void;
  clearGuestSession: () => void;
  isSessionValid: () => boolean;
}

// Session expires after 24 hours
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useGuestStore = create<GuestStore>()(
  persist(
    (set, get) => ({
      session: null,
      setGuestSession: (email, name) => {
        const expiry = Date.now() + SESSION_DURATION;
        set({
          session: {
            isGuest: true,
            guestEmail: email,
            guestName: name,
            sessionExpiry: expiry,
          },
        });
      },
      clearGuestSession: () => {
        set({ session: null });
      },
      isSessionValid: () => {
        const session = get().session;
        if (!session || !session.isGuest) {
          return false;
        }
        if (session.sessionExpiry && Date.now() > session.sessionExpiry) {
          // Session expired, clear it
          get().clearGuestSession();
          return false;
        }
        return true;
      },
    }),
    {
      name: 'delight-store-guest',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
