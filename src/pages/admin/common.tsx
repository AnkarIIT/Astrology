import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export const inputCls =
  "w-full bg-celestial-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/50 text-sm";

export const labelCls =
  "text-xs text-slate-500 uppercase tracking-widest block mb-1.5";

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-celestial-950/90 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`glass border-gold-500/20 w-full ${
              wide ? "max-w-3xl" : "max-w-lg"
            } p-8 rounded-3xl relative my-8`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-serif font-bold text-gold-300 mb-6">{title}</h3>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-3xl">
      <p className="text-slate-500 italic">{text}</p>
    </div>
  );
}
