import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Heart, X, Sparkles } from 'lucide-react';

interface FloatingNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloatingNotesModal: React.FC<FloatingNotesModalProps> = ({ isOpen, onClose }) => {
  const notes = [
    "I would choose you in a hundred lifetimes, in a hundred worlds, in any version of reality.",
    "You are my favorite notification, my favorite hello, and my hardest goodbye.",
    "Thank you for being the warm sun on my coldest days."
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-amber-500/30 text-slate-100 shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-xl mb-4">
              <Mail className="w-5 h-5 text-rose-400" /> Hidden Love Notes
            </div>

            <div className="space-y-3 mb-6">
              {notes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gradient-to-tr from-rose-950/60 to-slate-950 border border-rose-500/30 text-xs sm:text-sm font-serif italic text-rose-200"
                >
                  "{note}"
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-full bg-rose-500 text-white font-bold text-xs"
            >
              Close Notes
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
