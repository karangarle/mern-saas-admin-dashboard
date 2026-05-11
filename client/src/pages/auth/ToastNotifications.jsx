import { useEffect, useState } from 'react';

const TOAST_TIMEOUT = 3600;

export const notify = ({ type = 'success', message }) => {
  window.dispatchEvent(new CustomEvent('app:toast', { detail: { type, message } }));
};

export default function ToastNotifications() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToast = (event) => {
      setToast({
        id: crypto.randomUUID(),
        type: event.detail.type,
        message: event.detail.message,
      });
    };

    window.addEventListener('app:toast', handleToast);
    return () => window.removeEventListener('app:toast', handleToast);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), TOAST_TIMEOUT);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const tone = toast.type === 'error'
    ? 'border-rose-200 bg-rose-50 text-rose-900'
    : 'border-emerald-200 bg-emerald-50 text-emerald-900';

  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm" role="status" aria-live="polite">
      <div className={`rounded-lg border px-4 py-3 text-sm font-medium shadow-xl shadow-slate-950/10 ${tone}`}>
        {toast.message}
      </div>
    </div>
  );
}
