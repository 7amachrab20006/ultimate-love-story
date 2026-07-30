import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Flame, Check, Infinity } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface CinematicEndingProps {
  partner1: string;
  partner2: string;
}

export const CinematicEnding: React.FC<CinematicEndingProps> = ({ partner1, partner2 }) => {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  const fullLines = [
    `My love ASOUMTY,`,
    `You are the most breathtaking person to ever walk into my life. Every smile of yours sets my soul on fire, and every glance makes my heart race all over again.`,
    `I crave your warmth, your touch, your laughter, and every single second spent by your side. You drive me crazy in the most addicting way possible.`,
    `You are my safest harbor, my wildest passion, my soulmate, and my forever choice.`,
    `Looking back at every laugh, every quiet sunset, and every obstacle we've conquered together, standard words will never capture how deeply I adore you.`,
    `No matter what happens in this world, I will hold your hand through it all and love you more with every passing heartbeat...`,
    `nhebek barcha ya rouhii nhebbbkkk akther meli tetsawer nhebekk tkoun marty nhar kherr and i wont give up on you ya 9albi khater enty li radit 7yetyyy feha ma3na`
  ];

  useEffect(() => {
    let lineIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < fullLines.length) {
        setTypedLines((prev) => [...prev, fullLines[lineIdx]]);
        lineIdx++;
      } else {
        clearInterval(interval);
      }
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  const handleProposalAnswer = () => {
    sounds.playVictoryFanfare();
    setIsAnswered(true);

    // Continuous fireworks & confetti cannon
    const duration = 5000;
    const animationEnd = Date.now() + duration;

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      confetti({
        particleCount: 50,
        startVelocity: 30,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  return (
    <section className="py-24 px-4 sm:px-6 max-w-4xl mx-auto relative text-center">
      {/* Dark Theater Overlay Card */}
      <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-rose-500/30 shadow-[0_0_80px_rgba(244,63,94,0.25)] overflow-hidden">
        {/* Ambient Glow background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Eternal Pledge
          </div>

          <div className="min-h-[220px] flex flex-col justify-center space-y-4 font-serif text-lg sm:text-xl md:text-2xl text-rose-100 font-light leading-relaxed">
            {typedLines.map((line, idx) => {
              const isHeader = idx === 0;
              const isFinalDeclaration = idx === fullLines.length - 1;

              if (isFinalDeclaration) {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="p-5 mt-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-rose-900/60 to-slate-950 border border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.3)] text-amber-200 font-serif font-bold text-xl sm:text-2xl italic leading-relaxed text-center"
                  >
                    "{line}"
                  </motion.div>
                );
              }

              return (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className={isHeader ? 'font-bold text-amber-300 text-2xl sm:text-3xl' : ''}
                >
                  {line}
                </motion.p>
              );
            })}
          </div>

          {!isAnswered ? (
            <div className="pt-8 border-t border-rose-500/20 space-y-6">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Will you walk this journey with me forever?
              </h3>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={handleProposalAnswer}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 to-pink-500 text-white font-bold text-base shadow-[0_0_25px_rgba(244,63,94,0.6)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-white" /> Yes, Always
                </button>
                <button
                  onClick={handleProposalAnswer}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-base shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 fill-white" /> Absolutely Yes!
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="pt-8 border-t border-amber-500/30 space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(245,158,11,0.8)] animate-bounce">
                <Infinity className="w-10 h-10 stroke-[3]" />
              </div>

              <h3 className="font-serif text-3xl font-bold text-amber-300">
                Together Forever & Always
              </h3>
              <p className="text-sm text-slate-300 font-serif italic">
                Our love story has no end. Here's to forever, {partner1} & {partner2}.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
