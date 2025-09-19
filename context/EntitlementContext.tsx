import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of entitlement state
export type EntitlementState = {
  horoscope: boolean; // true = unlocked, false = locked
  rituals: boolean;   // Witch package for Rituals tab
  kitchenHome: {
    chores: boolean;
    meals: boolean;
    mixedUnlock: boolean;
  };
  goals: boolean;
  reflections: boolean;
  showAds: boolean; // true = show ads (no premium), false = hide ads (premium)
};

const defaultEntitlement: EntitlementState = {
  horoscope: true,
  rituals: false,
  kitchenHome: {
    chores: false,
    meals: false,
    mixedUnlock: false,
  },
  goals: false,
  reflections: false,
  showAds: true, // Show ads by default (no premium)
};

export const EntitlementContext = createContext<{
  entitlement: EntitlementState;
  setEntitlement: (e: EntitlementState) => void;
}>({
  entitlement: defaultEntitlement,
  setEntitlement: () => {},
});

export function EntitlementProvider({ children }: { children: ReactNode }) {
  const [entitlement, setEntitlement] = useState<EntitlementState>(defaultEntitlement);
  return (
    <EntitlementContext.Provider value={{ entitlement, setEntitlement }}>
      {children}
    </EntitlementContext.Provider>
  );
}

export function useEntitlement() {
  return useContext(EntitlementContext);
}
