'use client';

import { useEffect, useState, ReactNode, createContext, useContext } from 'react';

const HydrationContext = createContext<boolean>(false);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <HydrationContext.Provider value={isHydrated}>
      {isHydrated ? children : null}
    </HydrationContext.Provider>
  );
}

export function useHydration() {
  return useContext(HydrationContext);
}
