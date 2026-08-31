import { useContext } from 'react';
import { LoadingContext } from '@/contexts/loading-context';

export function useLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoading must be used inside LoadingProvider');
  }

  return context;
}
