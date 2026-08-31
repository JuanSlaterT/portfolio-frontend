import { createContext } from 'react';

export interface LoadingContextValue {
  runWithLoading: <T>(task: () => Promise<T>, message?: string) => Promise<T>;
}

export const LoadingContext = createContext<LoadingContextValue | null>(null);
