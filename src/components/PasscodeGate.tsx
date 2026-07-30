import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Key, Sparkles, Heart, X, Check, BookOpen, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SECRET_NOTES } from '../data/relationshipData';
import { sounds } from '../utils/soundEffects';

interface PasscodeGateProps {
  isOpen: boolean;
  onClose: () => void;
  isUnlockedByQuiz?: boolean;
}

export const PasscodeGate: React.FC<PasscodeGateProps> = ({ isOpen, onClose, isUnlockedByQuiz }) => {
  const [code, setCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  // Predefined secret passcodes
  const validCodes = ['143', 'FOREVER', 'LOVE', '2022', '0618'];

  useEffect(() => {
    if (isUnlockedByQuiz) {
      setIsUnlocked(true);
    }
  }, [isUnlockedByQuiz]);

  const handleKeyPress = (char: string) => {
    sounds.playClick();
    if (code.length < 8) {
      setCode((prev) => prev + char);
    }
  };

  const handleBackspace = () => {
    sounds.playClick();
    setCode((prev) => prev.slice(0, -1));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (validCodes.includes(cleanCode)) {
      sounds.playVictoryFanfare();
      setIsUnlocked(true);
      confetti({ particleCount: 150, spread: 90 });
    } else {
      sounds.playClick();
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border text-slate-100 shadow-2xl relative ${
              errorShake ? 'animate-bounce border-rose-500' : 'border-rose-500/30'
            }`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {!isUnlocked ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7" />
                </div>

                <h3 className="font-serif text-2xl font-bold text-white mb-1">
                  Secret Romantic Vault
                </h3>
                <p className="text-xs text-slate-300 mb-6">
                  Enter the secret passcode (Hint: Try '143' or 'FOREVER') to open.
                </p>

                {/* Display Input */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono text-2xl tracking-[0.4em] text-amber-300 mb-6 h-12 flex items-center justify-center">
                  {code || '••••'}
                </div>

                {/* Glass Keypad Grid */}
                <div className="grid grid-cols-3 gap-2.5 mb-6 max-w-xs mx-auto">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', '✓'].map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        if (key === 'CLR') setCode('');
                        else if (key === '✓') handleSubmit();
                        else handleKeyPress(key);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/40 text-sm font-bold text-slate-200 transition-all active:scale-95"
                    >
                      {key}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-sm shadow-xl hover:brightness-110"
                >
                  Unlock Vault
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-serif font-bold text-xl mb-2">
                  <Unlock className="w-5 h-5" /> Secret Love Letters Vault
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {SECRET_NOTES.map((note) => (
                    <div
                      key={note.id}
                      className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 font-serif space-y-2 text-slate-200"
                    >
                      <h4 className="font-bold text-amber-300 text-base flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-400" /> {note.title}
                      </h4>
                      <p className="text-sm font-light leading-relaxed italic text-rose-100">
                        "{note.content}"
                      </p>
                      <div className="pt-2 text-right text-xs text-slate-400 font-sans">
                        — {note.author} ({note.date})
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-full bg-rose-500 text-white font-bold text-xs"
                >
                  Close Vault
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
