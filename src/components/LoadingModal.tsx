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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label={message}
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-8 text-center shadow-2xl shadow-emerald-950/40">
        <div className="pointer-events-none absolute -left-20 -top-20 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
          <LoaderCircle className="h-9 w-9 animate-spin text-emerald-400" />
          <Server className="absolute h-4 w-4 text-cyan-300" />
        </div>

        <p className="relative text-lg font-semibold text-white">{message}</p>
        <div className="relative mx-auto mt-5 h-1 w-28 overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/2 animate-[loading-slide_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
