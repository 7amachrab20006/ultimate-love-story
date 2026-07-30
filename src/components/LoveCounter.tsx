import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Edit2, Calendar, Sparkles, Check, Clock } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface LoveCounterProps {
  partner1: string;
  partner2: string;
  anniversaryDate: string;
  onUpdateCouple: (p1: string, p2: string, dateStr: string) => void;
  themeMode: 'night' | 'day';
}

interface TimeDiff {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

export const LoveCounter: React.FC<LoveCounterProps> = ({
  partner1,
  partner2,
  anniversaryDate,
  onUpdateCouple,
  themeMode
}) => {
  const [timeDiff, setTimeDiff] = useState<TimeDiff>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editP1, setEditP1] = useState(partner1);
  const [editP2, setEditP2] = useState(partner2);
  const [editDate, setEditDate] = useState(anniversaryDate.slice(0, 10));

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(anniversaryDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      const startDate = new Date(anniversaryDate);
      const currentDate = new Date();

      let years = currentDate.getFullYear() - startDate.getFullYear();
      let months = currentDate.getMonth() - startDate.getMonth();
      let days = currentDate.getDate() - startDate.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const seconds = currentDate.getSeconds();

      setTimeDiff({
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours,
        minutes,
        seconds,
        totalDays
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [anniversaryDate]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playChime();
    onUpdateCouple(editP1, editP2, new Date(editDate).toISOString());
    setIsEditOpen(false);
  };

  const timeUnits = [
    { label: "Years", value: timeDiff.years },
    { label: "Months", value: timeDiff.months },
    { label: "Days", value: timeDiff.days },
    { label: "Hours", value: timeDiff.hours },
    { label: "Minutes", value: timeDiff.minutes },
    { label: "Seconds", value: timeDiff.seconds, isHeartbeat: true }
  ];

  return (
    <section id="love-counter" className="relative pt-10 pb-16 px-4 sm:px-6 max-w-6xl mx-auto text-center">
      {/* Immersive Heart Glow Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[450px] h-[350px] bg-rose-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Glass Container */}
      <div className="relative z-10 bg-gradient-to-b from-white/10 via-slate-900/60 to-slate-950/80 backdrop-blur-xl rounded-[2.5rem] sm:rounded-[3rem] border border-white/10 p-6 sm:p-12 shadow-2xl overflow-hidden max-w-4xl mx-auto">
        
        {/* Top Tagline Badge & Edit */}
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-rose-300 font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Forever Since We Met
          </span>
          <button
            onClick={() => { sounds.playClick(); setIsEditOpen(true); }}
            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-rose-300 text-xs hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Personalize Names & Anniversary Date"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>
        </div>

        {/* Hero Title & Couple Name */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-rose-200 via-pink-300 to-amber-200 bg-clip-text text-transparent mb-3">
            {partner1} <span className="text-rose-500 inline-block animate-pulse">♥</span> {partner2}
          </h1>

          <div className="text-[64px] sm:text-[90px] md:text-[105px] font-serif leading-[0.85] font-light italic tracking-tight text-white my-4">
            {timeDiff.totalDays.toLocaleString()}
            <span className="text-[16px] sm:text-[20px] block font-sans not-italic tracking-[0.25em] font-bold uppercase mt-3 text-rose-300/90">
              Days of Magic
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-light italic max-w-md mx-auto mt-4">
            "Every second with you is another reason to fall in love all over again."
          </p>
        </div>

        {/* Breakdown Stat Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 border-t border-white/10 pt-8">
          {timeUnits.map((unit) => (
            <motion.div
              key={unit.label}
              className={`p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center transition-all bg-white/5 border border-white/10 backdrop-blur-md ${
                unit.isHeartbeat ? 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.3)] bg-rose-500/10' : ''
              }`}
            >
              <span
                className={`font-serif text-2xl sm:text-3xl font-bold ${
                  unit.isHeartbeat
                    ? 'text-rose-400 animate-heartbeat drop-shadow-[0_0_12px_rgba(244,63,94,0.7)]'
                    : 'text-white'
                }`}
              >
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit Couple Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-rose-500/30 text-slate-100 shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="font-serif text-xl font-bold text-rose-200 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Personalize Love Meter
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Partner 1 Name
                </label>
                <input
                  type="text"
                  value={editP1}
                  onChange={(e) => setEditP1(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-rose-500 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Partner 2 Name
                </label>
                <input
                  type="text"
                  value={editP2}
                  onChange={(e) => setEditP2(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-rose-500 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Anniversary / Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-rose-500 text-white outline-none"
                    required
                  />
                  <Calendar className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-semibold text-sm flex items-center gap-1.5 shadow-lg hover:brightness-110"
                >
                  <Check className="w-4 h-4" /> Save Love Meter
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
};
