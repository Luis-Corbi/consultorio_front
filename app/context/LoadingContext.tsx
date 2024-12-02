// app/context/LoadingContext.tsx

"use client";

import Loading from '@/loading';
import React, { createContext, useState } from 'react';

interface LoadingContextProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextProps>({
  isLoading: false,
  setIsLoading: () => {},
});

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <Loading />}
      {children}
    </LoadingContext.Provider>
  );
};