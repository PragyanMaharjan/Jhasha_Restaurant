'use client';

import { useEffect, useState, ReactNode } from 'react';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return children;
}
