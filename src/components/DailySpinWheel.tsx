import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, Trophy, Check, Lock, RotateCcw, X, Copy, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WheelReward, ClaimedCoupon } from '../types';
import { WHEEL_REWARDS } from '../data/relationshipData';
import { sounds } from '../utils/soundEffects';

interface DailySpinWheelProps {
  themeMode: 'night' | 'day';
  claimedCoupons: ClaimedCoupon[];
  onClaimCoupon: (coupon: ClaimedCoupon) => void;
  isCouponsModalOpen: boolean;
  onCloseCouponsModal: () => void;
}

export const DailySpinWheel: React.FC<DailySpinWheelProps> = ({
  themeMode,
  claimedCoupons,
  onClaimCoupon,
  isCouponsModalOpen,
  onCloseCouponsModal
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedReward, setSelectedReward] = useState<WheelReward | null>(null);
  const [lastSpinDate, setLastSpinDate] = useState<string | null>(() => {
    return localStorage.getItem('last_spin_date');
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);
  const canSpinToday = lastSpinDate !== todayStr;

  const handleSpin = () => {
    if (isSpinning) return;
    sounds.playClick();
    setIsSpinning(true);
    setSelectedReward(null);

    // Random reward wedge index
    const randomIndex = Math.floor(Math.random() * WHEEL_REWARDS.length);
    const rewardAngle = 360 / WHEEL_REWARDS.length;
    // Extra full spins (5 spins = 1800 deg)
    const extraSpins = 360 * 5;
    const targetAngle = extraSpins + (360 - randomIndex * rewardAngle - rewardAngle / 2);

    setRotation((prev) => prev + targetAngle);

    // Audio ticks during spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      sounds.playSpinTick();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 120);

    setTimeout(() => {
      setIsSpinning(false);
      const reward = WHEEL_REWARDS[randomIndex];
      setSelectedReward(reward);
      sounds.playVictoryFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

      // Save last spin date
      localStorage.setItem('last_spin_date', todayStr);
      setLastSpinDate(todayStr);

      // Auto claim reward
      const newCoupon: ClaimedCoupon = {
        id: Math.random().toString(),
        rewardId: reward.id,
        title: reward.title,
        description: reward.description,
        claimedAt: new Date().toLocaleDateString(),
        couponCode: reward.couponCode,
        redeemed: false
      };
      onClaimCoupon(newCoupon);
    }, 4000);
  };

  const handleBypassCheatCode = () => {
    sounds.playChime();
    localStorage.removeItem('last_spin_date');
    setLastSpinDate(null);
  };

  const copyCouponCode = (code: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="spin-wheel" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto relative text-center">
      {/* Title Header */}
      <div className="max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Gift className="w-3.5 h-3.5 text-amber-300" />
          Daily Love Rewards
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-100 mb-3">
          Daily Wheel of Romance
        </h2>
        <p className="text-slate-300 text-sm">
          Spin once every 24 hours to win redeemable romantic coupons for breakfasts, massages, and date nights!
        </p>
      </div>

      {/* Wheel Container */}
      <div className="relative max-w-md mx-auto mb-10">
        {/* Top Pointer Needle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-30 drop-shadow-[0_4px_10px_rgba(244,63,94,0.8)]">
          <div className="w-8 h-10 bg-rose-500 clip-path-polygon-[50%_100%,0_0,100%_0] border-2 border-white" />
        </div>

        {/* Canvas / SVG Wheel */}
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 mx-auto rounded-full p-3 bg-gradient-to-tr from-rose-600 via-amber-400 to-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.4)]">
          <div
            className="w-full h-full rounded-full relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15,0.9,0.25,1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {WHEEL_REWARDS.map((reward, i) => {
                const angle = 360 / WHEEL_REWARDS.length;
                const startAngle = (i * angle * Math.PI) / 180;
                const endAngle = ((i + 1) * angle * Math.PI) / 180;

                const x1 = 50 + 50 * Math.cos(startAngle);
                const y1 = 50 + 50 * Math.sin(startAngle);
                const x2 = 50 + 50 * Math.cos(endAngle);
                const y2 = 50 + 50 * Math.sin(endAngle);

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                return (
                  <g key={reward.id}>
                    <path d={pathData} fill={reward.color} opacity="0.9" />
                    <text
                      x="72"
                      y="50"
                      fill="#ffffff"
                      fontSize="4.2"
                      fontWeight="bold"
                      textAnchor="middle"
                      transform={`rotate(${i * angle + angle / 2}, 50, 50)`}
                      className="select-none font-sans drop-shadow-md"
                    >
                      {reward.title.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Spin Button Badge */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || !canSpinToday}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 rounded-full font-serif font-black text-sm text-white shadow-2xl flex flex-col items-center justify-center border-4 border-white transition-transform ${
              isSpinning || !canSpinToday
                ? 'bg-slate-700 opacity-80 cursor-not-allowed'
                : 'bg-rose-500 hover:scale-110 cursor-pointer animate-pulse'
            }`}
          >
            <span>{isSpinning ? 'SPINNING' : canSpinToday ? 'SPIN!' : 'LOCKED'}</span>
          </button>
        </div>
      </div>

      {/* Spin Limit & Cheat Bypass */}
      <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
        {!canSpinToday ? (
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>You have used today's spin reward!</span>
            <button
              onClick={handleBypassCheatCode}
              className="text-amber-300 underline font-semibold hover:text-amber-200"
              title="Bypass 24-hour lock for testing"
            >
              [Bypass Cheat Code]
            </button>
          </div>
        ) : (
          <span>1 Spin Available Today!</span>
        )}
      </div>

      {/* Won Reward Modal */}
      <AnimatePresence>
        {selectedReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-amber-500/40 text-center shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedReward(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <Sparkles className="w-12 h-12 text-amber-300 mx-auto mb-3 animate-bounce" />
              <h3 className="font-serif text-2xl font-bold text-white mb-1">
                Congratulations!
              </h3>
              <p className="text-xs text-rose-300 uppercase tracking-widest font-bold mb-4">
                You Won: {selectedReward.title}
              </p>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 mb-4 text-slate-200 text-sm">
                "{selectedReward.description}"
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between mb-6">
                <span className="font-mono text-amber-300 text-xs font-bold">
                  {selectedReward.couponCode}
                </span>
                <button
                  onClick={() => copyCouponCode(selectedReward.couponCode)}
                  className="text-xs font-bold text-white bg-amber-500 px-2.5 py-1 rounded-lg flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> {copiedCode === selectedReward.couponCode ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <button
                onClick={() => setSelectedReward(null)}
                className="w-full py-2.5 rounded-full bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors"
              >
                Save to My Coupons
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Saved Coupons Modal Drawer */}
      <AnimatePresence>
        {isCouponsModalOpen && (
          <div
            onClick={onCloseCouponsModal}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 rounded-3xl bg-slate-900 border border-amber-500/30 text-slate-100 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-3">
                <h3 className="font-serif text-xl font-bold text-amber-300 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-400" /> My Claimed Rewards & Coupons
                </h3>
                <button
                  onClick={onCloseCouponsModal}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {claimedCoupons.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Gift className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm">No claimed rewards yet. Spin the Daily Wheel to win!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {claimedCoupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-bold text-white text-sm">{coupon.title}</h4>
                        <p className="text-xs text-slate-400">{coupon.description}</p>
                        <span className="text-[10px] text-amber-400 font-mono mt-1 block">
                          Claimed: {coupon.claimedAt}
                        </span>
                      </div>

                      <button
                        onClick={() => copyCouponCode(coupon.couponCode)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1 border border-slate-700 shrink-0"
                      >
                        <Copy className="w-3 h-3" /> {copiedCode === coupon.couponCode ? 'Copied' : coupon.couponCode}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
