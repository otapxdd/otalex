import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styleMap: Record<ToastType, { border: string; icon: string; bg: string; progress: string }> = {
  success: {
    border: 'border-green-500/30',
    icon: 'text-green-400',
    bg: 'from-green-500/10 to-transparent',
    progress: 'bg-green-500',
  },
  error: {
    border: 'border-red-500/30',
    icon: 'text-red-400',
    bg: 'from-red-500/10 to-transparent',
    progress: 'bg-red-500',
  },
  warning: {
    border: 'border-yellow-500/30',
    icon: 'text-yellow-400',
    bg: 'from-yellow-500/10 to-transparent',
    progress: 'bg-yellow-500',
  },
  info: {
    border: 'border-primary/30',
    icon: 'text-primary',
    bg: 'from-primary/10 to-transparent',
    progress: 'bg-primary',
  },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const styles = styleMap[toast.type];
  const Icon = iconMap[toast.type];
  const duration = toast.duration ?? 4000;

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', damping: 24, stiffness: 300 }}
      className={`relative flex items-start gap-3 w-full max-w-sm bg-zinc-950 border ${styles.border} rounded-2xl px-4 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden`}
    >
      {/* Gradient accent */}
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.bg} pointer-events-none`} />

      {/* Icon */}
      <Icon size={20} className={`${styles.icon} shrink-0 mt-0.5 relative z-10`} />

      {/* Message */}
      <p className="text-sm text-zinc-200 font-medium leading-snug flex-1 relative z-10">
        {toast.message}
      </p>

      {/* Close button */}
      <button
        onClick={() => onRemove(toast.id)}
        className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0 relative z-10 mt-0.5"
      >
        <X size={14} />
      </button>

      {/* Progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-[2px] ${styles.progress} opacity-50`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((type: ToastType, message: string, duration?: number) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message, duration }]);
  }, []);

  const success = useCallback((m: string, d?: number) => toast('success', m, d), [toast]);
  const error   = useCallback((m: string, d?: number) => toast('error',   m, d), [toast]);
  const warning = useCallback((m: string, d?: number) => toast('warning', m, d), [toast]);
  const info    = useCallback((m: string, d?: number) => toast('info',    m, d), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      {createPortal(
        <div className="fixed top-5 right-5 z-[9999999] flex flex-col gap-3 pointer-events-none">
          <AnimatePresence mode="popLayout">
            {toasts.map(t => (
              <div key={t.id} className="pointer-events-auto">
                <ToastItem toast={t} onRemove={remove} />
              </div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
