import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LoaderCircle, Server } from 'lucide-react';

interface LoadingModalProps {
  open: boolean;
  message: string;
}

export default function LoadingModal({ open, message }: LoadingModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#171713]/85 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label={message}
    >
      <div className="paper-grid relative w-full max-w-md border-2 border-[#171713] bg-[#f1eee5] p-6 text-[#171713] shadow-[10px_10px_0_#ff4d00] sm:p-8">
        <div className="mb-7 flex items-center justify-between border-b-2 border-[#171713] pb-3 font-mono text-[9px] font-black uppercase tracking-[0.18em]">
          <span>System request</span>
          <span className="text-[#ff4d00]">In progress</span>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center border-2 border-[#171713] bg-[#171713] text-[#d9ff43]">
            <LoaderCircle className="h-10 w-10 animate-spin" />
            <Server className="absolute h-4 w-4 text-[#ff4d00]" />
          </div>
          <p className="display-type text-xl font-black uppercase leading-tight tracking-[-0.025em]">{message}</p>
        </div>

        <div className="mt-7 h-2 overflow-hidden border border-[#171713] bg-[#e5e0d4]">
          <div className="h-full w-1/2 animate-[loading-slide_1.2s_steps(8)_infinite] bg-[#2457ff]" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
