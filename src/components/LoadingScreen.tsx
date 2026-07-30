import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  const loadingPhrases = [
    "Unlocking our memories...",
    "Retrieving a love story...",
    "Igniting stars in the night sky...",
    "Preparing your romantic universe..."
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 1200);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);
          setTimeout(onComplete, 600);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 120);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 selection:bg-rose-500/30 overflow-hidden"
      >
        {/* Glowing Background Radial */}
        <div className="absolute w-96 h-96 rounded-full bg-rose-600/20 blur-3xl animate-pulse" />
        <div className="absolute w-80 h-80 rounded-full bg-amber-500/10 blur-3xl animate-pulse delay-700" />

        <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
          {/* Pulsating 3D Glowing Heart */}
          <div className="relative mb-8">
            <motion.div
              animate={{
                scale: [1, 1.25, 1, 1.25, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 p-6 rounded-full bg-gradient-to-tr from-rose-600/30 to-rose-400/20 backdrop-blur-md border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.5)]"
            >
              <Heart className="w-16 h-16 text-rose-500 fill-rose-500/80 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]" />
            </motion.div>
            
            {/* Sparkle decorative icons */}
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <Sparkles className="absolute -bottom-1 -left-2 w-5 h-5 text-rose-300 animate-bounce" />
          </div>

          {/* Typing phrase */}
          <motion.p
            key={textIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="font-serif text-lg md:text-xl text-rose-200 tracking-wide h-8 mb-6 font-medium"
          >
            {loadingPhrases[textIndex]}
          </motion.p>

          {/* Progress bar container */}
          <div className="w-full bg-slate-900/80 h-2.5 rounded-full p-0.5 border border-rose-500/20 overflow-hidden shadow-inner mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-400 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.7)]"
              style={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            />
          </div>

          {/* Percentage */}
          <span className="text-xs font-mono text-slate-400 tracking-widest">
            {Math.min(progress, 100)}%
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
