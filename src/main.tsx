import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import LoadingProvider from '@/components/LoadingProvider';
import LanguageProvider from '@/components/LanguageProvider';
import RateLimitProvider from '@/components/RateLimitProvider';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RateLimitProvider>
      <LoadingProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </LoadingProvider>
    </RateLimitProvider>
  </StrictMode>
);
