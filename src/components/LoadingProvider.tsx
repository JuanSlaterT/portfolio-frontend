import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingModal from '@/components/LoadingModal';
import { LoadingContext } from '@/contexts/loading-context';

interface LoadingProviderProps {
  children: ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
  const { t } = useTranslation();
  const [activeRequests, setActiveRequests] = useState(0);
  const [message, setMessage] = useState('');

  const runWithLoading = useCallback(
    async <T,>(task: () => Promise<T>, customMessage?: string) => {
      setMessage(customMessage ?? t('common.loading'));
      setActiveRequests((current) => current + 1);

      try {
        return await task();
      } finally {
        setActiveRequests((current) => Math.max(0, current - 1));
      }
    },
    [t],
  );

  const value = useMemo(() => ({ runWithLoading }), [runWithLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingModal open={activeRequests > 0} message={message || t('common.loading')} />
    </LoadingContext.Provider>
  );
}
