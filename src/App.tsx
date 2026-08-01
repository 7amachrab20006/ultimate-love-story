import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { ParticleBackground } from './components/ParticleBackground';
import { Navbar } from './components/Navbar';
import { LoveCounter } from './components/LoveCounter';
import { RelationshipTimeline } from './components/RelationshipTimeline';
import { LoveLetterGenerator } from './components/LoveLetterGenerator';
import { SharedGallery } from './components/SharedGallery';
import { WorldMap } from './components/WorldMap';
import { ArcadeSuite } from './components/ArcadeSuite';
import { DailySpinWheel } from './components/DailySpinWheel';
import { AudioPlayer } from './components/AudioPlayer';
import { PasscodeGate } from './components/PasscodeGate';
import { FloatingNotesModal } from './components/FloatingNotesModal';
import { CinematicEnding } from './components/CinematicEnding';
import { WeatherMode, ThemeMode, ClaimedCoupon } from './types';
import { DEFAULT_COUPLE } from './data/relationshipData';
import { sounds } from './utils/soundEffects';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Mail } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [weatherMode, setWeatherMode] = useState<WeatherMode>('stars');

  // Day/Night theme auto-switch based on system time or user override
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const hour = new Date().getHours();
    return hour >= 19 || hour < 6 ? 'night' : 'night'; // Default to intimate twilight night mode
  });

  // Couple Data with LocalStorage Persistence
  const [coupleData, setCoupleData] = useState(() => {
    const saved = localStorage.getItem('couple_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.partner1 === 'Alex' && parsed.partner2 === 'Taylor') {
          return DEFAULT_COUPLE;
        }
        return parsed;
      } catch { return DEFAULT_COUPLE; }
    }
    return DEFAULT_COUPLE;
  });

  // Saved Coupons with LocalStorage Persistence
  const [claimedCoupons, setClaimedCoupons] = useState<ClaimedCoupon[]>(() => {
    const saved = localStorage.getItem('claimed_coupons');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  // Modal states
  const [isPasscodeGateOpen, setIsPasscodeGateOpen] = useState(false);
  const [isCouponsModalOpen, setIsCouponsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isUnlockedByQuiz, setIsUnlockedByQuiz] = useState(false);

  // Logo tap count for easter egg
  const [tapCount, setTapCount] = useState(0);

  // Update couple data
  const handleUpdateCouple = (p1: string, p2: string, dateStr: string) => {
    const updated = { ...coupleData, partner1: p1, partner2: p2, anniversaryDate: dateStr };
    setCoupleData(updated);
    localStorage.setItem('couple_data', JSON.stringify(updated));
  };

  // Claim new coupon
  const handleClaimCoupon = (coupon: ClaimedCoupon) => {
    const updated = [coupon, ...claimedCoupons];
    setClaimedCoupons(updated);
    localStorage.setItem('claimed_coupons', JSON.stringify(updated));
  };

  // Keyboard listener for Konami / "LOVE" key combo
  useEffect(() => {
    let keyBuffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      keyBuffer += e.key.toUpperCase();
      if (keyBuffer.length > 10) keyBuffer = keyBuffer.slice(-10);

      if (keyBuffer.includes('LOVE') || keyBuffer.includes('143')) {
        sounds.playVictoryFanfare();
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
        keyBuffer = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogoTap = () => {
    sounds.playClick();
    const nextTap = tapCount + 1;
    setTapCount(nextTap);
    if (nextTap >= 5) {
      sounds.playVictoryFanfare();
      confetti({ particleCount: 150, spread: 90 });
      setIsPasscodeGateOpen(true);
      setTapCount(0);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 relative selection:bg-rose-500/30 selection:text-rose-200 ${
      themeMode === 'night'
        ? 'bg-[#0a0510] text-slate-100'
        : 'bg-rose-50/40 text-slate-900'
    }`}>
      {/* 1. Cinematic Loading Screen */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {/* 2. Dynamic Weather & Particle Background */}
      <ParticleBackground weatherMode={weatherMode} themeMode={themeMode} />

      {/* 3. Navigation Bar */}
      <Navbar
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(themeMode === 'night' ? 'day' : 'night')}
        weatherMode={weatherMode}
        onSelectWeather={setWeatherMode}
        partner1={coupleData.partner1}
        partner2={coupleData.partner2}
        onOpenPasscodeModal={() => setIsPasscodeGateOpen(true)}
        onOpenCouponsModal={() => setIsCouponsModalOpen(true)}
        claimedCount={claimedCoupons.length}
      />

      {/* Main Content Area */}
      <main className="relative z-10 space-y-12">
        {/* 4. Ultimate Love Counter Ticker */}
        <LoveCounter
          partner1={coupleData.partner1}
          partner2={coupleData.partner2}
          anniversaryDate={coupleData.anniversaryDate}
          onUpdateCouple={handleUpdateCouple}
          themeMode={themeMode}
        />

        {/* 5. Relationship Milestone Timeline */}
        <RelationshipTimeline themeMode={themeMode} />

        {/* 5.5 AI Love Letter Generator */}
        <LoveLetterGenerator themeMode={themeMode} />

        {/* 6. Shared Media Gallery */}
        <SharedGallery themeMode={themeMode} />

        {/* 7. Interactive World Map (Dream Destinations) */}
        <WorldMap themeMode={themeMode} />

        {/* 8. Interactive Mini-Games Suite */}
        <ArcadeSuite
          themeMode={themeMode}
          onUnlockSecretLetter={() => {
            setIsUnlockedByQuiz(true);
            setIsPasscodeGateOpen(true);
          }}
        />

        {/* 9. Daily Spin Wheel of Romantic Rewards */}
        <DailySpinWheel
          themeMode={themeMode}
          claimedCoupons={claimedCoupons}
          onClaimCoupon={handleClaimCoupon}
          isCouponsModalOpen={isCouponsModalOpen}
          onCloseCouponsModal={() => setIsCouponsModalOpen(false)}
        />

        {/* 10. Personalized Cinematic Love Message (Ending) */}
        <CinematicEnding
          partner1={coupleData.partner1}
          partner2={coupleData.partner2}
        />
      </main>

      {/* Sticky Atmospheric Audio Player */}
      <AudioPlayer />

      {/* Secret Passcode Gate Modal */}
      <PasscodeGate
        isOpen={isPasscodeGateOpen}
        onClose={() => setIsPasscodeGateOpen(false)}
        isUnlockedByQuiz={isUnlockedByQuiz}
      />

      {/* Secret Floating Notes Modal */}
      <FloatingNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
      />

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-rose-500/15 text-center text-xs text-slate-400 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3">
          <div
            onClick={handleLogoTap}
            className="flex items-center gap-2 cursor-pointer group"
            title="Tap 5 times for a secret easter egg surprise!"
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 group-hover:scale-125 transition-transform animate-heartbeat" />
            <span className="font-serif font-bold text-slate-200">
              {coupleData.partner1} & {coupleData.partner2}
            </span>
          </div>

          <p className="font-light max-w-sm">
            Crafted with unconditional love, glassmorphic elegance, and eternal memories.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => { sounds.playClick(); setIsNotesModalOpen(true); }}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
            >
              <Mail className="w-3.5 h-3.5" /> Hidden Notes
            </button>
            <span>•</span>
            <button
              onClick={() => { sounds.playClick(); setIsPasscodeGateOpen(true); }}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" /> Secret Vault
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
